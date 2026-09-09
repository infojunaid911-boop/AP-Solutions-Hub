-- Inquiries admin notes, review visibility, RLS tightening, storage, and public content seed.

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- Columns
-- ---------------------------------------------------------------------------
alter table public.inquiries
  add column if not exists admin_notes text;

alter table public.reviews
  add column if not exists active boolean not null default true;

alter table public.packages
  add column if not exists display_order integer not null default 0;

create unique index if not exists packages_category_name_idx
  on public.packages (service_category, package_name);

create unique index if not exists services_name_idx
  on public.services (name);

-- ---------------------------------------------------------------------------
-- Inquiry submission (rate-limited). Runs as owner so anon never needs SELECT.
-- ---------------------------------------------------------------------------
create or replace function private.submit_inquiry(
  p_name text,
  p_business_name text,
  p_email text,
  p_whatsapp text,
  p_service text,
  p_budget text,
  p_message text
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_id uuid;
  recent_count integer;
  name_clean text := trim(p_name);
  business_clean text := trim(p_business_name);
  email_clean text := lower(trim(p_email));
  whatsapp_clean text := trim(p_whatsapp);
  service_clean text := trim(p_service);
  budget_clean text := trim(p_budget);
  message_clean text := trim(p_message);
begin
  if name_clean is null or char_length(name_clean) < 2 or char_length(name_clean) > 120 then
    raise exception 'Please enter a valid full name.';
  end if;
  if business_clean is null or char_length(business_clean) < 2 or char_length(business_clean) > 160 then
    raise exception 'Please enter a valid business name.';
  end if;
  if email_clean is null or email_clean !~ '^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$' or char_length(email_clean) > 160 then
    raise exception 'Please enter a valid email address.';
  end if;
  if whatsapp_clean is null or char_length(regexp_replace(whatsapp_clean, '[^0-9+]', '', 'g')) < 8 or char_length(whatsapp_clean) > 30 then
    raise exception 'Please enter a valid WhatsApp number.';
  end if;
  if service_clean is null or char_length(service_clean) < 2 or char_length(service_clean) > 80 then
    raise exception 'Please select a service.';
  end if;
  if budget_clean is null or char_length(budget_clean) < 2 or char_length(budget_clean) > 80 then
    raise exception 'Please select a budget range.';
  end if;
  if message_clean is null or char_length(message_clean) < 20 or char_length(message_clean) > 4000 then
    raise exception 'Please describe your project in at least 20 characters.';
  end if;

  select count(*) into recent_count
  from public.inquiries
  where lower(email) = email_clean
    and created_at > now() - interval '15 minutes';

  if recent_count >= 3 then
    raise exception 'Too many inquiries from this email. Please wait a few minutes.';
  end if;

  insert into public.inquiries (
    name, business_name, email, whatsapp, service, budget, message, status, admin_notes
  ) values (
    name_clean, business_clean, email_clean, whatsapp_clean, service_clean, budget_clean, message_clean, 'new', null
  )
  returning id into new_id;

  return new_id;
end;
$$;

create or replace function public.submit_inquiry(
  p_name text,
  p_business_name text,
  p_email text,
  p_whatsapp text,
  p_service text,
  p_budget text,
  p_message text
) returns uuid
language sql
security definer
set search_path = public
as $$
  select private.submit_inquiry(
    p_name, p_business_name, p_email, p_whatsapp, p_service, p_budget, p_message
  );
$$;

revoke all on function public.submit_inquiry(text, text, text, text, text, text, text) from public;
grant execute on function public.submit_inquiry(text, text, text, text, text, text, text) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Privileges: anon must not read inquiries (including admin_notes)
-- ---------------------------------------------------------------------------
revoke all on table public.inquiries from anon, public;
grant insert (name, business_name, email, whatsapp, service, budget, message) on table public.inquiries to anon;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
drop policy if exists "Anyone can submit inquiries" on public.inquiries;
create policy "Anyone can submit inquiries"
  on public.inquiries
  for insert
  to anon, authenticated
  with check (
    status = 'new'::inquiry_status
    and admin_notes is null
  );

drop policy if exists "Public can view featured reviews" on public.reviews;
drop policy if exists "Public can view active reviews" on public.reviews;
create policy "Public can view active reviews"
  on public.reviews
  for select
  to anon, authenticated
  using (active = true);

-- ---------------------------------------------------------------------------
-- Realtime for new-query badge
-- ---------------------------------------------------------------------------
alter table public.inquiries replica identity full;

do $$
begin
  alter publication supabase_realtime add table public.inquiries;
exception
  when duplicate_object then null;
end $$;

-- ---------------------------------------------------------------------------
-- Storage: review images (public URLs; listing still requires auth)
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'review-images',
  'review-images',
  true,
  5242880,
  array['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Admins can upload review images" on storage.objects;
drop policy if exists "Admins can update review images" on storage.objects;
drop policy if exists "Admins can delete review images" on storage.objects;
drop policy if exists "Admins can select review images" on storage.objects;

create policy "Admins can upload review images"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'review-images'
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can update review images"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'review-images'
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  )
  with check (
    bucket_id = 'review-images'
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can delete review images"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'review-images'
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can select review images"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'review-images'
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ---------------------------------------------------------------------------
-- Seed services (matches existing public section)
-- ---------------------------------------------------------------------------
insert into public.services (name, slug, description, icon, featured, active, display_order)
values
  ('Digital Marketing', 'digital-marketing', 'Grow your audience and reach more customers.', 'Megaphone', true, true, 1),
  ('Website Development', 'website-development', 'Modern, fast and professional websites built for your business.', 'Globe', true, true, 2),
  ('Dashboard Development', 'dashboard-development', 'Turn complex business data into clear and powerful insights.', 'LayoutDashboard', true, true, 3),
  ('3D Architecture', '3d-architecture', 'Realistic architectural visualization and professional 3D concepts.', 'Boxes', true, true, 4),
  ('Graphic Design', 'graphic-design', 'Branding, marketing materials and creative visual design.', 'PenTool', true, true, 5),
  ('Social Media Management', 'social-media-management', 'Content and strategy designed to build your online presence.', 'Share2', true, true, 6)
on conflict (name) do nothing;

-- ---------------------------------------------------------------------------
-- Seed packages (matches existing public section)
-- ---------------------------------------------------------------------------
insert into public.packages (service_category, package_name, description, features, price_label, featured, active, display_order)
values
  ('Website', 'Starter', 'For businesses getting started.', '["Up to 5 pages","Mobile-responsive design","Basic on-page SEO","2 rounds of revisions"]'::jsonb, 'Starting From', false, true, 1),
  ('Website', 'Business', 'For growing businesses.', '["Up to 12 pages","Custom UI/UX design","SEO optimization & analytics setup","Priority support & 4 revisions"]'::jsonb, 'Starting From', true, true, 2),
  ('Website', 'Premium', 'For businesses needing a complete custom solution.', '["Fully custom architecture","Advanced integrations & automations","Dedicated project strategist","Ongoing optimization support"]'::jsonb, 'Request Custom Quote', false, true, 3),
  ('Marketing', 'Starter', 'For businesses getting started.', '["Single-channel campaign setup","Monthly performance report","Basic audience targeting","Email support"]'::jsonb, 'Starting From', false, true, 1),
  ('Marketing', 'Business', 'For growing businesses.', '["Multi-channel campaign management","Weekly optimization & reporting","Advanced audience segmentation","Priority support"]'::jsonb, 'Starting From', true, true, 2),
  ('Marketing', 'Premium', 'For businesses needing a complete custom solution.', '["Full-funnel strategy & execution","Dedicated marketing strategist","Custom reporting dashboard","Continuous testing & scaling"]'::jsonb, 'Request Custom Quote', false, true, 3),
  ('Design', 'Starter', 'For businesses getting started.', '["Logo & core brand assets","Basic style guide","2 rounds of revisions","Source files included"]'::jsonb, 'Starting From', false, true, 1),
  ('Design', 'Business', 'For growing businesses.', '["Full brand identity system","Marketing & social templates","Extended style guide","Priority support & 4 revisions"]'::jsonb, 'Starting From', true, true, 2),
  ('Design', 'Premium', 'For businesses needing a complete custom solution.', '["Complete brand ecosystem","Packaging & environmental design","Dedicated brand strategist","Ongoing design support"]'::jsonb, 'Request Custom Quote', false, true, 3),
  ('Dashboard', 'Starter', 'For businesses getting started.', '["Single dashboard","Up to 5 data visualizations","Basic user roles","Email support"]'::jsonb, 'Starting From', false, true, 1),
  ('Dashboard', 'Business', 'For growing businesses.', '["Multi-dashboard system","Custom data visualizations","Advanced user permissions","Priority support"]'::jsonb, 'Starting From', true, true, 2),
  ('Dashboard', 'Premium', 'For businesses needing a complete custom solution.', '["Enterprise-grade architecture","Real-time data integrations","Dedicated engineering support","Ongoing scaling & maintenance"]'::jsonb, 'Request Custom Quote', false, true, 3),
  ('3D Architecture', 'Starter', 'For businesses getting started.', '["Up to 3 rendered views","Standard lighting & materials","2 rounds of revisions","Digital delivery"]'::jsonb, 'Starting From', false, true, 1),
  ('3D Architecture', 'Business', 'For growing businesses.', '["Up to 8 rendered views","Custom materials & lighting studies","Walkthrough animation add-on","Priority support & 4 revisions"]'::jsonb, 'Starting From', true, true, 2),
  ('3D Architecture', 'Premium', 'For businesses needing a complete custom solution.', '["Full project visualization suite","Interactive 3D walkthroughs","Dedicated visualization artist","Ongoing revisions & support"]'::jsonb, 'Request Custom Quote', false, true, 3)
on conflict (service_category, package_name) do nothing;

-- ---------------------------------------------------------------------------
-- Seed reviews so the public site has content immediately
-- ---------------------------------------------------------------------------
insert into public.reviews (client_name, company, rating, review, featured, active)
select * from (
  values
    ('Daniyal Ahmed', 'Founder, Coastline Restaurant Group', 5::numeric, 'AP Solutions Hub rebuilt our site in weeks, not months. Reservations went up almost immediately and the team never made us chase an update.', true, true),
    ('Sara Malik', 'Operations Lead, Northline Logistics', 5::numeric, 'The dashboard they built finally gave us one place to see fleet performance. Our managers check it every morning now — it''s just part of how we run.', true, true),
    ('Bilal Farooq', 'Owner, Summit Construction', 5::numeric, 'Communication was the difference. Every question got a same-day answer, and the finished website actually looks like the company we''ve built.', false, true),
    ('Ayesha Raza', 'Marketing Director, Pulse Retail', 4::numeric, 'Our campaign engagement grew across every channel within the first month. The team adjusted strategy quickly whenever the data called for it.', false, true),
    ('Omar Sheikh', 'Principal, Harborview Developments', 5::numeric, 'The 3D renders sold units before we broke ground. Clients could actually see the building, and that made every sales conversation easier.', true, true),
    ('Hina Qureshi', 'Founder, Verdant Foods', 5::numeric, 'They gave us a brand identity that finally matched the quality of our product. Retail buyers noticed the difference in our first pitch meeting.', false, true)
) as seed(client_name, company, rating, review, featured, active)
where not exists (select 1 from public.reviews limit 1);

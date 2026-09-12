-- Guarantees admin (authenticated + profiles.role = 'admin') read/update
-- access to inquiries. The Customer Inquiry Management feature (admin
-- /admin/queries page, status/notes updates, and the realtime "new query"
-- sidebar badge) depends on this. Written to be safe to run whether or not
-- equivalent policies already exist from earlier setup.

alter table public.inquiries enable row level security;

drop policy if exists "Admins can view all inquiries" on public.inquiries;
create policy "Admins can view all inquiries"
  on public.inquiries
  for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

drop policy if exists "Admins can update inquiries" on public.inquiries;
create policy "Admins can update inquiries"
  on public.inquiries
  for update
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- ============================================================
-- PROPOSED MIGRATION — NOT APPLIED
-- ============================================================
-- This file was NOT run against your database. Per the brief for this
-- part, no table is created automatically. Review it, adjust it to match
-- your actual RLS conventions (the admin-check below assumes the same
-- shape as your other policies: profiles.role = 'admin'), and apply it
-- yourself with `supabase db push` / the SQL editor when you're ready.
--
-- Why a table is the right call here, and not something simpler:
--   - Editing lib/whatsapp.ts or Footer.tsx directly is *not* really
--     "settings" — it requires a code deploy for every change, which
--     defeats the point of an admin-editable settings page.
--   - There's nowhere in an existing table to put this data — it isn't
--     shaped like a row of packages/reviews/services, it's one set of
--     site-wide values.
--   - A single-row config table is the standard, low-risk pattern for
--     this: cheap to add, easy to reason about, trivial to back out.
--
-- Two shapes were considered:
--   A) One row, one column per setting (below) — simplest to query and
--      to type in TypeScript; adding a new setting later is a small
--      ALTER TABLE.
--   B) A generic key/value table (setting_key text primary key,
--      setting_value text) — more flexible, but every value comes back
--      untyped and the admin UI has to know which keys are booleans vs
--      URLs vs text, which pushes complexity into the app instead of
--      the schema. Not recommended here for a fixed, known list of
--      ~15 fields.
--
-- Going with (A) below.

create table if not exists public.site_settings (
  id boolean primary key default true,
  constraint site_settings_singleton check (id),

  -- Business Information
  business_name text,
  business_email text,
  business_whatsapp_number text,
  business_phone text,
  business_address text,
  business_website_url text,

  -- Social Media
  instagram_url text,
  facebook_url text,
  linkedin_url text,
  youtube_url text,
  tiktok_url text,

  -- WhatsApp
  whatsapp_number text,
  whatsapp_default_message text,
  whatsapp_button_enabled boolean not null default true,

  -- Website
  website_name text,
  website_description text,
  contact_email text,
  footer_copyright_text text,

  updated_at timestamptz not null default now()
);

-- Seed the single row so the app can always assume it exists.
insert into public.site_settings (id) values (true)
  on conflict (id) do nothing;

alter table public.site_settings enable row level security;

-- Public site needs to read these (WhatsApp button, footer, contact info).
create policy "site_settings_public_read"
  on public.site_settings for select
  using (true);

-- Writes restricted to admins — mirrors the profiles.role = 'admin' check
-- used elsewhere in this project (see assertAdmin()).
create policy "site_settings_admin_update"
  on public.site_settings for update
  using (exists (
    select 1 from public.profiles
    where profiles.id = auth.uid() and profiles.role = 'admin'
  ));

-- No insert/delete policy: the row is seeded once above and the app only
-- ever updates it, so no admin needs either permission.

export const SUPABASE_SCHEMA_SQL = `-- =====================================================================
-- Tehosmotr Bryansk — Supabase schema (DDL + RLS)
-- Apply in: Supabase Dashboard → SQL Editor → New query → Run
-- =====================================================================

-- Extensions ----------------------------------------------------------
create extension if not exists "pgcrypto";

-- =====================================================================
-- TABLE: bookings
-- =====================================================================
create table if not exists public.bookings (
  id               uuid primary key default gen_random_uuid(),
  created_at       timestamptz not null default now(),
  name             text not null,
  phone            text not null,
  vehicle_category text not null,
  plate_number     text,
  desired_date     date,
  desired_time     text,
  comment          text,
  status           text not null default 'new',
  admin_note       text
);

alter table public.bookings enable row level security;

drop policy if exists "Anyone can submit a booking" on public.bookings;
create policy "Anyone can submit a booking"
  on public.bookings for insert
  to public
  with check (true);

-- =====================================================================
-- TABLE: requests  (unified inbox for all site forms)
-- =====================================================================
create table if not exists public.requests (
  id               uuid primary key default gen_random_uuid(),
  created_at       timestamptz not null default now(),
  source_form      text not null default 'online_booking',
  name             text not null,
  phone            text not null,
  vehicle_category text,
  plate_number     text,
  desired_date     date,
  desired_time     text,
  comment          text,
  status           text not null default 'new',
  admin_note       text
);

alter table public.requests enable row level security;

drop policy if exists "Anyone can submit a request" on public.requests;
create policy "Anyone can submit a request"
  on public.requests for insert
  to public
  with check (true);

-- =====================================================================
-- TABLE: prices
-- =====================================================================
create table if not exists public.prices (
  id            uuid primary key default gen_random_uuid(),
  category_code text not null,
  category_name text not null,
  description   text not null default '',
  details       text not null default '',
  price_rub     integer not null default 0,
  updated_at    timestamptz not null default now(),
  updated_by    text
);

alter table public.prices enable row level security;

drop policy if exists "Anyone can read prices" on public.prices;
create policy "Anyone can read prices"
  on public.prices for select
  to public
  using (true);

-- =====================================================================
-- TABLE: notification_emails
-- =====================================================================
create table if not exists public.notification_emails (
  id         uuid primary key default gen_random_uuid(),
  email      text not null,
  is_active  boolean not null default true,
  created_at timestamptz not null default now()
);

create unique index if not exists notification_emails_email_key
  on public.notification_emails (lower(email));

alter table public.notification_emails enable row level security;

drop policy if exists "Anyone can read notification_emails" on public.notification_emails;
create policy "Anyone can read notification_emails"
  on public.notification_emails for select
  to public
  using (true);

-- =====================================================================
-- TABLE: seo_locations  (district pages + static-route metadata)
-- =====================================================================
create table if not exists public.seo_locations (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique,
  location_name   text not null,
  h1              text not null,
  seo_title       text not null,
  seo_description text not null,
  seo_text        text not null default '',
  intro_text      text not null default '',
  keywords        text not null default '',
  page_type       text not null default 'district',
  route_path      text,
  sort_order      integer not null default 0,
  is_active       boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

alter table public.seo_locations enable row level security;

drop policy if exists "Anyone can read active seo_locations" on public.seo_locations;
create policy "Anyone can read active seo_locations"
  on public.seo_locations for select
  to public
  using (true);

-- =====================================================================
-- Notes
-- =====================================================================
-- • Admin write access is intentionally NOT granted via RLS.
--   All writes (INSERT/UPDATE/DELETE on prices, seo_locations,
--   notification_emails, requests management) go through Edge Functions
--   using the service-role key + custom HMAC admin auth.
-- • To migrate data, export rows from the source project (CSV / pg_dump
--   --data-only) and import into the new project after running this DDL.
`;

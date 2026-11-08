-- ============================================================================
-- 0004 · Leads inbox, media library, site settings, page views
-- ============================================================================

-- Leads -----------------------------------------------------------------------
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  type public.lead_type not null default 'contact',
  name text not null check (char_length(name) between 2 and 120),
  email text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  phone text,
  company text,
  subject text,
  message text check (message is null or char_length(message) <= 5000),
  budget text,
  service_id uuid references public.services (id) on delete set null,
  course_id uuid references public.courses (id) on delete set null,
  source text,
  metadata jsonb not null default '{}'::jsonb,
  status public.lead_status not null default 'new',
  notes text,
  assigned_to uuid references public.profiles (id) on delete set null,
  ip_hash text,
  user_agent text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists leads_status_created_idx on public.leads (status, created_at desc);
create index if not exists leads_type_idx on public.leads (type);
create index if not exists leads_email_idx on public.leads (lower(email));

drop trigger if exists leads_set_updated_at on public.leads;
create trigger leads_set_updated_at
  before update on public.leads
  for each row execute function public.set_updated_at();

-- Media library ---------------------------------------------------------------
create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  bucket text not null default 'media',
  path text not null,
  url text not null,
  alt text,
  folder text not null default 'uploads',
  mime_type text,
  size_bytes bigint,
  width integer,
  height integer,
  uploaded_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (bucket, path)
);

create index if not exists media_folder_idx on public.media (folder, created_at desc);

drop trigger if exists media_set_updated_at on public.media;
create trigger media_set_updated_at
  before update on public.media
  for each row execute function public.set_updated_at();

-- Settings (key/value jsonb) --------------------------------------------------
create table if not exists public.settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value jsonb not null default '{}'::jsonb,
  updated_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.settings is 'Site-wide settings. Keys: contact, socials, seo, homepage, announcement, about, careers, legal, pricing.';

drop trigger if exists settings_set_updated_at on public.settings;
create trigger settings_set_updated_at
  before update on public.settings
  for each row execute function public.set_updated_at();

-- Page views (lightweight first-party analytics) -----------------------------
create table if not exists public.page_views (
  id bigint generated always as identity primary key,
  path text not null,
  referrer text,
  country text,
  device text,
  session_hash text,
  created_at timestamptz not null default now()
);

create index if not exists page_views_created_idx on public.page_views (created_at desc);
create index if not exists page_views_path_idx on public.page_views (path);

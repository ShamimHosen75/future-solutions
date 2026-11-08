-- ============================================================================
-- 0003 · Content tables
-- Convention: id uuid, slug, sort_order, is_published, created_at, updated_at
-- ============================================================================

-- Services --------------------------------------------------------------------
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  short_description text not null,
  description text,
  icon text,
  cover_image text,
  features jsonb not null default '[]'::jsonb,
  process_steps jsonb not null default '[]'::jsonb,
  deliverables jsonb not null default '[]'::jsonb,
  tech_stack jsonb not null default '[]'::jsonb,
  faqs jsonb not null default '[]'::jsonb,
  starting_price numeric(12,2),
  price_currency text not null default 'BDT',
  seo_title text,
  seo_description text,
  is_featured boolean not null default false,
  sort_order integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Clients & partners ----------------------------------------------------------
create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  logo_url text,
  website_url text,
  industry text,
  type public.client_type not null default 'client',
  is_featured boolean not null default false,
  sort_order integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Team ------------------------------------------------------------------------
create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  role text not null,
  bio text,
  avatar_url text,
  socials jsonb not null default '{}'::jsonb,
  skills jsonb not null default '[]'::jsonb,
  is_featured boolean not null default false,
  sort_order integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Products (own apps) ---------------------------------------------------------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  tagline text,
  description text,
  cover_image text,
  gallery jsonb not null default '[]'::jsonb,
  features jsonb not null default '[]'::jsonb,
  tech_stack jsonb not null default '[]'::jsonb,
  pricing_model text,
  price numeric(12,2),
  price_currency text not null default 'BDT',
  demo_url text,
  website_url text,
  app_store_url text,
  play_store_url text,
  status public.product_status not null default 'live',
  seo_title text,
  seo_description text,
  is_featured boolean not null default false,
  sort_order integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Projects / case studies -----------------------------------------------------
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  client_name text,
  client_id uuid references public.clients (id) on delete set null,
  service_id uuid references public.services (id) on delete set null,
  industry text,
  year integer check (year is null or year between 2000 and 2100),
  summary text not null,
  challenge text,
  solution text,
  results text,
  cover_image text,
  gallery jsonb not null default '[]'::jsonb,
  tech_stack jsonb not null default '[]'::jsonb,
  metrics jsonb not null default '[]'::jsonb,
  live_url text,
  seo_title text,
  seo_description text,
  is_featured boolean not null default false,
  sort_order integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Pricing plans ---------------------------------------------------------------
create table if not exists public.pricing_plans (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  category text not null default 'web',
  price_monthly numeric(12,2),
  price_yearly numeric(12,2),
  price_one_time numeric(12,2),
  currency text not null default 'BDT',
  features jsonb not null default '[]'::jsonb,
  limits jsonb not null default '{}'::jsonb,
  cta_label text not null default 'Get started',
  cta_href text not null default '/contact?intent=quote',
  is_popular boolean not null default false,
  sort_order integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Courses (IT institute) ------------------------------------------------------
create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  short_description text not null,
  description text,
  cover_image text,
  level public.course_level not null default 'beginner',
  format public.course_format not null default 'hybrid',
  duration_weeks integer check (duration_weeks is null or duration_weeks > 0),
  price numeric(12,2),
  discount_price numeric(12,2),
  currency text not null default 'BDT',
  curriculum jsonb not null default '[]'::jsonb,
  outcomes jsonb not null default '[]'::jsonb,
  prerequisites jsonb not null default '[]'::jsonb,
  batches jsonb not null default '[]'::jsonb,
  instructor_id uuid references public.team_members (id) on delete set null,
  seo_title text,
  seo_description text,
  is_featured boolean not null default false,
  sort_order integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Testimonials ----------------------------------------------------------------
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  author_name text not null,
  author_role text,
  author_company text,
  author_avatar text,
  author_email text,
  client_id uuid references public.clients (id) on delete set null,
  content text not null check (char_length(content) between 10 and 2000),
  rating smallint not null default 5 check (rating between 1 and 5),
  source text,
  is_approved boolean not null default false,
  is_featured boolean not null default false,
  sort_order integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Blog posts ------------------------------------------------------------------
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text,
  content text,
  cover_image text,
  author_id uuid references public.team_members (id) on delete set null,
  tags jsonb not null default '[]'::jsonb,
  reading_time integer,
  published_at timestamptz,
  seo_title text,
  seo_description text,
  is_featured boolean not null default false,
  sort_order integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Indexes ---------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array['services','clients','team_members','products','projects','pricing_plans','courses','testimonials','blog_posts']
  loop
    execute format('create index if not exists %I on public.%I (is_published, sort_order)', t || '_published_order_idx', t);
  end loop;
end $$;

create index if not exists projects_client_id_idx on public.projects (client_id);
create index if not exists projects_service_id_idx on public.projects (service_id);
create index if not exists testimonials_approved_idx on public.testimonials (is_approved, is_published);
create index if not exists blog_posts_published_at_idx on public.blog_posts (published_at desc);

-- Triggers --------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array['services','clients','team_members','products','projects','pricing_plans','courses','testimonials','blog_posts']
  loop
    execute format('drop trigger if exists %I on public.%I', t || '_set_updated_at', t);
    execute format('create trigger %I before update on public.%I for each row execute function public.set_updated_at()', t || '_set_updated_at', t);

    execute format('drop trigger if exists %I on public.%I', t || '_ensure_slug', t);
    execute format('create trigger %I before insert or update on public.%I for each row execute function public.ensure_unique_slug()', t || '_ensure_slug', t);

    execute format('drop trigger if exists %I on public.%I', t || '_default_sort', t);
    execute format('create trigger %I before insert on public.%I for each row execute function public.set_default_sort_order()', t || '_default_sort', t);
  end loop;
end $$;

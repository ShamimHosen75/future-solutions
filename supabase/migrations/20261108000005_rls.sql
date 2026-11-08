-- ============================================================================
-- 0005 · Row Level Security
--   anon / authenticated visitors : SELECT published rows
--                                   INSERT leads, INSERT testimonials (unapproved)
--   editors                       : manage content + media
--   admins                        : everything
-- ============================================================================

-- Enable RLS everywhere --------------------------------------------------------
alter table public.profiles       enable row level security;
alter table public.services       enable row level security;
alter table public.products       enable row level security;
alter table public.projects       enable row level security;
alter table public.pricing_plans  enable row level security;
alter table public.courses        enable row level security;
alter table public.clients        enable row level security;
alter table public.testimonials   enable row level security;
alter table public.team_members   enable row level security;
alter table public.leads          enable row level security;
alter table public.media          enable row level security;
alter table public.settings       enable row level security;
alter table public.blog_posts     enable row level security;
alter table public.page_views     enable row level security;

-- Profiles --------------------------------------------------------------------
drop policy if exists "profiles: read own or admin" on public.profiles;
create policy "profiles: read own or admin" on public.profiles
  for select to authenticated
  using (id = (select auth.uid()) or public.is_admin());

drop policy if exists "profiles: update own basic fields" on public.profiles;
create policy "profiles: update own basic fields" on public.profiles
  for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- Non-admins may edit their own profile but never their role / active flag.
create or replace function public.prevent_role_escalation()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (new.role is distinct from old.role or new.is_active is distinct from old.is_active)
     and not public.is_admin() then
    raise exception 'Only admins can change roles or deactivate users' using errcode = '42501';
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_prevent_role_escalation on public.profiles;
create trigger profiles_prevent_role_escalation
  before update on public.profiles
  for each row execute function public.prevent_role_escalation();

drop policy if exists "profiles: admin manages all" on public.profiles;
create policy "profiles: admin manages all" on public.profiles
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Generic content policies ----------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array['services','products','projects','pricing_plans','courses','clients','team_members','blog_posts']
  loop
    execute format('drop policy if exists %I on public.%I', t || ': public reads published', t);
    execute format(
      'create policy %I on public.%I for select to anon, authenticated using (is_published = true or public.is_editor_or_admin())',
      t || ': public reads published', t
    );

    execute format('drop policy if exists %I on public.%I', t || ': editors manage', t);
    execute format(
      'create policy %I on public.%I for all to authenticated using (public.is_editor_or_admin()) with check (public.is_editor_or_admin())',
      t || ': editors manage', t
    );
  end loop;
end $$;

-- Testimonials: public can read approved+published and submit unapproved -----
drop policy if exists "testimonials: public reads approved" on public.testimonials;
create policy "testimonials: public reads approved" on public.testimonials
  for select to anon, authenticated
  using ((is_published = true and is_approved = true) or public.is_editor_or_admin());

drop policy if exists "testimonials: public submits review" on public.testimonials;
create policy "testimonials: public submits review" on public.testimonials
  for insert to anon, authenticated
  with check (is_approved = false and is_published = false and is_featured = false);

drop policy if exists "testimonials: editors manage" on public.testimonials;
create policy "testimonials: editors manage" on public.testimonials
  for all to authenticated
  using (public.is_editor_or_admin())
  with check (public.is_editor_or_admin());

-- Leads: anyone can submit, only admins can read/manage ----------------------
-- NOTE: anon inserts must NOT use RETURNING / .select() — the new row is not
-- visible to anon under the SELECT policy, so Postgres rejects the statement.
drop policy if exists "leads: public submits" on public.leads;
create policy "leads: public submits" on public.leads
  for insert to anon, authenticated
  with check (status = 'new' and notes is null and assigned_to is null);

drop policy if exists "leads: admin manages" on public.leads;
create policy "leads: admin manages" on public.leads
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Media: editors manage, public reads (URLs are public anyway) ----------------
drop policy if exists "media: public reads" on public.media;
create policy "media: public reads" on public.media
  for select to anon, authenticated
  using (true);

drop policy if exists "media: editors manage" on public.media;
create policy "media: editors manage" on public.media
  for all to authenticated
  using (public.is_editor_or_admin())
  with check (public.is_editor_or_admin());

-- Settings: public reads, admin writes ---------------------------------------
drop policy if exists "settings: public reads" on public.settings;
create policy "settings: public reads" on public.settings
  for select to anon, authenticated
  using (true);

drop policy if exists "settings: admin manages" on public.settings;
create policy "settings: admin manages" on public.settings
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Page views: inserted by the service role only; admins read -----------------
drop policy if exists "page_views: admin reads" on public.page_views;
create policy "page_views: admin reads" on public.page_views
  for select to authenticated
  using (public.is_admin());

-- Grants (RLS still applies) --------------------------------------------------
grant usage on schema public to anon, authenticated;
grant select on all tables in schema public to anon, authenticated;
grant insert on public.leads, public.testimonials to anon, authenticated;
grant insert, update, delete on all tables in schema public to authenticated;
grant usage, select on all sequences in schema public to authenticated;

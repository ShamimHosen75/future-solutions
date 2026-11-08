-- ============================================================================
-- 0001 · Extensions, enums and shared helper functions
-- ============================================================================
create extension if not exists "pgcrypto" with schema extensions;
create extension if not exists "citext" with schema extensions;

-- Enums -----------------------------------------------------------------------
do $$ begin
  create type public.user_role as enum ('admin', 'editor');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.lead_type as enum ('contact', 'quote', 'enrollment', 'career', 'review', 'newsletter');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.lead_status as enum ('new', 'contacted', 'won', 'lost');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.product_status as enum ('live', 'beta', 'coming_soon');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.course_level as enum ('beginner', 'intermediate', 'advanced');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.course_format as enum ('online', 'offline', 'hybrid');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.client_type as enum ('client', 'partner');
exception when duplicate_object then null; end $$;

-- updated_at trigger ---------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- unaccent may not be installed on every plan; degrade gracefully.
create or replace function public.unaccent_safe(input text)
returns text
language plpgsql
immutable
set search_path = ''
as $$
begin
  return translate(input,
    'àáâãäåāçèéêëēìíîïīñòóôõöøōùúûüūýÿÀÁÂÃÄÅĀÇÈÉÊËĒÌÍÎÏĪÑÒÓÔÕÖØŌÙÚÛÜŪÝ',
    'aaaaaaaceeeeeiiiiinooooooouuuuuyyAAAAAAACEEEEEIIIIINOOOOOOOUUUUUY');
end;
$$;

-- Slug helper: lowercases, strips accents and non-alphanumerics -------------
create or replace function public.slugify(input text)
returns text
language sql
immutable
set search_path = ''
as $$
  select trim(both '-' from regexp_replace(lower(public.unaccent_safe(coalesce(input, ''))), '[^a-z0-9]+', '-', 'g'));
$$;

-- Auto-slug trigger.
--  * slug blank  → generated from title/name/author_name and suffixed (-2, -3…) until unique
--  * slug given  → normalised with slugify(); uniqueness is left to the UNIQUE constraint so
--                  `insert … on conflict (slug) do update` keeps working for upserts/seeds.
create or replace function public.ensure_unique_slug()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  base_slug text;
  candidate text;
  counter int := 1;
  source_text text;
  exists_already boolean;
begin
  if new.slug is not null and btrim(new.slug) <> '' then
    new.slug := coalesce(nullif(public.slugify(new.slug), ''), 'item');
    return new;
  end if;

  -- Pick the first available "title-like" column.
  source_text := coalesce(
    to_jsonb(new) ->> 'title',
    to_jsonb(new) ->> 'name',
    to_jsonb(new) ->> 'author_name',
    'item'
  );

  base_slug := coalesce(nullif(public.slugify(source_text), ''), 'item');
  candidate := base_slug;
  loop
    execute format(
      'select exists(select 1 from %I.%I where slug = $1 and id <> $2)',
      tg_table_schema, tg_table_name
    ) into exists_already using candidate, new.id;
    exit when not exists_already;
    counter := counter + 1;
    candidate := base_slug || '-' || counter;
  end loop;

  new.slug := candidate;
  return new;
end;
$$;

-- Default sort_order: append to the end of the table
create or replace function public.set_default_sort_order()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  max_order int;
begin
  if new.sort_order is null or new.sort_order = 0 then
    execute format('select coalesce(max(sort_order), 0) + 1 from %I.%I', tg_table_schema, tg_table_name)
      into max_order;
    new.sort_order := max_order;
  end if;
  return new;
end;
$$;

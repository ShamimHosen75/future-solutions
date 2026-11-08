-- ============================================================================
-- 0006 · Storage bucket "media" (public read, editor write)
-- ============================================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media',
  'media',
  true,
  10485760, -- 10 MB
  array['image/jpeg','image/png','image/webp','image/avif','image/gif','image/svg+xml','application/pdf','video/mp4']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "media bucket: public read" on storage.objects;
create policy "media bucket: public read" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'media');

drop policy if exists "media bucket: editors upload" on storage.objects;
create policy "media bucket: editors upload" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'media' and public.is_editor_or_admin());

drop policy if exists "media bucket: editors update" on storage.objects;
create policy "media bucket: editors update" on storage.objects
  for update to authenticated
  using (bucket_id = 'media' and public.is_editor_or_admin())
  with check (bucket_id = 'media' and public.is_editor_or_admin());

drop policy if exists "media bucket: editors delete" on storage.objects;
create policy "media bucket: editors delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'media' and public.is_editor_or_admin());

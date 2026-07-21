-- Private source originals for Route Materials. Extracted, bounded context remains
-- inside the owning interest in the local-first canvas document.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'skein-route-materials',
  'skein-route-materials',
  false,
  6291456,
  array['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Users can read their own Skein route materials"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'skein-route-materials'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

create policy "Users can upload their own Skein route materials"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'skein-route-materials'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

create policy "Users can update their own Skein route materials"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'skein-route-materials'
  and (storage.foldername(name))[1] = (select auth.uid())::text
)
with check (
  bucket_id = 'skein-route-materials'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

create policy "Users can delete their own Skein route materials"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'skein-route-materials'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

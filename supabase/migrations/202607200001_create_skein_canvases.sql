-- One evolving canvas document per authenticated Skein user.
-- The nested JSONB shape mirrors the local-first canvas and keeps Route Map
-- changes backwards compatible while the product model is still evolving.

create table if not exists public.skein_canvases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  document jsonb not null default '{"version":1,"nodes":[],"edges":[],"groups":{"customGroups":[],"emptyFrames":{},"labelOverrides":{}}}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint skein_canvases_user_id_key unique (user_id),
  constraint skein_canvases_document_object check (jsonb_typeof(document) = 'object')
);

create or replace function public.set_skein_canvas_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_skein_canvas_updated_at on public.skein_canvases;
create trigger set_skein_canvas_updated_at
before update on public.skein_canvases
for each row execute function public.set_skein_canvas_updated_at();

alter table public.skein_canvases enable row level security;

revoke all on table public.skein_canvases from anon;
grant select, insert, update, delete on table public.skein_canvases to authenticated;

create policy "Users can read their own Skein canvas"
on public.skein_canvases
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can create their own Skein canvas"
on public.skein_canvases
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users can update their own Skein canvas"
on public.skein_canvases
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users can delete their own Skein canvas"
on public.skein_canvases
for delete
to authenticated
using ((select auth.uid()) = user_id);

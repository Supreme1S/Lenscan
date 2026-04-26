-- Lenscan: enable RLS + anon CRUD policies for `favorites`.
-- Phase 1 keeps a global, public favorites list; Phase 4 will swap to per-user with auth.

alter table public.favorites enable row level security;

drop policy if exists "favorites_anon_select" on public.favorites;
drop policy if exists "favorites_anon_insert" on public.favorites;
drop policy if exists "favorites_anon_delete" on public.favorites;

create policy "favorites_anon_select"
  on public.favorites for select
  to anon
  using (true);

create policy "favorites_anon_insert"
  on public.favorites for insert
  to anon
  with check (true);

create policy "favorites_anon_delete"
  on public.favorites for delete
  to anon
  using (true);

create unique index if not exists favorites_wallet_address_unique
  on public.favorites (lower(wallet_address));

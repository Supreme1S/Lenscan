-- Lenscan: `favorites` table (run only in the dedicated Lenscan Supabase project — not EventX).
-- Apply via Supabase SQL Editor, or `supabase db push` if you use the Supabase CLI linked to this project.

create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id text,
  wallet_address text not null,
  label text,
  created_at timestamptz not null default now()
);

create index if not exists favorites_wallet_address_idx
  on public.favorites (wallet_address);

create index if not exists favorites_user_id_idx
  on public.favorites (user_id);

comment on table public.favorites is 'Lenscan MVP: bookmarked Sui wallet addresses';

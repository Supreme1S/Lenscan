import { createServerSupabase } from "@/lib/supabase/server";

export type FavoriteRow = {
  id: string;
  wallet_address: string;
  label: string | null;
  created_at: string;
};

/*
 * RLS (Phase 1 — global favorites for anon). Run in Supabase SQL editor if inserts/selects fail:
 *
 * alter table public.favorites enable row level security;
 *
 * create policy "favorites_anon_select"
 *   on public.favorites for select
 *   to anon
 *   using (true);
 *
 * create policy "favorites_anon_insert"
 *   on public.favorites for insert
 *   to anon
 *   with check (true);
 *
 * create policy "favorites_anon_delete"
 *   on public.favorites for delete
 *   to anon
 *   using (true);
 */

export async function getFavorites(): Promise<FavoriteRow[]> {
  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from("favorites")
    .select("id, wallet_address, label, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[Lenscan] getFavorites", error);
    throw new Error(`getFavorites failed: ${error.message}`);
  }

  return (data ?? []) as FavoriteRow[];
}

export async function addFavorite(
  walletAddress: string,
  label?: string,
): Promise<void> {
  const supabase = createServerSupabase();
  const { error } = await supabase.from("favorites").insert({
    wallet_address: walletAddress.trim(),
    label: label?.trim() ? label.trim() : null,
  });

  if (error) {
    console.error("[Lenscan] addFavorite", error);
    throw new Error(`addFavorite failed: ${error.message}`);
  }
}

export async function removeFavorite(id: string): Promise<void> {
  const supabase = createServerSupabase();
  const { error } = await supabase.from("favorites").delete().eq("id", id);

  if (error) {
    console.error("[Lenscan] removeFavorite", error);
    throw new Error(`removeFavorite failed: ${error.message}`);
  }
}

export function shortenWalletAddress(addr: string): string {
  const s = addr.trim();
  if (s.length <= 14) return s;
  return `${s.slice(0, 10)}…${s.slice(-8)}`;
}

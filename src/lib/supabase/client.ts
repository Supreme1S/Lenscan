import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

if (
  typeof window !== "undefined" &&
  (!process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
) {
  console.error(
    "[Lenscan] Supabase: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local (Lenscan-only project).",
  );
}

/**
 * Browser-side Supabase client for **Lenscan** (dedicated project; not EventX).
 */
export const supabase = createClient(url, anonKey);

/** Call before Supabase usage when env must be present (e.g. client components that query on mount). */
export function assertSupabaseEnv(): void {
  if (!url || !anonKey) {
    throw new Error(
      "Lenscan: missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. Copy .env.local.example to .env.local and add values from your Lenscan-only Supabase project.",
    );
  }
}

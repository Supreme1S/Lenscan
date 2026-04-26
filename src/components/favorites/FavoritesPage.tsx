import Link from "next/link";
import { deleteFavoriteForm } from "@/app/(routes)/favorites/actions";
import {
  getFavorites,
  shortenWalletAddress,
} from "@/lib/data/favorites";

function formatCreatedAt(iso: string): string {
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

export async function FavoritesPage() {
  let rows: Awaited<ReturnType<typeof getFavorites>> = [];
  let errorMessage: string | null = null;

  try {
    rows = await getFavorites();
  } catch (e) {
    errorMessage = e instanceof Error ? e.message : "Failed to load favorites";
    console.error("[Lenscan] FavoritesPage", e);
  }

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-slate-900">
          Favorites
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Saved wallet addresses (Supabase · Phase 1 · global list).
        </p>
      </div>

      {errorMessage ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {errorMessage}. Check env vars and RLS policies on{" "}
          <code className="rounded bg-amber-100/80 px-1">public.favorites</code>.
        </div>
      ) : null}

      {rows.length === 0 && !errorMessage ? (
        <p className="text-sm text-slate-600">
          No favorites yet. Add one from the Portfolio tab.
        </p>
      ) : null}

      {rows.length > 0 ? (
        <div className="overflow-x-auto rounded-xl border border-slate-200/90 bg-white/80 shadow-sm">
          <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
            <thead className="border-b border-slate-200/90 bg-slate-50/90">
              <tr>
                <th className="px-4 py-3 font-medium text-slate-600">
                  Address
                </th>
                <th className="px-4 py-3 font-medium text-slate-600">Label</th>
                <th className="px-4 py-3 font-medium text-slate-600">Added</th>
                <th className="px-4 py-3 font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80">
              {rows.map((row) => (
                <tr key={row.id}>
                  <td className="px-4 py-3 font-mono text-slate-900" title={row.wallet_address}>
                    {shortenWalletAddress(row.wallet_address)}
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    {row.label?.trim() ? row.label : (
                      <span className="text-slate-400">No label</span>
                    )}
                  </td>
                  <td className="px-4 py-3 tabular-nums text-slate-600">
                    {formatCreatedAt(row.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/portfolio?address=${encodeURIComponent(row.wallet_address)}`}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-800 hover:bg-slate-50"
                      >
                        View
                      </Link>
                      <form action={deleteFavoriteForm}>
                        <input type="hidden" name="id" value={row.id} />
                        <button
                          type="submit"
                          className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-800 hover:bg-red-100"
                        >
                          Remove
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}

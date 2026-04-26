import Link from "next/link";
import { deleteFavoriteForm } from "@/app/(routes)/favorites/actions";
import { AddFavoriteDialog } from "@/components/favorites/add-favorite-dialog";
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
    <div className="mx-auto max-w-[1440px] space-y-6 px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">
            Favorites
          </h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Stored in Supabase (`wallet_address` column). Net worth column is a stub.
          </p>
        </div>
        <AddFavoriteDialog />
      </div>

      {errorMessage ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-100">
          {errorMessage}. Check env and RLS on{" "}
          <code className="rounded bg-amber-100/80 px-1 dark:bg-amber-900/40">
            public.favorites
          </code>
          .
        </div>
      ) : null}

      {rows.length === 0 && !errorMessage ? (
        <p className="text-sm text-[var(--muted)]">No saved wallets yet.</p>
      ) : null}

      {rows.length > 0 ? (
        <div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--surface)]/80">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-[var(--border)] bg-[var(--surface-muted)]/80">
              <tr>
                <th className="px-4 py-3 font-medium text-[var(--muted)]">Label</th>
                <th className="px-4 py-3 font-medium text-[var(--muted)]">Address</th>
                <th className="px-4 py-3 font-medium text-[var(--muted)]">Net worth</th>
                <th className="px-4 py-3 font-medium text-[var(--muted)]">Added</th>
                <th className="px-4 py-3 font-medium text-[var(--muted)]" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {rows.map((row) => (
                <tr key={row.id}>
                  <td className="px-4 py-3 text-[var(--foreground)]">
                    {row.label?.trim() ? row.label : (
                      <span className="text-[var(--muted)]">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/portfolio?address=${encodeURIComponent(row.wallet_address)}`}
                      className="font-mono text-[var(--accent)] hover:underline"
                      title={row.wallet_address}
                    >
                      {shortenWalletAddress(row.wallet_address)}
                    </Link>
                  </td>
                  <td className="px-4 py-3 tabular-nums text-[var(--muted)]">—</td>
                  <td className="px-4 py-3 tabular-nums text-[var(--muted)]">
                    {formatCreatedAt(row.created_at)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <form action={deleteFavoriteForm} className="inline">
                      <input type="hidden" name="id" value={row.id} />
                      <button
                        type="submit"
                        className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-800 transition-colors hover:bg-red-100 active:scale-[0.98] dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200"
                      >
                        Remove
                      </button>
                    </form>
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

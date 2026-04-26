import { Card } from "@/components/ui/Card";
import type { FavoriteWallet } from "@/lib/types/portfolio";

export function FavoritesList({ items }: { items: FavoriteWallet[] }) {
  if (items.length === 0) {
    return (
      <Card>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">No saved wallets yet.</p>
      </Card>
    );
  }

  return (
    <ul className="space-y-3">
      {items.map((f) => (
        <li key={f.id}>
          <Card padding="p-4" className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-mono text-sm text-zinc-900 dark:text-zinc-50">
                {f.walletAddress}
              </p>
              {f.label ? (
                <p className="text-xs text-zinc-500 dark:text-zinc-400">{f.label}</p>
              ) : null}
            </div>
          </Card>
        </li>
      ))}
    </ul>
  );
}

import { Card } from "@/components/ui/Card";
import type { NftItem } from "@/lib/types/portfolio";

export function NftCollectionGrid({ items }: { items: NftItem[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((nft) => (
        <Card key={nft.id} padding="p-4" className="overflow-hidden">
          <div className="flex aspect-square items-center justify-center rounded-xl bg-gradient-to-br from-indigo-100/80 to-zinc-200/80 text-4xl dark:from-indigo-950/50 dark:to-zinc-800/80">
            ◆
          </div>
          <p className="mt-3 text-sm font-medium text-zinc-900 dark:text-zinc-50">{nft.name}</p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">{nft.collection}</p>
          {nft.floorHint ? (
            <p className="mt-2 text-xs tabular-nums text-zinc-600 dark:text-zinc-300">
              Floor {nft.floorHint}
            </p>
          ) : null}
        </Card>
      ))}
    </div>
  );
}

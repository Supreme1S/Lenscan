/* eslint-disable @next/next/no-img-element */
import { Card } from "@/components/ui/Card";
import type { NftItem } from "@/lib/types/portfolio";

export function NftCollectionGrid({ items }: { items: NftItem[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((nft) => (
        <Card key={nft.id} padding="p-4" className="overflow-hidden">
          <div className="flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-[var(--surface-muted)] text-3xl text-[var(--muted)]">
            {nft.imageUrl ? (
              <img
                src={nft.imageUrl}
                alt={nft.name}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            ) : (
              <span aria-hidden>◆</span>
            )}
          </div>
          <p className="mt-3 truncate text-sm font-medium text-[var(--foreground)]">
            {nft.name}
          </p>
          <p className="truncate text-xs text-[var(--muted)]">
            {nft.collection}
          </p>
          {nft.floorHint ? (
            <p className="mt-2 text-xs tabular-nums text-[var(--muted)]">
              Floor {nft.floorHint}
            </p>
          ) : null}
        </Card>
      ))}
    </div>
  );
}

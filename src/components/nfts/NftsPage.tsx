import { NftCollectionGrid } from "@/components/nfts/NftCollectionGrid";
import { mockNfts } from "@/lib/data/mock/nfts";

export function NftsPage() {
  return (
    <div className="space-y-6 p-6 lg:p-8">
      <p className="text-sm text-zinc-600 dark:text-zinc-300">
        Collections and media are placeholders until wallet + indexer are wired.
      </p>
      <NftCollectionGrid items={mockNfts} />
    </div>
  );
}

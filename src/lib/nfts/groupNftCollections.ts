import type { MockNft, MockNftCollection } from "@/data/mock-nfts";
import type { NftItem } from "@/lib/types/portfolio";

function collectionKey(name: string): string {
  return name.replace(/\s+/g, "-").toLowerCase().slice(0, 48) || "collection";
}

/**
 * Groups on-chain `NftItem` results into the collapsible collection shape the NFT tab expects.
 */
export function groupNftItems(items: NftItem[]): MockNftCollection[] {
  const map = new Map<string, MockNft[]>();

  for (const it of items) {
    const colName = it.collection.trim() || "Unknown";
    const list = map.get(colName) ?? [];
    const nft: MockNft = {
      id: it.id,
      name: it.name,
      collection: colName,
      imageUrl: it.imageUrl,
      imageEmoji: it.imageUrl ? undefined : "◆",
      floorUsd: null,
    };
    list.push(nft);
    map.set(colName, list);
  }

  return [...map.entries()].map(([name, nfts], idx) => ({
    id: `${collectionKey(name)}-${idx}`,
    name,
    items: nfts,
  }));
}

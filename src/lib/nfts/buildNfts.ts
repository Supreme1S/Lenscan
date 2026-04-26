/**
 * Phase 2: walk a Sui address's owned objects and surface the displayable ones
 * (the network calls them "NFTs" but really anything with a `display` block
 * counts here — game items, vouchers, kiosk items, etc.).
 *
 * Strategy:
 *   1. Page through suix_getOwnedObjects up to MAX_PAGES (we cap to keep the
 *      first paint snappy — browsing deep history is a future improvement).
 *   2. Drop pure coin types (`0x2::coin::Coin<...>`) and anything with no
 *      `display.data` block — those aren't user-facing NFTs.
 *   3. Map the rest to `NftItem`. We pull image + name + collection from the
 *      Sui Display standard's most common keys.
 */
import { getOwnedObjects, type OwnedObject } from "@/lib/sui/rpc";
import type { NftItem } from "@/lib/types/portfolio";

const MAX_PAGES = 4;
const PAGE_LIMIT = 50;
const COIN_TYPE_RE = /^0x2::coin::Coin</;

function ipfsToHttps(url: string): string {
  if (url.startsWith("ipfs://")) {
    return `https://ipfs.io/ipfs/${url.slice("ipfs://".length)}`;
  }
  return url;
}

function pickFirst(
  data: Record<string, string | undefined> | null | undefined,
  keys: string[],
): string | undefined {
  if (!data) return undefined;
  for (const k of keys) {
    const v = data[k];
    if (typeof v === "string" && v.trim() !== "") return v;
  }
  return undefined;
}

function collectionFromType(typeStr: string): string {
  // type looks like "0xPACKAGE::module::Name" — the module is a fine grouping label
  const parts = typeStr.split("::");
  if (parts.length >= 2) return parts[1] ?? typeStr;
  return typeStr;
}

function toNftItem(obj: OwnedObject): NftItem | null {
  const data = obj.data;
  if (!data) return null;
  const type = data.type ?? "";
  if (!type || COIN_TYPE_RE.test(type)) return null;
  const display = data.display?.data ?? null;
  if (!display) return null;

  const name =
    pickFirst(display, ["name", "title", "Name", "Reward"]) ??
    `Object ${data.objectId.slice(0, 8)}…`;
  const rawImage = pickFirst(display, [
    "image_url",
    "img_url",
    "image",
    "imageUrl",
    "media_url",
  ]);
  return {
    id: data.objectId,
    name,
    collection: pickFirst(display, ["creator", "project_url", "collection"]) ??
      collectionFromType(type),
    imageUrl: rawImage ? ipfsToHttps(rawImage) : undefined,
  };
}

export type RealNftsResult = {
  items: NftItem[];
  /** Total displayable objects reviewed across pages (before mapping). */
  scanned: number;
  /** True if we capped pagination — there may be more on chain. */
  truncated: boolean;
};

export async function fetchRealNfts(
  address: string,
  signal?: AbortSignal,
): Promise<RealNftsResult> {
  let cursor: string | null = null;
  let pages = 0;
  let scanned = 0;
  const items: NftItem[] = [];
  const seen = new Set<string>();
  let hasMore = true;

  while (hasMore && pages < MAX_PAGES) {
    const page = await getOwnedObjects(address, undefined, cursor, PAGE_LIMIT, {
      signal,
    });
    pages += 1;
    for (const obj of page.data) {
      scanned += 1;
      const mapped = toNftItem(obj);
      if (!mapped) continue;
      if (seen.has(mapped.id)) continue;
      seen.add(mapped.id);
      items.push(mapped);
    }
    cursor = page.nextCursor;
    hasMore = page.hasNextPage && cursor !== null;
  }

  return { items, scanned, truncated: hasMore };
}

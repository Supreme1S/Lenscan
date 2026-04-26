import { rpcCall } from "@/lib/sui/rpc";

export type CoinMetadata = {
  decimals: number;
  name: string;
  symbol: string;
  description: string;
  iconUrl: string | null;
  id: string;
};

/** Fetch coin metadata for many coin types in parallel. Failures resolve to null. */
export async function fetchCoinMetadataMany(
  coinTypes: string[],
  signal?: AbortSignal,
): Promise<Record<string, CoinMetadata | null>> {
  const result: Record<string, CoinMetadata | null> = {};
  await Promise.all(
    coinTypes.map(async (ct) => {
      try {
        const md = await rpcCall<CoinMetadata | null>(
          "suix_getCoinMetadata",
          [ct],
          { signal },
        );
        result[ct] = md ?? null;
      } catch {
        result[ct] = null;
      }
    }),
  );
  return result;
}

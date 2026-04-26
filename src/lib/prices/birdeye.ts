/**
 * Birdeye public API — fallback prices for Sui tokens not listed on DefiLlama.
 * https://docs.birdeye.so/
 */

import type { LlamaPriceMap } from "@/lib/prices/defiLlama";

const BASE = "https://public-api.birdeye.so/defi/multi_price";
const BATCH = 100;

type BirdeyeMultiPriceResponse = {
  data?: Record<string, { value: number; updateUnixTime: number } | undefined>;
};

/**
 * Fetches USD prices for Sui coin types (Move coin type strings).
 * Returns a map keyed like DefiLlama (`coinType` → `LlamaPrice` shape).
 * On any error or missing `BIRDEYE_API_KEY`, returns `{}`.
 */
export async function fetchBirdeyePrices(
  coinTypes: string[],
  signal?: AbortSignal,
): Promise<LlamaPriceMap> {
  const out: LlamaPriceMap = {};
  const apiKey = process.env.BIRDEYE_API_KEY?.trim();
  if (!apiKey || coinTypes.length === 0) {
    return out;
  }

  const unique = Array.from(new Set(coinTypes));

  try {
    for (let i = 0; i < unique.length; i += BATCH) {
      const slice = unique.slice(i, i + BATCH);
      const params = new URLSearchParams();
      params.set("list_address", slice.join(","));

      const res = await fetch(`${BASE}?${params.toString()}`, {
        signal,
        headers: {
          "X-API-KEY": apiKey,
          "x-chain": "sui",
        },
        cache: "no-store",
      });

      if (!res.ok) continue;

      const json = (await res.json()) as BirdeyeMultiPriceResponse;
      if (!json.data || typeof json.data !== "object") continue;

      for (const [addr, row] of Object.entries(json.data)) {
        if (row == null || typeof row.value !== "number") continue;
        out[addr] = {
          decimals: 0, // sentinel: unknown — defer to chain metadata in buildPortfolio
          symbol: "",
          price: row.value,
          timestamp:
            typeof row.updateUnixTime === "number"
              ? row.updateUnixTime * 1000
              : 0,
          confidence: 0,
        };
      }
    }
  } catch {
    return {};
  }

  return out;
}

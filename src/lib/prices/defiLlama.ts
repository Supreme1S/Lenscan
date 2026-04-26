/**
 * DefiLlama coins price source for Sui tokens.
 * One call returns price + decimals + symbol per coinType, batched.
 *
 * https://defillama.com/docs/api  →  /coins/prices/current/{coins}
 */

const LLAMA = "https://coins.llama.fi/prices/current";

export type LlamaPrice = {
  decimals: number;
  symbol: string;
  price: number;
  timestamp: number;
  /** 0..1 — DefiLlama's confidence on the price */
  confidence: number;
};

export type LlamaPriceMap = Record<string, LlamaPrice>;

const CHUNK = 80; // keep URL safe under ~8KB

function key(coinType: string): string {
  return `sui:${coinType}`;
}

/**
 * Fetch prices for all `coinTypes`. Returns a map keyed by raw coinType
 * (without the `sui:` prefix). Coins not priced are simply absent.
 */
export async function fetchSuiPrices(
  coinTypes: string[],
  signal?: AbortSignal,
): Promise<LlamaPriceMap> {
  const out: LlamaPriceMap = {};
  if (coinTypes.length === 0) return out;

  const unique = Array.from(new Set(coinTypes));
  for (let i = 0; i < unique.length; i += CHUNK) {
    try {
      const slice = unique.slice(i, i + CHUNK);
      const url = `${LLAMA}/${slice.map(key).join(",")}`;
      const res = await fetch(url, { signal, next: { revalidate: 60 } });
      if (!res.ok) continue;
      const json = (await res.json()) as { coins?: Record<string, LlamaPrice> };
      if (!json.coins) continue;
      for (const [k, v] of Object.entries(json.coins)) {
        const coinType = k.replace(/^sui:/, "");
        out[coinType] = v;
      }
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") throw e;
      continue;
    }
  }
  return out;
}

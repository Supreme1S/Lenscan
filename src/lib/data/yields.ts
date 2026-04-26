import type { YieldPool } from "@/lib/types/yields";

const LLAMA_URL = "https://yields.llama.fi/pools";

type LlamaPool = {
  pool: string;
  project: string;
  symbol: string;
  chain: string;
  tvlUsd: number | null;
  apy: number | null;
  apyBase: number | null;
  apyReward: number | null;
  stablecoin: boolean;
  ilRisk: string | null;
  exposure: string | null;
  poolMeta: string | null;
  underlyingTokens: string[] | null;
  category?: string | null;
};

/** Fetches Sui pools from DeFiLlama with 10-minute ISR. Never throws — returns []. */
export async function getSuiYields(): Promise<{
  pools: YieldPool[];
  error: string | null;
}> {
  try {
    // DeFiLlama /pools is ~18 MB which exceeds Next's data cache limit (2 MB).
    // We rely on page-level ISR (`revalidate = 600` on the route) instead of fetch caching.
    const res = await fetch(LLAMA_URL, { cache: "no-store" });
    if (!res.ok) {
      return { pools: [], error: `DeFiLlama ${res.status}` };
    }
    const json = (await res.json()) as { data?: LlamaPool[] };
    const all = json.data ?? [];
    const pools = all
      .filter((p) => p.chain?.toLowerCase() === "sui")
      .map<YieldPool>((p) => ({
        pool: p.pool,
        project: p.project,
        symbol: p.symbol,
        chain: p.chain,
        tvlUsd: p.tvlUsd,
        apy: p.apy,
        apyBase: p.apyBase,
        apyReward: p.apyReward,
        stablecoin: !!p.stablecoin,
        ilRisk: p.ilRisk,
        exposure: p.exposure,
        category:
          p.category ??
          (p.exposure === "single" ? "Lending / Single" : "LP / Multi"),
      }))
      .sort((a, b) => (b.tvlUsd ?? 0) - (a.tvlUsd ?? 0));
    return { pools, error: null };
  } catch (err) {
    return {
      pools: [],
      error: err instanceof Error ? err.message : "fetch failed",
    };
  }
}

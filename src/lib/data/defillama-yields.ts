export type DefillamaPool = {
  chain: string;
  project: string;
  symbol: string;
  tvlUsd: number;
  apy: number;
  pool: string;
  url?: string;
};

type DefillamaResponse = { data: DefillamaPool[] };

export async function fetchSuiYieldsPools(): Promise<DefillamaPool[]> {
  const res = await fetch("https://yields.llama.fi/pools", {
    next: { revalidate: 3600 },
  });
  if (!res.ok) {
    throw new Error(`DeFiLlama: ${res.status}`);
  }
  const json = (await res.json()) as DefillamaResponse;
  return json.data.filter(
    (p) => p.chain?.toLowerCase() === "sui" && p.tvlUsd > 0,
  );
}

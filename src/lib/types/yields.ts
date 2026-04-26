export type YieldPool = {
  /** DeFiLlama pool id (UUID-like) */
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
  category: string | null;
};

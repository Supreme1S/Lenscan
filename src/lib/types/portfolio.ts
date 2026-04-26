/** Shared domain types for on-chain portfolio builders and protocol adapters. */

export type PortfolioSummary = {
  walletAddress: string;
  netWorthUsd: string;
  totalTokensUsd: string;
  totalDefiUsd: string;
};

export type TokenHolding = {
  symbol: string;
  name: string;
  priceUsd: string;
  change24hPct: number | null;
  amount: string;
  valueUsd: number;
  valueUsdFormatted: string;
  allocationPct: number;
};

export type AllocationSlice = {
  label: "Native" | "Stable" | "Other";
  pct: number;
  color: string;
};

export type TransactionRow = {
  id: string;
  digest: string;
  kind: "send" | "receive" | "swap" | "other";
  timestamp: string;
  summary: string;
  status: "success" | "failed" | "pending";
};

export type NftItem = {
  id: string;
  name: string;
  collection: string;
  imageUrl?: string;
};

/** Placeholder for future protocol adapter results (Navi, Cetus, etc.). */
export type DefiPosition = {
  protocolId: string;
  kind: "lending" | "lp" | "staking" | "other";
  title: string;
  valueUsd: number;
};

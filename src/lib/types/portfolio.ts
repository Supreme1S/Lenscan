/** Shared Lenscan domain types (Phase 1 — mock-backed). */

export type PortfolioSummary = {
  walletAddress: string;
  netWorthUsd: string;
  totalTokensUsd: string;
  totalDefiUsd: string;
  /** When set, show optional Debt / Health card */
  debtUsd?: string;
  healthFactor?: string;
};

export type TokenHolding = {
  symbol: string;
  name: string;
  priceUsd: string;
  change24hPct: number | null;
  amount: string;
  /** Numeric USD for sorting */
  valueUsd: number;
  valueUsdFormatted: string;
  allocationPct: number;
  iconUrl?: string;
};

export type DefiPositionCategory =
  | "Supply"
  | "Borrow"
  | "LP"
  | "Staking"
  | "Other";

export type DefiPosition = {
  id: string;
  protocol: string;
  /** Used for filter bar */
  category: DefiPositionCategory;
  /** Display type label */
  type: string;
  asset: string;
  apyBasePct: number | null;
  apyRewardPct: number | null;
  amount: string;
  valueUsd: string;
  unclaimedUsd?: string;
  health?: string;
};

export type AllocationSlice = {
  label: string;
  pct: number;
  color: string;
};

export type ProtocolExposure = {
  id: string;
  name: string;
  valueUsd: string;
  sharePct: number;
};

export type TransactionRow = {
  id: string;
  digest: string;
  kind: "send" | "receive" | "swap" | "other";
  timestamp: string;
  summary: string;
  status: "success" | "pending" | "failed";
};

export type NftItem = {
  id: string;
  name: string;
  collection: string;
  imageUrl?: string;
  floorHint?: string;
};

export type FavoriteWallet = {
  id: string;
  walletAddress: string;
  label: string | null;
};

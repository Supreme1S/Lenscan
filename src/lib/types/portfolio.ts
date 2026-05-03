/** Shared domain types for on-chain portfolio builders and protocol adapters. */

export type DefiPositionSide =
  | "deposit"
  | "borrow"
  | "lp"
  | "staked"
  | "reward"
  | "long"
  | "short"
  | "other";

export type DefiPosition = {
  id: string; // unique per position, e.g. "navi-supply-USDC"
  protocolId: string; // machine id, e.g. "navi"
  protocolName: string; // display name, e.g. "NAVI Protocol"
  chainId: "sui";
  category: "lending" | "dex" | "staking" | "vault" | "perps" | "bridge" | "other";
  side: DefiPositionSide;
  title: string; // e.g. "Supply USDC"
  assetSymbol: string; // e.g. "USDC"
  valueUsd: number;
  details?: Record<string, unknown>; // optional protocol-specific extras
};

export type PortfolioSummary = {
  walletAddress: string;
  netWorthUsd: string;
  totalTokensUsd: string;
  totalDefiUsd: string;
};

export type TokenHolding = {
  /** Full Move coin type, e.g. `0x2::sui::SUI`. */
  coinType: string;
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
  /** Epoch ms when known (for sorting / absolute dates in UI). */
  timestampMs: number;
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

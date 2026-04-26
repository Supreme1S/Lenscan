import type {
  AllocationSlice,
  DefiPosition,
  PortfolioSummary,
  TokenHolding,
} from "@/lib/types/portfolio";

const summary: PortfolioSummary = {
  walletAddress:
    "0x7a3c8f2190abcd1234567890abcdef1234567890abcdef1234567890abcd",
  netWorthUsd: "$28,420.50",
  totalTokensUsd: "$23,860.50",
  totalDefiUsd: "$13,700.00",
  debtUsd: "$2,140.00",
  healthFactor: "1.42",
};

const tokenHoldings: TokenHolding[] = [
  {
    symbol: "SUI",
    name: "Sui",
    priceUsd: "$1.48",
    change24hPct: 2.4,
    amount: "12,450.2",
    valueUsd: 18420,
    valueUsdFormatted: "$18,420.00",
    allocationPct: 64.8,
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    priceUsd: "$1.00",
    change24hPct: 0,
    amount: "4,200.00",
    valueUsd: 4200,
    valueUsdFormatted: "$4,200.00",
    allocationPct: 14.8,
  },
  {
    symbol: "DEEP",
    name: "DeepBook",
    priceUsd: "$0.00139",
    change24hPct: -1.2,
    amount: "890,120",
    valueUsd: 1240.5,
    valueUsdFormatted: "$1,240.50",
    allocationPct: 4.4,
  },
  // sub-$1 dust to demo the low-value collapsible group
  {
    symbol: "NS",
    name: "SuiNS Token",
    priceUsd: "$0.082",
    change24hPct: 4.2,
    amount: "6.10",
    valueUsd: 0.5,
    valueUsdFormatted: "$0.50",
    allocationPct: 0,
  },
  {
    symbol: "CETUS",
    name: "Cetus Protocol",
    priceUsd: "$0.061",
    change24hPct: -3.1,
    amount: "4.30",
    valueUsd: 0.26,
    valueUsdFormatted: "$0.26",
    allocationPct: 0,
  },
  {
    symbol: "BLUE",
    name: "Bluefin",
    priceUsd: "$0.0091",
    change24hPct: -1.8,
    amount: "12.5",
    valueUsd: 0.11,
    valueUsdFormatted: "$0.11",
    allocationPct: 0,
  },
  {
    symbol: "WAL",
    name: "Walrus",
    priceUsd: "$0.0008",
    change24hPct: 0.4,
    amount: "60",
    valueUsd: 0.05,
    valueUsdFormatted: "$0.05",
    allocationPct: 0,
  },
];

const defiPositions: DefiPosition[] = [
  {
    id: "p1",
    protocol: "Navi",
    category: "Supply",
    type: "Supply",
    asset: "SUI",
    apyBasePct: 3.8,
    apyRewardPct: 0.4,
    amount: "5,200",
    valueUsd: "$7,696",
    unclaimedUsd: "$12.40",
    health: "—",
  },
  {
    id: "p2",
    protocol: "Navi",
    category: "Borrow",
    type: "Borrow",
    asset: "USDC",
    apyBasePct: 5.2,
    apyRewardPct: null,
    amount: "2,140",
    valueUsd: "$2,140",
    health: "1.42",
  },
  {
    id: "p3",
    protocol: "Cetus",
    category: "LP",
    type: "LP",
    asset: "SUI / USDC",
    apyBasePct: 10.2,
    apyRewardPct: 2.6,
    amount: "1.2 LP",
    valueUsd: "$3,100",
    unclaimedUsd: "$4.10",
  },
  {
    id: "p4",
    protocol: "Turbos",
    category: "Staking",
    type: "Staking",
    asset: "SUI",
    apyBasePct: 3.1,
    apyRewardPct: null,
    amount: "900",
    valueUsd: "$1,332",
  },
  {
    id: "p5",
    protocol: "DeepBook",
    category: "Other",
    type: "MM",
    asset: "Order liquidity",
    apyBasePct: null,
    apyRewardPct: null,
    amount: "—",
    valueUsd: "$450",
  },
];

const allocation: AllocationSlice[] = [
  { label: "Native", pct: 42, color: "#6366f1" },
  { label: "Stable", pct: 28, color: "#22c55e" },
  { label: "DeFi", pct: 22, color: "#f59e0b" },
  { label: "Other", pct: 8, color: "#94a3b8" },
];

export function getMockPortfolioSummary(): PortfolioSummary {
  return summary;
}

export function getMockTokenHoldings(): TokenHolding[] {
  return tokenHoldings;
}

export function getMockDefiPositions(): DefiPosition[] {
  return defiPositions;
}

export function getMockAllocation(): AllocationSlice[] {
  return allocation;
}

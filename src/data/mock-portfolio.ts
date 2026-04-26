/** Realistic mock portfolio for Sui (Phase 2). Replace with @mysten/sui queries later. */

export type MockTokenRow = {
  id: string;
  symbol: string;
  name: string;
  priceUsd: number;
  change24hPct: number;
  amount: number;
  valueUsd: number;
};

export type MockProtocolTile = {
  id: string;
  name: string;
  valueUsd: number;
  /** emoji or path placeholder — no image CDN in Phase 2 */
  logo: string;
  anchorId: string;
  /** When false, tile is hidden until "Show all" */
  isDust: boolean;
};

export type MockLendingRow = {
  asset: string;
  side: "Supplied" | "Borrowed";
  balance: string;
  valueUsd: number;
  apyPct: number | null;
  healthOrLtv: string;
};

export type MockLpRow = {
  pair: string;
  balance: string;
  valueUsd: number;
  apyPct: number | null;
  feesEarnedUsd: string;
};

export type MockProtocolBlock = {
  id: string;
  name: string;
  website: string;
  subtitle: string;
  totalUsd: number;
  kind: "lending" | "lp";
  lendingRows?: MockLendingRow[];
  lpRows?: MockLpRow[];
  isDust: boolean;
};

export const MOCK_WALLET_TOKENS: MockTokenRow[] = [
  {
    id: "sui",
    symbol: "SUI",
    name: "Sui",
    priceUsd: 2.85,
    change24hPct: 1.2,
    amount: 4200,
    valueUsd: 11970,
  },
  {
    id: "usdc",
    symbol: "USDC",
    name: "USDC",
    priceUsd: 1,
    change24hPct: 0.01,
    amount: 5000,
    valueUsd: 5000,
  },
  {
    id: "wal",
    symbol: "WAL",
    name: "Walrus",
    priceUsd: 0.42,
    change24hPct: -2.4,
    amount: 1200,
    valueUsd: 504,
  },
  {
    id: "cetus",
    symbol: "CETUS",
    name: "Cetus",
    priceUsd: 0.088,
    change24hPct: 3.1,
    amount: 15000,
    valueUsd: 1320,
  },
  {
    id: "deep",
    symbol: "DEEP",
    name: "DeepBook",
    priceUsd: 0.12,
    change24hPct: 0.8,
    amount: 40,
    valueUsd: 4.8,
  },
];

export const MOCK_PROTOCOL_TILES: MockProtocolTile[] = [
  {
    id: "wallet",
    name: "Wallet",
    valueUsd: MOCK_WALLET_TOKENS.reduce((s, t) => s + t.valueUsd, 0),
    logo: "◆",
    anchorId: "section-wallet",
    isDust: false,
  },
  {
    id: "navi",
    name: "NAVI",
    valueUsd: 18420,
    logo: "N",
    anchorId: "section-navi",
    isDust: false,
  },
  {
    id: "suilend",
    name: "Suilend",
    valueUsd: 3200,
    logo: "S",
    anchorId: "section-suilend",
    isDust: false,
  },
  {
    id: "cetus",
    name: "Cetus",
    valueUsd: 2100,
    logo: "C",
    anchorId: "section-cetus",
    isDust: false,
  },
  {
    id: "dust",
    name: "Turbos",
    valueUsd: 12,
    logo: "T",
    anchorId: "section-turbos",
    isDust: true,
  },
];

export const MOCK_PROTOCOL_BLOCKS: MockProtocolBlock[] = [
  {
    id: "navi",
    name: "NAVI Protocol",
    website: "https://www.naviprotocol.io/",
    subtitle: "NAVI Protocol — Lending",
    totalUsd: 18420,
    kind: "lending",
    isDust: false,
    lendingRows: [
      {
        asset: "SUI",
        side: "Supplied",
        balance: "4,200",
        valueUsd: 11970,
        apyPct: 4.2,
        healthOrLtv: "1.42",
      },
      {
        asset: "USDC",
        side: "Borrowed",
        balance: "2,000",
        valueUsd: 2000,
        apyPct: 6.1,
        healthOrLtv: "72%",
      },
      {
        asset: "DEEP",
        side: "Supplied",
        balance: "50,000",
        valueUsd: 4450,
        apyPct: 2.8,
        healthOrLtv: "—",
      },
    ],
  },
  {
    id: "suilend",
    name: "Suilend",
    website: "https://suilend.fi/",
    subtitle: "Suilend — Lending",
    totalUsd: 3200,
    kind: "lending",
    isDust: false,
    lendingRows: [
      {
        asset: "USDC",
        side: "Supplied",
        balance: "3,200",
        valueUsd: 3200,
        apyPct: 3.4,
        healthOrLtv: "—",
      },
    ],
  },
  {
    id: "cetus",
    name: "Cetus",
    website: "https://cetus.zone/",
    subtitle: "Cetus — Liquidity",
    totalUsd: 2100,
    kind: "lp",
    isDust: false,
    lpRows: [
      {
        pair: "SUI / USDC",
        balance: "1.2 LP",
        valueUsd: 2100,
        apyPct: 14.2,
        feesEarnedUsd: "$42.10",
      },
    ],
  },
  {
    id: "turbos",
    name: "Turbos",
    website: "https://turbos.finance/",
    subtitle: "Turbos — Staking",
    totalUsd: 12,
    kind: "lending",
    isDust: true,
    lendingRows: [
      {
        asset: "SUI",
        side: "Supplied",
        balance: "4",
        valueUsd: 12,
        apyPct: 2.1,
        healthOrLtv: "—",
      },
    ],
  },
];

export function formatUsd(n: number): string {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: n >= 100 ? 0 : 2,
  });
}

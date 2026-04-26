export type MockYieldPool = {
  protocol: string;
  pool: string;
  apy: number;
  tvl: number;
  type: string;
  url: string;
};

export const MOCK_YIELD_POOLS: MockYieldPool[] = [
  {
    protocol: "NAVI",
    pool: "SUI Supply",
    apy: 4.2,
    tvl: 42_000_000,
    type: "Lending",
    url: "https://www.naviprotocol.io/",
  },
  {
    protocol: "Cetus",
    pool: "SUI/USDC LP",
    apy: 12.4,
    tvl: 18_500_000,
    type: "LP",
    url: "https://cetus.zone/",
  },
  {
    protocol: "Turbos",
    pool: "SUI staking",
    apy: 3.1,
    tvl: 9_200_000,
    type: "Staking",
    url: "https://turbos.finance/",
  },
];

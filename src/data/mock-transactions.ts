export type MockTxType =
  | "Send"
  | "Receive"
  | "Swap"
  | "Add Liquidity"
  | "Remove Liquidity"
  | "Stake"
  | "Unstake"
  | "Contract Call";

export type MockTransaction = {
  id: string;
  date: string;
  type: MockTxType;
  assets: string;
  amount: string;
  usdValue: string;
  status: "Success" | "Pending" | "Failed";
  explorerUrl: string;
  protocol?: string;
};

export const MOCK_TRANSACTIONS: MockTransaction[] = [
  {
    id: "1",
    date: "2026-04-25T14:22:00Z",
    type: "Swap",
    assets: "SUI → USDC",
    amount: "500 SUI",
    usdValue: "$1,420",
    status: "Success",
    explorerUrl: "https://suiscan.xyz/mainnet/tx/abc",
    protocol: "Cetus",
  },
  {
    id: "2",
    date: "2026-04-24T09:10:00Z",
    type: "Add Liquidity",
    assets: "SUI / USDC",
    amount: "LP +1.2",
    usdValue: "$2,100",
    status: "Success",
    explorerUrl: "https://suiscan.xyz/mainnet/tx/def",
    protocol: "Cetus",
  },
  {
    id: "3",
    date: "2026-04-23T18:00:00Z",
    type: "Stake",
    assets: "SUI",
    amount: "1,000",
    usdValue: "$2,850",
    status: "Success",
    explorerUrl: "https://suiscan.xyz/mainnet/tx/ghi",
    protocol: "Turbos",
  },
  {
    id: "4",
    date: "2026-04-22T11:45:00Z",
    type: "Send",
    assets: "USDC",
    amount: "200",
    usdValue: "$200",
    status: "Success",
    explorerUrl: "https://suiscan.xyz/mainnet/tx/jkl",
  },
  {
    id: "5",
    date: "2026-04-21T08:30:00Z",
    type: "Contract Call",
    assets: "NAVI",
    amount: "—",
    usdValue: "—",
    status: "Success",
    explorerUrl: "https://suiscan.xyz/mainnet/tx/mno",
    protocol: "NAVI",
  },
];

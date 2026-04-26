import type { TransactionRow } from "@/lib/types/portfolio";

export const mockTransactions: TransactionRow[] = [
  {
    id: "1",
    digest: "7Gx…9a2f",
    kind: "swap",
    timestamp: "2h ago",
    summary: "SUI → USDC",
    status: "success",
  },
  {
    id: "2",
    digest: "3Qm…b81c",
    kind: "send",
    timestamp: "5h ago",
    summary: "To 0x4a…c21",
    status: "success",
  },
  {
    id: "3",
    digest: "9Zp…e004",
    kind: "receive",
    timestamp: "1d ago",
    summary: "From DeepBook",
    status: "success",
  },
  {
    id: "4",
    digest: "1Aa…ff90",
    kind: "other",
    timestamp: "1d ago",
    summary: "Stake deposit",
    status: "pending",
  },
];

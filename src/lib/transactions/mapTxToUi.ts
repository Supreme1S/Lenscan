import type { MockTransaction, MockTxType } from "@/data/mock-transactions";
import type { TransactionRow } from "@/lib/types/portfolio";

function kindToType(kind: TransactionRow["kind"]): MockTxType {
  switch (kind) {
    case "send":
      return "Send";
    case "receive":
      return "Receive";
    case "swap":
      return "Swap";
    default:
      return "Contract Call";
  }
}

function statusToUi(s: TransactionRow["status"]): MockTransaction["status"] {
  if (s === "success") return "Success";
  if (s === "failed") return "Failed";
  return "Pending";
}

export function mapTransactionRowsToUi(rows: TransactionRow[]): MockTransaction[] {
  return rows.map((r) => ({
    id: r.id,
    date:
      r.timestampMs > 0
        ? new Date(r.timestampMs).toISOString()
        : new Date().toISOString(),
    type: kindToType(r.kind),
    assets: r.summary,
    amount: "—",
    usdValue: "—",
    status: statusToUi(r.status),
    explorerUrl: `https://suiscan.xyz/mainnet/tx/${encodeURIComponent(r.id)}`,
    protocol: undefined,
  }));
}

/**
 * Phase 2: turn raw Sui transaction blocks into the `TransactionRow` shape the
 * existing `TransactionsTable` already understands.
 *
 * We classify each tx by inspecting `balanceChanges` for the queried address:
 *  - exclusive negative deltas → "send"
 *  - exclusive positive deltas → "receive"
 *  - mixed deltas (multiple coin types changing in opposite directions) → "swap"
 *  - everything else (no balance changes / system events) → "other"
 */
import { queryTransactionBlocks, type SuiBalanceChange, type TxBlockSummary } from "@/lib/sui/rpc";
import type { TransactionRow } from "@/lib/types/portfolio";

const DEFAULT_LIMIT = 25;

function ownerAddress(owner: SuiBalanceChange["owner"]): string | null {
  if (!owner) return null;
  if (typeof owner === "string") return owner;
  return owner.AddressOwner ?? null;
}

function symbolFromCoinType(coinType: string): string {
  const tail = coinType.split("::").at(-1) ?? coinType;
  return tail.replace(/[^A-Za-z0-9]/g, "").slice(0, 8) || "?";
}

function classify(
  changes: SuiBalanceChange[],
  address: string,
): { kind: TransactionRow["kind"]; summary: string } {
  const own = changes.filter((c) => ownerAddress(c.owner) === address);
  if (own.length === 0) {
    return { kind: "other", summary: "Contract interaction" };
  }

  const positives = own.filter((c) => !c.amount.startsWith("-") && c.amount !== "0");
  const negatives = own.filter((c) => c.amount.startsWith("-"));

  // Drop pure gas-only SUI moves from "send" classification (every Sui tx
  // burns a tiny amount of SUI for gas — that shouldn't read as a send).
  const GAS_THRESHOLD_MIST = BigInt("50000000"); // ~0.05 SUI
  const meaningfulNegatives = negatives.filter((c) => {
    if (c.coinType !== "0x2::sui::SUI") return true;
    const abs = BigInt(c.amount.replace("-", ""));
    return abs > GAS_THRESHOLD_MIST;
  });

  if (positives.length > 0 && meaningfulNegatives.length > 0) {
    const out = symbolFromCoinType(meaningfulNegatives[0]!.coinType);
    const inn = symbolFromCoinType(positives[0]!.coinType);
    return { kind: "swap", summary: `Swap ${out} → ${inn}` };
  }
  if (positives.length > 0) {
    return {
      kind: "receive",
      summary: `Received ${symbolFromCoinType(positives[0]!.coinType)}`,
    };
  }
  if (meaningfulNegatives.length > 0) {
    return {
      kind: "send",
      summary: `Sent ${symbolFromCoinType(meaningfulNegatives[0]!.coinType)}`,
    };
  }
  return { kind: "other", summary: "Gas-only interaction" };
}

function formatTimestamp(ms: string | null | undefined): string {
  if (!ms) return "—";
  const t = Number(ms);
  if (!Number.isFinite(t)) return "—";
  const diff = Date.now() - t;
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(t).toISOString().slice(0, 10);
}

function shortenDigest(digest: string): string {
  if (digest.length <= 14) return digest;
  return `${digest.slice(0, 6)}…${digest.slice(-6)}`;
}

function toRow(tx: TxBlockSummary, address: string): TransactionRow {
  const status: TransactionRow["status"] =
    tx.effects?.status?.status === "success"
      ? "success"
      : tx.effects?.status?.status === "failure"
        ? "failed"
        : "pending";
  const { kind, summary } = classify(tx.balanceChanges ?? [], address);
  const ts = Number(tx.timestampMs ?? 0);
  return {
    id: tx.digest,
    digest: shortenDigest(tx.digest),
    kind,
    timestampMs: Number.isFinite(ts) ? ts : 0,
    timestamp: formatTimestamp(tx.timestampMs),
    summary,
    status,
  };
}

export type RealTransactions = {
  rows: TransactionRow[];
  hasMore: boolean;
  nextCursor: string | null;
};

export async function fetchRealTransactions(
  address: string,
  limit = DEFAULT_LIMIT,
  signal?: AbortSignal,
  cursor: string | null = null,
): Promise<RealTransactions> {
  const result = await queryTransactionBlocks(address, limit, { signal }, cursor);
  const rows = result.data.map((tx) => toRow(tx, address));
  return {
    rows,
    hasMore: result.hasNextPage,
    nextCursor: result.nextCursor,
  };
}

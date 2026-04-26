import { TransactionsPage } from "@/components/transactions/TransactionsPage";

export default function TransactionsRoute() {
  return (
    <div>
      <header className="border-b border-[var(--border)] px-6 py-5 lg:px-8">
        <h1 className="text-xl font-semibold tracking-tight text-[var(--foreground)]">
          Transactions
        </h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Recent activity timeline. Phase 1 — mock data; Sui RPC client lives in{" "}
          <code className="rounded bg-[var(--surface-muted)] px-1 text-xs">
            src/lib/sui/rpc.ts
          </code>
          .
        </p>
      </header>
      <TransactionsPage />
    </div>
  );
}

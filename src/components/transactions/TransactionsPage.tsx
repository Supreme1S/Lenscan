import { TransactionsTable } from "@/components/transactions/TransactionsTable";
import { mockTransactions } from "@/lib/data/mock/transactions";

export function TransactionsPage() {
  return (
    <div className="space-y-4 p-6 lg:p-8">
      <p className="text-sm text-zinc-600 dark:text-zinc-300">
        Recent activity (mock rows). Replace with RPC / indexer queries.
      </p>
      <TransactionsTable rows={mockTransactions} />
    </div>
  );
}

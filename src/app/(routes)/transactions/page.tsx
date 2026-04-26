import Link from "next/link";
import { TransactionsTable } from "@/components/transactions/TransactionsTable";
import { fetchRealTransactions } from "@/lib/transactions/buildTransactions";
import { isPlausibleSuiAddress, normalizeSuiAddress, shortenAddress } from "@/lib/sui/address";

// Cache for 60s — recent activity churns, but not faster than once a minute is fine.
export const revalidate = 60;

type Props = {
  searchParams: Promise<{ address?: string }>;
};

export default async function TransactionsRoute({ searchParams }: Props) {
  const { address } = await searchParams;
  const trimmed = (address ?? "").trim();
  const usableAddress =
    trimmed && isPlausibleSuiAddress(trimmed)
      ? normalizeSuiAddress(trimmed)
      : null;

  return (
    <div>
      <header className="border-b border-[var(--border)] px-6 py-5 lg:px-8">
        <h1 className="text-xl font-semibold tracking-tight text-[var(--foreground)]">
          Transactions
        </h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          {usableAddress
            ? `Recent activity for ${shortenAddress(usableAddress)}.`
            : "Recent activity timeline pulled directly from a Sui full node."}
        </p>
      </header>

      {!usableAddress ? (
        <EmptyState
          title="No wallet selected"
          message="Paste a Sui address (0x…) on the home page to see its transaction history."
        />
      ) : (
        <TxContent address={usableAddress} />
      )}
    </div>
  );
}

async function TxContent({ address }: { address: string }) {
  let rows;
  let hasMore = false;
  let errorMessage: string | null = null;
  try {
    const result = await fetchRealTransactions(address);
    rows = result.rows;
    hasMore = result.hasMore;
  } catch (err) {
    errorMessage = err instanceof Error ? err.message : "Failed to load transactions";
  }

  if (errorMessage) {
    return (
      <EmptyState
        title="Couldn’t load transactions"
        message={errorMessage ?? "Sui RPC didn’t respond. Try again in a moment."}
      />
    );
  }

  if (!rows || rows.length === 0) {
    return (
      <EmptyState
        title="No transactions found"
        message="This wallet hasn’t signed or received any transactions yet."
      />
    );
  }

  return (
    <div className="space-y-4 p-6 lg:p-8">
      <p className="text-sm text-[var(--muted)]">
        Showing {rows.length} most recent transaction{rows.length === 1 ? "" : "s"}
        {hasMore ? " (older history truncated)" : ""}
      </p>
      <TransactionsTable rows={rows} />
    </div>
  );
}

function EmptyState({ title, message }: { title: string; message: string }) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center p-6">
      <div className="surface-card max-w-md p-8 text-center">
        <p className="text-xl font-semibold text-[var(--foreground)]">{title}</p>
        <p className="mt-2 text-sm text-[var(--muted)]">{message}</p>
        <Link href="/" className="btn-primary mt-5 inline-flex h-10 px-5 text-sm">
          Back to search
        </Link>
      </div>
    </div>
  );
}

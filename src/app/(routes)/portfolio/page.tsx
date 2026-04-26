import Link from "next/link";
import { PortfolioPage } from "@/components/portfolio/PortfolioPage";
import { buildRealPortfolio } from "@/lib/portfolio/buildPortfolio";
import { isPlausibleSuiAddress, normalizeSuiAddress } from "@/lib/sui/address";

// Cache portfolio render for 60 seconds — prices and balances refresh every minute.
export const revalidate = 60;

type Props = {
  searchParams: Promise<{ address?: string }>;
};

export default async function PortfolioRoute({ searchParams }: Props) {
  const { address } = await searchParams;
  const trimmed = (address ?? "").trim();
  const usableAddress =
    trimmed && isPlausibleSuiAddress(trimmed)
      ? normalizeSuiAddress(trimmed)
      : null;

  if (!usableAddress) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6">
        <div className="surface-card max-w-md p-8 text-center">
          <p className="text-2xl font-semibold text-[var(--foreground)]">
            No wallet selected
          </p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Paste a Sui address (0x…) or SuiNS name on the home page to see a
            portfolio.
          </p>
          <Link href="/" className="btn-primary mt-5 inline-flex h-10 px-5 text-sm">
            Go to search
          </Link>
        </div>
      </div>
    );
  }

  let portfolio;
  let errorMessage: string | null = null;
  try {
    portfolio = await buildRealPortfolio(usableAddress);
  } catch (err) {
    errorMessage = err instanceof Error ? err.message : "Failed to load portfolio";
  }

  if (errorMessage || !portfolio) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6">
        <div className="surface-card max-w-md p-8 text-center">
          <p className="text-xl font-semibold text-[var(--foreground)]">
            Couldn’t load this wallet
          </p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            {errorMessage ?? "Sui RPC didn’t respond. Try again in a moment."}
          </p>
          <Link href="/" className="btn-primary mt-5 inline-flex h-10 px-5 text-sm">
            Back to search
          </Link>
        </div>
      </div>
    );
  }

  if (portfolio.empty) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6">
        <div className="surface-card max-w-md p-8 text-center">
          <p className="text-xl font-semibold text-[var(--foreground)]">
            This wallet is empty
          </p>
          <p className="mt-2 break-all font-mono text-xs text-[var(--muted)]">
            {usableAddress}
          </p>
          <p className="mt-3 text-sm text-[var(--muted)]">
            No coin balances on the Sui network.
          </p>
          <Link href="/" className="btn-primary mt-5 inline-flex h-10 px-5 text-sm">
            Try another wallet
          </Link>
        </div>
      </div>
    );
  }

  return (
    <PortfolioPage
      summary={portfolio.summary}
      tokenHoldings={portfolio.tokenHoldings}
      defiPositions={[]}
      allocation={portfolio.allocation}
      isMock={false}
      unpricedCount={portfolio.unpricedCount}
    />
  );
}

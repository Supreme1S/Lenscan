import Link from "next/link";
import { PortfolioPage } from "@/components/portfolio/PortfolioPage";
import {
  getMockAllocation,
  getMockDefiPositions,
  getMockPortfolioSummary,
  getMockTokenHoldings,
} from "@/lib/data/mock/mockPortfolio";
import { isPlausibleSuiAddress, normalizeSuiAddress } from "@/lib/sui/address";

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

  // No address provided → empty state pointing at the home search.
  if (!usableAddress) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6">
        <div className="liquid-surface relative max-w-md rounded-3xl p-8 text-center">
          <div className="relative z-10">
            <p className="text-2xl font-semibold text-[var(--foreground)]">
              No wallet selected
            </p>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Paste a Sui address (0x…) or SuiNS name on the home page to see a
              portfolio.
            </p>
            <Link
              href="/"
              className="mt-5 inline-flex h-10 items-center justify-center rounded-full bg-[var(--accent)] px-5 text-sm font-medium text-[var(--accent-foreground)] hover:opacity-90"
            >
              Go to search
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Address provided → mock data tagged with that address (Phase 2/3 will replace).
  const mockSummary = getMockPortfolioSummary();
  const summary = { ...mockSummary, walletAddress: usableAddress };

  return (
    <PortfolioPage
      summary={summary}
      tokenHoldings={getMockTokenHoldings()}
      defiPositions={getMockDefiPositions()}
      allocation={getMockAllocation()}
      isMock
    />
  );
}

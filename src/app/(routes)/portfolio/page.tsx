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

  // Phase 1: mock for everyone; Phase 3 will branch on `usableAddress`.
  const mockSummary = getMockPortfolioSummary();
  const summary = usableAddress
    ? { ...mockSummary, walletAddress: usableAddress }
    : mockSummary;

  return (
    <PortfolioPage
      summary={summary}
      tokenHoldings={getMockTokenHoldings()}
      defiPositions={getMockDefiPositions()}
      allocation={getMockAllocation()}
      isMock={!usableAddress || usableAddress === mockSummary.walletAddress}
    />
  );
}

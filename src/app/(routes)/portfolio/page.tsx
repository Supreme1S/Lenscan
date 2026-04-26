import { PortfolioPage } from "@/components/portfolio/PortfolioPage";
import {
  getMockAllocation,
  getMockDefiPositions,
  getMockPortfolioSummary,
  getMockTokenHoldings,
} from "@/lib/data/mock/mockPortfolio";

export default function PortfolioRoute() {
  const summary = getMockPortfolioSummary();
  const tokenHoldings = getMockTokenHoldings();
  const defiPositions = getMockDefiPositions();
  const allocation = getMockAllocation();

  return (
    <PortfolioPage
      summary={summary}
      tokenHoldings={tokenHoldings}
      defiPositions={defiPositions}
      allocation={allocation}
    />
  );
}

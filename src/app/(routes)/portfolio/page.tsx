import { Suspense } from "react";
import { PortfolioView } from "@/components/portfolio/portfolio-view";

export default function PortfolioRoute() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center text-sm text-[var(--muted)]">
          Loading…
        </div>
      }
    >
      <PortfolioView />
    </Suspense>
  );
}

import { Card } from "@/components/ui/Card";
import { DefiPositionsTable } from "@/components/portfolio/DefiPositionsTable";
import { HoldingsTable } from "@/components/portfolio/HoldingsTable";
import { PortfolioHeader } from "@/components/portfolio/PortfolioHeader";
import type {
  AllocationSlice,
  DefiPosition,
  PortfolioSummary,
  TokenHolding,
} from "@/lib/types/portfolio";

function parseUsd(value: string): number {
  const n = parseFloat(value.replace(/[$,]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function aggregateProtocolTotals(positions: DefiPosition[]): {
  protocol: string;
  valueUsd: string;
}[] {
  const map = new Map<string, number>();
  for (const p of positions) {
    map.set(p.protocol, (map.get(p.protocol) ?? 0) + parseUsd(p.valueUsd));
  }
  return Array.from(map.entries())
    .map(([protocol, total]) => ({
      protocol,
      valueUsd: `$${total.toLocaleString("en-US", { maximumFractionDigits: 0 })}`,
    }))
    .sort((a, b) => parseUsd(b.valueUsd) - parseUsd(a.valueUsd));
}

export type PortfolioPageProps = {
  summary: PortfolioSummary;
  tokenHoldings: TokenHolding[];
  defiPositions: DefiPosition[];
  allocation: AllocationSlice[];
  isMock?: boolean;
  /** When set, render a small note that N tokens have no public price. */
  unpricedCount?: number;
};

export function PortfolioPage({
  summary,
  tokenHoldings,
  defiPositions,
  allocation,
  isMock = false,
  unpricedCount = 0,
}: PortfolioPageProps) {
  const protocolTotals = aggregateProtocolTotals(defiPositions);
  const hasDefi = defiPositions.length > 0;

  return (
    <div className="flex flex-col">
      <PortfolioHeader walletAddress={summary.walletAddress} />

      <div className="space-y-8 p-6 lg:p-8">
        {isMock ? (
          <div className="surface-card px-4 py-3 text-xs text-[var(--muted)]">
            Showing mock data. Real on-chain integration is gradually replacing
            this — token balances are already live; DeFi positions land next.
          </div>
        ) : null}
        {unpricedCount > 0 ? (
          <div className="surface-card px-4 py-3 text-xs text-[var(--muted)]">
            {unpricedCount} token{unpricedCount === 1 ? "" : "s"} held by this
            wallet have no public USD price and are excluded from totals.
          </div>
        ) : null}

        <section className="anim-fade-up grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card>
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
              Net worth
            </p>
            <p className="mt-2 text-2xl font-semibold tabular-nums text-[var(--foreground)]">
              {summary.netWorthUsd}
            </p>
          </Card>
          <Card>
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
              Total tokens
            </p>
            <p className="mt-2 text-2xl font-semibold tabular-nums text-[var(--foreground)]">
              {summary.totalTokensUsd}
            </p>
          </Card>
          <Card>
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
              Total DeFi
            </p>
            <p className="mt-2 text-2xl font-semibold tabular-nums text-[var(--foreground)]">
              {summary.totalDefiUsd}
            </p>
          </Card>
          {summary.debtUsd ? (
            <Card>
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
                Debt / Health
              </p>
              <p className="mt-2 text-lg font-semibold tabular-nums text-[var(--foreground)]">
                {summary.debtUsd}
              </p>
              {summary.healthFactor ? (
                <p className="mt-1 text-sm text-[var(--muted)]">
                  Health {summary.healthFactor}
                </p>
              ) : null}
            </Card>
          ) : null}
        </section>

        {allocation.length > 0 ? (
          <section className="surface-card p-5">
            <h2 className="text-sm font-semibold text-[var(--foreground)]">
              Allocation
            </h2>
            <p className="mt-1 text-xs text-[var(--muted)]">By category</p>
            <div className="mt-4 flex h-3 overflow-hidden rounded-full bg-[var(--surface-muted)]">
              {allocation.map((a) => (
                <div
                  key={a.label}
                  style={{ width: `${a.pct}%`, backgroundColor: a.color }}
                  title={`${a.label}: ${a.pct}%`}
                />
              ))}
            </div>
            <ul className="mt-4 flex flex-wrap gap-3 text-xs text-[var(--muted)]">
              {allocation.map((a) => (
                <li key={a.label} className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: a.color }}
                  />
                  {a.label} · {a.pct}%
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {hasDefi ? (
          <section>
            <h2 className="mb-3 text-sm font-semibold text-[var(--foreground)]">
              Protocols
            </h2>
            <div className="flex gap-3 overflow-x-auto pb-1">
              {protocolTotals.map((row) => (
                <Card
                  key={row.protocol}
                  padding="p-4"
                  className="min-w-[140px] shrink-0"
                >
                  <p className="text-sm font-medium text-[var(--foreground)]">
                    {row.protocol}
                  </p>
                  <p className="mt-1 text-xs tabular-nums text-[var(--muted)]">
                    {row.valueUsd}
                  </p>
                </Card>
              ))}
            </div>
          </section>
        ) : null}

        <section className="flex flex-col gap-8">
          <HoldingsTable rows={tokenHoldings} />
          {hasDefi ? <DefiPositionsTable rows={defiPositions} /> : null}
        </section>
      </div>
    </div>
  );
}

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
};

export function PortfolioPage({
  summary,
  tokenHoldings,
  defiPositions,
  allocation,
}: PortfolioPageProps) {
  const protocolTotals = aggregateProtocolTotals(defiPositions);

  return (
    <div className="flex flex-col">
      <PortfolioHeader walletAddress={summary.walletAddress} />

      <div className="space-y-8 p-6 lg:p-8">
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Net worth
            </p>
            <p className="mt-2 text-2xl font-semibold tabular-nums text-slate-900">
              {summary.netWorthUsd}
            </p>
          </Card>
          <Card>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Total tokens
            </p>
            <p className="mt-2 text-2xl font-semibold tabular-nums text-slate-900">
              {summary.totalTokensUsd}
            </p>
          </Card>
          <Card>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Total DeFi
            </p>
            <p className="mt-2 text-2xl font-semibold tabular-nums text-slate-900">
              {summary.totalDefiUsd}
            </p>
          </Card>
          {summary.debtUsd ? (
            <Card>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Debt / Health
              </p>
              <p className="mt-2 text-lg font-semibold tabular-nums text-slate-900">
                {summary.debtUsd}
              </p>
              {summary.healthFactor ? (
                <p className="mt-1 text-sm text-slate-600">
                  Health {summary.healthFactor}
                </p>
              ) : null}
            </Card>
          ) : null}
        </section>

        <section className="rounded-2xl border border-slate-200/90 bg-white/80 p-5 shadow-sm backdrop-blur-md">
          <h2 className="text-sm font-semibold text-slate-900">Allocation</h2>
          <p className="mt-1 text-xs text-slate-500">By category (mock)</p>
          <div className="mt-4 flex h-3 overflow-hidden rounded-full bg-slate-200/80">
            {allocation.map((a) => (
              <div
                key={a.label}
                style={{ width: `${a.pct}%`, backgroundColor: a.color }}
                title={`${a.label}: ${a.pct}%`}
              />
            ))}
          </div>
          <ul className="mt-4 flex flex-wrap gap-3 text-xs text-slate-600">
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

        <section>
          <h2 className="mb-3 text-sm font-semibold text-slate-900">
            Protocols
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {protocolTotals.map((row) => (
              <Card
                key={row.protocol}
                padding="p-4"
                className="min-w-[140px] shrink-0"
              >
                <p className="text-sm font-medium text-slate-900">
                  {row.protocol}
                </p>
                <p className="mt-1 text-xs tabular-nums text-slate-600">
                  {row.valueUsd}
                </p>
              </Card>
            ))}
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-2">
          <HoldingsTable rows={tokenHoldings} />
          <DefiPositionsTable rows={defiPositions} />
        </section>
      </div>
    </div>
  );
}

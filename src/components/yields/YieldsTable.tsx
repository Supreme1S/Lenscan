"use client";

import { useMemo, useState } from "react";
import { Table, TBody, Td, Th, THead, Tr } from "@/components/ui/Table";
import type { YieldPool } from "@/lib/types/yields";

function fmtUsd(n: number | null): string {
  if (n == null) return "—";
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(0)}`;
}

function fmtPct(n: number | null): string {
  if (n == null) return "—";
  return `${n.toFixed(2)}%`;
}

const CATEGORIES = ["All", "Lending", "DEX / LP", "Staking", "Other"] as const;
type CategoryFilter = (typeof CATEGORIES)[number];

function categoryOf(p: YieldPool): CategoryFilter {
  const c = (p.category ?? "").toLowerCase();
  if (c.includes("lend")) return "Lending";
  if (c.includes("dex") || c.includes("lp") || c.includes("amm")) return "DEX / LP";
  if (c.includes("stak") || c.includes("liquid stak")) return "Staking";
  return "Other";
}

export function YieldsTable({ pools }: { pools: YieldPool[] }) {
  const [category, setCategory] = useState<CategoryFilter>("All");
  const [stablesOnly, setStablesOnly] = useState(false);
  const [minApy, setMinApy] = useState(0);
  const [minTvl, setMinTvl] = useState(0);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return pools
      .filter((p) => (category === "All" ? true : categoryOf(p) === category))
      .filter((p) => (stablesOnly ? p.stablecoin : true))
      .filter((p) => (p.apy ?? 0) >= minApy)
      .filter((p) => (p.tvlUsd ?? 0) >= minTvl)
      .filter((p) =>
        search.trim()
          ? `${p.project} ${p.symbol}`
              .toLowerCase()
              .includes(search.trim().toLowerCase())
          : true,
      );
  }, [pools, category, stablesOnly, minApy, minTvl, search]);

  return (
    <div className="space-y-4">
      <div className="surface-card rounded-2xl p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  category === c
                    ? "bg-[var(--accent)] text-[var(--accent-foreground)]"
                    : "border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2 text-xs text-[var(--foreground)]">
            <input
              type="checkbox"
              checked={stablesOnly}
              onChange={(e) => setStablesOnly(e.target.checked)}
              className="h-3.5 w-3.5 accent-[var(--brand)]"
            />
            Stablecoins only
          </label>
          <label className="flex items-center gap-2 text-xs text-[var(--foreground)]">
            Min APY
            <input
              type="number"
              min={0}
              step={0.5}
              value={minApy}
              onChange={(e) => setMinApy(Number(e.target.value) || 0)}
              className="h-7 w-16 rounded-md border border-[var(--border)] bg-[var(--surface)] px-2 text-xs"
            />
            %
          </label>
          <label className="flex items-center gap-2 text-xs text-[var(--foreground)]">
            Min TVL
            <input
              type="number"
              min={0}
              step={10_000}
              value={minTvl}
              onChange={(e) => setMinTvl(Number(e.target.value) || 0)}
              className="h-7 w-24 rounded-md border border-[var(--border)] bg-[var(--surface)] px-2 text-xs"
            />
            $
          </label>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search project / symbol"
            className="h-7 flex-1 min-w-[160px] rounded-md border border-[var(--border)] bg-[var(--surface)] px-2 text-xs"
          />
        </div>
        <p className="mt-3 text-[11px] text-[var(--muted)]">
          {filtered.length} of {pools.length} Sui pools shown.
        </p>
      </div>

      <Table>
        <THead>
          <Tr>
            <Th>Project</Th>
            <Th>Pool</Th>
            <Th>Category</Th>
            <Th className="text-right">APY</Th>
            <Th className="text-right">Base / Reward</Th>
            <Th className="text-right">TVL</Th>
            <Th>Risk</Th>
          </Tr>
        </THead>
        <TBody>
          {filtered.slice(0, 200).map((p) => (
            <Tr key={p.pool}>
              <Td className="font-medium text-[var(--foreground)] capitalize">
                {p.project.replace(/-/g, " ")}
              </Td>
              <Td className="text-[var(--foreground)]">{p.symbol}</Td>
              <Td className="text-[var(--muted)]">{categoryOf(p)}</Td>
              <Td className="text-right font-semibold tabular-nums text-[var(--foreground)]">
                {fmtPct(p.apy)}
              </Td>
              <Td className="text-right tabular-nums text-[var(--muted)]">
                {fmtPct(p.apyBase)} · {fmtPct(p.apyReward)}
              </Td>
              <Td className="text-right tabular-nums text-[var(--foreground)]">
                {fmtUsd(p.tvlUsd)}
              </Td>
              <Td className="text-[var(--muted)]">
                {p.stablecoin ? "stable" : (p.ilRisk ?? "—")}
              </Td>
            </Tr>
          ))}
          {filtered.length === 0 ? (
            <Tr>
              <Td className="py-6 text-center text-[var(--muted)]">
                <span>No pools match these filters.</span>
              </Td>
              <Td>
                <span className="sr-only">empty</span>
              </Td>
              <Td>
                <span className="sr-only">empty</span>
              </Td>
              <Td>
                <span className="sr-only">empty</span>
              </Td>
              <Td>
                <span className="sr-only">empty</span>
              </Td>
              <Td>
                <span className="sr-only">empty</span>
              </Td>
              <Td>
                <span className="sr-only">empty</span>
              </Td>
            </Tr>
          ) : null}
        </TBody>
      </Table>
    </div>
  );
}

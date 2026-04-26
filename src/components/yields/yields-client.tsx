"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import type { MockYieldPool } from "@/data/mock-yields";
import type { DefillamaPool } from "@/lib/data/defillama-yields";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Row =
  | {
      source: "remote";
      protocol: string;
      pool: string;
      apy: number;
      tvl: number;
      type: string;
      url: string;
    }
  | {
      source: "mock";
      protocol: string;
      pool: string;
      apy: number;
      tvl: number;
      type: string;
      url: string;
    };

function mapRemote(p: DefillamaPool): Row {
  return {
    source: "remote",
    protocol: p.project,
    pool: `${p.symbol} · ${p.pool?.slice(0, 12) ?? "pool"}`,
    apy: p.apy,
    tvl: p.tvlUsd,
    type: "Pool",
    url: p.url ?? `https://defillama.com/yields/pool/${p.pool}`,
  };
}

function mapMock(p: MockYieldPool): Row {
  return {
    source: "mock",
    protocol: p.protocol,
    pool: p.pool,
    apy: p.apy,
    tvl: p.tvl,
    type: p.type,
    url: p.url,
  };
}

type YieldsClientProps = {
  remotePools: DefillamaPool[] | null;
  mockPools: MockYieldPool[];
};

export function YieldsClient({ remotePools, mockPools }: YieldsClientProps) {
  const baseRows: Row[] = useMemo(() => {
    if (remotePools && remotePools.length > 0) {
      return remotePools.slice(0, 200).map(mapRemote);
    }
    return mockPools.map(mapMock);
  }, [remotePools, mockPools]);

  const [category, setCategory] = useState<"All" | "Lending" | "LP" | "Staking">(
    "All",
  );
  const [stableOnly, setStableOnly] = useState(false);
  const [minApy, setMinApy] = useState("");
  const [minTvl, setMinTvl] = useState("");

  const filtered = useMemo(() => {
    const minApyN = parseFloat(minApy) || 0;
    const minTvlN = parseFloat(minTvl) || 0;
    const stables = new Set(["USDC", "USDT", "USD", "sUSDe", "BUCK"]);

    return baseRows.filter((r) => {
      if (category !== "All") {
        const hay = `${r.protocol} ${r.pool} ${r.type}`.toLowerCase();
        if (category === "Lending") {
          const match =
            hay.includes("lend") ||
            hay.includes("navi") ||
            hay.includes("suilend") ||
            hay.includes("supply");
          if (!match) return false;
        }
        if (category === "LP") {
          if (!hay.includes("lp") && !hay.includes("/") && !hay.includes("pool"))
            return false;
        }
        if (category === "Staking") {
          if (!hay.includes("stak") && !hay.includes("stake")) return false;
        }
      }
      if (r.apy < minApyN) return false;
      if (r.tvl < minTvlN) return false;
      if (stableOnly) {
        const hit = [...stables].some((s) =>
          r.pool.toUpperCase().includes(s),
        );
        if (!hit) return false;
      }
      return true;
    });
  }, [baseRows, category, stableOnly, minApy, minTvl]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface)]/80 p-4">
        <div className="flex flex-wrap gap-2">
          {(["All", "Lending", "LP", "Staking"] as const).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                category === c
                  ? "bg-[var(--accent)] text-[var(--accent-foreground)]"
                  : "bg-[var(--surface-muted)] text-[var(--muted)] hover:text-[var(--foreground)]",
              )}
            >
              {c}
            </button>
          ))}
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-[var(--foreground)]">
          <input
            type="checkbox"
            checked={stableOnly}
            onChange={(e) => setStableOnly(e.target.checked)}
            className="rounded border-[var(--border)]"
          />
          Stablecoins only
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="text-xs text-[var(--muted)]">Min APY %</label>
            <Input
              inputMode="decimal"
              placeholder="0"
              value={minApy}
              onChange={(e) => setMinApy(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-xs text-[var(--muted)]">Min TVL (USD)</label>
            <Input
              inputMode="numeric"
              placeholder="0"
              value={minTvl}
              onChange={(e) => setMinTvl(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="border-b border-[var(--border)] bg-[var(--surface-muted)]/80">
            <tr>
              <th className="px-3 py-2 font-medium text-[var(--muted)]">Protocol</th>
              <th className="px-3 py-2 font-medium text-[var(--muted)]">Pool</th>
              <th className="px-3 py-2 font-medium text-[var(--muted)]">APY</th>
              <th className="px-3 py-2 font-medium text-[var(--muted)]">TVL</th>
              <th className="px-3 py-2 font-medium text-[var(--muted)]">Type</th>
              <th className="px-3 py-2 font-medium text-[var(--muted)]">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {filtered.slice(0, 100).map((r, i) => (
              <motion.tr
                key={`${r.protocol}-${r.pool}-${i}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: Math.min(i * 0.01, 0.3) }}
              >
                <td className="px-3 py-2 font-medium">{r.protocol}</td>
                <td className="px-3 py-2 text-[var(--muted)]">{r.pool}</td>
                <td className="px-3 py-2 tabular-nums">{r.apy.toFixed(2)}%</td>
                <td className="px-3 py-2 tabular-nums">
                  ${r.tvl.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </td>
                <td className="px-3 py-2">{r.type}</td>
                <td className="px-3 py-2">
                  <Button variant="outline" size="sm" asChild>
                    <a href={r.url} target="_blank" rel="noopener noreferrer">
                      Open
                    </a>
                  </Button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

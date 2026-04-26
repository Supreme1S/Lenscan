"use client";

import { useMemo, useState } from "react";
import { Table, TBody, Td, Th, THead, Tr } from "@/components/ui/Table";
import type { DefiPosition, DefiPositionCategory } from "@/lib/types/portfolio";

const FILTERS: { id: "all" | DefiPositionCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "Supply", label: "Supply" },
  { id: "Borrow", label: "Borrow" },
  { id: "LP", label: "LP" },
  { id: "Staking", label: "Staking" },
  { id: "Other", label: "Other" },
];

function formatApy(p: DefiPosition): string {
  if (p.apyBasePct == null && p.apyRewardPct == null) return "—";
  const base =
    p.apyBasePct != null ? `${p.apyBasePct}%` : null;
  const reward =
    p.apyRewardPct != null ? `${p.apyRewardPct}% reward` : null;
  if (base && reward) return `${base} + ${reward}`;
  if (base) return base;
  if (reward) return reward;
  return "—";
}

export function DefiPositionsTable({ rows }: { rows: DefiPosition[] }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");

  const filtered = useMemo(() => {
    if (filter === "all") return rows;
    return rows.filter((r) => r.category === filter);
  }, [rows, filter]);

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-slate-50/80 p-4 shadow-sm">
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-sm font-semibold text-slate-900">DeFi positions</h2>
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                filter === f.id
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
      <Table>
        <THead>
          <Tr>
            <Th>Protocol</Th>
            <Th>Type</Th>
            <Th>Asset</Th>
            <Th>APY</Th>
            <Th>Amount</Th>
            <Th>Value</Th>
            <Th>Unclaimed</Th>
            <Th>Health</Th>
          </Tr>
        </THead>
        <TBody>
          {filtered.map((p) => (
            <Tr key={p.id}>
              <Td className="font-medium text-slate-900">{p.protocol}</Td>
              <Td className="text-slate-700">{p.type}</Td>
              <Td className="text-slate-700">{p.asset}</Td>
              <Td className="tabular-nums text-slate-700">{formatApy(p)}</Td>
              <Td className="tabular-nums text-slate-700">{p.amount}</Td>
              <Td className="tabular-nums font-medium text-slate-900">
                {p.valueUsd}
              </Td>
              <Td className="tabular-nums text-slate-600">
                {p.unclaimedUsd ?? "—"}
              </Td>
              <Td className="text-slate-600">{p.health ?? "—"}</Td>
            </Tr>
          ))}
        </TBody>
      </Table>
    </div>
  );
}

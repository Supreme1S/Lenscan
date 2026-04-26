"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import type { MockTransaction, MockTxType } from "@/data/mock-transactions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ALL_TYPES: MockTxType[] = [
  "Send",
  "Receive",
  "Swap",
  "Add Liquidity",
  "Remove Liquidity",
  "Stake",
  "Unstake",
  "Contract Call",
];

type TransactionsTabProps = {
  transactions: MockTransaction[];
};

export function TransactionsTab({ transactions }: TransactionsTabProps) {
  const [typeFilter, setTypeFilter] = useState<Set<MockTxType>>(
    () => new Set(ALL_TYPES),
  );
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [protocolFilter, setProtocolFilter] = useState("");
  const [visibleCount, setVisibleCount] = useState(50);

  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      if (!typeFilter.has(tx.type)) return false;
      if (
        protocolFilter.trim() &&
        !tx.protocol?.toLowerCase().includes(protocolFilter.trim().toLowerCase())
      ) {
        return false;
      }
      const d = new Date(tx.date).getTime();
      if (dateFrom && d < new Date(dateFrom).getTime()) return false;
      if (dateTo && d > new Date(dateTo).getTime() + 86400000) return false;
      return true;
    });
  }, [transactions, typeFilter, dateFrom, dateTo, protocolFilter]);

  const slice = filtered.slice(0, visibleCount);

  function toggleType(t: MockTxType) {
    setTypeFilter((prev) => {
      const next = new Set(prev);
      if (next.has(t)) next.delete(t);
      else next.add(t);
      if (next.size === 0) return new Set(ALL_TYPES);
      return next;
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)]/80 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
          Filters
        </p>
        <div className="flex flex-wrap gap-2">
          {ALL_TYPES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => toggleType(t)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                typeFilter.has(t)
                  ? "bg-[var(--accent)] text-[var(--accent-foreground)]"
                  : "bg-[var(--surface-muted)] text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="grid gap-2 sm:grid-cols-3">
          <div>
            <label className="text-xs text-[var(--muted)]">From</label>
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-xs text-[var(--muted)]">To</label>
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-xs text-[var(--muted)]">Protocol</label>
            <Input
              placeholder="e.g. Cetus"
              value={protocolFilter}
              onChange={(e) => setProtocolFilter(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b border-[var(--border)] bg-[var(--surface-muted)]/80">
            <tr>
              <th className="px-3 py-2 font-medium text-[var(--muted)]">Date</th>
              <th className="px-3 py-2 font-medium text-[var(--muted)]">Type</th>
              <th className="px-3 py-2 font-medium text-[var(--muted)]">Assets</th>
              <th className="px-3 py-2 font-medium text-[var(--muted)]">Amount</th>
              <th className="px-3 py-2 font-medium text-[var(--muted)]">USD</th>
              <th className="px-3 py-2 font-medium text-[var(--muted)]">Status</th>
              <th className="px-3 py-2 font-medium text-[var(--muted)]">Explorer</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {slice.map((tx) => (
              <motion.tr
                key={tx.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-[var(--surface)]/40"
              >
                <td className="px-3 py-2 tabular-nums text-[var(--muted)]">
                  {new Date(tx.date).toLocaleString(undefined, {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </td>
                <td className="px-3 py-2">{tx.type}</td>
                <td className="px-3 py-2">{tx.assets}</td>
                <td className="px-3 py-2 tabular-nums">{tx.amount}</td>
                <td className="px-3 py-2 tabular-nums">{tx.usdValue}</td>
                <td className="px-3 py-2">{tx.status}</td>
                <td className="px-3 py-2">
                  <a
                    href={tx.explorerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--accent)] hover:underline"
                  >
                    View
                  </a>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {visibleCount < filtered.length ? (
        <Button
          type="button"
          variant="outline"
          onClick={() => setVisibleCount((c) => c + 50)}
        >
          Load more
        </Button>
      ) : null}
    </div>
  );
}

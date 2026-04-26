"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";
import { formatUsd } from "@/data/mock-portfolio";
import type { WalletTokenRow } from "@/lib/portfolio/mapTokenRows";
import { cn } from "@/lib/utils";

const THRESHOLD = 10;

type WalletTokensTableProps = {
  tokens: WalletTokenRow[];
  refreshing: boolean;
};

export function WalletTokensTable({ tokens, refreshing }: WalletTokensTableProps) {
  const [showAll, setShowAll] = useState(false);

  const { visible, hidden } = useMemo(() => {
    const over = tokens.filter((t) => t.valueUsd >= THRESHOLD);
    const under = tokens.filter((t) => t.valueUsd < THRESHOLD);
    return {
      visible: showAll ? tokens : over,
      hidden: under,
    };
  }, [tokens, showAll]);

  const total = tokens.reduce((s, t) => s + t.valueUsd, 0);

  return (
    <section
      id="section-wallet"
      className="scroll-mt-24 rounded-xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_90%,transparent)] p-4 shadow-sm backdrop-blur-md sm:p-6"
    >
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-base font-semibold text-[var(--foreground)]">
          Wallet
        </h2>
        <span className="text-sm tabular-nums text-[var(--muted)]">
          {formatUsd(total)}
        </span>
      </div>
      <div className="overflow-x-auto rounded-lg border border-[var(--border)]">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-[var(--border)] bg-[var(--surface-muted)]/80">
            <tr>
              <th className="px-3 py-2 font-medium text-[var(--muted)]">Asset</th>
              <th className="px-3 py-2 font-medium text-[var(--muted)]">Price</th>
              <th className="px-3 py-2 font-medium text-[var(--muted)]">Amount</th>
              <th className="px-3 py-2 font-medium text-[var(--muted)]">Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            <AnimatePresence mode="popLayout">
              {visible.map((t) => (
                <motion.tr
                  key={t.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: refreshing ? 0.5 : 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-[var(--surface)]/50"
                >
                  <td className="px-3 py-2 font-medium text-[var(--foreground)]">
                    <div>{t.symbol}</div>
                    <div className="text-xs font-normal text-[var(--muted)]">
                      {t.name}
                    </div>
                  </td>
                  <td className="px-3 py-2 tabular-nums">
                    <span>{t.priceLabel}</span>
                    {t.change24hPct == null ? (
                      <span className="ml-2 text-xs text-[var(--muted)]">—</span>
                    ) : (
                      <span
                        className={cn(
                          "ml-2 text-xs",
                          t.change24hPct >= 0 ? "text-emerald-600" : "text-red-600",
                        )}
                      >
                        {t.change24hPct >= 0 ? "+" : ""}
                        {t.change24hPct.toFixed(2)}%
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2 tabular-nums text-[var(--foreground)]">
                    {t.amountLabel}
                  </td>
                  <td className="px-3 py-2 tabular-nums font-medium text-[var(--foreground)]">
                    {formatUsd(t.valueUsd)}
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
      {!showAll && hidden.length > 0 ? (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="mt-3 text-sm font-medium text-[var(--muted)] hover:text-[var(--accent)]"
        >
          {hidden.length} token{hidden.length === 1 ? "" : "s"} not displayed. Show all ▾
        </button>
      ) : null}
    </section>
  );
}

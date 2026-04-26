"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import type { MockProtocolBlock } from "@/data/mock-portfolio";
import { formatUsd } from "@/data/mock-portfolio";

type ProtocolBlocksProps = {
  blocks: MockProtocolBlock[];
  showDust: boolean;
  refreshing: boolean;
};

export function ProtocolBlocks({
  blocks,
  showDust,
  refreshing,
}: ProtocolBlocksProps) {
  const list = showDust ? blocks : blocks.filter((b) => !b.isDust);

  return (
    <div className="space-y-8">
      {list.map((block, i) => (
        <motion.section
          key={block.id}
          id={`section-${block.id}`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: refreshing ? 0.5 : 1, y: 0 }}
          transition={{ delay: i * 0.04 }}
          className="scroll-mt-24 rounded-xl border border-[var(--border)] bg-[var(--surface)]/80 p-4 sm:p-6"
        >
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <a
                href={block.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-base font-semibold text-[var(--foreground)] transition-colors hover:text-[var(--accent)]"
              >
                {block.name}
                <ExternalLink className="h-3.5 w-3.5 opacity-60" />
              </a>
              <p className="text-sm text-[var(--muted)]">{block.subtitle}</p>
            </div>
            <span className="text-sm font-medium tabular-nums text-[var(--foreground)]">
              {formatUsd(block.totalUsd)}
            </span>
          </div>

          {block.kind === "lending" && block.lendingRows ? (
            <div className="overflow-x-auto rounded-lg border border-[var(--border)]">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="bg-[var(--surface-muted)]/80">
                  <tr>
                    <th className="px-3 py-2 font-medium text-[var(--muted)]">Asset</th>
                    <th className="px-3 py-2 font-medium text-[var(--muted)]">Type</th>
                    <th className="px-3 py-2 font-medium text-[var(--muted)]">Balance</th>
                    <th className="px-3 py-2 font-medium text-[var(--muted)]">USD</th>
                    <th className="px-3 py-2 font-medium text-[var(--muted)]">APY</th>
                    <th className="px-3 py-2 font-medium text-[var(--muted)]">Health/LTV</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {block.lendingRows.map((row) => (
                    <tr key={`${row.asset}-${row.side}`}>
                      <td className="px-3 py-2 font-medium">{row.asset}</td>
                      <td className="px-3 py-2">{row.side}</td>
                      <td className="px-3 py-2 tabular-nums">{row.balance}</td>
                      <td className="px-3 py-2 tabular-nums">{formatUsd(row.valueUsd)}</td>
                      <td className="px-3 py-2 tabular-nums">
                        {row.apyPct != null ? `${row.apyPct}%` : "—"}
                      </td>
                      <td className="px-3 py-2">{row.healthOrLtv}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}

          {block.kind === "lp" && block.lpRows ? (
            <div className="overflow-x-auto rounded-lg border border-[var(--border)]">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="bg-[var(--surface-muted)]/80">
                  <tr>
                    <th className="px-3 py-2 font-medium text-[var(--muted)]">Pair</th>
                    <th className="px-3 py-2 font-medium text-[var(--muted)]">Balance</th>
                    <th className="px-3 py-2 font-medium text-[var(--muted)]">USD</th>
                    <th className="px-3 py-2 font-medium text-[var(--muted)]">APY</th>
                    <th className="px-3 py-2 font-medium text-[var(--muted)]">Fees</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {block.lpRows.map((row) => (
                    <tr key={row.pair}>
                      <td className="px-3 py-2 font-medium">{row.pair}</td>
                      <td className="px-3 py-2 tabular-nums">{row.balance}</td>
                      <td className="px-3 py-2 tabular-nums">{formatUsd(row.valueUsd)}</td>
                      <td className="px-3 py-2 tabular-nums">
                        {row.apyPct != null ? `${row.apyPct}%` : "—"}
                      </td>
                      <td className="px-3 py-2 tabular-nums">{row.feesEarnedUsd}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </motion.section>
      ))}
    </div>
  );
}

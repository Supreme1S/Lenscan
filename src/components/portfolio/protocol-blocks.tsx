"use client";

import { motion } from "framer-motion";
import { formatUsd } from "@/data/mock-portfolio";

/** One grouped protocol section for the portfolio DeFi list. */
export type ProtocolBlock = {
  id: string;
  protocolId: string;
  protocolName: string;
  category: string;
  totalValueUsd: number;
  isDust: boolean;
  rows: {
    id: string;
    title: string;
    side: string;
    assetSymbol: string;
    valueUsd: number;
  }[];
};

type ProtocolBlocksProps = {
  blocks: ProtocolBlock[];
  showDust: boolean;
  refreshing: boolean;
};

function GroupLogo({ name }: { name: string }) {
  const initial = name.trim().slice(0, 1).toUpperCase() || "?";
  return (
    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[var(--surface-muted)] text-xs font-semibold text-[var(--muted)]">
      {initial}
    </span>
  );
}

export function ProtocolBlocks({
  blocks,
  showDust,
  refreshing,
}: ProtocolBlocksProps) {
  const list = showDust ? blocks : blocks.filter((b) => !b.isDust);

  if (list.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8">
      {list.map((block, i) => (
        <motion.section
          key={block.id}
          id={`section-defi-${block.protocolId}`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: refreshing ? 0.5 : 1, y: 0 }}
          transition={{ delay: i * 0.04 }}
          className="scroll-mt-24 rounded-xl border border-[var(--border)] bg-[var(--surface)]/80 p-4 sm:p-6"
        >
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-2">
              <GroupLogo name={block.protocolName} />
              <div>
                <h3 className="text-base font-semibold text-[var(--foreground)]">
                  {block.protocolName}
                </h3>
                <p className="text-sm text-[var(--muted)]">
                  {block.category} · {block.rows.length} position
                  {block.rows.length === 1 ? "" : "s"}
                </p>
              </div>
            </div>
            <span className="text-sm font-medium tabular-nums text-[var(--foreground)]">
              {formatUsd(block.totalValueUsd)}
            </span>
          </div>

          <div className="overflow-x-auto rounded-lg border border-[var(--border)]">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-[var(--surface-muted)]/80">
                <tr>
                  <th className="px-3 py-2 font-medium text-[var(--muted)]">Title</th>
                  <th className="px-3 py-2 font-medium text-[var(--muted)]">Side</th>
                  <th className="px-3 py-2 font-medium text-[var(--muted)]">Asset</th>
                  <th className="px-3 py-2 font-medium text-[var(--muted)]">USD</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {block.rows.map((row) => (
                  <tr key={row.id}>
                    <td className="px-3 py-2 font-medium">{row.title}</td>
                    <td className="px-3 py-2">{row.side}</td>
                    <td className="px-3 py-2">{row.assetSymbol}</td>
                    <td className="px-3 py-2 tabular-nums">{formatUsd(row.valueUsd)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.section>
      ))}
    </div>
  );
}

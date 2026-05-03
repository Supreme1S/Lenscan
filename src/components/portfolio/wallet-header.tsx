"use client";

import { motion } from "framer-motion";
import { Copy, RefreshCw } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { formatAddressMiddle } from "@/lib/format";
import type { PortfolioSummary } from "@/lib/types/portfolio";

type WalletHeaderProps = {
  address: string;
  suinsName: string | null;
  onRefresh: () => void;
  refreshing: boolean;
  /** Populated after portfolio API load — net worth matches server (tokens + DeFi − borrows). */
  summary?: PortfolioSummary | null;
};

export function WalletHeader({
  address,
  suinsName,
  onRefresh,
  refreshing,
  summary,
}: WalletHeaderProps) {
  const [copied, setCopied] = useState(false);

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="border-b border-[var(--border)] bg-[var(--surface)]/60 px-4 py-4 sm:px-6">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-sm font-medium text-[var(--foreground)] sm:text-base">
              {formatAddressMiddle(address, 10, 6)}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={copyAddress}
              aria-label="Copy address"
            >
              <Copy className="h-4 w-4" />
            </Button>
            {copied ? (
              <span className="text-xs text-[var(--accent)]">Copied</span>
            ) : null}
            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={onRefresh}
              disabled={refreshing}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] transition-colors hover:bg-[var(--surface-muted)] disabled:opacity-50"
              aria-label="Refresh portfolio"
            >
              <RefreshCw
                className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
              />
            </motion.button>
          </div>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {suinsName ?? "SuiNS: —"}
          </p>
          {summary ? (
            <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm">
              <div>
                <dt className="text-[var(--muted)]">Net worth</dt>
                <dd className="font-semibold tabular-nums text-[var(--foreground)]">
                  {summary.netWorthUsd}
                </dd>
              </div>
              <div>
                <dt className="text-[var(--muted)]">Wallet</dt>
                <dd className="tabular-nums text-[var(--foreground)]">{summary.totalTokensUsd}</dd>
              </div>
              <div>
                <dt className="text-[var(--muted)]">DeFi (supplies)</dt>
                <dd className="tabular-nums text-[var(--foreground)]">{summary.totalDefiUsd}</dd>
              </div>
            </dl>
          ) : null}
        </div>
      </div>
    </div>
  );
}

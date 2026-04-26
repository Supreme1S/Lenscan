"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Table, TBody, Td, Th, THead, Tr } from "@/components/ui/Table";
import type { TokenHolding } from "@/lib/types/portfolio";

const LOW_VALUE_THRESHOLD = 1; // USD — DeBank uses ~$2; we go a bit tighter for Sui dust

type SortKey = "asset" | "price" | "change24h" | "amount" | "value" | "allocation";

function compareToken(a: TokenHolding, b: TokenHolding, key: SortKey): number {
  switch (key) {
    case "asset":
      return a.symbol.localeCompare(b.symbol);
    case "price":
      return (
        parseFloat(a.priceUsd.replace(/[^0-9.]/g, "")) -
        parseFloat(b.priceUsd.replace(/[^0-9.]/g, ""))
      );
    case "change24h":
      return (a.change24hPct ?? -999) - (b.change24hPct ?? -999);
    case "amount":
      return (
        parseFloat(a.amount.replace(/,/g, "")) -
        parseFloat(b.amount.replace(/,/g, ""))
      );
    case "value":
      return a.valueUsd - b.valueUsd;
    case "allocation":
      return a.allocationPct - b.allocationPct;
    default:
      return 0;
  }
}

function sortRows(
  rows: TokenHolding[],
  key: SortKey,
  dir: "asc" | "desc",
): TokenHolding[] {
  const copy = [...rows];
  copy.sort((a, b) => (dir === "asc" ? compareToken(a, b, key) : -compareToken(a, b, key)));
  return copy;
}

function TokenRow({ t }: { t: TokenHolding }) {
  return (
    <Tr>
      <Td>
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--surface-muted)] text-xs font-bold text-[var(--muted)]">
            {t.symbol.slice(0, 2)}
          </span>
          <div>
            <div className="font-medium text-[var(--foreground)]">{t.symbol}</div>
            <div className="text-xs text-[var(--muted)]">{t.name}</div>
          </div>
        </div>
      </Td>
      <Td className="tabular-nums text-[var(--foreground)]">{t.priceUsd}</Td>
      <Td>
        {t.change24hPct === null ? (
          <span className="text-[var(--muted)]">—</span>
        ) : (
          <Badge tone={t.change24hPct >= 0 ? "success" : "danger"}>
            {t.change24hPct >= 0 ? "+" : ""}
            {t.change24hPct}%
          </Badge>
        )}
      </Td>
      <Td className="tabular-nums text-[var(--foreground)]">{t.amount}</Td>
      <Td className="tabular-nums font-medium text-[var(--foreground)]">
        {t.valueUsdFormatted}
      </Td>
      <Td className="tabular-nums text-[var(--muted)]">
        {t.allocationPct.toFixed(1)}%
      </Td>
    </Tr>
  );
}

export function HoldingsTable({ rows }: { rows: TokenHolding[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("value");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [showLowValue, setShowLowValue] = useState(false);

  const { mainRows, lowRows, lowTotal } = useMemo(() => {
    const sorted = sortRows(rows, sortKey, sortDir);
    const main: TokenHolding[] = [];
    const low: TokenHolding[] = [];
    for (const t of sorted) {
      if (t.valueUsd < LOW_VALUE_THRESHOLD) low.push(t);
      else main.push(t);
    }
    const total = low.reduce((acc, t) => acc + t.valueUsd, 0);
    return { mainRows: main, lowRows: low, lowTotal: total };
  }, [rows, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "asset" ? "asc" : "desc");
    }
  }

  const arrow = (k: SortKey) =>
    sortKey === k ? (sortDir === "asc" ? "↑" : "↓") : "";

  return (
    <div className="surface-card p-5">
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="text-base font-semibold text-[var(--foreground)]">
          Wallet
        </h2>
        <span className="text-xs text-[var(--muted)]">
          {mainRows.length + lowRows.length} tokens
        </span>
      </div>
      <Table>
        <THead>
          <Tr>
            <Th>
              <button
                type="button"
                onClick={() => toggleSort("asset")}
                className="font-medium text-[var(--muted)] hover:text-[var(--foreground)]"
              >
                Asset {arrow("asset")}
              </button>
            </Th>
            <Th>
              <button
                type="button"
                onClick={() => toggleSort("price")}
                className="font-medium text-[var(--muted)] hover:text-[var(--foreground)]"
              >
                Price {arrow("price")}
              </button>
            </Th>
            <Th>
              <button
                type="button"
                onClick={() => toggleSort("change24h")}
                className="font-medium text-[var(--muted)] hover:text-[var(--foreground)]"
              >
                24h {arrow("change24h")}
              </button>
            </Th>
            <Th>
              <button
                type="button"
                onClick={() => toggleSort("amount")}
                className="font-medium text-[var(--muted)] hover:text-[var(--foreground)]"
              >
                Amount {arrow("amount")}
              </button>
            </Th>
            <Th>
              <button
                type="button"
                onClick={() => toggleSort("value")}
                className="font-medium text-[var(--muted)] hover:text-[var(--foreground)]"
              >
                Value {arrow("value")}
              </button>
            </Th>
            <Th>
              <button
                type="button"
                onClick={() => toggleSort("allocation")}
                className="font-medium text-[var(--muted)] hover:text-[var(--foreground)]"
              >
                Alloc % {arrow("allocation")}
              </button>
            </Th>
          </Tr>
        </THead>
        <TBody>
          {mainRows.map((t) => (
            <TokenRow key={t.symbol} t={t} />
          ))}
          {showLowValue && lowRows.map((t) => (
            <TokenRow key={t.symbol} t={t} />
          ))}
        </TBody>
      </Table>

      {lowRows.length > 0 ? (
        <button
          type="button"
          onClick={() => setShowLowValue((v) => !v)}
          className="mt-3 flex w-full items-center justify-between rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface-muted)]/40 px-4 py-2.5 text-xs text-[var(--muted)] transition-colors hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)]"
          aria-expanded={showLowValue}
        >
          <span>
            {showLowValue
              ? `Hide ${lowRows.length} low-value tokens`
              : `${lowRows.length} tokens under $${LOW_VALUE_THRESHOLD} not shown`}
          </span>
          <span className="flex items-center gap-3 tabular-nums">
            <span>${lowTotal.toFixed(2)}</span>
            <span aria-hidden>{showLowValue ? "▴" : "▾"}</span>
          </span>
        </button>
      ) : null}
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Table, TBody, Td, Th, THead, Tr } from "@/components/ui/Table";
import type { TokenHolding } from "@/lib/types/portfolio";

type SortKey = "asset" | "price" | "change24h" | "amount" | "value" | "allocation";

export function HoldingsTable({ rows }: { rows: TokenHolding[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("value");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const sorted = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "asset":
          cmp = a.symbol.localeCompare(b.symbol);
          break;
        case "price":
          cmp =
            parseFloat(a.priceUsd.replace(/[^0-9.]/g, "")) -
            parseFloat(b.priceUsd.replace(/[^0-9.]/g, ""));
          break;
        case "change24h":
          cmp = (a.change24hPct ?? -999) - (b.change24hPct ?? -999);
          break;
        case "amount":
          cmp =
            parseFloat(a.amount.replace(/,/g, "")) -
            parseFloat(b.amount.replace(/,/g, ""));
          break;
        case "value":
          cmp = a.valueUsd - b.valueUsd;
          break;
        case "allocation":
          cmp = a.allocationPct - b.allocationPct;
          break;
        default:
          cmp = 0;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return copy;
  }, [rows, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "asset" ? "asc" : "desc");
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-slate-50/80 p-4 shadow-sm">
      <h2 className="mb-3 text-sm font-semibold text-slate-900">Holdings</h2>
      <Table>
        <THead>
          <Tr>
            <Th>
              <button
                type="button"
                onClick={() => toggleSort("asset")}
                className="font-medium text-slate-600 hover:text-slate-900"
              >
                Asset {sortKey === "asset" ? (sortDir === "asc" ? "↑" : "↓") : ""}
              </button>
            </Th>
            <Th>
              <button
                type="button"
                onClick={() => toggleSort("price")}
                className="font-medium text-slate-600 hover:text-slate-900"
              >
                Price {sortKey === "price" ? (sortDir === "asc" ? "↑" : "↓") : ""}
              </button>
            </Th>
            <Th>
              <button
                type="button"
                onClick={() => toggleSort("change24h")}
                className="font-medium text-slate-600 hover:text-slate-900"
              >
                24h {sortKey === "change24h" ? (sortDir === "asc" ? "↑" : "↓") : ""}
              </button>
            </Th>
            <Th>
              <button
                type="button"
                onClick={() => toggleSort("amount")}
                className="font-medium text-slate-600 hover:text-slate-900"
              >
                Amount {sortKey === "amount" ? (sortDir === "asc" ? "↑" : "↓") : ""}
              </button>
            </Th>
            <Th>
              <button
                type="button"
                onClick={() => toggleSort("value")}
                className="font-medium text-slate-600 hover:text-slate-900"
              >
                Value {sortKey === "value" ? (sortDir === "asc" ? "↑" : "↓") : ""}
              </button>
            </Th>
            <Th>
              <button
                type="button"
                onClick={() => toggleSort("allocation")}
                className="font-medium text-slate-600 hover:text-slate-900"
              >
                Alloc % {sortKey === "allocation" ? (sortDir === "asc" ? "↑" : "↓") : ""}
              </button>
            </Th>
          </Tr>
        </THead>
        <TBody>
          {sorted.map((t) => (
            <Tr key={t.symbol}>
              <Td>
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200/80 text-xs font-bold text-slate-600">
                    {t.symbol.slice(0, 2)}
                  </span>
                  <div>
                    <div className="font-medium text-slate-900">{t.symbol}</div>
                    <div className="text-xs text-slate-500">{t.name}</div>
                  </div>
                </div>
              </Td>
              <Td className="tabular-nums text-slate-700">{t.priceUsd}</Td>
              <Td>
                {t.change24hPct === null ? (
                  <span className="text-slate-400">—</span>
                ) : (
                  <Badge tone={t.change24hPct >= 0 ? "success" : "danger"}>
                    {t.change24hPct >= 0 ? "+" : ""}
                    {t.change24hPct}%
                  </Badge>
                )}
              </Td>
              <Td className="tabular-nums text-slate-700">{t.amount}</Td>
              <Td className="tabular-nums font-medium text-slate-900">
                {t.valueUsdFormatted}
              </Td>
              <Td className="tabular-nums text-slate-600">
                {t.allocationPct.toFixed(1)}%
              </Td>
            </Tr>
          ))}
        </TBody>
      </Table>
    </div>
  );
}

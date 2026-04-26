/**
 * Phase 2: assemble a real portfolio for a Sui address from on-chain RPC + DefiLlama prices.
 *
 *  1. suix_getAllBalances — list of coin types + raw totalBalance
 *  2. DefiLlama /prices/current/sui:<coinType>... — price + decimals + symbol
 *  3. For coins DefiLlama can't price → fall back to suix_getCoinMetadata for decimals/symbol
 *
 * Returns the same domain types `<HoldingsTable />` already renders, so the
 * presentation layer stays untouched.
 */

import { fetchSuiPrices, type LlamaPrice } from "@/lib/prices/defiLlama";
import { fetchCoinMetadataMany } from "@/lib/sui/metadata";
import { getAllBalances, type SuiBalance } from "@/lib/sui/rpc";
import type {
  AllocationSlice,
  PortfolioSummary,
  TokenHolding,
} from "@/lib/types/portfolio";

const ALLOC_COLORS = {
  Native: "#4DA2FF",
  Stable: "#22c55e",
  Other: "#94a3b8",
} as const;

const STABLE_SYMBOLS = new Set([
  "USDC",
  "USDT",
  "DAI",
  "FDUSD",
  "USDY",
  "USDH",
  "AUSD",
  "PYUSD",
]);

type SymbolHint = { decimals?: number; symbol?: string; name?: string };

function shortSymbolFromCoinType(coinType: string): string {
  // Looks like 0x...::module::TYPE — take TYPE
  const tail = coinType.split("::").at(-1) ?? coinType;
  return tail.replace(/[^A-Za-z0-9]/g, "").slice(0, 8) || "?";
}

function formatPrice(p: number): string {
  if (p === 0) return "$0";
  if (p < 0.001) return `$${p.toExponential(2)}`;
  if (p < 1) return `$${p.toFixed(4)}`;
  if (p < 100) return `$${p.toFixed(3)}`;
  return `$${p.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
}

function formatAmount(n: number): string {
  if (n === 0) return "0";
  if (n < 0.0001) return n.toExponential(2);
  if (n < 1) return n.toFixed(4);
  if (n < 1000) return n.toFixed(3);
  return n.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

function formatUsd(v: number): string {
  if (v === 0) return "$0.00";
  if (v < 0.01) return `<$0.01`;
  return `$${v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export type RealPortfolio = {
  summary: PortfolioSummary;
  tokenHoldings: TokenHolding[];
  allocation: AllocationSlice[];
  /** Coins the API couldn't price (tracked but not in net worth). */
  unpricedCount: number;
  /** True when the wallet had zero coins on chain. */
  empty: boolean;
};

export async function buildRealPortfolio(
  address: string,
  signal?: AbortSignal,
): Promise<RealPortfolio> {
  const balances: SuiBalance[] = await getAllBalances(address, { signal });
  if (balances.length === 0) {
    return {
      summary: emptySummary(address),
      tokenHoldings: [],
      allocation: [],
      unpricedCount: 0,
      empty: true,
    };
  }

  // Filter zero balances early (they bloat the address; common after airdrops).
  const nonZero = balances.filter((b) => b.totalBalance !== "0");
  const coinTypes = nonZero.map((b) => b.coinType);

  // Step 1 — prices in one batched call(s)
  const prices = await fetchSuiPrices(coinTypes, signal);

  // Step 2 — metadata fallback only for coins DefiLlama doesn't know
  const missing = coinTypes.filter((ct) => !prices[ct]);
  const metadata = missing.length > 0 ? await fetchCoinMetadataMany(missing, signal) : {};

  // Build rows
  type Pre = TokenHolding & { _coinType: string };
  const pre: Pre[] = nonZero.map((b) => {
    const p: LlamaPrice | undefined = prices[b.coinType];
    const md = metadata[b.coinType];
    const hint: SymbolHint = p
      ? { decimals: p.decimals, symbol: p.symbol }
      : md
        ? { decimals: md.decimals, symbol: md.symbol, name: md.name }
        : {};
    const decimals = hint.decimals ?? 9;
    const symbol = hint.symbol ?? shortSymbolFromCoinType(b.coinType);
    const name = hint.name ?? symbol;

    const raw = BigInt(b.totalBalance);
    const denom = 10 ** decimals;
    const amountFloat = Number(raw) / denom;
    const priceUsd = p?.price ?? 0;
    const valueUsd = amountFloat * priceUsd;

    return {
      symbol,
      name,
      priceUsd: formatPrice(priceUsd),
      change24hPct: null,
      amount: formatAmount(amountFloat),
      valueUsd,
      valueUsdFormatted: formatUsd(valueUsd),
      allocationPct: 0,
      _coinType: b.coinType,
    };
  });

  const totalValue = pre.reduce((acc, r) => acc + r.valueUsd, 0);
  const tokenHoldings: TokenHolding[] = pre
    .map((r) => ({
      ...r,
      allocationPct: totalValue > 0 ? (r.valueUsd / totalValue) * 100 : 0,
    }))
    .sort((a, b) => b.valueUsd - a.valueUsd);

  // Allocation: Native (SUI) / Stable / Other
  let nativeUsd = 0;
  let stableUsd = 0;
  let otherUsd = 0;
  for (const t of tokenHoldings) {
    if (t.symbol === "SUI") nativeUsd += t.valueUsd;
    else if (STABLE_SYMBOLS.has(t.symbol.toUpperCase())) stableUsd += t.valueUsd;
    else otherUsd += t.valueUsd;
  }
  const allocationRaw: { label: keyof typeof ALLOC_COLORS; v: number }[] = [
    { label: "Native", v: nativeUsd },
    { label: "Stable", v: stableUsd },
    { label: "Other", v: otherUsd },
  ];
  const allocation: AllocationSlice[] = allocationRaw
    .filter((s) => s.v > 0)
    .map((s) => ({
      label: s.label,
      pct: totalValue > 0 ? Math.round((s.v / totalValue) * 1000) / 10 : 0,
      color: ALLOC_COLORS[s.label],
    }));

  const summary: PortfolioSummary = {
    walletAddress: address,
    netWorthUsd: formatUsd(totalValue),
    totalTokensUsd: formatUsd(totalValue),
    totalDefiUsd: "$0.00",
  };

  return {
    summary,
    tokenHoldings,
    allocation,
    unpricedCount: missing.length,
    empty: false,
  };
}

function emptySummary(address: string): PortfolioSummary {
  return {
    walletAddress: address,
    netWorthUsd: "$0.00",
    totalTokensUsd: "$0.00",
    totalDefiUsd: "$0.00",
  };
}

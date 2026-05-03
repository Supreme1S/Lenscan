/**
 * Phase 2: assemble a real portfolio for a Sui address from on-chain RPC + DefiLlama prices.
 *
 *  1. suix_getAllBalances — list of coin types + raw totalBalance
 *  2. DefiLlama /prices/current/sui:<coinType>... — price + decimals + symbol
 *  3. Birdeye multi_price for coins still missing (optional BIRDEYE_API_KEY)
 *  4. suix_getCoinMetadata for decimals/symbol when Llama didn't return the coin (incl. Birdeye-only rows)
 *
 * Returns the same domain types `<HoldingsTable />` already renders, so the
 * presentation layer stays untouched.
 */

import { fetchBirdeyePrices } from "@/lib/prices/birdeye";
import {
  fetchSuiPrices,
  type LlamaPrice,
  type LlamaPriceMap,
} from "@/lib/prices/defiLlama";
import { getDefiPositions } from "@/lib/defi/protocols";
import { fetchCoinMetadataMany } from "@/lib/sui/metadata";
import { getAllBalances, type SuiBalance } from "@/lib/sui/rpc";
import type {
  AllocationSlice,
  DefiPosition,
  PortfolioSummary,
  TokenHolding,
} from "@/lib/types/portfolio";

/** Thrown when Sui RPC balance fetch fails; other stages soft-fail inside `buildRealPortfolio`. */
export class PortfolioBuildError extends Error {
  constructor(
    public readonly stage: "rpc_balances",
    message: string,
  ) {
    super(message);
    this.name = "PortfolioBuildError";
  }
}

function errMsg(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}

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
  defiPositions: DefiPosition[];
};

export async function buildRealPortfolio(
  address: string,
  signal?: AbortSignal,
): Promise<RealPortfolio> {
  let balances: SuiBalance[];
  try {
    balances = await getAllBalances(address, { signal });
  } catch (e) {
    throw new PortfolioBuildError("rpc_balances", errMsg(e));
  }

  if (balances.length === 0) {
    console.log(
      JSON.stringify({
        address,
        total_coins: 0,
        priced: 0,
        unpriced: 0,
        net_worth_usd: 0,
        defi_usd: 0,
      }),
    );
    return {
      summary: emptySummary(address),
      tokenHoldings: [],
      allocation: [],
      defiPositions: [],
      unpricedCount: 0,
      empty: true,
    };
  }

  // Filter zero balances early (they bloat the address; common after airdrops).
  const nonZero = balances.filter((b) => b.totalBalance !== "0");
  const coinTypes = nonZero.map((b) => b.coinType);

  // Step 1 — DefiLlama prices (soft fail)
  let llamaPrices: LlamaPriceMap = {};
  try {
    llamaPrices = await fetchSuiPrices(coinTypes, signal);
  } catch (e) {
    console.error(
      JSON.stringify({
        address,
        stage: "defillama_prices",
        error: errMsg(e),
        coinTypes,
      }),
    );
    if (e instanceof Error && e.stack) {
      console.error(e.stack);
    }
  }
  const prices: LlamaPriceMap = { ...llamaPrices };

  // Step 2 — Birdeye for coins Llama missed (soft fail)
  const missingFromLlama = coinTypes.filter((ct) => !llamaPrices[ct]);
  try {
    const birdeyePrices = await fetchBirdeyePrices(missingFromLlama, signal);
    for (const [ct, row] of Object.entries(birdeyePrices)) {
      if (row) prices[ct] = row;
    }
  } catch (e) {
    console.warn(
      JSON.stringify({
        address,
        stage: "birdeye_prices",
        error: errMsg(e),
      }),
    );
  }

  // Step 3 — metadata: no merged price yet, or Birdeye-only row (decimals=0 sentinel)
  const missingMeta = coinTypes.filter((ct) => {
    const p = prices[ct];
    return !p || p.decimals === 0;
  });
  let metadata: Awaited<ReturnType<typeof fetchCoinMetadataMany>> = {};
  if (missingMeta.length > 0) {
    try {
      metadata = await fetchCoinMetadataMany(missingMeta, signal);
    } catch (e) {
      console.warn(
        JSON.stringify({
          address,
          stage: "coin_metadata",
          error: errMsg(e),
        }),
      );
      metadata = {};
    }
  }

  // Build rows
  const pre: TokenHolding[] = nonZero.map((b) => {
    const p: LlamaPrice | undefined = prices[b.coinType];
    const fromLlama = Boolean(llamaPrices[b.coinType]);
    const md = metadata[b.coinType];

    let hint: SymbolHint;
    if (fromLlama && p) {
      hint = { decimals: p.decimals, symbol: p.symbol };
    } else if (md) {
      hint = { decimals: md.decimals, symbol: md.symbol, name: md.name };
    } else if (p && p.decimals > 0) {
      hint = { decimals: p.decimals, symbol: p.symbol };
    } else {
      hint = {};
    }

    const decimals = hint.decimals ?? 9;
    const symbol =
      hint.symbol && hint.symbol.length > 0
        ? hint.symbol
        : shortSymbolFromCoinType(b.coinType);
    const name = hint.name ?? symbol;

    const raw = BigInt(b.totalBalance);
    const denom = 10 ** decimals;
    const amountFloat = Number(raw) / denom;
    const priceUsd = p?.price ?? 0;
    const valueUsd = amountFloat * priceUsd;

    return {
      coinType: b.coinType,
      symbol,
      name,
      priceUsd: formatPrice(priceUsd),
      change24hPct: null,
      amount: formatAmount(amountFloat),
      valueUsd,
      valueUsdFormatted: formatUsd(valueUsd),
      allocationPct: 0,
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

  let defiPositions: DefiPosition[] = [];
  try {
    defiPositions = await getDefiPositions(address, signal);
  } catch {
    // soft fail — DeFi is additive, never block portfolio load
  }

  const defiTotal = defiPositions
    .filter((p) => p.side !== "borrow")
    .reduce((s, p) => s + (p.valueUsd ?? 0), 0);
  const borrowTotal = defiPositions
    .filter((p) => p.side === "borrow")
    .reduce((s, p) => s + (p.valueUsd ?? 0), 0);
  const netWorthTotal = totalValue + defiTotal - borrowTotal;
  const summary: PortfolioSummary = {
    walletAddress: address,
    netWorthUsd: formatUsd(netWorthTotal),
    totalTokensUsd: formatUsd(totalValue),
    totalDefiUsd: formatUsd(defiTotal),
  };

  const unpricedCount = coinTypes.filter((ct) => {
    const pr = prices[ct];
    return pr == null || pr.price <= 0;
  }).length;
  const pricedCount = coinTypes.filter((ct) => {
    const pr = prices[ct];
    return pr != null && pr.price > 0;
  }).length;

  console.log(
    JSON.stringify({
      address,
      total_coins: balances.length,
      priced: pricedCount,
      unpriced: unpricedCount,
      net_worth_usd: netWorthTotal,
      defi_usd: defiTotal,
    }),
  );

  return {
    summary,
    tokenHoldings,
    allocation,
    unpricedCount,
    empty: false,
    defiPositions,
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


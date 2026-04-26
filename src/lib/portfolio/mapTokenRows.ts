import type { TokenHolding } from "@/lib/types/portfolio";

export type WalletTokenRow = {
  id: string;
  symbol: string;
  name: string;
  priceLabel: string;
  change24hPct: number | null;
  amountLabel: string;
  valueUsd: number;
};

export function mapHoldingsToTokenRows(holdings: TokenHolding[]): WalletTokenRow[] {
  return holdings.map((t) => ({
    id: t.coinType,
    symbol: t.symbol,
    name: t.name,
    priceLabel: t.priceUsd,
    change24hPct: t.change24hPct,
    amountLabel: t.amount,
    valueUsd: t.valueUsd,
  }));
}

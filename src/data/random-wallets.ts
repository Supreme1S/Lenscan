/**
 * Pool of real mainnet addresses (recent transaction senders), refreshed offline.
 * See `top-sui-wallets.generated.json` — regenerate with `npm run data:top-wallets`.
 */
import pool from "./top-sui-wallets.generated.json";

function isSuiAddress(v: unknown): v is string {
  return typeof v === "string" && /^0x[a-fA-F0-9]{64}$/.test(v);
}

export const TOP_SUI_WALLET_ADDRESSES: readonly string[] = (
  Array.isArray(pool.addresses) ? pool.addresses : []
).filter(isSuiAddress);

export function pickRandomWallet(): string {
  const list = TOP_SUI_WALLET_ADDRESSES;
  if (list.length === 0) {
    throw new Error("TOP_SUI_WALLET_ADDRESSES is empty");
  }
  const i = Math.floor(Math.random() * list.length);
  return list[i] ?? list[0];
}

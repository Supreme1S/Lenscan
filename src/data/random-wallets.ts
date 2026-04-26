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

function randomIndex(length: number): number {
  if (length <= 0) throw new Error("randomIndex: length must be positive");
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    return buf[0]! % length;
  }
  return Math.floor(Math.random() * length);
}

type PickOpts = {
  /** Prefer a different address than this (e.g. last pick) when the pool has more than one. */
  avoid?: string;
};

export function pickRandomWallet(opts?: PickOpts): string {
  const list = TOP_SUI_WALLET_ADDRESSES;
  if (list.length === 0) {
    throw new Error("TOP_SUI_WALLET_ADDRESSES is empty");
  }
  const avoid = opts?.avoid;
  if (list.length === 1 || !avoid || !list.includes(avoid)) {
    return list[randomIndex(list.length)]!;
  }
  let picked = list[randomIndex(list.length)]!;
  let guard = 0;
  while (picked === avoid && guard < 64) {
    picked = list[randomIndex(list.length)]!;
    guard += 1;
  }
  return picked;
}

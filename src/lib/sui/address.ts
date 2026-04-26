/**
 * Lightweight Sui address helpers (no SDK dependency).
 * Sui addresses are 32-byte hex strings prefixed with `0x` (length 66 with prefix).
 * We accept shorter user input (down to 1 hex char) and let RPC reject invalid ones.
 */

const SHORT_RE = /^0x[a-fA-F0-9]{1,64}$/;
const FULL_RE = /^0x[a-fA-F0-9]{64}$/;

export function isValidSuiAddress(input: string): boolean {
  return FULL_RE.test(input.trim());
}

export function isPlausibleSuiAddress(input: string): boolean {
  return SHORT_RE.test(input.trim());
}

export function normalizeSuiAddress(input: string): string {
  const s = input.trim().toLowerCase();
  if (!s.startsWith("0x")) return s;
  if (FULL_RE.test(s)) return s;
  if (!SHORT_RE.test(s)) return s;
  // Pad to 64 hex chars after `0x`
  return "0x" + s.slice(2).padStart(64, "0");
}

export function shortenAddress(addr: string, head = 6, tail = 4): string {
  const s = addr.trim();
  if (s.length <= head + tail + 3) return s;
  return `${s.slice(0, head)}…${s.slice(-tail)}`;
}

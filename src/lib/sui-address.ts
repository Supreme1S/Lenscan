/** Sui address: 0x + 64 hex characters (66 total). */

const SUI_ADDRESS_REGEX = /^0x[a-fA-F0-9]{64}$/;

export function isValidSuiAddress(value: string): boolean {
  const v = value.trim();
  return SUI_ADDRESS_REGEX.test(v);
}

export function normalizeSuiAddress(value: string): string {
  return value.trim();
}

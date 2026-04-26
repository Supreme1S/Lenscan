/** Placeholder Sui-format addresses (0x + 64 hex). Replace with real curated list later. */

export const RANDOM_WALLETS: string[] = [
  "0x1111111111111111111111111111111111111111111111111111111111111111",
  "0x2222222222222222222222222222222222222222222222222222222222222222",
  "0x3333333333333333333333333333333333333333333333333333333333333333",
  "0x4444444444444444444444444444444444444444444444444444444444444444",
  "0x5555555555555555555555555555555555555555555555555555555555555555",
  "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
  "0xcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc",
  "0xdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd",
  "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
  "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
  "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
  "0xfedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210",
  "0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef",
  "0xcafebabecafebabecafebabecafebabecafebabecafebabecafebabecafebabe",
  "0x0000000000000000000000000000000000000000000000000000000000000001",
  "0x0000000000000000000000000000000000000000000000000000000000000002",
  "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffed",
  "0x9abcdef0123456789abcdef0123456789abcdef0123456789abcdef01234567",
  "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
];

export function pickRandomWallet(): string {
  const i = Math.floor(Math.random() * RANDOM_WALLETS.length);
  return RANDOM_WALLETS[i] ?? RANDOM_WALLETS[0];
}

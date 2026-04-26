/**
 * Sui wallet adapter — Phase 1 stub.
 * Replace with @mysten/dapp-kit / wallet-standard when wiring real auth.
 */

export type WalletConnectionState = "disconnected" | "connecting" | "connected";

export async function connectSuiWallet(): Promise<string | null> {
  return null;
}

export async function disconnectSuiWallet(): Promise<void> {}

export function getConnectedAddress(): string | null {
  return null;
}

export function getWalletConnectionState(): WalletConnectionState {
  return "disconnected";
}

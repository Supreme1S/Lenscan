"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type WalletContextValue = {
  connectedAddress: string | null;
  connect: () => void;
  disconnect: () => void;
};

const WalletContext = createContext<WalletContextValue | null>(null);

/** Phase 1–2 stub: replace with @mysten/dapp-kit / wallet-standard. */
export function WalletProvider({ children }: { children: ReactNode }) {
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);

  const connect = useCallback(() => {
    setConnectedAddress(
      "0x1a2b3c4d5e6f708192a3b4c5d6e7f8091a2b3c4d5e6f708192a3b4c5d6e7f8091",
    );
  }, []);

  const disconnect = useCallback(() => {
    setConnectedAddress(null);
  }, []);

  const value = useMemo(
    () => ({ connectedAddress, connect, disconnect }),
    [connectedAddress, connect, disconnect],
  );

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}

export function useWallet(): WalletContextValue {
  const ctx = useContext(WalletContext);
  if (!ctx) {
    throw new Error("useWallet must be used within WalletProvider");
  }
  return ctx;
}

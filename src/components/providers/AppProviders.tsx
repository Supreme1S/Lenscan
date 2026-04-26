"use client";

import { getJsonRpcFullnodeUrl } from "@mysten/sui/jsonRpc";
import {
  SuiClientProvider,
  WalletProvider,
  createNetworkConfig,
} from "@mysten/dapp-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

import "@mysten/dapp-kit/dist/index.css";

const customRpc = process.env.NEXT_PUBLIC_SUI_RPC_URL?.trim();

const { networkConfig } = createNetworkConfig({
  mainnet: {
    network: "mainnet",
    url: customRpc || getJsonRpcFullnodeUrl("mainnet"),
  },
  testnet: {
    network: "testnet",
    url: getJsonRpcFullnodeUrl("testnet"),
  },
});

export function AppProviders({ children }: { children: ReactNode }) {
  const [qc] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={qc}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="mainnet">
        <WalletProvider autoConnect>{children}</WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}

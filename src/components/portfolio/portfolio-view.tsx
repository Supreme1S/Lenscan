"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CopilotTab } from "@/components/portfolio/copilot-tab";
import { NftsTab } from "@/components/portfolio/nfts-tab";
import { ProtocolBlocks } from "@/components/portfolio/protocol-blocks";
import { ProtocolTiles } from "@/components/portfolio/protocol-tiles";
import { TransactionsTab } from "@/components/portfolio/transactions-tab";
import { WalletHeader } from "@/components/portfolio/wallet-header";
import { WalletTokensTable } from "@/components/portfolio/wallet-tokens-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MOCK_NFT_COLLECTIONS } from "@/data/mock-nfts";
import {
  MOCK_PROTOCOL_BLOCKS,
  MOCK_PROTOCOL_TILES,
  MOCK_WALLET_TOKENS,
} from "@/data/mock-portfolio";
import { MOCK_TRANSACTIONS } from "@/data/mock-transactions";
import { useWallet } from "@/contexts/wallet-context";
import { isValidSuiAddress, normalizeSuiAddress } from "@/lib/sui-address";

export function PortfolioView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { connectedAddress } = useWallet();
  const [refreshing, setRefreshing] = useState(false);
  const [showDustBlocks, setShowDustBlocks] = useState(false);

  const rawAddress = searchParams.get("address")?.trim() ?? "";
  const normalizedUrl = rawAddress ? normalizeSuiAddress(rawAddress) : "";

  const effectiveAddress = useMemo(() => {
    if (normalizedUrl && isValidSuiAddress(normalizedUrl)) return normalizedUrl;
    return connectedAddress;
  }, [normalizedUrl, connectedAddress]);

  const tabParam = searchParams.get("tab");
  const tab =
    tabParam === "nfts" ||
    tabParam === "transactions" ||
    tabParam === "copilot"
      ? tabParam
      : "portfolio";

  useEffect(() => {
    if (!effectiveAddress) {
      router.replace("/");
    }
  }, [effectiveAddress, router]);

  const setTab = useCallback(
    (value: string) => {
      if (!effectiveAddress) return;
      const v =
        value === "nfts" || value === "transactions" || value === "copilot"
          ? value
          : "portfolio";
      router.replace(
        `/portfolio?address=${encodeURIComponent(effectiveAddress)}&tab=${v}`,
      );
    },
    [effectiveAddress, router],
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 900);
  }, []);

  if (!effectiveAddress) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-[var(--muted)]">
        Redirecting…
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)]">
      <WalletHeader
        address={effectiveAddress}
        suinsName={null}
        onRefresh={onRefresh}
        refreshing={refreshing}
      />
      <div className="mx-auto max-w-[1440px] space-y-6 px-4 py-6 sm:px-6">
        <ProtocolTiles
          tiles={MOCK_PROTOCOL_TILES}
          onExpandDust={() => setShowDustBlocks(true)}
        />

        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto sm:w-auto">
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="nfts">NFTs</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="copilot">Copilot</TabsTrigger>
          </TabsList>
          <TabsContent value="portfolio" className="space-y-8">
            <WalletTokensTable
              tokens={MOCK_WALLET_TOKENS}
              refreshing={refreshing}
            />
            <ProtocolBlocks
              blocks={MOCK_PROTOCOL_BLOCKS}
              showDust={showDustBlocks}
              refreshing={refreshing}
            />
          </TabsContent>
          <TabsContent value="nfts">
            <NftsTab collections={MOCK_NFT_COLLECTIONS} />
          </TabsContent>
          <TabsContent value="transactions">
            <TransactionsTab transactions={MOCK_TRANSACTIONS} />
          </TabsContent>
          <TabsContent value="copilot">
            <CopilotTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

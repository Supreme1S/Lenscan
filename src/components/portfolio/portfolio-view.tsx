"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { startTransition, useCallback, useEffect, useMemo, useState } from "react";
import { CopilotTab } from "@/components/portfolio/copilot-tab";
import { NftsTab } from "@/components/portfolio/nfts-tab";
import { ProtocolBlocks } from "@/components/portfolio/protocol-blocks";
import { ProtocolTiles } from "@/components/portfolio/protocol-tiles";
import { TransactionsTab } from "@/components/portfolio/transactions-tab";
import { WalletHeader } from "@/components/portfolio/wallet-header";
import { WalletTokensTable } from "@/components/portfolio/wallet-tokens-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { MockNftCollection } from "@/data/mock-nfts";
import type { MockProtocolTile } from "@/data/mock-portfolio";
import type { MockTransaction } from "@/data/mock-transactions";
import { SUI_CHAIN_ICON_URL } from "@/lib/constants/asset-icons";
import type { RealPortfolio } from "@/lib/portfolio/buildPortfolio";
import { mapHoldingsToTokenRows, type WalletTokenRow } from "@/lib/portfolio/mapTokenRows";
import { isValidSuiAddress, normalizeSuiAddress } from "@/lib/sui-address";

export function PortfolioView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [refreshing, setRefreshing] = useState(false);
  const [showDustBlocks, setShowDustBlocks] = useState(false);
  const [tokens, setTokens] = useState<WalletTokenRow[]>([]);
  const [collections, setCollections] = useState<MockNftCollection[]>([]);
  const [transactions, setTransactions] = useState<MockTransaction[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const rawAddress = searchParams.get("address")?.trim() ?? "";
  const normalizedUrl = rawAddress ? normalizeSuiAddress(rawAddress) : "";

  const effectiveAddress = useMemo(() => {
    if (normalizedUrl && isValidSuiAddress(normalizedUrl)) return normalizedUrl;
    return null;
  }, [normalizedUrl]);

  const tabParam = searchParams.get("tab");
  const tab =
    tabParam === "nfts" || tabParam === "transactions" || tabParam === "copilot"
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

  const loadData = useCallback(
    async (opts?: { silent?: boolean }) => {
      if (!effectiveAddress) return;
      const silent = opts?.silent ?? false;
      if (!silent) setIsLoading(true);
      setLoadError(null);
      const q = encodeURIComponent(effectiveAddress);
      try {
        const [pr, nr, tr] = await Promise.all([
          fetch(`/api/wallet/portfolio?address=${q}`, { cache: "no-store" }),
          fetch(`/api/wallet/nfts?address=${q}`, { cache: "no-store" }),
          fetch(`/api/wallet/transactions?address=${q}&limit=50`, { cache: "no-store" }),
        ]);
        if (!pr.ok) {
          const body = (await pr.json().catch(() => null)) as { error?: string } | null;
          throw new Error(body?.error ?? `Portfolio request failed (${pr.status})`);
        }
        if (!nr.ok) {
          const body = (await nr.json().catch(() => null)) as { error?: string } | null;
          throw new Error(body?.error ?? `NFT request failed (${nr.status})`);
        }
        if (!tr.ok) {
          const body = (await tr.json().catch(() => null)) as { error?: string } | null;
          throw new Error(body?.error ?? `Transactions request failed (${tr.status})`);
        }
        const portfolio = (await pr.json()) as RealPortfolio;
        const nftJson = (await nr.json()) as { collections: MockNftCollection[] };
        const txJson = (await tr.json()) as { transactions: MockTransaction[] };

        setTokens(mapHoldingsToTokenRows(portfolio.tokenHoldings));
        setCollections(nftJson.collections);
        setTransactions(txJson.transactions);
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Failed to load wallet";
        setLoadError(msg);
      } finally {
        if (!silent) setIsLoading(false);
      }
    },
    [effectiveAddress],
  );

  useEffect(() => {
    if (!effectiveAddress) return;
    startTransition(() => {
      void loadData();
    });
  }, [effectiveAddress, loadData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData({ silent: true });
    setRefreshing(false);
  }, [loadData]);

  const protocolTiles: MockProtocolTile[] = useMemo(() => {
    const walletTotal = tokens.reduce((s, t) => s + t.valueUsd, 0);
    return [
      {
        id: "wallet",
        name: "Wallet",
        valueUsd: walletTotal,
        logo: "◆",
        logoUrl: SUI_CHAIN_ICON_URL,
        anchorId: "section-wallet",
        isDust: false,
      },
    ];
  }, [tokens]);

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
        onRefresh={() => void onRefresh()}
        refreshing={refreshing}
      />
      <div className="mx-auto max-w-[1440px] space-y-6 px-4 py-6 sm:px-6">
        {loadError ? (
          <div
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200"
            role="alert"
          >
            {loadError}
          </div>
        ) : null}

        <ProtocolTiles tiles={protocolTiles} onExpandDust={() => setShowDustBlocks(true)} />

        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto sm:w-auto">
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="nfts">NFTs</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="copilot">Copilot</TabsTrigger>
          </TabsList>
          <TabsContent value="portfolio" className="space-y-8">
            {isLoading && tokens.length === 0 && !loadError ? (
              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)]/80 p-10 text-center text-sm text-[var(--muted)]">
                Loading on-chain balances…
              </div>
            ) : (
              <WalletTokensTable tokens={tokens} refreshing={refreshing} />
            )}
            <ProtocolBlocks blocks={[]} showDust={showDustBlocks} refreshing={refreshing} />
          </TabsContent>
          <TabsContent value="nfts">
            {isLoading && !loadError ? (
              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)]/80 p-10 text-center text-sm text-[var(--muted)]">
                Loading NFTs…
              </div>
            ) : collections.length === 0 ? (
              <p className="text-sm text-[var(--muted)]">No displayable NFTs found for this address.</p>
            ) : (
              <NftsTab key={effectiveAddress} collections={collections} />
            )}
          </TabsContent>
          <TabsContent value="transactions">
            {isLoading && !loadError ? (
              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)]/80 p-10 text-center text-sm text-[var(--muted)]">
                Loading transactions…
              </div>
            ) : (
              <TransactionsTab key={effectiveAddress} transactions={transactions} />
            )}
          </TabsContent>
          <TabsContent value="copilot">
            <CopilotTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

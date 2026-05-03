import { NAVISDKClient } from "navi-sdk";
import type { DefiPosition } from "@/lib/types/portfolio";

/**
 * NAVI SDK requires a wallet identity to obtain a SuiClient; it is not used to
 * sign user transactions. Portfolio rows are fetched for the queried `address`.
 */
const NAVI_SDK_QUERY_MNEMONIC =
  "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";

type PortfolioEntry = { borrowBalance: number; supplyBalance: number };

let naviClient: NAVISDKClient | null = null;

function getNaviClient(): NAVISDKClient {
  if (!naviClient) {
    naviClient = new NAVISDKClient({
      networkType: "mainnet",
      mnemonic: NAVI_SDK_QUERY_MNEMONIC,
      numberOfAccounts: 1,
    });
  }
  return naviClient;
}

export const naviLendingAdapter = {
  id: "navi" as const,
  displayName: "NAVI Lending",
  async getPositions(address: string, signal?: AbortSignal): Promise<DefiPosition[]> {
    try {
      if (signal?.aborted) return [];
      const client = getNaviClient();
      const account = client.accounts[0];
      if (!account) return [];

      const map = (await account.getNAVIPortfolio(address, false)) as Map<
        string,
        PortfolioEntry
      >;

      const out: DefiPosition[] = [];
      for (const [assetSymbol, row] of map.entries()) {
        const supplyBalance = Number(row.supplyBalance);
        const borrowBalance = Number(row.borrowBalance);

        if (supplyBalance > 0) {
          out.push({
            id: `navi-supply-${assetSymbol}`,
            protocolId: "navi",
            protocolName: "NAVI Lending",
            chainId: "sui",
            category: "lending",
            side: "deposit",
            title: `Supply ${assetSymbol}`,
            assetSymbol,
            // TODO: convert token amount to USD (DefiLlama / NAVI price); balances are human-readable token units, not USD.
            valueUsd: supplyBalance,
            details: { raw: row },
          });
        }
        if (borrowBalance > 0) {
          out.push({
            id: `navi-borrow-${assetSymbol}`,
            protocolId: "navi",
            protocolName: "NAVI Lending",
            chainId: "sui",
            category: "lending",
            side: "borrow",
            title: `Borrow ${assetSymbol}`,
            assetSymbol,
            // TODO: convert token amount to USD (DefiLlama / NAVI price); balances are human-readable token units, not USD.
            valueUsd: borrowBalance,
            details: { raw: row },
          });
        }
      }
      return out;
    } catch {
      return [];
    }
  },
};

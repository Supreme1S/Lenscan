import { getAddressPortfolio, NAVISDKClient, pool } from "navi-sdk";
import type { PoolConfig } from "navi-sdk";
import { fetchSuiPrices } from "@/lib/prices/defiLlama";
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

function poolConfig(poolKey: string): PoolConfig | undefined {
  return pool[poolKey as keyof typeof pool] as PoolConfig | undefined;
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

      /**
       * `getAddressPortfolio` fourth arg `decimals`:
       * - Omitted/false: SDK overwrites with raw `fields.value` × index (huge integers) — must not treat as USD.
       * - true: keep value/1e9 × index (NAVI’s internal token amount convention per SDK).
       */
      const map = (await getAddressPortfolio(
        address,
        false,
        account.client,
        true,
      )) as Map<string, PortfolioEntry>;

      if (signal?.aborted) return [];

      const coinTypes: string[] = [];
      for (const [poolKey, row] of map.entries()) {
        const cfg = poolConfig(poolKey);
        if (!cfg) continue;
        if (Number(row.supplyBalance) > 0 || Number(row.borrowBalance) > 0) {
          coinTypes.push(cfg.type);
        }
      }

      const prices = await fetchSuiPrices([...new Set(coinTypes)], signal);

      const out: DefiPosition[] = [];
      for (const [poolKey, row] of map.entries()) {
        const cfg = poolConfig(poolKey);
        if (!cfg) continue;

        const assetSymbol = cfg.name || poolKey;
        const priceUsd = prices[cfg.type]?.price ?? 0;
        const supplyBalance = Number(row.supplyBalance);
        const borrowBalance = Number(row.borrowBalance);

        if (supplyBalance > 0) {
          out.push({
            id: `navi-supply-${poolKey}`,
            protocolId: "navi",
            protocolName: "NAVI Lending",
            chainId: "sui",
            category: "lending",
            side: "deposit",
            title: `Supply ${assetSymbol}`,
            assetSymbol,
            valueUsd: supplyBalance * priceUsd,
            details: { coinType: cfg.type, priceUsd, raw: row },
          });
        }
        if (borrowBalance > 0) {
          out.push({
            id: `navi-borrow-${poolKey}`,
            protocolId: "navi",
            protocolName: "NAVI Lending",
            chainId: "sui",
            category: "lending",
            side: "borrow",
            title: `Borrow ${assetSymbol}`,
            assetSymbol,
            valueUsd: borrowBalance * priceUsd,
            details: { coinType: cfg.type, priceUsd, raw: row },
          });
        }
      }
      return out;
    } catch {
      return [];
    }
  },
};

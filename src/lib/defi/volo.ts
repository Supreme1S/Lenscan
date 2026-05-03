import { rpcCall } from "@/lib/sui/rpc";
import type { DefiPosition } from "@/lib/types/portfolio";

/** Volo liquid staking certificate (voloSUI / CERT) on Sui mainnet. */
const VOLO_CERT_COIN_TYPE =
  "0x549e8b69270defbfafd4f94e17ec44cdbdd99820b33bda2278dea3b9a32d3f55::cert::CERT";

export const voloLstAdapter = {
  id: "volo_lst" as const,
  displayName: "Volo LST",
  async getPositions(address: string, signal?: AbortSignal): Promise<DefiPosition[]> {
    try {
      if (signal?.aborted) return [];
      const res = await rpcCall<{ totalBalance?: string } | string>(
        "suix_getBalance",
        [address, VOLO_CERT_COIN_TYPE],
        { signal },
      );
      const totalStr =
        typeof res === "string" ? res : (res.totalBalance ?? "0");
      const raw = BigInt(totalStr);
      if (raw === BigInt(0)) return [];
      const amount = Number(raw) / 1e9;
      if (!Number.isFinite(amount) || amount <= 0) return [];
      return [
        {
          id: "volo-lst-volosui",
          protocolId: "volo_lst",
          protocolName: "Volo LST",
          chainId: "sui",
          category: "staking",
          side: "staked",
          title: "Staked SUI (voloSUI)",
          assetSymbol: "voloSUI",
          // TODO: add USD price (DefiLlama / oracle); value is raw token amount.
          valueUsd: amount,
        },
      ];
    } catch {
      return [];
    }
  },
};

/**
 * TODO: Volo Vault positions require on-chain object queries; implement when Volo
 * publishes their vault position API.
 */
export const voloVaultAdapter = {
  id: "volo_vault" as const,
  displayName: "Volo Vault",
  async getPositions(_address: string, _signal?: AbortSignal): Promise<DefiPosition[]> {
    return [];
  },
};

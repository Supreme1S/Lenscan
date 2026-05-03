/**
 * Phase 3 groundwork: protocol adapters for Sui.
 *
 * Each adapter must satisfy `ProtocolAdapter`. Phase 1 ships mock-only data,
 * but the contract is what real implementations (Navi, Cetus, Suilend, Scallop)
 * will fulfil — keeping the aggregator stable.
 */

import type { DefiPosition } from "@/lib/types/portfolio";
import { astrosAggregatorAdapter, astrosPerpAdapter } from "./astros";
import { naviLendingAdapter } from "./navi";
import { voloLstAdapter, voloVaultAdapter } from "./volo";

export type ProtocolId =
  | "navi"
  | "cetus"
  | "suilend"
  | "scallop"
  | "turbos"
  | "deepbook"
  | "volo_lst"
  | "volo_vault"
  | "astros_perp"
  | "astros_aggregator";

export type ProtocolAdapter = {
  id: ProtocolId;
  displayName: string;
  /** Returns positions for an address. Implementations should never throw — return [] on error. */
  getPositions: (address: string, signal?: AbortSignal) => Promise<DefiPosition[]>;
};

const stub = (id: ProtocolId, displayName: string): ProtocolAdapter => ({
  id,
  displayName,
  async getPositions(_address, _signal) {
    return [];
  },
});

export const cetusAdapter = stub("cetus", "Cetus");
export const suilendAdapter = stub("suilend", "Suilend");
export const scallopAdapter = stub("scallop", "Scallop");
export const turbosAdapter = stub("turbos", "Turbos");
export const deepbookAdapter = stub("deepbook", "DeepBook");

export const PROTOCOL_ADAPTERS: ProtocolAdapter[] = [
  naviLendingAdapter,
  cetusAdapter,
  suilendAdapter,
  scallopAdapter,
  turbosAdapter,
  deepbookAdapter,
  voloLstAdapter,
  voloVaultAdapter,
  astrosPerpAdapter,
  astrosAggregatorAdapter,
];

export async function getDefiPositions(
  address: string,
  signal?: AbortSignal,
): Promise<DefiPosition[]> {
  const results = await Promise.all(
    PROTOCOL_ADAPTERS.map(async (a) => {
      try {
        return await a.getPositions(address, signal);
      } catch (err) {
        console.warn(
          JSON.stringify({
            stage: "defi_adapter",
            protocolId: a.id,
            address,
            error: err instanceof Error ? err.message : String(err),
          }),
        );
        return [];
      }
    }),
  );
  return results.flat();
}

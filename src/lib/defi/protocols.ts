/**
 * Phase 3 groundwork: protocol adapters for Sui.
 *
 * Each adapter must satisfy `ProtocolAdapter`. Phase 1 ships mock-only data,
 * but the contract is what real implementations (Navi, Cetus, Suilend, Scallop)
 * will fulfil — keeping the aggregator stable.
 */

import type { DefiPosition } from "@/lib/types/portfolio";

export type ProtocolId = "navi" | "cetus" | "suilend" | "scallop" | "turbos" | "deepbook";

export type ProtocolAdapter = {
  id: ProtocolId;
  displayName: string;
  /** Returns positions for an address. Implementations should never throw — return [] on error. */
  getPositions: (address: string) => Promise<DefiPosition[]>;
};

const stub = (id: ProtocolId, displayName: string): ProtocolAdapter => ({
  id,
  displayName,
  async getPositions() {
    return [];
  },
});

/* Real implementations land here in Phase 3. Keeping IDs stable so the
 * aggregator and UI don't need to change when adapters get wired. */
export const naviAdapter = stub("navi", "Navi");
export const cetusAdapter = stub("cetus", "Cetus");
export const suilendAdapter = stub("suilend", "Suilend");
export const scallopAdapter = stub("scallop", "Scallop");
export const turbosAdapter = stub("turbos", "Turbos");
export const deepbookAdapter = stub("deepbook", "DeepBook");

export const PROTOCOL_ADAPTERS: ProtocolAdapter[] = [
  naviAdapter,
  cetusAdapter,
  suilendAdapter,
  scallopAdapter,
  turbosAdapter,
  deepbookAdapter,
];

export async function getDefiPositions(address: string): Promise<DefiPosition[]> {
  const results = await Promise.all(
    PROTOCOL_ADAPTERS.map(async (a) => {
      try {
        return await a.getPositions(address);
      } catch (err) {
        console.warn(`[Lenscan] adapter ${a.id} failed`, err);
        return [];
      }
    }),
  );
  return results.flat();
}

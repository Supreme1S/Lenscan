import type { DefiPosition } from "@/lib/types/portfolio";

/**
 * TODO: Astros Perp positions require querying on-chain position objects. Implement when
 * Astros publishes an SDK or position query API.
 */
export const astrosPerpAdapter = {
  id: "astros_perp" as const,
  displayName: "Astros Perp",
  async getPositions(_address: string, _signal?: AbortSignal): Promise<DefiPosition[]> {
    return [];
  },
};

/**
 * TODO: Astros is a DEX aggregator — no persistent user positions to track.
 */
export const astrosAggregatorAdapter = {
  id: "astros_aggregator" as const,
  displayName: "Astros DEX Aggregator",
  async getPositions(_address: string, _signal?: AbortSignal): Promise<DefiPosition[]> {
    return [];
  },
};

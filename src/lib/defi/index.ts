import type {
  DefiAdapter,
  DefiPosition,
  DefiProtocolGroup,
} from "@/lib/defi/types";

const adapters: DefiAdapter[] = [];

/** Call from `src/lib/defi/<protocol>.ts` or register inline below when adding a protocol. */
export function registerDefiAdapter(adapter: DefiAdapter): void {
  adapters.push(adapter);
}

export type { DefiAdapter, DefiPosition, DefiProtocolGroup } from "@/lib/defi/types";

export async function fetchAllDefiPositions(
  address: string,
  signal?: AbortSignal,
): Promise<DefiPosition[]> {
  const rows = await Promise.all(
    adapters.map(async (adapter) => {
      try {
        return await adapter(address, signal);
      } catch (e) {
        console.warn("[Lenscan] defi adapter failed", e);
        return [] as DefiPosition[];
      }
    }),
  );
  return rows.flat();
}

export function groupDefiPositionsByProtocol(
  positions: DefiPosition[],
): DefiProtocolGroup[] {
  const byProtocol = new Map<string, DefiPosition[]>();
  for (const p of positions) {
    const list = byProtocol.get(p.protocolId);
    if (list) list.push(p);
    else byProtocol.set(p.protocolId, [p]);
  }
  const groups: DefiProtocolGroup[] = [];
  for (const [, arr] of byProtocol) {
    const valueUsd = arr.reduce((s, x) => s + x.valueUsd, 0);
    const first = arr[0]!;
    groups.push({
      protocolId: first.protocolId,
      protocolName: first.protocolName,
      chainId: first.chainId,
      category: first.category,
      valueUsd,
      positions: arr,
    });
  }
  groups.sort((a, b) => b.valueUsd - a.valueUsd);
  return groups;
}

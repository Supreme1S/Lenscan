/**
 * Minimal Sui JSON-RPC client (Phase 3 groundwork).
 *
 * We deliberately avoid pulling in `@mysten/sui` for now: a tiny `fetch` wrapper
 * keeps the bundle slim and the surface obvious. Swap to the official SDK when we
 * need PTB construction or wallet-standard signing.
 */

const DEFAULT_RPC =
  process.env.NEXT_PUBLIC_SUI_RPC_URL?.trim() ||
  "https://fullnode.mainnet.sui.io";

export type SuiBalance = {
  coinType: string;
  coinObjectCount: number;
  totalBalance: string;
};

export type RpcOptions = {
  rpcUrl?: string;
  signal?: AbortSignal;
};

async function rpc<T>(method: string, params: unknown[], opts: RpcOptions = {}): Promise<T> {
  const url = opts.rpcUrl ?? DEFAULT_RPC;
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
    signal: opts.signal,
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Sui RPC ${method} failed: ${res.status} ${res.statusText}`);
  }
  const json = (await res.json()) as { result?: T; error?: { message: string } };
  if (json.error) throw new Error(`Sui RPC ${method}: ${json.error.message}`);
  if (json.result === undefined) throw new Error(`Sui RPC ${method}: empty result`);
  return json.result;
}

export function getAllBalances(address: string, opts?: RpcOptions): Promise<SuiBalance[]> {
  return rpc<SuiBalance[]>("suix_getAllBalances", [address], opts);
}

export type OwnedObject = {
  data?: {
    objectId: string;
    type?: string;
    display?: { data?: Record<string, string> | null } | null;
    content?: unknown;
  };
};

export function getOwnedObjects(
  address: string,
  filter?: Record<string, unknown>,
  cursor: string | null = null,
  limit = 50,
  opts?: RpcOptions,
): Promise<{ data: OwnedObject[]; nextCursor: string | null; hasNextPage: boolean }> {
  const query = {
    filter: filter ?? null,
    options: { showType: true, showDisplay: true, showContent: false, showOwner: false },
  };
  return rpc("suix_getOwnedObjects", [address, query, cursor, limit], opts);
}

export type TxBlockSummary = {
  digest: string;
  timestampMs?: string | null;
  effects?: { status?: { status?: "success" | "failure" } } | null;
  transaction?: unknown;
};

/** Resolves a SuiNS name (`alice.sui`) to its 0x address. Returns null if not found. */
export async function resolveSuiNs(
  name: string,
  opts?: RpcOptions,
): Promise<string | null> {
  try {
    const result = await rpc<string | null>("suix_resolveNameServiceAddress", [name], opts);
    return result ?? null;
  } catch {
    return null;
  }
}

export function queryTransactionBlocks(
  address: string,
  cursor: string | null = null,
  limit = 25,
  opts?: RpcOptions,
): Promise<{ data: TxBlockSummary[]; nextCursor: string | null; hasNextPage: boolean }> {
  const query = {
    filter: { FromOrToAddress: { addr: address } },
    options: { showEffects: true, showInput: false, showEvents: false },
  };
  return rpc("suix_queryTransactionBlocks", [query, cursor, limit, true], opts);
}

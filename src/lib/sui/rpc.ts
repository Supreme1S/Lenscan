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

export async function rpcCall<T>(method: string, params: unknown[], opts: RpcOptions = {}): Promise<T> {
  return rpc<T>(method, params, opts);
}

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

export type SuiBalanceChange = {
  owner?: { AddressOwner?: string; ObjectOwner?: string } | string | null;
  coinType: string;
  amount: string;
};

export type TxBlockSummary = {
  digest: string;
  timestampMs?: string | null;
  checkpoint?: string | null;
  effects?: { status?: { status?: "success" | "failure" } } | null;
  balanceChanges?: SuiBalanceChange[] | null;
  transaction?: { data?: { sender?: string } } | null;
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

type TxQueryResult = {
  data: TxBlockSummary[];
  nextCursor: string | null;
  hasNextPage: boolean;
};

/**
 * Sui mainnet doesn't accept the `FromOrToAddress` filter, so we run two queries
 * (FromAddress + ToAddress) in parallel and merge them by digest, newest first.
 */
export async function queryTransactionBlocks(
  address: string,
  limit = 25,
  opts?: RpcOptions,
): Promise<TxQueryResult> {
  const baseOptions = {
    showEffects: true,
    showInput: false,
    showEvents: false,
    showBalanceChanges: true,
  };
  const [from, to] = await Promise.all([
    rpc<TxQueryResult>(
      "suix_queryTransactionBlocks",
      [
        { filter: { FromAddress: address }, options: baseOptions },
        null,
        limit,
        true,
      ],
      opts,
    ).catch(() => ({ data: [], nextCursor: null, hasNextPage: false })),
    rpc<TxQueryResult>(
      "suix_queryTransactionBlocks",
      [
        { filter: { ToAddress: address }, options: baseOptions },
        null,
        limit,
        true,
      ],
      opts,
    ).catch(() => ({ data: [], nextCursor: null, hasNextPage: false })),
  ]);

  const map = new Map<string, TxBlockSummary>();
  for (const tx of [...from.data, ...to.data]) {
    if (!map.has(tx.digest)) map.set(tx.digest, tx);
  }
  const merged = Array.from(map.values()).sort((a, b) => {
    const at = Number(a.timestampMs ?? 0);
    const bt = Number(b.timestampMs ?? 0);
    return bt - at;
  });
  return {
    data: merged.slice(0, limit),
    nextCursor: null,
    hasNextPage: from.hasNextPage || to.hasNextPage,
  };
}

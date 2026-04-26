import { rpcCall } from "@/lib/sui/rpc";

export type CoinMetadata = {
  decimals: number;
  name: string;
  symbol: string;
  description: string;
  iconUrl: string | null;
  id: string;
};

const METADATA_CONCURRENCY = 10;
const CHUNK_GAP_MS = 50;

function delay(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }
    const id = setTimeout(resolve, ms);
    if (!signal) return;
    signal.addEventListener(
      "abort",
      () => {
        clearTimeout(id);
        reject(new DOMException("Aborted", "AbortError"));
      },
      { once: true },
    );
  });
}

async function runConcurrent<T>(
  tasks: (() => Promise<T>)[],
  concurrency: number,
  signal?: AbortSignal,
): Promise<T[]> {
  const results: T[] = new Array(tasks.length);
  const n = tasks.length;
  if (n === 0) return results;

  let next = 0;
  const workerCount = Math.min(concurrency, n);

  async function worker(): Promise<void> {
    while (true) {
      const idx = next++;
      if (idx >= n) return;
      if (signal?.aborted) {
        throw new DOMException("Aborted", "AbortError");
      }
      results[idx] = await tasks[idx]!();
    }
  }

  await Promise.all(Array.from({ length: workerCount }, () => worker()));
  return results;
}

/** Fetch coin metadata for many coin types with limited concurrency. Failures resolve to null. */
export async function fetchCoinMetadataMany(
  coinTypes: string[],
  signal?: AbortSignal,
): Promise<Record<string, CoinMetadata | null>> {
  const result: Record<string, CoinMetadata | null> = {};
  const unique = [...new Set(coinTypes)];

  for (let offset = 0; offset < unique.length; offset += METADATA_CONCURRENCY) {
    if (signal?.aborted) {
      throw new DOMException("Aborted", "AbortError");
    }

    const slice = unique.slice(offset, offset + METADATA_CONCURRENCY);
    const tasks = slice.map((ct) => async () => {
      try {
        const md = await rpcCall<CoinMetadata | null>(
          "suix_getCoinMetadata",
          [ct],
          { signal },
        );
        result[ct] = md ?? null;
      } catch {
        result[ct] = null;
      }
    });

    await runConcurrent(tasks, METADATA_CONCURRENCY, signal);

    const hasMore = offset + METADATA_CONCURRENCY < unique.length;
    if (hasMore) {
      await delay(CHUNK_GAP_MS, signal);
    }
  }

  return result;
}

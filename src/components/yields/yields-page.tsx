import Link from "next/link";
import { YieldsClient } from "@/components/yields/yields-client";
import { fetchSuiYieldsPools } from "@/lib/data/defillama-yields";
import { MOCK_YIELD_POOLS } from "@/data/mock-yields";

export async function YieldsPage() {
  let pools: Awaited<ReturnType<typeof fetchSuiYieldsPools>> | null = null;
  try {
    pools = await fetchSuiYieldsPools();
  } catch {
    pools = null;
  }

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">
          Yields
        </h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Sui pools from{" "}
          <Link
            href="https://defillama.com"
            className="text-[var(--accent)] hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            DeFiLlama
          </Link>
          . Falls back to mock data if the API is unavailable.
        </p>
      </div>
      <YieldsClient
        remotePools={pools}
        mockPools={MOCK_YIELD_POOLS}
      />
    </div>
  );
}

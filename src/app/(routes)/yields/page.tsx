import { YieldsTable } from "@/components/yields/YieldsTable";
import { getSuiYields } from "@/lib/data/yields";

export const revalidate = 600;

export default async function YieldsRoute() {
  const { pools, error } = await getSuiYields();

  return (
    <div>
      <header className="border-b border-[var(--border)] px-6 py-5 lg:px-8">
        <h1 className="text-xl font-semibold tracking-tight text-[var(--foreground)]">
          Yields
        </h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Live Sui pools — APY, TVL and risk hints from DeFiLlama. Cached for
          10 minutes.
        </p>
      </header>
      <div className="space-y-4 p-6 lg:p-8">
        {error ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Couldn&apos;t reach DeFiLlama: {error}. Check connectivity, then retry.
          </div>
        ) : null}
        <YieldsTable pools={pools} />
      </div>
    </div>
  );
}

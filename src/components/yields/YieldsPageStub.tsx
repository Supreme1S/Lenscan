import { Card } from "@/components/ui/Card";

export function YieldsPageStub() {
  return (
    <div className="p-6 lg:p-8">
      <Card>
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Yields</h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
          Yield opportunities and vault APYs will land here. Phase 1 stub — no on-chain data yet.
        </p>
      </Card>
    </div>
  );
}

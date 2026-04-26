"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ConnectButton } from "@/components/wallet/ConnectButton";
import { LiquidButton } from "@/components/ui/LiquidGlass";
import { useResolveAddress } from "@/lib/hooks/useResolveAddress";

export function ScanWalletForm() {
  const router = useRouter();
  const { resolve, loading, error } = useResolveAddress();
  const [value, setValue] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;
    const r = await resolve(value);
    if (r.kind === "address" || r.kind === "suins") {
      router.push(`/portfolio?address=${encodeURIComponent(r.address)}`);
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <label htmlFor="hero-address" className="sr-only">
          Sui wallet address or SuiNS name
        </label>
        <input
          id="hero-address"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="0x… or alice.sui"
          className="h-12 flex-1 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/80 px-4 text-base text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--brand)] focus:outline-none focus:ring-4 focus:ring-[color-mix(in_srgb,var(--brand)_20%,transparent)]"
          autoComplete="off"
          spellCheck={false}
        />
        <LiquidButton
          type="submit"
          disabled={!value.trim() || loading}
          shape="card"
          padding="px-6 py-3"
          hue="indigo"
          className="text-sm font-semibold"
        >
          {loading ? "Resolving…" : "Scan"}
        </LiquidButton>
        <ConnectButton />
      </div>
      {error ? (
        <p className="px-1 text-left text-[12px] text-[var(--warning)]">{error}</p>
      ) : null}
    </form>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ConnectButton } from "@/components/wallet/ConnectButton";
import { LiquidButton } from "@/components/ui/LiquidGlass";
import { useResolveAddress } from "@/lib/hooks/useResolveAddress";
import { useTheme } from "@/lib/hooks/useTheme";

type TopBarProps = {
  onMenuClick?: () => void;
};

export function TopBar({ onMenuClick }: TopBarProps) {
  const router = useRouter();
  const { resolve, loading, error } = useResolveAddress();
  const { theme, toggle } = useTheme();
  const [query, setQuery] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    const r = await resolve(query);
    if (r.kind === "address" || r.kind === "suins") {
      router.push(`/portfolio?address=${encodeURIComponent(r.address)}`);
      router.refresh();
      setQuery("");
    }
  }

  return (
    <header className="liquid-surface sticky top-0 z-20 mx-3 mt-3 rounded-2xl px-3 py-2 lg:mx-4 lg:mt-4 lg:px-4">
      <div className="relative z-10 flex items-center gap-3">
        <LiquidButton
          type="button"
          onClick={onMenuClick}
          shape="circle"
          padding="p-0 h-9 w-9"
          aria-label="Open menu"
          className="md:hidden"
        >
          <span className="text-lg leading-none">☰</span>
        </LiquidButton>

        <form onSubmit={handleSubmit} className="relative flex-1 min-w-0">
          <label className="sr-only" htmlFor="topbar-search">
            Search by Sui address or SuiNS name
          </label>
          <input
            id="topbar-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search 0x… or alice.sui"
            className="h-10 w-full min-w-0 rounded-full border border-[var(--border)] bg-[var(--surface)]/80 pl-4 pr-24 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--brand)] focus:outline-none focus:ring-4 focus:ring-[color-mix(in_srgb,var(--brand)_18%,transparent)]"
            autoComplete="off"
            spellCheck={false}
          />
          <div className="absolute right-1 top-1">
            <LiquidButton
              type="submit"
              disabled={!query.trim() || loading}
              hue="indigo"
              padding="px-3 py-1"
              className="h-8 text-xs font-medium"
            >
              {loading ? "…" : "Scan"}
            </LiquidButton>
          </div>
          {error ? (
            <p className="absolute left-3 top-full mt-1 text-[11px] text-[var(--warning)]">
              {error}
            </p>
          ) : null}
        </form>

        <div className="flex shrink-0 items-center gap-2">
          <ConnectButton variant="compact" />
          <LiquidButton
            type="button"
            onClick={toggle}
            shape="circle"
            padding="p-0 h-9 w-9"
            aria-label="Toggle theme"
            title={`Theme: ${theme}`}
            hue={theme === "dark" ? "amber" : "indigo"}
          >
            <span className="text-base">{theme === "dark" ? "☀" : "☾"}</span>
          </LiquidButton>
        </div>
      </div>
    </header>
  );
}

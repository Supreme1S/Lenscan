"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ConnectButton } from "@/components/wallet/ConnectButton";
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
      setQuery("");
    }
  }

  return (
    <header className="liquid-glass sticky top-0 z-20 px-4 py-2.5 lg:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] md:hidden"
          aria-label="Open menu"
        >
          <span className="text-lg leading-none">☰</span>
        </button>

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
            className="h-9 w-full min-w-0 rounded-full border border-[var(--border)] bg-[var(--surface)]/70 pl-3.5 pr-12 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--brand)] focus:outline-none focus:ring-4 focus:ring-[color-mix(in_srgb,var(--brand)_18%,transparent)]"
            autoComplete="off"
            spellCheck={false}
          />
          <button
            type="submit"
            disabled={!query.trim() || loading}
            className="absolute right-1 top-1 h-7 rounded-full bg-[var(--accent)] px-3 text-xs font-medium text-[var(--accent-foreground)] hover:opacity-90 disabled:opacity-40"
          >
            {loading ? "…" : "Scan"}
          </button>
          {error ? (
            <p className="absolute left-3 top-full mt-1 text-[11px] text-[var(--warning)]">
              {error}
            </p>
          ) : null}
        </form>

        <div className="flex shrink-0 items-center gap-2">
          <ConnectButton variant="compact" />
          <button
            type="button"
            onClick={toggle}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] transition-colors hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)]"
            aria-label="Toggle theme"
            title={`Theme: ${theme}`}
          >
            <span className="text-sm">{theme === "dark" ? "☀" : "☾"}</span>
          </button>
        </div>
      </div>
    </header>
  );
}

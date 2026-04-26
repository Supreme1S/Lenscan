"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
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
      router.refresh();
      setQuery("");
    }
  }

  return (
    <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--background)_80%,transparent)] px-4 py-3 backdrop-blur-md lg:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="btn-ghost h-9 w-9 md:hidden"
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
            className="h-10 w-full min-w-0 rounded-full border border-[var(--border)] bg-[var(--surface)] pl-4 pr-24 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--brand)] focus:outline-none focus:ring-4 focus:ring-[color-mix(in_srgb,var(--brand)_18%,transparent)]"
            autoComplete="off"
            spellCheck={false}
          />
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={!query.trim() || loading}
            className="absolute right-1 top-1 rounded-full"
          >
            {loading ? "…" : "Scan"}
          </Button>
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
            className="btn-ghost h-9 w-9"
            aria-label="Toggle theme"
            title={`Theme: ${theme}`}
          >
            <span className="text-base">{theme === "dark" ? "☀" : "☾"}</span>
          </button>
        </div>
      </div>
    </header>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { isPlausibleSuiAddress, normalizeSuiAddress } from "@/lib/sui/address";

type TopBarProps = {
  onMenuClick?: () => void;
};

export function TopBar({ onMenuClick }: TopBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const raw = query.trim();
    if (!raw) return;
    const addr = normalizeSuiAddress(raw);
    router.push(`/portfolio?address=${encodeURIComponent(addr)}`);
  }

  function handleConnect() {
    /* Phase 1 stub — wire @mysten/dapp-kit later. */
  }

  function handleThemeToggle() {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("dark");
  }

  const showHint = query.trim().length > 0 && !isPlausibleSuiAddress(query.trim());

  return (
    <header className="glass-panel sticky top-0 z-20 px-4 py-3 lg:px-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] md:hidden"
            aria-label="Open menu"
          >
            <span className="text-lg leading-none">☰</span>
          </button>
          <span className="hidden truncate text-sm font-semibold tracking-tight text-[var(--foreground)] md:inline">
            Sui portfolio scanner
          </span>
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-end sm:gap-3">
          <form
            onSubmit={handleSubmit}
            className="relative w-full sm:max-w-xs lg:max-w-md"
          >
            <label className="sr-only" htmlFor="topbar-search">
              Search by wallet address
            </label>
            <input
              id="topbar-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Sui address (0x…)"
              className="h-9 w-full min-w-0 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 pr-16 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--brand)] focus:outline-none focus:ring-2 focus:ring-[color-mix(in_srgb,var(--brand)_25%,transparent)]"
              autoComplete="off"
              spellCheck={false}
            />
            <button
              type="submit"
              className="absolute right-1 top-1 h-7 rounded-md bg-[var(--accent)] px-2.5 text-xs font-medium text-[var(--accent-foreground)] hover:opacity-90 disabled:opacity-40"
              disabled={!query.trim()}
            >
              Scan
            </button>
            {showHint ? (
              <p className="absolute left-0 top-full mt-1 text-[11px] text-[var(--warning)]">
                Looks off — Sui addresses are 0x followed by hex.
              </p>
            ) : null}
          </form>

          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <span className="rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-2.5 py-1 text-xs font-medium text-[var(--foreground)]">
              Sui
            </span>
            <button
              type="button"
              onClick={handleConnect}
              className="rounded-lg bg-[var(--accent)] px-3 py-1.5 text-xs font-medium text-[var(--accent-foreground)] transition-opacity hover:opacity-90"
            >
              Connect Wallet
            </button>
            <button
              type="button"
              onClick={handleThemeToggle}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] transition-colors hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)]"
              aria-label="Toggle theme"
              title="Toggle theme"
            >
              <span className="text-sm">◐</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

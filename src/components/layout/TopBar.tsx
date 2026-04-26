"use client";

type TopBarProps = {
  onMenuClick?: () => void;
};

export function TopBar({ onMenuClick }: TopBarProps) {
  function handleConnect() {
    /* Phase 1 stub */
  }

  function handleThemeToggle() {
    /* Phase 1 stub — wire to html.dark later */
  }

  return (
    <header
      className="sticky top-0 z-20 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_88%,transparent)] px-4 py-3 shadow-[0_1px_2px_rgba(15,23,42,0.06)] backdrop-blur-md backdrop-saturate-150 supports-[backdrop-filter]:bg-[color-mix(in_srgb,var(--surface)_72%,transparent)] lg:px-6"
      style={{ WebkitBackdropFilter: "blur(12px)" }}
    >
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
          <span className="truncate text-base font-semibold tracking-tight text-[var(--foreground)]">
            Lenscan
          </span>
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-end sm:gap-3">
          <label className="sr-only" htmlFor="topbar-search">
            Search by wallet address
          </label>
          <input
            id="topbar-search"
            type="search"
            placeholder="Search by wallet address…"
            className="h-9 w-full min-w-0 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--foreground)] sm:max-w-xs lg:max-w-md"
            autoComplete="off"
          />
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <span className="rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-2.5 py-1 text-xs font-medium text-[var(--foreground)]">
              Sui
            </span>
            <button
              type="button"
              onClick={handleConnect}
              className="rounded-lg border border-[var(--border)] bg-[var(--foreground)] px-3 py-1.5 text-xs font-medium text-[var(--surface)] transition-opacity hover:opacity-90"
            >
              Connect Wallet
            </button>
            <button
              type="button"
              onClick={handleThemeToggle}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] transition-colors hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)]"
              aria-label="Toggle theme (coming soon)"
              title="Theme (coming soon)"
            >
              <span className="text-sm">◐</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

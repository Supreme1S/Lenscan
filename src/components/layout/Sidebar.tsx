"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/portfolio", label: "Portfolio" },
  { href: "/yields", label: "Yields" },
  { href: "/nfts", label: "NFTs" },
  { href: "/transactions", label: "Transactions" },
  { href: "/favorites", label: "Favorites" },
] as const;

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-[var(--surface)]">
      <p className="hidden border-b border-[var(--border)] px-4 py-3 text-xs font-medium uppercase tracking-wide text-[var(--muted)] md:block">
        Navigation
      </p>
      <nav className="flex flex-col gap-0.5 p-3">
        {nav.map(({ href, label }) => {
          const active =
            pathname === href ||
            (href !== "/portfolio" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-[var(--surface-muted)] text-[var(--foreground)]"
                  : "text-[var(--muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)]"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = { href: string; label: string; exact?: boolean };

const nav: readonly NavItem[] = [
  { href: "/", label: "Home", exact: true },
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
      <Link
        href="/"
        onClick={onNavigate}
        className="flex items-center gap-2.5 px-5 py-4"
      >
        <span
          aria-hidden
          className="flex h-7 w-7 items-center justify-center rounded-lg text-[13px] font-bold text-white"
          style={{
            background:
              "linear-gradient(135deg, var(--brand) 0%, color-mix(in srgb, var(--brand) 60%, #22c55e) 100%)",
          }}
        >
          L
        </span>
        <span className="text-[15px] font-semibold tracking-tight text-[var(--foreground)]">
          Lenscan
        </span>
      </Link>
      <nav className="flex flex-col gap-0.5 px-3">
        {nav.map(({ href, label, exact }) => {
          const active = exact
            ? pathname === href
            : pathname === href || pathname.startsWith(`${href}/`);
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

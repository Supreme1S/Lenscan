"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ConnectWalletControl } from "@/components/layout/connect-wallet-control";
import { ThemeHoverMenu } from "@/components/layout/theme-hover-menu";
import { cn } from "@/lib/utils";

const glass =
  "border-b border-[var(--border)]/80 bg-[color-mix(in_srgb,var(--surface)_82%,transparent)] shadow-[0_1px_2px_rgba(15,23,42,0.04)] backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-[color-mix(in_srgb,var(--surface)_70%,transparent)]";

export function TopBar() {
  const pathname = usePathname();
  const router = useRouter();

  function onPortfolioNavClick(e: React.MouseEvent<HTMLAnchorElement>) {
    const onPortfolio = pathname === "/portfolio";
    const params =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search)
        : null;
    const hasAddress = Boolean(params?.get("address")?.trim());
    if (onPortfolio && !hasAddress) {
      e.preventDefault();
      router.push("/");
    }
  }

  return (
    <header
      className={cn("fixed inset-x-0 top-0 z-50", glass)}
      style={{ WebkitBackdropFilter: "blur(16px)" }}
    >
      <div className="mx-auto flex h-14 max-w-[1440px] items-center gap-3 px-4 sm:gap-4 sm:px-6">
        <Link
          href="/"
          className="shrink-0 text-base font-semibold tracking-tight text-[var(--foreground)] transition-opacity hover:opacity-80 active:opacity-70"
        >
          Lenscan
        </Link>

        <nav className="flex flex-1 items-center justify-center gap-6 sm:gap-10">
          <Link
            href="/portfolio"
            onClick={onPortfolioNavClick}
            className={cn(
              "text-sm font-medium transition-colors hover:text-[var(--accent)] active:opacity-80",
              pathname.startsWith("/portfolio")
                ? "text-[var(--accent)]"
                : "text-[var(--muted)]",
            )}
          >
            Portfolio
          </Link>
          <Link
            href="/yields"
            className={cn(
              "text-sm font-medium transition-colors hover:text-[var(--accent)] active:opacity-80",
              pathname === "/yields"
                ? "text-[var(--accent)]"
                : "text-[var(--muted)]",
            )}
          >
            Yields
          </Link>
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Link
            href="/favorites"
            className={cn(
              "hidden text-sm font-medium transition-colors hover:text-[var(--accent)] sm:inline",
              pathname === "/favorites"
                ? "text-[var(--accent)]"
                : "text-[var(--muted)]",
            )}
          >
            Favorites
          </Link>
          <ThemeHoverMenu />
          <ConnectWalletControl />
        </div>
      </div>
    </header>
  );
}

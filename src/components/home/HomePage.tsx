import Link from "next/link";
import { ScanWalletForm } from "@/components/home/ScanWalletForm";

const features = [
  {
    title: "Portfolio overview",
    body: "Net worth, token holdings, allocation and DeFi exposure for any Sui wallet — at a glance.",
    href: "/portfolio",
    cta: "Open portfolio",
  },
  {
    title: "Yields discovery",
    body: "Live APY across Sui pools (DeFiLlama), filterable by category, TVL and stables-only.",
    href: "/yields",
    cta: "Browse yields",
  },
  {
    title: "NFT browser",
    body: "Inspect NFT collections held by a wallet, sorted by collection and floor hint.",
    href: "/nfts",
    cta: "View NFTs",
  },
  {
    title: "Transactions explorer",
    body: "Recent on-chain activity — swaps, sends, stakes — normalized into one timeline.",
    href: "/transactions",
    cta: "See activity",
  },
  {
    title: "Favorites",
    body: "Bookmark interesting wallets for research; backed by Supabase, sync across devices.",
    href: "/favorites",
    cta: "Manage favorites",
  },
];

export function HomePage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-6 py-12 lg:px-8 lg:py-20">
      <section className="flex flex-col items-center text-center">
        <span className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
          Sui-native · DeBank-style analytics
        </span>
        <h1 className="mt-5 text-balance text-4xl font-semibold tracking-tight text-[var(--foreground)] sm:text-5xl">
          See any Sui wallet,{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(110deg, var(--brand) 0%, #22c55e 100%)",
            }}
          >
            clearly.
          </span>
        </h1>
        <p className="mt-4 max-w-xl text-balance text-base text-[var(--muted)] sm:text-lg">
          Lenscan is a portfolio scanner for Sui — tokens, DeFi positions, NFTs,
          transactions and favorites in one minimal, fast interface.
        </p>

        <div className="glass-strong mt-10 w-full max-w-2xl rounded-3xl p-5 sm:p-6">
          <ScanWalletForm />
          <p className="mt-3 text-center text-[11px] text-[var(--muted)]">
            No login required. Connect Wallet (coming soon) for write actions.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs">
          {[
            { href: "/portfolio", label: "Portfolio" },
            { href: "/yields", label: "Yields" },
            { href: "/nfts", label: "NFTs" },
            { href: "/transactions", label: "Transactions" },
            { href: "/favorites", label: "Favorites" },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 font-medium text-[var(--foreground)] hover:bg-[var(--surface-muted)]"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
          What Lenscan gives you
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Link
              key={f.title}
              href={f.href}
              className="glass-panel group flex flex-col rounded-2xl p-5 transition-transform hover:-translate-y-0.5"
            >
              <h3 className="text-base font-semibold text-[var(--foreground)]">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                {f.body}
              </p>
              <span className="mt-4 text-xs font-medium text-[var(--brand)] group-hover:underline">
                {f.cta} →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="glass-panel rounded-2xl p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
          Why Sui-only
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[var(--foreground)]">
          Multichain dashboards spread thin across 30+ networks. Lenscan focuses
          on Sui: deeper protocol coverage (Navi, Cetus, Suilend, Scallop),
          faster iterations, and a UI tuned to Move&apos;s object model — not a
          lowest-common-denominator EVM view.
        </p>
      </section>
    </div>
  );
}

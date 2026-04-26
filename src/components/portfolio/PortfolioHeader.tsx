"use client";

import { createFavorite } from "@/app/(routes)/favorites/actions";
import { LiquidButton } from "@/components/ui/LiquidGlass";
import { shortenWalletAddress } from "@/lib/data/favorites";

type PortfolioHeaderProps = {
  walletAddress: string;
};

export function PortfolioHeader({ walletAddress }: PortfolioHeaderProps) {
  const display = shortenWalletAddress(walletAddress);

  return (
    <div className="surface-card flex flex-col gap-4 border-x-0 border-t-0 px-6 py-4 lg:px-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
            Wallet
          </p>
          <p
            className="mt-1 font-mono text-sm font-medium text-[var(--foreground)]"
            title={walletAddress}
          >
            {display}
          </p>
        </div>
        <form
          action={createFavorite}
          className="flex w-full max-w-md flex-col gap-2 sm:w-auto sm:flex-row sm:items-center"
        >
          <input type="hidden" name="walletAddress" value={walletAddress} />
          <input
            type="text"
            name="label"
            placeholder="Label (optional)"
            className="h-9 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--brand)] focus:outline-none focus:ring-2 focus:ring-[color-mix(in_srgb,var(--brand)_25%,transparent)] sm:min-w-[160px]"
            autoComplete="off"
          />
          <LiquidButton
            type="submit"
            shape="card"
            padding="px-4 py-2"
            hue="teal"
            className="h-9 shrink-0 text-sm font-medium"
          >
            Add to Favorites
          </LiquidButton>
        </form>
      </div>
    </div>
  );
}

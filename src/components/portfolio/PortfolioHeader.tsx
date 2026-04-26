import { createFavorite } from "@/app/(routes)/favorites/actions";
import { shortenWalletAddress } from "@/lib/data/favorites";

type PortfolioHeaderProps = {
  walletAddress: string;
};

export function PortfolioHeader({ walletAddress }: PortfolioHeaderProps) {
  const display = shortenWalletAddress(walletAddress);

  return (
    <div className="flex flex-col gap-4 border-b border-slate-200/80 bg-white/60 px-6 py-4 backdrop-blur-sm lg:px-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Wallet
          </p>
          <p className="mt-1 font-mono text-sm font-medium text-slate-900" title={walletAddress}>
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
            className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 sm:min-w-[160px]"
            autoComplete="off"
          />
          <button
            type="submit"
            className="h-9 shrink-0 rounded-lg border border-slate-200 bg-slate-900 px-4 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Add to Favorites
          </button>
        </form>
      </div>
    </div>
  );
}

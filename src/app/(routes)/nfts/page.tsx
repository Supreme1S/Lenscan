import Link from "next/link";
import { NftCollectionGrid } from "@/components/nfts/NftCollectionGrid";
import { fetchRealNfts } from "@/lib/nfts/buildNfts";
import { isPlausibleSuiAddress, normalizeSuiAddress, shortenAddress } from "@/lib/sui/address";

// Cache NFT page render for 60s — keeps the first paint snappy when multiple
// users hit the same address. Owned objects rarely change, so this is safe.
export const revalidate = 60;

type Props = {
  searchParams: Promise<{ address?: string }>;
};

export default async function NftsRoute({ searchParams }: Props) {
  const { address } = await searchParams;
  const trimmed = (address ?? "").trim();
  const usableAddress =
    trimmed && isPlausibleSuiAddress(trimmed)
      ? normalizeSuiAddress(trimmed)
      : null;

  return (
    <div>
      <header className="border-b border-[var(--border)] px-6 py-5 lg:px-8">
        <h1 className="text-xl font-semibold tracking-tight text-[var(--foreground)]">
          NFTs
        </h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          {usableAddress
            ? `Displayable objects owned by ${shortenAddress(usableAddress)}.`
            : "Collections and digital assets held by a Sui wallet."}
        </p>
      </header>

      {!usableAddress ? (
        <EmptyState
          title="No wallet selected"
          message="Paste a Sui address (0x…) on the home page to see owned NFTs."
        />
      ) : (
        <NftsContent address={usableAddress} />
      )}
    </div>
  );
}

async function NftsContent({ address }: { address: string }) {
  let items;
  let truncated = false;
  let errorMessage: string | null = null;
  try {
    const result = await fetchRealNfts(address);
    items = result.items;
    truncated = result.truncated;
  } catch (err) {
    errorMessage = err instanceof Error ? err.message : "Failed to load NFTs";
  }

  if (errorMessage) {
    return (
      <EmptyState
        title="Couldn’t load NFTs"
        message={errorMessage ?? "Sui RPC didn’t respond. Try again in a moment."}
      />
    );
  }

  if (!items || items.length === 0) {
    return (
      <EmptyState
        title="No NFTs found"
        message="This wallet doesn’t hold any objects with public display metadata."
      />
    );
  }

  return (
    <div className="space-y-4 p-6 lg:p-8">
      <p className="text-sm text-[var(--muted)]">
        {items.length} item{items.length === 1 ? "" : "s"}
        {truncated ? " (showing first pages only)" : ""}
      </p>
      <NftCollectionGrid items={items} />
    </div>
  );
}

function EmptyState({ title, message }: { title: string; message: string }) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center p-6">
      <div className="surface-card max-w-md p-8 text-center">
        <p className="text-xl font-semibold text-[var(--foreground)]">{title}</p>
        <p className="mt-2 text-sm text-[var(--muted)]">{message}</p>
        <Link href="/" className="btn-primary mt-5 inline-flex h-10 px-5 text-sm">
          Back to search
        </Link>
      </div>
    </div>
  );
}

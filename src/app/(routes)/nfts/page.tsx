import { NftsPage } from "@/components/nfts/NftsPage";

export default function NftsRoute() {
  return (
    <div>
      <header className="border-b border-[var(--border)] px-6 py-5 lg:px-8">
        <h1 className="text-xl font-semibold tracking-tight text-[var(--foreground)]">
          NFTs
        </h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Collections held by a wallet. Phase 1 — mock data.
        </p>
      </header>
      <NftsPage />
    </div>
  );
}

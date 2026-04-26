"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { pickRandomWallet } from "@/data/random-wallets";
import { isValidSuiAddress, normalizeSuiAddress } from "@/lib/sui-address";

export function HomePage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  function submit() {
    const v = normalizeSuiAddress(query);
    if (!isValidSuiAddress(v)) {
      setError("Enter a valid Sui address (0x + 64 hex characters).");
      return;
    }
    setError(null);
    router.push(`/portfolio?address=${encodeURIComponent(v)}`);
  }

  function randomNavigate() {
    setError(null);
    const addr = pickRandomWallet();
    router.push(`/portfolio?address=${encodeURIComponent(addr)}`);
  }

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-lg text-center"
      >
        <p className="text-sm font-medium text-[var(--muted)]">Lenscan</p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl">
          Explore any Sui wallet
        </h1>
        <p className="mt-6 text-left text-sm leading-relaxed text-[var(--muted)] sm:text-center">
          Lenscan is a Sui-native portfolio scanner. Paste any wallet address to
          explore token holdings, DeFi positions, NFTs and transaction history — no
          registration needed.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-stretch">
          <div className="relative flex-1">
            <Input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") submit();
              }}
              placeholder="Search by wallet address..."
              className="h-12 pr-12 text-base"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "addr-error" : undefined}
            />
            <button
              type="button"
              onClick={submit}
              className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md text-[var(--muted)] transition-colors hover:bg-[var(--surface-muted)] hover:text-[var(--accent)] active:scale-95"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>
        </div>
        {error ? (
          <p id="addr-error" className="mt-2 text-left text-sm text-red-600 sm:text-center" role="alert">
            {error}
          </p>
        ) : null}

        <div className="mt-6 flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={randomNavigate}
            className="text-sm font-medium text-[var(--accent)] underline-offset-4 transition-opacity hover:underline active:opacity-80"
          >
            Random wallet
          </button>
          <p className="max-w-md text-center text-xs leading-relaxed text-[var(--muted)]">
            Picks a random address from ~500 recent mainnet senders (refreshed offline). Use
            the search bar for a specific wallet.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

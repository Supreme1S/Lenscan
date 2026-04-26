"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  isPlausibleSuiAddress,
  normalizeSuiAddress,
} from "@/lib/sui/address";

const SAMPLE_ADDR =
  "0x7a3c8f2190abcd1234567890abcdef1234567890abcdef1234567890abcd0000";

export function ScanWalletForm() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const trimmed = value.trim();
  const valid = trimmed.length === 0 || isPlausibleSuiAddress(trimmed);

  function submit(addr: string) {
    const normalized = normalizeSuiAddress(addr);
    router.push(`/portfolio?address=${encodeURIComponent(normalized)}`);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!trimmed || !valid) return;
    submit(trimmed);
  }

  function handleConnect() {
    /* Phase 1 stub — connect via @mysten/dapp-kit in Phase 4. */
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <label htmlFor="hero-address" className="sr-only">
        Sui wallet address
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id="hero-address"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Paste Sui address (0x…)"
          className="h-12 flex-1 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 text-base text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--brand)] focus:outline-none focus:ring-2 focus:ring-[color-mix(in_srgb,var(--brand)_25%,transparent)]"
          autoComplete="off"
          spellCheck={false}
          aria-invalid={!valid}
        />
        <button
          type="submit"
          disabled={!trimmed || !valid}
          className="h-12 rounded-xl bg-[var(--accent)] px-5 text-sm font-semibold text-[var(--accent-foreground)] transition-opacity hover:opacity-90 disabled:opacity-40 sm:px-6"
        >
          Scan wallet
        </button>
      </div>
      {!valid ? (
        <p className="text-[12px] text-[var(--warning)]">
          That doesn&apos;t look like a Sui address — they start with 0x followed
          by hex.
        </p>
      ) : null}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          onClick={handleConnect}
          className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--surface-muted)]"
        >
          Connect Wallet
        </button>
        <button
          type="button"
          onClick={() => submit(SAMPLE_ADDR)}
          className="text-xs font-medium text-[var(--muted)] underline-offset-2 hover:text-[var(--foreground)] hover:underline"
        >
          Try a sample wallet
        </button>
      </div>
    </form>
  );
}

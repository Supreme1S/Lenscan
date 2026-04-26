"use client";

import { ConnectModal, useCurrentAccount, useDisconnectWallet } from "@mysten/dapp-kit";
import { useState } from "react";
import { shortenAddress } from "@/lib/sui/address";

type Props = {
  /** Compact = pill style for TopBar; default = bigger button for Home/empty states */
  variant?: "default" | "compact";
};

export function ConnectButton({ variant = "default" }: Props) {
  const account = useCurrentAccount();
  const { mutate: disconnect } = useDisconnectWallet();
  const [open, setOpen] = useState(false);

  const compact = variant === "compact";
  const baseBtn = compact
    ? "h-8 rounded-full px-3 text-xs font-medium"
    : "h-11 rounded-xl px-4 text-sm font-semibold";

  if (account) {
    return (
      <button
        type="button"
        onClick={() => disconnect()}
        title="Click to disconnect"
        className={`${baseBtn} flex items-center gap-2 border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] transition-colors hover:bg-[var(--surface-muted)]`}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
        <span className="font-mono">{shortenAddress(account.address)}</span>
      </button>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`${baseBtn} bg-[var(--accent)] text-[var(--accent-foreground)] transition-opacity hover:opacity-90`}
      >
        Connect Wallet
      </button>
      <ConnectModal trigger={<span className="hidden" />} open={open} onOpenChange={setOpen} />
    </>
  );
}

"use client";

import { ConnectModal, useCurrentAccount, useDisconnectWallet } from "@mysten/dapp-kit";
import { useState } from "react";
import { LiquidButton } from "@/components/ui/LiquidGlass";
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
  const padding = compact ? "px-3 py-1.5" : "px-5 py-2.5";

  if (account) {
    return (
      <LiquidButton
        type="button"
        onClick={() => disconnect()}
        title="Click to disconnect"
        hue="teal"
        padding={padding}
        className={compact ? "text-xs" : "text-sm"}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]" aria-hidden />
        <span className="font-mono">{shortenAddress(account.address)}</span>
      </LiquidButton>
    );
  }

  return (
    <>
      <LiquidButton
        type="button"
        onClick={() => setOpen(true)}
        hue="indigo"
        padding={padding}
        className={compact ? "text-xs" : "text-sm font-semibold"}
      >
        Connect Wallet
      </LiquidButton>
      <ConnectModal trigger={<span className="hidden" />} open={open} onOpenChange={setOpen} />
    </>
  );
}

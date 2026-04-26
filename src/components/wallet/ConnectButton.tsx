"use client";

import { ConnectModal, useCurrentAccount, useDisconnectWallet } from "@mysten/dapp-kit";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { shortenAddress } from "@/lib/sui/address";

type Props = {
  variant?: "default" | "compact";
};

export function ConnectButton({ variant = "default" }: Props) {
  const account = useCurrentAccount();
  const { mutate: disconnect } = useDisconnectWallet();
  const [open, setOpen] = useState(false);
  const size = variant === "compact" ? "sm" : "md";

  if (account) {
    return (
      <Button
        type="button"
        variant="secondary"
        size={size}
        onClick={() => disconnect()}
        title="Click to disconnect"
        className="font-mono"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
        {shortenAddress(account.address)}
      </Button>
    );
  }

  return (
    <>
      <Button type="button" variant="primary" size={size} onClick={() => setOpen(true)}>
        Connect Wallet
      </Button>
      <ConnectModal trigger={<span className="hidden" />} open={open} onOpenChange={setOpen} />
    </>
  );
}

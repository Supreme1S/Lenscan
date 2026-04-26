"use client";

import { Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/contexts/wallet-context";
import { cn } from "@/lib/utils";

function truncateAddress(addr: string): string {
  if (addr.length <= 12) return addr;
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export function ConnectWalletControl({ className }: { className?: string }) {
  const { connectedAddress, connect, disconnect } = useWallet();

  if (connectedAddress) {
    return (
      <button
        type="button"
        onClick={disconnect}
        className={cn(
          "flex h-9 max-w-[200px] items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--surface-muted)] active:scale-[0.98]",
          className,
        )}
        title="Click to disconnect (stub)"
      >
        <Wallet className="h-4 w-4 shrink-0 text-[var(--accent)]" />
        <span className="truncate font-mono text-xs">{truncateAddress(connectedAddress)}</span>
      </button>
    );
  }

  return (
    <Button type="button" size="sm" className={className} onClick={connect}>
      Connect Wallet
    </Button>
  );
}

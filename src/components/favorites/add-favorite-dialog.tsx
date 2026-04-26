"use client";

import { createFavorite } from "@/app/(routes)/favorites/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { isValidSuiAddress, normalizeSuiAddress } from "@/lib/sui-address";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function AddFavoriteDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" size="sm">
          Add wallet
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add favorite</DialogTitle>
          <DialogDescription>
            Save a Sui address to open it quickly from this list.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setError(null);
            const fd = new FormData(e.currentTarget);
            const raw = (fd.get("walletAddress") as string)?.trim() ?? "";
            const n = normalizeSuiAddress(raw);
            if (!isValidSuiAddress(n)) {
              setError("Invalid Sui address (0x + 64 hex).");
              return;
            }
            fd.set("walletAddress", n);
            startTransition(async () => {
              try {
                await createFavorite(fd);
                setOpen(false);
                router.refresh();
              } catch (err) {
                setError(
                  err instanceof Error ? err.message : "Could not save favorite",
                );
              }
            });
          }}
          className="space-y-3"
        >
          <div>
            <label className="text-xs text-[var(--muted)]" htmlFor="fav-addr">
              Address
            </label>
            <Input
              id="fav-addr"
              name="walletAddress"
              placeholder="0x…"
              required
              className="mt-1 font-mono text-sm"
              autoComplete="off"
            />
          </div>
          <div>
            <label className="text-xs text-[var(--muted)]" htmlFor="fav-label">
              Label (optional)
            </label>
            <Input
              id="fav-label"
              name="label"
              placeholder="My vault"
              className="mt-1"
              autoComplete="off"
            />
          </div>
          {error ? (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          ) : null}
          <Button type="submit" className="w-full sm:w-auto" disabled={pending}>
            {pending ? "Saving…" : "Save"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import type { MockNftCollection } from "@/data/mock-nfts";
import { formatUsd } from "@/data/mock-portfolio";

type NftsTabProps = {
  collections: MockNftCollection[];
};

export function NftsTab({ collections }: NftsTabProps) {
  const [open, setOpen] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(collections.map((c) => [c.id, true])),
  );

  function toggle(id: string) {
    setOpen((o) => ({ ...o, [id]: !o[id] }));
  }

  return (
    <div className="space-y-4">
      {collections.map((col) => (
        <div
          key={col.id}
          className="rounded-xl border border-[var(--border)] bg-[var(--surface)]/80"
        >
          <button
            type="button"
            onClick={() => toggle(col.id)}
            className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-[var(--foreground)] transition-colors hover:bg-[var(--surface-muted)]/50"
          >
            {col.name}
            <span className="text-[var(--muted)]">{open[col.id] ? "▾" : "▸"}</span>
          </button>
          <AnimatePresence>
            {open[col.id] ? (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden border-t border-[var(--border)]"
              >
                <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {col.items.map((nft) => (
                    <motion.div
                      key={nft.id}
                      layout
                      whileHover={{ y: -2 }}
                      className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3 shadow-sm transition-shadow hover:shadow-md"
                    >
                      <div className="flex aspect-square items-center justify-center rounded-md bg-[var(--surface-muted)] text-4xl">
                        {nft.imageEmoji}
                      </div>
                      <p className="mt-2 text-xs text-[var(--muted)]">{col.name}</p>
                      <p className="text-sm font-medium text-[var(--foreground)]">
                        {nft.name}
                      </p>
                      <p className="mt-1 text-xs tabular-nums text-[var(--muted)]">
                        Floor{" "}
                        {nft.floorUsd != null ? formatUsd(nft.floorUsd) : "—"}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import type { MockProtocolTile } from "@/data/mock-portfolio";
import { formatUsd } from "@/data/mock-portfolio";
import { cn } from "@/lib/utils";

function TileLogo({ tile }: { tile: MockProtocolTile }) {
  const [broken, setBroken] = useState(false);
  if (tile.logoUrl && !broken) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- remote protocol icons; small static list
      <img
        src={tile.logoUrl}
        alt=""
        width={32}
        height={32}
        className="h-8 w-8 rounded-lg object-cover"
        onError={() => setBroken(true)}
      />
    );
  }
  return (
    <span
      className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--surface-muted)] text-sm"
      aria-hidden
    >
      {tile.logo}
    </span>
  );
}

type ProtocolTilesProps = {
  tiles: MockProtocolTile[];
  onExpandDust?: () => void;
};

export function ProtocolTiles({ tiles, onExpandDust }: ProtocolTilesProps) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? tiles : tiles.filter((t) => !t.isDust);
  const hiddenCount = tiles.filter((t) => t.isDust).length;

  return (
    <div className="space-y-3">
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
        {visible.map((tile, i) => (
          <motion.a
            key={tile.id}
            href={`#${tile.anchorId}`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            whileHover={{ y: -2 }}
            className={cn(
              "flex min-w-[140px] shrink-0 flex-col rounded-xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_88%,transparent)] px-4 py-3 shadow-sm backdrop-blur-md transition-shadow hover:shadow-md active:scale-[0.99]",
            )}
          >
            <div className="flex items-center gap-2">
              <TileLogo tile={tile} />
              <span className="text-sm font-semibold text-[var(--foreground)]">
                {tile.name}
              </span>
            </div>
            <span className="mt-2 text-xs tabular-nums text-[var(--muted)]">
              {formatUsd(tile.valueUsd)}
            </span>
          </motion.a>
        ))}
      </div>
      {hiddenCount > 0 && !showAll ? (
        <button
          type="button"
          onClick={() => {
            setShowAll(true);
            onExpandDust?.();
          }}
          className="text-left text-sm font-medium text-[var(--muted)] transition-colors hover:text-[var(--accent)] active:opacity-80"
        >
          Protocols with small deposits are not displayed. Show all ▾
        </button>
      ) : null}
      {showAll && hiddenCount > 0 ? (
        <button
          type="button"
          onClick={() => setShowAll(false)}
          className="text-left text-sm font-medium text-[var(--accent)] hover:underline"
        >
          Show less ▴
        </button>
      ) : null}
    </div>
  );
}

"use client";

import type { ReactNode } from "react";

export type PillTab = { id: string; label: string };

export function PillTabs({
  tabs,
  activeId,
  onChange,
  rightSlot,
}: {
  tabs: PillTab[];
  activeId: string;
  onChange: (id: string) => void;
  rightSlot?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="inline-flex rounded-full border border-zinc-200/80 bg-zinc-100/50 p-1 dark:border-zinc-800/80 dark:bg-zinc-900/50">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t.id)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              activeId === t.id
                ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-50"
                : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {rightSlot}
    </div>
  );
}

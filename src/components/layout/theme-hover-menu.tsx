"use client";

import { Menu } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const options = [
  { id: "light" as const, label: "Light" },
  { id: "dark" as const, label: "Dark" },
  { id: "system" as const, label: "System" },
];

export function ThemeHoverMenu() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  function scheduleClose() {
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  }

  function cancelClose() {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => {
        cancelClose();
        setOpen(true);
      }}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] transition-colors hover:bg-[var(--surface-muted)] active:scale-[0.98]",
        )}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="Theme menu"
      >
        <Menu className="h-4 w-4" />
      </button>
      {open ? (
        <div
          className="absolute right-0 top-full z-50 mt-1 min-w-[9rem] rounded-lg border border-[var(--border)] bg-[var(--surface)] py-1 shadow-md"
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
        >
          {options.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => {
                setTheme(o.id);
                setOpen(false);
              }}
              className={cn(
                "flex w-full px-3 py-2 text-left text-sm transition-colors hover:bg-[var(--surface-muted)] active:bg-[var(--surface-muted)]",
                theme === o.id && "text-[var(--accent)] font-medium",
              )}
            >
              {o.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

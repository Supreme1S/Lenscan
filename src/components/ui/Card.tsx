"use client";

import { useRef, type ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
  padding?: string;
  /** When true, applies frosted liquid-glass surface with cursor-following highlight */
  glass?: boolean;
};

export function Card({
  children,
  className = "",
  padding = "p-5",
  glass = false,
}: CardProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  if (!glass) {
    return (
      <div className={`surface-card ${padding} ${className}`}>{children}</div>
    );
  }

  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty("--mx", `${(x / rect.width) * 100}%`);
    el.style.setProperty("--my", `${(y / rect.height) * 100}%`);
    const dx = (x / rect.width - 0.5) * 2;
    const dy = (y / rect.height - 0.5) * 2;
    el.style.setProperty("--rx", `${(-dy * 3).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${(dx * 3).toFixed(2)}deg`);
  }
  function onLeave(e: React.PointerEvent<HTMLDivElement>) {
    const el = e.currentTarget;
    el.style.setProperty("--mx", `50%`);
    el.style.setProperty("--my", `50%`);
    el.style.setProperty("--rx", `0deg`);
    el.style.setProperty("--ry", `0deg`);
  }

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`liquid-surface rounded-2xl ${padding} ${className}`}
    >
      <div className="relative z-10">{children}</div>
    </div>
  );
}

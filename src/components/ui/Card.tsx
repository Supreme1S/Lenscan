import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
  padding?: string;
  /** When true, applies frosted liquid-glass surface (use sparingly: TopBar, hero, summary) */
  glass?: boolean;
};

export function Card({
  children,
  className = "",
  padding = "p-5",
  glass = false,
}: CardProps) {
  const base = glass
    ? "liquid-glass rounded-2xl"
    : "surface-card";
  return <div className={`${base} ${padding} ${className}`}>{children}</div>;
}

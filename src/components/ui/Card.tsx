import type { ReactNode } from "react";

export function Card({
  children,
  className = "",
  padding = "p-5",
}: {
  children: ReactNode;
  className?: string;
  padding?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-slate-200/90 bg-white/80 shadow-sm shadow-slate-900/5 backdrop-blur-md ${padding} ${className}`}
    >
      {children}
    </div>
  );
}

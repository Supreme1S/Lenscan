import type { ReactNode } from "react";

const tones: Record<string, string> = {
  default:
    "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200",
  success:
    "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  warning: "bg-amber-500/15 text-amber-800 dark:text-amber-400",
  danger: "bg-red-500/15 text-red-700 dark:text-red-400",
  info: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-400",
};

export function Badge({
  children,
  tone = "default",
  className = "",
}: {
  children: ReactNode;
  tone?: keyof typeof tones;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

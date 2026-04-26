import type { ReactNode } from "react";
import { TopBar } from "@/components/layout/top-bar";

export function LayoutShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-[var(--background)] text-[var(--foreground)]">
      <TopBar />
      <main className="min-h-screen w-full pt-14">{children}</main>
    </div>
  );
}

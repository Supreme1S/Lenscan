import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
  padding?: string;
  /** Adds subtle hover (border + shadow). Use on clickable cards. */
  interactive?: boolean;
};

export function Card({
  children,
  className = "",
  padding = "p-5",
  interactive = false,
}: CardProps) {
  return (
    <div
      className={`surface-card ${interactive ? "surface-card-hover" : ""} ${padding} ${className}`}
    >
      {children}
    </div>
  );
}

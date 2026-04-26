"use client";

import { forwardRef, useRef, type ReactNode, type ButtonHTMLAttributes } from "react";

/**
 * Real liquid-glass surface inspired by Apple Vision Pro:
 *  - Frosted blur with saturation pump.
 *  - Soft inner highlight at the top edge.
 *  - Color blob inside that follows the cursor and refracts.
 *  - Subtle tilt (perspective rotateX/rotateY) tied to cursor position.
 *  - Specular highlight that tracks the cursor.
 *
 * Use it for any clickable surface: pills, cards, icon buttons.
 */

type CommonProps = {
  children: ReactNode;
  className?: string;
  /** "pill" = fully rounded; "card" = rounded-2xl */
  shape?: "pill" | "card" | "circle";
  /** Tint hue for the inner blob. Default cycles through indigo/teal. */
  hue?: "indigo" | "teal" | "amber" | "pink";
  /** How much tilt to apply on hover (deg). 0 disables. */
  tilt?: number;
  /** Padding shorthand (Tailwind classes). */
  padding?: string;
};

type ButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement>;

const HUE_STOPS: Record<NonNullable<CommonProps["hue"]>, string> = {
  indigo: "rgba(99,102,241,0.55), rgba(56,189,248,0.30) 40%, transparent 70%",
  teal: "rgba(20,184,166,0.55), rgba(99,102,241,0.30) 40%, transparent 70%",
  amber: "rgba(251,191,36,0.50), rgba(244,114,182,0.25) 40%, transparent 70%",
  pink: "rgba(244,114,182,0.55), rgba(99,102,241,0.30) 40%, transparent 70%",
};

function shapeClass(shape: NonNullable<CommonProps["shape"]>) {
  if (shape === "pill") return "rounded-full";
  if (shape === "circle") return "rounded-full aspect-square";
  return "rounded-2xl";
}

/** Internal hook: wires mouse handlers to update CSS vars on the element. */
function useLiquidPointer(tilt: number) {
  const ref = useRef<HTMLElement | null>(null);

  function onMove(e: React.PointerEvent<HTMLElement>) {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const px = (x / rect.width) * 100;
    const py = (y / rect.height) * 100;
    el.style.setProperty("--mx", `${px}%`);
    el.style.setProperty("--my", `${py}%`);

    if (tilt > 0) {
      const dx = (x / rect.width - 0.5) * 2; // -1..1
      const dy = (y / rect.height - 0.5) * 2;
      el.style.setProperty("--rx", `${(-dy * tilt).toFixed(2)}deg`);
      el.style.setProperty("--ry", `${(dx * tilt).toFixed(2)}deg`);
    }
  }

  function onLeave(e: React.PointerEvent<HTMLElement>) {
    const el = e.currentTarget;
    el.style.setProperty("--mx", `50%`);
    el.style.setProperty("--my", `50%`);
    el.style.setProperty("--rx", `0deg`);
    el.style.setProperty("--ry", `0deg`);
  }

  return { ref, onMove, onLeave };
}

/* ============== Pressable button ============== */
export const LiquidButton = forwardRef<HTMLButtonElement, ButtonProps>(function LiquidButton(
  {
    children,
    className = "",
    shape = "pill",
    hue = "indigo",
    tilt = 6,
    padding = "px-5 py-2.5",
    ...rest
  },
  ref,
) {
  const { onMove, onLeave } = useLiquidPointer(tilt);
  return (
    <button
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`liquid-surface group relative isolate inline-flex shrink-0 select-none items-center justify-center gap-2 text-sm font-medium text-[var(--foreground)] transition-transform duration-200 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 ${shapeClass(shape)} ${padding} ${className}`}
      style={
        {
          ["--liquid-hue" as string]: HUE_STOPS[hue],
        } as React.CSSProperties
      }
      {...rest}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
  );
});

/* ============== Static glass surface (cards, headers) ============== */
type DivProps = CommonProps & React.HTMLAttributes<HTMLDivElement>;

export function LiquidGlassPanel({
  children,
  className = "",
  shape = "card",
  hue = "indigo",
  tilt = 0,
  padding = "p-5",
  ...rest
}: DivProps) {
  const { onMove, onLeave } = useLiquidPointer(tilt);
  return (
    <div
      onPointerMove={tilt > 0 ? onMove : undefined}
      onPointerLeave={tilt > 0 ? onLeave : undefined}
      className={`liquid-surface relative isolate ${shapeClass(shape)} ${padding} ${className}`}
      style={
        {
          ["--liquid-hue" as string]: HUE_STOPS[hue],
        } as React.CSSProperties
      }
      {...rest}
    >
      <div className="relative z-10">{children}</div>
    </div>
  );
}

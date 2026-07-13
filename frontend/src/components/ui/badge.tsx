import type { HTMLAttributes } from "react";

import { cn } from "./utils";

export type BadgeVariant = "forest" | "clay" | "honey" | "paper" | "outline";

const variants: Record<BadgeVariant, string> = {
  forest: "border-transparent bg-[var(--forest-950,#102a20)] text-white",
  clay: "border-transparent bg-[var(--clay-500,#b86f45)] text-white",
  honey:
    "border-transparent bg-[var(--honey-500,#c79648)]/20 text-[var(--basalt-900,#2a211d)]",
  paper:
    "border-transparent bg-[var(--paper-100,#f3eee4)] text-[var(--ink-700,#454944)]",
  outline:
    "border-[var(--ink-950,#181a18)]/20 bg-transparent text-[var(--ink-700,#454944)]",
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({ className, variant = "paper", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex min-h-7 items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold leading-none",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}

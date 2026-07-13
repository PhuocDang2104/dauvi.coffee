import type { HTMLAttributes } from "react";

import { cn } from "./utils";

export function Skeleton({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "animate-pulse rounded-xl bg-[var(--sand-200,#e5d8c5)]/70 motion-reduce:animate-none",
        className,
      )}
      {...props}
    />
  );
}

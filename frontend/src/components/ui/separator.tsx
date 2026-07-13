import type { HTMLAttributes } from "react";

import { cn } from "./utils";

export function Separator({
  className,
  ...props
}: HTMLAttributes<HTMLHRElement>) {
  return (
    <hr
      className={cn(
        "border-0 border-t border-[var(--sand-200,#e5d8c5)]",
        className,
      )}
      {...props}
    />
  );
}

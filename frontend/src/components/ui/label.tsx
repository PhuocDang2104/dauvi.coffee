import type { LabelHTMLAttributes } from "react";

import { cn } from "./utils";

export function Label({
  className,
  ...props
}: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn(
        "text-sm font-semibold leading-6 text-[var(--ink-950,#181a18)]",
        className,
      )}
      {...props}
    />
  );
}

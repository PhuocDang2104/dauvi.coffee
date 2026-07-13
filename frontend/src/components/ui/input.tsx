import { forwardRef, type InputHTMLAttributes } from "react";

import { cn } from "./utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, invalid, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(
        "min-h-12 w-full rounded-xl border border-[var(--sand-200,#e5d8c5)] bg-white px-4 text-base text-[var(--ink-950,#181a18)] outline-none transition placeholder:text-[var(--ink-500,#6c716c)] focus:border-[var(--forest-600,#3f6b52)] focus:ring-2 focus:ring-[var(--forest-600,#3f6b52)]/20 disabled:cursor-not-allowed disabled:bg-[var(--paper-100,#f3eee4)] disabled:opacity-70",
        invalid &&
          "border-[#a4463d] focus:border-[#a4463d] focus:ring-[#a4463d]/20",
        className,
      )}
      {...props}
    />
  );
});

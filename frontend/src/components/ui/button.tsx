import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "./utils";

export type ButtonVariant =
  "primary" | "secondary" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg" | "icon";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "border-transparent bg-[var(--forest-950,#102a20)] text-white hover:bg-[var(--forest-800,#214536)]",
  secondary:
    "border-transparent bg-[var(--clay-500,#b86f45)] text-white hover:bg-[var(--roast-700,#5a3729)]",
  outline:
    "border-[var(--ink-950,#181a18)]/25 bg-transparent text-[var(--ink-950,#181a18)] hover:border-[var(--forest-950,#102a20)] hover:bg-[var(--paper-100,#f3eee4)]",
  ghost:
    "border-transparent bg-transparent text-[var(--ink-950,#181a18)] hover:bg-[var(--paper-100,#f3eee4)]",
  danger: "border-transparent bg-[#a4463d] text-white hover:bg-[#87372f]",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "min-h-11 px-4 text-sm",
  md: "min-h-11 px-5 text-sm",
  lg: "min-h-12 px-7 text-base",
  icon: "size-11 p-0",
};

export function buttonClassNames({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}): string {
  return cn(
    "inline-flex shrink-0 items-center justify-center gap-2 rounded-full border font-semibold leading-none transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--clay-500,#b86f45)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    variantClasses[variant],
    sizeClasses[size],
    className,
  );
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      asChild = false,
      className,
      variant = "primary",
      size = "md",
      type = "button",
      ...props
    },
    ref,
  ) {
    const Component = asChild ? Slot : "button";

    return (
      <Component
        ref={ref}
        type={asChild ? undefined : type}
        className={buttonClassNames({ variant, size, className })}
        {...props}
      />
    );
  },
);

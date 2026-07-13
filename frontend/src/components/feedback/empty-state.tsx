import Link from "next/link";
import { Coffee, SearchX, type LucideIcon } from "lucide-react";

import { buttonClassNames } from "@/components/ui/button";
import { cn } from "@/components/ui/utils";

export interface EmptyStateAction {
  label: string;
  href: string;
}

export interface EmptyStateProps {
  title?: string;
  description?: string;
  primaryAction?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
  icon?: LucideIcon;
  className?: string;
  kind?: "search" | "cart" | "generic";
}

export function EmptyState({
  title = "Chưa tìm thấy cà phê phù hợp",
  description = "Thử bỏ bớt một tiêu chí hoặc để Coffee Advisor chọn giúp bạn.",
  primaryAction,
  secondaryAction,
  icon,
  className,
  kind = "search",
}: EmptyStateProps) {
  const Icon = icon ?? (kind === "cart" ? Coffee : SearchX);

  return (
    <section
      className={cn(
        "flex min-h-80 flex-col items-center justify-center rounded-[1.75rem] border border-dashed border-[var(--sand-200,#e5d8c5)] bg-[var(--paper-100,#f3eee4)]/55 px-6 py-14 text-center",
        className,
      )}
      aria-labelledby="empty-state-title"
    >
      <span className="mb-5 grid size-14 place-items-center rounded-full bg-white text-[var(--forest-800,#214536)]">
        <Icon aria-hidden="true" className="size-6" strokeWidth={1.6} />
      </span>
      <h2
        id="empty-state-title"
        className="max-w-lg font-display text-3xl leading-tight text-[var(--ink-950,#181a18)]"
      >
        {title}
      </h2>
      <p className="mt-3 max-w-xl text-base leading-7 text-[var(--ink-700,#454944)]">
        {description}
      </p>
      {primaryAction || secondaryAction ? (
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          {primaryAction ? (
            <Link href={primaryAction.href} className={buttonClassNames()}>
              {primaryAction.label}
            </Link>
          ) : null}
          {secondaryAction ? (
            <Link
              href={secondaryAction.href}
              className={buttonClassNames({ variant: "outline" })}
            >
              {secondaryAction.label}
            </Link>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

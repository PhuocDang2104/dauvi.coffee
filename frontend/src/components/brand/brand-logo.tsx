import Link from "next/link";

import { BRAND_CONFIG } from "@/config/brand";
import { cn } from "@/components/ui/utils";

export interface BrandLogoProps {
  className?: string;
  href?: string | null;
  variant?: "full" | "mark";
  tone?: "dark" | "light";
  priorityLabel?: string;
}

function BrandLogoArtwork({
  variant,
  tone,
}: Pick<BrandLogoProps, "variant" | "tone">) {
  const textColor =
    tone === "light" ? "text-white" : "text-[var(--forest-950,#102a20)]";

  return (
    <span className={cn("inline-flex items-center gap-2.5", textColor)}>
      <svg
        aria-hidden="true"
        viewBox="0 0 44 44"
        className="size-9 shrink-0"
        fill="none"
      >
        <path
          d="M9 34.5c5-2.7 7.2-7.5 7.2-12.8 0-6.2 3.6-10.8 9.6-12.2 4.6-1.1 8.4 1.1 9.5 5.2 1.2 4.5-1.5 7.8-4.3 10.6-2.4 2.4-3.6 5.4-2.8 9.2"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M7.5 29c4.2-1.8 6-5.2 5.7-10.1M11 38c6.1-2.5 9-7.5 8.8-15.1M32.8 7.8c5.8 5.5 5.8 12.8.1 18.2"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinecap="round"
          opacity=".55"
        />
        <circle cx="28.5" cy="14.8" r="2.3" fill="var(--clay-500,#b86f45)" />
      </svg>
      {variant === "full" ? (
        <span className="flex flex-col leading-none">
          <span className="font-display text-[1.35rem] font-semibold tracking-[0.16em]">
            {BRAND_CONFIG.name}
          </span>
          <span className="mt-1 text-[0.55rem] font-bold uppercase tracking-[0.19em] opacity-70">
            {BRAND_CONFIG.subtitle}
          </span>
        </span>
      ) : null}
    </span>
  );
}

export function BrandLogo({
  className,
  href = "/",
  variant = "full",
  tone = "dark",
  priorityLabel = "DẤU VỊ — về trang chủ",
}: BrandLogoProps) {
  const artwork = <BrandLogoArtwork variant={variant} tone={tone} />;

  if (href === null) {
    return <span className={className}>{artwork}</span>;
  }

  return (
    <Link
      href={href}
      aria-label={priorityLabel}
      className={cn(
        "inline-flex min-h-11 items-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--clay-500,#b86f45)] focus-visible:ring-offset-2",
        className,
      )}
    >
      {artwork}
    </Link>
  );
}

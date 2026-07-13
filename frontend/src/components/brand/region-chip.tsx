import { MapPin } from "lucide-react";

import { cn } from "@/components/ui/utils";

export interface RegionChipProps {
  children: string;
  className?: string;
  subtle?: boolean;
}

export function RegionChip({
  children,
  className,
  subtle = false,
}: RegionChipProps) {
  return (
    <span
      className={cn(
        "inline-flex min-h-7 items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold",
        subtle
          ? "border-[var(--sand-200,#e5d8c5)] bg-white/75 text-[var(--ink-700,#454944)]"
          : "border-[var(--forest-600,#3f6b52)]/20 bg-[var(--forest-600,#3f6b52)]/10 text-[var(--forest-800,#214536)]",
        className,
      )}
    >
      <MapPin aria-hidden="true" className="size-3.5" strokeWidth={1.8} />
      {children}
    </span>
  );
}

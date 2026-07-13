import { cn } from "@/components/ui/utils";

export interface LotStampProps {
  code: string;
  className?: string;
  label?: string;
  compact?: boolean;
}

export function LotStamp({
  code,
  className,
  label = "Mã lô",
  compact = false,
}: LotStampProps) {
  return (
    <span
      className={cn(
        "inline-flex -rotate-1 flex-col border-2 border-current text-[var(--clay-500,#b86f45)]",
        compact ? "rounded px-2.5 py-1" : "rounded-lg px-4 py-2.5",
        className,
      )}
    >
      <span className="text-[0.6rem] font-extrabold uppercase tracking-[0.22em]">
        {label}
      </span>
      <span className="mt-0.5 font-mono text-xs font-bold tracking-[0.08em] sm:text-sm">
        {code.toUpperCase()}
      </span>
    </span>
  );
}

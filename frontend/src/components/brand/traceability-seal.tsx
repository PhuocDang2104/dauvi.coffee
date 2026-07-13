import { Route } from "lucide-react";

import { cn } from "@/components/ui/utils";

export interface TraceabilitySealProps {
  className?: string;
  label?: string;
  detail?: string;
}

export function TraceabilitySeal({
  className,
  label = "Vietnam Traceable",
  detail = "Lot passport",
}: TraceabilitySealProps) {
  return (
    <span
      className={cn(
        "inline-flex size-24 rotate-3 flex-col items-center justify-center rounded-full border border-dashed border-current text-center text-[var(--forest-800,#214536)]",
        className,
      )}
      aria-label={`${label} — ${detail}`}
    >
      <Route aria-hidden="true" className="mb-1 size-5" strokeWidth={1.6} />
      <span className="max-w-[5rem] text-[0.58rem] font-extrabold uppercase leading-3 tracking-[0.12em]">
        {label}
      </span>
      <span className="mt-0.5 text-[0.55rem] uppercase tracking-[0.1em] opacity-70">
        {detail}
      </span>
    </span>
  );
}

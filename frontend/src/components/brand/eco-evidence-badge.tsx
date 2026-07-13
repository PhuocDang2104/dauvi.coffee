import {
  BadgeCheck,
  BookOpen,
  FileText,
  FlaskConical,
  type LucideIcon,
} from "lucide-react";

import { EVIDENCE_LEVELS, type EvidenceLevel } from "@/config/brand";
import { cn } from "@/components/ui/utils";

const levelStyles: Record<EvidenceLevel, string> = {
  verified: "border-[#397151]/30 bg-[#397151]/10 text-[#245438]",
  "supplier-declared": "border-[#9a6a25]/30 bg-[#c79648]/15 text-[#72501e]",
  reference:
    "border-[var(--forest-600,#3f6b52)]/25 bg-[var(--forest-600,#3f6b52)]/10 text-[var(--forest-800,#214536)]",
  demo: "border-[#9b4f58]/25 bg-[#9b4f58]/10 text-[#733741]",
};

const levelIcons: Record<EvidenceLevel, LucideIcon> = {
  verified: BadgeCheck,
  "supplier-declared": FileText,
  reference: BookOpen,
  demo: FlaskConical,
};

export interface EcoEvidenceBadgeProps {
  level: EvidenceLevel;
  className?: string;
  compact?: boolean;
  showDescription?: boolean;
}

export function EcoEvidenceBadge({
  level,
  className,
  compact = false,
  showDescription = false,
}: EcoEvidenceBadgeProps) {
  const metadata = EVIDENCE_LEVELS[level];
  const Icon = levelIcons[level];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold leading-4",
        levelStyles[level],
        className,
      )}
      title={showDescription ? undefined : metadata.description}
    >
      <Icon
        aria-hidden="true"
        className="size-3.5 shrink-0"
        strokeWidth={1.8}
      />
      <span>{compact ? metadata.shortLabel : metadata.label}</span>
      {showDescription ? (
        <span className="font-normal">· {metadata.description}</span>
      ) : null}
    </span>
  );
}

import { Compass, Coffee, MapPin, WalletCards } from "lucide-react";

import type { RecommendationReason } from "../domain/advisor.types";

interface RecommendationReasonsProps {
  reasons: RecommendationReason[];
}

const REASON_ICONS = {
  taste: Coffee,
  brew: Compass,
  budget: WalletCards,
  origin: MapPin,
} as const;

export function RecommendationReasons({
  reasons,
}: RecommendationReasonsProps) {
  return (
    <ul className="space-y-3" aria-label="Lý do đề xuất">
      {reasons.slice(0, 4).map((reason) => {
        const Icon = REASON_ICONS[reason.matchType];

        return (
          <li key={`${reason.matchType}-${reason.title}`} className="flex gap-3">
            <span className="mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-[var(--paper-100)] text-[var(--forest-800)]">
              <Icon className="size-3.5" aria-hidden="true" />
            </span>
            <span className="min-w-0 text-sm leading-5">
              <strong className="block text-[var(--ink-950)]">
                {reason.title}
              </strong>
              <span className="mt-0.5 block text-[var(--ink-500)]">
                {reason.description}
              </span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}


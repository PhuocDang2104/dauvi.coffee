import { Box, Cherry, Factory, Flame, MapPin, PackageCheck } from "lucide-react";
import type { TraceabilityEvent } from "@/features/traceability/domain/traceability.types";

const icons = {
  farm: MapPin,
  harvest: Cherry,
  processing: Factory,
  "green-bean": Box,
  roasting: Flame,
  packaging: PackageCheck,
};

export function ProcessTimeline({ events, compact = false }: { events: TraceabilityEvent[]; compact?: boolean }) {
  return (
    <ol className={compact ? "grid gap-3 md:grid-cols-3 xl:grid-cols-6" : "relative grid gap-4 md:grid-cols-3 xl:grid-cols-6"} aria-label="Hành trình truy xuất sáu bước">
      {events.map((event, index) => {
        const Icon = icons[event.stage];
        return (
          <li key={event.id} className="relative rounded-2xl border border-basalt-900/10 bg-white/65 p-4">
            {index < events.length - 1 ? <span className="absolute -right-4 top-8 hidden h-px w-4 bg-basalt-900/20 xl:block" aria-hidden="true" /> : null}
            <span className="flex size-9 items-center justify-center rounded-full bg-forest-950 text-white">
              <Icon aria-hidden="true" size={16} />
            </span>
            <p className="lot-code mt-4 text-[0.63rem] font-bold uppercase text-clay-500">{event.dateLabel}</p>
            <h3 className="mt-1 text-sm font-extrabold text-forest-950">{index + 1}. {event.title}</h3>
            {!compact ? <p className="mt-2 text-xs leading-5 text-ink-700">{event.description}</p> : null}
          </li>
        );
      })}
    </ol>
  );
}

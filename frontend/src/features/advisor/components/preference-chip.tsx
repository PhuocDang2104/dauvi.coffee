import { Check } from "lucide-react";

interface PreferenceChipProps {
  name: string;
  value: string;
  label: string;
  description?: string;
  selected: boolean;
  onSelect: (value: string) => void;
}

export function PreferenceChip({
  name,
  value,
  label,
  description,
  selected,
  onSelect,
}: PreferenceChipProps) {
  return (
    <label
      className={`group relative flex min-h-20 cursor-pointer items-start gap-3 rounded-2xl border-2 p-4 transition-colors focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[var(--forest-600)] ${
        selected
          ? "border-[var(--forest-800)] bg-[var(--forest-950)] text-white"
          : "border-[color:var(--sand-200)] bg-white text-[var(--ink-950)] hover:border-[var(--forest-600)]"
      }`}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={selected}
        onChange={() => onSelect(value)}
        className="sr-only"
      />
      <span className="min-w-0 flex-1">
        <span className="block font-semibold leading-6">{label}</span>
        {description ? (
          <span
            className={`mt-1 block text-sm leading-5 ${
              selected ? "text-white/75" : "text-[var(--ink-500)]"
            }`}
          >
            {description}
          </span>
        ) : null}
      </span>
      <span
        className={`inline-flex size-6 shrink-0 items-center justify-center rounded-full border ${
          selected
            ? "border-white bg-white text-[var(--forest-950)]"
            : "border-[color:var(--sand-200)] text-transparent group-hover:border-[var(--forest-600)]"
        }`}
        aria-hidden="true"
      >
        <Check className="size-3.5" />
      </span>
    </label>
  );
}


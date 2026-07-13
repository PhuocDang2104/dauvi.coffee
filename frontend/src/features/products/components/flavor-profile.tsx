import type { FlavorProfile as FlavorProfileType } from "@/features/products/domain/product.types";

const profiles: Array<{ key: keyof Pick<FlavorProfileType, "bitterness" | "acidity" | "sweetness" | "body" | "aroma">; label: string; low: string; high: string }> = [
  { key: "bitterness", label: "Đắng", low: "dịu", high: "rõ và đậm" },
  { key: "acidity", label: "Chua", low: "trầm", high: "sáng" },
  { key: "sweetness", label: "Ngọt", low: "nhẹ", high: "rõ" },
  { key: "body", label: "Body", low: "mỏng", high: "dày và đầy" },
  { key: "aroma", label: "Hương thơm", low: "nhẹ", high: "phức hợp" },
];

export function FlavorProfile({ flavor }: { flavor: FlavorProfileType }) {
  return (
    <div className="grid gap-x-12 gap-y-6 md:grid-cols-2">
      {profiles.map(({ key, label, low, high }) => {
        const value = flavor[key];
        return (
          <div key={key}>
            <div className="flex items-end justify-between gap-4">
              <p className="font-bold text-ink-950">{label}</p>
              <p className="text-xs font-semibold text-ink-500">{value}/5 · {value >= 4 ? high : value <= 2 ? low : "cân bằng"}</p>
            </div>
            <div
              className="mt-2 grid grid-cols-5 gap-1.5"
              role="meter"
              aria-label={`${label}: ${value} trên 5`}
              aria-valuemin={1}
              aria-valuemax={5}
              aria-valuenow={value}
            >
              {Array.from({ length: 5 }).map((_, index) => (
                <span
                  key={index}
                  className={`h-2.5 rounded-full ${index < value ? "bg-clay-500" : "bg-sand-200"}`}
                  aria-hidden="true"
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

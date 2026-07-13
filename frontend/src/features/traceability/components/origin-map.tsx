import { cn } from "@/lib/utils";

const REGIONS = [
  { id: "gia-lai", label: "Gia Lai", x: 105, y: 238, altitude: "600–800 m", species: "Robusta" },
  { id: "dak-lak", label: "Đắk Lắk", x: 113, y: 272, altitude: "500–800 m", species: "Robusta" },
  { id: "bao-lam", label: "Bảo Lâm", x: 128, y: 313, altitude: "800–1.000 m", species: "Robusta" },
  { id: "da-lat", label: "Đà Lạt", x: 143, y: 301, altitude: "1.400–1.600 m", species: "Arabica" },
  { id: "langbiang", label: "Langbiang", x: 151, y: 290, altitude: "1.500–1.700 m", species: "Arabica" },
] as const;

interface OriginMapProps {
  highlightRegion?: string;
  className?: string;
  showLegend?: boolean;
}

export function OriginMap({ highlightRegion, className, showLegend = true }: OriginMapProps) {
  return (
    <figure className={cn("grid items-center gap-7 md:grid-cols-[minmax(220px,0.75fr)_1.25fr]", className)}>
      <div className="topo-surface mx-auto flex aspect-[3/4] w-full max-w-[22rem] items-center justify-center rounded-[2rem] border border-forest-950/10 bg-paper-100 p-6">
        <svg role="img" aria-labelledby="vietnam-map-title vietnam-map-desc" viewBox="0 0 260 430" className="h-full w-full">
          <title id="vietnam-map-title">Bản đồ các vùng cà phê trong bộ sưu tập DẤU VỊ</title>
          <desc id="vietnam-map-desc">Các điểm Gia Lai, Đắk Lắk, Bảo Lâm, Đà Lạt và Langbiang trên bản đồ Việt Nam cách điệu.</desc>
          <path
            d="M91 18c25 5 48 18 61 37 8 12 5 30 16 43 12 14 8 28-1 42-9 15-5 31 8 45 10 12 8 31-3 43-12 14-11 34 2 47 12 13 11 30-1 41-13 13-29 28-34 45-7 19-19 41-36 49-13 7-36 10-50 2-11-7-8-20 5-25 17-7 29-15 36-29 8-15 7-36 18-49 12-15 32-15 45-4 13 10 26 21 43 21 19 0 34-14 39-31 6-20-6-40-21-52-16-12-19-32-11-50 7-17 2-35-12-47-16-12-18-32-7-48 12-17 9-37-3-52-14-17-35-22-50-36-14-14-16-37-5-56 10-18 11-43-2-59C71 44 66 28 76 21c4-3 9-4 15-3Z"
            fill="rgba(255,255,255,.72)"
            stroke="#214536"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path d="M106 229c20 15 28 31 24 52-4 19 6 32 20 42" fill="none" stroke="#b86f45" strokeWidth="1.4" strokeDasharray="4 5" />
          {REGIONS.map((region) => {
            const highlighted = !highlightRegion || highlightRegion === region.id;
            return (
              <g key={region.id} opacity={highlighted ? 1 : 0.3}>
                <circle cx={region.x} cy={region.y} r={highlightRegion === region.id ? 10 : 7} fill="#faf8f2" stroke="#102a20" strokeWidth="2" />
                <circle cx={region.x} cy={region.y} r="2.5" fill={highlightRegion === region.id ? "#b86f45" : "#102a20"} />
                <text x={region.x + 11} y={region.y + 4} fill="#181a18" fontSize="10" fontWeight="700">{region.label}</text>
              </g>
            );
          })}
        </svg>
      </div>

      {showLegend ? (
        <figcaption>
          <p className="eyebrow">Từ Tây Nguyên đến Lâm Đồng</p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2" aria-label="Danh sách vùng trên bản đồ">
            {REGIONS.map((region) => (
              <li
                key={region.id}
                className={cn(
                  "rounded-2xl border p-4",
                  highlightRegion === region.id
                    ? "border-clay-500 bg-white shadow-soft"
                    : "border-basalt-900/10 bg-white/55",
                )}
              >
                <p className="font-bold text-forest-950">{region.label}</p>
                <p className="mt-1 text-xs leading-5 text-ink-700">{region.species} · {region.altitude}</p>
              </li>
            ))}
          </ul>
        </figcaption>
      ) : null}
    </figure>
  );
}

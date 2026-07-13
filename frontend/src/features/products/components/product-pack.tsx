import type { Product } from "@/features/products/domain/product.types";
import { cn } from "@/lib/utils";

const ACCENTS: Record<string, { shell: string; ink: string; stamp: string }> = {
  "trs1-tay-nguyen-daily-phin": {
    shell: "bg-[#b8896e]",
    ink: "text-basalt-900",
    stamp: "border-basalt-900/35 bg-mist-50/45",
  },
  "tr4-dak-lak-traceable-robusta": {
    shell: "bg-forest-800",
    ink: "text-mist-50",
    stamp: "border-mist-50/35 bg-forest-950/25",
  },
  "tr9-large-bean-fine-robusta": {
    shell: "bg-honey-500",
    ink: "text-basalt-900",
    stamp: "border-basalt-900/30 bg-mist-50/35",
  },
  "xanh-lun-ts5-bao-lam-honey": {
    shell: "bg-[#668064]",
    ink: "text-mist-50",
    stamp: "border-mist-50/35 bg-forest-950/20",
  },
  "catimor-da-lat-washed": {
    shell: "bg-[#c8d3d2]",
    ink: "text-forest-950",
    stamp: "border-forest-950/30 bg-mist-50/45",
  },
  "bourbon-langbiang-honey": {
    shell: "bg-berry-500",
    ink: "text-mist-50",
    stamp: "border-mist-50/35 bg-basalt-900/15",
  },
};

const processLabels: Record<string, string> = {
  natural: "Natural",
  honey: "Honey",
  washed: "Washed",
};

const roastLabels: Record<string, string> = {
  light: "Light",
  "light-medium": "Light–medium",
  medium: "Medium",
  "medium-dark": "Medium–dark",
  dark: "Dark",
};

interface ProductPackProps {
  product: Product;
  weightLabel?: string;
  className?: string;
  priority?: boolean;
}

export function ProductPack({ product, weightLabel = "250 g", className }: ProductPackProps) {
  const accent = ACCENTS[product.slug] ?? ACCENTS["tr4-dak-lak-traceable-robusta"];

  return (
    <div
      className={cn(
        "relative aspect-[4/5] w-full max-w-[21rem] overflow-hidden rounded-t-[1.2rem] rounded-b-[0.7rem] border border-black/10 shadow-[0_24px_45px_rgba(24,26,24,0.16)]",
        accent.shell,
        accent.ink,
        className,
      )}
      role="img"
      aria-label={`Gói cà phê DẤU VỊ ${product.displayName}, ${product.regionLabel}, ${processLabels[product.process]}, ${weightLabel}`}
    >
      <div className="absolute inset-x-0 top-0 h-3 bg-black/10" />
      <svg
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[68%] w-full opacity-30"
        viewBox="0 0 320 360"
        fill="none"
        preserveAspectRatio="none"
      >
        <path d="M-30 270C34 197 68 292 136 220s104-40 202-132" stroke="currentColor" strokeWidth="1.4" />
        <path d="M-46 296c70-75 111 21 181-50s117-48 224-151" stroke="currentColor" strokeWidth="1.2" />
        <path d="M-62 322c76-76 130 18 200-45S266 211 380 98" stroke="currentColor" strokeWidth="1" />
        <path d="M-34 242c60-65 90 17 153-47s106-27 214-127" stroke="currentColor" strokeWidth="1" />
        <path d="M14 352c64-60 102 1 163-53s94-58 172-127" stroke="currentColor" strokeWidth="0.9" />
        <circle cx="259" cy="86" r="5" fill="currentColor" />
        <path d="M259 86 198 151" stroke="currentColor" strokeDasharray="3 5" />
      </svg>

      <div className="relative flex h-full flex-col p-[8%]">
        <div className="flex items-start justify-between gap-3 border-b border-current/25 pb-4">
          <div>
            <p className="font-display text-[clamp(1.05rem,4vw,1.45rem)] font-semibold leading-none tracking-[-0.03em]">DẤU VỊ</p>
            <p className="mt-1 text-[0.48rem] font-bold uppercase tracking-[0.21em] opacity-80">Vietnam Traceable Coffee</p>
          </div>
          <span className={cn("lot-code rounded-full border px-2 py-1 text-[0.47rem] font-bold uppercase", accent.stamp)}>
            {product.species}
          </span>
        </div>

        <div className="mt-[10%] max-w-[92%]">
          <p className="text-[0.58rem] font-extrabold uppercase tracking-[0.2em] opacity-75">{product.regionLabel}</p>
          <p className="mt-2 font-display text-[clamp(1.5rem,5vw,2.65rem)] font-semibold leading-[0.95] tracking-[-0.055em]">
            {product.shortName}
          </p>
          <p className="mt-3 text-[0.65rem] font-bold uppercase tracking-[0.15em] opacity-85">{product.variety}</p>
        </div>

        <div className="mt-auto grid grid-cols-2 gap-x-3 gap-y-2 border-t border-current/30 pt-4 text-[0.55rem] font-bold uppercase tracking-[0.08em]">
          <span>{processLabels[product.process]}</span>
          <span className="text-right">{roastLabels[product.roastLevel]}</span>
          <span className="lot-code col-span-2 truncate opacity-80">LOT {product.featuredLotCode}</span>
          <span>{weightLabel}</span>
          <span className="text-right">From Vietnam</span>
        </div>
      </div>
    </div>
  );
}

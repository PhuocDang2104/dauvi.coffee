import Link from "next/link";
import { ArrowDownRight, ArrowRight, MapPin } from "lucide-react";
import type { Product } from "@/features/products/domain/product.types";
import { ProductPack } from "@/features/products/components/product-pack";

export function HomeHero({ products }: { products: Product[] }) {
  const tr4 = products.find((product) => product.id === "tr4") ?? products[0];
  const catimor = products.find((product) => product.id === "catimor") ?? products[1] ?? products[0];

  return (
    <section className="relative overflow-hidden border-b border-basalt-900/10 bg-paper-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(199,150,72,.15),transparent_35%)]" aria-hidden="true" />
      <div className="wide-shell relative grid min-h-[calc(100svh-7rem)] items-center gap-14 py-16 lg:grid-cols-[1.05fr_.95fr] lg:py-20">
        <div className="relative z-10 max-w-3xl">
          <p className="eyebrow">Vietnam Traceable Coffee Collection</p>
          <h1 className="display-heading mt-6">Cà phê Việt Nam, được kể đến từng lô.</h1>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/shop" className="button-primary">
              Khám phá bộ sưu tập <ArrowRight aria-hidden="true" size={17} />
            </Link>
            <Link href="/advisor" className="button-secondary">
              Để Coffee Advisor chọn giúp
            </Link>
          </div>
          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-basalt-900/15 pt-6 text-xs font-bold uppercase tracking-[0.1em] text-ink-700">
            <span>06 dòng cà phê</span>
            <span>05 vùng trồng</span>
            <span>06 hồ sơ lô demo</span>
          </div>
        </div>

        <div className="topo-surface relative min-h-[32rem] rounded-[2rem] border border-forest-950/10 bg-mist-50/60 p-5 sm:min-h-[38rem]">
          <div className="hero-pack-float absolute left-[2%] top-[7%] z-10 w-[61%] -rotate-6 sm:left-[4%] sm:w-[57%]">
            <ProductPack product={tr4} priority />
          </div>
          <div className="hero-pack-float-delayed absolute bottom-[2%] right-[0%] z-20 w-[58%] rotate-5 sm:right-[2%] sm:w-[54%]">
            <ProductPack product={catimor} priority />
          </div>
          <svg aria-hidden="true" className="absolute inset-0 h-full w-full text-clay-500" viewBox="0 0 600 650" fill="none">
            <path d="M488 88c-78 93-141 167-185 259-38 80-61 127-155 209" stroke="currentColor" strokeWidth="2" strokeDasharray="7 9" />
            <circle cx="489" cy="87" r="6" fill="currentColor" />
            <circle cx="148" cy="557" r="6" fill="currentColor" />
          </svg>
          <span className="absolute right-5 top-7 rounded-full border border-forest-950/10 bg-white/90 px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.12em]">Natural · 500–800 m</span>
          <span className="lot-code absolute bottom-5 left-5 rounded-full bg-forest-950 px-3 py-1.5 text-[0.58rem] font-bold text-white">LOT TR4-DLK-26-N02</span>
          <div className="absolute left-[46%] top-[43%] hidden items-center gap-2 rounded-full bg-mist-50/95 px-3 py-2 text-[0.64rem] font-bold text-forest-950 shadow-soft sm:flex">
            <MapPin aria-hidden="true" size={13} /> Đắk Lắk → Đà Lạt
          </div>
        </div>
      </div>
      <a href="#collection-overview" className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 items-center gap-2 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-ink-500 lg:flex">
        Cuộn để theo dấu <ArrowDownRight aria-hidden="true" size={15} />
      </a>
    </section>
  );
}

export function CollectionOverview() {
  const stats = [
    ["04", "Robusta"],
    ["02", "Arabica"],
    ["03", "Sơ chế"],
    ["05", "Vùng"],
  ];

  return (
    <section id="collection-overview" className="section-space shell">
      <div className="max-w-3xl">
        <p className="eyebrow">Collection overview</p>
        <h2 className="section-heading mt-4">Sáu sản phẩm, một hành trình Việt Nam</h2>
      </div>
      <div className="mt-10 grid overflow-hidden rounded-[1.5rem] border border-basalt-900/10 bg-white/55 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(([value, label]) => (
          <div key={label} className="border-b border-r border-basalt-900/10 p-6 last:border-b-0 lg:p-7">
            <p className="font-display text-5xl font-semibold tracking-[-0.06em] text-clay-500">{value}</p>
            <h3 className="mt-2 font-bold text-forest-950">{label}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}

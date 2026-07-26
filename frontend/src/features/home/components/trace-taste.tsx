import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/features/products/domain/product.types";

export { TraceabilityCarousel as TraceabilitySpotlight } from "./traceability-carousel";

export function TasteSpectrum({ products }: { products: Product[] }) {
  return (
    <section className="section-space shell">
      <div className="max-w-3xl">
        <p className="eyebrow">Taste-first selection</p>
        <h2 className="section-heading mt-4">Bắt đầu từ khẩu vị của bạn</h2>
      </div>
      <div className="mt-12 rounded-[1.7rem] border border-basalt-900/10 bg-white/65 p-6 md:p-10">
        <div className="flex justify-between gap-5 text-xs font-extrabold uppercase tracking-[0.1em] text-ink-700">
          <span>Đậm & nhiều caffeine</span>
          <span className="text-right">Thanh & giàu hương</span>
        </div>
        <div className="relative mt-9 grid grid-cols-6 gap-1 before:absolute before:left-[4%] before:right-[4%] before:top-3 before:h-0.5 before:bg-gradient-to-r before:from-roast-700 before:via-clay-500 before:to-honey-500">
          {products.map((product, index) => (
            <Link key={product.id} href={`/shop/${product.slug}`} className="group relative z-10 flex min-w-0 flex-col items-center text-center">
              <span className={`size-6 rounded-full border-4 border-mist-50 ${index < 3 ? "bg-roast-700" : index < 5 ? "bg-clay-500" : "bg-honey-500"} shadow-[0_0_0_1px_rgba(24,26,24,.15)]`} />
              <span className="mt-4 max-w-full truncate text-[0.63rem] font-extrabold text-forest-950 sm:text-xs">{product.shortName}</span>
              <span className="mt-1 hidden text-[0.65rem] text-ink-500 md:block">Body {product.flavor.body}/5</span>
            </Link>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/advisor" className="button-primary">Tìm cà phê phù hợp <ArrowRight aria-hidden="true" size={17} /></Link>
        </div>
      </div>
    </section>
  );
}

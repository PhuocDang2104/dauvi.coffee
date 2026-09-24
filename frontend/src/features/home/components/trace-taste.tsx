import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/features/products/domain/product.types";

export { TraceabilityCarousel as TraceabilitySpotlight } from "./traceability-carousel";

export function TasteSpectrum({ products }: { products: Product[] }) {
  const orderedProducts = [...products].sort((a, b) => b.flavor.body - a.flavor.body);
  return (
    <section className="section-space shell">
      <div className="max-w-3xl">
        <p className="eyebrow">Taste-first selection</p>
        <h2 className="section-heading mt-4">Bắt đầu từ khẩu vị của bạn</h2>
      </div>
      <div className="mt-12 rounded-[1.7rem] border border-basalt-900/10 bg-white/65 p-6 md:p-10">
        <div className="flex justify-between gap-5 text-xs font-extrabold uppercase tracking-[0.1em] text-ink-700">
          <span>Body dày</span>
          <span className="text-right">Body thanh nhẹ</span>
        </div>
        <div className="relative mt-9 grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-6 md:gap-2 md:before:absolute md:before:left-[4%] md:before:right-[4%] md:before:top-3 md:before:h-0.5 md:before:bg-sand-200">
          {orderedProducts.map((product, index) => (
            <Link key={product.id} href={`/shop/${product.slug}`} className="group relative z-10 flex min-w-0 flex-col items-center rounded-lg p-1 text-center transition-colors hover:bg-paper-100">
              <span className={`size-6 rounded-full border-4 border-mist-50 ${index < 3 ? "bg-roast-700" : index < 5 ? "bg-clay-500" : "bg-honey-500"} shadow-[0_0_0_1px_rgba(24,26,24,.15)]`} />
              <span className="mt-3 text-xs font-bold text-forest-950">{product.shortName}</span>
              <span className="mt-1 text-xs text-ink-700">Body {product.flavor.body}/5</span>
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

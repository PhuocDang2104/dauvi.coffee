import type { Product } from "@/features/products/domain/product.types";
import { ProductPack } from "./product-pack";

export function ProductDetailGallery({ product }: { product: Product }) {
  return (
    <div className="grid gap-3 sm:grid-cols-[1fr_7rem] lg:grid-cols-[1fr_8rem]">
      <div className="topo-surface flex min-h-[28rem] items-center justify-center rounded-[1.8rem] border border-basalt-900/10 bg-paper-100 p-3 shadow-[0_20px_70px_rgba(24,26,24,.09)] md:min-h-[38rem] md:p-5">
        <ProductPack product={product} className="w-full max-w-[38rem]" priority />
      </div>
      <div className="order-first grid grid-cols-3 gap-3 sm:order-none sm:grid-cols-1">
        <div className="topo-surface flex aspect-square items-center justify-center rounded-2xl border border-forest-800/25 bg-white/60 p-3">
          <ProductPack product={product} className="w-full rounded-xl shadow-none" />
        </div>
        <div className="flex aspect-square items-center justify-center rounded-2xl border border-basalt-900/10 bg-forest-950 p-4 text-center text-mist-50">
          <div>
            <p className="lot-code text-[0.53rem] uppercase opacity-70">Featured lot</p>
            <p className="lot-code mt-2 break-all text-[0.63rem] font-bold leading-4">{product.featuredLotCode}</p>
          </div>
        </div>
        <div className="flex aspect-square items-center justify-center rounded-2xl border border-basalt-900/10 bg-white/65 p-4 text-center">
          <div>
            <p className="text-[0.58rem] font-bold uppercase tracking-[0.12em] text-ink-500">Hương vị</p>
            <p className="mt-2 font-display text-sm font-semibold leading-4 text-forest-950">{product.flavor.notes.slice(0, 2).join(" · ")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

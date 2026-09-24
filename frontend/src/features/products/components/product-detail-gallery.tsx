import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Product } from "@/features/products/domain/product.types";
import { ProductPack } from "./product-pack";

export function ProductDetailGallery({ product }: { product: Product }) {
  return (
    <div className="self-start lg:sticky lg:top-32">
      <div className="flex aspect-[5/6] items-center justify-center overflow-hidden rounded-xl border border-basalt-900/10 bg-paper-100 p-3 sm:aspect-square md:p-5">
        <ProductPack product={product} className="w-full max-w-[32rem]" priority />
      </div>
      <Link href={`/traceability/${product.featuredLotCode}`} className="mt-4 flex min-h-14 items-center justify-between gap-4 border-b border-basalt-900/15 pb-4 text-sm text-forest-950">
        <span><span className="block text-xs text-ink-500">Khám phá hồ sơ lô demo</span><span className="lot-code mt-1 block font-bold">{product.featuredLotCode}</span></span><ArrowUpRight size={20} aria-hidden="true" />
      </Link>
    </div>
  );
}

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Product } from "@/features/products/domain/product.types";
import { formatCurrency } from "@/lib/format/currency";
import { ProductPack } from "./product-pack";
import { ProductQuickView } from "./product-quick-view";

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

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const startingPrice = Math.min(...product.variants.filter((variant) => variant.inStock).map((variant) => variant.price.amount));

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.55rem] border border-basalt-900/10 bg-white/80 shadow-[0_14px_45px_rgba(24,26,24,.06)] transition duration-300 hover:-translate-y-1 hover:border-forest-800/25 hover:shadow-[0_24px_70px_rgba(24,26,24,.13)]">
      <div className="relative aspect-[5/5.4] overflow-hidden bg-paper-100">
        <Link
          href={`/shop/${product.slug}`}
          className="absolute inset-0 flex items-center justify-center p-2 md:p-3"
          aria-label={`Xem ${product.displayName}`}
        >
        <div className="absolute left-4 top-4 z-10 rounded-full border border-forest-950/15 bg-mist-50/90 px-3 py-1 text-[0.66rem] font-bold uppercase tracking-[0.12em] text-forest-800 backdrop-blur">
          {product.regionLabel}
        </div>
        {product.badges[0] ? (
          <div className="absolute right-4 top-4 z-10 rounded-full bg-forest-950 px-3 py-1 text-[0.63rem] font-bold uppercase tracking-[0.1em] text-white">
            {product.badges[0]}
          </div>
        ) : null}
          <ProductPack
            product={product}
            className="w-[92%] max-w-[24rem] transition duration-500 ease-out group-hover:scale-[1.035]"
            priority={priority}
          />
        </Link>
        <ProductQuickView product={product} />
      </div>

      <div className="flex flex-1 flex-col p-5 md:p-6">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-ink-500">
          {product.species} · {processLabels[product.process]} · {roastLabels[product.roastLevel]}
        </p>
        <h3 className="mt-2 font-display text-[1.55rem] font-semibold leading-tight tracking-[-0.035em]">
          <Link className="after:absolute" href={`/shop/${product.slug}`}>
            {product.displayName}
          </Link>
        </h3>
        <p className="mt-3 text-sm leading-6 text-ink-700">{product.flavor.notes.slice(0, 3).join(" · ")}</p>
        <div className="mt-auto flex items-end justify-between gap-4 pt-6">
          <div>
            <p className="text-[0.66rem] font-bold uppercase tracking-[0.12em] text-ink-500">Từ</p>
            <p className="mt-0.5 font-bold text-forest-950">{formatCurrency(startingPrice)}</p>
          </div>
          <Link className="flex min-h-11 items-center gap-2 rounded-full px-1 text-sm font-bold text-forest-950 underline decoration-forest-600/30 underline-offset-4" href={`/shop/${product.slug}`}>
            Xem chi tiết <ArrowUpRight aria-hidden="true" size={16} />
          </Link>
        </div>
      </div>
    </article>
  );
}

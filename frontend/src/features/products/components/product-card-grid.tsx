import type { Product } from "@/features/products/domain/product.types";
import { ProductCard } from "./product-card";

export function ProductCardGrid({ products, compact = false }: { products: Product[]; compact?: boolean }) {
  return (
    <div className={`grid gap-5 sm:grid-cols-2 ${compact ? "2xl:grid-cols-3" : "lg:grid-cols-3"}`}>
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} priority={index < 3} />
      ))}
    </div>
  );
}

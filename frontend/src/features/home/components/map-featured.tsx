import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/features/products/domain/product.types";
import { ProductCardGrid } from "@/features/products/components/product-card-grid";
import { InteractiveFlavorMap } from "./interactive-flavor-map";

export function FlavorMapSection() {
  return <InteractiveFlavorMap />;
}

export function FeaturedProductsSection({ products }: { products: Product[] }) {
  return (
    <section className="section-space shell">
      <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="eyebrow">Bộ sưu tập DẤU VỊ</p>
          <h2 className="section-heading mt-4">Chọn một điểm bắt đầu</h2>
        </div>
        <Link className="button-secondary self-start md:self-auto" href="/shop">
          Xem và lọc sản phẩm <ArrowRight aria-hidden="true" size={17} />
        </Link>
      </div>
      <ProductCardGrid products={products} />
    </section>
  );
}

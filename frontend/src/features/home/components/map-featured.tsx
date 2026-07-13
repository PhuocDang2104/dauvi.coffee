import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/features/products/domain/product.types";
import { ProductCardGrid } from "@/features/products/components/product-card-grid";
import { OriginMap } from "@/features/traceability/components/origin-map";

export function FlavorMapSection() {
  return (
    <section className="border-y border-basalt-900/10 bg-forest-950 py-20 text-mist-50 md:py-28">
      <div className="shell">
        <div className="max-w-3xl">
          <p className="eyebrow !text-honey-500">Vietnam flavor map</p>
          <h2 className="section-heading mt-4">Một bản đồ, nhiều sắc thái cà phê</h2>
        </div>
        <OriginMap className="mt-12 text-ink-950 [&_figcaption]:text-mist-50 [&_figcaption_li]:bg-white/10 [&_figcaption_li]:text-mist-50 [&_figcaption_p]:text-mist-50" />
      </div>
    </section>
  );
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

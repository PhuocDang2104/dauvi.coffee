import type { Metadata } from "next";
import { Suspense } from "react";
import { getRepositories } from "@/lib/data-source";
import { ShopCatalog } from "@/features/products/components/shop-catalog";

export const metadata: Metadata = {
  title: "Bộ sưu tập",
  description: "Chọn sáu dòng cà phê Việt Nam theo vị, vùng trồng, cách sơ chế, mức rang và cách pha tại nhà.",
  alternates: { canonical: "/shop" },
};

export default async function ShopPage() {
  const products = await getRepositories().products.list();

  return (
    <main id="main-content">
      <header className="topo-surface border-b border-basalt-900/10 bg-paper-100 py-16 md:py-24">
        <div className="shell">
          <p className="eyebrow">Vietnam Traceable Coffee Collection</p>
          <h1 className="display-heading mt-5 max-w-4xl">Chọn cà phê theo vị, vùng và cách pha</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-ink-700">Sáu dòng cà phê Việt Nam đóng gói, từ Daily Phin đến Heritage Arabica.</p>
        </div>
      </header>
      <div className="shell section-space !pt-10 md:!pt-14">
        <Suspense fallback={<div className="h-[42rem] animate-pulse rounded-[1.5rem] bg-paper-100" aria-label="Đang tải bộ lọc" />}>
          <ShopCatalog products={products} />
        </Suspense>
      </div>
    </main>
  );
}

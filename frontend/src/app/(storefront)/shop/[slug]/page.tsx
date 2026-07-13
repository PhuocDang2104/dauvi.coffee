import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ChevronRight, Info, MapPin } from "lucide-react";
import { getRepositories } from "@/lib/data-source";
import { formatCurrency } from "@/lib/format/currency";
import { getStartingPrice } from "@/features/products/domain/product.utils";
import { ProductDetailGallery } from "@/features/products/components/product-detail-gallery";
import { AddToCartPanel } from "@/features/products/components/add-to-cart-panel";
import { FlavorProfile } from "@/features/products/components/flavor-profile";
import { OriginPassport } from "@/features/products/components/origin-passport";
import { BrewMatch } from "@/features/products/components/brew-match";
import { ProductCardGrid } from "@/features/products/components/product-card-grid";
import { ProcessTimeline } from "@/features/traceability/components/process-timeline";
import { TransparencyTable } from "@/features/traceability/components/transparency-table";
import { ProductJsonLd } from "@/components/seo/product-json-ld";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const products = await getRepositories().products.list();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getRepositories().products.getBySlug(slug);
  if (!product) return { title: "Không tìm thấy sản phẩm" };
  const description = `${product.regionLabel} · ${product.process} · ${product.roastLevel}. Hương vị ${product.flavor.notes.slice(0, 3).join(", ")}.`;
  return {
    title: product.displayName,
    description,
    alternates: { canonical: `/shop/${product.slug}` },
    openGraph: { title: product.displayName, description, images: ["/brand/og-placeholder.svg"] },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const repositories = getRepositories();
  const product = await repositories.products.getBySlug(slug);
  if (!product) notFound();

  const [lot, allProducts] = await Promise.all([
    repositories.traceability.getByLotCode(product.featuredLotCode),
    repositories.products.list(),
  ]);
  if (!lot) notFound();

  const related = allProducts
    .filter((item) => item.id !== product.id)
    .map((item) => ({
      item,
      relevance:
        item.brewMethods.filter((method) => product.brewMethods.includes(method)).length * 3 -
        Math.abs(item.flavor.body - product.flavor.body),
    }))
    .sort((left, right) => right.relevance - left.relevance)
    .slice(0, 3)
    .map(({ item }) => item);

  const breadcrumbs = [
    { name: "Trang chủ", href: "/" },
    { name: "Bộ sưu tập", href: "/shop" },
    { name: product.displayName, href: `/shop/${product.slug}` },
  ];

  return (
    <main id="main-content" className="pb-20 md:pb-0">
      <ProductJsonLd product={product} />
      <BreadcrumbJsonLd items={breadcrumbs} />

      <div className="shell py-5 md:py-7">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs font-semibold text-ink-500">
          <Link href="/">Trang chủ</Link><ChevronRight aria-hidden="true" size={13} />
          <Link href="/shop">Bộ sưu tập</Link><ChevronRight aria-hidden="true" size={13} />
          <span aria-current="page" className="text-ink-950">{product.shortName}</span>
        </nav>
      </div>

      <section className="shell grid gap-10 pb-16 lg:grid-cols-[1.18fr_.82fr] lg:gap-14 lg:pb-24">
        <ProductDetailGallery product={product} />
        <div className="lg:sticky lg:top-32 lg:self-start">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-forest-600"><MapPin aria-hidden="true" size={15} /> {product.regionLabel}</div>
          <h1 className="mt-4 font-display text-[clamp(2.5rem,4.5vw,4.4rem)] font-semibold leading-[1.02] tracking-[-0.055em]">{product.displayName}</h1>
          <p className="mt-5 text-lg leading-8 text-ink-700">{product.proposition}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {product.flavor.notes.map((note) => <span key={note} className="rounded-full bg-paper-100 px-3 py-1.5 text-xs font-bold text-roast-700">{note}</span>)}
          </div>
          <p className="mt-7 border-y border-basalt-900/10 py-5 text-sm text-ink-500">Giá từ <strong className="ml-1 text-xl text-forest-950">{formatCurrency(getStartingPrice(product))}</strong></p>
          <div className="mt-6"><AddToCartPanel product={product} /></div>
          <Link href={`/traceability/${product.featuredLotCode}`} className="mt-5 flex min-h-12 items-center justify-between rounded-2xl border border-clay-500/20 bg-clay-500/5 px-4 text-sm font-bold text-roast-700">
            <span><span className="mr-2 text-xs font-semibold">Lô nổi bật</span><span className="lot-code">{product.featuredLotCode}</span></span><ArrowRight aria-hidden="true" size={17} />
          </Link>
        </div>
      </section>

      <section className="section-space border-y border-basalt-900/10 bg-paper-100">
        <div className="shell grid gap-10 lg:grid-cols-[.65fr_1.35fr]">
          <div><p className="eyebrow">Flavor profile</p><h2 className="section-heading mt-4">Cấu trúc trong tách</h2><p className="mt-5 max-w-md leading-7 text-ink-700">Năm chỉ số giúp bạn hình dung nhanh, luôn đi kèm thang điểm và mô tả bằng chữ.</p></div>
          <FlavorProfile flavor={product.flavor} />
        </div>
      </section>

      <section className="section-space shell">
        <div className="mb-10 max-w-3xl"><p className="eyebrow">Origin passport</p><h2 className="section-heading mt-4">Một gói cà phê, một hồ sơ nguồn gốc</h2></div>
        <OriginPassport product={product} lot={lot} />
      </section>

      <section className="section-space border-y border-basalt-900/10 bg-paper-100">
        <div className="shell">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div><p className="eyebrow">Trace journey</p><h2 className="section-heading mt-4">Sáu chặng của lô {product.shortName}</h2></div>
            <Link href={`/traceability/${lot.lotCode}`} className="button-secondary self-start md:self-auto">Xem hồ sơ lô đầy đủ <ArrowRight aria-hidden="true" size={17} /></Link>
          </div>
          <div className="mt-10"><ProcessTimeline events={lot.timeline} /></div>
        </div>
      </section>

      <section className="section-space shell">
        <div className="max-w-3xl"><p className="eyebrow">Brew match</p><h2 className="section-heading mt-4">Cách pha hợp với cấu trúc vị này</h2><p className="mt-5 text-ink-700">Thông số là điểm bắt đầu gợi ý; hãy điều chỉnh theo dụng cụ, nguồn nước và khẩu vị của bạn.</p></div>
        <div className="mt-10"><BrewMatch product={product} /></div>
      </section>

      <section className="section-space border-y border-basalt-900/10 bg-forest-950 text-white">
        <div className="shell">
          <div className="grid gap-8 lg:grid-cols-[.65fr_1.35fr] lg:items-end">
            <div><p className="eyebrow !text-honey-500">Transparency</p><h2 className="section-heading mt-4">Dữ liệu được đặt cạnh bằng chứng</h2></div>
            <p className="max-w-xl text-sand-200 lg:justify-self-end"><Info className="mr-2 inline" aria-hidden="true" size={16} />Hồ sơ lô và đơn vị sản xuất đang là Demo Data; thông tin giống được tách riêng dưới nhãn Reference Data.</p>
          </div>
          <div className="mt-10 text-ink-950"><TransparencyTable evidence={lot.evidence} /></div>
        </div>
      </section>

      <section className="section-space shell">
        <div className="mb-10"><p className="eyebrow">Tiếp tục hành trình vị giác</p><h2 className="section-heading mt-4">Có thể bạn cũng hợp</h2></div>
        <ProductCardGrid products={related} />
      </section>
    </main>
  );
}

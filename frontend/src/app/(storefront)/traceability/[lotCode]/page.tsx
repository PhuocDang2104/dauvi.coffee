import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ChevronRight, MapPin } from "lucide-react";
import { getRepositories } from "@/lib/data-source";
import { OriginMap } from "@/features/traceability/components/origin-map";
import { ProcessTimeline } from "@/features/traceability/components/process-timeline";
import { EvidencePill, TransparencyTable } from "@/features/traceability/components/transparency-table";
import { QuickAddButton } from "@/features/products/components/quick-add-button";
import { ProductPack } from "@/features/products/components/product-pack";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";

interface LotPageProps { params: Promise<{ lotCode: string }> }

export async function generateMetadata({ params }: LotPageProps): Promise<Metadata> {
  const { lotCode } = await params;
  const normalized = decodeURIComponent(lotCode).toUpperCase();
  const lot = await getRepositories().traceability.getByLotCode(normalized);
  if (!lot) return { title: "Không tìm thấy mã lô" };
  return { title: `Lô ${lot.lotCode}`, description: `Hồ sơ truy xuất demo cho lô ${lot.lotCode} tại ${lot.district}, ${lot.province}.`, alternates: { canonical: `/traceability/${lot.lotCode}` } };
}

export default async function LotDetailPage({ params }: LotPageProps) {
  const { lotCode } = await params;
  const normalized = decodeURIComponent(lotCode).toUpperCase().replace(/\s+/g, "");
  const repositories = getRepositories();
  const [lot, products] = await Promise.all([repositories.traceability.getByLotCode(normalized), repositories.products.list()]);
  if (!lot) notFound();
  const product = products.find((item) => item.id === lot.productId);
  if (!product) notFound();

  const fields = [
    ["Vùng", `${lot.district}, ${lot.province}`],
    ["Nông hộ", lot.farmName],
    ["Đơn vị", lot.cooperativeName ?? "Chưa khai báo"],
    ["Niên vụ", lot.harvestYear.toString()],
    ["Giống", lot.variety],
    ["Độ cao", lot.altitudeLabel],
    ["Sơ chế", lot.process],
    ["Ngày rang", lot.roastDate],
    ["Ngày đóng gói", lot.packagingDate],
  ];
  const breadcrumbs = [
    { name: "Trang chủ", href: "/" },
    { name: "Truy xuất", href: "/traceability" },
    { name: lot.lotCode, href: `/traceability/${lot.lotCode}` },
  ];

  return (
    <main id="main-content">
      <BreadcrumbJsonLd items={breadcrumbs} />
      <div className="shell py-5"><nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs font-semibold text-ink-500"><Link href="/">Trang chủ</Link><ChevronRight aria-hidden="true" size={13} /><Link href="/traceability">Truy xuất</Link><ChevronRight aria-hidden="true" size={13} /><span aria-current="page" className="lot-code text-ink-950">{lot.lotCode}</span></nav></div>

      <header className="border-y border-basalt-900/10 bg-paper-100 py-12 md:py-16">
        <div className="shell grid gap-10 lg:grid-cols-[1.25fr_.75fr] lg:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-3"><EvidencePill level={lot.evidenceLevel} /><span className="rounded-full border border-success-600/20 bg-success-600/10 px-3 py-1 text-xs font-bold text-success-600">{lot.status === "available" ? "Đang có hàng" : lot.status === "sold-out" ? "Đã bán hết" : "Lưu trữ"}</span></div>
            <p className="lot-code mt-6 text-sm font-bold uppercase tracking-[0.12em] text-clay-500">Coffee lot passport</p>
            <h1 className="mt-3 break-words font-display text-[clamp(2.55rem,6vw,5.2rem)] font-semibold leading-none tracking-[-0.055em]">{lot.lotCode}</h1>
            <p className="mt-5 text-xl font-bold text-forest-950">{product.displayName}</p>
            <p className="mt-6 max-w-2xl rounded-2xl border border-clay-500/25 bg-white/60 p-4 text-sm leading-6 text-roast-700"><strong>Demo Data:</strong> {lot.demoDisclosure}</p>
          </div>
          <div className="flex justify-center"><ProductPack product={product} className="w-full max-w-[28rem]" priority /></div>
        </div>
      </header>

      <section className="section-space shell">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_.9fr]">
          <div>
            <p className="eyebrow">Passport summary</p><h2 className="section-heading mt-4">Dấu mốc của lô</h2>
            <dl className="mt-8 grid overflow-hidden rounded-[1.5rem] border border-basalt-900/10 bg-white/65 sm:grid-cols-2">
              {fields.map(([label, value]) => <div key={label} className="border-b border-r border-basalt-900/10 p-5"><dt className="text-[0.65rem] font-bold uppercase tracking-[0.1em] text-ink-500">{label}</dt><dd className="mt-1.5 font-semibold text-ink-950 capitalize">{value}</dd></div>)}
            </dl>
          </div>
          <div>
            <div className="flex items-center gap-2"><MapPin aria-hidden="true" size={17} className="text-clay-500" /><p className="eyebrow">Origin map</p></div>
            <OriginMap highlightRegion={lot.regionId} className="mt-6 !grid-cols-1 [&_figcaption]:hidden" showLegend={false} />
            <p className="mt-4 rounded-2xl bg-paper-100 p-4 text-sm leading-6 text-ink-700">Điểm đánh dấu thể hiện vùng <strong>{lot.district}, {lot.province}</strong> trên bản đồ Việt Nam cách điệu; vị trí không đại diện tọa độ thửa đất.</p>
          </div>
        </div>
      </section>

      <section className="section-space border-y border-basalt-900/10 bg-paper-100"><div className="shell"><div className="max-w-3xl"><p className="eyebrow">Six-stage journey</p><h2 className="section-heading mt-4">Từ vùng trồng đến đóng gói</h2></div><div className="mt-10"><ProcessTimeline events={lot.timeline} /></div></div></section>

      <section className="section-space shell"><div className="max-w-3xl"><p className="eyebrow">Evidence register</p><h2 className="section-heading mt-4">Thuộc tính, nguồn và mức bằng chứng</h2></div><div className="mt-10"><TransparencyTable evidence={lot.evidence} /></div></section>

      <section className="border-t border-basalt-900/10 bg-forest-950 py-14 text-white"><div className="shell flex flex-col justify-between gap-8 md:flex-row md:items-center"><div><p className="eyebrow !text-honey-500">Từ passport về tách cà phê</p><h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.035em]">{product.displayName}</h2></div><div className="flex flex-wrap gap-3"><Link href={`/shop/${product.slug}`} className="button-primary !bg-white !text-forest-950">Xem sản phẩm <ArrowRight aria-hidden="true" size={17} /></Link><QuickAddButton product={product} className="button-secondary !border-white/30 !text-white" /></div></div></section>
      <div className="shell py-8"><Link href="/traceability" className="flex min-h-11 items-center gap-2 text-sm font-bold text-forest-950"><ArrowLeft aria-hidden="true" size={16} /> Quay lại tra cứu</Link></div>
    </main>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Database, FileCheck2, FileText, FlaskConical } from "lucide-react";
import { getRepositories } from "@/lib/data-source";
import { LotLookupForm } from "@/features/traceability/components/lot-lookup-form";
import { EvidencePill } from "@/features/traceability/components/transparency-table";

export const metadata: Metadata = {
  title: "Truy xuất mã lô",
  description: "Nhập mã trên gói DẤU VỊ để xem vùng nguyên liệu, sơ chế, rang, đóng gói và mức bằng chứng của dữ liệu.",
  alternates: { canonical: "/traceability" },
};

const evidenceLevels = [
  { level: "verified" as const, icon: FileCheck2, title: "Verified", copy: "Có tài liệu hoặc chứng nhận xác minh đi kèm hồ sơ." },
  { level: "supplier-declared" as const, icon: FileText, title: "Supplier Declared", copy: "Thông tin do đơn vị sản xuất hoặc nhà cung cấp công bố." },
  { level: "reference" as const, icon: Database, title: "Reference", copy: "Kiến thức tham khảo về giống; không đại diện cho toàn bộ lô." },
  { level: "demo" as const, icon: FlaskConical, title: "Demo", copy: "Dữ liệu mô phỏng để trình diễn cấu trúc truy xuất." },
];

export default async function TraceabilityPage() {
  const repositories = getRepositories();
  const [lots, products] = await Promise.all([
    repositories.traceability.listFeaturedLots(),
    repositories.products.list(),
  ]);
  const demoCodes = products.map((product) => product.featuredLotCode);

  return (
    <main id="main-content">
      <section className="topo-surface border-b border-basalt-900/10 bg-paper-100 py-16 md:py-24">
        <div className="shell grid gap-10 lg:grid-cols-[.85fr_1.15fr] lg:items-center">
          <div>
            <p className="eyebrow">Lot-level traceability</p>
            <h1 className="display-heading mt-5">Mỗi mã lô là một hành trình</h1>
          </div>
          <LotLookupForm demoCodes={demoCodes} />
        </div>
      </section>

      <section className="section-space shell">
        <div className="max-w-3xl"><p className="eyebrow">Evidence levels</p><h2 className="section-heading mt-4">Đọc dữ liệu cùng mức bằng chứng</h2></div>
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {evidenceLevels.map(({ level, icon: Icon, title, copy }) => (
            <article key={level} className="rounded-[1.35rem] border border-basalt-900/10 bg-white/70 p-5 shadow-[0_12px_40px_rgba(24,26,24,.06)] transition duration-300 hover:-translate-y-1 hover:shadow-soft">
              <div className="flex items-center justify-between gap-3"><span className="flex size-10 items-center justify-center rounded-full bg-paper-100 text-forest-800"><Icon aria-hidden="true" size={18} /></span><EvidencePill level={level} /></div>
              <h3 className="mt-5 font-display text-2xl font-semibold">{title}</h3><p className="mt-3 text-sm leading-6 text-ink-700">{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-space border-y border-basalt-900/10 bg-forest-950 text-white">
        <div className="shell">
          <div><p className="eyebrow !text-honey-500">Featured demo lots</p><h2 className="section-heading mt-4">Ba passport để khám phá</h2></div>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {lots.slice(0, 3).map((lot) => {
              const product = products.find((item) => item.id === lot.productId);
              return (
                <article key={lot.lotCode} className="topo-surface flex min-h-[23rem] flex-col rounded-[1.5rem] border border-white/15 bg-white/5 p-6 shadow-[0_24px_65px_rgba(0,0,0,.14)] transition duration-300 hover:-translate-y-1 hover:border-white/30">
                  <div className="flex items-start justify-between gap-3"><p className="text-xs font-bold uppercase tracking-[0.14em] text-sand-200">Coffee passport</p><EvidencePill level={lot.evidenceLevel} /></div>
                  <p className="lot-code mt-8 text-lg font-bold">{lot.lotCode}</p>
                  <h3 className="mt-2 font-display text-3xl font-semibold tracking-[-0.035em]">{product?.shortName ?? lot.variety}</h3>
                  <dl className="mt-7 space-y-3 border-t border-white/15 pt-5 text-sm"><div className="flex justify-between gap-3"><dt className="text-sand-200">Vùng</dt><dd className="font-bold">{lot.district}</dd></div><div className="flex justify-between gap-3"><dt className="text-sand-200">Sơ chế</dt><dd className="font-bold capitalize">{lot.process}</dd></div><div className="flex justify-between gap-3"><dt className="text-sand-200">Ngày rang</dt><dd className="lot-code text-xs font-bold">{lot.roastDate}</dd></div></dl>
                  <Link href={`/traceability/${lot.lotCode}`} className="mt-auto flex min-h-11 items-center justify-between border-t border-white/15 pt-5 text-sm font-bold">Mở hồ sơ lô <ArrowRight aria-hidden="true" size={17} /></Link>
                </article>
              );
            })}
          </div>
          <p className="mt-6 rounded-2xl border border-clay-500/30 bg-clay-500/10 p-4 text-sm text-sand-200">Tất cả hồ sơ đang dùng dữ liệu mô phỏng cho mục đích trình diễn đồ án; không đại diện cho hồ sơ trang trại đã được xác minh.</p>
        </div>
      </section>
    </main>
  );
}

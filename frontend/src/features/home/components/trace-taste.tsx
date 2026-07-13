import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/features/products/domain/product.types";
import type { CoffeeLot } from "@/features/traceability/domain/traceability.types";
import { ProcessTimeline } from "@/features/traceability/components/process-timeline";
import { EvidencePill } from "@/features/traceability/components/transparency-table";

export function TraceabilitySpotlight({ product, lot }: { product: Product; lot: CoffeeLot }) {
  return (
    <section className="section-space bg-paper-100">
      <div className="shell">
        <div className="grid gap-8 lg:grid-cols-[.7fr_1.3fr] lg:items-end">
          <div>
            <p className="eyebrow">Traceability spotlight</p>
            <h2 className="section-heading mt-4">Theo dấu từ vùng trồng đến ngày rang</h2>
          </div>
          <p className="max-w-xl text-lg leading-8 text-ink-700 lg:justify-self-end">
            Mã lô kết nối thông tin sản phẩm với từng chặng trong hành trình — và cho biết rõ mức bằng chứng của mỗi dữ liệu.
          </p>
        </div>

        <div className="topo-surface mt-12 overflow-hidden rounded-[2rem] border border-forest-950/15 bg-mist-50">
          <div className="grid lg:grid-cols-[.38fr_.62fr]">
            <div className="bg-forest-950 p-7 text-white md:p-10">
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-sand-200">Coffee passport</p>
                <EvidencePill level={lot.evidenceLevel} />
              </div>
              <p className="lot-code mt-9 text-xl font-bold leading-8">{lot.lotCode}</p>
              <p className="mt-2 font-display text-3xl font-semibold tracking-[-0.04em]">{product.shortName}</p>
              <dl className="mt-8 space-y-4 border-t border-white/15 pt-6 text-sm">
                <div className="flex justify-between gap-4"><dt className="text-sand-200">Vùng</dt><dd className="font-bold">{product.regionLabel}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-sand-200">Niên vụ</dt><dd className="font-bold">{lot.harvestYear}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-sand-200">Sơ chế</dt><dd className="font-bold capitalize">{lot.process}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-sand-200">Ngày rang</dt><dd className="lot-code text-xs font-bold">{lot.roastDate}</dd></div>
              </dl>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/traceability" className="button-primary !bg-mist-50 !text-forest-950">Tra cứu mã lô</Link>
                <Link href={`/traceability/${lot.lotCode}`} className="button-secondary !border-white/30 !text-white">Mở passport</Link>
              </div>
            </div>
            <div className="p-6 md:p-10">
              <ProcessTimeline events={lot.timeline} compact />
              <p className="mt-6 rounded-xl border border-clay-500/25 bg-clay-500/5 p-4 text-sm leading-6 text-roast-700">
                <strong>Demo Data:</strong> Dữ liệu lô đang được mô phỏng cho mục đích trình diễn đồ án.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function TasteSpectrum({ products }: { products: Product[] }) {
  return (
    <section className="section-space shell">
      <div className="max-w-3xl">
        <p className="eyebrow">Taste-first selection</p>
        <h2 className="section-heading mt-4">Bắt đầu từ khẩu vị của bạn</h2>
        <p className="mt-5 text-lg leading-8 text-ink-700">Không cần bắt đầu bằng tên giống. Hãy chọn vị trí gần với tách cà phê bạn muốn uống.</p>
      </div>
      <div className="mt-12 rounded-[1.7rem] border border-basalt-900/10 bg-white/65 p-6 md:p-10">
        <div className="flex justify-between gap-5 text-xs font-extrabold uppercase tracking-[0.1em] text-ink-700">
          <span>Đậm & nhiều caffeine</span>
          <span className="text-right">Thanh & giàu hương</span>
        </div>
        <div className="relative mt-9 grid grid-cols-6 gap-1 before:absolute before:left-[4%] before:right-[4%] before:top-3 before:h-0.5 before:bg-gradient-to-r before:from-roast-700 before:via-clay-500 before:to-honey-500">
          {products.map((product, index) => (
            <Link key={product.id} href={`/shop/${product.slug}`} className="group relative z-10 flex min-w-0 flex-col items-center text-center">
              <span className={`size-6 rounded-full border-4 border-mist-50 ${index < 3 ? "bg-roast-700" : index < 5 ? "bg-clay-500" : "bg-honey-500"} shadow-[0_0_0_1px_rgba(24,26,24,.15)]`} />
              <span className="mt-4 max-w-full truncate text-[0.63rem] font-extrabold text-forest-950 sm:text-xs">{product.shortName}</span>
              <span className="mt-1 hidden text-[0.65rem] text-ink-500 md:block">Body {product.flavor.body}/5</span>
            </Link>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/advisor" className="button-primary">Tìm cà phê phù hợp <ArrowRight aria-hidden="true" size={17} /></Link>
        </div>
      </div>
    </section>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Coffee, Droplets, Scale, SlidersHorizontal, Timer } from "lucide-react";
import { BREW_GUIDE_NOTE, BREW_METHODS } from "@/content/brew-methods";

export const metadata: Metadata = {
  title: "Hướng dẫn pha tại nhà",
  description: "Điểm bắt đầu cho Phin, Pour-over, AeroPress, Moka pot, French press và Cold brew cùng các dòng cà phê DẤU VỊ phù hợp.",
  alternates: { canonical: "/brew-guide" },
};

export default function BrewGuidePage() {
  return (
    <main id="main-content">
      <header className="topo-surface border-b border-basalt-900/10 bg-paper-100 py-16 md:py-24"><div className="shell grid gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-end"><div><p className="eyebrow">Brew at home</p><h1 className="display-heading mt-5">Pha đúng nhịp, không cần đúng một công thức.</h1></div><p className="max-w-xl text-lg leading-8 text-ink-700 lg:justify-self-end">Sáu điểm bắt đầu dễ áp dụng cho dụng cụ tại nhà. Hãy điều chỉnh từng bước để tìm ra tách cà phê của riêng bạn.</p></div></header>
      <section className="section-space shell">
        <p className="mb-10 rounded-2xl border border-honey-500/25 bg-honey-500/10 p-5 text-sm leading-6 text-roast-700"><strong>Lưu ý:</strong> {BREW_GUIDE_NOTE}</p>
        <div className="grid gap-5 lg:grid-cols-2">
          {BREW_METHODS.map((guide, index) => (
            <article id={guide.id} key={guide.id} className="topo-surface rounded-[1.6rem] border border-basalt-900/10 bg-white/65 p-6 md:p-8">
              <div className="flex items-center justify-between"><span className="flex size-12 items-center justify-center rounded-full bg-forest-950 text-white"><Coffee aria-hidden="true" size={21} /></span><span className="lot-code text-sm text-ink-500">0{index + 1}</span></div>
              <h2 className="mt-7 font-display text-4xl font-semibold tracking-[-0.045em]">{guide.name}</h2><p className="mt-2 text-ink-700">{guide.shortDescription}</p>
              <dl className="mt-7 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-paper-100 p-4"><dt className="flex items-center gap-2 text-xs font-bold text-ink-500"><Scale aria-hidden="true" size={14} /> Liều lượng</dt><dd className="mt-2 font-semibold">{guide.dose}</dd></div>
                <div className="rounded-xl bg-paper-100 p-4"><dt className="flex items-center gap-2 text-xs font-bold text-ink-500"><Droplets aria-hidden="true" size={14} /> Nước</dt><dd className="mt-2 font-semibold">{guide.water}</dd></div>
                <div className="rounded-xl bg-paper-100 p-4"><dt className="flex items-center gap-2 text-xs font-bold text-ink-500"><SlidersHorizontal aria-hidden="true" size={14} /> Kiểu xay</dt><dd className="mt-2 font-semibold">{guide.grind}</dd></div>
                <div className="rounded-xl bg-paper-100 p-4"><dt className="flex items-center gap-2 text-xs font-bold text-ink-500"><Timer aria-hidden="true" size={14} /> Thời gian</dt><dd className="mt-2 font-semibold">{guide.time}</dd></div>
              </dl>
              <div className="mt-6 border-t border-basalt-900/10 pt-5"><p className="text-xs font-bold uppercase tracking-[0.11em] text-ink-500">Cà phê gợi ý</p><p className="mt-2 font-display text-xl font-semibold text-forest-950">{guide.recommendations.join(" · ")}</p></div>
            </article>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center rounded-[1.5rem] bg-forest-950 p-8 text-center text-white md:p-12"><h2 className="card-heading text-3xl">Chưa biết nên bắt đầu với gói nào?</h2><p className="mt-3 max-w-xl text-sand-200">Chọn dụng cụ pha và khẩu vị trong Coffee Advisor để nhận ba gợi ý phù hợp.</p><Link href="/advisor" className="button-primary mt-7 !bg-white !text-forest-950">Mở Coffee Advisor <ArrowRight aria-hidden="true" size={17} /></Link></div>
      </section>
    </main>
  );
}

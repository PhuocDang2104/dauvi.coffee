import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
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
      <header className="border-b border-basalt-900/10 bg-paper-100 py-12 md:py-16">
        <div className="shell grid gap-10 md:grid-cols-2 md:items-center">
          <div><p className="eyebrow">Brew at home</p><h1 className="display-heading mt-5">Pha đúng nhịp, không cần đúng một công thức.</h1><p className="mt-5 max-w-md text-sm leading-7 text-ink-700">Từ một chiếc phin quen thuộc đến tách pour-over đầu tiên. Chọn dụng cụ của bạn và bắt đầu thật đơn giản.</p></div>
          <figure><div className="relative aspect-[4/3] overflow-hidden rounded-xl"><Image src="/images/brewing/phin.webp" alt="Minh họa phin Việt Nam trên ly cà phê sữa" fill priority sizes="(max-width: 767px) 100vw, 50vw" className="editorial-photo object-cover" /></div><figcaption className="mt-2 text-xs text-ink-500">Ảnh minh họa được tạo bằng AI.</figcaption></figure>
        </div>
      </header>
      <section className="section-space shell">
        <nav aria-label="Chọn dụng cụ pha" className="mb-8 flex flex-wrap gap-2">{BREW_METHODS.map((guide) => <a key={guide.id} href={`#${guide.id}`} className="button-secondary">{guide.name}</a>)}</nav>
        <p className="mb-10 rounded-2xl border border-honey-500/25 bg-honey-500/10 p-5 text-sm leading-6 text-roast-700"><strong>Lưu ý:</strong> {BREW_GUIDE_NOTE}</p>
        <div className="grid gap-5 lg:grid-cols-2">
          {BREW_METHODS.map((guide, index) => (
            <article id={guide.id} key={guide.id} className="rounded-xl border border-basalt-900/10 bg-white/70 p-6 md:p-8">
              <div className="flex items-center justify-between"><span className="flex size-12 items-center justify-center rounded-full bg-forest-950 text-white"><Coffee aria-hidden="true" size={21} /></span><span className="lot-code text-sm text-ink-500">0{index + 1}</span></div>
              <h2 className="mt-7 font-display text-4xl font-semibold tracking-[-0.045em]">{guide.name}</h2><p className="mt-2 text-ink-700">{guide.shortDescription}</p>
              <dl className="mt-7 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-paper-100 p-4"><dt className="flex items-center gap-2 text-xs font-bold text-ink-500"><Scale aria-hidden="true" size={14} /> Liều lượng</dt><dd className="mt-2 font-semibold">{guide.dose}</dd></div>
                <div className="rounded-xl bg-paper-100 p-4"><dt className="flex items-center gap-2 text-xs font-bold text-ink-500"><Droplets aria-hidden="true" size={14} /> Nước</dt><dd className="mt-2 font-semibold">{guide.water}</dd></div>
                <div className="rounded-xl bg-paper-100 p-4"><dt className="flex items-center gap-2 text-xs font-bold text-ink-500"><SlidersHorizontal aria-hidden="true" size={14} /> Kiểu xay</dt><dd className="mt-2 font-semibold">{guide.grind}</dd></div>
                <div className="rounded-xl bg-paper-100 p-4"><dt className="flex items-center gap-2 text-xs font-bold text-ink-500"><Timer aria-hidden="true" size={14} /> Thời gian</dt><dd className="mt-2 font-semibold">{guide.time}</dd></div>
              </dl>
              <Link href={guide.id === "drip-bag" ? "/shop?format=drip-bag" : `/shop?brew=${guide.id}`} className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-forest-950">Chọn cà phê cho {guide.name} <ArrowRight size={16} aria-hidden="true" /></Link>
              <div className="mt-6 border-t border-basalt-900/10 pt-5"><p className="text-xs font-bold uppercase tracking-[0.11em] text-ink-500">Cà phê gợi ý</p><p className="mt-2 font-display text-xl font-semibold text-forest-950">{guide.recommendations.join(" · ")}</p></div>
            </article>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center rounded-[1.5rem] bg-forest-950 p-8 text-center text-white shadow-[0_24px_70px_rgba(16,42,32,.22)] md:p-12"><h2 className="card-heading text-3xl">Chưa biết nên bắt đầu với gói nào?</h2><Link href="/advisor" className="button-primary mt-7 !bg-white !text-forest-950">Mở Coffee Advisor <ArrowRight aria-hidden="true" size={17} /></Link></div>
      </section>
    </main>
  );
}

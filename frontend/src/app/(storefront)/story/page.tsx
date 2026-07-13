import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CircleDotDashed, Mountain, ShieldCheck, Sprout } from "lucide-react";
import { getRepositories } from "@/lib/data-source";
import { STORY_CONTENT } from "@/content/story";
import { ProductPack } from "@/features/products/components/product-pack";

export const metadata: Metadata = {
  title: "Câu chuyện cao nguyên",
  description: "Từ đất bazan Tây Nguyên đến sườn núi Lâm Đồng: câu chuyện của sáu dòng cà phê Việt Nam trong bộ sưu tập DẤU VỊ.",
  alternates: { canonical: "/story" },
};

export default async function StoryPage() {
  const products = await getRepositories().products.list();
  return (
    <main id="main-content">
      <header className="topo-surface overflow-hidden border-b border-basalt-900/10 bg-paper-100 py-20 md:py-32">
        <div className="shell relative">
          <p className="eyebrow">{STORY_CONTENT.hero.eyebrow}</p>
          <h1 className="display-heading mt-6 max-w-5xl">{STORY_CONTENT.hero.title}</h1>
        </div>
      </header>

      <section className="section-space shell">
        <div className="grid gap-10 lg:grid-cols-[.42fr_.58fr]">
          <div className="lg:sticky lg:top-36 lg:self-start"><p className="eyebrow">From the Highlands of Vietnam</p><h2 className="section-heading mt-4">Một hành trình không chọn ra “loại tốt nhất”</h2></div>
          <div className="space-y-7 text-lg leading-9 text-ink-700">{STORY_CONTENT.longForm.map((paragraph, index) => <p key={index} className={index === 0 ? "first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-7xl first-letter:leading-[.8] first-letter:text-clay-500" : ""}>{paragraph}</p>)}</div>
        </div>
      </section>

      <section className="section-space border-y border-basalt-900/10 bg-forest-950 text-white">
        <div className="shell grid gap-5 lg:grid-cols-2">
          {STORY_CONTENT.highlands.map((highland, index) => (
            <article key={highland.id} className="topo-surface min-h-[27rem] rounded-[1.7rem] border border-white/15 bg-white/5 p-7 md:p-10">
              <span className="flex size-12 items-center justify-center rounded-full bg-honey-500 text-forest-950">{index === 0 ? <Sprout aria-hidden="true" size={22} /> : <Mountain aria-hidden="true" size={22} />}</span>
              <p className="mt-10 text-xs font-bold uppercase tracking-[0.17em] text-sand-200">{highland.eyebrow}</p>
              <h2 className="mt-3 font-display text-5xl font-semibold tracking-[-0.045em]">{highland.title}</h2>
              <p className="mt-4 text-sand-200">{highland.description}</p>
              <ul className="mt-8 flex flex-wrap gap-2">{highland.traits.map((trait) => <li key={trait} className="rounded-full border border-white/20 px-3 py-1.5 text-xs font-bold">{trait}</li>)}</ul>
            </article>
          ))}
        </div>
      </section>

      <section className="section-space shell">
        <div className="max-w-3xl"><p className="eyebrow">The traceable sequence</p><h2 className="section-heading mt-4">Sáu dấu mốc làm nên câu chuyện trong tách</h2></div>
        <ol className="relative mt-12 grid gap-3 md:grid-cols-3 xl:grid-cols-6">
          {STORY_CONTENT.journey.map((step, index) => <li key={step} className="relative rounded-2xl border border-basalt-900/10 bg-white/65 p-5"><CircleDotDashed aria-hidden="true" size={22} className="text-clay-500" /><p className="lot-code mt-5 text-xs text-ink-500">0{index + 1}</p><h3 className="mt-1 font-display text-xl font-semibold">{step}</h3></li>)}
        </ol>
      </section>

      <section className="section-space border-y border-basalt-900/10 bg-paper-100">
        <div className="shell"><div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><p className="eyebrow">Six product portraits</p><h2 className="section-heading mt-4">Sáu gương mặt của cà phê Việt</h2></div><Link href="/shop" className="button-secondary self-start md:self-auto">Khám phá bộ sưu tập <ArrowRight aria-hidden="true" size={17} /></Link></div>
          <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">{products.map((product) => <Link href={`/shop/${product.slug}`} key={product.id} className="group rounded-[1.2rem] border border-basalt-900/10 bg-mist-50 p-2 text-center shadow-[0_12px_35px_rgba(24,26,24,.06)] transition duration-300 hover:-translate-y-1 hover:shadow-soft"><ProductPack product={product} className="mx-auto w-full transition-transform duration-500 group-hover:scale-[1.03]" /><p className="px-2 pb-3 text-xs font-extrabold leading-5 text-forest-950">{product.shortName}</p></Link>)}</div>
        </div>
      </section>

      <section className="section-space shell"><div className="topo-surface grid gap-8 rounded-[1.8rem] bg-clay-500 p-8 text-white md:grid-cols-[auto_1fr_auto] md:items-center md:p-12"><span className="flex size-14 items-center justify-center rounded-full bg-forest-950"><ShieldCheck aria-hidden="true" size={25} /></span><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-paper-100">Transparency promise</p><h2 className="card-heading mt-3 text-3xl">{STORY_CONTENT.transparency.title}</h2><p className="mt-3 max-w-2xl text-paper-100">{STORY_CONTENT.transparency.description}</p></div><Link href="/traceability" className="button-primary !bg-mist-50 !text-forest-950">Tra cứu một lô</Link></div></section>
    </main>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, MapPin, PackageCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Product } from "@/features/products/domain/product.types";
import type { CoffeeLot } from "@/features/traceability/domain/traceability.types";
import { EvidencePill } from "@/features/traceability/components/transparency-table";

const AUTOPLAY_INTERVAL = 6_500;

const REGION_VISUALS: Record<string, { src: string; alt: string }> = {
  "gia-lai": {
    src: "/images/traceability/region-gia-lai.svg",
    alt: "Minh họa địa hình vùng cà phê Gia Lai",
  },
  "dak-lak": {
    src: "/images/traceability/region-dak-lak.svg",
    alt: "Minh họa địa hình vùng cà phê Đắk Lắk",
  },
  "bao-lam": {
    src: "/images/traceability/region-bao-lam.svg",
    alt: "Minh họa địa hình vùng cà phê Bảo Lâm",
  },
  "da-lat": {
    src: "/images/traceability/region-da-lat.svg",
    alt: "Minh họa địa hình vùng cà phê Đà Lạt",
  },
  langbiang: {
    src: "/images/traceability/region-langbiang.svg",
    alt: "Minh họa địa hình vùng cà phê Langbiang",
  },
};

interface TraceabilityCarouselProps {
  products: Product[];
  lots: CoffeeLot[];
}

export function TraceabilityCarousel({ products, lots }: TraceabilityCarouselProps) {
  const slides = useMemo(
    () => lots
      .map((lot) => ({ lot, product: products.find((product) => product.id === lot.productId) }))
      .filter((slide): slide is { lot: CoffeeLot; product: Product } => Boolean(slide.product)),
    [lots, products],
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || slides.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, AUTOPLAY_INTERVAL);
    return () => window.clearInterval(timer);
  }, [activeIndex, paused, slides.length]);

  if (slides.length === 0) return null;

  const activeSlide = slides[activeIndex] ?? slides[0];
  const { lot, product } = activeSlide;
  const visual = REGION_VISUALS[lot.regionId] ?? REGION_VISUALS["dak-lak"];

  function move(direction: -1 | 1) {
    setActiveIndex((current) => (current + direction + slides.length) % slides.length);
  }

  return (
    <section className="section-space overflow-hidden bg-paper-100">
      <div className="shell">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="eyebrow">Traceability spotlight</p>
            <h2 className="section-heading mt-4">Mỗi lô là một hành trình có thể mở ra</h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-ink-700">
              Theo dõi vùng trồng, sơ chế, rang và đóng gói qua từng coffee passport mô phỏng.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => move(-1)} className="grid size-11 place-items-center rounded-full border border-forest-950/15 bg-white text-forest-950 transition hover:-translate-x-0.5 hover:border-forest-950/35" aria-label="Xem lô trước">
              <ChevronLeft aria-hidden="true" size={18} />
            </button>
            <p className="lot-code min-w-16 text-center text-xs font-bold text-ink-500" aria-live="polite">{String(activeIndex + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}</p>
            <button type="button" onClick={() => move(1)} className="grid size-11 place-items-center rounded-full border border-forest-950/15 bg-white text-forest-950 transition hover:translate-x-0.5 hover:border-forest-950/35" aria-label="Xem lô tiếp theo">
              <ChevronRight aria-hidden="true" size={18} />
            </button>
          </div>
        </div>

        <div
          className="mt-9"
          role="region"
          aria-roledescription="carousel"
          aria-label="Các hồ sơ truy xuất nổi bật"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
          }}
        >
          <article key={lot.lotCode} className="trace-slide-in topo-surface overflow-hidden rounded-[2rem] border border-forest-950/15 bg-mist-50 shadow-[0_28px_80px_rgba(24,50,40,.14)]">
            <div className="grid min-h-[34rem] lg:grid-cols-[1.04fr_.96fr]">
              <div className="relative isolate min-h-[25rem] overflow-hidden bg-forest-950 text-white lg:min-h-full">
                <Image src={visual.src} alt={visual.alt} fill sizes="(max-width: 1023px) 100vw, 52vw" className="-z-20 object-cover" />
                <div className="absolute inset-0 -z-10 bg-[linear-gradient(110deg,rgba(8,31,25,.88),rgba(16,42,32,.3)_58%,rgba(16,42,32,.08))]" aria-hidden="true" />
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_72%_34%,rgba(199,150,72,.2),transparent_36%)]" aria-hidden="true" />

                <div className="flex h-full flex-col justify-between p-7 md:p-10">
                  <div className="flex items-center justify-between gap-4">
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-forest-950/45 px-3 py-2 text-[0.65rem] font-bold uppercase tracking-[0.12em] backdrop-blur-md"><MapPin aria-hidden="true" size={13} /> {product.regionLabel}</span>
                    <EvidencePill level={lot.evidenceLevel} />
                  </div>
                  <div className="grid items-end gap-6 sm:grid-cols-[1fr_12rem]">
                    <div>
                      <p className="lot-code text-xs font-bold uppercase tracking-[0.14em] text-honey-500">{lot.lotCode}</p>
                      <h3 className="mt-3 max-w-md font-display text-[clamp(2.4rem,4.5vw,4rem)] font-medium leading-[1.02] tracking-[-.04em]">{product.shortName}</h3>
                      <p className="mt-4 max-w-md text-sm leading-6 text-sand-200">{product.proposition}</p>
                    </div>
                    <div className="relative mx-auto hidden aspect-[4/5] w-full max-w-[12rem] drop-shadow-[0_26px_34px_rgba(0,0,0,.3)] sm:block">
                      <Image src={product.image.src} alt={product.image.alt} fill sizes="192px" className="object-contain" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col p-7 md:p-10">
                <div className="flex items-center gap-3 border-b border-basalt-900/10 pb-6">
                  <span className="grid size-11 place-items-center rounded-full bg-forest-950 text-honey-500"><PackageCheck aria-hidden="true" size={19} /></span>
                  <div>
                    <p className="text-[0.65rem] font-extrabold uppercase tracking-[0.14em] text-ink-500">Coffee passport</p>
                    <p className="mt-1 font-display text-2xl font-semibold text-forest-950">Hồ sơ lô {lot.harvestYear}</p>
                  </div>
                </div>

                <dl className="grid gap-x-7 gap-y-5 py-7 text-sm sm:grid-cols-2">
                  <div><dt className="text-xs text-ink-500">Đơn vị mô phỏng</dt><dd className="mt-1 font-bold text-ink-950">{lot.cooperativeName ?? lot.farmName}</dd></div>
                  <div><dt className="text-xs text-ink-500">Độ cao</dt><dd className="mt-1 font-bold text-ink-950">{lot.altitudeLabel}</dd></div>
                  <div><dt className="text-xs text-ink-500">Sơ chế</dt><dd className="mt-1 font-bold capitalize text-ink-950">{lot.process}</dd></div>
                  <div><dt className="text-xs text-ink-500">Ngày rang</dt><dd className="lot-code mt-1 text-xs font-bold text-ink-950">{lot.roastDate}</dd></div>
                </dl>

                <div className="mt-auto">
                  <ol className="grid grid-cols-6 gap-1" aria-label="Sáu bước truy xuất">
                    {lot.timeline.map((event, index) => (
                      <li key={event.id} className="min-w-0 text-center">
                        <span className="mx-auto grid size-7 place-items-center rounded-full bg-forest-950 text-[0.58rem] font-extrabold text-honey-500">{index + 1}</span>
                        <span className="mt-2 hidden truncate text-[0.58rem] font-bold text-ink-500 sm:block">{event.title}</span>
                      </li>
                    ))}
                  </ol>
                  <p className="mt-6 rounded-xl border border-clay-500/25 bg-clay-500/5 p-4 text-xs leading-5 text-roast-700"><strong>Demo Data:</strong> {lot.demoDisclosure}</p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link href={`/traceability/${lot.lotCode}`} className="button-primary">Mở passport</Link>
                    <Link href={`/shop/${product.slug}`} className="button-secondary">Xem sản phẩm</Link>
                  </div>
                </div>
              </div>
            </div>
          </article>

          <div className="mt-5 flex items-center gap-2" aria-label="Chọn hồ sơ lô">
            {slides.map((slide, index) => {
              const active = index === activeIndex;
              return (
                <button key={slide.lot.lotCode} type="button" onClick={() => setActiveIndex(index)} className={`relative h-2 overflow-hidden rounded-full transition-[width,background-color] duration-500 ${active ? "w-16 bg-forest-950/20" : "w-5 bg-forest-950/15 hover:bg-forest-950/30"}`} aria-label={`Xem lô ${slide.lot.lotCode}`} aria-current={active ? "true" : undefined}>
                  {active && !paused ? <span className="trace-carousel-progress absolute inset-y-0 left-0 bg-forest-950" style={{ animationDuration: `${AUTOPLAY_INTERVAL}ms` }} /> : null}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

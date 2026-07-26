"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Coffee, Leaf, MapPin, Mountain } from "lucide-react";
import { useState } from "react";

interface FlavorRegion {
  id: string;
  name: string;
  species: "Robusta" | "Arabica";
  altitude: string;
  position: { left: string; top: string };
  description: string;
  product: string;
  href: string;
  image: string;
  imageAlt: string;
}

const FLAVOR_REGIONS: FlavorRegion[] = [
  {
    id: "gia-lai",
    name: "Gia Lai",
    species: "Robusta",
    altitude: "600–800 m",
    position: { left: "55%", top: "55%" },
    description: "Body dày, chocolate đen và hạt rang — một cấu trúc vị sinh ra cho phin Việt.",
    product: "TRS1 Daily Phin",
    href: "/shop/trs1-tay-nguyen-daily-phin",
    image: "/images/products/trs1-daily-phin-pack.png",
    imageAlt: "Gói cà phê TRS1 Daily Phin từ Gia Lai",
  },
  {
    id: "dak-lak",
    name: "Đắk Lắk",
    species: "Robusta",
    altitude: "500–800 m",
    position: { left: "61%", top: "61%" },
    description: "Tâm điểm Robusta với phổ vị cacao, caramel và độ đậm rõ nét từ Natural đến Honey.",
    product: "TR4 Traceable Robusta",
    href: "/shop/tr4-dak-lak-traceable-robusta",
    image: "/images/products/tr4-dak-lak-pack.png",
    imageAlt: "Gói cà phê TR4 Traceable Robusta từ Đắk Lắk",
  },
  {
    id: "bao-lam",
    name: "Bảo Lâm",
    species: "Robusta",
    altitude: "800–1.000 m",
    position: { left: "53%", top: "69%" },
    description: "Độ cao và sơ chế Honey tạo nên một tách Robusta tròn, ngọt và giàu hương quả chín.",
    product: "Xanh Lùn TS5 Honey",
    href: "/shop/xanh-lun-ts5-bao-lam-honey",
    image: "/images/products/xanh-lun-ts5-pack.png",
    imageAlt: "Gói cà phê Xanh Lùn TS5 Honey từ Bảo Lâm",
  },
  {
    id: "da-lat",
    name: "Đà Lạt",
    species: "Arabica",
    altitude: "1.400–1.600 m",
    position: { left: "61%", top: "74%" },
    description: "Không khí mát và độ cao mở ra hương cam, caramel cùng hậu vị trà đen cân bằng.",
    product: "Catimor Đà Lạt Washed",
    href: "/shop/catimor-da-lat-washed",
    image: "/images/products/catimor-da-lat-pack.png",
    imageAlt: "Gói cà phê Catimor Washed từ Đà Lạt",
  },
  {
    id: "langbiang",
    name: "Langbiang",
    species: "Arabica",
    altitude: "1.500–1.700 m",
    position: { left: "67%", top: "68%" },
    description: "Vùng cao cho Bourbon thanh mượt, nổi bật mật ong, cam ngọt và hạnh nhân.",
    product: "Bourbon Langbiang Honey",
    href: "/shop/bourbon-langbiang-honey",
    image: "/images/products/bourbon-langbiang-pack.png",
    imageAlt: "Gói cà phê Bourbon Honey từ Langbiang",
  },
];

const MAP_VALUES = [
  { icon: Leaf, label: "Nguồn gốc", value: "Rõ ràng" },
  { icon: Mountain, label: "Độ cao", value: "Lý tưởng" },
  { icon: Coffee, label: "Hương vị", value: "Đa dạng" },
];

export function InteractiveFlavorMap() {
  const [activeId, setActiveId] = useState("dak-lak");
  const activeRegion = FLAVOR_REGIONS.find((region) => region.id === activeId) ?? FLAVOR_REGIONS[0];

  return (
    <section id="vietnam-flavor-map" className="scroll-mt-40 overflow-hidden border-y border-white/10 bg-forest-950 py-16 text-mist-50 md:py-20 lg:scroll-mt-28 lg:py-24">
      <div className="shell grid gap-10 lg:grid-cols-[.94fr_1.06fr] lg:items-center xl:gap-12">
        <div className="relative mx-auto w-full max-w-[31rem]">
          <div className="relative aspect-[2/3] overflow-hidden rounded-[1.65rem] border border-honey-500/20 bg-paper-100 shadow-[0_34px_90px_rgba(0,0,0,.3)]">
            <Image
              src="/images/home/dauvi-map.png"
              alt="Bản đồ địa hình Việt Nam với các vùng cà phê Gia Lai, Đắk Lắk, Bảo Lâm, Đà Lạt và Langbiang"
              fill
              sizes="(max-width: 1023px) 90vw, 42vw"
              className="object-cover"
            />

            {FLAVOR_REGIONS.map((region) => {
              const active = region.id === activeId;
              return (
                <button
                  key={region.id}
                  type="button"
                  aria-label={`${region.name}, ${region.species}, ${region.altitude}`}
                  aria-pressed={active}
                  onMouseEnter={() => setActiveId(region.id)}
                  onFocus={() => setActiveId(region.id)}
                  onClick={() => setActiveId(region.id)}
                  className="group absolute z-20 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-950 focus-visible:ring-offset-2 focus-visible:ring-offset-honey-500"
                  style={region.position}
                >
                  <span
                    className={`absolute size-7 rounded-full transition duration-300 motion-reduce:transition-none ${active ? "scale-110 bg-forest-950 shadow-[0_0_0_5px_rgba(199,150,72,.38)]" : "bg-honey-500 shadow-[0_5px_16px_rgba(90,55,41,.24)] group-hover:scale-110 group-hover:bg-forest-950"}`}
                  />
                  <MapPin className={`relative size-4 transition-colors ${active ? "text-honey-500" : "text-forest-950 group-hover:text-honey-500"}`} strokeWidth={2.4} aria-hidden="true" />
                  <span className="pointer-events-none absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded-full bg-forest-950 px-2 py-0.5 text-[0.55rem] font-extrabold text-white opacity-0 shadow-lg transition group-hover:opacity-100 group-focus:opacity-100">
                    {region.name}
                  </span>
                </button>
              );
            })}

            <article key={activeRegion.id} className="map-detail-in absolute inset-x-3 top-3 z-10 rounded-[1.15rem] border border-white/20 bg-forest-950/50 p-3.5 text-white shadow-[0_18px_45px_rgba(0,0,0,.22)] backdrop-blur-lg sm:left-5 sm:right-auto sm:top-5 sm:w-[calc(100%-2.5rem)] sm:p-4">
              <div className="flex items-start gap-3">
                <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-paper-100 shadow-inner sm:size-[4.5rem]">
                  <Image src={activeRegion.image} alt="" fill sizes="72px" className="object-contain mix-blend-multiply" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[0.6rem] font-extrabold uppercase tracking-[0.16em] text-honey-500">{activeRegion.species} · {activeRegion.altitude}</p>
                  <h3 className="mt-1 font-display text-xl font-semibold sm:text-2xl">{activeRegion.name}</h3>
                  <p className="mt-1 line-clamp-2 text-[0.68rem] leading-5 text-sand-200 sm:text-xs">{activeRegion.description}</p>
                </div>
              </div>
              <Link href={activeRegion.href} className="mt-2 inline-flex min-h-9 items-center gap-2 text-[0.68rem] font-bold text-white underline decoration-honey-500/45 underline-offset-4">
                {activeRegion.product} <ArrowUpRight aria-hidden="true" size={14} />
              </Link>
            </article>
          </div>
        </div>

        <div className="w-full max-w-[32rem] lg:justify-self-center">
          <p className="eyebrow !text-honey-500">Vietnam Flavor Map</p>
          <div className="mt-4 h-px w-12 bg-honey-500" aria-hidden="true" />
          <h2 className="mt-6 max-w-[32rem] font-display text-[clamp(2.65rem,4.4vw,4rem)] font-medium leading-[1.02] tracking-[-.04em] text-paper-100 text-balance">Một bản đồ, nhiều sắc thái cà phê</h2>
          <p className="mt-5 max-w-[32rem] text-sm leading-6 text-sand-200/80">
            Mỗi vùng đất, một độ cao, một khí hậu và một câu chuyện hương vị. Từ Robusta đậm sâu đến Arabica thanh sáng, từng điểm trên bản đồ mở ra một cách thưởng thức riêng. Chạm để khám phá vùng trồng, độ cao và dòng cà phê tiêu biểu.
          </p>

          <article key={`visual-${activeRegion.id}`} className="map-visual-in relative mt-7 aspect-[16/8.7] w-full max-w-[32rem] overflow-hidden rounded-[1.5rem] border border-honey-500/20 bg-paper-100 shadow-[0_26px_68px_rgba(0,0,0,.22)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_45%,rgba(199,150,72,.22),transparent_36%),linear-gradient(110deg,#f3eee4_0%,#eee4d4_100%)]" aria-hidden="true" />
            <Image
              src={activeRegion.image}
              alt={activeRegion.imageAlt}
              fill
              sizes="(max-width: 1023px) 90vw, 46vw"
              className="object-contain object-[78%_center] mix-blend-multiply"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-paper-100 via-paper-100/65 to-transparent" aria-hidden="true" />
            <div className="absolute inset-y-0 left-0 flex w-[48%] flex-col justify-center p-5 sm:p-7">
              <p className="text-[0.58rem] font-extrabold uppercase tracking-[0.15em] text-clay-500">{activeRegion.species} · {activeRegion.altitude}</p>
              <h3 className="mt-2 font-display text-3xl font-semibold text-forest-950 sm:text-4xl">{activeRegion.name}</h3>
              <p className="mt-2 text-xs font-bold leading-5 text-ink-700">{activeRegion.product}</p>
            </div>
          </article>

          <div className="mt-7 grid w-full max-w-[32rem] grid-cols-3 gap-2 border-t border-white/10 pt-6">
            {MAP_VALUES.map(({ icon: Icon, label, value }) => (
              <div key={label} className="text-center">
                <span className="mx-auto grid size-12 place-items-center rounded-full border border-honey-500/65 text-honey-500 shadow-[inset_0_0_24px_rgba(199,150,72,.08)] sm:size-14">
                  <Icon aria-hidden="true" size={20} strokeWidth={1.5} />
                </span>
                <p className="mt-3 text-[0.57rem] font-bold uppercase tracking-[0.13em] text-honey-500 sm:text-[0.65rem]">{label}<br /><span className="text-sand-200/75">{value}</span></p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

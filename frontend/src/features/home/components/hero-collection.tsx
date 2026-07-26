import Image from "next/image";
import Link from "next/link";
import {
  ArrowDownRight,
  ArrowRight,
  BadgeCheck,
  MapPinned,
  MessageCircleMore,
  SlidersHorizontal,
  type LucideIcon,
} from "lucide-react";

interface HomePathway {
  title: string;
  description: string;
  href: string;
  image: string;
  icon: LucideIcon;
  details: string[];
}

const HOME_PATHWAYS: HomePathway[] = [
  {
    title: "Chọn theo gu",
    description: "Trả lời 3 câu hỏi, khám phá hương vị dành riêng cho bạn.",
    href: "/shop",
    image: "/images/home/homecard-1.png",
    icon: SlidersHorizontal,
    details: ["Độ đậm", "Cách pha", "Ngân sách"],
  },
  {
    title: "Coffee Advisor",
    description: "Đội ngũ chuyên gia đồng hành chọn cà phê phù hợp với bạn.",
    href: "/advisor",
    image: "/images/home/homecard-2.png",
    icon: MessageCircleMore,
    details: ["6 bước ngắn", "Top 3 gợi ý"],
  },
  {
    title: "Vùng trồng",
    description: "Khám phá những vùng đất tạo nên hương vị đặc biệt.",
    href: "#vietnam-flavor-map",
    image: "/images/home/homecard-3.png",
    icon: MapPinned,
    details: ["5 vùng cao nguyên", "Bản đồ tương tác"],
  },
  {
    title: "Best sellers",
    description: "Những dòng cà phê được yêu thích nhất của DẤU VỊ.",
    href: "/shop?sort=featured",
    image: "/images/home/homecard-4.png",
    icon: BadgeCheck,
    details: ["Được chọn nhiều", "Thêm nhanh"],
  },
];

export function HomeHero() {
  return (
    <section className="relative isolate min-h-[calc(100svh-7rem)] overflow-hidden border-b border-basalt-900/10 bg-paper-100">
      <Image
        src="/images/home/dauvi-homebanner.png"
        alt="Bản đồ địa hình Việt Nam giữa hoa và quả cà phê"
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover object-[66%_center] sm:object-center"
      />
      <div
        className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(250,248,242,.97)_0%,rgba(250,248,242,.84)_35%,rgba(250,248,242,.22)_68%,rgba(250,248,242,.08)_100%)] md:bg-[linear-gradient(90deg,rgba(250,248,242,.96)_0%,rgba(250,248,242,.72)_34%,rgba(250,248,242,.08)_62%)]"
        aria-hidden="true"
      />

      <div className="shell flex min-h-[calc(100svh-7rem)] items-center py-16 lg:py-20">
        <div className="hero-copy-in relative z-10 max-w-[41rem]">
          <p className="eyebrow">Vietnam Traceable Coffee Collection</p>
          <h1 className="mt-6 max-w-[39rem] font-display text-[clamp(3rem,5.2vw,4.75rem)] font-medium leading-[.98] tracking-[-.045em] text-balance">Cà phê Việt Nam, được kể đến từng lô.</h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-ink-700 md:text-lg md:leading-8">
            Từ cao nguyên Việt Nam đến tách cà phê tại nhà — chọn theo vùng, vị và hành trình truy xuất.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/shop" className="button-primary shadow-[0_14px_35px_rgba(16,42,32,.2)]">
              Khám phá bộ sưu tập <ArrowRight aria-hidden="true" size={17} />
            </Link>
            <Link href="/advisor" className="button-secondary bg-mist-50/45 backdrop-blur-sm">
              Để Coffee Advisor chọn giúp
            </Link>
          </div>
        </div>
      </div>

      <a
        href="#collection-overview"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 items-center gap-2 rounded-full bg-mist-50/70 px-4 py-2 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-ink-700 shadow-soft backdrop-blur-md lg:flex"
      >
        Khám phá DẤU VỊ <ArrowDownRight aria-hidden="true" size={15} />
      </a>
    </section>
  );
}

export function CollectionOverview() {
  return (
    <section id="collection-overview" className="relative scroll-mt-40 overflow-hidden border-y border-white/10 bg-forest-950 py-16 lg:scroll-mt-28 lg:py-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_12%,rgba(105,157,163,.24),transparent_31%),radial-gradient(circle_at_86%_88%,rgba(199,150,72,.11),transparent_28%)]" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 bg-[url('/patterns/contour-lines.svg')] bg-cover bg-center opacity-[.075] mix-blend-screen" aria-hidden="true" />
      <div className="pointer-events-none absolute left-[8%] top-8 h-px w-[42%] bg-gradient-to-r from-transparent via-white/20 to-transparent" aria-hidden="true" />
      <div className="shell relative">
        <h2 className="sr-only">Khám phá DẤU VỊ theo nhu cầu của bạn</h2>
        <div className="home-pathways grid gap-4 sm:grid-cols-2 xl:flex xl:min-h-[18rem]">
          {HOME_PATHWAYS.map(({ title, description, href, image, icon: Icon, details }, index) => (
            <Link
              key={title}
              href={href}
              style={{ animationDelay: `${index * 5}s` }}
              className="home-pathway-card group relative isolate flex min-h-[16rem] overflow-hidden rounded-[1.45rem] border border-sky-950/10 p-6 shadow-[0_16px_42px_rgba(29,62,65,.12)] transition-[flex,transform,box-shadow,border-color] duration-500 ease-[cubic-bezier(.22,.8,.25,1)] hover:-translate-y-1.5 hover:border-forest-700/35 hover:shadow-[0_30px_70px_rgba(28,66,70,.2)] focus-visible:-translate-y-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-honey-500 focus-visible:ring-offset-2 xl:min-w-0 xl:flex-1 xl:basis-0 xl:hover:flex-[1.65] xl:focus-visible:flex-[1.65]"
            >
            <Image
              src={image}
              alt=""
              fill
              sizes="(max-width: 639px) 100vw, (max-width: 1279px) 50vw, 25vw"
              className="-z-20 object-cover transition duration-700 ease-out group-hover:scale-[1.06]"
            />
            <span
              className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(250,248,242,.96)_0%,rgba(250,248,242,.8)_45%,rgba(250,248,242,.08)_100%)] transition duration-500 group-hover:bg-[linear-gradient(90deg,rgba(250,248,242,.98)_0%,rgba(250,248,242,.74)_48%,rgba(250,248,242,.04)_100%)]"
              aria-hidden="true"
            />

            <div className="flex w-[74%] flex-col items-start xl:w-[82%]">
              <span className="grid size-10 place-items-center rounded-full bg-forest-950 text-honey-500 shadow-[0_8px_22px_rgba(16,42,32,.2)] transition duration-500 group-hover:-rotate-6 group-hover:scale-105">
                <Icon aria-hidden="true" size={17} strokeWidth={1.8} />
              </span>
              <h3 className="mt-7 font-display text-[1.35rem] font-semibold tracking-[-0.025em] text-ink-950">{title}</h3>
              <p className="mt-2 max-w-[15rem] text-xs leading-5 text-ink-700">{description}</p>
              <div style={{ animationDelay: `${index * 5}s` }} className="home-pathway-details mt-3 flex max-h-16 flex-wrap gap-1.5 overflow-hidden opacity-100 transition-all duration-500 xl:max-h-0 xl:translate-y-2 xl:opacity-0 xl:group-hover:max-h-16 xl:group-hover:translate-y-0 xl:group-hover:opacity-100 xl:group-focus-visible:max-h-16 xl:group-focus-visible:translate-y-0 xl:group-focus-visible:opacity-100">
                {details.map((detail) => (
                  <span key={detail} className="rounded-full border border-forest-950/12 bg-mist-50/70 px-2.5 py-1 text-[0.6rem] font-bold text-forest-950 backdrop-blur-sm">{detail}</span>
                ))}
              </div>
            </div>

            <span className="absolute bottom-4 right-4 grid size-10 place-items-center rounded-full bg-mist-50 text-forest-950 shadow-[0_8px_24px_rgba(24,26,24,.14)] transition duration-300 group-hover:translate-x-1 group-hover:bg-forest-950 group-hover:text-white">
              <ArrowRight aria-hidden="true" size={16} />
            </span>
            <span className="lot-code absolute right-4 top-4 text-[0.58rem] font-bold text-ink-500/65">0{index + 1}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

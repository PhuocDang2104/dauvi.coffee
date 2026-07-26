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
}

const HOME_PATHWAYS: HomePathway[] = [
  {
    title: "Chọn theo gu",
    description: "Trả lời 3 câu hỏi, khám phá hương vị dành riêng cho bạn.",
    href: "/shop",
    image: "/images/home/homecard-1.png",
    icon: SlidersHorizontal,
  },
  {
    title: "Coffee Advisor",
    description: "Đội ngũ chuyên gia đồng hành chọn cà phê phù hợp với bạn.",
    href: "/advisor",
    image: "/images/home/homecard-2.png",
    icon: MessageCircleMore,
  },
  {
    title: "Vùng trồng",
    description: "Khám phá những vùng đất tạo nên hương vị đặc biệt.",
    href: "#vietnam-flavor-map",
    image: "/images/home/homecard-3.png",
    icon: MapPinned,
  },
  {
    title: "Best sellers",
    description: "Những dòng cà phê được yêu thích nhất của DẤU VỊ.",
    href: "/shop?sort=featured",
    image: "/images/home/homecard-4.png",
    icon: BadgeCheck,
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

      <div className="wide-shell flex min-h-[calc(100svh-7rem)] items-center py-16 lg:py-20">
        <div className="hero-copy-in relative z-10 max-w-[46rem]">
          <p className="eyebrow">Vietnam Traceable Coffee Collection</p>
          <h1 className="display-heading mt-6 max-w-[42rem]">Cà phê Việt Nam, được kể đến từng lô.</h1>
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
    <section id="collection-overview" className="wide-shell py-8 md:py-12">
      <h2 className="sr-only">Khám phá DẤU VỊ theo nhu cầu của bạn</h2>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {HOME_PATHWAYS.map(({ title, description, href, image, icon: Icon }, index) => (
          <Link
            key={title}
            href={href}
            className="group relative isolate flex min-h-[12.5rem] overflow-hidden rounded-[1.35rem] border border-basalt-900/10 p-5 shadow-[0_12px_34px_rgba(24,26,24,.09)] transition duration-500 hover:-translate-y-1.5 hover:border-honey-500/35 hover:shadow-[0_24px_55px_rgba(24,26,24,.16)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-honey-500 focus-visible:ring-offset-2"
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

            <div className="flex w-[68%] flex-col items-start">
              <span className="grid size-10 place-items-center rounded-full bg-forest-950 text-honey-500 shadow-[0_8px_22px_rgba(16,42,32,.2)] transition duration-500 group-hover:-rotate-6 group-hover:scale-105">
                <Icon aria-hidden="true" size={17} strokeWidth={1.8} />
              </span>
              <h3 className="mt-5 font-display text-xl font-semibold tracking-[-0.025em] text-ink-950">{title}</h3>
              <p className="mt-1.5 text-xs leading-5 text-ink-700">{description}</p>
            </div>

            <span className="absolute bottom-4 right-4 grid size-10 place-items-center rounded-full bg-mist-50 text-forest-950 shadow-[0_8px_24px_rgba(24,26,24,.14)] transition duration-300 group-hover:translate-x-1 group-hover:bg-forest-950 group-hover:text-white">
              <ArrowRight aria-hidden="true" size={16} />
            </span>
            <span className="lot-code absolute right-4 top-4 text-[0.58rem] font-bold text-ink-500/65">0{index + 1}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

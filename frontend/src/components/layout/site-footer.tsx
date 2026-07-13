import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";

import { BrandLogo } from "@/components/brand/brand-logo";
import { BRAND_CONFIG } from "@/config/brand";
import { FOOTER_NAVIGATION } from "@/config/navigation";
import { HOME_CONTENT } from "@/content/home";

import { NewsletterSignup } from "./newsletter-signup";

export function SiteFooter() {
  return (
    <footer className="pb-20 lg:pb-0">
      <section className="relative overflow-hidden border-y border-[var(--sand-200,#e5d8c5)] bg-[var(--paper-100,#f3eee4)]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-[url('/patterns/contour-lines.svg')] bg-cover bg-left opacity-25"
        />
        <div className="relative mx-auto grid w-full max-w-7xl gap-8 px-6 py-14 md:grid-cols-2 md:items-end md:px-10 lg:px-16 lg:py-20">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[var(--clay-500,#b86f45)]">
              {HOME_CONTENT.newsletter.eyebrow}
            </p>
            <h2 className="mt-3 max-w-lg font-display text-4xl leading-tight text-[var(--ink-950,#181a18)] md:text-5xl">
              {HOME_CONTENT.newsletter.title}
            </h2>
            <p className="mt-4 max-w-lg text-base leading-7 text-[var(--ink-700,#454944)]">
              {HOME_CONTENT.newsletter.description}
            </p>
          </div>
          <NewsletterSignup />
        </div>
      </section>

      <div className="bg-[var(--forest-950,#102a20)] text-white">
        <div className="mx-auto w-full max-w-7xl px-6 py-14 md:px-10 lg:px-16 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-[1.35fr_2fr]">
            <div>
              <BrandLogo tone="light" />
              <p className="mt-5 max-w-sm font-display text-2xl leading-8 text-white/95">
                {BRAND_CONFIG.vietnameseTagline}
              </p>
              <p className="mt-4 max-w-md text-sm leading-6 text-white/65">
                Cà phê Việt Nam đóng gói theo giống, vùng trồng, cách sơ chế và
                mã lô — dành cho pha tại nhà.
              </p>
              <Link
                href="/traceability"
                className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/25 px-4 text-sm font-bold transition hover:border-white/60 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <MapPin aria-hidden="true" className="size-4" />
                Tra cứu hành trình lô
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3">
              {FOOTER_NAVIGATION.map((group) => (
                <nav key={group.title} aria-label={group.title}>
                  <h2 className="text-xs font-extrabold uppercase tracking-[0.18em] text-white/45">
                    {group.title}
                  </h2>
                  <ul className="mt-4 space-y-1">
                    {group.items.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-white/78 transition hover:text-white focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                        >
                          {item.label}
                          <ArrowUpRight
                            aria-hidden="true"
                            className="size-3 opacity-45"
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              ))}
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-4 border-t border-white/15 pt-6 text-xs leading-5 text-white/50 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} {BRAND_CONFIG.name}. Frontend trình
              diễn.
            </p>
            <p className="max-w-xl sm:text-right">
              Dữ liệu lô và đơn vị sản xuất đang được mô phỏng cho mục đích
              trình diễn đồ án.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

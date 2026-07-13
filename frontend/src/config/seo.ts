import { BRAND_CONFIG } from "./brand";
import { absoluteUrl } from "./site";

export const SEO_CONFIG = {
  titleTemplate: `%s | ${BRAND_CONFIG.name} — ${BRAND_CONFIG.subtitle}`,
  defaultTitle: `${BRAND_CONFIG.name} — Vietnam Traceable Coffee`,
  description:
    "Khám phá cà phê Việt Nam theo giống, vùng trồng, cách sơ chế và mã lô — từ Tây Nguyên đến Langbiang.",
  keywords: [
    "cà phê Việt Nam",
    "cà phê truy xuất nguồn gốc",
    "Robusta Việt Nam",
    "Arabica Đà Lạt",
    "cà phê pha phin",
  ],
  openGraphImage: absoluteUrl("/brand/og-placeholder.svg"),
  locale: "vi_VN",
} as const;

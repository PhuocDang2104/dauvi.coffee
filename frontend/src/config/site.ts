import { BRAND_CONFIG } from "./brand";

const configuredSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "http://localhost:3000";

export const SITE_CONFIG = {
  url: configuredSiteUrl,
  name: `${BRAND_CONFIG.name} — ${BRAND_CONFIG.subtitle}`,
  locale: "vi-VN",
  currency: "VND",
  shippingThreshold: 499_000,
  announcement:
    "Miễn phí giao hàng nội thành cho đơn từ 499.000 ₫ · Dữ liệu truy xuất hiện ở chế độ demo",
  announcementSessionKey: "vtc-announcement-dismissed",
} as const;

export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//.test(path)) return path;

  return `${SITE_CONFIG.url}${path.startsWith("/") ? path : `/${path}`}`;
}

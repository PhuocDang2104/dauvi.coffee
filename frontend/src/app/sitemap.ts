import type { MetadataRoute } from "next";

const staticPaths = [
  "",
  "/shop",
  "/traceability",
  "/advisor",
  "/story",
  "/brew-guide",
  "/cart",
  "/checkout",
];

const productPaths = [
  "/shop/trs1-tay-nguyen-daily-phin",
  "/shop/tr4-dak-lak-traceable-robusta",
  "/shop/tr9-large-bean-fine-robusta",
  "/shop/xanh-lun-ts5-bao-lam-honey",
  "/shop/catimor-da-lat-washed",
  "/shop/bourbon-langbiang-honey",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return [...staticPaths, ...productPaths].map((path) => ({
    url: `${baseUrl}${path}`,
    changeFrequency: path.startsWith("/shop/") ? "weekly" : "monthly",
    priority: path === "" ? 1 : path.startsWith("/shop/") ? 0.8 : 0.7,
  }));
}

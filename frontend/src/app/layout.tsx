import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import { OrganizationJsonLd } from "@/components/seo/organization-json-ld";
import { StorefrontShell } from "@/components/layout/storefront-shell";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin", "vietnamese"],
  variable: "--font-fraunces",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin", "vietnamese"],
  variable: "--font-manrope",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "DẤU VỊ — Vietnam Traceable Coffee",
    template: "%s | DẤU VỊ — Vietnam Traceable Coffee",
  },
  description:
    "Khám phá cà phê Việt Nam theo giống, vùng trồng, cách sơ chế và mã lô — từ Tây Nguyên đến Langbiang.",
  applicationName: "DẤU VỊ",
  keywords: [
    "cà phê Việt Nam",
    "cà phê truy xuất",
    "Robusta",
    "Arabica",
    "DẤU VỊ",
  ],
  authors: [{ name: "DẤU VỊ" }],
  openGraph: {
    title: "DẤU VỊ — Vietnam Traceable Coffee",
    description:
      "Sáu dòng cà phê, hai hệ hương vị, một hành trình xuyên cao nguyên Việt Nam.",
    type: "website",
    locale: "vi_VN",
    siteName: "DẤU VỊ",
  },
  twitter: { card: "summary_large_image" },
  icons: {
    icon: "/brand/favicon.svg",
    shortcut: "/brand/favicon.svg",
    apple: "/brand/logo-mark.svg",
  },
  manifest: "/manifest.webmanifest",
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#faf8f2",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" className={`${fraunces.variable} ${manrope.variable}`}>
      <body>
        <a className="skip-link" href="#main-content">
          Chuyển đến nội dung chính
        </a>
        <OrganizationJsonLd />
        <StorefrontShell>{children}</StorefrontShell>
      </body>
    </html>
  );
}

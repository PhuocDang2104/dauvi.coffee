export interface NavigationItem {
  label: string;
  href: string;
  description?: string;
}

export const PRIMARY_NAVIGATION: NavigationItem[] = [
  { label: "Bộ sưu tập", href: "/shop" },
  { label: "Truy xuất", href: "/traceability" },
  { label: "Coffee Advisor", href: "/advisor" },
  { label: "Câu chuyện", href: "/story" },
  { label: "Cách pha", href: "/brew-guide" },
];

export const MOBILE_NAVIGATION: NavigationItem[] = [
  { label: "Trang chủ", href: "/" },
  { label: "Sản phẩm", href: "/shop" },
  { label: "Truy xuất", href: "/traceability" },
  { label: "Giỏ hàng", href: "/cart" },
];

export const FOOTER_NAVIGATION = [
  {
    title: "Khám phá",
    items: [
      { label: "Bộ sưu tập", href: "/shop" },
      { label: "Coffee Advisor", href: "/advisor" },
      { label: "Câu chuyện", href: "/story" },
      { label: "Cách pha tại nhà", href: "/brew-guide" },
    ],
  },
  {
    title: "Minh bạch",
    items: [
      { label: "Tra cứu mã lô", href: "/traceability" },
      { label: "Mức độ bằng chứng", href: "/traceability#evidence-levels" },
      { label: "Dữ liệu mô phỏng", href: "/story#transparency" },
    ],
  },
  {
    title: "Mua hàng",
    items: [
      { label: "Giỏ hàng", href: "/cart" },
      { label: "Thanh toán demo", href: "/checkout" },
      { label: "Thông tin giao hàng", href: "/cart#shipping" },
    ],
  },
] as const;

export const SEARCH_SUGGESTIONS = [
  { label: "Robusta", query: "robusta" },
  { label: "Arabica", query: "arabica" },
  { label: "Pha phin", query: "phin" },
  { label: "Sơ chế Honey", query: "honey" },
] as const;

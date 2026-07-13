export const BRAND_CONFIG = {
  name: "DẤU VỊ",
  subtitle: "Vietnam Traceable Coffee",
  collectionName: "Vietnam Traceable Coffee Collection",
  tagline: "From the Highlands of Vietnam",
  vietnameseTagline: "Từ cao nguyên Việt Nam đến tách cà phê của bạn.",
  campaignLine: "Six coffees. One Vietnamese journey.",
  coreStatement:
    "Cà phê Việt Nam được kể bằng giống, vùng trồng, phương pháp sơ chế, mức rang và mã lô.",
  demoDisclosure:
    "Dữ liệu lô và đơn vị sản xuất đang được mô phỏng cho mục đích trình diễn đồ án.",
} as const;

export type EvidenceLevel =
  "verified" | "supplier-declared" | "reference" | "demo";

export const EVIDENCE_LEVELS = {
  verified: {
    label: "Verified",
    shortLabel: "Đã xác minh",
    description: "Có tài liệu hoặc nguồn xác minh đi kèm hồ sơ.",
  },
  "supplier-declared": {
    label: "Supplier Declared",
    shortLabel: "Nhà cung cấp khai báo",
    description: "Thông tin do đơn vị sản xuất hoặc nhà cung cấp công bố.",
  },
  reference: {
    label: "Reference Data",
    shortLabel: "Dữ liệu tham khảo",
    description:
      "Kiến thức tham khảo về giống hoặc vùng, không đại diện cho toàn bộ lô.",
  },
  demo: {
    label: "Demo Data",
    shortLabel: "Dữ liệu mô phỏng",
    description: "Dữ liệu mô phỏng chỉ dùng để trình diễn cấu trúc sản phẩm.",
  },
} as const satisfies Record<
  EvidenceLevel,
  { label: string; shortLabel: string; description: string }
>;

export type BrandConfig = typeof BRAND_CONFIG;

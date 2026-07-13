import type { EvidenceLevel } from "@/config/brand";

export interface EvidenceExplainer {
  level: EvidenceLevel;
  title: string;
  description: string;
  example: string;
}

export const EVIDENCE_EXPLAINERS: EvidenceExplainer[] = [
  {
    level: "verified",
    title: "Verified",
    description: "Có tài liệu hoặc nguồn xác minh đi kèm.",
    example: "Chỉ dùng khi hồ sơ chứa bằng chứng có thể kiểm tra.",
  },
  {
    level: "supplier-declared",
    title: "Supplier Declared",
    description: "Thông tin do đơn vị sản xuất hoặc nhà cung cấp công bố.",
    example: "Nhãn này không đồng nghĩa với xác minh độc lập.",
  },
  {
    level: "reference",
    title: "Reference Data",
    description: "Kiến thức tham khảo về giống hoặc vùng.",
    example: "Không được chuyển thành claim môi trường cho toàn bộ lô.",
  },
  {
    level: "demo",
    title: "Demo Data",
    description: "Dữ liệu mô phỏng cho trải nghiệm frontend.",
    example: "Không đại diện cho một đơn vị sản xuất đã được xác minh.",
  },
];

export const HONEST_SUSTAINABILITY_CONTENT = {
  eyebrow: "HONEST SUSTAINABILITY",
  title: "Minh bạch trước khi gắn nhãn",
  description:
    "Mỗi thông tin cần nói rõ nó đến từ đâu và đã được kiểm chứng đến mức nào.",
  note: "Không sử dụng các claim “organic”, “water-saving” hoặc “carbon neutral” khi hồ sơ sản phẩm chưa có bằng chứng tương ứng.",
} as const;

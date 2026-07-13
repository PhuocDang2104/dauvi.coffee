import { coffeeLotSchema } from "@/features/traceability/domain/traceability.schema";
import type {
  CoffeeLot,
  EvidenceItem,
  TraceabilityEvent,
} from "@/features/traceability/domain/traceability.types";

export const DEMO_DATA_DISCLOSURE =
  "Dữ liệu lô và đơn vị sản xuất đang được mô phỏng cho mục đích trình diễn đồ án.";

interface DemoLotInput {
  lotCode: string;
  productId: string;
  farmName: string;
  cooperativeName?: string;
  province: string;
  district: string;
  regionId: string;
  altitudeLabel: string;
  variety: string;
  process: CoffeeLot["process"];
  roastDate: string;
  packagingDate: string;
  harvestLabel?: string;
  processingLabel?: string;
  greenBeanLabel?: string;
  referenceEvidence?: EvidenceItem[];
}

function createTimeline(input: DemoLotInput): TraceabilityEvent[] {
  const prefix = input.lotCode.toLowerCase();

  return [
    {
      id: `${prefix}-farm`,
      stage: "farm",
      title: "Vùng trồng",
      dateLabel: "Hồ sơ demo",
      description: `Bản ghi mô phỏng đặt lô tại ${input.district}, ${input.province}; chưa phải hồ sơ nông hộ đã xác minh.`,
    },
    {
      id: `${prefix}-harvest`,
      stage: "harvest",
      title: "Thu hoạch",
      dateLabel: input.harvestLabel ?? "Niên vụ 2025–2026",
      description: "Mốc thu hoạch được dựng để trình diễn cấu trúc dữ liệu theo lô.",
    },
    {
      id: `${prefix}-processing`,
      stage: "processing",
      title: "Sơ chế",
      dateLabel: input.processingLabel ?? "01/2026",
      description: `Phương pháp ${input.process} là dữ liệu mô phỏng của hồ sơ trình diễn.`,
    },
    {
      id: `${prefix}-green-bean`,
      stage: "green-bean",
      title: "Cà phê nhân",
      dateLabel: input.greenBeanLabel ?? "02/2026",
      description: "Bản ghi phân loại cà phê nhân đang ở cấp Demo Data, chưa có chứng từ nhà cung cấp.",
    },
    {
      id: `${prefix}-roasting`,
      stage: "roasting",
      title: "Rang",
      dateLabel: input.roastDate,
      description: "Ngày rang mô phỏng dùng để minh họa cách một mẻ rang được nối với mã lô.",
    },
    {
      id: `${prefix}-packaging`,
      stage: "packaging",
      title: "Đóng gói",
      dateLabel: input.packagingDate,
      description: "Ngày đóng gói mô phỏng hoàn tất hành trình truy xuất trên giao diện.",
    },
  ];
}

function demoEvidence(input: DemoLotInput): EvidenceItem[] {
  const sourceLabel = "Dữ liệu mô phỏng nội bộ của đồ án";

  return [
    {
      key: "production-unit",
      label: "Đơn vị sản xuất",
      value: input.cooperativeName ?? input.farmName,
      level: "demo",
      sourceLabel,
    },
    {
      key: "region",
      label: "Vùng nguyên liệu",
      value: `${input.district}, ${input.province}`,
      level: "demo",
      sourceLabel,
    },
    {
      key: "variety",
      label: "Giống",
      value: input.variety,
      level: "demo",
      sourceLabel,
    },
    {
      key: "harvest",
      label: "Niên vụ",
      value: input.harvestLabel ?? "2025–2026",
      level: "demo",
      sourceLabel,
    },
    {
      key: "process",
      label: "Sơ chế",
      value: input.process,
      level: "demo",
      sourceLabel,
    },
    {
      key: "roast-date",
      label: "Ngày rang",
      value: input.roastDate,
      level: "demo",
      sourceLabel,
    },
    {
      key: "packaging-date",
      label: "Ngày đóng gói",
      value: input.packagingDate,
      level: "demo",
      sourceLabel,
    },
    ...(input.referenceEvidence ?? []),
  ];
}

export function createDemoLot(input: DemoLotInput): CoffeeLot {
  return coffeeLotSchema.parse({
    lotCode: input.lotCode,
    productId: input.productId,
    status: "available",
    farmName: input.farmName,
    cooperativeName: input.cooperativeName,
    province: input.province,
    district: input.district,
    regionId: input.regionId,
    altitudeLabel: input.altitudeLabel,
    harvestYear: 2026,
    variety: input.variety,
    process: input.process,
    roastDate: input.roastDate,
    packagingDate: input.packagingDate,
    evidenceLevel: "demo",
    demoDisclosure: DEMO_DATA_DISCLOSURE,
    evidence: demoEvidence(input),
    timeline: createTimeline(input),
  });
}


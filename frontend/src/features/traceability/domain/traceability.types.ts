import type { EvidenceLevel, ProcessMethod } from "@/types/common";

export type { EvidenceLevel, ProcessMethod } from "@/types/common";

export const LOT_STATUS_VALUES = ["available", "sold-out", "archived"] as const;
export type LotStatus = (typeof LOT_STATUS_VALUES)[number];

export const TRACEABILITY_STAGE_VALUES = [
  "farm",
  "harvest",
  "processing",
  "green-bean",
  "roasting",
  "packaging",
] as const;
export type TraceabilityStage = (typeof TRACEABILITY_STAGE_VALUES)[number];

export interface EvidenceItem {
  key: string;
  label: string;
  value: string;
  level: EvidenceLevel;
  sourceLabel?: string;
  sourceReference?: string;
  verifiedAt?: string;
}

export interface TraceabilityEvent {
  id: string;
  stage: TraceabilityStage;
  title: string;
  dateLabel: string;
  description: string;
}

export interface CoffeeLot {
  lotCode: string;
  productId: string;
  status: LotStatus;
  farmName: string;
  cooperativeName?: string;
  province: string;
  district: string;
  regionId: string;
  altitudeLabel: string;
  harvestYear: number;
  variety: string;
  process: ProcessMethod;
  roastDate: string;
  packagingDate: string;
  evidenceLevel: EvidenceLevel;
  demoDisclosure: string;
  evidence: EvidenceItem[];
  timeline: TraceabilityEvent[];
}


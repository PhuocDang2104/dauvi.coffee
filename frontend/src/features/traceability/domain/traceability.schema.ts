import { z } from "zod";

import { EVIDENCE_LEVEL_VALUES, PROCESS_METHOD_VALUES } from "@/types/common";

import { LOT_STATUS_VALUES, TRACEABILITY_STAGE_VALUES } from "./traceability.types";

const isoDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Expected an ISO date (YYYY-MM-DD)");

export const evidenceItemSchema = z.object({
  key: z.string().min(1),
  label: z.string().min(1),
  value: z.string().min(1),
  level: z.enum(EVIDENCE_LEVEL_VALUES),
  sourceLabel: z.string().min(1).optional(),
  sourceReference: z.string().min(1).optional(),
  verifiedAt: isoDateSchema.optional(),
});

export const traceabilityEventSchema = z.object({
  id: z.string().min(1),
  stage: z.enum(TRACEABILITY_STAGE_VALUES),
  title: z.string().min(1),
  dateLabel: z.string().min(1),
  description: z.string().min(1),
});

export const coffeeLotSchema = z
  .object({
    lotCode: z.string().min(1),
    productId: z.string().min(1),
    status: z.enum(LOT_STATUS_VALUES),
    farmName: z.string().min(1),
    cooperativeName: z.string().min(1).optional(),
    province: z.string().min(1),
    district: z.string().min(1),
    regionId: z.string().min(1),
    altitudeLabel: z.string().min(1),
    harvestYear: z.number().int().min(2000),
    variety: z.string().min(1),
    process: z.enum(PROCESS_METHOD_VALUES),
    roastDate: isoDateSchema,
    packagingDate: isoDateSchema,
    evidenceLevel: z.enum(EVIDENCE_LEVEL_VALUES),
    demoDisclosure: z.string().min(1),
    evidence: z.array(evidenceItemSchema).min(1),
    timeline: z.array(traceabilityEventSchema).length(6),
  })
  .superRefine((lot, context) => {
    const uniqueStages = new Set(lot.timeline.map((event) => event.stage));
    if (uniqueStages.size !== TRACEABILITY_STAGE_VALUES.length) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "A lot timeline must contain each of the six traceability stages exactly once.",
        path: ["timeline"],
      });
    }

    if (lot.evidenceLevel === "demo" && !lot.demoDisclosure.includes("mô phỏng")) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Demo lots must carry an explicit simulation disclosure.",
        path: ["demoDisclosure"],
      });
    }
  });

export const coffeeLotArraySchema = z.array(coffeeLotSchema);

export const coffeeLotListResponseSchema = z.union([
  coffeeLotArraySchema,
  z.object({ data: coffeeLotArraySchema }),
]);


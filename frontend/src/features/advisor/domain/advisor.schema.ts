import { z } from "zod";

import { PRODUCT_FORMAT_VALUES } from "@/features/products/domain/product.types";
import { productSchema } from "@/features/products/domain/product.schema";
import { BREW_METHOD_VALUES } from "@/types/common";

import {
  ADVISOR_PRIORITY_VALUES,
  INTENSITY_PREFERENCE_VALUES,
  RECOMMENDATION_MATCH_TYPE_VALUES,
  TASTE_PREFERENCE_VALUES,
} from "./advisor.types";

export const advisorPreferencesSchema = z
  .object({
    intensity: z.enum(INTENSITY_PREFERENCE_VALUES),
    bitterness: z.enum(TASTE_PREFERENCE_VALUES),
    acidity: z.enum(TASTE_PREFERENCE_VALUES),
    caffeine: z.enum(["medium", "high"]),
    brewMethod: z.enum(BREW_METHOD_VALUES),
    format: z.enum(PRODUCT_FORMAT_VALUES),
    budgetMax: z.number().int().positive().optional(),
    priorities: z.array(z.enum(ADVISOR_PRIORITY_VALUES)).max(ADVISOR_PRIORITY_VALUES.length),
  })
  .superRefine((preferences, context) => {
    if (new Set(preferences.priorities).size !== preferences.priorities.length) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Advisor priorities must be unique.",
        path: ["priorities"],
      });
    }
  });

export const recommendationReasonSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  matchType: z.enum(RECOMMENDATION_MATCH_TYPE_VALUES),
});

export const productRecommendationSchema = z.object({
  product: productSchema,
  score: z.number().min(0).max(100),
  reasons: z.array(recommendationReasonSchema).min(1).max(4),
});

export const advisorResponseSchema = z.object({
  recommendations: z.array(
    z.object({
      productId: z.string().min(1),
      score: z.number().min(0).max(100),
      reasons: z.array(recommendationReasonSchema).max(4),
    }),
  ),
});


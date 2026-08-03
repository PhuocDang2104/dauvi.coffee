import { z } from "zod";

import {
  BREW_METHOD_VALUES,
  GRIND_TYPE_VALUES,
  PROCESS_METHOD_VALUES,
  PRODUCT_ROLE_VALUES,
  ROAST_LEVEL_VALUES,
  SPECIES_VALUES,
} from "@/types/common";

import { PRODUCT_FORMAT_VALUES } from "./product.types";

export const moneySchema = z.object({
  amount: z.number().int().nonnegative(),
  currency: z.literal("VND"),
});

export const productVariantSchema = z
  .object({
    id: z.string().min(1),
    sku: z.string().min(1),
    format: z.enum(PRODUCT_FORMAT_VALUES),
    // JSON APIs serialize non-applicable optional fields as null. Normalize
    // those values back to undefined so the domain model stays unchanged.
    weightGrams: z
      .union([z.literal(250), z.literal(500)])
      .nullish()
      .transform((value) => value ?? undefined),
    dripBagCount: z
      .union([z.literal(10), z.literal(20)])
      .nullish()
      .transform((value) => value ?? undefined),
    dripBagWeightGrams: z
      .literal(12)
      .nullish()
      .transform((value) => value ?? undefined),
    grindOptions: z.array(z.enum(GRIND_TYPE_VALUES)),
    price: moneySchema,
    compareAtPrice: moneySchema.nullish().transform((value) => value ?? undefined),
    inStock: z.boolean(),
  })
  .superRefine((variant, context) => {
    if (variant.format === "drip-bag") {
      if (!variant.dripBagCount || !variant.dripBagWeightGrams) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Drip bag variants require a bag count and bag weight.",
        });
      }

      return;
    }

    if (variant.grindOptions.length === 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Coffee pack variants require at least one grind option.",
      });
    }

    if (!variant.weightGrams) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Whole-bean and ground variants require a weight.",
      });
    }

    if (variant.format === "whole-bean" && !variant.grindOptions.includes("whole-bean")) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Whole-bean variants must expose the whole-bean grind option.",
      });
    }
  });

const flavorScoreSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
]);

export const flavorProfileSchema = z.object({
  bitterness: flavorScoreSchema,
  acidity: flavorScoreSchema,
  sweetness: flavorScoreSchema,
  body: flavorScoreSchema,
  aroma: flavorScoreSchema,
  notes: z.array(z.string().min(1)).min(3),
  caffeine: z.enum(["medium", "high"]),
});

export const productSchema = z.object({
  id: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  displayName: z.string().min(1),
  shortName: z.string().min(1),
  proposition: z.string().min(1),
  species: z.enum(SPECIES_VALUES),
  scientificName: z.string().min(1),
  variety: z.string().min(1),
  segment: z.string().min(1),
  role: z.enum(PRODUCT_ROLE_VALUES),
  regionId: z.string().min(1),
  regionLabel: z.string().min(1),
  altitudeLabel: z.string().min(1),
  process: z.enum(PROCESS_METHOD_VALUES),
  roastLevel: z.enum(ROAST_LEVEL_VALUES),
  flavor: flavorProfileSchema,
  brewMethods: z.array(z.enum(BREW_METHOD_VALUES)).min(1),
  story: z.string().min(1),
  varietyFacts: z.array(z.string().min(1)),
  badges: z.array(z.string().min(1)).max(3),
  accent: z.string().min(1),
  pattern: z.string().min(1),
  image: z.object({
    src: z.string().min(1),
    alt: z.string().min(1),
  }),
  variants: z.array(productVariantSchema).min(1),
  featuredLotCode: z.string().min(1),
  published: z.boolean(),
});

export const productArraySchema = z.array(productSchema);

export const productListResponseSchema = z.union([
  productArraySchema,
  z.object({ data: productArraySchema }),
]);

import { z } from "zod";

const grindTypeSchema = z.enum([
  "whole-bean",
  "phin",
  "espresso",
  "pour-over",
  "french-press",
  "moka-pot",
]);

const productFormatSchema = z.enum(["whole-bean", "ground", "drip-bag"]);

export const cartItemSchema = z.object({
  id: z.string().min(1),
  productId: z.string().min(1),
  productSlug: z.string().min(1),
  productName: z.string().min(1),
  productShortName: z.string().min(1),
  variantId: z.string().min(1),
  sku: z.string().min(1),
  format: productFormatSchema,
  weightGrams: z.union([z.literal(250), z.literal(500)]).optional(),
  dripBagCount: z.union([z.literal(10), z.literal(20)]).optional(),
  dripBagWeightGrams: z.literal(12).optional(),
  grind: grindTypeSchema.optional(),
  quantity: z.number().int().min(1).max(99),
  unitPrice: z.number().int().nonnegative(),
  currency: z.literal("VND"),
  image: z
    .object({
      src: z.string().min(1),
      alt: z.string().min(1),
    })
    .optional(),
  accent: z.string().optional(),
});

export const persistedCartStateSchema = z.object({
  items: z.array(cartItemSchema),
});


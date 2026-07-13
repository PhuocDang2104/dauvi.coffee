import { productSchema } from "@/features/products/domain/product.schema";
import type {
  GrindType,
  Product,
  ProductVariant,
} from "@/features/products/domain/product.types";

const ALL_GROUND_OPTIONS: GrindType[] = [
  "phin",
  "espresso",
  "pour-over",
  "french-press",
  "moka-pot",
];

interface StandardVariantInput {
  skuPrefix: string;
  price250: number;
  price500: number;
  groundOptions?: GrindType[];
  dripBagPrice?: number;
}

function money(amount: number) {
  return { amount, currency: "VND" as const };
}

export function createStandardVariants({
  skuPrefix,
  price250,
  price500,
  groundOptions = ALL_GROUND_OPTIONS,
  dripBagPrice,
}: StandardVariantInput): ProductVariant[] {
  const variants: ProductVariant[] = [
    {
      id: `${skuPrefix.toLowerCase()}-whole-250`,
      sku: `${skuPrefix}-WB-250`,
      format: "whole-bean",
      weightGrams: 250,
      grindOptions: ["whole-bean"],
      price: money(price250),
      inStock: true,
    },
    {
      id: `${skuPrefix.toLowerCase()}-whole-500`,
      sku: `${skuPrefix}-WB-500`,
      format: "whole-bean",
      weightGrams: 500,
      grindOptions: ["whole-bean"],
      price: money(price500),
      inStock: true,
    },
    {
      id: `${skuPrefix.toLowerCase()}-ground-250`,
      sku: `${skuPrefix}-GR-250`,
      format: "ground",
      weightGrams: 250,
      grindOptions: groundOptions,
      price: money(price250),
      inStock: true,
    },
    {
      id: `${skuPrefix.toLowerCase()}-ground-500`,
      sku: `${skuPrefix}-GR-500`,
      format: "ground",
      weightGrams: 500,
      grindOptions: groundOptions,
      price: money(price500),
      inStock: true,
    },
  ];

  if (dripBagPrice !== undefined) {
    variants.push({
      id: `${skuPrefix.toLowerCase()}-drip-10x12`,
      sku: `${skuPrefix}-DB-10X12`,
      format: "drip-bag",
      dripBagCount: 10,
      dripBagWeightGrams: 12,
      grindOptions: [],
      price: money(dripBagPrice),
      inStock: true,
    });
  }

  return variants;
}

export function createProduct(input: unknown): Product {
  return productSchema.parse(input);
}


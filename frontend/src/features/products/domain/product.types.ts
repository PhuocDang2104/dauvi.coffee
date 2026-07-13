import type {
  BrewMethod,
  GrindType,
  ProcessMethod,
  ProductRole,
  RoastLevel,
  Species,
} from "@/types/common";

export type {
  BrewMethod,
  GrindType,
  ProcessMethod,
  ProductRole,
  RoastLevel,
  Species,
} from "@/types/common";

export const PRODUCT_FORMAT_VALUES = ["whole-bean", "ground", "drip-bag"] as const;
export type ProductFormat = (typeof PRODUCT_FORMAT_VALUES)[number];

export interface Money {
  amount: number;
  currency: "VND";
}

export interface ProductVariant {
  id: string;
  sku: string;
  format: ProductFormat;
  weightGrams?: 250 | 500;
  dripBagCount?: 10 | 20;
  dripBagWeightGrams?: 12;
  grindOptions: GrindType[];
  price: Money;
  compareAtPrice?: Money;
  inStock: boolean;
}

export type FlavorScore = 1 | 2 | 3 | 4 | 5;

export interface FlavorProfile {
  bitterness: FlavorScore;
  acidity: FlavorScore;
  sweetness: FlavorScore;
  body: FlavorScore;
  aroma: FlavorScore;
  notes: string[];
  caffeine: "medium" | "high";
}

export interface Product {
  id: string;
  slug: string;
  displayName: string;
  shortName: string;
  proposition: string;
  species: Species;
  scientificName: string;
  variety: string;
  segment: string;
  role: ProductRole;
  regionId: string;
  regionLabel: string;
  altitudeLabel: string;
  process: ProcessMethod;
  roastLevel: RoastLevel;
  flavor: FlavorProfile;
  brewMethods: BrewMethod[];
  story: string;
  varietyFacts: string[];
  badges: string[];
  accent: string;
  pattern: string;
  image: {
    src: string;
    alt: string;
  };
  variants: ProductVariant[];
  featuredLotCode: string;
  published: boolean;
}

export const PRODUCT_SORT_VALUES = [
  "featured",
  "price-asc",
  "price-desc",
  "roast-asc",
  "robusta-first",
  "arabica-first",
] as const;
export type ProductSort = (typeof PRODUCT_SORT_VALUES)[number];

export const PRICE_BAND_VALUES = [
  "under-120000",
  "120000-160000",
  "over-160000",
] as const;
export type PriceBand = (typeof PRICE_BAND_VALUES)[number];

type FilterValue<T> = T | T[];

export interface ProductFilters {
  q?: string;
  species?: FilterValue<Species>;
  region?: FilterValue<string>;
  process?: FilterValue<ProcessMethod>;
  roast?: FilterValue<RoastLevel>;
  brew?: FilterValue<BrewMethod>;
  price?: FilterValue<PriceBand>;
  format?: FilterValue<ProductFormat>;
  minPrice?: number;
  maxPrice?: number;
  sort?: ProductSort;
}

export interface ProductVariantSelection {
  format?: ProductFormat;
  weightGrams?: 250 | 500;
  grind?: GrindType;
  dripBagCount?: 10 | 20;
}


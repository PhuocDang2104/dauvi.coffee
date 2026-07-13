import { normalizeSearch } from "@/features/search/domain/normalize-search";

import type {
  PriceBand,
  Product,
  ProductFilters,
  ProductFormat,
  ProductSort,
  ProductVariant,
  ProductVariantSelection,
} from "./product.types";

const ROAST_ORDER: Record<Product["roastLevel"], number> = {
  light: 0,
  "light-medium": 1,
  medium: 2,
  "medium-dark": 3,
  dark: 4,
};

function valuesOf<T>(value: T | T[] | undefined): T[] {
  if (value === undefined) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
}

function matchesAny<T>(actual: T, expected: T | T[] | undefined): boolean {
  const values = valuesOf(expected);
  return values.length === 0 || values.includes(actual);
}

function overlaps<T>(actual: T[], expected: T | T[] | undefined): boolean {
  const values = valuesOf(expected);
  return values.length === 0 || values.some((value) => actual.includes(value));
}

export function getStartingPrice(product: Product): number {
  const prices = product.variants
    .filter((variant) => variant.inStock)
    .map((variant) => variant.price.amount);

  return prices.length > 0 ? Math.min(...prices) : 0;
}

/** Price bands in the UI are explicitly based on the regular 250 g pack. */
export function getPriceBandAmount(product: Product): number {
  const regular250 = product.variants.find(
    (variant) =>
      variant.inStock && variant.weightGrams === 250 && variant.format !== "drip-bag",
  );

  return regular250?.price.amount ?? getStartingPrice(product);
}

export function getPriceBand(amount: number): PriceBand {
  if (amount < 120_000) {
    return "under-120000";
  }

  if (amount <= 160_000) {
    return "120000-160000";
  }

  return "over-160000";
}

export function getSearchableProductText(product: Product): string {
  return [
    product.displayName,
    product.shortName,
    product.proposition,
    product.species,
    product.scientificName,
    product.variety,
    product.segment,
    product.regionId,
    product.regionLabel,
    product.process,
    product.roastLevel,
    ...product.flavor.notes,
    ...product.brewMethods,
    ...product.badges,
  ].join(" ");
}

export function matchesProductSearch(product: Product, query: string): boolean {
  const normalizedQuery = normalizeSearch(query);
  return (
    normalizedQuery.length === 0 ||
    normalizeSearch(getSearchableProductText(product)).includes(normalizedQuery)
  );
}

export function filterProducts(products: Product[], filters: ProductFilters = {}): Product[] {
  const priceBands = valuesOf(filters.price);

  const filtered = products.filter((product) => {
    const filterPrice = getPriceBandAmount(product);
    const formats = product.variants
      .filter((variant) => variant.inStock)
      .map((variant) => variant.format);

    return (
      product.published &&
      matchesProductSearch(product, filters.q ?? "") &&
      matchesAny(product.species, filters.species) &&
      matchesAny(product.regionId, filters.region) &&
      matchesAny(product.process, filters.process) &&
      matchesAny(product.roastLevel, filters.roast) &&
      overlaps(product.brewMethods, filters.brew) &&
      overlaps(formats, filters.format) &&
      (priceBands.length === 0 || priceBands.includes(getPriceBand(filterPrice))) &&
      (filters.minPrice === undefined || filterPrice >= filters.minPrice) &&
      (filters.maxPrice === undefined || filterPrice <= filters.maxPrice)
    );
  });

  return sortProducts(filtered, filters.sort ?? "featured");
}

export function sortProducts(products: Product[], sort: ProductSort = "featured"): Product[] {
  const indexed = products.map((product, index) => ({ product, index }));

  indexed.sort((left, right) => {
    let comparison = 0;

    switch (sort) {
      case "price-asc":
        comparison = getStartingPrice(left.product) - getStartingPrice(right.product);
        break;
      case "price-desc":
        comparison = getStartingPrice(right.product) - getStartingPrice(left.product);
        break;
      case "roast-asc":
        comparison = ROAST_ORDER[left.product.roastLevel] - ROAST_ORDER[right.product.roastLevel];
        break;
      case "robusta-first":
        comparison = Number(right.product.species === "robusta") - Number(left.product.species === "robusta");
        break;
      case "arabica-first":
        comparison = Number(right.product.species === "arabica") - Number(left.product.species === "arabica");
        break;
      case "featured":
        comparison = 0;
        break;
    }

    return comparison || left.index - right.index;
  });

  return indexed.map(({ product }) => product);
}

export function getAvailableFormats(product: Product): ProductFormat[] {
  return [...new Set(
    product.variants.filter((variant) => variant.inStock).map((variant) => variant.format),
  )];
}

export function selectProductVariant(
  product: Product,
  selection: ProductVariantSelection,
): ProductVariant | null {
  return (
    product.variants.find((variant) => {
      if (!variant.inStock) return false;
      if (selection.format && variant.format !== selection.format) return false;
      if (selection.weightGrams && variant.weightGrams !== selection.weightGrams) return false;
      if (selection.dripBagCount && variant.dripBagCount !== selection.dripBagCount) return false;
      if (selection.grind && !variant.grindOptions.includes(selection.grind)) return false;
      return true;
    }) ?? null
  );
}

export function getDefaultVariant(product: Product): ProductVariant | null {
  const available = product.variants.filter((variant) => variant.inStock);

  if (product.role === "bestseller") {
    return (
      available.find(
        (variant) =>
          variant.format === "ground" &&
          variant.weightGrams === 250 &&
          variant.grindOptions.includes("phin"),
      ) ?? available[0] ?? null
    );
  }

  return (
    available.find(
      (variant) => variant.format === "whole-bean" && variant.weightGrams === 250,
    ) ??
    available.find((variant) => variant.weightGrams === 250) ??
    available[0] ??
    null
  );
}

export function getDefaultGrind(variant: ProductVariant): ProductVariant["grindOptions"][number] {
  if (variant.format === "whole-bean") {
    return "whole-bean";
  }

  return variant.grindOptions.includes("phin") ? "phin" : variant.grindOptions[0];
}


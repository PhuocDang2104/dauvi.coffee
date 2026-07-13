import type {
  BrewMethod,
  GrindType,
  ProcessMethod,
  RoastLevel,
  Species,
} from "@/types/common";
import type { ProductFormat, ProductVariant } from "@/features/products/domain/product.types";

const LABELS = {
  species: {
    robusta: "Robusta",
    arabica: "Arabica",
    blend: "Phối trộn",
  } satisfies Record<Species, string>,
  process: {
    natural: "Natural",
    washed: "Washed",
    honey: "Honey",
  } satisfies Record<ProcessMethod, string>,
  roast: {
    light: "Light",
    "light-medium": "Light–medium",
    medium: "Medium",
    "medium-dark": "Medium–dark",
    dark: "Dark",
  } satisfies Record<RoastLevel, string>,
  brew: {
    phin: "Phin",
    espresso: "Espresso",
    "pour-over": "Pour-over",
    aeropress: "AeroPress",
    "french-press": "French press",
    "moka-pot": "Moka pot",
    "cold-brew": "Cold brew",
    drip: "Drip",
  } satisfies Record<BrewMethod, string>,
  grind: {
    "whole-bean": "Nguyên hạt",
    phin: "Xay phin",
    espresso: "Xay espresso",
    "pour-over": "Xay pour-over",
    "french-press": "Xay French press",
    "moka-pot": "Xay moka pot",
  } satisfies Record<GrindType, string>,
  format: {
    "whole-bean": "Cà phê hạt",
    ground: "Cà phê xay",
    "drip-bag": "Drip bag",
  } satisfies Record<ProductFormat, string>,
} as const;

export function formatSpecies(value: Species): string {
  return LABELS.species[value];
}

export function formatProcess(value: ProcessMethod): string {
  return LABELS.process[value];
}

export function formatRoastLevel(value: RoastLevel): string {
  return LABELS.roast[value];
}

export function formatBrewMethod(value: BrewMethod): string {
  return LABELS.brew[value];
}

export function formatGrind(value: GrindType): string {
  return LABELS.grind[value];
}

export function formatProductFormat(value: ProductFormat): string {
  return LABELS.format[value];
}

export function formatVariantSize(variant: ProductVariant): string {
  if (variant.format === "drip-bag") {
    return `${variant.dripBagCount ?? 0} gói × ${variant.dripBagWeightGrams ?? 0} g`;
  }
  return `${variant.weightGrams ?? 0} g`;
}


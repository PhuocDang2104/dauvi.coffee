export const SPECIES_VALUES = ["robusta", "arabica", "blend"] as const;
export type Species = (typeof SPECIES_VALUES)[number];

export const PROCESS_METHOD_VALUES = ["natural", "washed", "honey"] as const;
export type ProcessMethod = (typeof PROCESS_METHOD_VALUES)[number];

export const ROAST_LEVEL_VALUES = [
  "light",
  "light-medium",
  "medium",
  "medium-dark",
  "dark",
] as const;
export type RoastLevel = (typeof ROAST_LEVEL_VALUES)[number];

export const BREW_METHOD_VALUES = [
  "phin",
  "espresso",
  "pour-over",
  "aeropress",
  "french-press",
  "moka-pot",
  "cold-brew",
  "drip",
] as const;
export type BrewMethod = (typeof BREW_METHOD_VALUES)[number];

export const GRIND_TYPE_VALUES = [
  "whole-bean",
  "phin",
  "espresso",
  "pour-over",
  "french-press",
  "moka-pot",
] as const;
export type GrindType = (typeof GRIND_TYPE_VALUES)[number];

export const EVIDENCE_LEVEL_VALUES = [
  "verified",
  "supplier-declared",
  "reference",
  "demo",
] as const;
export type EvidenceLevel = (typeof EVIDENCE_LEVEL_VALUES)[number];

export const PRODUCT_ROLE_VALUES = [
  "bestseller",
  "signature",
  "fine-robusta",
  "local-story",
  "gateway-arabica",
  "premium",
] as const;
export type ProductRole = (typeof PRODUCT_ROLE_VALUES)[number];

export interface CoffeeRegion {
  id: string;
  label: string;
  province: string;
  altitudeLabel: string;
  dominantSpecies: Species[];
  description: string;
  mapPosition: {
    x: number;
    y: number;
  };
}


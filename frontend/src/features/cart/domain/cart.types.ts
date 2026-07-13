import type { GrindType, ProductFormat } from "@/features/products/domain/product.types";

export interface CartItemImage {
  src: string;
  alt: string;
}

/**
 * Local-cart shape intentionally mirrors the fields a future order API needs.
 * Display fields are snapshotted so an existing cart remains readable if the
 * product catalog changes while it is persisted in the browser.
 */
export interface CartItem {
  id: string;
  productId: string;
  productSlug: string;
  productName: string;
  productShortName: string;
  variantId: string;
  sku: string;
  format: ProductFormat;
  weightGrams?: 250 | 500;
  dripBagCount?: 10 | 20;
  dripBagWeightGrams?: 12;
  grind?: GrindType;
  quantity: number;
  unitPrice: number;
  currency: "VND";
  image?: CartItemImage;
  accent?: string;
}

export type AddCartItemInput = Omit<CartItem, "id" | "quantity"> & {
  quantity?: number;
};

export interface PersistedCartState {
  items: CartItem[];
}


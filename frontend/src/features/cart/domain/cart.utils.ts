import type { AddCartItemInput, CartItem } from "./cart.types";

export const FREE_SHIPPING_THRESHOLD = 499_000;
export const STANDARD_SHIPPING_FEE = 30_000;

const VND_FORMATTER = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

export function formatVnd(amount: number): string {
  return VND_FORMATTER.format(amount).replace(/\u00a0/g, " ");
}

export function createCartItemId(item: AddCartItemInput): string {
  return [item.productId, item.variantId, item.grind ?? "no-grind"].join(":");
}

export function calculateCartSubtotal(items: readonly CartItem[]): number {
  return items.reduce(
    (subtotal, item) => subtotal + item.unitPrice * item.quantity,
    0,
  );
}

export function calculateCartQuantity(items: readonly CartItem[]): number {
  return items.reduce((quantity, item) => quantity + item.quantity, 0);
}

export function calculateShippingFee(subtotal: number): number {
  if (subtotal <= 0 || subtotal >= FREE_SHIPPING_THRESHOLD) {
    return 0;
  }

  return STANDARD_SHIPPING_FEE;
}

export function calculateFreeShippingProgress(subtotal: number): number {
  return Math.min(100, Math.max(0, (subtotal / FREE_SHIPPING_THRESHOLD) * 100));
}

export function describeCartItem(item: CartItem): string {
  const formatLabels: Record<CartItem["format"], string> = {
    "whole-bean": "Hạt rang",
    ground: "Cà phê xay",
    "drip-bag": "Drip bag",
  };
  const grindLabels: Partial<Record<NonNullable<CartItem["grind"]>, string>> = {
    "whole-bean": "Nguyên hạt",
    phin: "Xay cho phin",
    espresso: "Xay espresso",
    "pour-over": "Xay pour-over",
    "french-press": "Xay French press",
    "moka-pot": "Xay moka pot",
  };
  const size = item.weightGrams
    ? `${item.weightGrams} g`
    : item.dripBagCount && item.dripBagWeightGrams
      ? `${item.dripBagCount} gói × ${item.dripBagWeightGrams} g`
      : undefined;

  return [
    formatLabels[item.format],
    size,
    item.grind ? grindLabels[item.grind] : undefined,
  ]
    .filter(Boolean)
    .join(" · ");
}


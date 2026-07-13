import { describe, expect, it } from "vitest";

import type { CartItem } from "@/features/cart/domain/cart.types";
import { calculateCartSubtotal } from "@/features/cart/domain/cart.utils";

const baseItem: CartItem = {
  id: "trs1:trs1-ground-250:phin",
  productId: "trs1",
  productSlug: "trs1-tay-nguyen-daily-phin",
  productName: "TRS1 Tây Nguyên Daily Phin",
  productShortName: "TRS1 Daily Phin",
  variantId: "trs1-ground-250",
  sku: "TRS1-GR-250",
  format: "ground",
  weightGrams: 250,
  grind: "phin",
  quantity: 2,
  unitPrice: 99_000,
  currency: "VND",
};

describe("calculateCartSubtotal", () => {
  it("sums unit price multiplied by quantity", () => {
    const secondItem: CartItem = {
      ...baseItem,
      id: "cat:cat-drip-10x12:no-grind",
      productId: "catimor",
      variantId: "cat-drip-10x12",
      format: "drip-bag",
      weightGrams: undefined,
      grind: undefined,
      quantity: 1,
      unitPrice: 129_000,
    };

    expect(calculateCartSubtotal([baseItem, secondItem])).toBe(327_000);
  });

  it("returns zero for an empty cart", () => {
    expect(calculateCartSubtotal([])).toBe(0);
  });
});


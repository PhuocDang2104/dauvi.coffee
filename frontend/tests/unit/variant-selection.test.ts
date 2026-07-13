import { describe, expect, it } from "vitest";

import {
  getDefaultGrind,
  getDefaultVariant,
  selectProductVariant,
} from "@/features/products/domain/product.utils";
import { mockProducts } from "@/mocks/data/products";

function product(id: string) {
  const found = mockProducts.find((item) => item.id === id);
  if (!found) throw new Error(`Missing mock product ${id}`);
  return found;
}

describe("variant selection", () => {
  it("defaults Daily Phin to a 250 g ground pack and phin grind", () => {
    const variant = getDefaultVariant(product("trs1"));
    expect(variant).toMatchObject({ format: "ground", weightGrams: 250 });
    expect(variant && getDefaultGrind(variant)).toBe("phin");
  });

  it("defaults other products to a 250 g whole-bean pack", () => {
    const variant = getDefaultVariant(product("catimor"));
    expect(variant).toMatchObject({ format: "whole-bean", weightGrams: 250 });
    expect(variant && getDefaultGrind(variant)).toBe("whole-bean");
  });

  it("selects the Catimor drip bag and rejects unsupported combinations", () => {
    expect(
      selectProductVariant(product("catimor"), {
        format: "drip-bag",
        dripBagCount: 10,
      }),
    ).toMatchObject({ id: "cat-drip-10x12", price: { amount: 129_000 } });

    expect(selectProductVariant(product("trs1"), { format: "drip-bag" })).toBeNull();
  });
});


import { describe, expect, it } from "vitest";

import {
  filterProducts,
  getPriceBandAmount,
  sortProducts,
} from "@/features/products/domain/product.utils";
import { mockProducts } from "@/mocks/data/products";

describe("product filters", () => {
  it("combines species, process, region and brew method filters", () => {
    const result = filterProducts(mockProducts, {
      species: "robusta",
      process: "honey",
      region: "dak-lak",
      brew: "french-press",
    });

    expect(result.map((product) => product.id)).toEqual(["tr9"]);
  });

  it("searches Vietnamese text without accents or case sensitivity", () => {
    expect(
      filterProducts(mockProducts, { q: "DA LAT" }).map((product) => product.id),
    ).toEqual(["catimor"]);
    expect(
      filterProducts(mockProducts, { q: "xanh lun" }).map((product) => product.id),
    ).toEqual(["xanh-lun-ts5"]);
  });

  it("uses the regular 250 g price for the documented price bands", () => {
    const under120 = filterProducts(mockProducts, { price: "under-120000" });
    expect(under120.map((product) => product.id)).toEqual(["tr4", "trs1"]);

    const catimor = mockProducts.find((product) => product.id === "catimor");
    expect(catimor).toBeDefined();
    expect(getPriceBandAmount(catimor!)).toBe(139_000);
  });

  it("filters format availability so drip bag resolves only to Catimor", () => {
    expect(
      filterProducts(mockProducts, { format: "drip-bag" }).map((product) => product.id),
    ).toEqual(["catimor"]);
  });

  it("returns an empty list for incompatible filters", () => {
    expect(
      filterProducts(mockProducts, {
        species: "arabica",
        process: "natural",
      }),
    ).toEqual([]);
  });
});

describe("product sorting", () => {
  it("sorts by price and retains source order for ties", () => {
    const samePrice = mockProducts.filter((product) => ["catimor", "tr9"].includes(product.id));
    expect(sortProducts(samePrice, "price-asc").map((product) => product.id)).toEqual([
      "catimor",
      "tr9",
    ]);
  });

  it("places Arabica first without reordering products inside each group", () => {
    expect(sortProducts(mockProducts, "arabica-first").map((product) => product.id)).toEqual([
      "catimor",
      "bourbon",
      "tr4",
      "xanh-lun-ts5",
      "trs1",
      "tr9",
    ]);
  });
});


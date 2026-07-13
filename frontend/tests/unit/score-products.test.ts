import { describe, expect, it } from "vitest";

import type { AdvisorPreferences } from "@/features/advisor/domain/advisor.types";
import { scoreProducts } from "@/features/advisor/domain/score-products";
import { mockProducts } from "@/mocks/data/products";

const defaults: AdvisorPreferences = {
  intensity: "balanced",
  bitterness: "medium",
  acidity: "medium",
  brewMethod: "phin",
  caffeine: "medium",
  format: "whole-bean",
  priorities: ["traceability"],
};

describe("scoreProducts", () => {
  it("prioritizes TRS1 or TR4 for bold, high-caffeine phin drinkers", () => {
    const result = scoreProducts(mockProducts, {
      ...defaults,
      intensity: "bold",
      bitterness: "high",
      acidity: "low",
      caffeine: "high",
      brewMethod: "phin",
      priorities: ["everyday", "budget-friendly"],
    });

    expect(["trs1", "tr4"]).toContain(result[0]?.product.id);
    expect(result).toHaveLength(3);
    expect(result.every((item) => item.score >= 0 && item.score <= 100)).toBe(true);
    expect(result.every((item) => item.reasons.length >= 3 && item.reasons.length <= 4)).toBe(true);
  });

  it("places Catimor and Bourbon in the top two for balanced, low-bitterness pour-over", () => {
    const result = scoreProducts(mockProducts, {
      ...defaults,
      bitterness: "low",
      acidity: "high",
      brewMethod: "pour-over",
      caffeine: "medium",
      priorities: ["premium", "easy-to-brew"],
    });

    expect(result.slice(0, 2).map((item) => item.product.id).sort()).toEqual([
      "bourbon",
      "catimor",
    ]);
  });

  it("never recommends a 250 g product above a 120,000 VND budget", () => {
    const result = scoreProducts(mockProducts, {
      ...defaults,
      budgetMax: 120_000,
      priorities: ["budget-friendly"],
    });

    expect(result.map((item) => item.product.id).sort()).toEqual(["tr4", "trs1"]);
    expect(
      result.every((item) =>
        item.product.variants
          .filter((variant) => variant.inStock && variant.format === "whole-bean")
          .some((variant) => variant.price.amount <= 120_000),
      ),
    ).toBe(true);
  });

  it("returns only Catimor when drip bag is required", () => {
    const result = scoreProducts(mockProducts, {
      ...defaults,
      brewMethod: "drip",
      format: "drip-bag",
      priorities: ["quick-brew"],
    });

    expect(result).toHaveLength(1);
    expect(result[0]?.product.id).toBe("catimor");
  });

  it("uses stable input order when candidates tie", () => {
    const first = { ...mockProducts[0], id: "first", slug: "first" };
    const second = { ...mockProducts[0], id: "second", slug: "second" };
    const result = scoreProducts([first, second], {
      ...defaults,
      priorities: [],
    });

    expect(result.map((item) => item.product.id)).toEqual(["first", "second"]);
  });
});


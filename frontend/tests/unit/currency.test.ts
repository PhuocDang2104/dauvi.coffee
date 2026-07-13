import { describe, expect, it } from "vitest";

import { formatCurrency } from "@/lib/format/currency";

describe("formatCurrency", () => {
  it("formats integer VND without decimal places", () => {
    expect(formatCurrency(99_000)).toBe("99.000 ₫");
    expect(formatCurrency({ amount: 379_000, currency: "VND" })).toBe("379.000 ₫");
  });
});


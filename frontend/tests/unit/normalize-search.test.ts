import { describe, expect, it } from "vitest";

import { includesNormalized, normalizeSearch } from "@/features/search/domain/normalize-search";

describe("normalizeSearch", () => {
  it("normalizes Vietnamese diacritics, Đ, case, and whitespace", () => {
    expect(normalizeSearch("  ĐẮK   LẮK  ")).toBe("dak lak");
    expect(normalizeSearch("Cà phê Xanh Lùn")).toBe("ca phe xanh lun");
  });

  it("supports accent-insensitive containment", () => {
    expect(includesNormalized("Bourbon Langbiang mật ong", "MAT ONG")).toBe(true);
    expect(includesNormalized("Catimor Đà Lạt", "dak lak")).toBe(false);
  });
});


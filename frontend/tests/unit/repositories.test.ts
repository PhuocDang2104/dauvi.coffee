import { describe, expect, it } from "vitest";

import { MockProductRepository } from "@/features/products/repositories/mock-product.repository";
import { MockTraceabilityRepository } from "@/features/traceability/repositories/mock-traceability.repository";
import { createRepositories } from "@/lib/data-source/create-repositories";

describe("mock repositories", () => {
  it("serves all six schema-validated products through the repository contract", async () => {
    const repository = new MockProductRepository();
    await expect(repository.list()).resolves.toHaveLength(6);
    await expect(repository.getBySlug("catimor-da-lat-washed")).resolves.toMatchObject({
      id: "catimor",
      featuredLotCode: "CAT-DL-26-W01",
    });
    await expect(repository.getBySlug("missing")).resolves.toBeNull();
  });

  it("normalizes a TR4 lookup and returns its six-stage demo passport", async () => {
    const repository = new MockTraceabilityRepository();
    const lot = await repository.getByLotCode(" tr4-dlk-26-n02 ");

    expect(lot).toMatchObject({
      lotCode: "TR4-DLK-26-N02",
      productId: "tr4",
      evidenceLevel: "demo",
    });
    expect(lot?.demoDisclosure).toContain("được mô phỏng");
    expect(lot?.timeline.map((event) => event.stage)).toEqual([
      "farm",
      "harvest",
      "processing",
      "green-bean",
      "roasting",
      "packaging",
    ]);
  });

  it("selects concrete mock implementations without exposing mock data to pages", () => {
    const repositories = createRepositories("mock");
    expect(repositories.products).toBeInstanceOf(MockProductRepository);
    expect(repositories.traceability).toBeInstanceOf(MockTraceabilityRepository);
  });
});


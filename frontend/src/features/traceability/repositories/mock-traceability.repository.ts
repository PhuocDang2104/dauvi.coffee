import { coffeeLotArraySchema } from "../domain/traceability.schema";
import type { CoffeeLot } from "../domain/traceability.types";
import { normalizeLotCode } from "../domain/traceability.utils";
import { mockLots } from "@/mocks/data/lots";

import type { TraceabilityRepository } from "./traceability.repository";

export class MockTraceabilityRepository implements TraceabilityRepository {
  private readonly lots: CoffeeLot[];

  constructor(lots: CoffeeLot[] = mockLots) {
    this.lots = coffeeLotArraySchema.parse(lots);
  }

  async getByLotCode(lotCode: string): Promise<CoffeeLot | null> {
    const normalizedCode = normalizeLotCode(lotCode);
    return this.lots.find((lot) => lot.lotCode === normalizedCode) ?? null;
  }

  async listFeaturedLots(): Promise<CoffeeLot[]> {
    return this.lots.slice(0, 3);
  }
}


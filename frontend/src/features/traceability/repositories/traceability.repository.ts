import type { CoffeeLot } from "../domain/traceability.types";

export interface TraceabilityRepository {
  getByLotCode(lotCode: string): Promise<CoffeeLot | null>;
  listFeaturedLots(): Promise<CoffeeLot[]>;
}


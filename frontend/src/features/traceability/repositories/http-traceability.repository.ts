import { coffeeLotArraySchema, coffeeLotSchema } from "../domain/traceability.schema";
import type { CoffeeLot } from "../domain/traceability.types";
import { normalizeLotCode } from "../domain/traceability.utils";
import { ApiClient } from "@/lib/api/api-client";
import { isNotFoundApiError } from "@/lib/api/api-error";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

import type { TraceabilityRepository } from "./traceability.repository";

function unwrapData(input: unknown): unknown {
  if (typeof input === "object" && input !== null && "data" in input) {
    return input.data;
  }
  return input;
}

export class HttpTraceabilityRepository implements TraceabilityRepository {
  constructor(private readonly client = new ApiClient()) {}

  async getByLotCode(lotCode: string): Promise<CoffeeLot | null> {
    try {
      const normalizedCode = normalizeLotCode(lotCode);
      const payload = await this.client.get<unknown>(API_ENDPOINTS.lots.detail(normalizedCode));
      return coffeeLotSchema.parse(unwrapData(payload));
    } catch (error) {
      if (isNotFoundApiError(error)) return null;
      throw error;
    }
  }

  async listFeaturedLots(): Promise<CoffeeLot[]> {
    const payload = await this.client.get<unknown>(API_ENDPOINTS.lots.featured);
    return coffeeLotArraySchema.parse(unwrapData(payload));
  }
}


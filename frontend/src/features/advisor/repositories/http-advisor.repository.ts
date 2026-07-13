import { advisorPreferencesSchema, advisorResponseSchema } from "../domain/advisor.schema";
import type {
  AdvisorPreferences,
  ProductRecommendation,
} from "../domain/advisor.types";
import { HttpProductRepository } from "@/features/products/repositories/http-product.repository";
import type { ProductRepository } from "@/features/products/repositories/product.repository";
import { ApiClient } from "@/lib/api/api-client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

import type { AdvisorRepository } from "./advisor.repository";

export class HttpAdvisorRepository implements AdvisorRepository {
  constructor(
    private readonly client = new ApiClient(),
    private readonly products: ProductRepository = new HttpProductRepository(client),
  ) {}

  async recommend(preferences: AdvisorPreferences): Promise<ProductRecommendation[]> {
    const body = advisorPreferencesSchema.parse(preferences);
    const response = await this.client.post(API_ENDPOINTS.advisor.recommendations, {
      body,
      schema: advisorResponseSchema,
    });
    const products = await this.products.list();
    const productById = new Map(products.map((product) => [product.id, product]));

    return response.recommendations.flatMap((recommendation) => {
      const product = productById.get(recommendation.productId);
      return product ? [{ product, score: recommendation.score, reasons: recommendation.reasons }] : [];
    });
  }
}


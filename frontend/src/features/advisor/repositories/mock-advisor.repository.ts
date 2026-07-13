import { advisorPreferencesSchema } from "../domain/advisor.schema";
import type {
  AdvisorPreferences,
  ProductRecommendation,
} from "../domain/advisor.types";
import { scoreProducts } from "../domain/score-products";
import { MockProductRepository } from "@/features/products/repositories/mock-product.repository";
import type { ProductRepository } from "@/features/products/repositories/product.repository";

import type { AdvisorRepository } from "./advisor.repository";

export class MockAdvisorRepository implements AdvisorRepository {
  constructor(private readonly products: ProductRepository = new MockProductRepository()) {}

  async recommend(preferences: AdvisorPreferences): Promise<ProductRecommendation[]> {
    const parsedPreferences = advisorPreferencesSchema.parse(preferences);
    const products = await this.products.list();
    return scoreProducts(products, parsedPreferences);
  }
}


import type {
  AdvisorPreferences,
  ProductRecommendation,
} from "../domain/advisor.types";

export interface AdvisorRepository {
  recommend(preferences: AdvisorPreferences): Promise<ProductRecommendation[]>;
}


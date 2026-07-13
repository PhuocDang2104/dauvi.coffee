import type { BrewMethod } from "@/types/common";
import type { Product, ProductFormat } from "@/features/products/domain/product.types";

export const INTENSITY_PREFERENCE_VALUES = ["light", "balanced", "bold"] as const;
export type IntensityPreference = (typeof INTENSITY_PREFERENCE_VALUES)[number];

export const TASTE_PREFERENCE_VALUES = ["low", "medium", "high"] as const;
export type TastePreference = (typeof TASTE_PREFERENCE_VALUES)[number];

export const ADVISOR_PRIORITY_VALUES = [
  "everyday",
  "traceability",
  "local-variety",
  "premium",
  "budget-friendly",
  "quick-brew",
  "easy-to-brew",
] as const;
export type AdvisorPriority = (typeof ADVISOR_PRIORITY_VALUES)[number];

export interface AdvisorPreferences {
  intensity: IntensityPreference;
  bitterness: TastePreference;
  acidity: TastePreference;
  caffeine: "medium" | "high";
  brewMethod: BrewMethod;
  format: ProductFormat;
  budgetMax?: number;
  priorities: AdvisorPriority[];
}

export const RECOMMENDATION_MATCH_TYPE_VALUES = [
  "taste",
  "brew",
  "budget",
  "origin",
] as const;
export type RecommendationMatchType =
  (typeof RECOMMENDATION_MATCH_TYPE_VALUES)[number];

export interface RecommendationReason {
  title: string;
  description: string;
  matchType: RecommendationMatchType;
}

export interface ProductRecommendation {
  product: Product;
  score: number;
  reasons: RecommendationReason[];
}

export interface AdvisorRecommendationDto {
  productId: string;
  score: number;
  reasons: RecommendationReason[];
}

export interface AdvisorResponse {
  recommendations: AdvisorRecommendationDto[];
}

export const ADVISOR_DISCLOSURE =
  "Kết quả hiện được tạo bằng bộ quy tắc từ dữ liệu sản phẩm. Backend AI/RAG sẽ được tích hợp ở giai đoạn sau.";


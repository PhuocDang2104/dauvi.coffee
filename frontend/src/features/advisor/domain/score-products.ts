import type { Product, ProductVariant } from "@/features/products/domain/product.types";
import { getPriceBandAmount } from "@/features/products/domain/product.utils";

import type {
  AdvisorPreferences,
  AdvisorPriority,
  ProductRecommendation,
  RecommendationReason,
  TastePreference,
} from "./advisor.types";

export const ADVISOR_SCORE_WEIGHTS = {
  brewMethod: 25,
  intensity: 20,
  bitterness: 15,
  acidity: 15,
  caffeine: 10,
  format: 10,
  budget: 10,
  priority: 5,
  priorityMaximum: 10,
} as const;

const BREW_LABELS: Record<AdvisorPreferences["brewMethod"], string> = {
  phin: "phin",
  espresso: "espresso",
  "pour-over": "pour-over",
  aeropress: "AeroPress",
  "french-press": "French press",
  "moka-pot": "moka pot",
  "cold-brew": "cold brew",
  drip: "drip",
};

function matchesTasteScore(score: number, preference: TastePreference): boolean {
  if (preference === "low") return score <= 2;
  if (preference === "medium") return score === 3;
  return score >= 4;
}

function matchesIntensity(product: Product, preference: AdvisorPreferences["intensity"]): boolean {
  if (preference === "light") return product.flavor.body <= 3;
  if (preference === "balanced") return product.flavor.body >= 3 && product.flavor.body <= 4;
  return product.flavor.body >= 4;
}

function availableVariants(product: Product, preferences: AdvisorPreferences): ProductVariant[] {
  return product.variants.filter(
    (variant) => variant.inStock && variant.format === preferences.format,
  );
}

function minimumVariantPrice(variants: ProductVariant[]): number {
  return Math.min(...variants.map((variant) => variant.price.amount));
}

function priorityMatches(product: Product, priority: AdvisorPriority): boolean {
  switch (priority) {
    case "traceability":
      return product.featuredLotCode.length > 0;
    case "local-variety":
      return product.role === "local-story";
    case "premium":
      return product.role === "premium" || product.role === "fine-robusta";
    case "easy-to-brew":
      return (
        product.role === "bestseller" ||
        product.role === "gateway-arabica" ||
        product.variants.some((variant) => variant.inStock && variant.format === "drip-bag")
      );
    case "everyday":
      return ["bestseller", "signature", "gateway-arabica"].includes(product.role);
    case "budget-friendly":
      return getPriceBandAmount(product) < 120_000;
    case "quick-brew":
      return product.variants.some(
        (variant) => variant.inStock && variant.format === "drip-bag",
      );
  }
}

function priorityReason(priority: AdvisorPriority): RecommendationReason {
  switch (priority) {
    case "traceability":
      return {
        title: "Có hồ sơ lô nổi bật",
        description: "Sản phẩm có mã lô demo để bạn khám phá cấu trúc truy xuất.",
        matchType: "origin",
      };
    case "local-variety":
      return {
        title: "Câu chuyện giống Việt",
        description: "Sản phẩm tập trung vào một giống địa phương trong bộ sưu tập.",
        matchType: "origin",
      };
    case "premium":
      return {
        title: "Trải nghiệm giàu hương",
        description: "Profile và vai trò sản phẩm phù hợp với ưu tiên trải nghiệm premium.",
        matchType: "taste",
      };
    case "easy-to-brew":
    case "everyday":
      return {
        title: "Dễ đưa vào nhịp pha hằng ngày",
        description: "Quy cách và profile được thiết kế để dễ chọn, dễ pha tại nhà.",
        matchType: "brew",
      };
    case "budget-friendly":
      return {
        title: "Mức giá dễ tiếp cận",
        description: "Gói 250 g nằm trong nhóm giá dưới 120.000 ₫.",
        matchType: "budget",
      };
    case "quick-brew":
      return {
        title: "Có lựa chọn pha nhanh",
        description: "Sản phẩm có quy cách drip bag tiện lợi trong catalog hiện tại.",
        matchType: "brew",
      };
  }
}

interface ScoredCandidate {
  recommendation: ProductRecommendation;
  index: number;
}

function scoreCandidate(
  product: Product,
  preferences: AdvisorPreferences,
  index: number,
): ScoredCandidate | null {
  const variants = availableVariants(product, preferences);
  if (variants.length === 0) {
    return null;
  }

  const lowestPrice = minimumVariantPrice(variants);
  if (preferences.budgetMax !== undefined && lowestPrice > preferences.budgetMax) {
    return null;
  }

  let rawScore = ADVISOR_SCORE_WEIGHTS.format;
  const reasons: RecommendationReason[] = [];

  if (product.brewMethods.includes(preferences.brewMethod)) {
    rawScore += ADVISOR_SCORE_WEIGHTS.brewMethod;
    reasons.push({
      title: `Hợp với ${BREW_LABELS[preferences.brewMethod]}`,
      description: `Profile rang và cấu trúc vị được đề xuất cho cách pha ${BREW_LABELS[preferences.brewMethod]}.`,
      matchType: "brew",
    });
  }

  if (matchesIntensity(product, preferences.intensity)) {
    rawScore += ADVISOR_SCORE_WEIGHTS.intensity;
    reasons.push({
      title: "Đúng độ đậm bạn chọn",
      description: `Body ${product.flavor.body}/5 khớp với mức ${preferences.intensity} trong bộ quy tắc.`,
      matchType: "taste",
    });
  }

  const bitternessMatch = matchesTasteScore(product.flavor.bitterness, preferences.bitterness);
  if (bitternessMatch) {
    rawScore += ADVISOR_SCORE_WEIGHTS.bitterness;
  }

  const acidityMatch = matchesTasteScore(product.flavor.acidity, preferences.acidity);
  if (acidityMatch) {
    rawScore += ADVISOR_SCORE_WEIGHTS.acidity;
  }

  if (bitternessMatch || acidityMatch) {
    const matchedAttributes = [
      bitternessMatch ? `đắng ${product.flavor.bitterness}/5` : null,
      acidityMatch ? `chua ${product.flavor.acidity}/5` : null,
    ].filter((value): value is string => value !== null);
    reasons.push({
      title: "Khớp phổ vị mong muốn",
      description: `Các chỉ số ${matchedAttributes.join(" và ")} gần với lựa chọn của bạn.`,
      matchType: "taste",
    });
  }

  if (product.flavor.caffeine === preferences.caffeine) {
    rawScore += ADVISOR_SCORE_WEIGHTS.caffeine;
    reasons.push({
      title: `Caffeine mức ${preferences.caffeine === "high" ? "cao" : "vừa"}`,
      description: "Mức caffeine trong hồ sơ sản phẩm khớp với nhu cầu đã chọn.",
      matchType: "taste",
    });
  }

  if (preferences.budgetMax !== undefined) {
    rawScore += ADVISOR_SCORE_WEIGHTS.budget;
    reasons.push({
      title: "Trong ngân sách",
      description: `Có lựa chọn phù hợp từ ${lowestPrice.toLocaleString("vi-VN")} ₫, không vượt mức bạn đặt.`,
      matchType: "budget",
    });
  }

  let priorityScore = 0;
  for (const priority of new Set(preferences.priorities)) {
    if (!priorityMatches(product, priority)) continue;
    if (priorityScore >= ADVISOR_SCORE_WEIGHTS.priorityMaximum) break;

    priorityScore += ADVISOR_SCORE_WEIGHTS.priority;
    reasons.push(priorityReason(priority));
  }
  rawScore += priorityScore;

  if (reasons.length < 3) {
    reasons.push({
      title: "Có đúng quy cách bạn chọn",
      description: `Catalog hiện có lựa chọn ${preferences.format} còn hàng cho sản phẩm này.`,
      matchType: "brew",
    });
  }

  if (reasons.length < 3) {
    reasons.push({
      title: "Profile hương vị rõ ràng",
      description: `Các nốt chính gồm ${product.flavor.notes.slice(0, 3).join(", ").toLocaleLowerCase("vi-VN")}.`,
      matchType: "taste",
    });
  }

  if (reasons.length < 3) {
    reasons.push({
      title: `Nguồn gốc ${product.regionLabel}`,
      description: `Hồ sơ sản phẩm ghi vùng ${product.regionLabel} và sơ chế ${product.process}.`,
      matchType: "origin",
    });
  }

  const applicableMaximum =
    ADVISOR_SCORE_WEIGHTS.brewMethod +
    ADVISOR_SCORE_WEIGHTS.intensity +
    ADVISOR_SCORE_WEIGHTS.bitterness +
    ADVISOR_SCORE_WEIGHTS.acidity +
    ADVISOR_SCORE_WEIGHTS.caffeine +
    ADVISOR_SCORE_WEIGHTS.format +
    (preferences.budgetMax === undefined ? 0 : ADVISOR_SCORE_WEIGHTS.budget) +
    Math.min(
      new Set(preferences.priorities).size * ADVISOR_SCORE_WEIGHTS.priority,
      ADVISOR_SCORE_WEIGHTS.priorityMaximum,
    );

  return {
    recommendation: {
      product,
      score: Math.round((rawScore / applicableMaximum) * 100),
      reasons: reasons.slice(0, 4),
    },
    index,
  };
}

/**
 * Rule-based, deterministic advisor. Explicit format and budget constraints are
 * treated as hard requirements; the remaining candidates are ranked by the
 * documented weights and normalized to 0–100.
 */
export function scoreProducts(
  products: Product[],
  preferences: AdvisorPreferences,
): ProductRecommendation[] {
  return products
    .map((product, index) => scoreCandidate(product, preferences, index))
    .filter((candidate): candidate is ScoredCandidate => candidate !== null)
    .sort(
      (left, right) =>
        right.recommendation.score - left.recommendation.score || left.index - right.index,
    )
    .slice(0, 3)
    .map(({ recommendation }) => recommendation);
}

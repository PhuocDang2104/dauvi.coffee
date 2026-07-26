from __future__ import annotations

import math

from app.schemas import (
    AdvisorPreferencesIn,
    AdvisorRecommendationOut,
    ProductOut,
    RecommendationReason,
)

WEIGHTS = {
    "brew_method": 25,
    "intensity": 20,
    "bitterness": 15,
    "acidity": 15,
    "caffeine": 10,
    "format": 10,
    "budget": 10,
    "priority": 5,
    "priority_maximum": 10,
}

BREW_LABELS = {
    "phin": "phin",
    "espresso": "espresso",
    "pour-over": "pour-over",
    "aeropress": "AeroPress",
    "french-press": "French press",
    "moka-pot": "moka pot",
    "cold-brew": "cold brew",
    "drip": "drip",
}


def _taste_matches(score: int, preference: str) -> bool:
    if preference == "low":
        return score <= 2
    if preference == "medium":
        return score == 3
    return score >= 4


def _intensity_matches(product: ProductOut, preference: str) -> bool:
    if preference == "light":
        return product.flavor.body <= 3
    if preference == "balanced":
        return 3 <= product.flavor.body <= 4
    return product.flavor.body >= 4


def _minimum_catalog_price(product: ProductOut) -> int:
    prices = [variant.price.amount for variant in product.variants if variant.in_stock]
    return min(prices) if prices else 0


def _priority_matches(product: ProductOut, priority: str) -> bool:
    if priority == "traceability":
        return bool(product.featured_lot_code)
    if priority == "local-variety":
        return product.role == "local-story"
    if priority == "premium":
        return product.role in {"premium", "fine-robusta"}
    if priority == "easy-to-brew":
        return product.role in {"bestseller", "gateway-arabica"} or any(
            variant.in_stock and variant.format == "drip-bag" for variant in product.variants
        )
    if priority == "everyday":
        return product.role in {"bestseller", "signature", "gateway-arabica"}
    if priority == "budget-friendly":
        return _minimum_catalog_price(product) < 120_000
    if priority == "quick-brew":
        return any(
            variant.in_stock and variant.format == "drip-bag" for variant in product.variants
        )
    return False


def _priority_reason(priority: str) -> RecommendationReason:
    if priority == "traceability":
        return RecommendationReason(
            title="Có hồ sơ lô nổi bật",
            description="Sản phẩm có mã lô demo để bạn khám phá cấu trúc truy xuất.",
            match_type="origin",
        )
    if priority == "local-variety":
        return RecommendationReason(
            title="Câu chuyện giống Việt",
            description="Sản phẩm tập trung vào một giống địa phương trong bộ sưu tập.",
            match_type="origin",
        )
    if priority == "premium":
        return RecommendationReason(
            title="Trải nghiệm giàu hương",
            description="Profile và vai trò sản phẩm phù hợp với ưu tiên trải nghiệm premium.",
            match_type="taste",
        )
    if priority in {"easy-to-brew", "everyday"}:
        return RecommendationReason(
            title="Dễ đưa vào nhịp pha hằng ngày",
            description="Quy cách và profile được thiết kế để dễ chọn, dễ pha tại nhà.",
            match_type="brew",
        )
    if priority == "budget-friendly":
        return RecommendationReason(
            title="Mức giá dễ tiếp cận",
            description="Gói 250 g nằm trong nhóm giá dưới 120.000 ₫.",
            match_type="budget",
        )
    return RecommendationReason(
        title="Có lựa chọn pha nhanh",
        description="Sản phẩm có quy cách drip bag tiện lợi trong catalog hiện tại.",
        match_type="brew",
    )


def _score_product(
    product: ProductOut, preferences: AdvisorPreferencesIn
) -> AdvisorRecommendationOut | None:
    variants = [
        variant
        for variant in product.variants
        if variant.in_stock and variant.format == preferences.format
    ]
    if not variants:
        return None

    lowest_price = min(variant.price.amount for variant in variants)
    if preferences.budget_max is not None and lowest_price > preferences.budget_max:
        return None

    raw_score = WEIGHTS["format"]
    reasons: list[RecommendationReason] = []
    if preferences.brew_method in product.brew_methods:
        raw_score += WEIGHTS["brew_method"]
        label = BREW_LABELS[preferences.brew_method]
        reasons.append(
            RecommendationReason(
                title=f"Hợp với {label}",
                description=f"Profile rang và cấu trúc vị được đề xuất cho cách pha {label}.",
                match_type="brew",
            )
        )

    if _intensity_matches(product, preferences.intensity):
        raw_score += WEIGHTS["intensity"]
        reasons.append(
            RecommendationReason(
                title="Đúng độ đậm bạn chọn",
                description=(
                    f"Body {product.flavor.body}/5 khớp với mức "
                    f"{preferences.intensity} trong bộ quy tắc."
                ),
                match_type="taste",
            )
        )

    bitterness_match = _taste_matches(product.flavor.bitterness, preferences.bitterness)
    acidity_match = _taste_matches(product.flavor.acidity, preferences.acidity)
    if bitterness_match:
        raw_score += WEIGHTS["bitterness"]
    if acidity_match:
        raw_score += WEIGHTS["acidity"]
    if bitterness_match or acidity_match:
        attributes = []
        if bitterness_match:
            attributes.append(f"đắng {product.flavor.bitterness}/5")
        if acidity_match:
            attributes.append(f"chua {product.flavor.acidity}/5")
        reasons.append(
            RecommendationReason(
                title="Khớp phổ vị mong muốn",
                description=f"Các chỉ số {' và '.join(attributes)} gần với lựa chọn của bạn.",
                match_type="taste",
            )
        )

    if product.flavor.caffeine == preferences.caffeine:
        raw_score += WEIGHTS["caffeine"]
        caffeine_label = "cao" if preferences.caffeine == "high" else "vừa"
        reasons.append(
            RecommendationReason(
                title=f"Caffeine mức {caffeine_label}",
                description="Mức caffeine trong hồ sơ sản phẩm khớp với nhu cầu đã chọn.",
                match_type="taste",
            )
        )

    if preferences.budget_max is not None:
        raw_score += WEIGHTS["budget"]
        reasons.append(
            RecommendationReason(
                title="Trong ngân sách",
                description=(
                    f"Có lựa chọn phù hợp từ {lowest_price:,} ₫, không vượt mức bạn đặt."
                ).replace(",", "."),
                match_type="budget",
            )
        )

    priority_score = 0
    for priority in preferences.priorities:
        if not _priority_matches(product, priority):
            continue
        if priority_score >= WEIGHTS["priority_maximum"]:
            break
        priority_score += WEIGHTS["priority"]
        reasons.append(_priority_reason(priority))
    raw_score += priority_score

    fallback_reasons = [
        RecommendationReason(
            title="Có đúng quy cách bạn chọn",
            description=f"Catalog hiện có lựa chọn {preferences.format} còn hàng cho sản phẩm này.",
            match_type="brew",
        ),
        RecommendationReason(
            title="Profile hương vị rõ ràng",
            description=f"Các nốt chính gồm {', '.join(product.flavor.notes[:3]).lower()}.",
            match_type="taste",
        ),
        RecommendationReason(
            title=f"Nguồn gốc {product.region_label}",
            description=(
                f"Hồ sơ sản phẩm ghi vùng {product.region_label} và sơ chế {product.process}."
            ),
            match_type="origin",
        ),
    ]
    for reason in fallback_reasons:
        if len(reasons) >= 3:
            break
        reasons.append(reason)

    applicable_maximum = (
        WEIGHTS["brew_method"]
        + WEIGHTS["intensity"]
        + WEIGHTS["bitterness"]
        + WEIGHTS["acidity"]
        + WEIGHTS["caffeine"]
        + WEIGHTS["format"]
        + (WEIGHTS["budget"] if preferences.budget_max is not None else 0)
        + min(len(preferences.priorities) * WEIGHTS["priority"], WEIGHTS["priority_maximum"])
    )
    normalized_score = math.floor((raw_score / applicable_maximum) * 100 + 0.5)
    return AdvisorRecommendationOut(
        product_id=product.id,
        score=normalized_score,
        reasons=reasons[:4],
    )


def score_products(
    products: list[ProductOut], preferences: AdvisorPreferencesIn
) -> list[AdvisorRecommendationOut]:
    candidates = []
    for index, product in enumerate(products):
        recommendation = _score_product(product, preferences)
        if recommendation is not None:
            candidates.append((recommendation, index))
    candidates.sort(key=lambda value: (-value[0].score, value[1]))
    return [recommendation for recommendation, _ in candidates[:3]]

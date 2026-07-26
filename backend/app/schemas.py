from __future__ import annotations

import re
from datetime import date, datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator
from pydantic.alias_generators import to_camel


class ApiModel(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True,
    )


class MoneyOut(ApiModel):
    amount: int = Field(ge=0)
    currency: Literal["VND"] = "VND"


class ProductVariantOut(ApiModel):
    id: str
    sku: str
    format: Literal["whole-bean", "ground", "drip-bag"]
    weight_grams: Literal[250, 500] | None = None
    drip_bag_count: Literal[10, 20] | None = None
    drip_bag_weight_grams: Literal[12] | None = None
    grind_options: list[str]
    price: MoneyOut
    compare_at_price: MoneyOut | None = None
    in_stock: bool


class FlavorProfileOut(ApiModel):
    bitterness: int = Field(ge=1, le=5)
    acidity: int = Field(ge=1, le=5)
    sweetness: int = Field(ge=1, le=5)
    body: int = Field(ge=1, le=5)
    aroma: int = Field(ge=1, le=5)
    notes: list[str]
    caffeine: Literal["medium", "high"]


class ProductImageOut(ApiModel):
    src: str
    alt: str


class ProductOut(ApiModel):
    id: str
    slug: str
    display_name: str
    short_name: str
    proposition: str
    species: Literal["robusta", "arabica", "blend"]
    scientific_name: str
    variety: str
    segment: str
    role: str
    region_id: str
    region_label: str
    altitude_label: str
    process: Literal["natural", "washed", "honey"]
    roast_level: str
    flavor: FlavorProfileOut
    brew_methods: list[str]
    story: str
    variety_facts: list[str]
    badges: list[str]
    accent: str
    pattern: str
    image: ProductImageOut
    variants: list[ProductVariantOut]
    featured_lot_code: str
    published: bool


class EvidenceItemOut(ApiModel):
    key: str
    label: str
    value: str
    level: Literal["verified", "supplier-declared", "reference", "demo"]
    source_label: str | None = None
    source_reference: str | None = None
    verified_at: date | None = None


class TraceabilityEventOut(ApiModel):
    id: str
    stage: Literal["farm", "harvest", "processing", "green-bean", "roasting", "packaging"]
    title: str
    date_label: str
    description: str


class CoffeeLotOut(ApiModel):
    lot_code: str
    product_id: str
    status: Literal["available", "sold-out", "archived"]
    farm_name: str
    cooperative_name: str | None = None
    province: str
    district: str
    region_id: str
    altitude_label: str
    harvest_year: int
    variety: str
    process: Literal["natural", "washed", "honey"]
    roast_date: date
    packaging_date: date
    evidence_level: Literal["verified", "supplier-declared", "reference", "demo"]
    demo_disclosure: str
    evidence: list[EvidenceItemOut]
    timeline: list[TraceabilityEventOut]


class RecommendationReason(ApiModel):
    title: str
    description: str
    match_type: Literal["taste", "brew", "budget", "origin"]


class AdvisorPreferencesIn(ApiModel):
    intensity: Literal["light", "balanced", "bold"]
    bitterness: Literal["low", "medium", "high"]
    acidity: Literal["low", "medium", "high"]
    caffeine: Literal["medium", "high"]
    brew_method: Literal[
        "phin",
        "espresso",
        "pour-over",
        "aeropress",
        "french-press",
        "moka-pot",
        "cold-brew",
        "drip",
    ]
    format: Literal["whole-bean", "ground", "drip-bag"]
    budget_max: int | None = Field(default=None, gt=0)
    priorities: list[
        Literal[
            "everyday",
            "traceability",
            "local-variety",
            "premium",
            "budget-friendly",
            "quick-brew",
            "easy-to-brew",
        ]
    ] = Field(default_factory=list, max_length=7)

    @field_validator("priorities")
    @classmethod
    def priorities_must_be_unique(cls, values: list[str]) -> list[str]:
        if len(values) != len(set(values)):
            raise ValueError("Advisor priorities must be unique.")
        return values


class AdvisorRecommendationOut(ApiModel):
    product_id: str
    score: int = Field(ge=0, le=100)
    reasons: list[RecommendationReason] = Field(max_length=4)


class AdvisorResponse(ApiModel):
    recommendations: list[AdvisorRecommendationOut]


class OrderItemIn(ApiModel):
    product_id: str = Field(min_length=1, max_length=64)
    variant_id: str = Field(min_length=1, max_length=100)
    quantity: int = Field(ge=1, le=99)
    grind: str | None = Field(default=None, max_length=30)


class OrderCreateIn(ApiModel):
    full_name: str = Field(min_length=2, max_length=160)
    phone: str = Field(min_length=1, max_length=20)
    email: str | None = Field(default=None, max_length=255)
    province: str = Field(min_length=2, max_length=100)
    district: str = Field(min_length=2, max_length=100)
    ward: str = Field(min_length=2, max_length=100)
    address: str = Field(min_length=5, max_length=255)
    delivery_note: str | None = Field(default=None, max_length=300)
    shipping_method: Literal["standard"]
    payment_method: Literal["cod"]
    accept_demo: Literal[True]
    items: list[OrderItemIn] = Field(min_length=1, max_length=20)

    @field_validator("full_name", "province", "district", "ward", "address")
    @classmethod
    def strip_required_text(cls, value: str) -> str:
        normalized = value.strip()
        if not normalized:
            raise ValueError("This field must not be blank.")
        return normalized

    @field_validator("phone")
    @classmethod
    def validate_vietnamese_phone(cls, value: str) -> str:
        normalized = re.sub(r"[\s.-]", "", value)
        if not re.fullmatch(r"(?:\+84|0)\d{9}", normalized):
            raise ValueError("Số điện thoại chưa đúng định dạng Việt Nam.")
        return normalized

    @field_validator("email")
    @classmethod
    def normalize_email(cls, value: str | None) -> str | None:
        if value is None or not value.strip():
            return None
        normalized = value.strip().lower()
        if not re.fullmatch(r"[^\s@]+@[^\s@]+\.[^\s@]+", normalized):
            raise ValueError("Email chưa đúng định dạng.")
        return normalized


class OrderOut(ApiModel):
    order_code: str
    recipient_name: str
    item_count: int
    subtotal: int
    shipping_fee: int
    total: int
    status: Literal["demo-confirmed"]
    created_at: datetime


class ErrorResponse(ApiModel):
    message: str
    code: str | None = None

from __future__ import annotations

from datetime import date, datetime

from sqlalchemy import (
    JSON,
    Boolean,
    Date,
    DateTime,
    ForeignKey,
    Index,
    Integer,
    String,
    Text,
    UniqueConstraint,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base


class Product(Base):
    __tablename__ = "products"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    slug: Mapped[str] = mapped_column(String(160), unique=True, nullable=False)
    display_name: Mapped[str] = mapped_column(String(180), nullable=False)
    short_name: Mapped[str] = mapped_column(String(100), nullable=False)
    proposition: Mapped[str] = mapped_column(Text, nullable=False)
    species: Mapped[str] = mapped_column(String(20), nullable=False)
    scientific_name: Mapped[str] = mapped_column(String(80), nullable=False)
    variety: Mapped[str] = mapped_column(String(100), nullable=False)
    segment: Mapped[str] = mapped_column(String(80), nullable=False)
    role: Mapped[str] = mapped_column(String(40), nullable=False)
    region_id: Mapped[str] = mapped_column(String(80), nullable=False)
    region_label: Mapped[str] = mapped_column(String(180), nullable=False)
    altitude_label: Mapped[str] = mapped_column(String(80), nullable=False)
    process: Mapped[str] = mapped_column(String(20), nullable=False)
    roast_level: Mapped[str] = mapped_column(String(30), nullable=False)
    bitterness: Mapped[int] = mapped_column(Integer, nullable=False)
    acidity: Mapped[int] = mapped_column(Integer, nullable=False)
    sweetness: Mapped[int] = mapped_column(Integer, nullable=False)
    body: Mapped[int] = mapped_column(Integer, nullable=False)
    aroma: Mapped[int] = mapped_column(Integer, nullable=False)
    caffeine: Mapped[str] = mapped_column(String(20), nullable=False)
    flavor_notes: Mapped[list[str]] = mapped_column(JSON, nullable=False)
    brew_methods: Mapped[list[str]] = mapped_column(JSON, nullable=False)
    story: Mapped[str] = mapped_column(Text, nullable=False)
    variety_facts: Mapped[list[str]] = mapped_column(JSON, nullable=False)
    badges: Mapped[list[str]] = mapped_column(JSON, nullable=False)
    accent: Mapped[str] = mapped_column(String(16), nullable=False)
    pattern: Mapped[str] = mapped_column(String(80), nullable=False)
    image_src: Mapped[str] = mapped_column(String(255), nullable=False)
    image_alt: Mapped[str] = mapped_column(String(255), nullable=False)
    featured_lot_code: Mapped[str] = mapped_column(String(80), nullable=False)
    published: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    featured_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )

    variants: Mapped[list[ProductVariant]] = relationship(
        back_populates="product", cascade="all, delete-orphan", order_by="ProductVariant.sort_order"
    )
    lots: Mapped[list[CoffeeLot]] = relationship(back_populates="product")

    __table_args__ = (
        Index("ix_products_published_featured", "published", "featured_order"),
        Index("ix_products_region", "region_id"),
    )


class ProductVariant(Base):
    __tablename__ = "product_variants"

    id: Mapped[str] = mapped_column(String(100), primary_key=True)
    product_id: Mapped[str] = mapped_column(
        ForeignKey("products.id", ondelete="CASCADE"), nullable=False, index=True
    )
    sku: Mapped[str] = mapped_column(String(80), unique=True, nullable=False)
    format: Mapped[str] = mapped_column(String(30), nullable=False)
    weight_grams: Mapped[int | None] = mapped_column(Integer)
    drip_bag_count: Mapped[int | None] = mapped_column(Integer)
    drip_bag_weight_grams: Mapped[int | None] = mapped_column(Integer)
    grind_options: Mapped[list[str]] = mapped_column(JSON, nullable=False)
    price_amount: Mapped[int] = mapped_column(Integer, nullable=False)
    currency: Mapped[str] = mapped_column(String(3), nullable=False, default="VND")
    compare_at_amount: Mapped[int | None] = mapped_column(Integer)
    in_stock: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    product: Mapped[Product] = relationship(back_populates="variants")

    __table_args__ = (Index("ix_variants_product_stock", "product_id", "in_stock"),)


class CoffeeLot(Base):
    __tablename__ = "coffee_lots"

    lot_code: Mapped[str] = mapped_column(String(80), primary_key=True)
    product_id: Mapped[str] = mapped_column(
        ForeignKey("products.id", ondelete="RESTRICT"), nullable=False, index=True
    )
    status: Mapped[str] = mapped_column(String(20), nullable=False)
    farm_name: Mapped[str] = mapped_column(String(180), nullable=False)
    cooperative_name: Mapped[str | None] = mapped_column(String(180))
    province: Mapped[str] = mapped_column(String(100), nullable=False)
    district: Mapped[str] = mapped_column(String(140), nullable=False)
    region_id: Mapped[str] = mapped_column(String(80), nullable=False)
    altitude_label: Mapped[str] = mapped_column(String(80), nullable=False)
    harvest_year: Mapped[int] = mapped_column(Integer, nullable=False)
    variety: Mapped[str] = mapped_column(String(100), nullable=False)
    process: Mapped[str] = mapped_column(String(20), nullable=False)
    roast_date: Mapped[date] = mapped_column(Date, nullable=False)
    packaging_date: Mapped[date] = mapped_column(Date, nullable=False)
    evidence_level: Mapped[str] = mapped_column(String(30), nullable=False)
    demo_disclosure: Mapped[str] = mapped_column(Text, nullable=False)
    featured_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    product: Mapped[Product] = relationship(back_populates="lots")
    evidence: Mapped[list[EvidenceItem]] = relationship(
        back_populates="lot", cascade="all, delete-orphan", order_by="EvidenceItem.sort_order"
    )
    timeline: Mapped[list[LotTimelineEvent]] = relationship(
        back_populates="lot",
        cascade="all, delete-orphan",
        order_by="LotTimelineEvent.sort_order",
    )


class EvidenceItem(Base):
    __tablename__ = "evidence_items"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    lot_code: Mapped[str] = mapped_column(
        ForeignKey("coffee_lots.lot_code", ondelete="CASCADE"), nullable=False, index=True
    )
    key: Mapped[str] = mapped_column(String(100), nullable=False)
    label: Mapped[str] = mapped_column(String(120), nullable=False)
    value: Mapped[str] = mapped_column(Text, nullable=False)
    level: Mapped[str] = mapped_column(String(30), nullable=False)
    source_label: Mapped[str | None] = mapped_column(String(255))
    source_reference: Mapped[str | None] = mapped_column(String(500))
    verified_at: Mapped[date | None] = mapped_column(Date)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    lot: Mapped[CoffeeLot] = relationship(back_populates="evidence")

    __table_args__ = (UniqueConstraint("lot_code", "key", name="uq_evidence_lot_key"),)


class LotTimelineEvent(Base):
    __tablename__ = "lot_timeline_events"

    id: Mapped[str] = mapped_column(String(140), primary_key=True)
    lot_code: Mapped[str] = mapped_column(
        ForeignKey("coffee_lots.lot_code", ondelete="CASCADE"), nullable=False, index=True
    )
    stage: Mapped[str] = mapped_column(String(30), nullable=False)
    title: Mapped[str] = mapped_column(String(120), nullable=False)
    date_label: Mapped[str] = mapped_column(String(80), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    lot: Mapped[CoffeeLot] = relationship(back_populates="timeline")

    __table_args__ = (UniqueConstraint("lot_code", "stage", name="uq_timeline_lot_stage"),)


class Order(Base):
    __tablename__ = "orders"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    order_code: Mapped[str] = mapped_column(String(32), unique=True, nullable=False)
    idempotency_key: Mapped[str | None] = mapped_column(String(100), unique=True)
    status: Mapped[str] = mapped_column(String(30), nullable=False, default="demo-confirmed")
    full_name: Mapped[str] = mapped_column(String(160), nullable=False)
    phone: Mapped[str] = mapped_column(String(20), nullable=False)
    email: Mapped[str | None] = mapped_column(String(255))
    province: Mapped[str] = mapped_column(String(100), nullable=False)
    district: Mapped[str] = mapped_column(String(100), nullable=False)
    ward: Mapped[str] = mapped_column(String(100), nullable=False)
    address: Mapped[str] = mapped_column(String(255), nullable=False)
    delivery_note: Mapped[str | None] = mapped_column(String(300))
    shipping_method: Mapped[str] = mapped_column(String(30), nullable=False)
    payment_method: Mapped[str] = mapped_column(String(30), nullable=False)
    subtotal: Mapped[int] = mapped_column(Integer, nullable=False)
    shipping_fee: Mapped[int] = mapped_column(Integer, nullable=False)
    total: Mapped[int] = mapped_column(Integer, nullable=False)
    item_count: Mapped[int] = mapped_column(Integer, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    items: Mapped[list[OrderItem]] = relationship(
        back_populates="order", cascade="all, delete-orphan", order_by="OrderItem.id"
    )


class OrderItem(Base):
    __tablename__ = "order_items"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    order_id: Mapped[str] = mapped_column(
        ForeignKey("orders.id", ondelete="CASCADE"), nullable=False, index=True
    )
    product_id: Mapped[str] = mapped_column(String(64), nullable=False)
    variant_id: Mapped[str] = mapped_column(String(100), nullable=False)
    sku: Mapped[str] = mapped_column(String(80), nullable=False)
    product_name: Mapped[str] = mapped_column(String(180), nullable=False)
    format: Mapped[str] = mapped_column(String(30), nullable=False)
    size_label: Mapped[str] = mapped_column(String(80), nullable=False)
    grind: Mapped[str | None] = mapped_column(String(30))
    unit_price: Mapped[int] = mapped_column(Integer, nullable=False)
    quantity: Mapped[int] = mapped_column(Integer, nullable=False)
    line_total: Mapped[int] = mapped_column(Integer, nullable=False)

    order: Mapped[Order] = relationship(back_populates="items")

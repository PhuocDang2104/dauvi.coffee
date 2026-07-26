from __future__ import annotations

import secrets
import uuid
from datetime import UTC, datetime

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.models import Order, OrderItem, ProductVariant
from app.schemas import OrderCreateIn, OrderOut

FREE_SHIPPING_THRESHOLD = 499_000
STANDARD_SHIPPING_FEE = 30_000


def _order_to_schema(order: Order) -> OrderOut:
    return OrderOut(
        order_code=order.order_code,
        recipient_name=order.full_name,
        item_count=order.item_count,
        subtotal=order.subtotal,
        shipping_fee=order.shipping_fee,
        total=order.total,
        status=order.status,
        created_at=order.created_at,
    )


def _size_label(variant: ProductVariant) -> str:
    if variant.weight_grams:
        return f"{variant.weight_grams} g"
    return f"{variant.drip_bag_count} gói × {variant.drip_bag_weight_grams} g"


def _validate_grind(variant: ProductVariant, grind: str | None) -> None:
    if variant.format == "drip-bag":
        if grind is not None:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
                detail="Drip bag không nhận tùy chọn xay.",
            )
        return
    if grind is None or grind not in variant.grind_options:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            detail=f"Tùy chọn xay không hợp lệ cho SKU {variant.sku}.",
        )


def create_demo_order(
    session: Session,
    payload: OrderCreateIn,
    idempotency_key: str | None,
) -> OrderOut:
    if idempotency_key:
        existing = session.scalar(select(Order).where(Order.idempotency_key == idempotency_key))
        if existing:
            return _order_to_schema(existing)

    requested_variant_ids = {item.variant_id for item in payload.items}
    variants = session.scalars(
        select(ProductVariant)
        .options(joinedload(ProductVariant.product))
        .where(ProductVariant.id.in_(requested_variant_ids))
    ).all()
    variant_by_id = {variant.id: variant for variant in variants}
    if len(variant_by_id) != len(requested_variant_ids):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            detail="Một hoặc nhiều biến thể không còn tồn tại.",
        )

    order_items: list[OrderItem] = []
    subtotal = 0
    item_count = 0
    for item in payload.items:
        variant = variant_by_id[item.variant_id]
        if variant.product_id != item.product_id:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
                detail="Sản phẩm và biến thể không khớp.",
            )
        if not variant.in_stock:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"SKU {variant.sku} hiện đã hết hàng.",
            )
        _validate_grind(variant, item.grind)
        line_total = variant.price_amount * item.quantity
        subtotal += line_total
        item_count += item.quantity
        order_items.append(
            OrderItem(
                id=str(uuid.uuid4()),
                product_id=variant.product_id,
                variant_id=variant.id,
                sku=variant.sku,
                product_name=variant.product.display_name,
                format=variant.format,
                size_label=_size_label(variant),
                grind=item.grind,
                unit_price=variant.price_amount,
                quantity=item.quantity,
                line_total=line_total,
            )
        )

    shipping_fee = 0 if subtotal >= FREE_SHIPPING_THRESHOLD else STANDARD_SHIPPING_FEE
    now = datetime.now(UTC)
    order = Order(
        id=str(uuid.uuid4()),
        order_code=f"DV-{now:%y%m%d}-{secrets.token_hex(3).upper()}",
        idempotency_key=idempotency_key,
        status="demo-confirmed",
        full_name=payload.full_name,
        phone=payload.phone,
        email=payload.email,
        province=payload.province,
        district=payload.district,
        ward=payload.ward,
        address=payload.address,
        delivery_note=payload.delivery_note,
        shipping_method=payload.shipping_method,
        payment_method=payload.payment_method,
        subtotal=subtotal,
        shipping_fee=shipping_fee,
        total=subtotal + shipping_fee,
        item_count=item_count,
        created_at=now,
        items=order_items,
    )
    session.add(order)
    session.commit()
    session.refresh(order)
    return _order_to_schema(order)

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.db import get_db
from app.mappers import product_to_schema
from app.models import Product
from app.schemas import ProductOut
from app.services.catalog import filter_products

router = APIRouter(prefix="/products", tags=["products"])


def _published_products(session: Session) -> list[Product]:
    statement = (
        select(Product)
        .options(selectinload(Product.variants))
        .where(Product.published.is_(True))
        .order_by(Product.featured_order, Product.id)
    )
    return list(session.scalars(statement).all())


@router.get("", response_model=list[ProductOut])
def list_products(
    session: Annotated[Session, Depends(get_db)],
    q: Annotated[str | None, Query(max_length=120)] = None,
    species: Annotated[list[str] | None, Query()] = None,
    region: Annotated[list[str] | None, Query()] = None,
    process: Annotated[list[str] | None, Query()] = None,
    roast: Annotated[list[str] | None, Query()] = None,
    brew: Annotated[list[str] | None, Query()] = None,
    price: Annotated[list[str] | None, Query()] = None,
    format_: Annotated[list[str] | None, Query(alias="format")] = None,
    min_price: Annotated[int | None, Query(alias="minPrice", ge=0)] = None,
    max_price: Annotated[int | None, Query(alias="maxPrice", ge=0)] = None,
    sort: Annotated[str, Query()] = "featured",
) -> list[ProductOut]:
    products = [product_to_schema(product) for product in _published_products(session)]
    return filter_products(
        products,
        q=q,
        species=species,
        region=region,
        process=process,
        roast=roast,
        brew=brew,
        price=price,
        format_=format_,
        min_price=min_price,
        max_price=max_price,
        sort=sort,
    )


@router.get("/featured", response_model=list[ProductOut])
def featured_products(session: Annotated[Session, Depends(get_db)]) -> list[ProductOut]:
    return [product_to_schema(product) for product in _published_products(session)]


@router.get("/{slug}", response_model=ProductOut)
def product_detail(slug: str, session: Annotated[Session, Depends(get_db)]) -> ProductOut:
    product = session.scalar(
        select(Product)
        .options(selectinload(Product.variants))
        .where(Product.slug == slug, Product.published.is_(True))
    )
    if product is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy sản phẩm.",
        )
    return product_to_schema(product)

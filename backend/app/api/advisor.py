from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.db import get_db
from app.mappers import product_to_schema
from app.models import Product
from app.schemas import AdvisorPreferencesIn, AdvisorResponse
from app.services.advisor import score_products

router = APIRouter(prefix="/advisor", tags=["advisor"])


@router.post("/recommendations", response_model=AdvisorResponse)
def recommendations(
    payload: AdvisorPreferencesIn,
    session: Annotated[Session, Depends(get_db)],
) -> AdvisorResponse:
    products = session.scalars(
        select(Product)
        .options(selectinload(Product.variants))
        .where(Product.published.is_(True))
        .order_by(Product.featured_order, Product.id)
    ).all()
    return AdvisorResponse(
        recommendations=score_products(
            [product_to_schema(product) for product in products], payload
        )
    )

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.db import get_db
from app.mappers import lot_to_schema
from app.models import CoffeeLot
from app.schemas import CoffeeLotOut

router = APIRouter(prefix="/lots", tags=["traceability"])


def _lot_options():
    return (selectinload(CoffeeLot.evidence), selectinload(CoffeeLot.timeline))


@router.get("/featured", response_model=list[CoffeeLotOut])
def featured_lots(session: Annotated[Session, Depends(get_db)]) -> list[CoffeeLotOut]:
    lots = session.scalars(
        select(CoffeeLot)
        .options(*_lot_options())
        .where(CoffeeLot.status != "archived")
        .order_by(CoffeeLot.featured_order, CoffeeLot.lot_code)
    ).all()
    return [lot_to_schema(lot) for lot in lots]


@router.get("/{lot_code}", response_model=CoffeeLotOut)
def lot_detail(lot_code: str, session: Annotated[Session, Depends(get_db)]) -> CoffeeLotOut:
    normalized_code = lot_code.strip().upper()
    lot = session.scalar(
        select(CoffeeLot).options(*_lot_options()).where(CoffeeLot.lot_code == normalized_code)
    )
    if lot is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy mã lô.",
        )
    return lot_to_schema(lot)

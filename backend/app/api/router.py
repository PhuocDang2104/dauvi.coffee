from fastapi import APIRouter

from app.api import advisor, lots, orders, products

api_router = APIRouter()
api_router.include_router(products.router)
api_router.include_router(lots.router)
api_router.include_router(advisor.router)
api_router.include_router(orders.router)

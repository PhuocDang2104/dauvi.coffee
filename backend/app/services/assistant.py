from __future__ import annotations

import unicodedata

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Product
from app.schemas import AssistantActionOut, AssistantResponse


def _normalize(value: str) -> str:
    decomposed = unicodedata.normalize("NFD", value.lower())
    return "".join(character for character in decomposed if unicodedata.category(character) != "Mn")


def _available_slug(session: Session, product_id: str) -> str | None:
    return session.scalar(
        select(Product.slug).where(Product.id == product_id, Product.published.is_(True))
    )


def _product_action(session: Session, product_id: str, label: str) -> AssistantActionOut | None:
    slug = _available_slug(session, product_id)
    return AssistantActionOut(label=label, href=f"/shop/{slug}") if slug else None


def _response(message: str, actions: list[AssistantActionOut | None]) -> AssistantResponse:
    return AssistantResponse(message=message, actions=[action for action in actions if action][:3])


def answer_catalog_question(session: Session, raw_message: str) -> AssistantResponse:
    message = _normalize(raw_message)
    if any(keyword in message for keyword in ("ma lo", "truy xuat", "nguon goc", "passport")):
        return _response(
            "Bạn có thể nhập mã in trên gói để xem vùng trồng, sơ chế, rang và đóng gói. Hãy thử mã TR4-DLK-26-N02.",
            [AssistantActionOut(label="Tra cứu mã lô", href="/traceability")],
        )
    if any(keyword in message for keyword in ("phin", "dam", "caffeine", "robusta")):
        return _response(
            "Với gu đậm hoặc pha phin, TRS1 dễ tiếp cận; TR4 có body dày và hồ sơ lô demo nổi bật.",
            [
                _product_action(session, "trs1", "Xem TRS1"),
                _product_action(session, "tr4", "Xem TR4"),
            ],
        )
    if any(keyword in message for keyword in ("it dang", "arabica", "pour", "thom", "chua")):
        return _response(
            "Catimor Đà Lạt cân bằng và dễ uống; Bourbon Langbiang thanh, thơm hơn với mật ong và cam ngọt.",
            [
                _product_action(session, "catimor", "Xem Catimor"),
                _product_action(session, "bourbon", "Xem Bourbon"),
            ],
        )
    if any(keyword in message for keyword in ("gia", "ngan sach", "re", "120")):
        return _response(
            "TRS1 250 g bắt đầu từ 99.000 ₫; TR4 250 g bắt đầu từ 119.000 ₫ theo catalog hiện tại.",
            [AssistantActionOut(label="Lọc theo giá", href="/shop?price=under-120000")],
        )
    return _response(
        "Mình có thể giúp chọn theo cách pha, độ đậm, độ đắng, ngân sách hoặc tra cứu mã lô. Bạn muốn bắt đầu từ điều nào?",
        [AssistantActionOut(label="Mở Coffee Advisor", href="/advisor")],
    )

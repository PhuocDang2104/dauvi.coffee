from __future__ import annotations

import hashlib
import re
import time
import uuid
from dataclasses import dataclass
from typing import Literal, TypedDict

from langgraph.graph import END, START, StateGraph
from langgraph.runtime import Runtime
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.config import Settings
from app.models import Product, RetrievalLog
from app.schemas import AssistantActionOut, AssistantResponse
from app.services.assistant import (
    AssistantRoute,
    _actions,
    _fallback_message,
    _generate_ai_message,
    _load_catalog,
    _normalize,
    _retrieve_products,
    _route_with_ai,
)
from app.services.retrieval import HybridRetrievalResult, hybrid_retrieve

ToolNodeName = Literal[
    "direct_response",
    "coffee_retrieval_tool",
    "traceability_tool",
    "brew_knowledge_tool",
    "commerce_policy_tool",
    "scope_fallback",
]


class AssistantGraphState(TypedDict, total=False):
    raw_message: str
    normalized_query: str
    route: AssistantRoute
    route_source: Literal["llm", "deterministic-fallback"]
    selected_tool: ToolNodeName
    structured_product_ids: list[str]
    bm25_chunk_ids: list[str]
    vector_chunk_ids: list[str]
    grounded_chunk_ids: list[str]
    grounded_product_ids: list[str]
    grounded_products: list[Product]
    knowledge_context: str
    message: str
    used_vector: bool
    router_used_llm: bool
    generator_used_llm: bool
    used_llm: bool


@dataclass(frozen=True)
class AssistantGraphContext:
    session: Session
    settings: Settings
    catalog: list[Product]
    started_at: float


PRODUCT_KEYWORDS = {
    "arabica",
    "bourbon",
    "ca phe",
    "catimor",
    "caffeine",
    "dam",
    "dang",
    "gia",
    "gu",
    "honey",
    "robusta",
    "san pham",
    "thom",
    "tr4",
    "tr9",
    "trs1",
    "xanh lun",
}
LOT_CODE_PATTERN = re.compile(r"\b[A-Z0-9]{2,8}-[A-Z]{2,4}-\d{2}-[A-Z]\d{2}\b")

ROUTE_TO_TOOL: dict[AssistantRoute, ToolNodeName] = {
    "greeting": "direct_response",
    "coffee-product": "coffee_retrieval_tool",
    "traceability": "traceability_tool",
    "brewing": "brew_knowledge_tool",
    "commerce": "commerce_policy_tool",
    "out-of-scope": "scope_fallback",
}


def _fallback_route(raw_message: str) -> AssistantRoute:
    query = _normalize(raw_message)
    if query in {"chao", "chao ban", "hello", "hi", "xin chao"} or any(
        value in query for value in ("ban lam duoc gi", "co the giup gi")
    ):
        return "greeting"
    if LOT_CODE_PATTERN.search(raw_message.upper()) or any(
        value in query for value in ("ma lo", "lo ", "truy xuat", "passport", "nguon goc")
    ):
        return "traceability"
    if any(
        value in query
        for value in ("cach pha", "pha phin", "pour over", "aeropress", "drip bag", "do xay")
    ):
        return "brewing"
    if any(
        value in query
        for value in ("giao hang", "checkout", "cod", "dat hang", "phi ship", "van chuyen")
    ):
        return "commerce"
    if any(value in query for value in ("tu van", "chon giup", "phu hop", "nen mua")) or any(
        value in query for value in PRODUCT_KEYWORDS
    ):
        return "coffee-product"
    return "out-of-scope"


def _load_grounded_products(session: Session, product_ids: list[str]) -> list[Product]:
    if not product_ids:
        return []
    products = list(
        session.scalars(
            select(Product)
            .options(selectinload(Product.variants), selectinload(Product.lots))
            .where(Product.id.in_(product_ids), Product.published.is_(True))
        ).unique()
    )
    by_id = {product.id: product for product in products}
    return [by_id[product_id] for product_id in product_ids if product_id in by_id]


async def _intent_router(
    state: AssistantGraphState,
    runtime: Runtime[AssistantGraphContext],
) -> AssistantGraphState:
    normalized = _normalize(state["raw_message"])
    ai_route = await _route_with_ai(state["raw_message"], runtime.context.settings)
    route = ai_route or _fallback_route(state["raw_message"])
    return {
        "normalized_query": normalized,
        "route": route,
        "route_source": "llm" if ai_route else "deterministic-fallback",
        "selected_tool": ROUTE_TO_TOOL[route],
        "router_used_llm": ai_route is not None,
    }


def _route_to_tool(state: AssistantGraphState) -> ToolNodeName:
    return state["selected_tool"]


def _retrieval_state(
    result: HybridRetrievalResult,
    structured_product_ids: list[str],
) -> AssistantGraphState:
    return {
        "structured_product_ids": structured_product_ids,
        "bm25_chunk_ids": result.bm25_chunk_ids,
        "vector_chunk_ids": result.vector_chunk_ids,
        "grounded_chunk_ids": [chunk.id for chunk in result.chunks],
        "knowledge_context": "\n\n".join(
            f"[{chunk.id}] {chunk.title}\n{chunk.content}" for chunk in result.chunks
        ),
        "used_vector": result.used_vector,
        "grounded_product_ids": [
            chunk.product_id for chunk in result.chunks if chunk.product_id is not None
        ],
    }


def _coffee_retrieval_tool(
    state: AssistantGraphState,
    runtime: Runtime[AssistantGraphContext],
) -> AssistantGraphState:
    products = _retrieve_products(runtime.context.catalog, state["raw_message"])
    product_ids = [product.id for product in products]
    result = hybrid_retrieve(
        runtime.context.session,
        state["raw_message"],
        product_ids,
        runtime.context.settings,
    )
    return _retrieval_state(result, product_ids)


def _traceability_tool(
    state: AssistantGraphState,
    runtime: Runtime[AssistantGraphContext],
) -> AssistantGraphState:
    products = _retrieve_products(runtime.context.catalog, state["raw_message"])
    result = hybrid_retrieve(
        runtime.context.session,
        state["raw_message"],
        None,
        runtime.context.settings,
    )
    return _retrieval_state(result, [product.id for product in products])


def _brew_knowledge_tool(
    state: AssistantGraphState,
    runtime: Runtime[AssistantGraphContext],
) -> AssistantGraphState:
    products = _retrieve_products(runtime.context.catalog, state["raw_message"])
    product_ids = [product.id for product in products]
    result = hybrid_retrieve(
        runtime.context.session,
        state["raw_message"],
        product_ids,
        runtime.context.settings,
    )
    return _retrieval_state(result, product_ids)


def _commerce_policy_tool(
    state: AssistantGraphState,
    runtime: Runtime[AssistantGraphContext],
) -> AssistantGraphState:
    result = hybrid_retrieve(
        runtime.context.session,
        state["raw_message"],
        [],
        runtime.context.settings,
    )
    return _retrieval_state(result, [])


def _grounding(
    state: AssistantGraphState,
    runtime: Runtime[AssistantGraphContext],
) -> AssistantGraphState:
    ordered_ids: list[str] = []
    for product_id in [
        *state.get("grounded_product_ids", []),
        *state.get("structured_product_ids", []),
    ]:
        if product_id not in ordered_ids:
            ordered_ids.append(product_id)
    grounded_products = _load_grounded_products(runtime.context.session, ordered_ids[:3])
    return {
        "grounded_product_ids": [product.id for product in grounded_products],
        "grounded_products": grounded_products,
    }


def _tool_fallback_message(state: AssistantGraphState) -> str:
    route = state["route"]
    products = state.get("grounded_products", [])
    query = state["normalized_query"]
    if route == "commerce":
        return (
            "Checkout hiện là luồng trình diễn và chỉ hỗ trợ COD. "
            "Đơn từ 499.000 ₫ được miễn phí giao hàng; đơn thấp hơn có phí 30.000 ₫. "
            "Chưa có giao dịch hoặc đơn vận chuyển thật."
        )
    if route == "brewing":
        if "phin" in query:
            return (
                "Với phin, dùng 20 g cà phê xay vừa–mịn và 80–100 ml nước; "
                "thời gian pha tham khảo 4–6 phút. TRS1 và TR4 là hai lựa chọn đậm, hợp phin."
            )
        if any(value in query for value in ("pour over", "aeropress")):
            return (
                "Với pour-over hoặc AeroPress, bắt đầu với 15–17 g cà phê, "
                "220–240 ml nước và thời gian khoảng 2–3 phút. Catimor và Bourbon "
                "phù hợp khi ưu tiên tách thanh, giàu hương."
            )
        if "drip bag" in query or "drip" in query:
            return (
                "Drip bag Catimor dùng gói 12 g với 180–200 ml nước, thời gian 2–3 phút. "
                "Đây là quy cách pha nhanh có sẵn trong catalog hiện tại."
            )
        return (
            "Mình đã tìm thấy hướng dẫn pha trong dữ liệu DẤU VỊ. "
            "Bạn hãy cho biết đang dùng phin, pour-over, AeroPress hay drip bag "
            "để nhận tỷ lệ cụ thể."
        )
    return _fallback_message(products, state["raw_message"])


async def _generate(
    state: AssistantGraphState,
    runtime: Runtime[AssistantGraphContext],
) -> AssistantGraphState:
    grounded_products = state.get("grounded_products", [])
    generated = await _generate_ai_message(
        grounded_products,
        state["raw_message"],
        runtime.context.settings,
        knowledge_context=state.get("knowledge_context", ""),
    )
    generator_used_llm = generated is not None
    return {
        "message": generated or _tool_fallback_message(state),
        "generator_used_llm": generator_used_llm,
        "used_llm": state.get("router_used_llm", False) or generator_used_llm,
    }


def _direct_response(state: AssistantGraphState) -> AssistantGraphState:
    return {
        "message": (
            "Chào bạn, mình là Coffee Assistant của DẤU VỊ. Bạn có thể hỏi về sản phẩm, "
            "mã lô, cách pha, giao hàng hoặc nhờ mình chọn cà phê theo gu và ngân sách."
        ),
        "used_vector": False,
        "used_llm": state.get("router_used_llm", False),
    }


def _scope_fallback(state: AssistantGraphState) -> AssistantGraphState:
    return {
        "message": (
            "Mình chưa có dữ liệu cho chủ đề này. Mình chỉ hỗ trợ sản phẩm DẤU VỊ, "
            "cách pha, chính sách mua hàng và hồ sơ truy xuất demo; mình sẽ không tự tạo "
            "thông tin ngoài hệ thống."
        ),
        "used_vector": False,
        "used_llm": state.get("router_used_llm", False),
    }


def _audit(
    state: AssistantGraphState,
    runtime: Runtime[AssistantGraphContext],
) -> AssistantGraphState:
    latency_ms = max(0, round((time.perf_counter() - runtime.context.started_at) * 1000))
    runtime.context.session.add(
        RetrievalLog(
            id=str(uuid.uuid4()),
            query_hash=hashlib.sha256(state["normalized_query"].encode("utf-8")).hexdigest(),
            intent=state["route"],
            result_chunk_ids=state.get("grounded_chunk_ids", []),
            result_product_ids=state.get("grounded_product_ids", []),
            used_vector=state.get("used_vector", False),
            used_llm=state.get("used_llm", False),
            latency_ms=latency_ms,
        )
    )
    runtime.context.session.commit()
    return {}


def _route_actions(
    route: AssistantRoute,
    products: list[Product],
    raw_message: str,
) -> list[AssistantActionOut]:
    if route == "commerce":
        return [
            AssistantActionOut(label="Xem giỏ hàng", href="/cart"),
            AssistantActionOut(label="Đi tới checkout", href="/checkout"),
        ]
    if route == "brewing":
        actions = [AssistantActionOut(label="Mở hướng dẫn pha", href="/brew-guide")]
        return [*actions, *_actions(products, raw_message)][:3]
    return _actions(products, raw_message)


def _build_graph():
    builder = StateGraph(AssistantGraphState, context_schema=AssistantGraphContext)
    builder.add_node("intent_router", _intent_router)
    builder.add_node("direct_response", _direct_response)
    builder.add_node("coffee_retrieval_tool", _coffee_retrieval_tool)
    builder.add_node("traceability_tool", _traceability_tool)
    builder.add_node("brew_knowledge_tool", _brew_knowledge_tool)
    builder.add_node("commerce_policy_tool", _commerce_policy_tool)
    builder.add_node("grounding", _grounding)
    builder.add_node("generate", _generate)
    builder.add_node("scope_fallback", _scope_fallback)
    builder.add_node("audit", _audit)
    builder.add_edge(START, "intent_router")
    builder.add_conditional_edges("intent_router", _route_to_tool)
    for tool_node in (
        "coffee_retrieval_tool",
        "traceability_tool",
        "brew_knowledge_tool",
        "commerce_policy_tool",
    ):
        builder.add_edge(tool_node, "grounding")
    builder.add_edge("grounding", "generate")
    builder.add_edge("generate", "audit")
    builder.add_edge("direct_response", "audit")
    builder.add_edge("scope_fallback", "audit")
    builder.add_edge("audit", END)
    return builder.compile()


ASSISTANT_GRAPH = _build_graph()


async def run_assistant_graph(
    session: Session,
    raw_message: str,
    settings: Settings,
) -> AssistantResponse:
    context = AssistantGraphContext(
        session=session,
        settings=settings,
        catalog=_load_catalog(session),
        started_at=time.perf_counter(),
    )
    final_state = await ASSISTANT_GRAPH.ainvoke(
        {"raw_message": raw_message},
        context=context,
    )
    grounded_products = final_state.get("grounded_products", [])
    return AssistantResponse(
        message=final_state["message"],
        actions=_route_actions(final_state["route"], grounded_products, raw_message),
    )

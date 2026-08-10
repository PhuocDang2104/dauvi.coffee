from __future__ import annotations

import hashlib
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
from app.schemas import AssistantResponse
from app.services.assistant import (
    _actions,
    _budget_max,
    _fallback_message,
    _generate_ai_message,
    _load_catalog,
    _normalize,
    _retrieve_products,
)
from app.services.retrieval import hybrid_retrieve

AssistantIntent = Literal[
    "greeting",
    "product-advice",
    "product-fact",
    "traceability",
    "brew-guide",
    "commerce",
    "out-of-scope",
]


class AssistantGraphState(TypedDict, total=False):
    raw_message: str
    normalized_query: str
    intent: AssistantIntent
    structured_product_ids: list[str]
    bm25_chunk_ids: list[str]
    vector_chunk_ids: list[str]
    grounded_chunk_ids: list[str]
    grounded_product_ids: list[str]
    grounded_products: list[Product]
    knowledge_context: str
    message: str
    used_vector: bool
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


def _classify_intent(query: str) -> AssistantIntent:
    if query in {"chao", "chao ban", "hello", "hi", "xin chao"}:
        return "greeting"
    if any(value in query for value in ("ma lo", "lo ", "truy xuat", "passport", "nguon goc")):
        return "traceability"
    if any(value in query for value in ("cach pha", "pha phin", "pour over", "aeropress", "drip")):
        return "brew-guide"
    if any(value in query for value in ("giao hang", "checkout", "cod", "dat hang", "phi ship")):
        return "commerce"
    if any(value in query for value in ("tu van", "chon giup", "phu hop", "nen mua")):
        return "product-advice"
    if any(value in query for value in PRODUCT_KEYWORDS):
        return "product-fact"
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


def _understand(state: AssistantGraphState) -> AssistantGraphState:
    normalized = _normalize(state["raw_message"])
    return {"normalized_query": normalized, "intent": _classify_intent(normalized)}


def _route_after_understand(
    state: AssistantGraphState,
) -> Literal["structured_retrieval", "scope_fallback"]:
    return (
        "scope_fallback"
        if state["intent"] in {"greeting", "out-of-scope"}
        else "structured_retrieval"
    )


def _structured_retrieval(
    state: AssistantGraphState,
    runtime: Runtime[AssistantGraphContext],
) -> AssistantGraphState:
    products = _retrieve_products(runtime.context.catalog, state["raw_message"])
    return {"structured_product_ids": [product.id for product in products]}


def _hybrid_retrieval(
    state: AssistantGraphState,
    runtime: Runtime[AssistantGraphContext],
) -> AssistantGraphState:
    budget = _budget_max(state["raw_message"])
    product_filter = state.get("structured_product_ids") if budget is not None else None
    result = hybrid_retrieve(
        runtime.context.session,
        state["raw_message"],
        product_filter,
        runtime.context.settings,
    )
    return {
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
    return {
        "message": generated or _fallback_message(grounded_products, state["raw_message"]),
        "used_llm": generated is not None,
    }


def _scope_fallback(state: AssistantGraphState) -> AssistantGraphState:
    if state["intent"] == "greeting":
        message = (
            "Chào bạn, mình là Coffee Assistant của DẤU VỊ. "
            "Bạn có thể hỏi về gu vị, cách pha, ngân sách hoặc mã lô của sáu sản phẩm."
        )
    else:
        message = (
            "Mình chưa có dữ liệu cho chủ đề này. Mình chỉ tư vấn sản phẩm DẤU VỊ, "
            "cách pha, mức giá và hồ sơ truy xuất demo; mình sẽ không tự tạo "
            "thông tin ngoài hệ thống."
        )
    return {"message": message, "used_llm": False, "used_vector": False}


def _audit(
    state: AssistantGraphState,
    runtime: Runtime[AssistantGraphContext],
) -> AssistantGraphState:
    latency_ms = max(0, round((time.perf_counter() - runtime.context.started_at) * 1000))
    runtime.context.session.add(
        RetrievalLog(
            id=str(uuid.uuid4()),
            query_hash=hashlib.sha256(state["normalized_query"].encode("utf-8")).hexdigest(),
            intent=state["intent"],
            result_chunk_ids=state.get("grounded_chunk_ids", []),
            result_product_ids=state.get("grounded_product_ids", []),
            used_vector=state.get("used_vector", False),
            used_llm=state.get("used_llm", False),
            latency_ms=latency_ms,
        )
    )
    runtime.context.session.commit()
    return {}


def _build_graph():
    builder = StateGraph(AssistantGraphState, context_schema=AssistantGraphContext)
    builder.add_node("understand", _understand)
    builder.add_node("structured_retrieval", _structured_retrieval)
    builder.add_node("hybrid_retrieval", _hybrid_retrieval)
    builder.add_node("grounding", _grounding)
    builder.add_node("generate", _generate)
    builder.add_node("scope_fallback", _scope_fallback)
    builder.add_node("audit", _audit)
    builder.add_edge(START, "understand")
    builder.add_conditional_edges("understand", _route_after_understand)
    builder.add_edge("structured_retrieval", "hybrid_retrieval")
    builder.add_edge("hybrid_retrieval", "grounding")
    builder.add_edge("grounding", "generate")
    builder.add_edge("generate", "audit")
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
        actions=_actions(grounded_products, raw_message),
    )

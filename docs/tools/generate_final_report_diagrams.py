from __future__ import annotations

import argparse
from pathlib import Path

import matplotlib.pyplot as plt
from matplotlib.patches import Circle, FancyArrowPatch, FancyBboxPatch


PAPER = "#FAF8F2"
FOREST = "#173629"
FOREST_2 = "#214536"
LEAF = "#4F765F"
CLAY = "#B86F45"
HONEY = "#C79648"
INK = "#1B211D"
MUTED = "#5B625D"
SAND = "#DCCDB7"
WHITE = "#FFFFFF"
BLUE = "#426A78"


def canvas(title: str, kicker: str):
    figure, axis = plt.subplots(figsize=(16, 9), dpi=180)
    figure.patch.set_facecolor(PAPER)
    axis.set_facecolor(PAPER)
    axis.set_xlim(0, 16)
    axis.set_ylim(0, 9)
    axis.axis("off")
    axis.text(0.7, 8.5, kicker.upper(), color=CLAY, fontsize=10, weight="bold")
    axis.text(0.7, 7.95, title, color=FOREST, fontsize=23, weight="bold")
    axis.plot([0.7, 15.3], [7.55, 7.55], color=SAND, linewidth=1)
    return figure, axis


def box(
    axis,
    x: float,
    y: float,
    width: float,
    height: float,
    title: str,
    body: str = "",
    *,
    fill: str = WHITE,
    edge: str = SAND,
    title_color: str = FOREST,
    dashed: bool = False,
    fontsize: float = 10.5,
):
    axis.add_patch(
        FancyBboxPatch(
            (x, y),
            width,
            height,
            boxstyle="round,pad=0.035,rounding_size=0.14",
            facecolor=fill,
            edgecolor=edge,
            linewidth=1.4,
            linestyle="--" if dashed else "-",
        )
    )
    axis.text(
        x + 0.23,
        y + height - 0.28,
        title,
        va="top",
        color=title_color,
        fontsize=fontsize,
        weight="bold",
    )
    if body:
        axis.text(
            x + 0.23,
            y + height - 0.75,
            body,
            va="top",
            color="#DDE8E1" if fill in {FOREST, FOREST_2} else MUTED,
            fontsize=8.4,
            linespacing=1.35,
        )


def arrow(axis, start, end, label: str = "", *, color: str = LEAF, dashed=False):
    axis.add_patch(
        FancyArrowPatch(
            start,
            end,
            arrowstyle="-|>",
            mutation_scale=13,
            linewidth=1.6,
            color=color,
            linestyle="--" if dashed else "-",
            shrinkA=2,
            shrinkB=2,
        )
    )
    if label:
        axis.text(
            (start[0] + end[0]) / 2,
            (start[1] + end[1]) / 2 + 0.18,
            label,
            ha="center",
            va="center",
            fontsize=7.8,
            color=MUTED,
            bbox={"facecolor": PAPER, "edgecolor": "none", "pad": 1.5},
        )


def save(figure, output_dir: Path, name: str):
    output_dir.mkdir(parents=True, exist_ok=True)
    figure.savefig(output_dir / f"{name}.png", dpi=200, bbox_inches="tight", facecolor=PAPER)
    plt.close(figure)


def use_case(output_dir: Path):
    fig, ax = canvas("Biểu đồ Use Case tổng quát", "DẤU VỊ · Phạm vi chức năng")
    actors = [(1.15, 6.25, "Guest"), (1.15, 3.95, "Customer"), (1.15, 1.65, "Admin\n(mở rộng)")]
    for x, y, label in actors:
        ax.add_patch(Circle((x, y + 0.42), 0.22, facecolor=FOREST, edgecolor="none"))
        ax.plot([x, x], [y + 0.2, y - 0.38], color=FOREST, linewidth=1.6)
        ax.plot([x - 0.28, x + 0.28], [y - 0.02, y - 0.02], color=FOREST, linewidth=1.5)
        ax.plot([x, x - 0.25], [y - 0.38, y - 0.72], color=FOREST, linewidth=1.5)
        ax.plot([x, x + 0.25], [y - 0.38, y - 0.72], color=FOREST, linewidth=1.5)
        ax.text(x, y - 1.05, label, ha="center", color=FOREST, fontsize=9.5, weight="bold")

    guest_cases = [
        (3.0, 6.45, "Xem / tìm kiếm / lọc"),
        (6.0, 6.45, "Xem sản phẩm & truy xuất"),
        (9.0, 6.45, "Đăng ký / đăng nhập"),
        (12.0, 6.45, "Chatbot & Advisor"),
    ]
    customer_cases = [
        (3.0, 4.0, "Quản lý giỏ hàng"),
        (6.0, 4.0, "Đặt đơn COD demo"),
        (9.0, 4.0, "Quản lý phiên"),
    ]
    admin_cases = [
        (3.0, 1.55, "Quản lý sản phẩm"),
        (6.0, 1.55, "Quản lý đơn hàng"),
        (9.0, 1.55, "Quản lý Knowledge Base"),
    ]
    for x, y, label in guest_cases:
        box(ax, x, y, 2.45, 0.82, label, fontsize=9)
        arrow(ax, (1.55, 6.32), (x, y + 0.4), color=SAND)
    for x, y, label in customer_cases:
        box(ax, x, y, 2.45, 0.82, label, fill="#EDF3EF", edge=LEAF, fontsize=9)
        arrow(ax, (1.55, 4.05), (x, y + 0.4), color=LEAF)
    for x, y, label in admin_cases:
        box(ax, x, y, 2.45, 0.82, label, fill="#F5EFE5", edge=HONEY, dashed=True, fontsize=9)
        arrow(ax, (1.55, 1.75), (x, y + 0.4), color=HONEY, dashed=True)
    box(
        ax,
        12.0,
        2.0,
        3.2,
        2.75,
        "Phạm vi hiện thực",
        "Guest + Customer: đã triển khai.\nAdmin: use case thiết kế mở rộng;\nchưa mở API quản trị ở bản demo.\n\nChatbot chỉ trả dữ liệu catalog\nvà knowledge chunks đã grounding.",
        fill=FOREST,
        edge=FOREST,
        title_color=WHITE,
        fontsize=10,
    )
    save(fig, output_dir, "06-use-case-overview")


def architecture(output_dir: Path):
    fig, ax = canvas("Kiến trúc tổng thể và tích hợp AI", "DẤU VỊ · Production architecture")
    box(ax, 0.7, 3.1, 2.0, 2.35, "Web Browser", "Next.js UI\nCart persist\nHttpOnly session", fill=WHITE)
    box(ax, 3.45, 4.7, 2.25, 1.55, "Vercel", "Next.js 16\n/backend-api rewrite", fill="#EDF3EF")
    box(ax, 3.45, 1.55, 2.25, 1.55, "Caddy + DuckDNS", "TLS / HTTPS\nreverse_proxy", fill="#F5EFE5")
    box(
        ax,
        6.7,
        2.65,
        2.55,
        3.15,
        "FastAPI",
        "REST API\nAuth / Orders\nLangGraph orchestration\nGrounding guard",
        fill=FOREST,
        edge=FOREST,
        title_color=WHITE,
    )
    box(ax, 10.25, 5.75, 2.25, 1.35, "FastEmbed", "Multilingual MiniLM\nvector 384 chiều", fill="#EAF1F3", edge=BLUE)
    box(ax, 10.25, 2.35, 2.25, 1.55, "PostgreSQL 17", "Catalog · auth · orders\npgvector + HNSW", fill="#F1E8D8", edge=HONEY)
    box(ax, 13.25, 4.25, 2.05, 1.55, "Groq API", "Semantic router\nGrounded response", fill="#F5EFE5", edge=CLAY)
    box(ax, 13.25, 1.65, 2.05, 1.55, "Knowledge Base", "8 documents\n24 chunks", fill="#EDF3EF", edge=LEAF)
    arrow(ax, (2.7, 4.6), (3.45, 5.45), "HTTPS")
    arrow(ax, (2.7, 3.75), (3.45, 2.35), "same-origin")
    arrow(ax, (5.7, 5.45), (6.7, 4.85), "REST")
    arrow(ax, (5.7, 2.35), (6.7, 3.45), "proxy")
    arrow(ax, (9.25, 5.2), (10.25, 6.35), "embed")
    arrow(ax, (9.25, 3.55), (10.25, 3.15), "SQL")
    arrow(ax, (9.25, 4.75), (13.25, 5.0), "bounded context")
    arrow(ax, (12.5, 2.8), (13.25, 2.45), "stored chunks")
    ax.text(0.75, 0.6, "Public edge", color=CLAY, fontsize=9, weight="bold")
    ax.plot([2.0, 5.7], [0.67, 0.67], color=CLAY, linewidth=2)
    ax.text(6.7, 0.6, "VNPT Cloud · Docker networks", color=FOREST, fontsize=9, weight="bold")
    ax.plot([9.2, 15.25], [0.67, 0.67], color=FOREST, linewidth=2)
    save(fig, output_dir, "07-system-architecture-rag")


def sequence_diagram(output_dir: Path, name: str, title: str, actors: list[str], steps: list[tuple[int, int, str]], note: str = ""):
    fig, ax = canvas(title, "DẤU VỊ · Sequence diagram")
    xs = [1.25 + i * (13.5 / max(1, len(actors) - 1)) for i in range(len(actors))]
    for x, actor in zip(xs, actors):
        box(ax, x - 0.8, 6.55, 1.6, 0.62, actor, fill=FOREST, edge=FOREST, title_color=WHITE, fontsize=8.5)
        ax.plot([x, x], [1.25, 6.55], color=SAND, linewidth=1.1, linestyle=(0, (4, 4)))
    start_y = 5.95
    gap = 0.68 if len(steps) <= 7 else (0.48 if len(steps) > 9 else 0.56)
    for index, (source, target, label) in enumerate(steps, 1):
        y = start_y - (index - 1) * gap
        color = LEAF if target >= source else HONEY
        arrow(ax, (xs[source], y), (xs[target], y), color=color)
        ax.text((xs[source] + xs[target]) / 2, y + 0.12, f"{index}. {label}", ha="center", fontsize=7.5, color=INK)
    if note:
        box(ax, 1.0, 0.35, 14.0, 0.65, "Ghi chú", note, fill="#F3EEE4", edge=SAND, fontsize=8.6)
    save(fig, output_dir, name)


def sequences(output_dir: Path):
    sequence_diagram(
        output_dir,
        "08-login-sequence",
        "Sequence đăng ký và đăng nhập",
        ["User", "Next.js", "FastAPI", "Auth service", "PostgreSQL"],
        [
            (0, 1, "Gửi form đã validate"),
            (1, 2, "POST /auth/register hoặc /login"),
            (2, 3, "Kiểm tra Origin + rate limit"),
            (3, 4, "Tìm email / Argon2id verify"),
            (4, 3, "User và trạng thái phiên"),
            (3, 4, "Rotate session token đã băm"),
            (2, 1, "Set-Cookie HttpOnly; Secure"),
            (1, 0, "Hiển thị phiên đăng nhập"),
        ],
        "Frontend không lưu access token trong localStorage; session token chỉ đi qua cookie HttpOnly.",
    )
    sequence_diagram(
        output_dir,
        "09-order-sequence",
        "Sequence tạo đơn hàng COD demo",
        ["Customer", "Next.js", "FastAPI", "Order service", "PostgreSQL"],
        [
            (0, 1, "Xác nhận giỏ và địa chỉ"),
            (1, 2, "POST /orders + Idempotency-Key"),
            (2, 3, "Validate payload"),
            (3, 4, "Đọc product/variant/giá server"),
            (4, 3, "Catalog hiện hành"),
            (3, 4, "Transaction order + item snapshots"),
            (4, 3, "Commit / mã đơn"),
            (2, 1, "201 + tổng tiền server-side"),
        ],
        "Không nhận dữ liệu thẻ; không tin giá frontend; key lặp trả lại cùng đơn thay vì ghi trùng.",
    )
    sequence_diagram(
        output_dir,
        "10-chatbot-sequence",
        "Sequence chatbot hybrid RAG",
        ["User", "Chat UI", "FastAPI", "LangGraph", "Postgres/pgvector", "Groq"],
        [
            (0, 1, "Nhập câu hỏi"),
            (1, 2, "POST /assistant/messages"),
            (2, 3, "Khởi chạy graph"),
            (3, 5, "Route-only request có schema enum"),
            (5, 3, "Một route hoặc router fallback"),
            (3, 4, "Chỉ gọi tool node đã chọn"),
            (4, 3, "Structured/BM25/vector + RRF"),
            (3, 5, "Bounded context sau grounding"),
            (5, 3, "Grounded answer hoặc fallback"),
            (3, 4, "Ghi route/chunk/product audit"),
            (3, 2, "AssistantResponse"),
            (2, 1, "Message + action route thật"),
        ],
        "Greeting/out-of-scope không retrieve. Groq router lỗi: deterministic router tiếp quản.",
    )
    sequence_diagram(
        output_dir,
        "11-admin-sequence-target",
        "Sequence quản trị sản phẩm (thiết kế mở rộng)",
        ["Admin", "Admin UI", "FastAPI", "RBAC", "PostgreSQL"],
        [
            (0, 1, "Nhập dữ liệu sản phẩm"),
            (1, 2, "POST/PATCH /admin/products"),
            (2, 3, "Xác thực session + role ADMIN"),
            (3, 4, "Transaction catalog"),
            (4, 3, "Product ID đã cập nhật"),
            (3, 4, "Re-index knowledge chunks"),
            (2, 1, "Kết quả + audit ID"),
        ],
        "Sơ đồ là thiết kế cho giai đoạn tiếp theo; API Admin chưa được mở trong bản demo hiện tại.",
    )


def langgraph_workflow(output_dir: Path):
    fig, ax = canvas("Semantic router và các tool node LangGraph", "DẤU VỊ · Agentic RAG workflow")
    box(ax, 6.35, 6.05, 3.3, 1.15, "Groq Semantic Intent Router", "Structured enum · đúng một route\nDeterministic fallback khi lỗi", fill=FOREST, edge=FOREST, title_color=WHITE, fontsize=10)
    alternatives = [
        (0.35, "Greeting", "Direct response\nKhông retrieval", CLAY),
        (2.95, "Coffee / Product", "Coffee Retrieval Tool", LEAF),
        (5.55, "Lot code", "Traceability Tool", BLUE),
        (8.15, "Brewing", "Brew Knowledge Tool", HONEY),
        (10.75, "Commerce", "Commerce Policy Tool", CLAY),
        (13.35, "Out of scope", "Controlled refusal\nKhông retrieval", FOREST),
    ]
    for x, title, body, color in alternatives:
        box(ax, x, 4.15, 2.25, 1.15, title, body, fill=WHITE, edge=color, fontsize=8.6)
        arrow(ax, (8.0, 6.05), (x + 1.12, 5.3), color=color)

    box(ax, 4.0, 1.85, 2.35, 1.2, "Grounding", "Published IDs\nTop 6 chunks / 3 products", fill="#F1E8D8", edge=HONEY, fontsize=9)
    box(ax, 7.0, 1.85, 2.35, 1.2, "Generate", "Groq + bounded context\nhoặc deterministic fallback", fill="#F5EFE5", edge=CLAY, fontsize=9)
    box(ax, 10.0, 1.85, 2.35, 1.2, "Audit + Output", "query hash · route · IDs\nmessage + action route thật", fill="#EDF3EF", edge=LEAF, fontsize=9)
    for x in (2.95, 5.55, 8.15, 10.75):
        arrow(ax, (x + 1.12, 4.15), (5.18, 3.05), color=LEAF)
    arrow(ax, (6.35, 2.45), (7.0, 2.45), "bounded", color=HONEY)
    arrow(ax, (9.35, 2.45), (10.0, 2.45), "audit", color=LEAF)
    arrow(ax, (1.47, 4.15), (10.5, 3.05), "direct", color=CLAY)
    arrow(ax, (14.47, 4.15), (11.8, 3.05), "refuse", color=FOREST)
    ax.text(0.8, 0.65, "Điều kiện bất biến", color=CLAY, fontsize=9, weight="bold")
    ax.text(
        2.55,
        0.65,
        "Chỉ tool node được router chọn mới chạy; câu trả lời chỉ dùng catalog và chunks đã grounding.",
        color=INK,
        fontsize=9,
    )
    save(fig, output_dir, "12-langgraph-workflow")


def erd(output_dir: Path):
    fig, ax = canvas("ERD rút gọn của schema đã triển khai", "DẤU VỊ · PostgreSQL + pgvector")
    entities = [
        (0.7, 5.45, "products", "PK id · UQ slug\nspecies · region · flavor\npublished"),
        (3.65, 5.45, "product_variants", "PK id · FK product_id\nSKU · format · price\nin_stock"),
        (6.6, 5.45, "coffee_lots", "PK lot_code · FK product_id\norigin · process · dates\nevidence_level"),
        (9.55, 5.45, "users / sessions", "UQ email\nArgon2id password_hash\nsession token_hash"),
        (12.5, 5.45, "orders / items", "UQ order_code/idempotency\nvariant snapshots\nserver-side totals"),
        (0.7, 2.35, "knowledge_documents", "PK id · title\nsource_type · content_hash\npublished"),
        (4.2, 2.35, "knowledge_chunks", "FK document/product/lot\ncontent · metadata\nvector(384) + HNSW"),
        (8.2, 2.35, "retrieval_logs", "query_hash · intent\nchunk/product IDs\nlatency · vector/LLM"),
        (11.7, 2.35, "supporting tables", "evidence_items\nlot_timeline_events\nauth_attempts\nassistant_requests"),
    ]
    for i, (x, y, title, body) in enumerate(entities):
        color = [FOREST, CLAY, LEAF, BLUE, HONEY][i % 5]
        box(ax, x, y, 2.55 if y > 3 else 3.0, 1.45, title, body, fill=WHITE, edge=color, fontsize=9.1)
    arrow(ax, (3.25, 6.15), (3.65, 6.15), "1:N", color=CLAY)
    arrow(ax, (3.25, 5.7), (6.6, 5.7), "1:N", color=LEAF)
    arrow(ax, (12.1, 6.15), (12.5, 6.15), "0:N", color=HONEY)
    arrow(ax, (2.0, 5.45), (2.0, 3.8), "1:N", color=FOREST)
    arrow(ax, (3.7, 3.05), (4.2, 3.05), "1:N", color=BLUE)
    arrow(ax, (7.2, 3.05), (8.2, 3.05), "audit", color=LEAF)
    arrow(ax, (7.9, 5.45), (6.7, 3.8), "lot FK", color=LEAF)
    ax.text(0.75, 0.63, "Migration Alembic 20260810_0004 bật extension vector và tạo HNSW cosine index.", color=MUTED, fontsize=9)
    save(fig, output_dir, "13-current-erd-pgvector")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=Path("docs/report-assets/diagrams"),
    )
    args = parser.parse_args()
    use_case(args.output_dir)
    architecture(args.output_dir)
    sequences(args.output_dir)
    langgraph_workflow(args.output_dir)
    erd(args.output_dir)


if __name__ == "__main__":
    main()

from __future__ import annotations

import argparse
from pathlib import Path

import matplotlib.pyplot as plt
from matplotlib.patches import Circle, FancyArrowPatch, FancyBboxPatch


PAPER = "#FFFFFF"
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


def canvas(_title: str = "", _kicker: str = ""):
    figure, axis = plt.subplots(figsize=(9, 5.0625), dpi=222)
    figure.subplots_adjust(left=0, right=1, bottom=0, top=1)
    figure.patch.set_facecolor(WHITE)
    axis.set_facecolor(WHITE)
    axis.set_xlim(0, 16)
    axis.set_ylim(0, 9)
    axis.axis("off")
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
    fontsize: float = 12,
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
            fontsize=max(9.4, fontsize - 1.8),
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
            fontsize=9.4,
            color=MUTED,
            bbox={"facecolor": WHITE, "edgecolor": "none", "pad": 1.5},
        )


def save(figure, output_dir: Path, name: str):
    output_dir.mkdir(parents=True, exist_ok=True)
    figure.savefig(output_dir / f"{name}.png", dpi=222, facecolor=WHITE)
    plt.close(figure)


def use_case(output_dir: Path):
    fig, ax = canvas()
    lanes = [
        (
            6.05,
            "Guest",
            "Public use cases",
            "Xem catalog · Tìm kiếm/lọc · Xem chi tiết và passport\nĐăng ký/đăng nhập · Chatbot và Coffee Advisor",
            WHITE,
            SAND,
            False,
        ),
        (
            3.68,
            "Customer",
            "Customer use cases",
            "Kế thừa Guest · Quản lý giỏ hàng · Đặt đơn COD demo\nQuản lý hồ sơ phiên đăng nhập",
            "#EDF3EF",
            LEAF,
            False,
        ),
        (
            1.30,
            "Admin",
            "Admin use cases · thiết kế mở rộng",
            "Quản lý sản phẩm · Quản lý đơn hàng\nQuản lý Knowledge Base và re-index",
            "#F5EFE5",
            HONEY,
            True,
        ),
    ]
    for y, actor, title, body, fill, edge, dashed in lanes:
        box(
            ax,
            0.45,
            y,
            1.90,
            1.55,
            actor,
            "Tác nhân" if actor != "Admin" else "Mở rộng",
            fill=FOREST if actor != "Admin" else "#F5EFE5",
            edge=FOREST if actor != "Admin" else HONEY,
            title_color=WHITE if actor != "Admin" else FOREST,
            dashed=dashed,
            fontsize=11.5,
        )
        box(ax, 2.85, y, 8.85, 1.55, title, body, fill=fill, edge=edge, dashed=dashed, fontsize=13)
        arrow(ax, (2.35, y + 0.77), (2.85, y + 0.77), color=edge, dashed=dashed)
    box(
        ax,
        12.10,
        1.30,
        3.35,
        6.30,
        "Phạm vi",
        "ĐÃ TRIỂN KHAI\nGuest · Customer\n\nMỞ RỘNG\nAdmin UI/API/RBAC\n\nAI GROUNDED\nCatalog · lot\nKnowledge chunks\nđã được kiểm tra.",
        fill=FOREST,
        edge=FOREST,
        title_color=WHITE,
        fontsize=11.5,
    )
    save(fig, output_dir, "06-use-case-overview")


def architecture(output_dir: Path):
    fig, ax = canvas()
    box(ax, 0.45, 3.15, 2.15, 2.55, "Web Browser", "Next.js UI\nCart persistence\nHttpOnly session", fill=WHITE, fontsize=11.5)
    box(ax, 3.25, 5.25, 2.35, 1.75, "Vercel", "Next.js 16\nAPI rewrite", fill="#EDF3EF", fontsize=11.5)
    box(ax, 3.25, 1.25, 2.35, 1.75, "Caddy", "DuckDNS · TLS\nreverse_proxy", fill="#F5EFE5", fontsize=11.5)
    box(
        ax,
        6.55,
        2.65,
        2.75,
        3.45,
        "FastAPI",
        "REST API\nAuth / Orders\nLangGraph\norchestration\nGrounding guard",
        fill=FOREST,
        edge=FOREST,
        title_color=WHITE,
        fontsize=11.5,
    )
    box(ax, 10.05, 6.15, 2.45, 1.55, "FastEmbed", "MiniLM\n384 dimensions", fill="#EAF1F3", edge=BLUE, fontsize=11.5)
    box(ax, 10.05, 2.65, 2.45, 1.75, "PostgreSQL 17", "Catalog · auth\npgvector · HNSW", fill="#F1E8D8", edge=HONEY, fontsize=11.5)
    box(ax, 13.15, 4.65, 2.35, 1.75, "Groq API", "Intent router\nGrounded output", fill="#F5EFE5", edge=CLAY, fontsize=11.5)
    box(ax, 13.15, 1.20, 2.35, 1.75, "Knowledge", "8 documents\n24 chunks", fill="#EDF3EF", edge=LEAF, fontsize=11.5)
    arrow(ax, (2.6, 4.75), (3.25, 6.05), "HTTPS")
    arrow(ax, (2.6, 4.0), (3.25, 2.05), "same-origin")
    arrow(ax, (5.6, 6.05), (6.55, 5.05), "REST")
    arrow(ax, (5.6, 2.05), (6.55, 3.55), "proxy")
    arrow(ax, (9.3, 5.45), (10.05, 6.85), "embed")
    arrow(ax, (9.3, 3.65), (10.05, 3.5), "SQL")
    arrow(ax, (9.3, 5.1), (13.15, 5.5), "bounded context")
    arrow(ax, (12.5, 3.05), (13.15, 2.05), "stored chunks")
    ax.text(0.55, 0.55, "Public edge", color=CLAY, fontsize=11, weight="bold")
    ax.plot([2.0, 5.7], [0.30, 0.30], color=CLAY, linewidth=2)
    ax.text(6.55, 0.55, "VNPT Cloud · Docker networks", color=FOREST, fontsize=11, weight="bold")
    ax.plot([9.2, 15.25], [0.30, 0.30], color=FOREST, linewidth=2)
    save(fig, output_dir, "07-system-architecture-rag")


def sequence_diagram(output_dir: Path, name: str, title: str, actors: list[str], steps: list[tuple[int, int, str]], note: str = ""):
    fig, ax = canvas()
    xs = [1.15 + i * (13.7 / max(1, len(actors) - 1)) for i in range(len(actors))]
    for x, actor in zip(xs, actors):
        box(ax, x - 0.92, 7.75, 1.84, 0.78, actor, fill=FOREST, edge=FOREST, title_color=WHITE, fontsize=10.5)
        ax.plot([x, x], [1.25, 7.75], color=SAND, linewidth=1.2, linestyle=(0, (4, 4)))
    start_y = 7.05
    gap = min(0.68, 5.55 / max(1, len(steps) - 1))
    for index, (source, target, label) in enumerate(steps, 1):
        y = start_y - (index - 1) * gap
        color = LEAF if target >= source else HONEY
        arrow(ax, (xs[source], y), (xs[target], y), color=color)
        step_font = 11.8 if len(steps) > 9 else 12.2
        ax.text((xs[source] + xs[target]) / 2, y + 0.12, f"{index}. {label}", ha="center", fontsize=step_font, color=INK)
    if note:
        ax.add_patch(
            FancyBboxPatch(
                (0.75, 0.18),
                14.0,
                0.84,
                boxstyle="round,pad=0.035,rounding_size=0.14",
                facecolor="#F3EEE4",
                edgecolor=SAND,
                linewidth=1.3,
            )
        )
        ax.text(1.0, 0.60, "Ghi chú", va="center", color=FOREST, fontsize=10.2, weight="bold")
        ax.text(2.25, 0.60, note, va="center", color=MUTED, fontsize=10.8)
    save(fig, output_dir, name)


def sequences(output_dir: Path):
    sequence_diagram(
        output_dir,
        "08-login-sequence",
        "Sequence đăng ký và đăng nhập",
        ["User", "Next.js", "FastAPI", "Auth", "Postgres"],
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
        ["Customer", "Next.js", "FastAPI", "Order", "Postgres"],
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
        ["User", "Chat UI", "FastAPI", "LangGraph", "Postgres", "Groq"],
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
        ["Admin", "Admin UI", "FastAPI", "RBAC", "Postgres"],
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
    fig, ax = canvas()
    box(
        ax,
        5.75,
        7.35,
        4.5,
        1.05,
        "Groq Intent Router",
        "Enum route · fallback",
        fill=FOREST,
        edge=FOREST,
        title_color=WHITE,
        fontsize=12.5,
    )
    box(ax, 0.55, 5.10, 2.4, 1.45, "Greeting", "Direct + audit\nNo retrieval", fill=WHITE, edge=CLAY, fontsize=10.5)
    box(ax, 13.05, 5.10, 2.4, 1.45, "Out of scope", "Refusal + audit\nNo retrieval", fill=WHITE, edge=FOREST, fontsize=10.5)
    ax.add_patch(
        FancyBboxPatch(
            (3.35, 4.55),
            8.9,
            2.15,
            boxstyle="round,pad=0.04,rounding_size=0.16",
            facecolor="#EDF3EF",
            edgecolor=LEAF,
            linewidth=1.5,
        )
    )
    ax.text(3.62, 6.35, "Tool layer · chỉ một node được chạy", color=FOREST, fontsize=11, weight="bold")
    tools = [
        (3.62, "Coffee", "Retrieval"),
        (5.73, "Traceability", "Lot lookup"),
        (7.84, "Brewing", "Brew guide"),
        (9.95, "Commerce", "Policy"),
    ]
    for x, title, body in tools:
        box(ax, x, 4.88, 1.9, 1.10, title, body, fill=WHITE, edge=LEAF, fontsize=9.4)
    arrow(ax, (7.15, 7.35), (1.75, 6.55), "greeting", color=CLAY)
    arrow(ax, (8.0, 7.35), (8.0, 6.70), "4 intents", color=LEAF)
    arrow(ax, (8.85, 7.35), (14.25, 6.55), "out-of-scope", color=FOREST)

    stages = [
        (1.45, "Hybrid Retrieval", "Structured + BM25\npgvector + RRF", BLUE),
        (4.75, "Grounding", "Published IDs\n6 chunks\n3 products", HONEY),
        (8.05, "Generate", "Bounded context\nfallback", CLAY),
        (11.35, "Audit + Output", "route · IDs · latency\naction route", LEAF),
    ]
    for x, title, body, color in stages:
        box(ax, x, 1.65, 2.8, 1.55, title, body, fill=WHITE, edge=color, fontsize=10.5)
    arrow(ax, (8.0, 4.55), (2.85, 3.2), "selected tool", color=LEAF)
    arrow(ax, (4.25, 2.42), (4.75, 2.42), color=BLUE)
    arrow(ax, (7.55, 2.42), (8.05, 2.42), "bounded", color=HONEY)
    arrow(ax, (10.85, 2.42), (11.35, 2.42), "audit", color=LEAF)
    ax.text(0.65, 0.55, "Bất biến:", color=CLAY, fontsize=10.5, weight="bold")
    ax.text(
        2.40,
        0.55,
        "Chỉ chạy node đã chọn; phản hồi chỉ dùng dữ liệu đã grounding.",
        color=INK,
        fontsize=10,
    )
    save(fig, output_dir, "12-langgraph-workflow")


def erd(output_dir: Path):
    fig, ax = canvas()
    clusters = [
        (0.45, 4.75, 7.35, 3.55, "CATALOG & TRACEABILITY"),
        (8.1, 4.75, 7.45, 3.55, "IDENTITY & COMMERCE"),
        (0.45, 0.75, 15.1, 3.45, "RAG & OBSERVABILITY"),
    ]
    for x, y, width, height, label in clusters:
        ax.add_patch(
            FancyBboxPatch(
                (x, y),
                width,
                height,
                boxstyle="round,pad=0.04,rounding_size=0.14",
                facecolor="#F7F4EC",
                edgecolor=SAND,
                linewidth=1.2,
            )
        )
        ax.text(x + 0.2, y + height - 0.26, label, color=CLAY, fontsize=10.5, weight="bold", va="top")

    top_entities = [
        (0.75, "products", "PK id · UQ slug\nspecies · region\nflavor"),
        (3.15, "variants", "FK product_id\nUQ SKU · price\nformat · stock"),
        (5.55, "lots", "PK lot_code\nFK product_id\norigin · process"),
        (8.4, "auth", "users · sessions\nArgon2id\nsession hash"),
        (10.85, "orders", "items · UQ code\nidempotency\nsnapshots"),
        (13.30, "support", "auth_attempts\nassistant\nrequests"),
    ]
    for i, (x, title, body) in enumerate(top_entities):
        color = [FOREST, CLAY, LEAF, BLUE, HONEY, BLUE][i]
        box(ax, x, 5.35, 2.05, 2.15, title, body, fill=WHITE, edge=color, fontsize=10.5)
    arrow(ax, (2.8, 5.72), (3.15, 5.72), "1:N", color=CLAY)
    arrow(ax, (5.2, 5.72), (5.55, 5.72), "1:N", color=LEAF)
    arrow(ax, (10.45, 5.72), (10.85, 5.72), "0:N", color=HONEY)

    rag_entities = [
        (0.75, "documents", "PK id · source\ncontent_hash\npublished"),
        (4.45, "chunks", "FK document\nproduct · lot\nvector(384) · HNSW"),
        (8.15, "retrieval logs", "query_hash · route\nIDs · latency\nvector · LLM"),
        (11.85, "trace evidence", "evidence_items\nlot_timeline\nevents"),
    ]
    for i, (x, title, body) in enumerate(rag_entities):
        color = [FOREST, CLAY, LEAF, BLUE][i]
        box(ax, x, 1.35, 2.95, 2.00, title, body, fill=WHITE, edge=color, fontsize=10.5)
    arrow(ax, (3.7, 2.35), (4.45, 2.35), "1:N", color=CLAY)
    arrow(ax, (7.4, 2.35), (8.15, 2.35), "audit", color=LEAF)
    ax.text(0.65, 0.35, "Alembic 20260810_0004 bật extension vector và tạo HNSW cosine index.", color=MUTED, fontsize=10.5)
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

from __future__ import annotations

import argparse
from pathlib import Path

import matplotlib.pyplot as plt
from matplotlib.patches import Circle, Ellipse, FancyArrowPatch, FancyBboxPatch


PAPER = "#FAF8F2"
PAPER_DARK = "#F1EBDD"
FOREST = "#173629"
FOREST_2 = "#214536"
LEAF = "#3F6B52"
CLAY = "#B86F45"
HONEY = "#C79648"
BERRY = "#9B4F58"
INK = "#181A18"
INK_2 = "#454944"
SAND = "#DCCDB7"
WHITE = "#FFFFFF"


def canvas(title: str, kicker: str):
    figure, axis = plt.subplots(figsize=(16, 9), dpi=180)
    figure.patch.set_facecolor(PAPER)
    axis.set_facecolor(PAPER)
    axis.set_xlim(0, 16)
    axis.set_ylim(0, 9)
    axis.axis("off")
    for width, height, alpha in [(8.0, 3.2, 0.36), (9.6, 4.0, 0.28), (11.2, 4.8, 0.2)]:
        axis.add_patch(
            Ellipse(
                (14.8, 8.2),
                width,
                height,
                angle=-18,
                fill=False,
                edgecolor=SAND,
                linewidth=1.1,
                alpha=alpha,
            )
        )
    axis.text(0.75, 8.45, kicker.upper(), color=CLAY, fontsize=10, weight="bold", family="DejaVu Sans")
    axis.text(0.75, 7.92, title, color=FOREST, fontsize=24, weight="bold", family="DejaVu Sans")
    axis.plot([0.75, 15.25], [7.55, 7.55], color=SAND, linewidth=1)
    return figure, axis


def node(
    axis,
    x: float,
    y: float,
    width: float,
    height: float,
    title: str,
    subtitle: str = "",
    *,
    color: str = WHITE,
    edge: str = SAND,
    title_color: str = FOREST,
    number: str | None = None,
    fontsize: float = 12,
):
    axis.add_patch(
        FancyBboxPatch(
            (x, y),
            width,
            height,
            boxstyle="round,pad=0.03,rounding_size=0.16",
            facecolor=color,
            edgecolor=edge,
            linewidth=1.4,
        )
    )
    text_x = x + 0.28
    if number:
        axis.add_patch(Circle((x + 0.34, y + height - 0.34), 0.18, facecolor=CLAY, edgecolor="none"))
        axis.text(
            x + 0.34,
            y + height - 0.35,
            number,
            ha="center",
            va="center",
            color=WHITE,
            fontsize=8,
            weight="bold",
        )
        text_x = x + 0.65
    axis.text(
        text_x,
        y + height - 0.34,
        title,
        va="top",
        color=title_color,
        fontsize=fontsize,
        weight="bold",
        family="DejaVu Sans",
    )
    if subtitle:
        subtitle_color = "#D7E5DB" if color in {FOREST, FOREST_2} else INK_2
        axis.text(
            x + 0.28,
            y + height - 0.78,
            subtitle,
            va="top",
            color=subtitle_color,
            fontsize=9.2,
            linespacing=1.45,
            family="DejaVu Sans",
        )


def arrow(axis, start, end, *, color=LEAF, label: str | None = None, curve: float = 0.0, width=1.8):
    axis.add_patch(
        FancyArrowPatch(
            start,
            end,
            arrowstyle="-|>",
            mutation_scale=13,
            linewidth=width,
            color=color,
            connectionstyle=f"arc3,rad={curve}",
            shrinkA=2,
            shrinkB=2,
        )
    )
    if label:
        x = (start[0] + end[0]) / 2
        y = (start[1] + end[1]) / 2 + (0.22 if curve >= 0 else -0.22)
        axis.text(
            x,
            y,
            label,
            ha="center",
            va="center",
            color=INK_2,
            fontsize=8.4,
            bbox={"facecolor": PAPER, "edgecolor": "none", "pad": 2},
        )


def save(figure, output_dir: Path, stem: str):
    output_dir.mkdir(parents=True, exist_ok=True)
    figure.savefig(output_dir / f"{stem}.png", dpi=200, bbox_inches="tight", facecolor=PAPER)
    figure.savefig(output_dir / f"{stem}.svg", bbox_inches="tight", facecolor=PAPER)
    plt.close(figure)


def architecture(output_dir: Path):
    fig, ax = canvas("Kiến trúc triển khai và luồng dữ liệu", "DẤU VỊ · System architecture")
    node(ax, 0.8, 3.25, 2.25, 2.25, "Trình duyệt", "UI responsive\nCart localStorage\nCheckout client", color=WHITE, number="1")
    node(ax, 4.0, 4.6, 2.65, 1.75, "Vercel / Next.js", "Server Components\nHTTP repositories", color="#F5F0E6", number="2")
    node(ax, 4.0, 1.45, 2.65, 1.75, "DuckDNS + Caddy", "TLS termination\nReverse proxy", color="#F5F0E6", number="3")
    node(ax, 8.0, 2.75, 3.0, 2.4, "FastAPI backend", "Catalog · Traceability\nAdvisor · Demo orders\nAlembic + seed", color=FOREST, edge=FOREST, title_color=WHITE, number="4")
    ax.text(8.3, 3.05, "Docker container · 127.0.0.1:8000", color="#D7E5DB", fontsize=8.6)
    node(ax, 12.35, 2.75, 2.8, 2.4, "PostgreSQL 17", "Products / variants\nLots / evidence\nOrders / items", color="#EFE3CB", edge=HONEY, number="5")
    ax.text(12.63, 3.05, "Mạng Docker nội bộ · không publish port", color=INK_2, fontsize=8.2)
    arrow(ax, (3.05, 4.75), (4.0, 5.32), label="HTTPS")
    arrow(ax, (3.05, 3.85), (4.0, 2.35), label="POST checkout", curve=-0.06)
    arrow(ax, (6.65, 5.28), (8.0, 4.55), label="GET dữ liệu", curve=-0.08)
    arrow(ax, (6.65, 2.32), (8.0, 3.35), label="reverse_proxy", curve=0.08)
    arrow(ax, (11.0, 4.0), (12.35, 4.0), label="SQL / transaction")
    ax.text(0.85, 0.55, "Biên công khai", color=CLAY, fontsize=9, weight="bold")
    ax.plot([2.1, 7.2], [0.63, 0.63], color=CLAY, linewidth=2)
    ax.text(8.0, 0.55, "Biên cloud riêng", color=FOREST, fontsize=9, weight="bold")
    ax.plot([9.45, 15.1], [0.63, 0.63], color=FOREST, linewidth=2)
    save(fig, output_dir, "01-system-architecture")


def checkout_sequence(output_dir: Path):
    fig, ax = canvas("Luồng tạo đơn COD trình diễn", "DẤU VỊ · Checkout sequence")
    actors = [(1.55, "Người dùng"), (5.0, "Next.js UI"), (9.0, "FastAPI"), (13.3, "PostgreSQL")]
    for x, label in actors:
        ax.add_patch(Circle((x, 6.82), 0.24, facecolor=FOREST if x == 9.0 else CLAY, edgecolor="none"))
        ax.text(x, 6.35, label, ha="center", color=FOREST, fontsize=10.5, weight="bold")
        ax.plot([x, x], [1.05, 6.0], color=SAND, linewidth=1.2, linestyle=(0, (4, 4)))
    steps = [
        (5.65, 1.55, 5.0, "1 · Chọn variant, grind, số lượng"),
        (4.85, 5.0, 9.0, "2 · POST /orders + Idempotency-Key"),
        (4.05, 9.0, 13.3, "3 · Đọc variant, stock và giá hiện tại"),
        (3.25, 13.3, 9.0, "4 · Trả dữ liệu catalog"),
        (2.45, 9.0, 13.3, "5 · Ghi orders + order_items trong transaction"),
        (1.65, 9.0, 5.0, "6 · Mã DV-… và tổng tiền server-side"),
    ]
    for y, start_x, end_x, label in steps:
        direction = 1 if end_x > start_x else -1
        arrow(ax, (start_x + 0.18 * direction, y), (end_x - 0.18 * direction, y), color=LEAF if direction > 0 else HONEY)
        ax.text((start_x + end_x) / 2, y + 0.14, label, ha="center", va="bottom", color=INK_2, fontsize=8.6)
    node(ax, 0.55, 0.12, 14.9, 1.02, "Nguyên tắc an toàn", "Frontend không gửi unitPrice · Backend kiểm tra grind/stock · Request lặp dùng cùng idempotency key không tạo đơn trùng", color="#F1EBDD", edge=SAND, fontsize=10)
    save(fig, output_dir, "02-checkout-sequence")


def advisor_pipeline(output_dir: Path):
    fig, ax = canvas("Pipeline Coffee Advisor có thể giải thích", "DẤU VỊ · Deterministic recommendation")
    blocks = [
        (0.8, "Preferences", "Độ đậm · đắng · chua\nCaffeine · cách pha\nFormat · ngân sách"),
        (3.55, "Pydantic validate", "Enum, budget dương\nPriority không trùng"),
        (6.3, "Catalog query", "Chỉ product published\nVariant còn hàng"),
        (9.05, "Hard filters", "Đúng format\nKhông vượt budget"),
        (11.8, "Weighted score", "Brew 25 · body 20\nTaste 30 · caffeine 10\nPriority tối đa 10"),
    ]
    colors = ["#F5F0E6", WHITE, "#EFE3CB", WHITE, "#E4EEE7"]
    for index, (x, title, subtitle) in enumerate(blocks):
        node(ax, x, 3.55, 2.2, 2.25, title, subtitle, color=colors[index], number=str(index + 1), fontsize=10.5)
        if index < len(blocks) - 1:
            arrow(ax, (x + 2.2, 4.68), (blocks[index + 1][0], 4.68))
    node(ax, 5.3, 0.95, 5.4, 1.55, "Top 3 + lý do", "Chuẩn hoá score 0–100\nTối đa 4 reason · productId hợp lệ", color=FOREST, edge=FOREST, title_color=WHITE, number="6", fontsize=12)
    ax.text(5.58, 1.12, "taste · brew · budget · origin", color="#D7E5DB", fontsize=8.6)
    arrow(ax, (12.9, 3.55), (10.7, 2.15), color=HONEY, curve=-0.12)
    arrow(ax, (5.3, 1.82), (2.6, 1.82), color=CLAY, label="Frontend ghép với catalog", curve=0.0)
    node(ax, 0.8, 1.15, 2.05, 1.35, "Recommendation UI", "Sản phẩm\nĐiểm + giải thích", color="#F5F0E6", fontsize=8.1)
    save(fig, output_dir, "03-advisor-pipeline")


def table_box(axis, x, y, width, title, fields, color=FOREST):
    height = 0.55 + len(fields) * 0.27
    axis.add_patch(
        FancyBboxPatch(
            (x, y - height), width, height,
            boxstyle="round,pad=0.015,rounding_size=0.09",
            facecolor=WHITE, edgecolor=SAND, linewidth=1.1,
        )
    )
    axis.add_patch(
        FancyBboxPatch(
            (x, y - 0.48), width, 0.48,
            boxstyle="round,pad=0.015,rounding_size=0.09",
            facecolor=color, edgecolor=color, linewidth=1,
        )
    )
    axis.text(x + 0.18, y - 0.25, title, va="center", color=WHITE, fontsize=9.5, weight="bold")
    for index, field in enumerate(fields):
        axis.text(x + 0.18, y - 0.72 - index * 0.27, field, va="center", color=INK_2, fontsize=7.2, family="DejaVu Sans Mono")
    return height


def erd(output_dir: Path):
    fig, ax = canvas("Mô hình dữ liệu PostgreSQL triển khai", "DẤU VỊ · Entity relationship diagram")
    table_box(ax, 0.7, 6.95, 3.0, "products", ["PK id", "UQ slug", "species · region_id", "process · roast_level", "flavor_* · JSON content", "featured_order · published"])
    table_box(ax, 4.55, 6.95, 3.15, "product_variants", ["PK id", "FK product_id", "UQ sku", "format · weight/bags", "grind_options", "price_amount · in_stock"], color=CLAY)
    table_box(ax, 0.7, 3.8, 3.0, "coffee_lots", ["PK lot_code", "FK product_id", "region · farm · cooperative", "harvest · process", "roast/packaging date", "evidence_level"], color=LEAF)
    table_box(ax, 4.55, 3.95, 3.15, "evidence_items", ["PK id", "FK lot_code", "UQ lot_code + key", "label · value · level", "source · verified_at"], color=LEAF)
    table_box(ax, 4.55, 1.95, 3.15, "lot_timeline_events", ["PK id · FK lot_code", "UQ lot_code + stage", "title · date_label", "description · sort_order"], color=LEAF)
    table_box(ax, 9.0, 6.95, 3.0, "orders", ["PK id", "UQ order_code", "UQ idempotency_key", "recipient + address", "subtotal · fee · total", "status · created_at"], color=BERRY)
    table_box(ax, 12.25, 6.95, 3.0, "order_items", ["PK id", "FK order_id", "product/variant snapshot", "sku · format · grind", "unit_price · quantity", "line_total"], color=BERRY)
    table_box(ax, 9.0, 3.15, 3.0, "alembic_version", ["PK version_num", "Theo dõi migration schema"], color=HONEY)
    arrow(ax, (3.7, 6.0), (4.55, 6.0), label="1 : N", color=CLAY)
    arrow(ax, (2.2, 4.55), (2.2, 3.8), label="1 : N", color=LEAF)
    arrow(ax, (3.7, 3.02), (4.55, 3.02), label="1 : N", color=LEAF)
    arrow(ax, (3.2, 2.55), (4.55, 1.42), label="1 : N", color=LEAF, curve=0.08)
    arrow(ax, (12.0, 6.0), (12.25, 6.0), label="1 : N", color=BERRY)
    ax.text(9.0, 1.2, "Order item giữ snapshot tên/SKU/giá để đơn cũ vẫn đọc được khi catalog đổi.", color=INK_2, fontsize=8.5)
    save(fig, output_dir, "04-postgresql-erd")


def deployment(output_dir: Path):
    fig, ax = canvas("Quy trình triển khai độc lập hai bề mặt", "DẤU VỊ · Cloud delivery")
    node(ax, 0.8, 3.55, 2.2, 2.0, "Git repository", "frontend/\nbackend/\ndocker/", color=WHITE, number="1")
    node(ax, 4.1, 5.0, 2.8, 1.65, "Vercel build", "pnpm install --frozen-lockfile\npnpm build", color="#F5F0E6", number="2A")
    node(ax, 4.1, 1.65, 2.8, 1.65, "Cloud Docker", "compose up -d --build\nhealthcheck", color="#F5F0E6", number="2B")
    node(ax, 8.2, 5.0, 2.8, 1.65, "Next.js production", "Self-hosted fonts\nHTTP data source", color=FOREST, edge=FOREST, title_color=WHITE, number="3A")
    node(ax, 8.2, 1.65, 2.8, 1.65, "API + PostgreSQL", "Migration + seed\nPersistent volume", color=FOREST, edge=FOREST, title_color=WHITE, number="3B")
    node(ax, 12.2, 3.3, 2.9, 2.25, "Public routing", "Vercel domain → frontend\nDuckDNS → Caddy → API\nTLS do Caddy quản lý", color="#EFE3CB", edge=HONEY, number="4")
    arrow(ax, (3.0, 4.65), (4.1, 5.82), label="frontend/")
    arrow(ax, (3.0, 4.15), (4.1, 2.48), label="backend/ + docker/")
    arrow(ax, (6.9, 5.82), (8.2, 5.82), label="deploy")
    arrow(ax, (6.9, 2.48), (8.2, 2.48), label="deploy")
    arrow(ax, (11.0, 5.65), (12.2, 4.95), color=HONEY)
    arrow(ax, (11.0, 2.48), (12.2, 3.85), color=HONEY)
    node(ax, 3.2, 0.35, 8.8, 1.2, "Thứ tự khuyến nghị", "1) Backend healthy qua HTTPS  →  2) cấu hình NEXT_PUBLIC_* trên Vercel\n3) Redeploy frontend sau khi API sẵn sàng", color="#E4EEE7", edge=LEAF, fontsize=10.5)
    save(fig, output_dir, "05-cloud-deployment")


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate DẤU VỊ report diagrams.")
    parser.add_argument(
        "--output",
        type=Path,
        default=Path(__file__).resolve().parents[1] / "report-assets" / "diagrams",
    )
    args = parser.parse_args()
    architecture(args.output)
    checkout_sequence(args.output)
    advisor_pipeline(args.output)
    erd(args.output)
    deployment(args.output)
    print(f"Generated report diagrams in {args.output.resolve()}")


if __name__ == "__main__":
    main()

from __future__ import annotations

from datetime import date
from typing import Any

from sqlalchemy.orm import Session

from app.db import SessionLocal
from app.models import CoffeeLot, EvidenceItem, LotTimelineEvent, Product, ProductVariant

DEMO_DISCLOSURE = "Dữ liệu lô và đơn vị sản xuất đang được mô phỏng cho mục đích trình diễn đồ án."


def _standard_variants(
    prefix: str,
    price_250: int,
    price_500: int,
    drip_bag_price: int | None = None,
) -> list[dict[str, Any]]:
    ground_options = ["phin", "espresso", "pour-over", "french-press", "moka-pot"]
    variants = [
        {
            "id": f"{prefix.lower()}-whole-250",
            "sku": f"{prefix}-WB-250",
            "format": "whole-bean",
            "weight_grams": 250,
            "grind_options": ["whole-bean"],
            "price_amount": price_250,
        },
        {
            "id": f"{prefix.lower()}-whole-500",
            "sku": f"{prefix}-WB-500",
            "format": "whole-bean",
            "weight_grams": 500,
            "grind_options": ["whole-bean"],
            "price_amount": price_500,
        },
        {
            "id": f"{prefix.lower()}-ground-250",
            "sku": f"{prefix}-GR-250",
            "format": "ground",
            "weight_grams": 250,
            "grind_options": ground_options,
            "price_amount": price_250,
        },
        {
            "id": f"{prefix.lower()}-ground-500",
            "sku": f"{prefix}-GR-500",
            "format": "ground",
            "weight_grams": 500,
            "grind_options": ground_options,
            "price_amount": price_500,
        },
    ]
    if drip_bag_price is not None:
        variants.append(
            {
                "id": f"{prefix.lower()}-drip-10x12",
                "sku": f"{prefix}-DB-10X12",
                "format": "drip-bag",
                "drip_bag_count": 10,
                "drip_bag_weight_grams": 12,
                "grind_options": [],
                "price_amount": drip_bag_price,
            }
        )
    for index, variant in enumerate(variants):
        variant.update(
            {
                "currency": "VND",
                "in_stock": True,
                "sort_order": index,
            }
        )
    return variants


PRODUCTS: list[dict[str, Any]] = [
    {
        "id": "tr4",
        "slug": "tr4-dak-lak-traceable-robusta",
        "display_name": "TR4 Đắk Lắk Traceable Robusta",
        "short_name": "TR4 Đắk Lắk",
        "proposition": "Dòng Robusta chủ lực với body dày, hậu vị đậm và hồ sơ lô nổi bật.",
        "species": "robusta",
        "scientific_name": "Coffea canephora",
        "variety": "TR4",
        "segment": "Traceable standard",
        "role": "signature",
        "region_id": "dak-lak",
        "region_label": "Buôn Ma Thuột, Đắk Lắk",
        "altitude_label": "500–800 m",
        "process": "natural",
        "roast_level": "medium-dark",
        "bitterness": 4,
        "acidity": 1,
        "sweetness": 3,
        "body": 5,
        "aroma": 3,
        "caffeine": "high",
        "flavor_notes": ["Cacao", "Hạnh nhân", "Caramel"],
        "brew_methods": ["phin", "espresso", "cold-brew"],
        "story": (
            "TR4 đại diện cho một tách Robusta Tây Nguyên rõ nét: body dày, vị đậm "
            "và phù hợp với nhịp pha phin hằng ngày."
        ),
        "variety_facts": [
            "Thông tin về giống ở mức Reference Data và không thay thế hồ sơ xác minh từng lô."
        ],
        "badges": ["Vietnam Traceable", "Signature Robusta"],
        "accent": "#214536",
        "pattern": "angular-route",
        "image_src": "/images/products/tr4-dak-lak-pack.png",
        "image_alt": "Gói cà phê DẤU VỊ TR4 màu xanh rừng với đường tuyến địa hình",
        "featured_lot_code": "TR4-DLK-26-N02",
        "published": True,
        "featured_order": 0,
        "variants": _standard_variants("TR4", 119_000, 219_000),
    },
    {
        "id": "catimor",
        "slug": "catimor-da-lat-washed",
        "display_name": "Catimor Đà Lạt Washed",
        "short_name": "Catimor Đà Lạt",
        "proposition": "Arabica cân bằng, dễ tiếp cận với hương cam, caramel và trà đen.",
        "species": "arabica",
        "scientific_name": "Coffea arabica",
        "variety": "Catimor",
        "segment": "Standard Arabica",
        "role": "gateway-arabica",
        "region_id": "da-lat",
        "region_label": "Đà Lạt / Cầu Đất, Lâm Đồng",
        "altitude_label": "1.400–1.600 m",
        "process": "washed",
        "roast_level": "light-medium",
        "bitterness": 2,
        "acidity": 3,
        "sweetness": 4,
        "body": 3,
        "aroma": 4,
        "caffeine": "medium",
        "flavor_notes": ["Cam vàng", "Caramel", "Chocolate sữa", "Trà đen"],
        "brew_methods": ["pour-over", "drip", "french-press", "phin"],
        "story": (
            "Catimor mở ra phía thanh sáng của cà phê Việt, đủ cân bằng cho người mới thử "
            "Arabica và linh hoạt từ pour-over đến drip bag."
        ),
        "variety_facts": [
            "Đặc điểm giống là Reference Data; hương vị cụ thể còn phụ thuộc lô, sơ chế và rang."
        ],
        "badges": ["Easy Arabica", "Washed"],
        "accent": "#71838a",
        "pattern": "fine-mountain-lines",
        "image_src": "/images/products/catimor-da-lat-pack.png",
        "image_alt": "Gói cà phê DẤU VỊ Catimor màu sương với đường núi mảnh",
        "featured_lot_code": "CAT-DL-26-W01",
        "published": True,
        "featured_order": 1,
        "variants": _standard_variants("CAT", 139_000, 259_000, 129_000),
    },
    {
        "id": "xanh-lun-ts5",
        "slug": "xanh-lun-ts5-bao-lam-honey",
        "display_name": "Xanh Lùn TS5 Bảo Lâm Honey",
        "short_name": "Xanh Lùn TS5",
        "proposition": (
            "Một giống Robusta có câu chuyện Việt Nam, sơ chế Honey cho vị dày nhưng êm."
        ),
        "species": "robusta",
        "scientific_name": "Coffea canephora",
        "variety": "Xanh Lùn TS5",
        "segment": "Local Fine Robusta",
        "role": "local-story",
        "region_id": "bao-lam",
        "region_label": "Bảo Lâm, Lâm Đồng",
        "altitude_label": "800–1.000 m",
        "process": "honey",
        "roast_level": "medium",
        "bitterness": 3,
        "acidity": 2,
        "sweetness": 4,
        "body": 5,
        "aroma": 4,
        "caffeine": "high",
        "flavor_notes": ["Mật ong", "Cacao", "Quả chín", "Đường nâu"],
        "brew_methods": ["phin", "espresso", "moka-pot"],
        "story": (
            "Xanh Lùn TS5 đưa câu chuyện giống cà phê Việt vào profile Honey tròn vị, "
            "vừa giữ body Robusta vừa tăng cảm giác ngọt."
        ),
        "variety_facts": [
            "Khả năng chịu hạn là thông tin tham khảo về giống, không phải bằng chứng của toàn lô."
        ],
        "badges": ["Vietnamese Variety", "Honey Process"],
        "accent": "#3f6b52",
        "pattern": "compact-rounded-contour",
        "image_src": "/images/products/xanh-lun-ts5-pack.png",
        "image_alt": "Gói cà phê DẤU VỊ Xanh Lùn TS5 màu lá với đường đồng mức bo tròn",
        "featured_lot_code": "XLTS5-BL-26-H01",
        "published": True,
        "featured_order": 2,
        "variants": _standard_variants("XLTS5", 159_000, 299_000),
    },
    {
        "id": "trs1",
        "slug": "trs1-tay-nguyen-daily-phin",
        "display_name": "TRS1 Tây Nguyên Daily Phin",
        "short_name": "TRS1 Daily Phin",
        "proposition": "Robusta đậm, dễ pha và dễ tiếp cận cho tách phin mỗi ngày.",
        "species": "robusta",
        "scientific_name": "Coffea canephora",
        "variety": "TRS1",
        "segment": "Everyday",
        "role": "bestseller",
        "region_id": "gia-lai",
        "region_label": "Gia Lai, Tây Nguyên",
        "altitude_label": "600–800 m",
        "process": "natural",
        "roast_level": "medium-dark",
        "bitterness": 5,
        "acidity": 1,
        "sweetness": 2,
        "body": 5,
        "aroma": 3,
        "caffeine": "high",
        "flavor_notes": ["Chocolate đen", "Hạt rang", "Caramel nhẹ"],
        "brew_methods": ["phin", "moka-pot", "espresso"],
        "story": (
            "Một lựa chọn thẳng thắn cho tách phin buổi sáng: đậm, dày, dễ phối cùng sữa "
            "và giữ mức giá dễ tiếp cận."
        ),
        "variety_facts": [
            "Mô tả giống là Reference Data; hồ sơ lô demo chưa phải dữ liệu đã xác minh."
        ],
        "badges": ["Daily Phin"],
        "accent": "#5a3729",
        "pattern": "broad-horizontal-contour",
        "image_src": "/images/products/trs1-daily-phin-pack.png",
        "image_alt": "Gói cà phê DẤU VỊ TRS1 màu bazan với đường đồng mức ngang",
        "featured_lot_code": "TRS1-GL-26-N01",
        "published": True,
        "featured_order": 3,
        "variants": _standard_variants("TRS1", 99_000, 185_000),
    },
    {
        "id": "tr9",
        "slug": "tr9-large-bean-fine-robusta",
        "display_name": "TR9 Large Bean Fine Robusta",
        "short_name": "TR9 Large Bean",
        "proposition": "Fine Robusta hạt lớn với cấu trúc tròn, chocolate sữa và trái cây khô nhẹ.",
        "species": "robusta",
        "scientific_name": "Coffea canephora",
        "variety": "TR9",
        "segment": "Fine Robusta",
        "role": "fine-robusta",
        "region_id": "dak-lak",
        "region_label": "Đắk Lắk",
        "altitude_label": "500–800 m",
        "process": "honey",
        "roast_level": "medium",
        "bitterness": 3,
        "acidity": 2,
        "sweetness": 4,
        "body": 5,
        "aroma": 4,
        "caffeine": "high",
        "flavor_notes": ["Chocolate sữa", "Đường nâu", "Hạt dẻ", "Trái cây khô"],
        "brew_methods": ["phin", "espresso", "french-press"],
        "story": (
            "TR9 cho thấy sắc thái Robusta mềm hơn, với sơ chế Honey, độ ngọt rõ và cấu trúc "
            "phù hợp cho cả phin lẫn French press."
        ),
        "variety_facts": [
            "Kích thước hạt và mô tả giống là Reference Data, không phải chứng nhận độc lập."
        ],
        "badges": ["Large Bean", "Fine Robusta"],
        "accent": "#c79648",
        "pattern": "large-bean-dot-grid",
        "image_src": "/images/products/tr9-large-bean-pack.png",
        "image_alt": "Gói cà phê DẤU VỊ TR9 màu mật ong với lưới chấm hạt lớn",
        "featured_lot_code": "TR9-DLK-26-H01",
        "published": True,
        "featured_order": 4,
        "variants": _standard_variants("TR9", 139_000, 259_000),
    },
    {
        "id": "bourbon",
        "slug": "bourbon-langbiang-honey",
        "display_name": "Bourbon Langbiang Honey",
        "short_name": "Bourbon Langbiang",
        "proposition": "Heritage Arabica thanh mượt, nổi bật với mật ong, cam ngọt và hạnh nhân.",
        "species": "arabica",
        "scientific_name": "Coffea arabica",
        "variety": "Bourbon",
        "segment": "Specialty",
        "role": "premium",
        "region_id": "langbiang",
        "region_label": "Langbiang, Lâm Đồng",
        "altitude_label": "1.500–1.700 m",
        "process": "honey",
        "roast_level": "light-medium",
        "bitterness": 1,
        "acidity": 4,
        "sweetness": 5,
        "body": 3,
        "aroma": 5,
        "caffeine": "medium",
        "flavor_notes": ["Mật ong", "Cam ngọt", "Caramel", "Hạnh nhân"],
        "brew_methods": ["pour-over", "aeropress", "drip"],
        "story": (
            "Bourbon khép lại hành trình vị giác ở phía thanh và thơm, dành cho những lần pha "
            "chậm bằng pour-over hoặc AeroPress."
        ),
        "variety_facts": [
            "Mô tả giống Bourbon là Reference Data; profile thực tế do hồ sơ từng lô quyết định."
        ],
        "badges": ["Heritage Arabica", "Langbiang Origin", "Small Lot"],
        "accent": "#9b4f58",
        "pattern": "high-altitude-thin-contour",
        "image_src": "/images/products/bourbon-langbiang-pack.png",
        "image_alt": "Gói cà phê DẤU VỊ Bourbon màu berry và mật ong với đường cao độ mảnh",
        "featured_lot_code": "BBN-LB-26-H01",
        "published": True,
        "featured_order": 5,
        "variants": _standard_variants("BBN", 199_000, 379_000),
    },
]


def _lot(
    lot_code: str,
    product_id: str,
    farm_name: str,
    cooperative_name: str,
    province: str,
    district: str,
    region_id: str,
    altitude_label: str,
    variety: str,
    process: str,
    roast_date: str,
    packaging_date: str,
    featured_order: int,
    reference_evidence: list[dict[str, Any]] | None = None,
) -> dict[str, Any]:
    prefix = lot_code.lower()
    source_label = "Dữ liệu mô phỏng nội bộ của đồ án"
    evidence = [
        {
            "key": "production-unit",
            "label": "Đơn vị sản xuất",
            "value": cooperative_name,
            "level": "demo",
            "source_label": source_label,
        },
        {
            "key": "region",
            "label": "Vùng nguyên liệu",
            "value": f"{district}, {province}",
            "level": "demo",
            "source_label": source_label,
        },
        {
            "key": "variety",
            "label": "Giống",
            "value": variety,
            "level": "demo",
            "source_label": source_label,
        },
        {
            "key": "harvest",
            "label": "Niên vụ",
            "value": "2025–2026",
            "level": "demo",
            "source_label": source_label,
        },
        {
            "key": "process",
            "label": "Sơ chế",
            "value": process,
            "level": "demo",
            "source_label": source_label,
        },
        {
            "key": "roast-date",
            "label": "Ngày rang",
            "value": roast_date,
            "level": "demo",
            "source_label": source_label,
        },
        {
            "key": "packaging-date",
            "label": "Ngày đóng gói",
            "value": packaging_date,
            "level": "demo",
            "source_label": source_label,
        },
        *(reference_evidence or []),
    ]
    timeline = [
        {
            "id": f"{prefix}-farm",
            "stage": "farm",
            "title": "Vùng trồng",
            "date_label": "Hồ sơ demo",
            "description": (
                f"Bản ghi mô phỏng đặt lô tại {district}, {province}; "
                "chưa phải hồ sơ nông hộ đã xác minh."
            ),
        },
        {
            "id": f"{prefix}-harvest",
            "stage": "harvest",
            "title": "Thu hoạch",
            "date_label": "Niên vụ 2025–2026",
            "description": "Mốc thu hoạch được dựng để trình diễn cấu trúc dữ liệu theo lô.",
        },
        {
            "id": f"{prefix}-processing",
            "stage": "processing",
            "title": "Sơ chế",
            "date_label": "01/2026",
            "description": f"Phương pháp {process} là dữ liệu mô phỏng của hồ sơ trình diễn.",
        },
        {
            "id": f"{prefix}-green-bean",
            "stage": "green-bean",
            "title": "Cà phê nhân",
            "date_label": "02/2026",
            "description": (
                "Bản ghi phân loại cà phê nhân ở cấp Demo Data, chưa có chứng từ nhà cung cấp."
            ),
        },
        {
            "id": f"{prefix}-roasting",
            "stage": "roasting",
            "title": "Rang",
            "date_label": roast_date,
            "description": "Ngày rang mô phỏng minh họa cách một mẻ rang được nối với mã lô.",
        },
        {
            "id": f"{prefix}-packaging",
            "stage": "packaging",
            "title": "Đóng gói",
            "date_label": packaging_date,
            "description": "Ngày đóng gói mô phỏng hoàn tất hành trình truy xuất trên giao diện.",
        },
    ]
    return {
        "lot_code": lot_code,
        "product_id": product_id,
        "status": "available",
        "farm_name": farm_name,
        "cooperative_name": cooperative_name,
        "province": province,
        "district": district,
        "region_id": region_id,
        "altitude_label": altitude_label,
        "harvest_year": 2026,
        "variety": variety,
        "process": process,
        "roast_date": date.fromisoformat(roast_date),
        "packaging_date": date.fromisoformat(packaging_date),
        "evidence_level": "demo",
        "demo_disclosure": DEMO_DISCLOSURE,
        "featured_order": featured_order,
        "evidence": evidence,
        "timeline": timeline,
    }


LOTS = [
    _lot(
        "TR4-DLK-26-N02",
        "tr4",
        "Nông hộ mô phỏng DLK-02",
        "Tổ hợp tác mô phỏng Buôn Ma Thuột",
        "Đắk Lắk",
        "Buôn Ma Thuột",
        "dak-lak",
        "500–800 m",
        "TR4",
        "natural",
        "2026-04-18",
        "2026-04-20",
        0,
    ),
    _lot(
        "CAT-DL-26-W01",
        "catimor",
        "Nông hộ mô phỏng DL-01",
        "Nhóm sản xuất mô phỏng Cầu Đất",
        "Lâm Đồng",
        "Đà Lạt / Cầu Đất",
        "da-lat",
        "1.400–1.600 m",
        "Catimor",
        "washed",
        "2026-04-22",
        "2026-04-24",
        1,
    ),
    _lot(
        "XLTS5-BL-26-H01",
        "xanh-lun-ts5",
        "Nông hộ mô phỏng BL-01",
        "Tổ hợp tác mô phỏng Bảo Lâm",
        "Lâm Đồng",
        "Bảo Lâm",
        "bao-lam",
        "800–1.000 m",
        "Xanh Lùn TS5",
        "honey",
        "2026-04-15",
        "2026-04-17",
        2,
        [
            {
                "key": "variety-drought-reference",
                "label": "Tham khảo về giống",
                "value": (
                    "Khả năng chịu hạn là thông tin tham khảo về giống, không phải bằng chứng "
                    "rằng toàn bộ lô tiết kiệm nước."
                ),
                "level": "reference",
                "source_label": "Nội dung tham khảo trong đặc tả đồ án",
            }
        ],
    ),
    _lot(
        "TRS1-GL-26-N01",
        "trs1",
        "Nông hộ mô phỏng GL-01",
        "Nhóm sản xuất mô phỏng Gia Lai",
        "Gia Lai",
        "Chư Sê",
        "gia-lai",
        "600–800 m",
        "TRS1",
        "natural",
        "2026-04-12",
        "2026-04-14",
        3,
    ),
    _lot(
        "TR9-DLK-26-H01",
        "tr9",
        "Nông hộ mô phỏng DLK-01",
        "Nhóm sản xuất mô phỏng Cư M'gar",
        "Đắk Lắk",
        "Cư M'gar",
        "dak-lak",
        "500–800 m",
        "TR9",
        "honey",
        "2026-04-20",
        "2026-04-22",
        4,
    ),
    _lot(
        "BBN-LB-26-H01",
        "bourbon",
        "Nông hộ mô phỏng LB-01",
        "Nhóm sản xuất mô phỏng Langbiang",
        "Lâm Đồng",
        "Lạc Dương / Langbiang",
        "langbiang",
        "1.500–1.700 m",
        "Bourbon",
        "honey",
        "2026-04-25",
        "2026-04-27",
        5,
    ),
]


def _set_fields(target: Any, values: dict[str, Any]) -> None:
    for key, value in values.items():
        setattr(target, key, value)


def seed_database(session: Session) -> None:
    for product_data in PRODUCTS:
        values = dict(product_data)
        variant_values = values.pop("variants")
        product = session.get(Product, values["id"])
        if product is None:
            product = Product(id=values["id"])
            session.add(product)
        _set_fields(product, values)
        session.flush()

        existing_variants = {variant.id: variant for variant in product.variants}
        expected_variant_ids = set()
        for variant_data in variant_values:
            expected_variant_ids.add(variant_data["id"])
            variant = existing_variants.get(variant_data["id"])
            if variant is None:
                variant = ProductVariant(id=variant_data["id"], product_id=product.id)
                session.add(variant)
            _set_fields(variant, {**variant_data, "product_id": product.id})
        for variant_id, variant in existing_variants.items():
            if variant_id not in expected_variant_ids:
                session.delete(variant)
        session.flush()

    for lot_data in LOTS:
        values = dict(lot_data)
        evidence_values = values.pop("evidence")
        timeline_values = values.pop("timeline")
        lot = session.get(CoffeeLot, values["lot_code"])
        if lot is None:
            lot = CoffeeLot(lot_code=values["lot_code"])
            session.add(lot)
        _set_fields(lot, values)
        session.flush()

        for existing in list(lot.evidence):
            session.delete(existing)
        session.flush()
        for index, item in enumerate(evidence_values):
            session.add(EvidenceItem(lot_code=lot.lot_code, sort_order=index, **item))

        existing_events = {event.id: event for event in lot.timeline}
        expected_event_ids = set()
        for index, event_data in enumerate(timeline_values):
            expected_event_ids.add(event_data["id"])
            event = existing_events.get(event_data["id"])
            if event is None:
                event = LotTimelineEvent(id=event_data["id"], lot_code=lot.lot_code)
                session.add(event)
            _set_fields(event, {**event_data, "lot_code": lot.lot_code, "sort_order": index})
        for event_id, event in existing_events.items():
            if event_id not in expected_event_ids:
                session.delete(event)
        session.flush()

    session.commit()


def main() -> None:
    with SessionLocal() as session:
        seed_database(session)
        print(f"Seeded {len(PRODUCTS)} products and {len(LOTS)} coffee lots.")


if __name__ == "__main__":
    main()

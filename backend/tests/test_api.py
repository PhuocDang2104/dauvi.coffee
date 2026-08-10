from sqlalchemy import func, select

from app.models import KnowledgeChunk, Order, RetrievalLog


def test_health_and_catalog_contract(client):
    assert client.get("/health/live").json() == {"status": "ok"}
    assert client.get("/health/ready").json() == {"status": "ready", "database": "ok"}
    rag_health = client.get("/health/rag").json()
    assert rag_health["status"] == "ready"
    assert rag_health["workflow"] == "langgraph"
    assert rag_health["knowledgeChunks"] == 21

    response = client.get("/api/v1/products")
    assert response.status_code == 200
    products = response.json()
    assert len(products) == 6
    assert products[0]["id"] == "tr4"
    assert products[0]["variants"][0]["price"] == {"amount": 119000, "currency": "VND"}


def test_product_filters_and_not_found_shape(client):
    response = client.get(
        "/api/v1/products",
        params=[("species", "arabica"), ("sort", "price-desc")],
    )
    assert response.status_code == 200
    assert [product["id"] for product in response.json()] == ["bourbon", "catimor"]

    response = client.get("/api/v1/products/khong-ton-tai")
    assert response.status_code == 404
    assert response.json() == {"message": "Không tìm thấy sản phẩm.", "code": "HTTP_404"}

    response = client.get("/api/v1/products", params={"q": "dak lak"})
    assert response.status_code == 200
    assert {product["id"] for product in response.json()} == {"tr4", "tr9"}


def test_traceability_normalizes_code_and_returns_six_stages(client):
    response = client.get("/api/v1/lots/tr4-dlk-26-n02")
    assert response.status_code == 200
    lot = response.json()
    assert lot["lotCode"] == "TR4-DLK-26-N02"
    assert lot["evidenceLevel"] == "demo"
    assert [event["stage"] for event in lot["timeline"]] == [
        "farm",
        "harvest",
        "processing",
        "green-bean",
        "roasting",
        "packaging",
    ]


def test_advisor_returns_catalog_bounded_recommendations(client):
    response = client.post(
        "/api/v1/advisor/recommendations",
        json={
            "intensity": "bold",
            "bitterness": "high",
            "acidity": "low",
            "caffeine": "high",
            "brewMethod": "phin",
            "format": "whole-bean",
            "budgetMax": 150000,
            "priorities": ["everyday", "traceability"],
        },
    )
    assert response.status_code == 200
    recommendations = response.json()["recommendations"]
    assert 1 <= len(recommendations) <= 3
    assert recommendations[0]["productId"] in {"trs1", "tr4", "tr9"}
    assert 0 <= recommendations[0]["score"] <= 100
    assert 1 <= len(recommendations[0]["reasons"]) <= 4


def test_assistant_runs_grounded_langgraph_and_writes_retrieval_log(client, db_session):
    response = client.post(
        "/api/v1/assistant/messages",
        json={"message": "Tư vấn cà phê pha phin đậm dưới 120k"},
    )

    assert response.status_code == 200
    payload = response.json()
    assert payload["message"]
    assert 1 <= len(payload["actions"]) <= 3
    assert any(action["href"].startswith("/shop/") for action in payload["actions"])
    assert {
        action["href"] for action in payload["actions"] if action["href"].startswith("/shop/")
    } <= {
        "/shop/trs1-tay-nguyen-daily-phin",
        "/shop/tr4-dak-lak-traceable-robusta",
    }
    assert db_session.scalar(select(func.count()).select_from(KnowledgeChunk)) == 21
    assert db_session.scalar(select(func.count()).select_from(RetrievalLog)) == 1


def test_assistant_refuses_out_of_scope_question_without_hallucinating(client):
    response = client.post(
        "/api/v1/assistant/messages",
        json={"message": "Dự báo thời tiết ngày mai giúp tôi"},
    )

    assert response.status_code == 200
    payload = response.json()
    assert "chưa có dữ liệu" in payload["message"].lower()
    assert payload["actions"] == [{"label": "Mở Coffee Advisor", "href": "/advisor"}]


def test_order_reprices_items_and_is_idempotent(client, db_session):
    payload = {
        "fullName": "Nguyễn Minh Anh",
        "phone": "090 123 4567",
        "email": "minhanh@example.com",
        "province": "TP. Hồ Chí Minh",
        "district": "Quận 1",
        "ward": "Bến Nghé",
        "address": "01 Nguyễn Huệ",
        "deliveryNote": "Gọi trước khi giao",
        "shippingMethod": "standard",
        "paymentMethod": "cod",
        "acceptDemo": True,
        "items": [
            {
                "productId": "tr4",
                "variantId": "tr4-whole-250",
                "quantity": 2,
                "grind": "whole-bean",
            }
        ],
    }
    headers = {"Idempotency-Key": "checkout-test-0001"}
    first = client.post("/api/v1/orders", json=payload, headers=headers)
    second = client.post("/api/v1/orders", json=payload, headers=headers)

    assert first.status_code == 201
    assert second.status_code == 201
    assert first.json()["orderCode"] == second.json()["orderCode"]
    assert first.json()["subtotal"] == 238000
    assert first.json()["shippingFee"] == 30000
    assert first.json()["total"] == 268000
    assert db_session.scalar(select(func.count()).select_from(Order)) == 1


def test_order_rejects_client_product_variant_mismatch(client):
    response = client.post(
        "/api/v1/orders",
        json={
            "fullName": "Nguyễn Minh Anh",
            "phone": "0901234567",
            "province": "TP. Hồ Chí Minh",
            "district": "Quận 1",
            "ward": "Bến Nghé",
            "address": "01 Nguyễn Huệ",
            "shippingMethod": "standard",
            "paymentMethod": "cod",
            "acceptDemo": True,
            "items": [
                {
                    "productId": "catimor",
                    "variantId": "tr4-whole-250",
                    "quantity": 1,
                    "grind": "whole-bean",
                }
            ],
        },
    )
    assert response.status_code == 422
    assert response.json()["message"] == "Sản phẩm và biến thể không khớp."

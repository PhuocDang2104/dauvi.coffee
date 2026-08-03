# DẤU VỊ API

Backend FastAPI cho storefront DẤU VỊ. API cung cấp catalog, hồ sơ truy xuất,
Coffee Advisor, Coffee Assistant, authentication/session bảo mật và đơn hàng COD
trình diễn được lưu vào PostgreSQL.

Coffee Assistant dùng retrieval cục bộ trên 6 sản phẩm/6 hồ sơ lô trong PostgreSQL,
sau đó gọi Groq Responses API qua endpoint OpenAI-compatible nếu `AI_ENABLED=true`.
Khi thiếu key hoặc API lỗi, backend tự dùng câu trả lời catalog rule-based.

Các nhóm endpoint production: `/products`, `/lots`, `/advisor`, `/assistant`,
`/auth`, `/orders` dưới prefix `/api/v1`, cùng `/health/live` và `/health/ready`.

## Chạy trực tiếp

Yêu cầu Python 3.11+ và PostgreSQL 17.

```bash
python -m venv .venv
.venv/Scripts/activate
pip install -r requirements-dev.txt
copy .env.example .env
alembic upgrade head
python -m app.seed
uvicorn app.main:app --reload
```

API mặc định ở `http://localhost:8000`, tài liệu OpenAPI ở `/docs` và endpoint
sẵn sàng ở `/health/ready`.

## Kiểm tra chất lượng

```bash
ruff check .
pytest
```

Triển khai production bằng Docker Compose được mô tả tại
[`../docs/deployment.md`](../docs/deployment.md).

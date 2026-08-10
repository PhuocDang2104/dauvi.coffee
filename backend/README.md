# DẤU VỊ API

Backend FastAPI cho storefront DẤU VỊ. API cung cấp catalog, hồ sơ truy xuất,
Coffee Advisor, Coffee Assistant, authentication/session bảo mật và đơn hàng COD
trình diễn được lưu vào PostgreSQL.

Coffee Assistant chạy workflow LangGraph gồm phân loại ý định, truy vấn có cấu trúc,
BM25, tìm kiếm vector pgvector, Reciprocal Rank Fusion, grounding và sinh câu trả lời.
FastEmbed tạo vector 384 chiều ngay trong backend; Groq Responses API chỉ nhận context
đã giới hạn từ catalog. Khi thiếu key hoặc API lỗi, hệ thống trả lời xác định từ cùng
nguồn dữ liệu và không tự tạo sản phẩm ngoài catalog.

Các nhóm endpoint production: `/products`, `/lots`, `/advisor`, `/assistant`,
`/auth`, `/orders` dưới prefix `/api/v1`, cùng `/health/live` và `/health/ready`.

## Chạy trực tiếp

Yêu cầu Python 3.11+ và PostgreSQL 17 có extension pgvector. Khi chỉ phát triển nhanh
với SQLite, đặt `VECTOR_SEARCH_ENABLED=false`; BM25 và toàn bộ LangGraph vẫn hoạt động.

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
sẵn sàng ở `/health/ready`. Trạng thái RAG chi tiết ở `/health/rag`.

## Kiểm tra chất lượng

```bash
ruff check .
pytest
```

Triển khai production bằng Docker Compose được mô tả tại
[`../docs/deployment.md`](../docs/deployment.md).

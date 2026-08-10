# DẤU VỊ API

Backend FastAPI cho storefront DẤU VỊ. API cung cấp catalog, hồ sơ truy xuất,
Coffee Advisor, Coffee Assistant, authentication/session bảo mật và đơn hàng COD
trình diễn được lưu vào PostgreSQL.

Coffee Assistant chạy workflow LangGraph với Groq semantic intent router. Router chỉ
chọn một trong bốn tool node: Coffee Retrieval, Traceability, Brew Knowledge hoặc
Commerce Policy; greeting và câu ngoài phạm vi không chạy retrieval. Mỗi tool dùng
structured retrieval, BM25 và/hoặc pgvector phù hợp trước bước grounding và sinh câu
trả lời. FastEmbed tạo vector 384 chiều ngay trong backend; khi Groq router lỗi hoặc
tắt, bộ định tuyến xác định tiếp quản để dịch vụ vẫn hoạt động mà không hallucinate.

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

# DẤU VỊ API

Backend FastAPI cho storefront DẤU VỊ. API cung cấp catalog, hồ sơ truy xuất,
Coffee Advisor xác định theo bộ quy tắc và đơn hàng COD trình diễn được lưu vào
PostgreSQL.

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

# DẤU VỊ — Vietnam Traceable Coffee

Monorepo cho storefront cà phê Việt Nam có truy xuất theo lô, Coffee Advisor và
luồng đơn hàng COD trình diễn.

## Thành phần

- `frontend/`: Next.js 16, React 19, TypeScript; deploy trên Vercel.
- `backend/`: FastAPI, SQLAlchemy, Alembic; cung cấp REST API.
- `docker/`: image backend và Compose production cho backend + PostgreSQL.
- `docs/`: đặc tả, hợp đồng API, hướng dẫn triển khai và báo cáo đồ án.

## Chạy frontend với dữ liệu mock

```bash
cd frontend
pnpm install --frozen-lockfile
pnpm dev
```

## Chạy backend + database bằng Docker

```bash
cp docker/.env.example docker/.env
# Sửa mật khẩu, CORS_ORIGINS và ALLOWED_HOSTS trong docker/.env
docker compose -f docker/compose.yml up -d --build
```

Backend chỉ được publish mặc định tại `127.0.0.1:8000`; PostgreSQL không publish
port ra host. Xem hướng dẫn cloud/Vercel/Caddy tại
[`docs/deployment.md`](docs/deployment.md).

## Kiểm tra

```bash
cd backend && ruff check . && pytest
cd frontend && pnpm check
```

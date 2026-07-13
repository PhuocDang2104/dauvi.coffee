# Vietnam Traceable Coffee

- `frontend/` — ứng dụng Next.js có thể deploy độc lập.
- `backend/` — vị trí dành cho API ở giai đoạn sau.
- `docker/` — Dockerfile và Compose.
- `docs/` — đặc tả, API contracts và quyết định kiến trúc.
- `IMAGE_REPLACEMENT.md` — danh sách ảnh cần thay.

Chạy frontend:

```bash
cd frontend
pnpm install
pnpm dev
```

Chạy Docker từ root:

```bash
docker compose -f docker/compose.yml up --build
```

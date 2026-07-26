# Triển khai DẤU VỊ: Docker backend/PostgreSQL + Caddy + Vercel

Kiến trúc production được thiết kế cho trường hợp Caddy và DuckDNS đã được cấu
hình riêng trên cloud; repository chỉ quản lý backend, PostgreSQL và frontend.

```text
Người dùng
  ├─ https://dauvi-coffee.vercel.app ──> Vercel / Next.js
  └─ https://api.<domain-duckdns> ─────> Caddy ──> 127.0.0.1:8000
                                                       │
                                                       └─ Docker backend
                                                             │ mạng nội bộ
                                                             └─ PostgreSQL
```

## 1. Chuẩn bị cloud

Yêu cầu Docker Engine có Compose v2. PostgreSQL không cần cài trực tiếp trên
host.

```bash
git clone <repository-url> coffee-ai-web
cd coffee-ai-web
cp docker/.env.example docker/.env
openssl rand -hex 32
```

Mở `docker/.env` và thay tối thiểu:

```dotenv
POSTGRES_PASSWORD=<mat-khau-vua-tao>
CORS_ORIGINS=https://dauvi-coffee.vercel.app
ALLOWED_HOSTS=api.<domain-duckdns>,localhost,127.0.0.1
DOCS_ENABLED=false
```

`CORS_ORIGINS` có thể chứa nhiều origin chính xác, phân cách bằng dấu phẩy. Chỉ
thêm domain preview Vercel khi thực sự cần. Không commit `docker/.env`.

## 2. Khởi động backend và database

```bash
docker compose -f docker/compose.yml config --quiet
docker compose -f docker/compose.yml up -d --build
docker compose -f docker/compose.yml ps
curl --fail http://127.0.0.1:8000/health/ready
```

Entrypoint backend tự chạy `alembic upgrade head`, seed idempotent 6 sản phẩm và
6 lô rồi mới mở Uvicorn. Dữ liệu PostgreSQL nằm trong named volume
`dau-vi_postgres_data` và vẫn tồn tại khi recreate container.

## 3. Nối Caddy hiện có

Thêm site/API domain vào Caddyfile đang quản lý trên máy cloud. Ví dụ tối thiểu:

```caddyfile
api.<domain-duckdns> {
    reverse_proxy 127.0.0.1:8000
}
```

Reload Caddy theo cách đang dùng trên máy. Backend bind loopback theo mặc định,
vì vậy Caddy có thể truy cập nhưng port 8000 không được mở trực tiếp từ Internet.
Không publish port 5432.

Kiểm tra qua TLS sau khi DNS/chứng chỉ sẵn sàng:

```bash
curl --fail https://api.<domain-duckdns>/health/ready
curl --fail https://api.<domain-duckdns>/api/v1/products/featured
```

## 4. Deploy frontend trên Vercel

Trong Vercel, chọn `frontend` làm Root Directory. Cấu hình Production Environment:

```dotenv
NEXT_PUBLIC_SITE_URL=https://dauvi-coffee.vercel.app
NEXT_PUBLIC_API_BASE_URL=https://api.<domain-duckdns>/api/v1
NEXT_PUBLIC_DATA_SOURCE=http
NEXT_PUBLIC_ENABLE_CHECKOUT=true
NEXT_PUBLIC_ENABLE_AUTH=false
NEXT_PUBLIC_ENABLE_CHATBOT_API=false
```

Deploy backend trước frontend để các bước build/runtime có thể đọc API. Các biến
`NEXT_PUBLIC_*` được đóng vào bundle lúc build; thay đổi chúng cần redeploy Vercel.
Font Fraunces và Manrope được self-host trong bundle nên build không phụ thuộc
Google Fonts.

## 5. Vận hành

Xem log và cập nhật:

```bash
docker compose -f docker/compose.yml logs -f --tail=200 backend
git pull
docker compose -f docker/compose.yml up -d --build
```

Backup PostgreSQL:

```bash
docker compose -f docker/compose.yml exec -T database \
  pg_dump -U dauvi -d dauvi -Fc > dauvi-$(date +%F).dump
```

Khôi phục vào database trống:

```bash
cat <backup.dump> | docker compose -f docker/compose.yml exec -T database \
  pg_restore -U dauvi -d dauvi --clean --if-exists
```

Trước khi nâng major PostgreSQL, phải backup và đọc hướng dẫn `pg_upgrade`; không
đổi trực tiếp tag major trên volume đang dùng.

## 6. Biên an toàn của bản đồ án

- Đơn hàng được lưu với trạng thái `demo-confirmed`; không phát sinh thanh toán,
  giao vận hay trừ tồn kho.
- Backend tính lại giá từ database và hỗ trợ `Idempotency-Key` để tránh tạo trùng.
- Chưa có tài khoản, phân quyền admin, payment gateway, shipping provider hoặc
  AI/LLM/RAG thật. Form auth và Coffee Assistant HTTP adapter đã có ở frontend,
  nhưng phải giữ hai feature flag `false` cho đến khi endpoint backend tương ứng
  được triển khai và kiểm thử bảo mật.
- Dữ liệu nông hộ, hợp tác xã và lô đều có nhãn mô phỏng; không được quảng bá là
  dữ liệu đã xác minh.

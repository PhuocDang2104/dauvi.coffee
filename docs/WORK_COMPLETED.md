# DẤU VỊ – Tổng hợp công việc đã thực hiện

Ngày cập nhật: 19/07/2026

## 1. Kết quả tổng quan

Repository đã được hoàn thiện từ một frontend dùng dữ liệu mock thành hệ thống có thể triển khai theo hai bề mặt độc lập:

- Frontend Next.js triển khai trên Vercel.
- Backend FastAPI và PostgreSQL chạy bằng Docker Compose trên cloud.
- Caddy và DuckDNS được giữ ngoài Compose để phù hợp với hạ tầng đã có.
- Frontend có thể chuyển giữa mock data và HTTP API bằng biến môi trường.
- Checkout có thể tạo đơn COD trình diễn thật trong PostgreSQL.
- Báo cáo Word đã được khôi phục từ bản gốc và chỉ bổ sung nội dung bên trong Chương 4 theo yêu cầu cuối cùng.

## 2. Backend đã xây dựng

Backend nằm trong thư mục `backend/` và sử dụng:

- FastAPI cho REST API.
- Pydantic cho kiểm tra request/response.
- SQLAlchemy cho ORM và transaction.
- Alembic cho migration schema.
- PostgreSQL cho dữ liệu production.
- Pytest cho kiểm thử API/nghiệp vụ.
- Ruff cho lint và format Python.

Các nhóm API đã hoàn thiện:

| Method | Endpoint | Chức năng |
| --- | --- | --- |
| GET | `/health/live` | Liveness của backend |
| GET | `/health/ready` | Readiness, bao gồm PostgreSQL |
| GET | `/api/v1/products` | Tìm kiếm, lọc và sắp xếp sản phẩm |
| GET | `/api/v1/products/featured` | Sản phẩm nổi bật |
| GET | `/api/v1/products/{slug}` | Chi tiết sản phẩm/variant |
| GET | `/api/v1/lots/featured` | Lô truy xuất nổi bật |
| GET | `/api/v1/lots/{lotCode}` | Passport, timeline và evidence |
| POST | `/api/v1/advisor/recommendations` | Tối đa ba gợi ý có điểm/lý do |
| POST | `/api/v1/orders` | Tạo đơn COD idempotent |

Các biện pháp an toàn đã thêm:

- CORS theo danh sách origin chính xác.
- TrustedHost theo hostname cấu hình.
- GZip, request ID và security headers.
- Pydantic validation cho dữ liệu đầu vào.
- Backend không tin giá do frontend gửi; giá được đọc lại từ database.
- Kiểm tra variant, grind option, tồn kho và số lượng.
- `Idempotency-Key` ngăn retry tạo đơn trùng.
- Orders và order_items được ghi trong một transaction.

## 3. Database và dữ liệu seed

Schema PostgreSQL đã triển khai gồm:

- `products`
- `product_variants`
- `coffee_lots`
- `evidence_items`
- `lot_timeline_events`
- `orders`
- `order_items`
- `alembic_version`

Migration đầu tiên: `20260719_0001`.

Seed idempotent tạo sáu sản phẩm và sáu hồ sơ lô demo. Seed có thể chạy lại khi container restart mà không tạo bản ghi trùng.

## 4. Coffee Advisor

Coffee Advisor được triển khai bằng bộ luật xác định để kết quả kiểm soát và giải thích được:

1. Kiểm tra preferences bằng Pydantic.
2. Truy vấn catalog published và variant còn hàng.
3. Lọc cứng theo format và budget.
4. Chấm điểm theo cách pha, body, đắng, chua, caffeine, giá và priorities.
5. Chuẩn hóa điểm về 0–100.
6. Trả tối đa ba `productId`, mỗi kết quả có tối đa bốn lý do.

Advisor không tự tạo sản phẩm, giá hoặc claim ngoài catalog.

## 5. Frontend đã cập nhật

Frontend nằm trong `frontend/` và đã được bổ sung:

- HTTP repositories cho catalog, traceability và Advisor.
- Cờ `NEXT_PUBLIC_DATA_SOURCE=mock|http` để đổi nguồn dữ liệu.
- Checkout gọi backend khi `NEXT_PUBLIC_ENABLE_CHECKOUT=true`.
- Payload checkout chỉ gửi product/variant/grind/quantity, không gửi đơn giá.
- Cart chỉ được xóa sau khi API xác nhận thành công.
- Trang thành công hiển thị mã đơn do backend tạo.
- ApiClient dùng `cache: no-store` cho dữ liệu HTTP.
- Font Fraunces và Manrope được self-host bằng `@fontsource` để build không phụ thuộc Google Fonts.
- `frontend/vercel.json` và `.env.production.example` phục vụ triển khai Vercel.

## 6. Docker và triển khai cloud

Các tệp chính:

- `docker/backend.Dockerfile`
- `docker/backend-entrypoint.sh`
- `docker/compose.yml`
- `docker/.env.example`
- `docs/deployment.md`

Đặc điểm Compose:

- PostgreSQL không publish port ra host.
- Backend chỉ bind `127.0.0.1:8000` để Caddy cùng máy chủ truy cập.
- PostgreSQL dùng named volume `dau-vi_postgres_data`.
- Backend chạy user không có quyền root.
- Backend dùng read-only filesystem, `tmpfs /tmp` và `no-new-privileges`.
- Có healthcheck cho cả database và backend.
- Entry point tự chạy Alembic migration và seed trước Uvicorn.
- Caddy/DuckDNS không nằm trong Compose.

Lệnh triển khai backend/database:

```powershell
Copy-Item docker/.env.example docker/.env
# Sửa toàn bộ giá trị production trong docker/.env
docker compose --env-file docker/.env -f docker/compose.yml config
docker compose --env-file docker/.env -f docker/compose.yml up -d --build
docker compose --env-file docker/.env -f docker/compose.yml ps
```

Caddyfile mẫu:

```caddyfile
api.<duckdns-domain> {
    reverse_proxy 127.0.0.1:8000
}
```

Biến cần đặt trên Vercel:

```dotenv
NEXT_PUBLIC_SITE_URL=https://<vercel-domain>
NEXT_PUBLIC_API_BASE_URL=https://api.<duckdns-domain>/api/v1
NEXT_PUBLIC_DATA_SOURCE=http
NEXT_PUBLIC_ENABLE_CHECKOUT=true
NEXT_PUBLIC_ENABLE_AUTH=false
```

## 7. Kiểm thử đã thực hiện

| Hạng mục | Kết quả |
| --- | --- |
| Backend Ruff | Đạt |
| Backend Pytest | 6/6 test đạt |
| Frontend ESLint | Đạt |
| Frontend TypeScript | Đạt |
| Frontend Vitest | 24/24 test, 8 file đạt |
| Next.js production build | Đạt, 18 route |
| Docker Compose config | Hợp lệ |
| Docker backend image build | Đạt |
| PostgreSQL migration | Đạt |
| Seed | 6 sản phẩm, 6 lô |
| Backend readiness | `status=ready`, `database=ok` |
| Catalog qua container | Trả đủ 6 sản phẩm |

Sau kiểm thử tích hợp, container, network và volume thử nghiệm `dau-vi_postgres_data` đã được xóa. Image `dau-vi-backend:latest` vẫn được giữ.

## 8. Báo cáo và tài nguyên minh họa

File báo cáo chính:

`docs/Lưu Phạm Vĩnh Tùng - Đồ án cơ sở - DẤU VỊ.docx`

Bản gốc được giữ tại:

`docs/Lưu Phạm Vĩnh Tùng - Đồ án cơ sở - DẤU VỊ - backup trước cập nhật 2026-07-19.docx`

Theo yêu cầu cuối cùng, báo cáo được tạo lại từ bản gốc và chỉ nội dung nằm giữa tiêu đề Chương 4 và tiêu đề Kết luận được thay thế. Các phần sau được giữ nguyên từ bản gốc:

- Bìa và nhiệm vụ đồ án.
- Lời cảm ơn, lời mở đầu và phiếu chấm.
- Mục lục, danh mục hình, danh mục bảng và danh mục viết tắt.
- Toàn bộ Chương 1, Chương 2 và Chương 3.
- Tiêu đề và nội dung từ phần Kết luận trở đi.
- Khổ giấy, lề, header/footer, style, font và cỡ chữ của tài liệu gốc.

Chương 4 được bổ sung:

- Kết quả frontend Next.js.
- Backend FastAPI.
- PostgreSQL, migration và seed.
- Coffee Advisor.
- Checkout COD và idempotency.
- Ảnh giao diện thực tế.
- Docker Compose.
- Vercel, DuckDNS và Caddy.
- Bảng biến môi trường.
- Kết quả kiểm thử.
- Các hạn chế hiện tại.

Tài nguyên tự tạo nằm tại:

- `docs/report-assets/diagrams/`: năm sơ đồ PNG/SVG.
- `docs/report-assets/screenshots/`: bốn ảnh chụp production build.
- `docs/tools/generate_report_diagrams.py`: script sinh sơ đồ.
- `docs/tools/inspect_report.py`: script kiểm tra cấu trúc DOCX.
- `docs/tools/update_report.py`: script khôi phục bản gốc và chỉ cập nhật Chương 4.

## 9. Việc cần làm khi deploy thật

1. Điền `docker/.env` bằng mật khẩu và domain thật.
2. Chạy Compose trên cloud.
3. Kiểm tra `https://api.<duckdns-domain>/health/ready` qua Caddy.
4. Đặt các biến `NEXT_PUBLIC_*` trên Vercel.
5. Redeploy frontend.
6. Kiểm tra CORS bằng đúng domain Vercel production/preview cần dùng.
7. Thiết lập backup định kỳ cho PostgreSQL volume.
8. Không commit `docker/.env`, secret hoặc dump database.

Chi tiết vận hành và backup/restore xem tại `docs/deployment.md`.

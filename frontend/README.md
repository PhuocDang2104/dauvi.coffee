# DẤU VỊ — Vietnam Traceable Coffee

Frontend Next.js cho bộ sưu tập sáu dòng cà phê Việt Nam đóng gói, tập trung vào nguồn gốc theo vùng, hồ sơ lô, lựa chọn theo khẩu vị và pha tại nhà.

## Chạy local

Yêu cầu Node.js 20.9+ và pnpm 11.

```bash
pnpm install
pnpm dev
```

Mở `http://localhost:3000`.

Kiểm tra chất lượng:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm exec playwright install chromium
pnpm test:e2e
```

## Biến môi trường

Sao chép `.env.example` thành `.env.local` khi cần thay đổi cấu hình:

```dotenv
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_DATA_SOURCE=mock
NEXT_PUBLIC_ENABLE_CHECKOUT=false
NEXT_PUBLIC_ENABLE_AUTH=false
```

`NEXT_PUBLIC_DATA_SOURCE=mock` dùng dữ liệu in-memory đã qua Zod. Chuyển sang `http` sẽ dùng HTTP repositories và không tự fallback về mock.

## Routes

- `/` — editorial landing page.
- `/shop` — search, filter URL, sort và quick view.
- `/shop/[slug]` — sáu product detail với variants, grind và add-to-cart.
- `/traceability` — lookup và evidence education.
- `/traceability/[lotCode]` — lot passport demo.
- `/advisor` — quiz rule-based sáu bước.
- `/story`, `/brew-guide` — nội dung thương hiệu và hướng dẫn pha.
- `/cart`, `/checkout` — giỏ local persisted và checkout COD demo.

## Kiến trúc

- App Router và React Server Components là mặc định; client boundaries chỉ dùng cho filter, dialog, purchase, cart, Advisor và form.
- Domain theo feature trong `src/features/*/domain`.
- Pages chỉ gọi `getRepositories()`; không import `src/mocks`.
- `ProductRepository`, `TraceabilityRepository`, `AdvisorRepository` đều có mock và HTTP implementation.
- Product/lot/advisor external payload được parse bằng Zod.
- Cart dùng Zustand persist key `vtc-cart-v1`, version 1, hydrate sau mount.
- CSS product packs và local SVG thay thế ảnh sản phẩm thật; không có hotlink.
- Evidence levels luôn tách `verified`, `supplier-declared`, `reference`, `demo`.

Chi tiết thêm: [API contracts](../docs/api-contracts.md), [content model](../docs/content-model.md), [design decisions](../docs/design-decisions.md), [backend TODOs](../docs/backend-todos.md).

## Tính trung thực dữ liệu

Toàn bộ farm, cooperative, parcel và lot trong MVP là dữ liệu mô phỏng. UI hiển thị disclosure bắt buộc và không có rating, review, chứng nhận, carbon footprint hay environmental claim giả.

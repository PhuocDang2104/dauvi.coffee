# Vietnam Traceable Coffee — reserved API contracts

Tài liệu này mô tả điểm nối REST dành cho backend tương lai. Frontend MVP mặc định dùng `NEXT_PUBLIC_DATA_SOURCE=mock`; không có Next.js API route giả và không tự fallback từ HTTP về mock.

Base URL mặc định: `http://localhost:8000/api/v1`.

## Quy ước chung

- Request và response dùng `application/json; charset=utf-8`.
- Giá tiền là số nguyên VND, không dùng số thực.
- Ngày dùng ISO `YYYY-MM-DD`.
- Mã lô không phân biệt hoa thường ở đầu vào; backend trả về dạng uppercase chuẩn hóa.
- Response có thể trả payload trực tiếp hoặc bọc trong `{ "data": ... }` cho các endpoint product/lot. Advisor dùng envelope cố định bên dưới.
- Lỗi dùng HTTP status phù hợp và body `{ "message": string, "code"?: string }`.
- `404` ở product/lot được frontend chuyển thành trạng thái not-found; các lỗi khác đi qua error boundary.

## Products

### `GET /products`

Query parameters:

| Key | Kiểu | Giá trị |
|---|---|---|
| `q` | string | Từ khóa đã URL encode |
| `species` | string hoặc lặp key | `robusta`, `arabica`, `blend` |
| `region` | string hoặc lặp key | Region slug |
| `process` | string hoặc lặp key | `natural`, `washed`, `honey` |
| `roast` | string hoặc lặp key | Roast level slug |
| `brew` | string hoặc lặp key | Brew method slug |
| `price` | string hoặc lặp key | `under-120000`, `120000-160000`, `over-160000` |
| `format` | string hoặc lặp key | `whole-bean`, `ground`, `drip-bag` |
| `minPrice` / `maxPrice` | integer | VND |
| `sort` | string | `featured`, `price-asc`, `price-desc`, `roast-asc`, `robusta-first`, `arabica-first` |

Response: `Product[]`.

### `GET /products/{slug}`

Response: `Product`. Trả `404` nếu slug không tồn tại hoặc chưa published.

### `GET /products/featured`

Response: `Product[]` theo thứ tự biên tập.

### Product shape

```ts
interface Product {
  id: string;
  slug: string;
  displayName: string;
  shortName: string;
  proposition: string;
  species: "robusta" | "arabica" | "blend";
  scientificName: string;
  variety: string;
  segment: string;
  role: "bestseller" | "signature" | "fine-robusta" | "local-story" | "gateway-arabica" | "premium";
  regionId: string;
  regionLabel: string;
  altitudeLabel: string;
  process: "natural" | "washed" | "honey";
  roastLevel: "light" | "light-medium" | "medium" | "medium-dark" | "dark";
  flavor: {
    bitterness: 1 | 2 | 3 | 4 | 5;
    acidity: 1 | 2 | 3 | 4 | 5;
    sweetness: 1 | 2 | 3 | 4 | 5;
    body: 1 | 2 | 3 | 4 | 5;
    aroma: 1 | 2 | 3 | 4 | 5;
    notes: string[];
    caffeine: "medium" | "high";
  };
  brewMethods: string[];
  story: string;
  varietyFacts: string[];
  badges: string[];
  accent: string;
  pattern: string;
  image: { src: string; alt: string };
  variants: ProductVariant[];
  featuredLotCode: string;
  published: boolean;
}

interface ProductVariant {
  id: string;
  sku: string;
  format: "whole-bean" | "ground" | "drip-bag";
  weightGrams?: 250 | 500;
  dripBagCount?: 10 | 20;
  dripBagWeightGrams?: 12;
  grindOptions: Array<"whole-bean" | "phin" | "espresso" | "pour-over" | "french-press" | "moka-pot">;
  price: { amount: number; currency: "VND" };
  compareAtPrice?: { amount: number; currency: "VND" };
  inStock: boolean;
}
```

## Traceability

### `GET /lots/{lotCode}`

Response: `CoffeeLot`. Trả `404` nếu mã không tồn tại.

### `GET /lots/featured`

Response: `CoffeeLot[]`.

Mỗi `CoffeeLot` gồm thông tin vùng/đơn vị sản xuất, `variety`, niên vụ, process, ngày rang/đóng gói, `evidenceLevel`, disclosure, bảng `evidence` và đúng sáu `timeline` stage: `farm`, `harvest`, `processing`, `green-bean`, `roasting`, `packaging`.

Trong dữ liệu MVP, mọi lot có `evidenceLevel: "demo"` và disclosure bắt buộc:

> Dữ liệu lô và đơn vị sản xuất đang được mô phỏng cho mục đích trình diễn đồ án.

Backend không được nâng dữ liệu mô phỏng thành `verified` nếu chưa có nguồn xác minh tương ứng.

## Coffee Advisor

### `POST /advisor/recommendations`

Body:

```ts
interface AdvisorPreferences {
  intensity: "light" | "balanced" | "bold";
  bitterness: "low" | "medium" | "high";
  acidity: "low" | "medium" | "high";
  caffeine: "medium" | "high";
  brewMethod: string;
  format: "whole-bean" | "ground" | "drip-bag";
  budgetMax?: number;
  priorities: Array<"everyday" | "traceability" | "local-variety" | "premium" | "budget-friendly" | "quick-brew" | "easy-to-brew">;
}
```

Response:

```ts
interface AdvisorResponse {
  recommendations: Array<{
    productId: string;
    score: number; // 0–100
    reasons: Array<{
      title: string;
      description: string;
      matchType: "taste" | "brew" | "budget" | "origin";
    }>;
  }>;
}
```

Frontend ghép `productId` với catalog để tạo `ProductRecommendation`. Backend hiện
dùng cùng bộ quy tắc xác định và có thể được thay bằng AI/RAG ở giai đoạn sau mà
không đổi response contract.

## Cart và checkout

```http
GET    /cart
POST   /cart/items
PATCH  /cart/items/{itemId}
DELETE /cart/items/{itemId}
POST   /orders
```

Cart vẫn được lưu localStorage bằng key/version `vtc-cart-v1`; các endpoint cart
server-side được giữ cho giai đoạn có tài khoản.

### `POST /orders`

Header tùy chọn nhưng được khuyến nghị:

```http
Idempotency-Key: <8-100 ký tự A-Z, a-z, 0-9, ., _, :, ->
```

Body:

```ts
interface OrderCreate {
  fullName: string;
  phone: string; // số Việt Nam, backend chuẩn hóa dấu cách/dấu chấm
  email?: string;
  province: string;
  district: string;
  ward: string;
  address: string;
  deliveryNote?: string;
  shippingMethod: "standard";
  paymentMethod: "cod";
  acceptDemo: true;
  items: Array<{
    productId: string;
    variantId: string;
    quantity: number; // 1–99
    grind?: string;
  }>;
}
```

Frontend không gửi `unitPrice` trong request. Backend kiểm tra product/variant,
stock và grind, sau đó tính lại subtotal từ PostgreSQL. Phí giao hàng demo là
30.000 VND và bằng 0 khi subtotal từ 499.000 VND.

Response `201`:

```ts
interface OrderResponse {
  orderCode: string;
  recipientName: string;
  itemCount: number;
  subtotal: number;
  shippingFee: number;
  total: number;
  status: "demo-confirmed";
  createdAt: string;
}
```

Gửi lại cùng `Idempotency-Key` trả cùng đơn, không tạo bản ghi trùng. Endpoint chỉ
lưu đơn trình diễn; không thu dữ liệu thẻ, không gọi vận chuyển và không trừ tồn
kho.

## Authentication

Frontend bật luồng thật bằng `NEXT_PUBLIC_ENABLE_AUTH=true`. Backend dùng
cookie phiên `HttpOnly; Secure; SameSite=Lax` (hoặc `SameSite=None` khi frontend
và API thực sự cross-site), không trả access token để frontend lưu vào
`localStorage`. Mọi request auth dùng `credentials: include`.

Backend đã triển khai session PostgreSQL, Argon2id, rotation khi đăng nhập,
kiểm tra Origin và rate limit theo email + IP đã băm.

```http
POST /auth/register
POST /auth/login
GET  /auth/session
POST /auth/logout
```

Body đăng ký:

```ts
{ fullName: string; email: string; password: string; acceptTerms: true }
```

Body đăng nhập:

```ts
{ email: string; password: string; remember: boolean }
```

Response cho register/login/session:

```ts
{ user: { id: string; email: string; fullName: string } }
```

Backend không log password/cookie. Khi deploy Vercel, frontend gọi endpoint qua
same-origin rewrite `/backend-api`; CORS vẫn giữ danh sách origin chính xác.

## Coffee Assistant

Backend đã có rule set catalog-aware. Frontend mặc định dùng rule set local; khi bật
`NEXT_PUBLIC_ENABLE_CHATBOT_API=true`, widget gọi:

```http
POST /assistant/messages
```

Body `{ "message": string }`; response:

```ts
{
  message: string;
  actions: Array<{ label: string; href: `/${string}` }>;
}
```

Response hiện không gọi LLM, chỉ trả action route nội bộ tồn tại trong catalog và
không tự tạo claim sản phẩm hoặc môi trường.

## Healthcheck

```http
GET /health/live
GET /health/ready
```

`/health/ready` chỉ trả `200` khi backend kết nối được PostgreSQL.

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

Frontend ghép `productId` với catalog để tạo `ProductRecommendation`. MVP dùng rule engine TypeScript; endpoint này là chỗ thay thế bằng AI/RAG ở giai đoạn sau.

## Cart và checkout — dành cho backend tương lai

```http
GET    /cart
POST   /cart/items
PATCH  /cart/items/{itemId}
DELETE /cart/items/{itemId}
POST   /orders
```

Cart MVP được lưu localStorage bằng key/version `vtc-cart-v1`. `POST /orders` chưa được gọi và checkout hiện tại không thu thông tin thẻ. Khi tích hợp, cart item phải giữ `productId`, `variantId`, grind, quantity và đơn giá snapshot.


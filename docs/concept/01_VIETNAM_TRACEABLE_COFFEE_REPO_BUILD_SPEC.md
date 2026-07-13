# VIETNAM TRACEABLE COFFEE — FRONTEND REPOSITORY BUILD SPEC

> **Mục đích:** Tài liệu này là prompt kỹ thuật hoàn chỉnh để một coding agent dựng repository frontend cho website bán cà phê đóng gói **Vietnam Traceable Coffee Collection**.  
> **Giai đoạn hiện tại:** Chỉ dựng frontend Next.js hoàn chỉnh với dữ liệu mock; kiến trúc phải chừa sẵn điểm nối backend, chatbot AI, authentication, order và admin trong giai đoạn sau.

---

## 0. Chỉ thị dành cho coding agent

Bạn là **Senior Frontend Engineer + Frontend Architect**. Hãy tạo một repository production-oriented, có cấu trúc rõ ràng, dễ mở rộng, có typing nghiêm ngặt và có thể nối backend mà không phải viết lại UI.

### Kết quả bắt buộc

- Dựng ứng dụng Next.js App Router bằng TypeScript.
- Dựng đầy đủ các trang public quan trọng, luồng sản phẩm, traceability, AI advisor mock, cart và checkout UI.
- Dùng dữ liệu mock có type, schema validation và repository abstraction.
- Server Components là mặc định; chỉ dùng Client Components cho tương tác thực sự.
- Không gọi API backend thật ở phiên bản đầu.
- Không hard-code dữ liệu sản phẩm trực tiếp trong JSX.
- Không tạo các route API giả trong Next.js để “đóng vai backend”; hãy dùng mock data source ở tầng repository.
- Code phải chạy được sau:
  ```bash
  pnpm install
  pnpm dev
  pnpm build
  ```
- Không để TypeScript error, ESLint error nghiêm trọng, import chết hoặc component chưa hoàn thiện.
- Tất cả nội dung UI hiển thị bằng tiếng Việt; code, biến, type và tên file dùng tiếng Anh.
- Thiết kế responsive, accessibility tốt, không dùng hiệu ứng nặng hoặc 3D.

---

# 1. Product brief

## 1.1. Concept

**Vietnam Traceable Coffee Collection** là website bán cà phê Việt Nam đóng gói để pha tại nhà, gồm:

- Cà phê hạt rang.
- Cà phê bột xay theo dụng cụ.
- Drip bag.
- Quy cách 250 g và 500 g.
- Các mức xay: nguyên hạt, phin, espresso, pour-over, French press, moka pot.

Bộ sưu tập tập trung vào các giống đang được trồng tại Việt Nam, trải dài từ Robusta Tây Nguyên đến Arabica cao nguyên Lâm Đồng. Mỗi sản phẩm có câu chuyện riêng về giống, vùng trồng, sơ chế, rang, hương vị và lô hàng.

## 1.2. Điểm khác biệt

- Nguồn gốc Việt Nam rõ ràng.
- Truy xuất theo lô.
- Hỗ trợ chọn theo khẩu vị và cách pha.
- Minh bạch dữ liệu môi trường.
- Chatbot/AI advisor chỉ gợi ý sản phẩm có trong catalog.
- Nội dung giáo dục ngắn gọn, không biến website thành trang học thuật.

## 1.3. Sáu sản phẩm MVP

1. TRS1 Tây Nguyên Daily Phin.
2. TR4 Đắk Lắk Traceable Robusta.
3. TR9 Large Bean Fine Robusta.
4. Xanh Lùn TS5 Bảo Lâm Honey.
5. Catimor Đà Lạt Washed.
6. Bourbon Langbiang Honey.

---

# 2. MVP scope

## 2.1. Phải triển khai

- Trang chủ.
- Trang collection/shop.
- Trang chi tiết sản phẩm.
- Bộ lọc và tìm kiếm sản phẩm phía client.
- Trang traceability tổng quan.
- Trang chi tiết lô.
- Trang câu chuyện thương hiệu.
- Trang brew guide.
- Trang AI Coffee Advisor dạng quiz/chat mock.
- Cart drawer và cart page.
- Checkout UI mock.
- Responsive desktop/tablet/mobile.
- Loading, empty, error và not-found states.
- SEO metadata cơ bản.
- JSON-LD cho Product, Breadcrumb và Organization ở mức frontend.
- Data layer có khả năng chuyển từ mock sang HTTP API.
- Unit test cho recommendation logic.
- E2E smoke test cho các luồng chính.

## 2.2. Chưa triển khai backend thật

- Đăng nhập thật.
- Thanh toán thật.
- Quản lý tồn kho thật.
- Đồng bộ giỏ hàng lên server.
- Admin dashboard.
- Chatbot LLM/RAG thật.
- Upload ảnh.
- QR scanner bằng camera.
- CMS.

Các điểm này phải được biểu diễn bằng interface, placeholder route hoặc TODO có tổ chức, không được viết logic giả lẫn vào production UI.

---

# 3. Technical stack

## 3.1. Core

- Next.js App Router.
- TypeScript với `strict: true`.
- React Server Components mặc định.
- Tailwind CSS.
- shadcn/ui cho primitive components.
- Lucide React cho icon.
- Zod cho schema validation.
- Zustand với persist middleware cho cart và một số UI state nhỏ.
- React Hook Form + Zod Resolver cho checkout và quiz form.
- Motion for React hoặc CSS transitions cho animation nhẹ.
- Vitest + Testing Library cho unit/component tests.
- Playwright cho E2E.

## 3.2. Package manager

- Dùng `pnpm`.
- Commit `pnpm-lock.yaml`.

## 3.3. Không dùng

- Redux cho MVP.
- Một UI framework nặng như Ant Design hoặc Material UI.
- CSS-in-JS runtime.
- Dữ liệu JSON không có type/schema.
- Component client ở cấp page nếu không cần.
- Hiệu ứng parallax nặng, WebGL hoặc autoplay video.

---

# 4. Repository structure

```text
vietnam-traceable-coffee/
├─ .env.example
├─ .gitignore
├─ components.json
├─ eslint.config.mjs
├─ next.config.ts
├─ package.json
├─ playwright.config.ts
├─ postcss.config.mjs
├─ README.md
├─ tsconfig.json
├─ vitest.config.ts
├─ public/
│  ├─ brand/
│  │  ├─ logo-mark.svg
│  │  ├─ logo-wordmark.svg
│  │  └─ favicon.svg
│  ├─ images/
│  │  ├─ hero/
│  │  ├─ products/
│  │  ├─ regions/
│  │  ├─ processes/
│  │  └─ placeholders/
│  ├─ patterns/
│  │  ├─ contour-lines.svg
│  │  ├─ coffee-dots.svg
│  │  └─ vietnam-route.svg
│  └─ manifest.webmanifest
├─ src/
│  ├─ app/
│  │  ├─ (storefront)/
│  │  │  ├─ layout.tsx
│  │  │  ├─ page.tsx
│  │  │  ├─ shop/
│  │  │  │  ├─ page.tsx
│  │  │  │  ├─ loading.tsx
│  │  │  │  └─ [slug]/
│  │  │  │     ├─ page.tsx
│  │  │  │     ├─ loading.tsx
│  │  │  │     └─ not-found.tsx
│  │  │  ├─ traceability/
│  │  │  │  ├─ page.tsx
│  │  │  │  └─ [lotCode]/
│  │  │  │     ├─ page.tsx
│  │  │  │     └─ not-found.tsx
│  │  │  ├─ advisor/
│  │  │  │  └─ page.tsx
│  │  │  ├─ story/
│  │  │  │  └─ page.tsx
│  │  │  └─ brew-guide/
│  │  │     └─ page.tsx
│  │  ├─ (commerce)/
│  │  │  ├─ cart/
│  │  │  │  └─ page.tsx
│  │  │  └─ checkout/
│  │  │     └─ page.tsx
│  │  ├─ error.tsx
│  │  ├─ global-error.tsx
│  │  ├─ globals.css
│  │  ├─ icon.svg
│  │  ├─ layout.tsx
│  │  ├─ loading.tsx
│  │  ├─ not-found.tsx
│  │  ├─ opengraph-image.tsx
│  │  ├─ robots.ts
│  │  └─ sitemap.ts
│  ├─ components/
│  │  ├─ brand/
│  │  │  ├─ brand-logo.tsx
│  │  │  ├─ eco-evidence-badge.tsx
│  │  │  ├─ lot-stamp.tsx
│  │  │  ├─ region-chip.tsx
│  │  │  └─ traceability-seal.tsx
│  │  ├─ feedback/
│  │  │  ├─ empty-state.tsx
│  │  │  ├─ error-state.tsx
│  │  │  ├─ page-skeleton.tsx
│  │  │  └─ product-card-skeleton.tsx
│  │  ├─ layout/
│  │  │  ├─ announcement-bar.tsx
│  │  │  ├─ desktop-header.tsx
│  │  │  ├─ mobile-bottom-nav.tsx
│  │  │  ├─ mobile-header.tsx
│  │  │  ├─ site-footer.tsx
│  │  │  └─ site-header.tsx
│  │  ├─ seo/
│  │  │  ├─ breadcrumb-json-ld.tsx
│  │  │  ├─ organization-json-ld.tsx
│  │  │  └─ product-json-ld.tsx
│  │  └─ ui/
│  │     └─ ...shadcn primitives
│  ├─ config/
│  │  ├─ brand.ts
│  │  ├─ navigation.ts
│  │  ├─ seo.ts
│  │  └─ site.ts
│  ├─ content/
│  │  ├─ brew-methods.ts
│  │  ├─ home.ts
│  │  ├─ regions.ts
│  │  ├─ story.ts
│  │  └─ sustainability.ts
│  ├─ features/
│  │  ├─ advisor/
│  │  │  ├─ components/
│  │  │  │  ├─ advisor-chat-shell.tsx
│  │  │  │  ├─ advisor-progress.tsx
│  │  │  │  ├─ preference-chip.tsx
│  │  │  │  ├─ recommendation-card.tsx
│  │  │  │  └─ recommendation-reasons.tsx
│  │  │  ├─ domain/
│  │  │  │  ├─ advisor.types.ts
│  │  │  │  ├─ advisor.schema.ts
│  │  │  │  └─ score-products.ts
│  │  │  ├─ repositories/
│  │  │  │  ├─ advisor.repository.ts
│  │  │  │  ├─ http-advisor.repository.ts
│  │  │  │  └─ mock-advisor.repository.ts
│  │  │  └─ index.ts
│  │  ├─ cart/
│  │  │  ├─ components/
│  │  │  │  ├─ cart-drawer.tsx
│  │  │  │  ├─ cart-item-row.tsx
│  │  │  │  ├─ cart-summary.tsx
│  │  │  │  └─ mini-cart-button.tsx
│  │  │  ├─ domain/
│  │  │  │  ├─ cart.types.ts
│  │  │  │  └─ cart.schema.ts
│  │  │  ├─ stores/
│  │  │  │  └─ use-cart-store.ts
│  │  │  └─ index.ts
│  │  ├─ checkout/
│  │  │  ├─ components/
│  │  │  │  ├─ checkout-form.tsx
│  │  │  │  ├─ checkout-progress.tsx
│  │  │  │  └─ order-preview.tsx
│  │  │  ├─ domain/
│  │  │  │  ├─ checkout.schema.ts
│  │  │  │  └─ checkout.types.ts
│  │  │  └─ index.ts
│  │  ├─ products/
│  │  │  ├─ components/
│  │  │  │  ├─ add-to-cart-panel.tsx
│  │  │  │  ├─ flavor-profile.tsx
│  │  │  │  ├─ grind-selector.tsx
│  │  │  │  ├─ process-pill.tsx
│  │  │  │  ├─ product-card.tsx
│  │  │  │  ├─ product-card-grid.tsx
│  │  │  │  ├─ product-detail-gallery.tsx
│  │  │  │  ├─ product-filter-bar.tsx
│  │  │  │  ├─ product-filter-sheet.tsx
│  │  │  │  ├─ product-quick-view.tsx
│  │  │  │  ├─ product-sort.tsx
│  │  │  │  ├─ product-variant-picker.tsx
│  │  │  │  └─ related-products.tsx
│  │  │  ├─ domain/
│  │  │  │  ├─ product.mappers.ts
│  │  │  │  ├─ product.schema.ts
│  │  │  │  ├─ product.types.ts
│  │  │  │  └─ product.utils.ts
│  │  │  ├─ repositories/
│  │  │  │  ├─ http-product.repository.ts
│  │  │  │  ├─ mock-product.repository.ts
│  │  │  │  └─ product.repository.ts
│  │  │  └─ index.ts
│  │  ├─ search/
│  │  │  ├─ components/
│  │  │  │  ├─ command-search.tsx
│  │  │  │  └─ search-trigger.tsx
│  │  │  └─ domain/
│  │  │     └─ normalize-search.ts
│  │  └─ traceability/
│  │     ├─ components/
│  │     │  ├─ evidence-level-card.tsx
│  │     │  ├─ farm-origin-card.tsx
│  │     │  ├─ lot-lookup-form.tsx
│  │     │  ├─ lot-summary.tsx
│  │     │  ├─ origin-map.tsx
│  │     │  ├─ process-timeline.tsx
│  │     │  ├─ traceability-passport.tsx
│  │     │  └─ transparency-table.tsx
│  │     ├─ domain/
│  │     │  ├─ traceability.schema.ts
│  │     │  └─ traceability.types.ts
│  │     ├─ repositories/
│  │     │  ├─ http-traceability.repository.ts
│  │     │  ├─ mock-traceability.repository.ts
│  │     │  └─ traceability.repository.ts
│  │     └─ index.ts
│  ├─ lib/
│  │  ├─ api/
│  │  │  ├─ api-client.ts
│  │  │  ├─ api-error.ts
│  │  │  ├─ endpoints.ts
│  │  │  └─ request.ts
│  │  ├─ data-source/
│  │  │  ├─ create-repositories.ts
│  │  │  └─ mode.ts
│  │  ├─ format/
│  │  │  ├─ currency.ts
│  │  │  ├─ date.ts
│  │  │  └─ text.ts
│  │  ├─ analytics/
│  │  │  └─ events.ts
│  │  ├─ constants.ts
│  │  ├─ env.ts
│  │  └─ utils.ts
│  ├─ mocks/
│  │  ├─ data/
│  │  │  ├─ lots.ts
│  │  │  ├─ products.ts
│  │  │  └─ regions.ts
│  │  └─ factories/
│  │     ├─ lot.factory.ts
│  │     └─ product.factory.ts
│  ├─ styles/
│  │  ├─ animations.css
│  │  └─ tokens.css
│  └─ types/
│     └─ common.ts
├─ tests/
│  ├─ e2e/
│  │  ├─ advisor.spec.ts
│  │  ├─ cart.spec.ts
│  │  ├─ product-discovery.spec.ts
│  │  └─ traceability.spec.ts
│  └─ unit/
│     ├─ score-products.test.ts
│     └─ product-utils.test.ts
└─ docs/
   ├─ api-contracts.md
   ├─ content-model.md
   └─ design-decisions.md
```

---

# 5. Route map

| Route | Mục đích | Rendering |
|---|---|---|
| `/` | Landing page, brand story, collection highlights | Server Component |
| `/shop` | Danh mục, filter, search, sort | Server shell + client filter |
| `/shop/[slug]` | Chi tiết sản phẩm | Server Component + client purchase panel |
| `/traceability` | Tra cứu mã lô, giới thiệu truy xuất | Server shell + client form |
| `/traceability/[lotCode]` | Hồ sơ truy xuất của lô | Server Component |
| `/advisor` | AI Coffee Advisor mock | Client interaction |
| `/story` | From the Highlands of Vietnam | Server Component |
| `/brew-guide` | Hướng dẫn chọn kiểu xay/cách pha | Server Component |
| `/cart` | Giỏ hàng | Client |
| `/checkout` | Form thanh toán mock | Client form |
| `/not-found` | Trạng thái không tìm thấy | Server |

### Query params cho `/shop`

- `q`
- `species`
- `region`
- `process`
- `roast`
- `brew`
- `price`
- `sort`

Ví dụ:

```text
/shop?species=robusta&region=dak-lak&process=honey&sort=price-asc
```

URL phải phản ánh filter để có thể chia sẻ và dùng nút Back/Forward.

---

# 6. Domain model

## 6.1. Common types

```ts
export type Species = "robusta" | "arabica" | "blend";
export type ProcessMethod = "natural" | "washed" | "honey";
export type RoastLevel =
  | "light"
  | "light-medium"
  | "medium"
  | "medium-dark"
  | "dark";

export type BrewMethod =
  | "phin"
  | "espresso"
  | "pour-over"
  | "aeropress"
  | "french-press"
  | "moka-pot"
  | "cold-brew"
  | "drip";

export type GrindType =
  | "whole-bean"
  | "phin"
  | "espresso"
  | "pour-over"
  | "french-press"
  | "moka-pot";

export type EvidenceLevel =
  | "verified"
  | "supplier-declared"
  | "reference"
  | "demo";

export type ProductRole =
  | "bestseller"
  | "signature"
  | "fine-robusta"
  | "local-story"
  | "gateway-arabica"
  | "premium";
```

## 6.2. Product

```ts
export interface Money {
  amount: number;
  currency: "VND";
}

export interface ProductVariant {
  id: string;
  sku: string;
  format: "whole-bean" | "ground" | "drip-bag";
  weightGrams?: 250 | 500;
  dripBagCount?: 10 | 20;
  dripBagWeightGrams?: 12;
  grindOptions: GrindType[];
  price: Money;
  compareAtPrice?: Money;
  inStock: boolean;
}

export interface FlavorProfile {
  bitterness: 1 | 2 | 3 | 4 | 5;
  acidity: 1 | 2 | 3 | 4 | 5;
  sweetness: 1 | 2 | 3 | 4 | 5;
  body: 1 | 2 | 3 | 4 | 5;
  aroma: 1 | 2 | 3 | 4 | 5;
  notes: string[];
  caffeine: "medium" | "high";
}

export interface Product {
  id: string;
  slug: string;
  displayName: string;
  shortName: string;
  species: Species;
  scientificName: string;
  variety: string;
  segment: string;
  role: ProductRole;
  regionId: string;
  regionLabel: string;
  altitudeLabel: string;
  process: ProcessMethod;
  roastLevel: RoastLevel;
  flavor: FlavorProfile;
  brewMethods: BrewMethod[];
  story: string;
  varietyFacts: string[];
  badges: string[];
  image: {
    src: string;
    alt: string;
  };
  variants: ProductVariant[];
  featuredLotCode: string;
  published: boolean;
}
```

## 6.3. Traceability

```ts
export interface EvidenceItem {
  key: string;
  label: string;
  value: string;
  level: EvidenceLevel;
  sourceLabel?: string;
  sourceReference?: string;
  verifiedAt?: string;
}

export interface TraceabilityEvent {
  id: string;
  stage:
    | "farm"
    | "harvest"
    | "processing"
    | "green-bean"
    | "roasting"
    | "packaging";
  title: string;
  dateLabel: string;
  description: string;
}

export interface CoffeeLot {
  lotCode: string;
  productId: string;
  status: "available" | "sold-out" | "archived";
  farmName: string;
  cooperativeName?: string;
  province: string;
  district: string;
  altitudeLabel: string;
  harvestYear: number;
  process: ProcessMethod;
  roastDate: string;
  packagingDate: string;
  evidenceLevel: EvidenceLevel;
  demoDisclosure: string;
  evidence: EvidenceItem[];
  timeline: TraceabilityEvent[];
}
```

## 6.4. Advisor

```ts
export interface AdvisorPreferences {
  intensity: "light" | "balanced" | "bold";
  bitterness: "low" | "medium" | "high";
  acidity: "low" | "medium" | "high";
  caffeine: "medium" | "high";
  brewMethod: BrewMethod;
  format: "whole-bean" | "ground" | "drip-bag";
  budgetMax?: number;
  priorities: Array<
    "traceability" | "local-variety" | "easy-to-brew" | "premium"
  >;
}

export interface RecommendationReason {
  title: string;
  description: string;
  matchType: "taste" | "brew" | "budget" | "origin";
}

export interface ProductRecommendation {
  product: Product;
  score: number;
  reasons: RecommendationReason[];
}
```

---

# 7. Seed product catalog

Tạo file `src/mocks/data/products.ts` từ sáu sản phẩm sau. Mọi thông tin trang trại và lô trong bản frontend phải gắn `evidenceLevel: "demo"` và hiển thị dòng:

> “Dữ liệu lô và đơn vị sản xuất đang được mô phỏng cho mục đích trình diễn đồ án.”

## 7.1. Price matrix

| Product | 250 g | 500 g | Drip bag |
|---|---:|---:|---:|
| TRS1 Tây Nguyên Daily Phin | 99.000 ₫ | 185.000 ₫ | — |
| TR4 Đắk Lắk Traceable Robusta | 119.000 ₫ | 219.000 ₫ | — |
| TR9 Large Bean Fine Robusta | 139.000 ₫ | 259.000 ₫ | — |
| Xanh Lùn TS5 Bảo Lâm Honey | 159.000 ₫ | 299.000 ₫ | — |
| Catimor Đà Lạt Washed | 139.000 ₫ | 259.000 ₫ | 129.000 ₫ / 10 gói |
| Bourbon Langbiang Honey | 199.000 ₫ | 379.000 ₫ | — |

## 7.2. Required mock lot codes

```ts
export const DEMO_LOT_CODES = {
  trs1: "TRS1-GL-26-N01",
  tr4: "TR4-DLK-26-N02",
  tr9: "TR9-DLK-26-H01",
  xanhLun: "XLTS5-BL-26-H01",
  catimor: "CAT-DL-26-W01",
  bourbon: "BBN-LB-26-H01",
} as const;
```

## 7.3. Display order

1. TR4 Đắk Lắk Traceable Robusta — signature.
2. Catimor Đà Lạt Washed — gateway Arabica.
3. Xanh Lùn TS5 Bảo Lâm Honey — local story.
4. TRS1 Tây Nguyên Daily Phin — bestseller.
5. TR9 Large Bean Fine Robusta — fine Robusta.
6. Bourbon Langbiang Honey — premium.

---

# 8. Data access architecture

## 8.1. Repository contracts

```ts
export interface ProductRepository {
  list(filters?: ProductFilters): Promise<Product[]>;
  getBySlug(slug: string): Promise<Product | null>;
  getFeatured(): Promise<Product[]>;
}

export interface TraceabilityRepository {
  getByLotCode(lotCode: string): Promise<CoffeeLot | null>;
  listFeaturedLots(): Promise<CoffeeLot[]>;
}

export interface AdvisorRepository {
  recommend(
    preferences: AdvisorPreferences
  ): Promise<ProductRecommendation[]>;
}
```

## 8.2. Data source switching

`.env.example`:

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_DATA_SOURCE=mock
NEXT_PUBLIC_ENABLE_CHECKOUT=false
NEXT_PUBLIC_ENABLE_AUTH=false
```

`NEXT_PUBLIC_DATA_SOURCE` nhận:

- `mock`: dùng in-memory mock repository.
- `http`: dùng REST API repository.

```ts
export function createRepositories() {
  const mode = getDataSourceMode();

  if (mode === "http") {
    return {
      products: new HttpProductRepository(),
      traceability: new HttpTraceabilityRepository(),
      advisor: new HttpAdvisorRepository(),
    };
  }

  return {
    products: new MockProductRepository(),
    traceability: new MockTraceabilityRepository(),
    advisor: new MockAdvisorRepository(),
  };
}
```

Không import mock data trực tiếp từ page/component.

---

# 9. Reserved backend contracts

Tạo `docs/api-contracts.md` và type DTO tương ứng. Frontend chưa gọi thật nhưng phải chuẩn bị adapter.

## 9.1. Products

```http
GET /api/v1/products
GET /api/v1/products/{slug}
GET /api/v1/products/featured
```

Query:

```text
q, species, region, process, roast, brew, minPrice, maxPrice, sort
```

## 9.2. Traceability

```http
GET /api/v1/lots/{lotCode}
GET /api/v1/lots/featured
```

## 9.3. Advisor

```http
POST /api/v1/advisor/recommendations
Content-Type: application/json
```

Body: `AdvisorPreferences`.

Response:

```ts
interface AdvisorResponse {
  recommendations: Array<{
    productId: string;
    score: number;
    reasons: RecommendationReason[];
  }>;
}
```

## 9.4. Cart and checkout — future

```http
GET    /api/v1/cart
POST   /api/v1/cart/items
PATCH  /api/v1/cart/items/{itemId}
DELETE /api/v1/cart/items/{itemId}
POST   /api/v1/orders
```

Frontend MVP dùng local cart, nhưng shape của cart item phải tương thích với API tương lai.

---

# 10. State ownership

| State | Nơi quản lý |
|---|---|
| Product catalog | Server repository |
| URL filters | Search params |
| Cart | Zustand persisted localStorage |
| Cart drawer open/close | Zustand hoặc local client state |
| Product variant selection | Local component state |
| Advisor answers | React Hook Form/local state |
| Advisor recommendations | Repository result |
| Search dialog | Local client state |
| Checkout form | React Hook Form |
| User session | Chưa triển khai |

### Cart persist key

```text
vtc-cart-v1
```

Cần có version để migrate sau này.

---

# 11. Component boundaries

## Server Components

- Home sections không có tương tác.
- Product page data loading.
- Product description.
- Story page.
- Brew guide.
- Traceability result page.
- SEO/JSON-LD.

## Client Components

- Product filters.
- Sort dropdown.
- Quick view.
- Variant/grind selector.
- Add to cart.
- Cart drawer.
- Advisor.
- Lot lookup form.
- Checkout form.
- Mobile navigation.
- Search command palette.

Không biến toàn bộ layout hoặc page thành Client Component chỉ vì chứa một nút tương tác.

---

# 12. Product filtering logic

Các filter tối thiểu:

- Species: Robusta / Arabica.
- Region: Gia Lai / Đắk Lắk / Bảo Lâm / Đà Lạt / Langbiang.
- Process: Natural / Washed / Honey.
- Roast: Light-medium / Medium / Medium-dark.
- Brew method.
- Price band:
  - Dưới 120.000 ₫.
  - 120.000–160.000 ₫.
  - Trên 160.000 ₫.
- Format: whole bean / ground / drip bag.

Sorting:

- Nổi bật.
- Giá tăng dần.
- Giá giảm dần.
- Rang nhẹ đến đậm.
- Robusta trước.
- Arabica trước.

Search cần normalize tiếng Việt và không phân biệt hoa thường.

---

# 13. Recommendation scoring

Tạo rule-based engine thuần TypeScript trong `score-products.ts`.

## 13.1. Score weights

- Brew method match: +25.
- Intensity/body match: +20.
- Bitterness match: +15.
- Acidity match: +15.
- Caffeine match: +10.
- Format available: +10.
- Budget match: +10.
- Priority match: +5 mỗi priority, tối đa +10.

Normalize score về 0–100.

## 13.2. Output

- Trả về top 3.
- Mỗi sản phẩm có tối đa 4 lý do.
- Không hiển thị lý do môi trường nếu evidence level chỉ là `reference`.
- Có disclosure:
  > “Kết quả hiện được tạo bằng bộ quy tắc từ dữ liệu sản phẩm. Backend AI/RAG sẽ được tích hợp ở giai đoạn sau.”

## 13.3. Unit tests

- Người thích đậm, caffeine cao, pha phin → ưu tiên TRS1/TR4.
- Người thích balanced, ít đắng, pour-over → ưu tiên Catimor/Bourbon.
- Budget dưới 120.000 ₫ → không gợi ý sản phẩm 250 g vượt ngân sách.
- Drip bag → chỉ Catimor trong MVP.
- Stable sort khi hai sản phẩm có cùng điểm.

---

# 14. SEO and metadata

## 14.1. Root metadata

- Title template:
  ```text
  %s | DẤU VỊ — Vietnam Traceable Coffee
  ```
- Default description:
  > Khám phá cà phê Việt Nam theo giống, vùng trồng, cách sơ chế và mã lô — từ Tây Nguyên đến Langbiang.

## 14.2. Product metadata

- Title từ `displayName`.
- Description gồm region + process + roast + 3 flavor notes.
- Open Graph image dùng route image generation hoặc placeholder brand.
- Canonical URL.

## 14.3. JSON-LD

- Product.
- Offer cho từng variant.
- BreadcrumbList.
- Organization.

Không đưa review/rating giả vào structured data.

---

# 15. Image and asset strategy

## 15.1. MVP assets

Nếu chưa có ảnh sản phẩm thật:

- Tạo product pack mockup bằng CSS/SVG.
- Mỗi gói có:
  - Brand mark.
  - Tên giống.
  - Vùng.
  - Process.
  - Mã lô demo.
  - Topographic pattern khác nhau.
- Dùng `next/image` cho ảnh raster.
- Dùng local SVG cho map/pattern.
- Không hotlink ảnh bên ngoài.
- Không dùng ảnh có watermark.

## 15.2. Image naming

```text
trs1-daily-phin-pack.webp
tr4-dak-lak-pack.webp
tr9-large-bean-pack.webp
xanh-lun-ts5-pack.webp
catimor-da-lat-pack.webp
bourbon-langbiang-pack.webp
```

---

# 16. Error, loading and empty states

## Loading

- Skeleton giữ đúng kích thước card.
- Product detail dùng gallery skeleton + information skeleton.
- Không dùng spinner toàn màn hình trừ route transition ngắn.

## Empty shop result

Copy:

> **Chưa tìm thấy cà phê phù hợp**  
> Thử bỏ bớt một tiêu chí hoặc để Coffee Advisor chọn giúp bạn.

Buttons:

- Xóa bộ lọc.
- Mở Coffee Advisor.

## Invalid lot code

> **Không tìm thấy mã lô này**  
> Kiểm tra lại ký tự trên nhãn sản phẩm hoặc thử một mã demo bên dưới.

Hiển thị 3 mã demo.

## Backend unavailable — future HTTP mode

- Hiển thị error boundary.
- Không silently fallback từ HTTP sang mock trong production.
- Chỉ fallback ở development khi được cấu hình rõ.

---

# 17. Accessibility requirements

- WCAG AA cho text chính.
- Focus ring luôn nhìn thấy.
- Mọi button có accessible name.
- Dialog/Sheet có focus trap.
- Product option không chỉ phân biệt bằng màu.
- Flavor bars có text label và `aria-valuenow`.
- Map có phiên bản text list.
- Animation tôn trọng `prefers-reduced-motion`.
- Header và mobile nav dùng semantic navigation.
- Không dùng heading level nhảy cấp.
- Form error gắn với input bằng `aria-describedby`.

---

# 18. Performance rules

- Client JS tối thiểu.
- Lazy-load quick view, cart drawer và advisor modules.
- `next/image` với `sizes`.
- Font qua `next/font`.
- Không dùng hơn hai font family.
- Không load chart library cho flavor profile; dựng bằng CSS.
- Không load map SDK; dùng SVG map Việt Nam.
- Mục tiêu Lighthouse:
  - Performance ≥ 90 ở desktop.
  - Accessibility ≥ 95.
  - Best Practices ≥ 95.
  - SEO ≥ 95.

---

# 19. Coding standards

- File name: kebab-case.
- Component: PascalCase.
- Function/variable: camelCase.
- Constant: UPPER_SNAKE_CASE khi thực sự global.
- Không dùng `any`.
- Không dùng non-null assertion trừ trường hợp có giải thích.
- Mọi external data đi qua Zod parser.
- UI không biết repository đang là mock hay HTTP.
- Tách mapper DTO → domain.
- Tránh prop drilling sâu hơn 2–3 cấp.
- Không tạo “god component” trên 250 dòng.
- Mỗi component có một trách nhiệm rõ.
- Copy UI tập trung trong content/config khi có thể.
- Ghi TODO theo format:
  ```ts
  // TODO(backend): Replace local checkout with POST /api/v1/orders.
  ```

---

# 20. Testing

## 20.1. Unit

- Product filtering.
- Search normalization.
- Currency formatting.
- Recommendation scoring.
- Cart total.
- Variant selection defaults.

## 20.2. E2E

### Product discovery

1. Mở `/shop`.
2. Filter `Arabica`.
3. Chọn `Catimor Đà Lạt Washed`.
4. Chọn 250 g.
5. Chọn kiểu xay pour-over.
6. Add to cart.
7. Cart count cập nhật.

### Traceability

1. Mở `/traceability`.
2. Nhập `TR4-DLK-26-N02`.
3. Điều hướng đến trang lô.
4. Hiển thị disclosure dữ liệu demo.
5. Hiển thị timeline 6 bước.

### Advisor

1. Chọn body nhẹ/cân bằng.
2. Chọn pour-over.
3. Chọn caffeine trung bình.
4. Kết quả có Catimor hoặc Bourbon trong top 2.

### Checkout

1. Add product.
2. Mở cart.
3. Đi checkout.
4. Validate required fields.
5. Submit hiển thị confirmation mock, không tạo giao dịch thật.

---

# 21. Development scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "format": "prettier --write .",
    "check": "pnpm lint && pnpm typecheck && pnpm test && pnpm build"
  }
}
```

---

# 22. Implementation sequence

## Phase 1 — Foundation

- Create Next.js project.
- Install dependencies.
- Configure fonts, tokens, global CSS.
- Configure shadcn/ui.
- Build root layout, header, footer, mobile nav.
- Add typed brand config.

## Phase 2 — Domain and mock data

- Add product schemas/types.
- Add traceability schemas/types.
- Add six products.
- Add six demo lots.
- Add repositories and data-source factory.
- Add currency/date/search utilities.

## Phase 3 — Storefront

- Home.
- Shop.
- Product detail.
- Filters/search/sort.
- Cart drawer/cart page.

## Phase 4 — Traceability

- Lot lookup.
- Lot passport.
- Timeline.
- Evidence levels.
- Vietnam SVG origin map.

## Phase 5 — Advisor

- Quiz/chat shell.
- Rule scoring.
- Top 3 recommendations.
- Add recommendation to cart.

## Phase 6 — Checkout and polish

- Checkout mock.
- Error/loading/empty states.
- SEO metadata.
- JSON-LD.
- Responsive QA.
- Accessibility QA.
- Tests.

---

# 23. Definition of done

Repository chỉ được xem là hoàn thành khi:

- [ ] Có đủ route trong mục 5.
- [ ] Có đủ sáu sản phẩm.
- [ ] Có mock lot cho từng sản phẩm.
- [ ] Có thể filter, search và sort.
- [ ] Có thể chọn variant và grind.
- [ ] Cart persist sau reload.
- [ ] Lot lookup hoạt động với mã demo.
- [ ] Advisor trả top 3 hợp lý.
- [ ] Checkout hiển thị rõ là demo.
- [ ] Không có claim môi trường không có evidence.
- [ ] Mobile layout không overflow.
- [ ] Keyboard navigation hoạt động.
- [ ] `pnpm check` chạy thành công.
- [ ] README có setup, architecture và demo routes.
- [ ] Không có lorem ipsum.
- [ ] Không có fake review, fake certification hoặc fake carbon numbers.

---

# 24. Prompt cuối để agent thực thi

```text
Hãy đọc toàn bộ tài liệu này như một build contract và tạo repository frontend hoàn chỉnh.

Ưu tiên:
1. Kiến trúc có thể nối backend.
2. UI chuyên nghiệp và nhất quán.
3. Server Components mặc định.
4. Mock data có schema/type.
5. Không bịa chứng nhận hoặc chỉ số môi trường.
6. Hoàn thiện luồng Home → Shop → Product → Cart → Checkout.
7. Hoàn thiện luồng Traceability và Coffee Advisor.

Không chỉ tạo skeleton. Hãy code các trang và interaction thực sự chạy được bằng mock repositories. Sau khi hoàn tất, chạy lint, typecheck, unit tests và production build; sửa toàn bộ lỗi trước khi báo hoàn thành.
```

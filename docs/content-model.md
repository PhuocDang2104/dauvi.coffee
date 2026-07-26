# Content model

## Product

`Product` mô tả giống, vùng, độ cao, sơ chế, rang, phổ vị, cách pha, nội dung, badges và danh sách `ProductVariant`. Giá luôn nằm trong variant, không nằm trong JSX.

Mỗi variant định danh format (`whole-bean`, `ground`, `drip-bag`), trọng lượng hoặc số gói, grind options, SKU, giá VND và trạng thái stock.

## Coffee lot

`CoffeeLot` liên kết `productId` với mã lô, trạng thái, đơn vị sản xuất mô phỏng, vùng, niên vụ, ngày rang/đóng gói, timeline sáu bước và danh sách evidence.

Mỗi `EvidenceItem` mang level riêng. Dữ liệu tham khảo về giống không được chuyển thành claim của toàn lô.

## Advisor

`AdvisorPreferences` lưu intensity, bitterness, acidity, brew method, caffeine, format, budget và priorities. `ProductRecommendation` gồm product, score đã chuẩn hóa và tối đa bốn lý do.

## Cart / checkout

Cart item là snapshot nhỏ để hiển thị và persist trên trình duyệt: product/variant
identifiers, format, size, grind, unit price, quantity và metadata. Khi bật
checkout server, request chỉ gửi `productId`, `variantId`, grind và quantity;
backend tính lại giá từ PostgreSQL rồi lưu đơn COD `demo-confirmed`. Không thu dữ
liệu thẻ hoặc gửi yêu cầu giao vận thật.

## Quy tắc truy cập

Mock modules chỉ được import bởi mock repositories. UI và pages chỉ biết repository interfaces hoặc domain objects trả về từ data-source factory.

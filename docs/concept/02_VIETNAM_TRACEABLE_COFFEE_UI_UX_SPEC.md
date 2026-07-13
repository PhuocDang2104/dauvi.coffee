# VIETNAM TRACEABLE COFFEE — UI/UX, CONTENT & EXPERIENCE SPEC

> **Mục đích:** Tài liệu này là prompt thiết kế và UI implementation dành cho coding agent. Nó quy định brand concept, information architecture, page layout, component behavior, responsive rules và nội dung cốt lõi cho frontend Next.js.

---

## 0. Vai trò của agent

Bạn là **Lead Product Designer + Senior UI Engineer**. Hãy chuyển concept **Vietnam Traceable Coffee Collection** thành một storefront cao cấp, hiện đại, có bản sắc Việt Nam nhưng không rơi vào phong cách trang trí dân gian sáo rỗng.

Website phải tạo cảm giác:

- Có nguồn gốc.
- Gần thiên nhiên.
- Có chiều sâu địa lý.
- Hiện đại và đáng tin.
- Dễ mua với người phổ thông.
- Đủ tinh tế với người quan tâm specialty coffee.
- Minh bạch nhưng không quá học thuật.

Không làm giao diện giống một template bán hàng đại trà. Không dùng quá nhiều màu nâu, lá cây, icon hạt cà phê hoặc texture gỗ.

---

# 1. Working brand

## 1.1. Tên thương hiệu tạm dùng

# **DẤU VỊ**

Subtitle:

> **Vietnam Traceable Coffee**

Tên này kết hợp:

- **Dấu:** dấu vết, dấu nguồn gốc, dấu lô hàng.
- **Vị:** hương vị cà phê.
- Có thể đổi tên sau bằng một file config, không hard-code khắp UI.

## 1.2. Collection name

# **Vietnam Traceable Coffee Collection**

## 1.3. Primary tagline

> **From the Highlands of Vietnam**

## 1.4. Vietnamese tagline

> **Từ cao nguyên Việt Nam đến tách cà phê của bạn.**

## 1.5. Core statement

> Bộ sưu tập gồm những dòng Robusta và Arabica tiêu biểu đang được canh tác tại Việt Nam, từ vùng đất đỏ bazan Tây Nguyên đến các sườn núi cao của Lâm Đồng. Mỗi gói cà phê được kể bằng giống, vùng trồng, phương pháp sơ chế, mức rang và mã lô — để người dùng không chỉ chọn đúng khẩu vị mà còn hiểu hành trình phía sau tách cà phê.

---

# 2. Sáu nguyên tắc thương hiệu

## 2.1. Vietnamese Origin

Tất cả sản phẩm trong collection đều gắn với vùng trồng tại Việt Nam:

- Gia Lai.
- Đắk Lắk.
- Bảo Lâm.
- Đà Lạt/Cầu Đất.
- Langbiang.

## 2.2. Coffee Diversity

Bộ sưu tập thể hiện phổ cà phê Việt:

- Robusta phổ thông.
- Traceable Robusta.
- Fine Robusta.
- Giống địa phương có câu chuyện.
- Arabica dễ tiếp cận.
- Heritage Arabica premium.

## 2.3. Lot-level Traceability

Mỗi sản phẩm có:

- Mã lô.
- Vùng.
- Giống.
- Niên vụ.
- Sơ chế.
- Mẻ rang.
- Ngày đóng gói.
- Mức độ bằng chứng.

## 2.4. Taste-first Selection

Nguồn gốc quan trọng nhưng trải nghiệm mua vẫn bắt đầu từ:

- Đậm hay thanh.
- Đắng hay chua.
- Caffeine.
- Cách pha.
- Ngân sách.

## 2.5. Home Brewing

Sản phẩm phục vụ pha tại nhà:

- Hạt rang.
- Bột xay theo dụng cụ.
- Drip bag.
- 250 g / 500 g.

## 2.6. Honest Sustainability

Chỉ hiển thị claim môi trường khi có evidence.

Không dùng:

- “100% sustainable”.
- “Zero carbon”.
- “Water saving”.
- “Organic”.
- “Deforestation-free”.

trừ khi có nguồn tương ứng.

---

# 3. Brand story

## 3.1. Long-form story

### From the Highlands of Vietnam

Câu chuyện bắt đầu từ những vùng đất đỏ bazan của Tây Nguyên, nơi TRS1, TR4, TR9 và Xanh Lùn TS5 phát triển trong khí hậu nhiệt đới đặc trưng. Đây là những giống Robusta gắn với quá trình tuyển chọn và phát triển cà phê tại Việt Nam, mang body dày, vị đậm và nguồn năng lượng phù hợp với văn hóa pha phin.

Hành trình tiếp tục lên những vùng cao mát hơn của Lâm Đồng. Tại Đà Lạt, Cầu Đất và Langbiang, Catimor và Bourbon tạo nên những tách cà phê thanh hơn, có hương hoa, trái cây, caramel và mật ong. Chúng kể một phần khác của cà phê Việt: những lô Arabica nhỏ, được tạo nên bởi độ cao, khí hậu và cách sơ chế.

Sáu sản phẩm không được đặt cạnh nhau để chọn ra “loại tốt nhất”. Chúng tạo thành một hành trình vị giác, từ một ly phin Robusta đậm đà mỗi sáng đến một tách Bourbon nhẹ và thơm được pha bằng pour-over.

Mỗi gói mang thông tin về giống, vùng trồng, phương pháp sơ chế, mức rang và mã lô. Người mua không chỉ biết mình đang uống gì, mà còn biết sản phẩm đến từ đâu và vì sao nó có hương vị ấy.

## 3.2. Short story

> Sáu dòng cà phê, hai hệ hương vị, một hành trình xuyên cao nguyên Việt Nam. Khám phá Robusta đậm đà từ Tây Nguyên và Arabica thanh sáng từ Lâm Đồng, được trình bày bằng hồ sơ nguồn gốc rõ ràng đến từng lô.

## 3.3. Campaign line

> **Six coffees. One Vietnamese journey.**

---

# 4. Target users

## 4.1. Everyday Phin Drinker

- Uống cà phê mỗi sáng.
- Thích đậm, caffeine cao.
- Quan tâm giá.
- Dùng phin hoặc moka pot.
- Sản phẩm phù hợp: TRS1, TR4.

## 4.2. Curious Explorer

- Muốn thử cà phê khác ngoài Robusta rang đậm.
- Chưa hiểu nhiều thuật ngữ.
- Cần hướng dẫn chọn.
- Sản phẩm phù hợp: TR9, Xanh Lùn, Catimor.

## 4.3. Specialty Enthusiast

- Quan tâm variety, process, altitude, lot.
- Pha V60/AeroPress.
- Chấp nhận giá cao hơn.
- Sản phẩm phù hợp: Bourbon.

## 4.4. Convenience Buyer

- Làm việc văn phòng.
- Muốn pha nhanh.
- Sản phẩm phù hợp: Catimor drip bag.

---

# 5. Visual direction

## 5.1. Creative concept

### **Editorial Cartography**

Kết hợp:

- Editorial layout.
- Bản đồ và đường đồng mức.
- Dấu mộc lô hàng.
- Typography cao cấp.
- Product pack như một “coffee passport”.
- Màu lấy cảm hứng từ đất bazan, sương cao nguyên và lá cà phê.

Không dùng giao diện “rustic cafe” với nền gỗ, bảng đen và chữ viết tay.

## 5.2. Visual keywords

- Topographic.
- Altitude.
- Journey.
- Lot stamp.
- Field notes.
- Modern Vietnamese.
- Quiet premium.
- Traceable.
- Tactile but clean.

---

# 6. Design tokens

## 6.1. Color palette

```css
:root {
  --forest-950: #102a20;
  --forest-800: #214536;
  --forest-600: #3f6b52;

  --basalt-900: #2a211d;
  --roast-700: #5a3729;
  --clay-500: #b86f45;

  --mist-50: #faf8f2;
  --paper-100: #f3eee4;
  --sand-200: #e5d8c5;

  --honey-500: #c79648;
  --berry-500: #9b4f58;

  --ink-950: #181a18;
  --ink-700: #454944;
  --ink-500: #6c716c;

  --success-600: #397151;
  --warning-600: #9a6a25;
  --danger-600: #a4463d;
}
```

### Usage

- Primary CTA: `forest-950`.
- Secondary accent: `clay-500`.
- Premium accent: `honey-500`.
- Page background: `mist-50`.
- Card background: white hoặc `paper-100`.
- Main text: `ink-950`.

Không dùng xanh lá neon. Không dùng gradient nhiều màu.

## 6.2. Typography

- Display/headings: **Fraunces**.
- Body/UI: **Manrope**.
- Data/lot code: monospace system hoặc **IBM Plex Mono** nếu cần.

Typography scale:

```text
Display XL: 72/76 desktop, 44/48 mobile
Display L: 56/60 desktop, 38/42 mobile
H1: 48/54 desktop, 34/40 mobile
H2: 36/44 desktop, 28/34 mobile
H3: 26/34
Body L: 18/30
Body: 16/26
Small: 14/22
Caption: 12/18
```

## 6.3. Radius

- Buttons: 999 px hoặc 12 px tùy type.
- Cards: 20–28 px.
- Product image frame: 28 px.
- Small chips: 999 px.
- Không dùng radius cực lớn cho mọi component.

## 6.4. Shadow

- Ưu tiên border và tonal separation.
- Shadow nhẹ:
  ```css
  0 16px 40px rgba(24, 26, 24, 0.08)
  ```
- Không dùng shadow đen đậm.

## 6.5. Grid

- Max content width: 1280 px.
- Wide visual width: 1440 px.
- Desktop: 12 columns.
- Tablet: 8 columns.
- Mobile: 4 columns.
- Side padding:
  - 24 px mobile.
  - 40 px tablet.
  - 64 px desktop.

---

# 7. Global navigation

## 7.1. Announcement bar

Copy:

> Miễn phí giao hàng nội thành cho đơn từ 499.000 ₫ · Dữ liệu truy xuất hiện ở chế độ demo

Có nút đóng, lưu session.

## 7.2. Desktop header

Left:

- Logo DẤU VỊ.

Center:

- Bộ sưu tập.
- Truy xuất.
- Coffee Advisor.
- Câu chuyện.
- Cách pha.

Right:

- Search.
- Account placeholder.
- Cart.

Header sticky, nền trong suốt ở hero và chuyển sang nền paper blur khi scroll.

## 7.3. Mobile header

- Menu.
- Center logo.
- Cart.

## 7.4. Mobile bottom navigation

Bốn mục:

- Trang chủ.
- Sản phẩm.
- Truy xuất.
- Giỏ hàng.

Ẩn khi bàn phím mở hoặc checkout.

---

# 8. Home page structure

## Section 1 — Hero

### Layout

Desktop 12-column:

- Left: 6–7 columns copy.
- Right: 5–6 columns product composition + Vietnam contour visual.

Mobile:

- Copy trước.
- Product visual sau.

### Eyebrow

> VIETNAM TRACEABLE COFFEE COLLECTION

### Heading

> **Cà phê Việt Nam, được kể đến từng lô.**

### Supporting copy

> Từ Robusta Tây Nguyên đến Arabica Langbiang, khám phá sáu dòng cà phê đóng gói theo giống, vùng trồng, cách sơ chế và hương vị.

### CTA

- Primary: **Khám phá bộ sưu tập**
- Secondary: **Để Coffee Advisor chọn giúp**

### Hero visual

- Hai pack chính: TR4 và Catimor.
- Background đường đồng mức.
- Một route line nối “Đắk Lắk” → “Đà Lạt”.
- Floating data labels:
  - Natural.
  - 500–800 m.
  - Lot TR4-DLK-26-N02.
- Không dùng carousel.

---

## Section 2 — The collection in one glance

Heading:

> **Sáu sản phẩm, một hành trình Việt Nam**

Dùng strip/horizontal cards biểu diễn:

- 4 Robusta.
- 2 Arabica.
- 3 process.
- 5 vùng.
- 3 mức giá.

Có mini legend giúp người mới hiểu:

- Robusta: đậm, body dày, caffeine cao.
- Arabica: thanh hơn, hương thơm và độ chua rõ hơn.

---

## Section 3 — Vietnam flavor map

### Layout

- Left: SVG bản đồ Việt Nam tối giản.
- Pins:
  - Gia Lai.
  - Đắk Lắk.
  - Bảo Lâm.
  - Đà Lạt.
  - Langbiang.
- Right: region cards.

Hover/focus vào pin:

- Hiển thị vùng.
- Loại chủ đạo.
- Altitude.
- Sản phẩm liên quan.

Mobile:

- Map static.
- Region cards thành horizontal scroll.

Heading:

> **Một bản đồ, nhiều sắc thái cà phê**

---

## Section 4 — Featured product grid

Hiển thị 6 sản phẩm.

Card visual:

- Pack mockup.
- Region + process chips.
- Display name.
- 3 flavor notes.
- “Từ 99.000 ₫”.
- Suitable brew methods.
- Quick add hoặc Xem chi tiết.

Grid:

- Desktop 3 columns.
- Tablet 2 columns.
- Mobile 1.1 card horizontal hoặc 1 column.

Card không hiển thị quá ba badge.

---

## Section 5 — Traceability spotlight

Heading:

> **Theo dấu từ vùng trồng đến ngày rang**

Layout như một passport mở:

Left:

- Lot code.
- Region.
- Harvest.
- Process.
- Roast date.

Right:

- Timeline 6 bước:
  1. Vùng trồng.
  2. Thu hoạch.
  3. Sơ chế.
  4. Cà phê nhân.
  5. Rang.
  6. Đóng gói.

CTA:

- **Tra cứu mã lô**
- Demo quick code: `TR4-DLK-26-N02`.

Disclosure rõ:

> Dữ liệu lô đang được mô phỏng cho mục đích trình diễn đồ án.

---

## Section 6 — Taste spectrum

Không dùng radar chart phức tạp.

Dùng một continuum lớn:

```text
Đậm & nhiều caffeine  ─────────────────  Thanh & giàu hương
TRS1  TR4  TR9  Xanh Lùn  Catimor  Bourbon
```

Click product marker mở tooltip.

Heading:

> **Bắt đầu từ khẩu vị của bạn**

CTA:

- **Tìm cà phê phù hợp**

---

## Section 7 — Coffee Advisor

Visual như chat card nhưng không giống chatbot hỗ trợ khách hàng thông thường.

Heading:

> **Không cần biết hết thuật ngữ để chọn đúng cà phê**

Copy:

> Trả lời vài câu về vị, cách pha và ngân sách. Coffee Advisor sẽ chọn ba sản phẩm phù hợp từ bộ sưu tập hiện có.

Quick options:

- Tôi uống phin mỗi sáng.
- Tôi thích ít đắng hơn.
- Tôi muốn thử Arabica.
- Tôi cần drip bag tiện lợi.

CTA:

- **Bắt đầu tư vấn**

---

## Section 8 — Honest sustainability

Heading:

> **Minh bạch trước khi gắn nhãn**

Ba cards:

### Verified

> Có chứng nhận hoặc tài liệu xác minh.

### Supplier Declared

> Thông tin do trang trại hoặc nhà cung cấp công bố.

### Reference Data

> Kiến thức tham khảo về giống, không đại diện cho toàn bộ lô sản phẩm.

Một note:

> Không sử dụng các claim “organic”, “water-saving” hoặc “carbon neutral” nếu hồ sơ sản phẩm chưa có bằng chứng tương ứng.

---

## Section 9 — Brew at home

Ba pathways:

- Phin Việt Nam.
- Pour-over/AeroPress.
- Drip bag.

Mỗi pathway có:

- Grind size.
- Dose.
- Water.
- Time.
- Product suggestions.

CTA:

- **Xem hướng dẫn pha**

---

## Section 10 — Newsletter/footer

Newsletter copy:

> **Field Notes từ cao nguyên**  
> Nhận câu chuyện vùng trồng, cách pha và các lô mới.

Footer:

- Shop.
- Traceability.
- Advisor.
- Story.
- Brew Guide.
- Shipping.
- Contact.
- Data transparency.

---

# 9. Shop page

## 9.1. Hero

Heading:

> **Chọn cà phê theo vị, vùng và cách pha**

Subcopy:

> Sáu dòng cà phê Việt Nam đóng gói, từ Daily Phin đến Heritage Arabica.

## 9.2. Desktop layout

- Left filter sidebar: 280 px.
- Right:
  - Result count.
  - Active filter chips.
  - Sort.
  - Product grid.

## 9.3. Mobile layout

- Sticky bar:
  - Lọc.
  - Sắp xếp.
  - Result count.
- Filter mở Sheet toàn màn hình.

## 9.4. Filter labels

### Dòng cà phê

- Robusta.
- Arabica.

### Vùng

- Gia Lai.
- Đắk Lắk.
- Bảo Lâm.
- Đà Lạt.
- Langbiang.

### Sơ chế

- Natural.
- Honey.
- Washed.

### Mức rang

- Light–medium.
- Medium.
- Medium–dark.

### Cách pha

- Phin.
- Espresso.
- Pour-over.
- AeroPress.
- French press.
- Moka pot.
- Cold brew.
- Drip.

### Giá 250 g

- Dưới 120.000 ₫.
- 120.000–160.000 ₫.
- Trên 160.000 ₫.

## 9.5. Product card anatomy

1. Image area 4:5.
2. Top-left region chip.
3. Top-right role badge.
4. Product name.
5. Species · process · roast.
6. Flavor notes.
7. Brew method icons.
8. Price.
9. CTA.

Hover:

- Pack nhích lên 6 px.
- Contour pattern dịch nhẹ.
- Quick view xuất hiện.
- Respect reduced motion.

---

# 10. Product detail page

## 10.1. Above the fold

Desktop:

- Left 7 columns: gallery.
- Right 5 columns: purchase panel.

Mobile:

- Gallery.
- Product summary.
- Sticky bottom add-to-cart.

### Purchase panel order

1. Region breadcrumb.
2. Product name.
3. One-line proposition.
4. Flavor notes.
5. Price.
6. Format.
7. Weight.
8. Grind.
9. Quantity.
10. Add to cart.
11. Shipping note.
12. Featured lot code.

## 10.2. Variant selection

- Whole bean.
- Ground.
- Drip bag nếu có.
- 250 g / 500 g.
- Grind selector chỉ xuất hiện khi chọn ground.
- Disable các combination không tồn tại.

Mặc định:

- 250 g.
- Whole bean nếu có.
- Nếu product role là Daily Phin, có thể default ground/phin.

## 10.3. Flavor profile

Năm thanh:

- Đắng.
- Chua.
- Ngọt.
- Body.
- Hương thơm.

Mỗi thanh 1–5, có text giải thích ngắn.

Ví dụ:

> Body 5/5 — cảm giác dày và đầy trong miệng.

## 10.4. Origin card

Hiển thị:

- Vùng.
- Species.
- Variety.
- Altitude.
- Process.
- Roast.
- Lot.

Dùng layout passport, không dùng table thô.

## 10.5. Trace journey

Horizontal timeline desktop, vertical mobile:

1. Farm.
2. Harvest.
3. Process.
4. Green bean.
5. Roast.
6. Pack.

CTA:

- **Xem hồ sơ lô đầy đủ**

## 10.6. Brew match

Cards cho từng cách pha phù hợp.

Mỗi card:

- Dụng cụ.
- Grind.
- Dose.
- Water.
- Time.
- Why it works.

## 10.7. Transparency panel

Ba nhóm:

- Dữ liệu đã xác minh.
- Dữ liệu nhà cung cấp khai báo.
- Dữ liệu tham khảo về giống.

Không đặt icon lá cho mọi dòng.

## 10.8. Related products

Logic:

- Cùng brew method.
- Hoặc gần trên taste spectrum.
- Không chỉ cùng species.

---

# 11. Traceability page

## 11.1. Hero

Heading:

> **Mỗi mã lô là một hành trình**

Copy:

> Nhập mã trên nhãn để xem vùng nguyên liệu, sơ chế, rang, đóng gói và mức độ xác minh của dữ liệu.

## 11.2. Lookup form

- Input monospace.
- Auto uppercase.
- Normalize spaces.
- Button: **Tra cứu lô**.
- Scan icon chỉ mang tính decorative; chưa mở camera.
- Demo codes hiển thị dưới dạng chips.

## 11.3. Education strip

Giải thích 4 cấp:

- Verified.
- Supplier Declared.
- Reference.
- Demo.

## 11.4. Featured lots

Hiển thị 3 passport cards.

---

# 12. Lot detail page

## 12.1. Header

- Lot code.
- Product.
- Status.
- Evidence level.
- Demo disclosure.

## 12.2. Passport summary

- Region.
- Farm/cooperative.
- Harvest year.
- Variety.
- Process.
- Roast date.
- Pack date.

## 12.3. Origin map

- Vietnam outline.
- Highlight region.
- Text alternative ngay bên cạnh.

## 12.4. Timeline

Mỗi event có:

- Stage icon.
- Date.
- Title.
- Description.
- Evidence indicator.

## 12.5. Evidence table

Columns:

- Thuộc tính.
- Giá trị.
- Mức bằng chứng.
- Nguồn.
- Cập nhật.

## 12.6. Product CTA

- Xem sản phẩm.
- Add to cart nếu còn hàng.

---

# 13. Coffee Advisor page

## 13.1. Experience model

Giao diện kết hợp quiz và conversation:

- Một câu hỏi mỗi bước.
- Người dùng trả lời bằng large chips/cards.
- Progress 1/6.
- Có Back.
- Không cần nhập text tự do trong MVP.

## 13.2. Six questions

1. Bạn thích tách cà phê đậm đến mức nào?
2. Bạn muốn vị đắng ra sao?
3. Bạn có thích độ chua sáng của Arabica không?
4. Bạn thường pha bằng gì?
5. Bạn cần caffeine mức nào?
6. Bạn muốn ưu tiên điều gì?

Priorities:

- Dễ uống mỗi ngày.
- Nguồn gốc rõ.
- Giống Việt có câu chuyện.
- Trải nghiệm premium.
- Giá dễ tiếp cận.
- Pha nhanh.

## 13.3. Results

Hiển thị:

- “Phù hợp nhất”.
- Hai lựa chọn thay thế.
- Score.
- 3–4 lý do.
- Giá từ.
- Add to cart.
- Compare.

Disclosure:

> Gợi ý hiện dựa trên bộ quy tắc từ dữ liệu sản phẩm; AI/RAG sẽ được tích hợp ở giai đoạn sau.

## 13.4. Suggested result copy

> **TR4 Đắk Lắk phù hợp với bạn vì:**  
> Body dày cho pha phin, caffeine cao, mức giá trong ngân sách và có hồ sơ lô nổi bật trong bộ sưu tập.

---

# 14. Cart and checkout

## 14.1. Cart drawer

- Item image.
- Name.
- Weight/format/grind.
- Quantity stepper.
- Price.
- Remove.
- Subtotal.
- Free shipping progress.
- CTA checkout.

Cross-sell tối đa một sản phẩm:

> Thử thêm Catimor drip bag cho những ngày cần pha nhanh.

## 14.2. Cart page

- Editable items.
- Promo code UI disabled hoặc mock.
- Summary.
- Shipping note.
- Continue shopping.

## 14.3. Checkout

Three sections:

1. Thông tin người nhận.
2. Giao hàng.
3. Xác nhận đơn.

Payment:

- COD mock.
- Bank transfer disabled label “Sắp có”.
- Không thu dữ liệu thẻ.

Submit result:

> **Đơn demo đã được tạo**  
> Đây là luồng trình diễn frontend; chưa có giao dịch hoặc đơn hàng thật.

---

# 15. Story page

## Section 1

Large editorial intro:

> **Từ đất bazan đến sườn núi mờ sương**

## Section 2

Two-column contrast:

### Robusta Highlands

- Tây Nguyên.
- Body dày.
- Caffeine cao.
- Phin/espresso.

### Arabica Highlands

- Lâm Đồng.
- Hương hoa/trái cây.
- Acidity rõ.
- Pour-over/drip.

## Section 3

Timeline:

- Variety.
- Region.
- Process.
- Roast.
- Lot.
- Cup.

## Section 4

Six product portraits.

## Section 5

Transparency promise.

---

# 16. Brew guide page

Cards:

## Phin

- 20 g coffee.
- 80–100 ml water.
- Medium-fine grind.
- 4–6 minutes.
- Recommended: TRS1, TR4, Xanh Lùn.

## Pour-over

- 15 g coffee.
- 240 ml water.
- Medium grind.
- 2:30–3:00.
- Recommended: Catimor, Bourbon.

## AeroPress

- 15–17 g coffee.
- 220 ml water.
- Medium-fine.
- 1:30–2:00.
- Recommended: Catimor, Bourbon, TR9.

## Moka pot

- Fine-medium grind.
- Recommended: TRS1, TR4, Xanh Lùn.

## French press

- Coarse grind.
- Recommended: TR9, Catimor.

## Cold brew

- Coarse grind.
- 12–16 hours.
- Recommended: TR4, TR9.

Các thông số là hướng dẫn UI khởi đầu, cần hiển thị như recommendation chứ không phải quy chuẩn duy nhất.

---

# 17. Product content

## 17.1. TRS1 Tây Nguyên Daily Phin

### One-line proposition

> Robusta đậm, dễ pha và dễ tiếp cận cho tách phin mỗi ngày.

### Metadata

- Species: Coffea canephora — Robusta.
- Variety: TRS1.
- Region: Gia Lai hoặc Đắk Lắk.
- Process: Natural.
- Roast: Medium-dark.
- Segment: Everyday.
- Role: Bestseller.

### Flavor

- Chocolate đen.
- Hạt rang.
- Caramel nhẹ.
- Body 5/5.
- Bitterness 5/5.
- Acidity 1/5.
- Sweetness 2/5.
- Aroma 3/5.
- Caffeine: High.

### Brew

- Phin.
- Moka pot.
- Cà phê sữa.

### Price

- 250 g: 99.000 ₫.
- 500 g: 185.000 ₫.

### Card badge

- Daily Phin.

---

## 17.2. TR4 Đắk Lắk Traceable Robusta

### One-line proposition

> Dòng Robusta chủ lực với body dày, hậu vị đậm và hồ sơ lô nổi bật.

### Metadata

- Species: Coffea canephora — Robusta.
- Variety: TR4.
- Region: Buôn Ma Thuột, Đắk Lắk.
- Process: Natural.
- Roast: Medium-dark.
- Segment: Traceable standard.
- Role: Signature.

### Flavor

- Cacao.
- Hạnh nhân.
- Caramel.
- Body 5/5.
- Bitterness 4/5.
- Acidity 1/5.
- Sweetness 3/5.
- Aroma 3/5.
- Caffeine: High.

### Brew

- Phin.
- Espresso.
- Cold brew.

### Price

- 250 g: 119.000 ₫.
- 500 g: 219.000 ₫.

### Badges

- Vietnam Traceable.
- Signature Robusta.

---

## 17.3. TR9 Large Bean Fine Robusta

### One-line proposition

> Fine Robusta hạt lớn với cấu trúc tròn, vị chocolate sữa và trái cây khô nhẹ.

### Metadata

- Species: Coffea canephora — Robusta.
- Variety: TR9.
- Region: Đắk Lắk.
- Process: Honey.
- Roast: Medium.
- Segment: Fine Robusta.
- Role: Fine Robusta.

### Flavor

- Chocolate sữa.
- Đường nâu.
- Hạt dẻ.
- Trái cây khô.
- Body 5/5.
- Bitterness 3/5.
- Acidity 2/5.
- Sweetness 4/5.
- Aroma 4/5.
- Caffeine: High.

### Brew

- Phin.
- Espresso.
- French press.

### Price

- 250 g: 139.000 ₫.
- 500 g: 259.000 ₫.

### Badges

- Large Bean.
- Fine Robusta.

---

## 17.4. Xanh Lùn TS5 Bảo Lâm Honey

### One-line proposition

> Một giống Robusta có câu chuyện Việt Nam, được sơ chế Honey để tạo vị dày nhưng êm.

### Metadata

- Species: Coffea canephora — Robusta.
- Variety: Xanh Lùn TS5.
- Region: Bảo Lâm, Lâm Đồng.
- Process: Honey.
- Roast: Medium.
- Segment: Local Fine Robusta.
- Role: Local Story.

### Flavor

- Mật ong.
- Cacao.
- Quả chín.
- Đường nâu.
- Body 5/5.
- Bitterness 3/5.
- Acidity 2/5.
- Sweetness 4/5.
- Aroma 4/5.
- Caffeine: High.

### Brew

- Phin.
- Espresso.
- Moka pot.

### Price

- 250 g: 159.000 ₫.
- 500 g: 299.000 ₫.

### Badges

- Vietnamese Variety.
- Honey Process.

### Evidence wording

> Khả năng chịu hạn là thông tin tham khảo về giống, không phải bằng chứng rằng toàn bộ lô sản phẩm tiết kiệm nước.

---

## 17.5. Catimor Đà Lạt Washed

### One-line proposition

> Arabica cân bằng, dễ tiếp cận với hương cam, caramel và trà đen.

### Metadata

- Species: Coffea arabica.
- Variety group: Catimor.
- Region: Đà Lạt/Cầu Đất.
- Process: Washed.
- Roast: Medium-light.
- Segment: Standard Arabica.
- Role: Gateway Arabica.

### Flavor

- Cam vàng.
- Caramel.
- Chocolate sữa.
- Trà đen.
- Body 3/5.
- Bitterness 2/5.
- Acidity 3/5.
- Sweetness 4/5.
- Aroma 4/5.
- Caffeine: Medium.

### Brew

- Pour-over.
- Drip.
- French press.
- Phin nhẹ.

### Price

- 250 g: 139.000 ₫.
- 500 g: 259.000 ₫.
- 10 drip bags × 12 g: 129.000 ₫.

### Badges

- Easy Arabica.
- Washed.

---

## 17.6. Bourbon Langbiang Honey

### One-line proposition

> Heritage Arabica thanh mượt, nổi bật với mật ong, cam ngọt và hạnh nhân.

### Metadata

- Species: Coffea arabica.
- Variety: Bourbon.
- Region: Langbiang, Lâm Đồng.
- Process: Honey.
- Roast: Light–medium.
- Segment: Specialty.
- Role: Premium.

### Flavor

- Mật ong.
- Cam ngọt.
- Caramel.
- Hạnh nhân.
- Body 3/5.
- Bitterness 1/5.
- Acidity 4/5.
- Sweetness 5/5.
- Aroma 5/5.
- Caffeine: Medium.

### Brew

- Pour-over.
- AeroPress.
- Drip.

### Price

- 250 g: 199.000 ₫.
- 500 g: 379.000 ₫.

### Badges

- Heritage Arabica.
- Langbiang Origin.
- Small Lot.

---

# 18. Pack design system

Mỗi product pack có chung grid, khác màu/pattern.

## Common front

- DẤU VỊ mark.
- Product short name.
- Variety.
- Region.
- Process.
- Roast.
- Weight.
- Lot code.
- Small contour fragment.

## Product accent mapping

| Product | Accent | Pattern idea |
|---|---|---|
| TRS1 | Basalt brown | broad horizontal contour |
| TR4 | Deep forest | angular route line |
| TR9 | Honey gold | large bean dot grid |
| Xanh Lùn | Leaf/forest | compact rounded contour |
| Catimor | Mist blue-gray | fine mountain lines |
| Bourbon | Berry/honey | high-altitude thin contours |

Không dùng ảnh trái cây lớn để biểu diễn tasting notes.

---

# 19. Interaction and motion

## Principles

- Motion giải thích hierarchy, không trang trí.
- Duration 160–280 ms.
- Easing mềm.
- Hover transform tối đa 6 px.
- Không scale card quá 1.02.
- Route line có thể draw-on-load một lần.
- Timeline reveal khi vào viewport.
- Product quick view lazy-loaded.
- Reduced motion: bỏ transform, giữ opacity change.

## Microinteractions

- Add to cart: button chuyển sang “Đã thêm” trong 1 giây.
- Lot lookup: input stamp animation nhẹ khi valid.
- Filter chip: animate width/opacity.
- Advisor: answer card có check icon.
- Flavor bars animate từ 0 đến value khi vào viewport, nhưng chỉ một lần.

---

# 20. Responsive rules

## Mobile

- Không ép desktop card xuống quá nhỏ.
- Product grid 1 column hoặc horizontal snap.
- Sticky add-to-cart ở bottom.
- Filter mở Sheet.
- Timeline vertical.
- Map giữ aspect ratio và có text list.
- Header đơn giản.
- Bottom navigation không che CTA.

## Tablet

- Product grid 2 columns.
- Product detail 50/50 nếu đủ rộng.
- Filter có thể là horizontal toolbar.

## Desktop

- Max width rõ.
- Khoảng trắng lớn.
- Không kéo text line quá 70–75 ký tự.
- Product detail purchase panel có thể sticky.

---

# 21. Content tone

## Nên dùng

- Rõ.
- Ấm.
- Tự tin.
- Có hình ảnh địa lý.
- Giải thích thuật ngữ ngắn.
- Trung thực về data.

Ví dụ:

> “Sơ chế Honey giữ lại một phần lớp nhầy trong quá trình phơi, góp phần tạo cảm giác ngọt và tròn hơn trong tách.”

## Không nên dùng

- “Tuyệt hảo nhất”.
- “Tinh hoa tuyệt đối”.
- “Cứu lấy hành tinh”.
- “100% xanh”.
- “Cà phê sạch” khi không định nghĩa.
- Quá nhiều từ tiếng Anh không cần thiết.

---

# 22. UI state copy

## Search empty

> Chưa thấy sản phẩm phù hợp với từ khóa này.

## Filter empty

> Bộ lọc hiện tại chưa có kết quả. Hãy thử một vùng hoặc cách pha khác.

## Cart empty

> **Giỏ hàng đang chờ tách cà phê đầu tiên**  
> Khám phá bộ sưu tập hoặc để Coffee Advisor chọn giúp.

## Advisor loading

> Đang đối chiếu khẩu vị của bạn với sáu sản phẩm…

## Advisor no exact match

> Chưa có sản phẩm khớp hoàn toàn. Đây là ba lựa chọn gần nhất và lý do chúng có thể phù hợp.

## Lot demo disclosure

> Hồ sơ này sử dụng dữ liệu mô phỏng để trình diễn cấu trúc truy xuất của hệ thống.

## Checkout success

> Đơn demo đã được tạo. Chưa có thanh toán hoặc vận chuyển thật.

---

# 23. Accessibility checklist

- [ ] Text contrast AA.
- [ ] Font body tối thiểu 16 px.
- [ ] Button hit area tối thiểu 44×44 px.
- [ ] Focus visible.
- [ ] Dialog focus trap.
- [ ] Flavor profile có label text.
- [ ] Map có text alternative.
- [ ] Không dùng màu là dấu hiệu duy nhất.
- [ ] Motion reduced mode.
- [ ] Form error có mô tả cụ thể.
- [ ] Product image alt mô tả pack, không lặp tên vô nghĩa.
- [ ] Heading hierarchy đúng.

---

# 24. UI acceptance criteria

- [ ] Giao diện không giống template generic.
- [ ] Có visual language “editorial cartography”.
- [ ] Hero mạnh và không dùng slider.
- [ ] Sáu product pack có hệ thống chung nhưng phân biệt được.
- [ ] Traceability là một trải nghiệm chính, không bị giấu trong footer.
- [ ] Shop filter dùng được trên mobile.
- [ ] Product page có flavor, origin, brew và transparency.
- [ ] Advisor dùng được bằng keyboard.
- [ ] Claim môi trường luôn có evidence level.
- [ ] Không có review/rating giả.
- [ ] Không có số liệu CO₂/nước giả.
- [ ] UI hoàn chỉnh ở 375 px, 768 px, 1280 px và 1440 px.
- [ ] Dark mode không bắt buộc trong MVP.
- [ ] Mọi copy quan trọng bằng tiếng Việt.

---

# 25. Prompt cuối để agent thiết kế và code UI

```text
Hãy dùng tài liệu này làm nguồn sự thật duy nhất cho UI/UX.

Dựng một storefront Next.js cao cấp với visual direction “Editorial Cartography”: đường đồng mức, dấu lô, bản đồ Việt Nam tối giản, pack design hiện đại và typography có tính biên tập.

Các yêu cầu không được bỏ:
- Brand config có thể đổi tên.
- Hero không dùng carousel.
- Có Vietnam flavor map.
- Có 6 product cards và product detail hoàn chỉnh.
- Traceability lookup + lot passport là chức năng nổi bật.
- Coffee Advisor dạng 6 bước với recommendation mock.
- Cart và checkout demo.
- Minh bạch evidence level.
- Responsive và accessible.
- Không fake review, certification, carbon hoặc environmental claims.
- Không dùng lorem ipsum.
- Không chỉ dựng wireframe; phải hoàn thiện visual, state và interaction.

Hãy ưu tiên tính rõ ràng, cảm giác cao cấp yên tĩnh và bản sắc Việt Nam hiện đại. Chạy production build và sửa mọi lỗi trước khi hoàn thành.
```

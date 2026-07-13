# Design decisions

## Editorial Cartography

Visual language dùng typography biên tập, đường đồng mức, route line, bản đồ Việt Nam cách điệu, lot stamp và passport layout. Product pack được dựng bằng CSS/SVG cùng một grid nhưng có accent riêng cho từng dòng.

## Quiet premium

Paper/mist là nền chính; forest dùng cho cấu trúc và CTA, clay/honey làm điểm nhấn. Border và tonal separation được ưu tiên hơn shadow. Giao diện tránh nền gỗ, bảng đen, icon hạt cà phê lặp lại và carousel.

## Progressive interactivity

Trang và dữ liệu chính render trên server. Filter, quick view, selectors, cart, quiz và form là client islands. URL là source of truth cho filter; localStorage là source of persistence cho cart.

## Accessibility

Button có hit area tối thiểu 44 px, focus ring rõ, dialogs dùng native/Radix focus trapping, map có title/description và text list, flavor profile có label + meter value, timeline có ordered-list semantics, motion tôn trọng `prefers-reduced-motion`.

## Honest evidence

Màu không phải tín hiệu duy nhất: mỗi evidence level luôn có text label. Demo disclosure xuất hiện trên overview, product passport và lot detail. Không có rating/review hoặc sustainability claim không có evidence.

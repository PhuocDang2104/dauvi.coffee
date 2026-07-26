# Design decisions

## Editorial Cartography

Visual language dùng typography biên tập, đường đồng mức, route line, bản đồ Việt Nam cách điệu, lot stamp và passport layout. Product pack được dựng bằng CSS/SVG cùng một grid nhưng có accent riêng cho từng dòng.

## Quiet premium

Paper/mist là nền chính; forest dùng cho cấu trúc và CTA, clay/honey làm điểm nhấn. Border và tonal separation được ưu tiên hơn shadow. Giao diện tránh nền gỗ, bảng đen, icon hạt cà phê lặp lại và carousel.

## Progressive interactivity

Trang và dữ liệu chính render trên server. Filter, quick view, selectors, cart, quiz và form là client islands. URL là source of truth cho filter; localStorage là source of persistence cho cart.

HTTP repositories dùng `cache: no-store` để dữ liệu catalog/lot từ backend không
bị đóng băng ngoài ý muốn khi frontend chạy trên Vercel. Chế độ mock vẫn hỗ trợ
build tĩnh và kiểm thử độc lập.

## Ranh giới triển khai

Frontend deploy Vercel. FastAPI và PostgreSQL chạy trong Docker trên cloud;
PostgreSQL chỉ ở mạng nội bộ, backend publish `127.0.0.1:8000` để Caddy hiện có
reverse proxy. Checkout dùng idempotency key và server-side repricing nhưng chỉ
tạo đơn trình diễn, không thực hiện thanh toán hoặc giao vận.

## Accessibility

Button có hit area tối thiểu 44 px, focus ring rõ, dialogs dùng native/Radix focus trapping, map có title/description và text list, flavor profile có label + meter value, timeline có ordered-list semantics, motion tôn trọng `prefers-reduced-motion`.

## Honest evidence

Màu không phải tín hiệu duy nhất: mỗi evidence level luôn có text label. Demo disclosure xuất hiện trên overview, product passport và lot detail. Không có rating/review hoặc sustainability claim không có evidence.

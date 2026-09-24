# DẤU VỊ — chỉnh sửa UI

## Hướng thiết kế

- Giữ hệ Fraunces/Manrope, màu giấy/xanh rừng, sáu ảnh SKU và bản đồ tương tác.
- Bố cục giữa trang có giới hạn chiều rộng; không dùng CSS zoom để thu nhỏ toàn bộ giao diện.
- Giảm chiều cao hero, giảm card lồng nhau, shadow và hiệu ứng phát sáng; duy trì focus và reduced-motion.
- Chọn nhanh dụng cụ ở shop; menu đánh dấu trang hiện tại; gallery sản phẩm không bị kéo dài theo form.
- Chatbot tự cuộn câu trả lời, giữ xuống dòng và không che nút mua trên mobile.
- Carousel có nút tạm dừng, nút chọn slide đủ vùng bấm và timeline có nhãn trên mobile.
- Sửa CSS reset ghi đè màu chữ/kiểu chữ utility của link và form; dải hương vị xếp theo body thực tế.
- Bổ sung trang hướng dẫn drip bag và ảnh WebP minh họa. Loại bỏ nội dung ám chỉ chuyên gia thật/bán chạy khi chưa có bằng chứng.

## Tham khảo

- [Origin Coffee — subscription/product selection](https://www.origincoffee.co.uk/pages/coffee-subscriptions): luồng chọn cà phê và cách pha rõ ràng.
- [Origin — size and grind selection](https://www.origincoffee.co.uk/products/coffee-subscription-feature): phân biệt quy cách và độ xay.
- [La Cabra — brewing](https://us.lacabra.com/pages/brewing): nội dung pha chế tổ chức theo nhu cầu người đọc.

Chỉ tham khảo nguyên tắc tổ chức nội dung; không sao chép ảnh, review, chứng nhận hoặc claim của các thương hiệu này. Nguồn gốc ảnh và prompt: `public/images/brewing/README.md`.

## Chạy lại frontend

```powershell
cd C:\Users\ADMIN\Desktop\coffee-ai-web\frontend
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm start
```

Ở terminal thứ hai: `pnpm test:e2e`. Rà 17 route tại 375/768/1280/1440 px bằng `node scripts/visual-review.mjs`; ảnh và kết quả nằm trong `playwright-report/visual-review/` (không commit). Chạy trên mock khi kiểm thử các tác vụ ghi dữ liệu, không tạo đơn/tài khoản thử trên production.

## Triển khai bản UI này

Chỉ frontend thay đổi; **không cần build lại backend, PostgreSQL hoặc Caddy**. Push lên nhánh `main`, Vercel triển khai qua Git integration nếu đã bật. Giữ nguyên các biến API/auth đang hoạt động; đợt UI này không thêm biến môi trường.

Xem deployment tương ứng commit mới ở Vercel → Deployments → đợi Ready. Nếu Git integration không tự chạy, redeploy commit mới từ dashboard. Website: https://dauvi-coffee.vercel.app/

Để đồng bộ source trên VNPT Cloud (không gián đoạn dịch vụ):

```bash
cd /opt/dauvi.coffee
git status --short
git pull --ff-only origin main
```

Nếu có thay đổi local gây conflict, dừng và giữ lại chúng; không reset hay xóa `docker/.env`. Không cần chạy `docker compose down` hoặc restart `minute_caddy`.

# Backend integration TODOs

- [x] Cung cấp API product/lot/advisor đúng contracts; giữ Zod parsing và mappers ở frontend adapter layer.
- [x] Lưu catalog, variant, pricing, lot, timeline và evidence demo trong PostgreSQL.
- [x] Đưa rule-based Advisor sang endpoint backend, vẫn giới hạn trong catalog.
- [x] Tạo `POST /orders`, tính lại giá server-side, lưu COD demo và hỗ trợ idempotency.
- [x] Đóng gói FastAPI/PostgreSQL bằng Docker Compose, migration, seed và healthcheck.
- [ ] Thay dữ liệu catalog/tồn kho mô phỏng bằng commerce backend hoặc CMS thật.
- [ ] Thay hồ sơ lô mô phỏng bằng nguồn, timestamp và quy trình xác minh được phép công bố.
- [x] Thêm Coffee Assistant RAG: truy xuất catalog/lô từ PostgreSQL, Groq structured output, evidence guardrail, rate limit và fallback rule-based.
- Đồng bộ cart với account/session khi authentication được bật; migrate `vtc-cart-v1` an toàn.
- Bổ sung shipping quote, trạng thái đơn và payment provider qua tokenized hosted fields; không đưa card data qua frontend tự quản.
- [x] Triển khai `/auth/register`, `/auth/login`, `/auth/session`, `/auth/logout`: Argon2id, cookie HttpOnly/Secure, session rotation, kiểm tra Origin và rate limiting lưu trong PostgreSQL.
- [x] Triển khai `/assistant/messages` với catalog/evidence guardrail và action chỉ trỏ route nội bộ hợp lệ.
- [ ] Thu thập eval set hội thoại thực tế trước khi thay đổi model/prompt hoặc nâng Coffee Advisor rule-based sang AI.
- Thay farm/cooperative/lot Demo Data bằng hồ sơ được phép công bố; chỉ nâng evidence level sau quy trình xác minh.
- Kết nối ảnh sản phẩm thật qua CDN/image pipeline và giữ alt text theo content model.

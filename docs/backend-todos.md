# Backend integration TODOs

- [x] Cung cấp API product/lot/advisor đúng contracts; giữ Zod parsing và mappers ở frontend adapter layer.
- [x] Lưu catalog, variant, pricing, lot, timeline và evidence demo trong PostgreSQL.
- [x] Đưa rule-based Advisor sang endpoint backend, vẫn giới hạn trong catalog.
- [x] Tạo `POST /orders`, tính lại giá server-side, lưu COD demo và hỗ trợ idempotency.
- [x] Đóng gói FastAPI/PostgreSQL bằng Docker Compose, migration, seed và healthcheck.
- [ ] Thay dữ liệu catalog/tồn kho mô phỏng bằng commerce backend hoặc CMS thật.
- [ ] Thay hồ sơ lô mô phỏng bằng nguồn, timestamp và quy trình xác minh được phép công bố.
- [ ] Nâng Advisor thành AI/RAG có catalog guardrail và citation/evidence policy.
- Đồng bộ cart với account/session khi authentication được bật; migrate `vtc-cart-v1` an toàn.
- Bổ sung shipping quote, trạng thái đơn và payment provider qua tokenized hosted fields; không đưa card data qua frontend tự quản.
- [ ] Triển khai contract `/auth/register`, `/auth/login`, `/auth/session`, `/auth/logout`: Argon2id, cookie HttpOnly/Secure, rotation, CSRF policy, rate limiting, consent và privacy retention. Frontend form đã nối sẵn qua `NEXT_PUBLIC_ENABLE_AUTH`.
- [ ] Triển khai `/assistant/messages` với catalog/evidence guardrail; frontend tự dùng rule set local cho đến khi `NEXT_PUBLIC_ENABLE_CHATBOT_API=true`.
- Thay farm/cooperative/lot Demo Data bằng hồ sơ được phép công bố; chỉ nâng evidence level sau quy trình xác minh.
- Kết nối ảnh sản phẩm thật qua CDN/image pipeline và giữ alt text theo content model.

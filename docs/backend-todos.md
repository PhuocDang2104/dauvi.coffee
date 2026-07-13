# Backend integration TODOs

- Thay mock repositories bằng API responses đúng contracts trong `docs/api-contracts.md`; giữ DTO parsing và mappers ở adapter layer.
- Cấp dữ liệu product/catalog, inventory và pricing thực từ commerce backend/CMS.
- Cấp lot passport, evidence source, timestamps và trạng thái xác minh từ traceability service.
- Thay rule-only Advisor repository bằng endpoint AI/RAG có catalog guardrail và citation/evidence policy.
- Đồng bộ cart với account/session khi authentication được bật; migrate `vtc-cart-v1` an toàn.
- Thay checkout local bằng `POST /api/v1/orders`, shipping quote và order status. Chỉ tích hợp payment provider qua tokenized hosted fields; không đưa card data qua frontend tự quản.
- Bổ sung auth/account, consent, privacy retention, rate limiting và observability.
- Thay farm/cooperative/lot Demo Data bằng hồ sơ được phép công bố; chỉ nâng evidence level sau quy trình xác minh.
- Kết nối ảnh sản phẩm thật qua CDN/image pipeline và giữ alt text theo content model.

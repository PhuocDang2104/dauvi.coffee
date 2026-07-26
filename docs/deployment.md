# Deploy DẤU VỊ: Vercel + VNPT Cloud + DuckDNS + Caddy

Kiến trúc production được đóng gói theo mô hình:

```text
Browser
  └─ https://<project>.vercel.app
       ├─ Next.js frontend
       └─ /backend-api/* (Vercel rewrite, cùng origin cho cookie)
            └─ https://<subdomain>.duckdns.org/api/v1/*
                 └─ Caddy :443
                      └─ backend:8000 (FastAPI)
                           └─ database:5432 (PostgreSQL, internal network)
```

Frontend gọi backend qua `/backend-api`, vì vậy cookie đăng nhập vẫn là cookie
cùng origin với website. `API_BASE_URL` riêng được Next.js dùng khi render/build
phía server và trỏ thẳng tới API DuckDNS.

## 1. Chuẩn bị VNPT Cloud

Khuyến nghị ban đầu cho đồ án: Ubuntu 24.04 LTS, 2 vCPU, 4 GB RAM, SSD 30 GB trở
lên và một Public IP. Trong VNPT Cloud Console:

1. Tạo Cloud Server và gán Public IP.
2. Security Group chỉ mở inbound:
   - TCP `22` từ IP quản trị của bạn.
   - TCP `80` và `443` từ Internet cho Caddy.
3. Không mở `5432` hoặc `8000` ra Internet.

Tài liệu VNPT Cloud về Cloud Server và Security Group:

- https://cloud.vnpt.vn/tai-lieu/compute/cloud-server
- https://cloud.vnpt.vn/tai-lieu/article/yeu-cau-ho-tro-mo-port-485

## 2. Cài Docker trên Ubuntu

SSH vào VM, sau đó cài từ repository chính thức của Docker:

```bash
sudo apt update
sudo apt install -y ca-certificates curl git openssl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

sudo tee /etc/apt/sources.list.d/docker.sources >/dev/null <<EOF
Types: deb
URIs: https://download.docker.com/linux/ubuntu
Suites: $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}")
Components: stable
Architectures: $(dpkg --print-architecture)
Signed-By: /etc/apt/keyrings/docker.asc
EOF

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo systemctl enable --now docker
sudo usermod -aG docker "$USER"
```

Đăng xuất SSH rồi đăng nhập lại, kiểm tra:

```bash
docker version
docker compose version
```

Nguồn chính thức: https://docs.docker.com/engine/install/ubuntu/

## 3. Đưa repository lên VM

```bash
sudo mkdir -p /opt/dauvi
sudo chown "$USER":"$USER" /opt/dauvi
git clone <YOUR_GIT_REPOSITORY_URL> /opt/dauvi
cd /opt/dauvi
```

Nếu repository private, dùng SSH deploy key thay vì lưu password/token trong
command history.

## 4. Kiểm tra DuckDNS

Tại DuckDNS, tạo subdomain, ví dụ `dauvi-api.duckdns.org`, rồi trỏ nó tới Public
IP của VM. Có thể cập nhật thủ công bằng API chính thức:

```bash
curl "https://www.duckdns.org/update?domains=dauvi-api&token=<DUCKDNS_TOKEN>&ip=<VNPT_PUBLIC_IP>&verbose=true"
```

Không commit DuckDNS token vào repository. Kiểm tra DNS:

```bash
getent hosts dauvi-api.duckdns.org
```

Đặc tả DuckDNS update API: https://www.duckdns.org/spec.jsp

## 5. Tạo biến backend production

```bash
cd /opt/dauvi
cp docker/.env.example docker/.env
chmod 600 docker/.env

openssl rand -hex 32
openssl rand -base64 48 | tr -dc 'A-Za-z0-9' | head -c 48; echo
nano docker/.env
```

Điền `docker/.env`:

```dotenv
POSTGRES_DB=dauvi
POSTGRES_USER=dauvi
POSTGRES_PASSWORD=<PASSWORD_URL_SAFE_VỪA_TẠO>

CORS_ORIGINS=https://<YOUR-VERCEL-PROJECT>.vercel.app
ALLOWED_HOSTS=dauvi-api.duckdns.org,backend,localhost,127.0.0.1

SESSION_SECRET=<64_HEX_CHARACTERS_TỪ_OPENSSL>
SESSION_COOKIE_NAME=dauvi_session
SESSION_COOKIE_SECURE=true
SESSION_COOKIE_SAMESITE=lax
SESSION_COOKIE_DOMAIN=
SESSION_TTL_HOURS=24
SESSION_REMEMBER_DAYS=30
AUTH_RATE_LIMIT_ATTEMPTS=8
AUTH_RATE_LIMIT_WINDOW_MINUTES=15

DOCS_ENABLED=false
LOG_LEVEL=INFO
WEB_CONCURRENCY=2
FORWARDED_ALLOW_IPS=*
BACKEND_BIND_ADDRESS=127.0.0.1
BACKEND_PORT=8000
CADDY_NETWORK=caddy
```

`POSTGRES_PASSWORD` nên chỉ gồm chữ và số vì Compose dùng nó trong PostgreSQL
connection URL. `SESSION_SECRET` phải riêng cho production và không được dùng lại
giữa các môi trường.

## 6. Nối backend với Caddy đang chạy

Nếu Caddy chạy bằng Docker, đảm bảo có external network dùng chung:

```bash
docker network inspect caddy >/dev/null 2>&1 || docker network create caddy
docker ps --format 'table {{.Names}}\t{{.Networks}}'
```

Nếu container Caddy chưa nằm trong network này:

```bash
docker network connect caddy <CADDY_CONTAINER_NAME>
```

Ghép block trong `docker/Caddyfile.example` vào Caddyfile hiện tại và thay domain:

```caddyfile
dauvi-api.duckdns.org {
    encode zstd gzip
    reverse_proxy backend:8000

    header {
        -Server
        X-Content-Type-Options nosniff
        Referrer-Policy same-origin
        Permissions-Policy "camera=(), microphone=(), geolocation=()"
    }
}
```

Caddy tự lấy và gia hạn HTTPS khi DNS đúng và port 80/443 truy cập được. Kiểm tra
và reload trong container đang chạy:

```bash
docker exec <CADDY_CONTAINER_NAME> caddy validate --config /etc/caddy/Caddyfile
docker exec <CADDY_CONTAINER_NAME> caddy reload --config /etc/caddy/Caddyfile
```

Tài liệu Caddy: https://caddyserver.com/docs/caddyfile/directives/reverse_proxy

## 7. Build và chạy backend trên VNPT Cloud

Build riêng image backend nếu cần kiểm tra image:

```bash
cd /opt/dauvi
docker build --pull -f docker/backend.Dockerfile -t dauvi-backend:1.0.0 .
```

Chạy đầy đủ PostgreSQL + backend và nối network Caddy:

```bash
docker compose \
  --env-file docker/.env \
  -f docker/compose.yml \
  -f docker/compose.caddy.yml \
  build --pull backend

docker compose \
  --env-file docker/.env \
  -f docker/compose.yml \
  -f docker/compose.caddy.yml \
  up -d database backend
```

Entrypoint tự chạy `alembic upgrade head`, seed sáu sản phẩm/sáu lot rồi mới mở
Uvicorn. Kiểm tra:

```bash
docker compose --env-file docker/.env -f docker/compose.yml -f docker/compose.caddy.yml ps
docker compose --env-file docker/.env -f docker/compose.yml -f docker/compose.caddy.yml logs --tail=200 backend
curl -fsS http://127.0.0.1:8000/health/ready
curl -fsS https://dauvi-api.duckdns.org/health/ready
curl -fsS https://dauvi-api.duckdns.org/api/v1/products/featured
```

## 8. Deploy frontend trên Vercel

Trong Vercel:

1. Import Git repository.
2. Đặt **Root Directory** là `frontend`.
3. Framework Preset: Next.js.
4. Install Command: `pnpm install --frozen-lockfile`.
5. Build Command: `pnpm build`.
6. Chọn project name trước để biết URL ổn định, ví dụ
   `https://dauvi-coffee.vercel.app`.

Thêm các biến cho môi trường **Production**:

```dotenv
NEXT_PUBLIC_SITE_URL=https://dauvi-coffee.vercel.app
NEXT_PUBLIC_API_BASE_URL=https://dauvi-coffee.vercel.app/backend-api
API_BASE_URL=https://dauvi-api.duckdns.org/api/v1
BACKEND_PROXY_ORIGIN=https://dauvi-api.duckdns.org
NEXT_PUBLIC_DATA_SOURCE=http
NEXT_PUBLIC_ENABLE_CHECKOUT=true
NEXT_PUBLIC_ENABLE_AUTH=true
NEXT_PUBLIC_ENABLE_CHATBOT_API=true
```

Không thêm `SESSION_SECRET`, `POSTGRES_PASSWORD` hay DuckDNS token vào Vercel;
chúng chỉ thuộc VM backend. Sau khi đổi biến Vercel phải redeploy vì các biến
`NEXT_PUBLIC_*` được đóng vào client bundle lúc build.

Cấu hình `CORS_ORIGINS` trong `docker/.env` phải khớp chính xác
`NEXT_PUBLIC_SITE_URL`. Sau khi sửa backend env:

```bash
docker compose --env-file docker/.env -f docker/compose.yml -f docker/compose.caddy.yml up -d --force-recreate backend
```

Vercel Environment Variables:
https://vercel.com/docs/environment-variables

Vercel external rewrites:
https://vercel.com/docs/routing/rewrites

## 9. Kiểm tra sau deploy

```bash
curl -i https://dauvi-api.duckdns.org/health/ready
curl -i https://dauvi-coffee.vercel.app/backend-api/products/featured
```

Trên browser kiểm tra:

1. `/shop` đọc catalog từ PostgreSQL.
2. `/traceability/TR4-DLK-26-N02` mở đúng lot demo.
3. `/advisor` trả top 3.
4. Chatbot trả response từ `/assistant/messages`.
5. `/register` tạo tài khoản, DevTools phải thấy cookie `dauvi_session` có
   `HttpOnly`, `Secure`, `SameSite=Lax`.
6. Checkout COD tạo đơn `demo-confirmed`.

Nếu dùng URL Vercel khác, cập nhật đồng thời `NEXT_PUBLIC_SITE_URL`,
`NEXT_PUBLIC_API_BASE_URL` và backend `CORS_ORIGINS`, sau đó redeploy cả hai.

## 10. Cập nhật phiên bản

```bash
cd /opt/dauvi
git pull --ff-only
docker compose --env-file docker/.env -f docker/compose.yml -f docker/compose.caddy.yml build --pull backend
docker compose --env-file docker/.env -f docker/compose.yml -f docker/compose.caddy.yml up -d backend
docker image prune -f
```

Frontend được Vercel tự redeploy khi push nhánh production.

## 11. Backup PostgreSQL

```bash
mkdir -p /opt/dauvi-backups
docker compose --env-file docker/.env -f docker/compose.yml exec -T database \
  pg_dump -U dauvi -d dauvi -Fc > "/opt/dauvi-backups/dauvi-$(date +%F-%H%M).dump"
```

Khôi phục vào database trống:

```bash
cat /opt/dauvi-backups/<BACKUP_FILE>.dump | \
docker compose --env-file docker/.env -f docker/compose.yml exec -T database \
  pg_restore -U dauvi -d dauvi --clean --if-exists
```

## 12. Phạm vi backend production hiện tại

Đã có PostgreSQL, migrations, seed, catalog, truy xuất, Advisor, Coffee Assistant,
authentication/session và lưu đơn COD demo. Hệ thống chưa tích hợp payment gateway,
đơn vị vận chuyển, email transactional hay AI/LLM thật. Không gửi dữ liệu thẻ vào
API này; trạng thái đơn vẫn là `demo-confirmed`.

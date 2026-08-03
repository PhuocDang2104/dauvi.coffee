# Deploy DẤU VỊ

Hạ tầng đã dùng:

- Repo: `https://github.com/PhuocDang2104/dauvi.coffee`
- Frontend: `https://dauvi-coffee.vercel.app`
- Backend: `https://dauvi-api.duckdns.org`
- Caddy đang chạy trong container `minute_caddy`.
- `127.0.0.1:8000` đã bị `minute_backend` sử dụng, nên DẤU VỊ dùng `18081` để kiểm tra local.

## 1. Clone repo trên VNPT Cloud

```bash
sudo mkdir -p /opt/dauvi
sudo chown "$USER":"$USER" /opt/dauvi
git clone https://github.com/PhuocDang2104/dauvi.coffee.git /opt/dauvi
cd /opt/dauvi
```

## 2. Tạo biến backend

```bash
cp docker/.env.example docker/.env
chmod 600 docker/.env
openssl rand -hex 24   # dùng làm POSTGRES_PASSWORD
openssl rand -hex 32   # dùng làm SESSION_SECRET
nano docker/.env
```

Giữ các giá trị sau và thay ba secret:

```dotenv
POSTGRES_DB=dauvi
POSTGRES_USER=dauvi
POSTGRES_PASSWORD=<PASSWORD_VUA_TAO>

CORS_ORIGINS=https://dauvi-coffee.vercel.app
ALLOWED_HOSTS=dauvi-api.duckdns.org,dauvi-coffee.vercel.app,dauvi-api,backend,localhost,127.0.0.1

SESSION_SECRET=<SESSION_SECRET_VUA_TAO>
SESSION_COOKIE_NAME=dauvi_session
SESSION_COOKIE_SECURE=true
SESSION_COOKIE_SAMESITE=lax
SESSION_COOKIE_DOMAIN=
SESSION_TTL_HOURS=24
SESSION_REMEMBER_DAYS=30
AUTH_RATE_LIMIT_ATTEMPTS=8
AUTH_RATE_LIMIT_WINDOW_MINUTES=15

ASSISTANT_RATE_LIMIT_REQUESTS=12
ASSISTANT_RATE_LIMIT_WINDOW_MINUTES=1
AI_ENABLED=true
GROQ_API_KEY=<GROQ_API_KEY_BAT_DAU_BANG_gsk_>
GROQ_BASE_URL=https://api.groq.com/openai/v1
GROQ_MODEL=openai/gpt-oss-20b
GROQ_REASONING_EFFORT=low
GROQ_TIMEOUT_SECONDS=20
GROQ_MAX_OUTPUT_TOKENS=800

DOCS_ENABLED=false
LOG_LEVEL=INFO
WEB_CONCURRENCY=2
FORWARDED_ALLOW_IPS=*
BACKEND_BIND_ADDRESS=127.0.0.1
BACKEND_PORT=18081
CADDY_NETWORK=caddy
```

`GROQ_API_KEY`, password DB và session secret chỉ nằm trong `docker/.env` trên VM; không thêm chúng vào Vercel hoặc Git.

## 3. Nối backend vào Caddy đang chạy

Tạo network dùng chung rồi nối chính container `minute_caddy` vào network đó một lần:

```bash
docker network inspect caddy >/dev/null 2>&1 || docker network create caddy
docker network inspect caddy --format '{{json .Containers}}' | grep -q 'minute_caddy' \
  || docker network connect caddy minute_caddy
docker inspect minute_caddy --format '{{range .Mounts}}{{println .Source "->" .Destination}}{{end}}'
```

Lệnh cuối in ra đường dẫn Caddyfile trên host. Mở file nguồn đó và giữ block:

```caddyfile
dauvi-api.duckdns.org {
  encode zstd gzip
  reverse_proxy dauvi-api:8000
}
```

Kiểm tra và reload Caddy:

```bash
docker exec minute_caddy caddy validate --config /etc/caddy/Caddyfile
docker exec minute_caddy caddy reload --config /etc/caddy/Caddyfile
```

## 4. Build và chạy backend

```bash
cd /opt/dauvi
docker compose --env-file docker/.env -f docker/compose.yml -f docker/compose.caddy.yml build --pull backend
docker compose --env-file docker/.env -f docker/compose.yml -f docker/compose.caddy.yml up -d database backend
docker compose --env-file docker/.env -f docker/compose.yml -f docker/compose.caddy.yml logs --tail=150 backend
```

Container backend có tên `dauvi-api`. Khi khởi động, nó tự migrate DB và seed 6 sản phẩm + 6 hồ sơ lô.

Kiểm tra:

```bash
curl -fsS http://127.0.0.1:18081/health/ready
curl -fsS https://dauvi-api.duckdns.org/health/ready
curl -fsS https://dauvi-api.duckdns.org/api/v1/products/featured
```

## 5. Biến Vercel

Trong Vercel đặt **Root Directory** là `frontend`, rồi thêm đúng các biến Production:

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

Redeploy frontend sau khi lưu biến. `/backend-api/*` là rewrite cùng origin, nhờ đó cookie đăng nhập `HttpOnly` hoạt động ổn định trên domain Vercel.

## 6. Kiểm tra production

```bash
curl -fsS https://dauvi-coffee.vercel.app/backend-api/products/featured
```

Trên browser kiểm tra:

- `/register`: tạo tài khoản thật trong PostgreSQL rồi đăng nhập bằng session cookie.
- Chatbot: hỏi “Cà phê pha phin dưới 120.000 ₫” và “Mã TR4-DLK-26-N02”.
- `/traceability/TR4-DLK-26-N02`: hiện đúng passport Demo Data.

## 7. Update backend

```bash
cd /opt/dauvi
git pull --ff-only
docker compose --env-file docker/.env -f docker/compose.yml -f docker/compose.caddy.yml build --pull backend
docker compose --env-file docker/.env -f docker/compose.yml -f docker/compose.caddy.yml up -d backend
docker image prune -f
```

Backup nhanh PostgreSQL:

```bash
mkdir -p /opt/dauvi-backups
docker compose --env-file docker/.env -f docker/compose.yml exec -T database pg_dump -U dauvi -d dauvi -Fc > "/opt/dauvi-backups/dauvi-$(date +%F-%H%M).dump"
```

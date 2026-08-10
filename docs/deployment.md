# Deploy DẤU VỊ

Hạ tầng hiện tại:

- Repo: `https://github.com/PhuocDang2104/dauvi.coffee`
- Frontend Vercel: `https://dauvi-coffee.vercel.app`
- Backend: `https://dauvi-api.duckdns.org`
- Reverse proxy: container Caddy `minute_caddy`, network dùng chung `caddy`.
- Backend bind local `127.0.0.1:18081`; Caddy gọi container `dauvi-api:8000`.

## 1. Biến backend trên VNPT Cloud

```bash
cd /opt/dauvi.coffee
  cp -n docker/.env.example docker/.env
  chmod 600 docker/.env
  openssl rand -hex 24   # POSTGRES_PASSWORD
  openssl rand -hex 32   # SESSION_SECRET
  nano docker/.env
```

Các giá trị production quan trọng:

```dotenv
POSTGRES_DB=dauvi
POSTGRES_USER=dauvi
POSTGRES_PASSWORD=<PASSWORD_DA_TAO>
CORS_ORIGINS=https://dauvi-coffee.vercel.app
ALLOWED_HOSTS=dauvi-api.duckdns.org,dauvi-coffee.vercel.app,dauvi-api,backend,localhost,127.0.0.1

SESSION_SECRET=<SESSION_SECRET_DA_TAO>
SESSION_COOKIE_SECURE=true
SESSION_COOKIE_SAMESITE=lax

RAG_ENABLED=true
VECTOR_SEARCH_ENABLED=true
VECTOR_SEARCH_REQUIRED=true
EMBEDDING_MODEL=sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2
EMBEDDING_DIMENSIONS=384
EMBEDDING_CACHE_DIR=/opt/fastembed-cache
RAG_TOP_K=6
RAG_RRF_K=60

AI_ENABLED=true
GROQ_API_KEY=<GROQ_KEY_BAT_DAU_BANG_gsk_>
GROQ_BASE_URL=https://api.groq.com/openai/v1
GROQ_MODEL=openai/gpt-oss-20b

DOCS_ENABLED=false
WEB_CONCURRENCY=2
FORWARDED_ALLOW_IPS=*
BACKEND_BIND_ADDRESS=127.0.0.1
BACKEND_PORT=18081
CADDY_NETWORK=caddy
```

Không đưa password, session secret hoặc Groq key lên Git/Vercel.

## 2. Caddy đang chạy

Caddyfile giữ block sau:

```caddyfile
dauvi-api.duckdns.org {
  encode zstd gzip
  reverse_proxy dauvi-api:8000
}
```

Kết nối đúng container hiện có và reload:

```bash
docker network inspect caddy >/dev/null 2>&1 || docker network create caddy
docker network inspect caddy --format '{{json .Containers}}' | grep -q 'minute_caddy' \
  || docker network connect caddy minute_caddy
docker exec minute_caddy caddy validate --config /etc/caddy/Caddyfile
docker exec minute_caddy caddy reload --config /etc/caddy/Caddyfile
```

## 3. Build lại backend có LangGraph + pgvector

Sao lưu trước khi thay image PostgreSQL bằng image cùng major có pgvector:

```bash
cd /opt/dauvi.coffee
git pull --ff-only
mkdir -p /opt/dauvi-backups
docker compose --env-file docker/.env -f docker/compose.yml exec -T database \
  pg_dump -U dauvi -d dauvi -Fc \
  > "/opt/dauvi-backups/dauvi-pre-rag-$(date +%F-%H%M).dump"
```

Build qua mạng host để tránh lỗi DNS trong Docker và tải sẵn embedding model vào image:

```bash
docker pull pgvector/pgvector:0.8.6-pg17-bookworm
docker build --network=host --pull \
  --build-arg EMBEDDING_MODEL=sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2 \
  -f docker/backend.Dockerfile -t dau-vi-backend:latest .

docker compose --env-file docker/.env \
  -f docker/compose.yml -f docker/compose.caddy.yml \
  up -d --no-build database
docker compose --env-file docker/.env \
  -f docker/compose.yml -f docker/compose.caddy.yml \
  up -d --no-build --force-recreate backend
```

Backend tự chạy Alembic, bật extension `vector`, tạo HNSW index và seed 8 tài liệu/24
knowledge chunks. Semantic router dùng Groq để chọn đúng một tool node; khi Groq lỗi,
deterministic router tiếp quản. Xem trạng thái:

```bash
docker compose --env-file docker/.env \
  -f docker/compose.yml -f docker/compose.caddy.yml \
  ps
docker compose --env-file docker/.env \
  -f docker/compose.yml -f docker/compose.caddy.yml \
  logs --tail=200 backend
```

## 4. Kiểm tra backend và RAG

```bash
curl --max-time 15 -fsS http://127.0.0.1:18081/health/ready; echo
curl --max-time 15 -fsS https://dauvi-api.duckdns.org/health/rag; echo

docker compose --env-file docker/.env -f docker/compose.yml exec -T database \
  psql -U dauvi -d dauvi -c '\\dx vector'
docker compose --env-file docker/.env -f docker/compose.yml exec -T database \
  psql -U dauvi -d dauvi -c \
  'SELECT count(*) AS chunks, count(embedding) AS vectors FROM knowledge_chunks;'

curl --max-time 30 -fsS -X POST \
  https://dauvi-api.duckdns.org/api/v1/assistant/messages \
  -H 'Content-Type: application/json' \
  -d '{"message":"Tư vấn cà phê pha phin đậm dưới 120.000 đồng"}'; echo
```

Kết quả đúng: health `ready`, routing=`groq-semantic-router+deterministic-fallback`,
24 chunks/24 vectors và chatbot chỉ gợi ý sản phẩm có
trong catalog. Nếu container cũ còn chạy, kiểm tra `docker ps --filter name=dauvi` và
không dùng port `8000` trên host vì port đó đã thuộc service khác.

## 5. Biến Vercel

Đặt Root Directory là `frontend`, rồi thêm đúng các biến Production:

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

Redeploy frontend. `GROQ_API_KEY` chỉ nằm ở VM backend. Rewrite `/backend-api/*` giữ
request đăng nhập cùng origin để cookie `HttpOnly` hoạt động ổn định.

## 6. Chạy toàn bộ repo ở máy phát triển

Backend nhanh với SQLite/BM25:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements-dev.txt
Copy-Item .env.example .env
alembic upgrade head
python -m app.seed
uvicorn app.main:app --reload
```

Frontend ở terminal khác:

```powershell
cd frontend
Copy-Item .env.example .env.local
pnpm install --frozen-lockfile
pnpm dev
```

Mở `http://localhost:3000`; backend ở `http://localhost:8000`. Muốn kiểm thử vector
giống production, dùng Docker Compose và đặt frontend gọi `http://localhost:8000/api/v1`.

## 7. Update những lần sau

```bash
cd /opt/dauvi.coffee
git pull --ff-only
docker build --network=host --pull \
  --build-arg EMBEDDING_MODEL=sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2 \
  -f docker/backend.Dockerfile -t dau-vi-backend:latest .
docker compose --env-file docker/.env \
  -f docker/compose.yml -f docker/compose.caddy.yml \
  up -d --no-build --force-recreate backend
curl --max-time 15 -fsS http://127.0.0.1:18081/health/rag; echo
docker image prune -f
```

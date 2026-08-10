FROM python:3.12-slim-bookworm

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PIP_NO_CACHE_DIR=1 \
    FASTEMBED_CACHE_PATH=/opt/fastembed-cache

ARG EMBEDDING_MODEL=sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2

WORKDIR /app

RUN groupadd --system --gid 10001 app \
    && useradd --system --uid 10001 --gid app --home-dir /app --shell /usr/sbin/nologin app

COPY backend/requirements.txt ./requirements.txt
RUN python -m pip install -r requirements.txt
RUN mkdir -p /opt/fastembed-cache \
    && python -c "from fastembed import TextEmbedding; TextEmbedding(model_name='${EMBEDDING_MODEL}', cache_dir='/opt/fastembed-cache')" \
    && chown -R app:app /opt/fastembed-cache

COPY --chown=app:app backend/ ./
COPY --chown=app:app docker/backend-entrypoint.sh /usr/local/bin/backend-entrypoint
RUN chmod 0555 /usr/local/bin/backend-entrypoint

USER app
EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8000/health/ready', timeout=3)" || exit 1

ENTRYPOINT ["backend-entrypoint"]

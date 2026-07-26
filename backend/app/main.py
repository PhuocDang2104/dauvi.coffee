from __future__ import annotations

import logging
import re
import uuid

from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse
from starlette.middleware.trustedhost import TrustedHostMiddleware

from app.api.health import router as health_router
from app.api.router import api_router
from app.config import get_settings

settings = get_settings()
logging.basicConfig(
    level=getattr(logging, settings.log_level.upper(), logging.INFO),
    format="%(asctime)s %(levelname)s %(name)s %(message)s",
)

app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
    docs_url="/docs" if settings.docs_enabled else None,
    redoc_url="/redoc" if settings.docs_enabled else None,
    openapi_url="/openapi.json" if settings.docs_enabled else None,
)
app.add_middleware(GZipMiddleware, minimum_size=1000)
app.add_middleware(TrustedHostMiddleware, allowed_hosts=settings.allowed_host_list)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    # Required by the reserved /auth contract, which uses Secure HttpOnly cookies.
    # Origins remain an explicit allow-list from CORS_ORIGINS; never use "*" here.
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Accept", "Content-Type", "Idempotency-Key", "X-Request-ID"],
    expose_headers=["X-Request-ID"],
)


@app.middleware("http")
async def request_metadata(request: Request, call_next):
    incoming_request_id = request.headers.get("X-Request-ID", "")
    request_id = (
        incoming_request_id
        if re.fullmatch(r"[A-Za-z0-9._:-]{8,100}", incoming_request_id)
        else str(uuid.uuid4())
    )
    response = await call_next(request)
    response.headers["X-Request-ID"] = request_id
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["Referrer-Policy"] = "same-origin"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
    return response


@app.exception_handler(HTTPException)
async def http_error_handler(_request: Request, error: HTTPException) -> JSONResponse:
    message = error.detail if isinstance(error.detail, str) else "Yêu cầu không thể xử lý."
    return JSONResponse(
        status_code=error.status_code,
        content={"message": message, "code": f"HTTP_{error.status_code}"},
        headers=error.headers,
    )


@app.exception_handler(RequestValidationError)
async def validation_error_handler(
    _request: Request, error: RequestValidationError
) -> JSONResponse:
    first_error = error.errors()[0] if error.errors() else None
    message = (
        first_error.get("msg", "Dữ liệu gửi lên chưa hợp lệ.")
        if first_error
        else "Dữ liệu gửi lên chưa hợp lệ."
    )
    return JSONResponse(
        status_code=422,
        content={"message": message, "code": "VALIDATION_ERROR"},
    )


app.include_router(health_router)
app.include_router(api_router, prefix=settings.api_prefix)

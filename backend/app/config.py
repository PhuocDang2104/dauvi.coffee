from __future__ import annotations

from functools import lru_cache
from typing import Literal

from pydantic import SecretStr, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_name: str = "DẤU VỊ API"
    app_env: Literal["development", "test", "production"] = "development"
    api_prefix: str = "/api/v1"
    database_url: str = "sqlite+pysqlite:///./dauvi.db"
    cors_origins: str = "http://localhost:3000"
    allowed_hosts: str = "localhost,127.0.0.1"
    docs_enabled: bool = True
    log_level: str = "INFO"
    session_secret: str = "development-only-change-me"
    session_cookie_name: str = "dauvi_session"
    session_cookie_secure: bool = False
    session_cookie_samesite: Literal["lax", "strict", "none"] = "lax"
    session_cookie_domain: str | None = None
    session_ttl_hours: int = 24
    session_remember_days: int = 30
    auth_rate_limit_attempts: int = 8
    auth_rate_limit_window_minutes: int = 15
    assistant_rate_limit_requests: int = 12
    assistant_rate_limit_window_minutes: int = 1
    ai_enabled: bool = False
    openai_api_key: SecretStr | None = None
    openai_model: str = "gpt-5.6-sol"
    openai_reasoning_effort: Literal["none", "low", "medium", "high"] = "low"
    openai_timeout_seconds: float = 20.0
    openai_max_output_tokens: int = 800

    @model_validator(mode="after")
    def validate_production_secrets(self) -> Settings:
        if self.app_env == "production":
            if len(self.session_secret) < 32 or self.session_secret == "development-only-change-me":
                raise ValueError("SESSION_SECRET must be a unique value of at least 32 characters.")
            if not self.session_cookie_secure:
                raise ValueError("SESSION_COOKIE_SECURE must be true in production.")
        if self.ai_enabled and not self.openai_api_key:
            raise ValueError("OPENAI_API_KEY is required when AI_ENABLED=true.")
        return self

    @property
    def cors_origin_list(self) -> list[str]:
        return [
            value.strip().rstrip("/") for value in self.cors_origins.split(",") if value.strip()
        ]

    @property
    def allowed_host_list(self) -> list[str]:
        values = [value.strip() for value in self.allowed_hosts.split(",") if value.strip()]
        return values or ["*"]

    @property
    def cookie_domain(self) -> str | None:
        value = self.session_cookie_domain
        return value.strip() if value and value.strip() else None


@lru_cache
def get_settings() -> Settings:
    return Settings()

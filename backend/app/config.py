from __future__ import annotations

from functools import lru_cache
from typing import Literal

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

    @property
    def cors_origin_list(self) -> list[str]:
        return [
            value.strip().rstrip("/") for value in self.cors_origins.split(",") if value.strip()
        ]

    @property
    def allowed_host_list(self) -> list[str]:
        values = [value.strip() for value in self.allowed_hosts.split(",") if value.strip()]
        return values or ["*"]


@lru_cache
def get_settings() -> Settings:
    return Settings()

from __future__ import annotations

import hashlib
import hmac
import secrets
import uuid
from dataclasses import dataclass
from datetime import UTC, datetime, timedelta

from argon2 import PasswordHasher
from argon2.exceptions import InvalidHashError, VerifyMismatchError
from argon2.low_level import Type
from fastapi import HTTPException, Request, status
from sqlalchemy import delete, func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, joinedload

from app.config import Settings, get_settings
from app.models import AuthAttempt, User, UserSession
from app.schemas import AuthSessionOut, AuthUserOut, LoginIn, RegisterIn

password_hasher = PasswordHasher(
    time_cost=3,
    memory_cost=65_536,
    parallelism=2,
    hash_len=32,
    salt_len=16,
    type=Type.ID,
)


@dataclass(frozen=True)
class CreatedSession:
    payload: AuthSessionOut
    token: str
    max_age: int


def utc_now() -> datetime:
    return datetime.now(UTC)


def _as_utc(value: datetime) -> datetime:
    return value.replace(tzinfo=UTC) if value.tzinfo is None else value.astimezone(UTC)


def _token_hash(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def _request_fingerprint(request: Request, settings: Settings) -> str:
    ip = request.client.host if request.client else "unknown"
    return hmac.new(
        settings.session_secret.encode("utf-8"),
        ip.encode("utf-8"),
        hashlib.sha256,
    ).hexdigest()


def _attempt_identity(email: str, request: Request, settings: Settings) -> str:
    fingerprint = f"{email.lower()}:{_request_fingerprint(request, settings)}"
    return hmac.new(
        settings.session_secret.encode("utf-8"),
        fingerprint.encode("utf-8"),
        hashlib.sha256,
    ).hexdigest()


def _to_payload(user: User) -> AuthSessionOut:
    return AuthSessionOut(
        user=AuthUserOut(id=user.id, email=user.email, full_name=user.full_name)
    )


def enforce_allowed_origin(request: Request, settings: Settings | None = None) -> None:
    active_settings = settings or get_settings()
    origin = request.headers.get("origin")
    if origin and origin.rstrip("/") not in active_settings.cors_origin_list:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Origin không được phép thực hiện thao tác này.",
        )


def _check_rate_limit(
    session: Session,
    identity_hash: str,
    settings: Settings,
) -> None:
    window_start = utc_now() - timedelta(minutes=settings.auth_rate_limit_window_minutes)
    failures = session.scalar(
        select(func.count(AuthAttempt.id)).where(
            AuthAttempt.identity_hash == identity_hash,
            AuthAttempt.succeeded.is_(False),
            AuthAttempt.occurred_at >= window_start,
        )
    ) or 0
    if failures >= settings.auth_rate_limit_attempts:
        retry_after = settings.auth_rate_limit_window_minutes * 60
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Quá nhiều lần đăng nhập chưa thành công. Vui lòng thử lại sau.",
            headers={"Retry-After": str(retry_after)},
        )


def _record_attempt(session: Session, identity_hash: str, succeeded: bool) -> None:
    session.add(
        AuthAttempt(
            id=str(uuid.uuid4()),
            identity_hash=identity_hash,
            succeeded=succeeded,
            occurred_at=utc_now(),
        )
    )
    session.commit()


def _cleanup_auth_rows(session: Session) -> None:
    now = utc_now()
    attempt_cutoff = now - timedelta(days=2)
    session.execute(delete(AuthAttempt).where(AuthAttempt.occurred_at < attempt_cutoff))
    session.execute(
        delete(UserSession).where(
            (UserSession.expires_at < now) | (UserSession.revoked_at.is_not(None))
        )
    )


def _create_session(
    session: Session,
    user: User,
    request: Request,
    remember: bool,
    settings: Settings,
) -> CreatedSession:
    _cleanup_auth_rows(session)
    now = utc_now()
    lifetime = (
        timedelta(days=settings.session_remember_days)
        if remember
        else timedelta(hours=settings.session_ttl_hours)
    )
    raw_token = secrets.token_urlsafe(48)
    user_session = UserSession(
        id=str(uuid.uuid4()),
        user_id=user.id,
        token_hash=_token_hash(raw_token),
        expires_at=now + lifetime,
        ip_hash=_request_fingerprint(request, settings),
        user_agent=(request.headers.get("user-agent") or "")[:255] or None,
        created_at=now,
        last_seen_at=now,
    )
    session.add(user_session)
    session.commit()
    return CreatedSession(
        payload=_to_payload(user),
        token=raw_token,
        max_age=int(lifetime.total_seconds()),
    )


def register_user(
    session: Session,
    payload: RegisterIn,
    request: Request,
    settings: Settings,
) -> CreatedSession:
    existing = session.scalar(select(User.id).where(User.email == payload.email))
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email này đã được sử dụng.",
        )
    now = utc_now()
    user = User(
        id=str(uuid.uuid4()),
        email=payload.email,
        full_name=payload.full_name,
        password_hash=password_hasher.hash(payload.password),
        is_active=True,
        accepted_terms_at=now,
        created_at=now,
        updated_at=now,
    )
    session.add(user)
    try:
        session.commit()
    except IntegrityError as error:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email này đã được sử dụng.",
        ) from error
    session.refresh(user)
    return _create_session(session, user, request, remember=True, settings=settings)


def login_user(
    session: Session,
    payload: LoginIn,
    request: Request,
    settings: Settings,
) -> CreatedSession:
    identity_hash = _attempt_identity(payload.email, request, settings)
    _check_rate_limit(session, identity_hash, settings)
    user = session.scalar(select(User).where(User.email == payload.email))
    valid = False
    if user and user.is_active:
        try:
            valid = password_hasher.verify(user.password_hash, payload.password)
        except (VerifyMismatchError, InvalidHashError):
            valid = False
    if not valid or user is None:
        _record_attempt(session, identity_hash, succeeded=False)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email hoặc mật khẩu chưa đúng.",
        )

    _record_attempt(session, identity_hash, succeeded=True)
    session.execute(
        delete(AuthAttempt).where(
            AuthAttempt.identity_hash == identity_hash,
            AuthAttempt.succeeded.is_(False),
        )
    )
    if password_hasher.check_needs_rehash(user.password_hash):
        user.password_hash = password_hasher.hash(payload.password)
    session.commit()
    return _create_session(session, user, request, payload.remember, settings)


def resolve_session(session: Session, raw_token: str | None) -> tuple[User, UserSession] | None:
    if not raw_token:
        return None
    record = session.scalar(
        select(UserSession)
        .options(joinedload(UserSession.user))
        .where(UserSession.token_hash == _token_hash(raw_token))
    )
    if record is None or record.revoked_at is not None or not record.user.is_active:
        return None
    now = utc_now()
    if _as_utc(record.expires_at) <= now:
        record.revoked_at = now
        session.commit()
        return None
    if _as_utc(record.last_seen_at) < now - timedelta(minutes=15):
        record.last_seen_at = now
        session.commit()
    return record.user, record


def require_session(session: Session, raw_token: str | None) -> AuthSessionOut:
    resolved = resolve_session(session, raw_token)
    if resolved is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Phiên đăng nhập không còn hợp lệ.",
        )
    return _to_payload(resolved[0])


def revoke_session(session: Session, raw_token: str | None) -> None:
    if not raw_token:
        return
    record = session.scalar(
        select(UserSession).where(UserSession.token_hash == _token_hash(raw_token))
    )
    if record and record.revoked_at is None:
        record.revoked_at = utc_now()
        session.commit()

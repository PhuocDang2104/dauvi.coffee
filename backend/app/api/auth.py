from typing import Annotated

from fastapi import APIRouter, Depends, Request, Response, status
from sqlalchemy.orm import Session

from app.config import Settings, get_settings
from app.db import get_db
from app.schemas import AuthSessionOut, LoginIn, RegisterIn
from app.services.auth import (
    CreatedSession,
    enforce_allowed_origin,
    login_user,
    register_user,
    require_session,
    revoke_session,
)

router = APIRouter(prefix="/auth", tags=["authentication"])


def _set_session_cookie(response: Response, created: CreatedSession, settings: Settings) -> None:
    response.set_cookie(
        key=settings.session_cookie_name,
        value=created.token,
        max_age=created.max_age,
        path="/",
        domain=settings.cookie_domain,
        secure=settings.session_cookie_secure,
        httponly=True,
        samesite=settings.session_cookie_samesite,
    )
    response.headers["Cache-Control"] = "no-store"


def _clear_session_cookie(response: Response, settings: Settings) -> None:
    response.delete_cookie(
        key=settings.session_cookie_name,
        path="/",
        domain=settings.cookie_domain,
        secure=settings.session_cookie_secure,
        httponly=True,
        samesite=settings.session_cookie_samesite,
    )
    response.headers["Cache-Control"] = "no-store"


@router.post("/register", response_model=AuthSessionOut, status_code=status.HTTP_201_CREATED)
def register(
    payload: RegisterIn,
    request: Request,
    response: Response,
    session: Annotated[Session, Depends(get_db)],
    settings: Annotated[Settings, Depends(get_settings)],
) -> AuthSessionOut:
    enforce_allowed_origin(request, settings)
    created = register_user(session, payload, request, settings)
    _set_session_cookie(response, created, settings)
    return created.payload


@router.post("/login", response_model=AuthSessionOut)
def login(
    payload: LoginIn,
    request: Request,
    response: Response,
    session: Annotated[Session, Depends(get_db)],
    settings: Annotated[Settings, Depends(get_settings)],
) -> AuthSessionOut:
    enforce_allowed_origin(request, settings)
    revoke_session(session, request.cookies.get(settings.session_cookie_name))
    created = login_user(session, payload, request, settings)
    _set_session_cookie(response, created, settings)
    return created.payload


@router.get("/session", response_model=AuthSessionOut)
def current_session(
    request: Request,
    response: Response,
    session: Annotated[Session, Depends(get_db)],
    settings: Annotated[Settings, Depends(get_settings)],
) -> AuthSessionOut:
    response.headers["Cache-Control"] = "no-store"
    return require_session(session, request.cookies.get(settings.session_cookie_name))


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(
    request: Request,
    response: Response,
    session: Annotated[Session, Depends(get_db)],
    settings: Annotated[Settings, Depends(get_settings)],
) -> Response:
    enforce_allowed_origin(request, settings)
    revoke_session(session, request.cookies.get(settings.session_cookie_name))
    _clear_session_cookie(response, settings)
    response.status_code = status.HTTP_204_NO_CONTENT
    return response

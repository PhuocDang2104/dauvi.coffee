from typing import Annotated

from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session

from app.config import Settings, get_settings
from app.db import get_db
from app.schemas import AssistantMessageIn, AssistantResponse
from app.services.assistant import (
    answer_catalog_question,
    assistant_client_identifier,
    enforce_assistant_rate_limit,
)

router = APIRouter(prefix="/assistant", tags=["coffee-assistant"])


@router.post("/messages", response_model=AssistantResponse)
async def assistant_message(
    payload: AssistantMessageIn,
    request: Request,
    session: Annotated[Session, Depends(get_db)],
    settings: Annotated[Settings, Depends(get_settings)],
) -> AssistantResponse:
    client_identifier = assistant_client_identifier(request, settings)
    enforce_assistant_rate_limit(session, client_identifier, settings)
    return await answer_catalog_question(
        session,
        payload.message,
        settings,
    )

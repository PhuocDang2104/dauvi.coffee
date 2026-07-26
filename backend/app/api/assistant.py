from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db import get_db
from app.schemas import AssistantMessageIn, AssistantResponse
from app.services.assistant import answer_catalog_question

router = APIRouter(prefix="/assistant", tags=["coffee-assistant"])


@router.post("/messages", response_model=AssistantResponse)
def assistant_message(
    payload: AssistantMessageIn,
    session: Annotated[Session, Depends(get_db)],
) -> AssistantResponse:
    return answer_catalog_question(session, payload.message)

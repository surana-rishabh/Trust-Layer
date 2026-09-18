from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.db import get_db
from app.schemas import EventLogCreate, EventLogResponse, ChainIntegrityResponse
from app.services import event_log as event_log_service

router = APIRouter(prefix="/api/events", tags=["Event Log"])

@router.post("/", response_model=EventLogResponse, status_code=201)
def create_event(event_in: EventLogCreate, db: Session = Depends(get_db)):
    """Appends an event to the append-only event log with SHA-256 hash chaining."""
    event = event_log_service.append_event(
        db=db,
        event_type=event_in.event_type,
        payload=event_in.payload,
        booking_id=event_in.booking_id,
        listing_id=event_in.listing_id,
        actor=event_in.actor
    )
    return event

@router.get("/", response_model=List[EventLogResponse])
def list_events(
    booking_id: Optional[str] = Query(None),
    listing_id: Optional[str] = Query(None),
    limit: int = Query(100, ge=1, le=500),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db)
):
    """Retrieves paginated events from the event log."""
    return event_log_service.get_events(
        db=db,
        booking_id=booking_id,
        listing_id=listing_id,
        limit=limit,
        offset=offset
    )

@router.get("/integrity", response_model=ChainIntegrityResponse)
def verify_integrity(db: Session = Depends(get_db)):
    """Verifies SHA-256 hash chain integrity across all events in the log."""
    valid, count, corrupted_id, err_msg = event_log_service.verify_chain_integrity(db)
    return ChainIntegrityResponse(
        valid=valid,
        total_events=count,
        corrupted_event_id=corrupted_id,
        error_message=err_msg
    )

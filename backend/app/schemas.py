import datetime
from pydantic import BaseModel, ConfigDict
from typing import Optional, Any, Dict

class EventLogCreate(BaseModel):
    event_type: str
    booking_id: Optional[str] = None
    listing_id: Optional[str] = None
    actor: str = "system"
    payload: Dict[str, Any]

class EventLogResponse(BaseModel):
    id: int
    event_type: str
    booking_id: Optional[str] = None
    listing_id: Optional[str] = None
    actor: str
    payload: str
    previous_hash: str
    event_hash: str
    timestamp: datetime.datetime
    batch_id: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class ChainIntegrityResponse(BaseModel):
    valid: bool
    total_events: int
    corrupted_event_id: Optional[int] = None
    error_message: Optional[str] = None

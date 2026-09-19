import json
import hashlib
import datetime
import threading
from typing import Optional, Dict, Any, List, Tuple
from sqlalchemy.orm import Session
from app.models import EventLog

GENESIS_HASH = "0" * 64
_APPEND_LOCK = threading.Lock()

def _format_timestamp(dt: datetime.datetime) -> str:
    # Always format timestamp as UTC ISO string for deterministic hashing
    return dt.strftime("%Y-%m-%dT%H:%M:%S.%f")

def compute_event_hash(
    previous_hash: str,
    event_type: str,
    booking_id: Optional[str],
    listing_id: Optional[str],
    actor: str,
    payload_str: str,
    timestamp_str: str
) -> str:
    """Computes SHA-256 hash over canonical event fields chained to previous_hash."""
    raw_content = f"{previous_hash}|{event_type}|{booking_id or ''}|{listing_id or ''}|{actor}|{payload_str}|{timestamp_str}"
    return hashlib.sha256(raw_content.encode("utf-8")).hexdigest()

def append_event(
    db: Session,
    event_type: str,
    payload: Dict[str, Any],
    booking_id: Optional[str] = None,
    listing_id: Optional[str] = None,
    actor: str = "system",
    batch_id: Optional[str] = None
) -> EventLog:
    """
    Appends a new event to the append-only event log.
    Immediately computes SHA-256 hash and chains to previous event's hash.
    Constraint 5: No updates or deletes allowed; corrections are always new rows.
    """
    with _APPEND_LOCK:
        last_event = db.query(EventLog).order_by(EventLog.id.desc()).first()
        previous_hash = last_event.event_hash if last_event else GENESIS_HASH

        now = datetime.datetime.now(datetime.timezone.utc)
        timestamp_str = _format_timestamp(now)
        payload_str = json.dumps(payload, sort_keys=True)

        event_hash = compute_event_hash(
            previous_hash=previous_hash,
            event_type=event_type,
            booking_id=booking_id,
            listing_id=listing_id,
            actor=actor,
            payload_str=payload_str,
            timestamp_str=timestamp_str
        )

        from app.services.cache import reconciliation_cache

        event_entry = EventLog(
            event_type=event_type,
            booking_id=booking_id,
            listing_id=listing_id,
            actor=actor,
            payload=payload_str,
            previous_hash=previous_hash,
            event_hash=event_hash,
            timestamp=now,
            batch_id=batch_id
        )
        db.add(event_entry)
        db.commit()
        db.refresh(event_entry)

        if booking_id:
            reconciliation_cache.invalidate(booking_id)

        return event_entry

def get_events(
    db: Session,
    booking_id: Optional[str] = None,
    listing_id: Optional[str] = None,
    limit: int = 100,
    offset: int = 0
) -> List[EventLog]:
    """Retrieves paginated events filtered by booking_id or listing_id."""
    query = db.query(EventLog)
    if booking_id:
        query = query.filter(EventLog.booking_id == booking_id)
    if listing_id:
        query = query.filter(EventLog.listing_id == listing_id)
    return query.order_by(EventLog.id.asc()).offset(offset).limit(limit).all()

def verify_chain_integrity(db: Session) -> Tuple[bool, int, Optional[int], Optional[str]]:
    """
    Walks all events in order and checks:
    1. previous_hash matches preceding event's event_hash (or GENESIS_HASH for first).
    2. Computed event_hash matches stored event_hash.
    Returns: (is_valid, total_events, corrupted_event_id, error_message)
    """
    events = db.query(EventLog).order_by(EventLog.id.asc()).all()
    if not events:
        return True, 0, None, None

    expected_previous = GENESIS_HASH
    for event in events:
        if event.previous_hash != expected_previous:
            return (
                False,
                len(events),
                event.id,
                f"Previous hash mismatch at ID {event.id}: expected {expected_previous}, got {event.previous_hash}"
            )

        computed = compute_event_hash(
            previous_hash=event.previous_hash,
            event_type=event.event_type,
            booking_id=event.booking_id,
            listing_id=event.listing_id,
            actor=event.actor,
            payload_str=event.payload,
            timestamp_str=_format_timestamp(event.timestamp)
        )
        if computed != event.event_hash:
            return (
                False,
                len(events),
                event.id,
                f"Content hash corruption at ID {event.id}: stored {event.event_hash}, recomputed {computed}"
            )

        expected_previous = event.event_hash

    return True, len(events), None, None

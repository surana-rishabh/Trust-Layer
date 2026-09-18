import json
from typing import Dict, Any, Optional, List, Tuple
from sqlalchemy.orm import Session
from app.models import EventLog, ReconciliationFlag
from app.services.event_log import get_events, append_event
from app.services.cache import reconciliation_cache

# Categorical status constants (Constraint 3: NO numeric trust score)
REC_STATUS_CLEAR = "No significant concern"
REC_STATUS_MISMATCH = "Additional verification required"

def reconcile_booking(db: Session, booking_id: str) -> Dict[str, Any]:
    """
    Scans EventLog for booking_id, cross-checks amounts across
    QUOTE_CREATED, BOOKING_CREATED, and PAYMENT_CONFIRMED.
    Uses short TTL cache per Perf Plan Section 2.6.
    """
    # 1. Check in-memory TTL cache
    cached = reconciliation_cache.get(booking_id)
    if cached:
        return cached

    # 2. Fetch all events for booking_id (eager/single query per Perf Plan 2.7)
    events = get_events(db, booking_id=booking_id)

    quote_event: Optional[EventLog] = None
    booking_event: Optional[EventLog] = None
    payment_event: Optional[EventLog] = None

    for ev in events:
        if ev.event_type == "QUOTE_CREATED":
            quote_event = ev
        elif ev.event_type == "BOOKING_CREATED":
            booking_event = ev
        elif ev.event_type == "PAYMENT_CONFIRMED":
            payment_event = ev

    # Extract amounts and hashes
    def parse_payload(ev: Optional[EventLog]) -> Tuple[Optional[int], Optional[str]]:
        if not ev:
            return None, None
        try:
            p = json.loads(ev.payload)
            return p.get("amount"), ev.event_hash
        except Exception:
            return None, ev.event_hash

    q_amt, q_hash = parse_payload(quote_event)
    b_amt, b_hash = parse_payload(booking_event)
    p_amt, p_hash = parse_payload(payment_event)

    checkpoints = [
        {"type": "QUOTE", "amount": q_amt, "event_hash": q_hash, "found": quote_event is not None},
        {"type": "BOOKING", "amount": b_amt, "event_hash": b_hash, "found": booking_event is not None},
        {"type": "PAYMENT", "amount": p_amt, "event_hash": p_hash, "found": payment_event is not None},
    ]

    # Compare amounts if checkpoints exist
    has_mismatch = False
    amounts = [amt for amt in [q_amt, b_amt, p_amt] if amt is not None]

    if len(amounts) >= 2 and len(set(amounts)) > 1:
        has_mismatch = True

    if has_mismatch:
        status_label = REC_STATUS_MISMATCH
        message = f"Transaction inconsistency detected across event sources (Quote: ₹{q_amt}, Booking: ₹{b_amt}, Payment: ₹{p_amt})"

        # Check if flag already exists in DB
        existing_flag = db.query(ReconciliationFlag).filter(
            ReconciliationFlag.booking_id == booking_id,
            ReconciliationFlag.flag_type == "PRICE_MISMATCH"
        ).first()

        if not existing_flag:
            flag_details = {
                "booking_id": booking_id,
                "quote": {"amount": q_amt, "hash": q_hash},
                "booking": {"amount": b_amt, "hash": b_hash},
                "payment": {"amount": p_amt, "hash": p_hash},
                "status_label": status_label,
                "message": message
            }
            new_flag = ReconciliationFlag(
                booking_id=booking_id,
                flag_type="PRICE_MISMATCH",
                status="OPEN",
                details=json.dumps(flag_details)
            )
            db.add(new_flag)
            db.commit()

            # Append event to event log (Constraint 5)
            append_event(
                db=db,
                event_type="RECONCILIATION_FLAGGED",
                payload=flag_details,
                booking_id=booking_id,
                actor="reconciliation_engine"
            )

        result = {
            "booking_id": booking_id,
            "status": status_label,
            "mismatch_detected": True,
            "message": message,
            "checkpoints": checkpoints,
            "events_analyzed": len(events)
        }
    else:
        status_label = REC_STATUS_CLEAR
        message = "All independent transaction checkpoints match."
        result = {
            "booking_id": booking_id,
            "status": status_label,
            "mismatch_detected": False,
            "message": message,
            "checkpoints": checkpoints,
            "events_analyzed": len(events)
        }

    # Store in TTL cache
    reconciliation_cache.set(booking_id, result)
    return result

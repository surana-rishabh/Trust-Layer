from typing import Dict, Any
from sqlalchemy.orm import Session
from app.services.event_log import append_event

# Constraint 1: Booking Service has ZERO imports or shared state from Payment Webhook module.
# Communicates exclusively by writing events to the central event log.

def create_quote(
    db: Session,
    booking_id: str,
    listing_id: str,
    amount: int,
    currency: str = "INR",
    guest_id: str = "GUEST-1"
) -> Dict[str, Any]:
    """Emits QUOTE_CREATED event to the event log."""
    payload = {
        "booking_id": booking_id,
        "listing_id": listing_id,
        "amount": amount,
        "currency": currency,
        "guest_id": guest_id,
        "status": "QUOTE_ISSUED"
    }
    event = append_event(
        db=db,
        event_type="QUOTE_CREATED",
        payload=payload,
        booking_id=booking_id,
        listing_id=listing_id,
        actor="booking_service"
    )
    return {"status": "QUOTE_CREATED", "event_hash": event.event_hash, "payload": payload}

def create_booking(
    db: Session,
    booking_id: str,
    listing_id: str,
    amount: int,
    currency: str = "INR",
    guest_id: str = "GUEST-1"
) -> Dict[str, Any]:
    """Emits BOOKING_CREATED event to the event log."""
    payload = {
        "booking_id": booking_id,
        "listing_id": listing_id,
        "amount": amount,
        "currency": currency,
        "guest_id": guest_id,
        "status": "CONFIRMED_BY_GUEST"
    }
    event = append_event(
        db=db,
        event_type="BOOKING_CREATED",
        payload=payload,
        booking_id=booking_id,
        listing_id=listing_id,
        actor="booking_service"
    )
    return {"status": "BOOKING_CREATED", "event_hash": event.event_hash, "payload": payload}

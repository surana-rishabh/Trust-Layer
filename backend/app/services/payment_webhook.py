from typing import Dict, Any
from sqlalchemy.orm import Session
from app.services.event_log import append_event

# Constraint 1: Payment Webhook Service has ZERO imports or shared state from Booking Service module.
# Communicates exclusively by writing events to the central event log.

def process_payment_webhook(
    db: Session,
    booking_id: str,
    listing_id: str,
    amount_paid: int,
    gateway_txn_id: str,
    currency: str = "INR"
) -> Dict[str, Any]:
    """Emits PAYMENT_CONFIRMED event to the event log independently."""
    payload = {
        "booking_id": booking_id,
        "listing_id": listing_id,
        "amount": amount_paid,
        "currency": currency,
        "gateway_txn_id": gateway_txn_id,
        "status": "PAYMENT_SUCCESS"
    }
    event = append_event(
        db=db,
        event_type="PAYMENT_CONFIRMED",
        payload=payload,
        booking_id=booking_id,
        listing_id=listing_id,
        actor="payment_gateway_webhook"
    )
    return {"status": "PAYMENT_CONFIRMED", "event_hash": event.event_hash, "payload": payload}

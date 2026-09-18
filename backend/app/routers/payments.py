from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.db import get_db
from app.services import payment_webhook

router = APIRouter(prefix="/api/payments", tags=["Payment Webhook Service"])

class PaymentWebhookRequest(BaseModel):
    booking_id: str
    listing_id: str
    amount_paid: int
    gateway_txn_id: str

@router.post("/webhook")
def receive_payment_webhook(req: PaymentWebhookRequest, db: Session = Depends(get_db)):
    """Simulated payment gateway webhook endpoint."""
    return payment_webhook.process_payment_webhook(
        db=db,
        booking_id=req.booking_id,
        listing_id=req.listing_id,
        amount_paid=req.amount_paid,
        gateway_txn_id=req.gateway_txn_id
    )

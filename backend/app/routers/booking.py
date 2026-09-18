from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.db import get_db
from app.services import booking_service

router = APIRouter(prefix="/api/bookings", tags=["Booking Service"])

class QuoteRequest(BaseModel):
    booking_id: str
    listing_id: str
    amount: int
    guest_id: str = "GUEST-1"

class BookingRequest(BaseModel):
    booking_id: str
    listing_id: str
    amount: int
    guest_id: str = "GUEST-1"

@router.post("/quote")
def request_quote(req: QuoteRequest, db: Session = Depends(get_db)):
    """Booking Service endpoint to issue quote event."""
    return booking_service.create_quote(
        db=db,
        booking_id=req.booking_id,
        listing_id=req.listing_id,
        amount=req.amount,
        guest_id=req.guest_id
    )

@router.post("/create")
def confirm_booking(req: BookingRequest, db: Session = Depends(get_db)):
    """Booking Service endpoint to create booking event."""
    return booking_service.create_booking(
        db=db,
        booking_id=req.booking_id,
        listing_id=req.listing_id,
        amount=req.amount,
        guest_id=req.guest_id
    )

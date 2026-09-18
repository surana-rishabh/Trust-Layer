import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any

from app.db import get_db
from app.models import ReconciliationFlag, MediaAsset
from app.services import reconciliation_engine, event_log

router = APIRouter(prefix="/api/trustlayer", tags=["TrustLayer Status & Verification"])

@router.get("/reconciliation/{booking_id}")
def get_reconciliation_status(booking_id: str, db: Session = Depends(get_db)):
    """Runs Reconciliation Engine to compare independent event amounts."""
    return reconciliation_engine.reconcile_booking(db, booking_id)

@router.get("/history/{booking_id}")
def get_booking_history(booking_id: str, db: Session = Depends(get_db)):
    """Retrieves full append-only event history for a booking."""
    events = event_log.get_events(db, booking_id=booking_id)
    return events

@router.get("/evidence/{listing_id}")
def get_evidence_status(listing_id: str, db: Session = Depends(get_db)):
    """Retrieves overall media evidence status for a listing."""
    flags = db.query(ReconciliationFlag).filter(
        ReconciliationFlag.booking_id == f"LISTING-{listing_id}",
        ReconciliationFlag.status == "OPEN"
    ).all()

    assets = db.query(MediaAsset).filter(MediaAsset.listing_id == listing_id).all()

    if flags:
        details = json.loads(flags[0].details)
        return {
            "listing_id": listing_id,
            "status": "Additional verification required",
            "flagged": True,
            "message": details.get("message", "Similar media detected"),
            "assets_count": len(assets)
        }
    return {
        "listing_id": listing_id,
        "status": "No significant concern",
        "flagged": False,
        "message": "Media verified unique across database.",
        "assets_count": len(assets)
    }

@router.get("/flags")
def list_open_flags(db: Session = Depends(get_db)):
    """Lists all open flags for the reviewer page."""
    flags = db.query(ReconciliationFlag).filter(ReconciliationFlag.status == "OPEN").all()
    results = []
    for f in flags:
        results.append({
            "id": f.id,
            "booking_id": f.booking_id,
            "flag_type": f.flag_type,
            "status": f.status,
            "details": json.loads(f.details),
            "created_at": f.created_at
        })
    return results

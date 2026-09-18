from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional

from app.db import get_db
from app.models import Dispute, ReconciliationFlag
from app.services import dispute_service

router = APIRouter(prefix="/api/disputes", tags=["Dispute & Correction Flow"])

class EvidenceSubmissionRequest(BaseModel):
    host_evidence: str
    host_id: str = "HOST-1"

class ResolutionRequest(BaseModel):
    reviewer_decision: str  # e.g., "RESOLVED_AUTHORIZED_MANAGER"
    reviewer_notes: str = ""
    reviewer_id: str = "REVIEWER-1"

@router.post("/{flag_id}/evidence")
def submit_evidence(
    flag_id: int,
    req: EvidenceSubmissionRequest,
    db: Session = Depends(get_db)
):
    """Host submits evidence for a flagged item (Story A)."""
    try:
        return dispute_service.submit_host_evidence(
            db=db,
            flag_id=flag_id,
            host_evidence=req.host_evidence,
            host_id=req.host_id
        )
    except ValueError as err:
        raise HTTPException(status_code=404, detail=str(err))

@router.post("/{flag_id}/resolve")
def resolve_flag(
    flag_id: int,
    req: ResolutionRequest,
    db: Session = Depends(get_db)
):
    """Reviewer resolves a dispute (Story A)."""
    try:
        return dispute_service.resolve_dispute(
            db=db,
            flag_id=flag_id,
            reviewer_decision=req.reviewer_decision,
            reviewer_notes=req.reviewer_notes,
            reviewer_id=req.reviewer_id
        )
    except ValueError as err:
        raise HTTPException(status_code=404, detail=str(err))

@router.get("/{flag_id}")
def get_dispute_details(flag_id: int, db: Session = Depends(get_db)):
    """Retrieves dispute details for a flag."""
    flag = db.query(ReconciliationFlag).filter(ReconciliationFlag.id == flag_id).first()
    if not flag:
        raise HTTPException(status_code=404, detail="Flag not found")

    dispute = db.query(Dispute).filter(Dispute.flag_id == flag_id).first()
    return {
        "flag": {
            "id": flag.id,
            "booking_id": flag.booking_id,
            "flag_type": flag.flag_type,
            "status": flag.status,
            "created_at": flag.created_at
        },
        "dispute": dispute
    }

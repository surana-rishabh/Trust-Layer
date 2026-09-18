import json
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models import ReconciliationFlag, Dispute
from app.services.event_log import append_event

def submit_host_evidence(
    db: Session,
    flag_id: int,
    host_evidence: str,
    host_id: str = "HOST-1"
) -> Dict[str, Any]:
    """
    Host submits evidence for a flagged dispute.
    Appends DISPUTE_EVIDENCE_SUBMITTED event to append-only EventLog (Constraint 5).
    Original flag record is NEVER deleted or modified.
    """
    flag = db.query(ReconciliationFlag).filter(ReconciliationFlag.id == flag_id).first()
    if not flag:
        raise ValueError(f"Flag ID {flag_id} not found.")

    dispute = db.query(Dispute).filter(Dispute.flag_id == flag_id).first()
    if not dispute:
        dispute = Dispute(
            flag_id=flag_id,
            booking_id=flag.booking_id,
            host_evidence=host_evidence,
            status="EVIDENCE_SUBMITTED"
        )
        db.add(dispute)
    else:
        dispute.host_evidence = host_evidence
        dispute.status = "EVIDENCE_SUBMITTED"
    db.commit()
    db.refresh(dispute)

    listing_id = flag.booking_id.replace("LISTING-", "") if flag.booking_id.startswith("LISTING-") else None

    # Log event to append-only event log (Constraint 5)
    append_event(
        db=db,
        event_type="DISPUTE_EVIDENCE_SUBMITTED",
        payload={
            "dispute_id": dispute.id,
            "flag_id": flag_id,
            "booking_id": flag.booking_id,
            "host_id": host_id,
            "evidence_text": host_evidence
        },
        booking_id=flag.booking_id,
        listing_id=listing_id,
        actor="host"
    )

    return {
        "dispute_id": dispute.id,
        "flag_id": flag_id,
        "status": dispute.status,
        "host_evidence": host_evidence
    }

def resolve_dispute(
    db: Session,
    flag_id: int,
    reviewer_decision: str,
    reviewer_notes: str = "",
    reviewer_id: str = "REVIEWER-1"
) -> Dict[str, Any]:
    """
    Reviewer resolves a dispute.
    Appends DISPUTE_RESOLVED event to append-only EventLog (Constraint 5).
    Updates flag status to RESOLVED. Original history is strictly preserved.
    """
    flag = db.query(ReconciliationFlag).filter(ReconciliationFlag.id == flag_id).first()
    if not flag:
        raise ValueError(f"Flag ID {flag_id} not found.")

    flag.status = "RESOLVED"

    dispute = db.query(Dispute).filter(Dispute.flag_id == flag_id).first()
    if not dispute:
        dispute = Dispute(
            flag_id=flag_id,
            booking_id=flag.booking_id,
            reviewer_decision=reviewer_decision,
            status="RESOLVED"
        )
        db.add(dispute)
    else:
        dispute.reviewer_decision = reviewer_decision
        dispute.status = "RESOLVED"

    db.commit()
    db.refresh(dispute)

    listing_id = flag.booking_id.replace("LISTING-", "") if flag.booking_id.startswith("LISTING-") else None

    # Log event to append-only event log (Constraint 5)
    append_event(
        db=db,
        event_type="DISPUTE_RESOLVED",
        payload={
            "dispute_id": dispute.id,
            "flag_id": flag_id,
            "booking_id": flag.booking_id,
            "reviewer_id": reviewer_id,
            "decision": reviewer_decision,
            "notes": reviewer_notes
        },
        booking_id=flag.booking_id,
        listing_id=listing_id,
        actor="reviewer"
    )

    return {
        "dispute_id": dispute.id,
        "flag_id": flag_id,
        "status": dispute.status,
        "reviewer_decision": reviewer_decision
    }

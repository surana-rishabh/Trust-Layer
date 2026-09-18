from fastapi import APIRouter, Depends, BackgroundTasks, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any

from app.db import get_db, SessionLocal
from app.models import EventLog
from app.services import anchoring_job

router = APIRouter(prefix="/api/anchoring", tags=["Blockchain Anchoring Job"])

def _background_anchoring_task():
    db = SessionLocal()
    try:
        anchoring_job.run_anchoring_job(db)
    finally:
        db.close()

@router.post("/trigger")
def trigger_anchoring_job(
    background_tasks: BackgroundTasks,
    sync: bool = False,
    db: Session = Depends(get_db)
):
    """
    Triggers batch anchoring job.
    Runs asynchronously via FastAPI BackgroundTasks (Perf Plan Section 2.9).
    Pass sync=true in dev/testing to execute synchronously.
    """
    if sync:
        result = anchoring_job.run_anchoring_job(db)
        return {"status": "completed", "result": result}
    
    background_tasks.add_task(_background_anchoring_task)
    return {"status": "scheduled", "message": "Anchoring job scheduled in background."}

@router.get("/batches")
def get_anchored_batches(db: Session = Depends(get_db)):
    """Retrieves all BATCH_ANCHORED events from event log."""
    anchor_events = db.query(EventLog).filter(EventLog.event_type == "BATCH_ANCHORED").order_by(EventLog.id.desc()).all()
    results = []
    for ev in anchor_events:
        results.append({
            "event_id": ev.id,
            "timestamp": ev.timestamp,
            "event_hash": ev.event_hash,
            "payload": ev.payload
        })
    return results

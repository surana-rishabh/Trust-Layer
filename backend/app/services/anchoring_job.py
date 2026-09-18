import uuid
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from app.models import EventLog
from app.blockchain import amoy_client
from app.services.event_log import append_event

def run_anchoring_job(db: Session) -> Dict[str, Any]:
    """
    Batches unanchored events, computes root hash, and submits to Polygon Amoy testnet.
    Executed via FastAPI BackgroundTasks (Perf Plan Section 2.9).
    Constraint 2: Anchors batch root hash, NEVER individual events.
    """
    # 1. Fetch unanchored events
    unanchored = db.query(EventLog).filter(EventLog.batch_id.is_(None)).order_by(EventLog.id.asc()).all()

    if not unanchored:
        return {
            "anchored": False,
            "message": "No unanchored events found.",
            "events_count": 0
        }

    batch_id = f"BATCH-{uuid.uuid4().hex[:8].upper()}"
    event_hashes = [ev.event_hash for ev in unanchored]
    event_ids = [ev.id for ev in unanchored]

    # 2. Compute batch Merkle/root hash
    root_hash = amoy_client.compute_batch_root_hash(event_hashes)

    # 3. Submit root hash to Polygon Amoy testnet
    tx_result = amoy_client.submit_root_hash_to_amoy(root_hash)

    # 4. Mark events with batch_id
    for ev in unanchored:
        ev.batch_id = batch_id
    db.commit()

    # 5. Log BATCH_ANCHORED event to append-only log (Constraint 5)
    anchor_event = append_event(
        db=db,
        event_type="BATCH_ANCHORED",
        payload={
            "batch_id": batch_id,
            "root_hash": root_hash,
            "events_count": len(unanchored),
            "event_ids": event_ids,
            "tx_hash": tx_result["tx_hash"],
            "explorer_url": tx_result["explorer_url"],
            "network": tx_result["network"]
        },
        actor="anchoring_job",
        batch_id=batch_id
    )

    return {
        "anchored": True,
        "batch_id": batch_id,
        "root_hash": root_hash,
        "events_count": len(unanchored),
        "tx_hash": tx_result["tx_hash"],
        "explorer_url": tx_result["explorer_url"],
        "network": tx_result["network"],
        "anchor_event_hash": anchor_event.event_hash
    }

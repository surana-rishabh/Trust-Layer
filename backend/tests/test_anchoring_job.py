import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.db import Base
from app.models import EventLog
from app.services.event_log import append_event, verify_chain_integrity
from app.services.anchoring_job import run_anchoring_job

@pytest.fixture
def db_session():
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    session = Session()
    try:
        yield session
    finally:
        session.close()

def test_batch_anchoring_job(db_session):
    # 1. Create 5 events in log
    for i in range(5):
        append_event(db_session, f"TEST_EVENT_{i}", {"val": i}, booking_id="BK-BATCH-01")

    # Verify initially unanchored
    unanchored_count = db_session.query(EventLog).filter(EventLog.batch_id.is_(None)).count()
    assert unanchored_count == 5

    # 2. Run batch anchoring job
    result = run_anchoring_job(db_session)
    assert result["anchored"] is True
    assert result["events_count"] == 5
    assert len(result["root_hash"]) == 64
    assert result["tx_hash"].startswith("0x")
    assert "amoy.polygonscan.com" in result["explorer_url"]

    # 3. Verify original events now have batch_id assigned
    batch_id = result["batch_id"]
    payload_events = db_session.query(EventLog).filter(EventLog.batch_id == batch_id, EventLog.event_type != "BATCH_ANCHORED").all()
    assert len(payload_events) == 5

    # Total events in batch (5 payload events + 1 BATCH_ANCHORED event) = 6
    all_batch_events = db_session.query(EventLog).filter(EventLog.batch_id == batch_id).all()
    assert len(all_batch_events) == 6

    # 4. Verify BATCH_ANCHORED event was appended to hash chain
    anchor_event = db_session.query(EventLog).filter(EventLog.event_type == "BATCH_ANCHORED").first()
    assert anchor_event is not None
    assert anchor_event.batch_id == batch_id

    # 5. Chain integrity remains valid
    valid, count, corrupted_id, err = verify_chain_integrity(db_session)
    assert valid is True
    assert count == 6  # 5 test events + 1 BATCH_ANCHORED event

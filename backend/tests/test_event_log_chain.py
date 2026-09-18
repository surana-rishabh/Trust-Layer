import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.db import Base
from app.models import EventLog
from app.services.event_log import append_event, verify_chain_integrity, GENESIS_HASH

# Setup in-memory SQLite for testing
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

def test_append_event_and_chaining(db_session):
    # 1. Append first event
    e1 = append_event(
        db=db_session,
        event_type="QUOTE_CREATED",
        payload={"amount": 10000, "currency": "INR"},
        booking_id="BK-001",
        listing_id="WY-101",
        actor="guest"
    )
    assert e1.previous_hash == GENESIS_HASH
    assert len(e1.event_hash) == 64

    # 2. Append second event
    e2 = append_event(
        db=db_session,
        event_type="BOOKING_CREATED",
        payload={"amount": 10000, "currency": "INR"},
        booking_id="BK-001",
        listing_id="WY-101",
        actor="guest"
    )
    assert e2.previous_hash == e1.event_hash
    assert e2.event_hash != e1.event_hash

    # 3. Append third event
    e3 = append_event(
        db=db_session,
        event_type="PAYMENT_CONFIRMED",
        payload={"amount": 10000, "currency": "INR"},
        booking_id="BK-001",
        listing_id="WY-101",
        actor="payment_gateway"
    )
    assert e3.previous_hash == e2.event_hash

    # 4. Verify chain integrity
    valid, count, corrupted_id, err_msg = verify_chain_integrity(db_session)
    assert valid is True
    assert count == 3
    assert corrupted_id is None
    assert err_msg is None

def test_tamper_event_detection(db_session):
    e1 = append_event(db_session, "EVENT_A", {"val": 1}, booking_id="BK-002")
    e2 = append_event(db_session, "EVENT_B", {"val": 2}, booking_id="BK-002")
    e3 = append_event(db_session, "EVENT_C", {"val": 3}, booking_id="BK-002")

    # Manually tamper with e2's payload in database directly
    e2.payload = '{"val": 999}'  # Tampered!
    db_session.commit()

    # Verify integrity detects the corruption
    valid, count, corrupted_id, err_msg = verify_chain_integrity(db_session)
    assert valid is False
    assert corrupted_id == e2.id
    assert "corruption" in err_msg.lower() or "mismatch" in err_msg.lower()

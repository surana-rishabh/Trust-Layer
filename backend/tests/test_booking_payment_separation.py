import sys
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.db import Base
from app.services import booking_service, payment_webhook
from app.services.event_log import get_events, verify_chain_integrity

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

def test_module_separation_constraint():
    """Verify via module introspection that Booking Service and Payment Webhook have no shared imports."""
    booking_vars = dir(booking_service)
    payment_vars = dir(payment_webhook)

    assert "payment_webhook" not in booking_vars
    assert "process_payment_webhook" not in booking_vars
    assert "booking_service" not in payment_vars
    assert "create_booking" not in payment_vars

def test_independent_event_creation(db_session):
    booking_id = "BK-STORYB-001"
    listing_id = "WY-0921"

    # 1. Booking Service creates quote
    q_res = booking_service.create_quote(db_session, booking_id, listing_id, amount=10000)
    assert q_res["status"] == "QUOTE_CREATED"

    # 2. Booking Service confirms booking
    b_res = booking_service.create_booking(db_session, booking_id, listing_id, amount=10000)
    assert b_res["status"] == "BOOKING_CREATED"

    # 3. Payment Webhook independently receives payment webhook with mismatched amount (₹12,000)
    p_res = payment_webhook.process_payment_webhook(db_session, booking_id, listing_id, amount_paid=12000, gateway_txn_id="TXN-998877")
    assert p_res["status"] == "PAYMENT_CONFIRMED"

    # 4. Verify event log has 3 events for this booking_id, correctly chained
    events = get_events(db_session, booking_id=booking_id)
    assert len(events) == 3
    assert events[0].event_type == "QUOTE_CREATED"
    assert events[1].event_type == "BOOKING_CREATED"
    assert events[2].event_type == "PAYMENT_CONFIRMED"

    # Chain integrity verification
    valid, count, corrupted_id, err = verify_chain_integrity(db_session)
    assert valid is True
    assert count == 3

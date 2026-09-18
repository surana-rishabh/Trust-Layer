import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.db import Base
from app.services import booking_service, payment_webhook
from app.services.reconciliation_engine import (
    reconcile_booking,
    REC_STATUS_CLEAR,
    REC_STATUS_MISMATCH
)
from app.models import ReconciliationFlag

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

def test_reconciliation_consistent(db_session):
    b_id = "BK-MATCH-001"
    l_id = "WY-0921"

    booking_service.create_quote(db_session, b_id, l_id, 10000)
    booking_service.create_booking(db_session, b_id, l_id, 10000)
    payment_webhook.process_payment_webhook(db_session, b_id, l_id, 10000, "TXN-1001")

    res = reconcile_booking(db_session, b_id)
    assert res["status"] == REC_STATUS_CLEAR
    assert res["mismatch_detected"] is False

    flags = db_session.query(ReconciliationFlag).filter(ReconciliationFlag.booking_id == b_id).all()
    assert len(flags) == 0

def test_reconciliation_mismatched(db_session):
    b_id = "BK-MISMATCH-001"
    l_id = "WY-0921"

    # Story B setup: Quote 10000, Booking 10000, Payment 12000
    booking_service.create_quote(db_session, b_id, l_id, 10000)
    booking_service.create_booking(db_session, b_id, l_id, 10000)
    payment_webhook.process_payment_webhook(db_session, b_id, l_id, 12000, "TXN-1002")

    res = reconcile_booking(db_session, b_id)
    assert res["status"] == REC_STATUS_MISMATCH
    assert res["mismatch_detected"] is True
    assert "Transaction inconsistency detected" in res["message"]

    flags = db_session.query(ReconciliationFlag).filter(ReconciliationFlag.booking_id == b_id).all()
    assert len(flags) == 1
    assert flags[0].flag_type == "PRICE_MISMATCH"
    assert flags[0].status == "OPEN"

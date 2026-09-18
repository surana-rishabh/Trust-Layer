import io
import pytest
from PIL import Image, ImageDraw
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.db import Base
from app.models import Listing, ReconciliationFlag, Dispute
from app.services.evidence_engine import check_media_similarity, STATUS_FLAGGED
from app.services.dispute_service import submit_host_evidence, resolve_dispute
from app.services.event_log import get_events, verify_chain_integrity

def generate_test_image(pattern_id=1):
    img = Image.new("RGB", (400, 300), color=(255, 255, 255))
    d = ImageDraw.Draw(img)
    if pattern_id == 1:
        for i in range(0, 400, 20):
            d.line([(i, 0), (i + 50, 300)], fill=(255, 0, 0), width=10)
    else:
        for i in range(20, 380, 40):
            d.ellipse([i, 50, i + 30, 120], fill=(0, 0, 255))
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    return buf.getvalue()

@pytest.fixture
def db_session():
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    session = Session()

    l1 = Listing(id="WY-0921", title="Villa 1", price_per_night=10000, host_id="HOST-1")
    l2 = Listing(id="WY-1044", title="Villa 2", price_per_night=10000, host_id="HOST-2")
    session.add_all([l1, l2])
    session.commit()

    try:
        yield session
    finally:
        session.close()

def test_story_a_full_dispute_flow(db_session):
    img_bytes = generate_test_image(pattern_id=1)

    # Step 1: Upload original photo to Listing 0921
    check_media_similarity(db_session, "WY-0921", img_bytes, "villa1.jpg")

    # Step 2: Upload duplicate photo to Listing 1044 -> triggers SIMILAR_MEDIA flag
    res, asset = check_media_similarity(db_session, "WY-1044", img_bytes, "villa2.jpg")
    assert res["status"] == STATUS_FLAGGED

    flag = db_session.query(ReconciliationFlag).filter(ReconciliationFlag.booking_id == "LISTING-WY-1044").first()
    assert flag is not None
    assert flag.status == "OPEN"

    # Step 3: Host submits evidence ("I am the authorized property manager for both listings")
    ev_res = submit_host_evidence(
        db=db_session,
        flag_id=flag.id,
        host_evidence="I am the authorized property manager for both properties.",
        host_id="HOST-2"
    )
    assert ev_res["status"] == "EVIDENCE_SUBMITTED"

    # Step 4: Reviewer resolves dispute
    res_res = resolve_dispute(
        db=db_session,
        flag_id=flag.id,
        reviewer_decision="RESOLVED_AUTHORIZED_MANAGER",
        reviewer_notes="Verified authorization docs.",
        reviewer_id="REVIEWER-1"
    )
    assert res_res["status"] == "RESOLVED"

    # Step 5: Verify event history contains all steps in append-only log without deletions
    events = get_events(db_session, listing_id="WY-1044")
    event_types = [ev.event_type for ev in events]

    assert "MEDIA_SIMILARITY_FLAGGED" in event_types
    assert "DISPUTE_EVIDENCE_SUBMITTED" in event_types
    assert "DISPUTE_RESOLVED" in event_types

    # Hash chain integrity verification
    valid, count, corrupted_id, err = verify_chain_integrity(db_session)
    assert valid is True

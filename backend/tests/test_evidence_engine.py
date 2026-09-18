import io
import pytest
from PIL import Image, ImageDraw
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.db import Base
from app.models import Listing
from app.services.evidence_engine import check_media_similarity, STATUS_CLEAR, STATUS_FLAGGED

@pytest.fixture
def db_session():
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    session = Session()

    # Seed sample listings
    l1 = Listing(id="WY-0921", title="Original Villa", price_per_night=10000, host_id="HOST-1")
    l2 = Listing(id="WY-1044", title="New Villa Listing", price_per_night=10000, host_id="HOST-2")
    session.add_all([l1, l2])
    session.commit()

    try:
        yield session
    finally:
        session.close()

def generate_test_image(pattern_id=1):
    img = Image.new("RGB", (400, 300), color=(255, 255, 255))
    d = ImageDraw.Draw(img)
    if pattern_id == 1:
        # Draw red diagonal stripes
        for i in range(0, 400, 20):
            d.line([(i, 0), (i + 50, 300)], fill=(255, 0, 0), width=10)
    elif pattern_id == 2:
        # Draw blue circles
        for i in range(20, 380, 40):
            d.ellipse([i, 50, i + 30, 120], fill=(0, 0, 255))
    else:
        # Draw yellow rectangles
        for i in range(10, 390, 50):
            d.rectangle([i, 100, i + 40, 250], fill=(255, 255, 0))
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    return buf.getvalue()

def test_evidence_engine_unique_and_duplicate(db_session):
    img_bytes1 = generate_test_image(pattern_id=1)

    # 1. Upload original photo for Listing WY-0921
    res1, asset1 = check_media_similarity(
        db=db_session,
        listing_id="WY-0921",
        image_bytes=img_bytes1,
        filename="villa1.jpg"
    )
    assert res1["status"] == STATUS_CLEAR
    assert res1["flagged"] is False

    # 2. Upload duplicate photo for Listing WY-1044 (Host 2 trying to reuse Host 1's photo)
    res2, asset2 = check_media_similarity(
        db=db_session,
        listing_id="WY-1044",
        image_bytes=img_bytes1,  # Same image!
        filename="villa2.jpg"
    )
    assert res2["status"] == STATUS_FLAGGED
    assert res2["flagged"] is True
    assert res2["matched_listing_id"] == "WY-0921"
    assert "Similar media detected" in res2["message"]

    # 3. Upload a completely unique photo (different pattern) for Listing WY-1044
    img_bytes3 = generate_test_image(pattern_id=2)
    res3, asset3 = check_media_similarity(
        db=db_session,
        listing_id="WY-1044",
        image_bytes=img_bytes3,
        filename="garden.jpg"
    )
    assert res3["status"] == STATUS_CLEAR
    assert res3["flagged"] is False

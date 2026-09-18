import os
import io
import sys
from PIL import Image, ImageDraw

# Add app parent directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.db import SessionLocal, engine, Base
from app.models import Listing, MediaAsset
from app.services.evidence_engine import check_media_similarity

def generate_sample_image_bytes(pattern_id=1):
    img = Image.new("RGB", (600, 450), color=(240, 240, 245))
    d = ImageDraw.Draw(img)
    if pattern_id == 1:
        # Luxury Villa Photo 1
        d.rectangle([50, 50, 550, 350], fill=(200, 160, 120))
        d.text((80, 80), "Grand Villa Goa - Pool View", fill=(255, 255, 255))
        for i in range(100, 500, 40):
            d.line([(i, 200), (i + 30, 350)], fill=(0, 120, 200), width=6)
    else:
        # Unique Beach House Photo 2
        d.rectangle([50, 50, 550, 350], fill=(120, 200, 160))
        d.text((80, 80), "Green Haven Garden", fill=(255, 255, 255))
        for i in range(80, 500, 60):
            d.ellipse([i, 150, i + 40, 250], fill=(255, 220, 100))

    buf = io.BytesIO()
    img.save(buf, format="JPEG", quality=85)
    return buf.getvalue()

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Clear existing listings
        db.query(Listing).delete()
        db.commit()

        # Seed sample listings
        l1 = Listing(
            id="WY-0921",
            title="Grand Villa Goa with Private Pool",
            description="Luxury 4-bedroom villa with private infinity pool and ocean sunset views.",
            price_per_night=10000,
            host_id="HOST-0921"
        )
        l2 = Listing(
            id="WY-1044",
            title="Sunset Beachfront Villa Anjuna",
            description="Charming beachfront stay with garden access and modern amenities.",
            price_per_night=10000,
            host_id="HOST-1044"
        )
        db.add_all([l1, l2])
        db.commit()

        # Upload initial photo for WY-0921
        img1 = generate_sample_image_bytes(pattern_id=1)
        check_media_similarity(db, "WY-0921", img1, "villa_goa_pool.jpg")

        print("Database successfully seeded with listings WY-0921 and WY-1044!")
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()

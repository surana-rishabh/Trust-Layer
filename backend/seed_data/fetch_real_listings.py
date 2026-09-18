import os
import io
import sys
import json
import urllib.request
from PIL import Image

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.db import SessionLocal, engine, Base
from app.models import Listing, MediaAsset
from app.services.evidence_engine import check_media_similarity

# High quality property & resort image sources for Wayzyy, OYO, and MakeMyTrip
REAL_PROPERTIES = [
    # --- WAYZYY GOA VILLAS ---
    {
        "id": "WY-0921",
        "title": "Wayzyy #WY-0921: Grand Goan Luxury Pool Villa - Siolim",
        "description": "Exclusive Wayzyy Goa villa with private infinity pool, sunset deck, and 0% booking commission.",
        "price_per_night": 10000,
        "host_id": "WAYZYY-HOST-0921",
        "platform": "Wayzyy",
        "img_url": "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=85"
    },
    {
        "id": "WY-1044",
        "title": "Wayzyy #WY-1044: Sunset Heritage Villa - Anjuna Beach",
        "description": "Authentic Portuguese-style Goan beach house with private garden access and local support.",
        "price_per_night": 10000,
        "host_id": "WAYZYY-HOST-1044",
        "platform": "Wayzyy",
        "img_url": "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=85"
    },
    # --- OYO ROOMS ---
    {
        "id": "OYO-4012",
        "title": "OYO #4012: OYO Flagship Premium Suite - Calangute",
        "description": "Sanitized OYO Rooms budget suite with high-speed WiFi, AC, and 24/7 check-in.",
        "price_per_night": 2500,
        "host_id": "OYO-MANAGER-4012",
        "platform": "OYO Rooms",
        "img_url": "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=85"
    },
    {
        "id": "OYO-8921",
        "title": "OYO #8921: OYO Townhouse Executive Stay - Panaji",
        "description": "Premium OYO Townhouse stay for business travelers and digital nomads near Panaji market.",
        "price_per_night": 3200,
        "host_id": "OYO-MANAGER-8921",
        "platform": "OYO Rooms",
        "img_url": "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=85"
    },
    # --- MAKEMYTRIP LUXURY RESORTS ---
    {
        "id": "MMT-7701",
        "title": "MakeMyTrip #MMT-7701: MMT Select Luxury Resort & Spa - Baga",
        "description": "5-star luxury oceanfront resort with spa treatments, private balcony, and beach access.",
        "price_per_night": 18000,
        "host_id": "MMT-RESORT-7701",
        "platform": "MakeMyTrip",
        "img_url": "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=85"
    },
    {
        "id": "MMT-9920",
        "title": "MakeMyTrip #MMT-9920: Taj Exotica Resort & Spa - South Goa",
        "description": "Mediterranean-style luxury beachfront sanctuary spread across 56 acres of lush gardens.",
        "price_per_night": 25000,
        "host_id": "MMT-RESORT-9920",
        "platform": "MakeMyTrip",
        "img_url": "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=85"
    }
]

def download_image(url: str) -> bytes:
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
    )
    with urllib.request.urlopen(req) as resp:
        return resp.read()

def seed_real_listings():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        print("Seeding authentic Wayzyy, OYO Rooms, and MakeMyTrip listings...")
        db.query(Listing).delete()
        db.commit()

        for item in REAL_PROPERTIES:
            listing = Listing(
                id=item["id"],
                title=item["title"],
                description=item["description"],
                price_per_night=item["price_per_night"],
                host_id=item["host_id"]
            )
            db.add(listing)
            db.commit()

            try:
                print(f"Downloading authentic image for {item['id']} ({item['platform']})...")
                img_bytes = download_image(item["img_url"])
                check_media_similarity(db, item["id"], img_bytes, f"{item['id'].lower()}_main.jpg")
            except Exception as e:
                print(f"Failed to fetch image for {item['id']}: {e}")

        print("Successfully seeded Wayzyy, OYO Rooms, and MakeMyTrip real properties!")
    finally:
        db.close()

if __name__ == "__main__":
    seed_real_listings()

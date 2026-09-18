from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db import get_db
from app.models import Listing
from app.services.cache import listing_cache

router = APIRouter(prefix="/api/listings", tags=["Listings"])

@router.get("/")
def list_listings(db: Session = Depends(get_db)):
    """Retrieves all demo listings (Perf Plan 2.1 in-memory TTL cached)."""
    cached = listing_cache.get("all_listings")
    if cached:
        return cached

    listings = db.query(Listing).all()
    results = [
        {
            "id": l.id,
            "title": l.title,
            "description": l.description,
            "price_per_night": l.price_per_night,
            "host_id": l.host_id,
            "created_at": l.created_at
        }
        for l in listings
    ]
    listing_cache.set("all_listings", results, ttl=10)
    return results

@router.get("/{listing_id}")
def get_listing(listing_id: str, db: Session = Depends(get_db)):
    """Retrieves single listing by ID."""
    cached = listing_cache.get(f"listing_{listing_id}")
    if cached:
        return cached

    listing = db.query(Listing).filter(Listing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")

    result = {
        "id": listing.id,
        "title": listing.title,
        "description": listing.description,
        "price_per_night": listing.price_per_night,
        "host_id": listing.host_id,
        "created_at": listing.created_at
    }
    listing_cache.set(f"listing_{listing_id}", result, ttl=10)
    return result

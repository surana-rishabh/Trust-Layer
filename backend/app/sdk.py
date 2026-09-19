"""
TrustLayer Python SDK
Drop-in client library for Wayzyy and external short-stay marketplaces.
"""

import httpx
from typing import Dict, Any, Optional

class TrustLayerClient:
    def __init__(self, endpoint_url: str = "http://localhost:8000"):
        self.endpoint_url = endpoint_url.rstrip("/")

    def emit_event(
        self,
        event_type: str,
        payload: Dict[str, Any],
        booking_id: Optional[str] = None,
        listing_id: Optional[str] = None,
        actor: str = "system"
    ) -> Dict[str, Any]:
        """Emits an event to the append-only SHA-256 hash chained event log."""
        with httpx.Client(base_url=self.endpoint_url, timeout=10.0) as client:
            resp = client.post("/api/events/", json={
                "event_type": event_type,
                "payload": payload,
                "booking_id": booking_id,
                "listing_id": listing_id,
                "actor": actor
            })
            resp.raise_for_status()
            return resp.json()

    def get_reconciliation_status(self, booking_id: str) -> Dict[str, Any]:
        """Runs multi-source amount reconciliation for a booking."""
        with httpx.Client(base_url=self.endpoint_url, timeout=10.0) as client:
            resp = client.get(f"/api/trustlayer/reconciliation/{booking_id}")
            resp.raise_for_status()
            return resp.json()

    def verify_media(self, listing_id: str, image_bytes: bytes, filename: str = "photo.jpg") -> Dict[str, Any]:
        """Runs perceptual hashing and visual similarity check for listing photos."""
        with httpx.Client(base_url=self.endpoint_url, timeout=15.0) as client:
            files = {"file": (filename, image_bytes, "image/jpeg")}
            data = {"listing_id": listing_id}
            resp = client.post("/api/media/upload", data=data, files=files)
            resp.raise_for_status()
            return resp.json()

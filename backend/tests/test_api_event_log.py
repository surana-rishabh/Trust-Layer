from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_api_create_and_verify_event():
    response = client.post(
        "/api/events/",
        json={
            "event_type": "QUOTE_CREATED",
            "booking_id": "BK-999",
            "listing_id": "WY-999",
            "actor": "test_script",
            "payload": {"price": 10000}
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["event_type"] == "QUOTE_CREATED"
    assert data["booking_id"] == "BK-999"
    assert len(data["event_hash"]) == 64
    assert len(data["previous_hash"]) == 64

    # Verify integrity endpoint
    integrity_resp = client.get("/api/events/integrity")
    assert integrity_resp.status_code == 200
    integrity_data = integrity_resp.json()
    assert integrity_data["valid"] is True
    assert integrity_data["total_events"] >= 1

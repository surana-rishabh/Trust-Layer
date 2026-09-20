# 🛡️ TrustLayer: Multi-Platform Independent Verification Engine

> **Geeks2Code Hackathon 2026 Submission** | *Wayzyy Track • Zero-Commission Vacation Rentals*

TrustLayer is an independent, non-intrusive verification protocol engineered for direct-host marketplaces like **Wayzyy**, **OYO Rooms**, and **MakeMyTrip**. It guarantees listing authenticity and payment integrity without numeric trust scores, heavy infrastructure, or third-party centralized authority.

---

## 🌟 Key Features

1. **Evidence Engine (Media Perceptual Hashing & Similarity Check)**:
   - Automated server-side image compression.
   - Dual-layer hashing: SHA-256 (exact match) and 64-bit dHash perceptual hashing (perceptual similarity).
   - Returns categorical status: `No significant concern` or `Similar media detected — additional verification required`.

2. **Reconciliation Engine (Dual-Ledger Anti-Fraud)**:
   - Independent verification between `booking_service` quotes and `payment_webhook` events.
   - Detects price manipulation and currency unit divergence automatically.

3. **Tamper-Evident SHA-256 Hash Chain**:
   - Every system event (`QUOTE`, `BOOKING_CONFIRMED`, `PAYMENT_WEBHOOK`, `DISPUTE_SUBMITTED`, `RESOLVED`) is append-only hash-chained (`previous_hash` → `event_hash`).
   - Periodic batch root hashes are anchored to Polygon testnet.

4. **Linear-Grade Dark Canvas UI**:
   - Modern software-craft frontend UI built following Linear design specs.
   - Instant multi-platform filter for Wayzyy, OYO Rooms, and MakeMyTrip stays.

---

## 🚀 Quick Start & Deployment Guide

### Prerequisites
- Python 3.11+
- Node.js 18+

### 1. Backend Setup & Run

```powershell
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv .venv
.venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Seed authentic property data & media specimens
python seed_data/fetch_real_listings.py

# Start FastAPI server on port 8000
python -m uvicorn app.main:app --port 8000
```

*API Documentation is available at `http://localhost:8000/docs`.*

### 2. Frontend Setup & Run

```powershell
# Navigate to frontend directory
cd frontend

# Install npm dependencies
npm install

# Start development preview on port 3000
npm run dev
```

*Open browser at `http://localhost:3000` to interact with the TrustLayer demo.*

---

## 🧪 Running Automated Test Suite

```powershell
cd backend
.venv\Scripts\pytest -o pythonpath=. tests/
```

*10/10 automated tests passing cleanly.*

---

## 📂 Project Architecture

```
Trust-Layer/
├── backend/
│   ├── app/
│   │   ├── blockchain/          # Polygon batch root hash anchoring
│   │   ├── routers/             # FastAPI REST endpoints
│   │   ├── services/            # Evidence & Reconciliation engines
│   │   ├── db.py                # Database sessions & models
│   │   └── main.py              # Application entrypoint
│   ├── seed_data/               # Real property seeder scripts
│   ├── tests/                   # Pytest test suite (10/10 passing)
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/          # Linear-style UI components
│   │   ├── pages/               # Marketplace, Host Upload & Reviewer Console
│   │   └── App.jsx              # Main App workspace
│   └── vite.config.js           # Vite config with API proxy
└── README.md
```

---

## 📜 License
MIT License. Built for Geeks2Code 2026.

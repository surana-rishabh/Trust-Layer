# TrustLayer — Architecture Decision Log

This log records design choices and parameter selections made during the build of TrustLayer.

## Decisions

- **2026-09-18 — Database & Connection Pattern**: Used SQLite with SQLAlchemy session-per-request pattern (`backend/app/db.py`) and targeted indexes on `event_log` (`booking_id`, `listing_id`, `previous_hash`) per Performance Plan Section 2.5 & 3.1.
- **2026-09-18 — Canonical Event Hashing**: SHA-256 over `previous_hash` + sorted JSON payload string (`event_type`, `booking_id`, `listing_id`, `payload`, `timestamp`) to ensure deterministic hash chaining across environments.

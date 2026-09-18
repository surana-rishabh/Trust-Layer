import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Index
from app.db import Base

def utcnow():
    return datetime.datetime.now(datetime.timezone.utc)

class EventLog(Base):
    __tablename__ = "event_log"

    id = Column(Integer, primary_key=True, index=True)
    event_type = Column(String(50), nullable=False)
    booking_id = Column(String(50), nullable=True, index=True)  # Index 1 per Perf Plan 3.1
    listing_id = Column(String(50), nullable=True, index=True)  # Index 2 per Perf Plan 3.1
    actor = Column(String(50), nullable=False, default="system")
    payload = Column(Text, nullable=False)  # JSON string
    previous_hash = Column(String(64), nullable=False, index=True)  # Index 3 per Perf Plan 3.1
    event_hash = Column(String(64), nullable=False, unique=True, index=True)
    timestamp = Column(DateTime, default=utcnow, nullable=False)
    batch_id = Column(String(50), nullable=True, index=True)

class Listing(Base):
    __tablename__ = "listings"

    id = Column(String(50), primary_key=True, index=True)
    title = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    price_per_night = Column(Integer, nullable=False)
    host_id = Column(String(50), nullable=False)
    created_at = Column(DateTime, default=utcnow)

class MediaAsset(Base):
    __tablename__ = "media_assets"

    id = Column(Integer, primary_key=True, index=True)
    listing_id = Column(String(50), ForeignKey("listings.id"), nullable=False, index=True)  # Index per Perf Plan 3.1
    filename = Column(String(255), nullable=False)
    image_path = Column(String(500), nullable=False)
    exact_hash = Column(String(64), nullable=True, index=True)
    phash = Column(String(64), nullable=True, index=True)
    embedding = Column(Text, nullable=True)  # JSON representation of embedding vector
    uploaded_at = Column(DateTime, default=utcnow)

class ReconciliationFlag(Base):
    __tablename__ = "reconciliation_flags"

    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(String(50), nullable=False, index=True)
    flag_type = Column(String(50), nullable=False)  # e.g., "PRICE_MISMATCH", "SIMILAR_MEDIA"
    status = Column(String(50), nullable=False, default="OPEN", index=True)  # Composite index below
    details = Column(Text, nullable=False)  # JSON payload
    created_at = Column(DateTime, default=utcnow)

    __table_args__ = (
        Index("idx_rec_flag_booking_status", "booking_id", "status"),  # Index per Perf Plan 3.1
    )

class Dispute(Base):
    __tablename__ = "disputes"

    id = Column(Integer, primary_key=True, index=True)
    flag_id = Column(Integer, ForeignKey("reconciliation_flags.id"), nullable=False, index=True)
    booking_id = Column(String(50), nullable=False, index=True)
    host_evidence = Column(Text, nullable=True)
    reviewer_decision = Column(String(50), nullable=True)
    status = Column(String(50), nullable=False, default="PENDING")
    created_at = Column(DateTime, default=utcnow)
    updated_at = Column(DateTime, default=utcnow, onupdate=utcnow)

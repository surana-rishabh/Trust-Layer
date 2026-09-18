from fastapi import FastAPI
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.db import engine, Base
from app.routers import event_log, media, booking, payments, trustlayer, anchoring, disputes, listings

# Create DB tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.PROJECT_NAME)

# Perf Plan 2.4: Enable GZip middleware for response compression
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Allow CORS for dev frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(event_log.router)
app.include_router(media.router)
app.include_router(booking.router)
app.include_router(payments.router)
app.include_router(trustlayer.router)
app.include_router(anchoring.router)
app.include_router(disputes.router)
app.include_router(listings.router)

@app.get("/health")
def health_check():
    return {"status": "ok", "app": settings.PROJECT_NAME}

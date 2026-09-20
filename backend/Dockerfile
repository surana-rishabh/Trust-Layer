# Multi-stage Dockerfile for Railway backend deployment
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies for Pillow / image processing
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend /app

# Seed properties & start FastAPI
CMD python seed_data/fetch_real_listings.py && uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}

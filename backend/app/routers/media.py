import os
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List

from app.db import get_db
from app.models import MediaAsset
from app.services import evidence_engine

router = APIRouter(prefix="/api/media", tags=["Media Evidence Engine"])

@router.post("/upload")
async def upload_media(
    listing_id: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Uploads host listing photo, compresses it server-side (Perf Plan 1.1),
    calculates exact and perceptual hashes, and runs Evidence Engine similarity check.
    """
    contents = await file.read()
    if not contents:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    evidence_result, asset = evidence_engine.check_media_similarity(
        db=db,
        listing_id=listing_id,
        image_bytes=contents,
        filename=file.filename or "uploaded_image.jpg"
    )

    return {
        "media_asset_id": asset.id,
        "filename": asset.filename,
        "exact_hash": asset.exact_hash,
        "phash": asset.phash,
        "evidence_status": evidence_result
    }

@router.get("/listings/{listing_id}")
def get_listing_media(listing_id: str, db: Session = Depends(get_db)):
    """Retrieves all media assets associated with a given listing."""
    assets = db.query(MediaAsset).filter(MediaAsset.listing_id == listing_id).all()
    return assets

@router.get("/assets/{asset_id}/file")
def get_media_file(asset_id: int, db: Session = Depends(get_db)):
    """Serves compressed media file for a media asset."""
    asset = db.query(MediaAsset).filter(MediaAsset.id == asset_id).first()
    if not asset or not os.path.exists(asset.image_path):
        raise HTTPException(status_code=404, detail="Media file not found")
    return FileResponse(asset.image_path)

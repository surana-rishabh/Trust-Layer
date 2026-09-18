import os
import uuid
import json
from typing import Dict, Any, List, Optional, Tuple
from sqlalchemy.orm import Session
from app.models import MediaAsset, ReconciliationFlag, Listing
from app.services.image_processing import (
    process_and_compress_image,
    calculate_phash_distance,
    calculate_cosine_similarity
)
from app.services.event_log import append_event

# Thresholds for visual similarity detection
PHASH_HAMMING_THRESHOLD = 10  # <= 10 indicates high perceptual similarity
COSINE_SIMILARITY_THRESHOLD = 0.85  # >= 0.85 indicates high color/composition similarity

# Non-negotiable constraint 3 & 4: Categorical status only (No trust score).
# Media matches are labeled "Similar media detected — additional verification required", NEVER "fake" or "fraud".
STATUS_CLEAR = "No significant concern"
STATUS_FLAGGED = "Additional verification required"

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "uploads")

def check_media_similarity(
    db: Session,
    listing_id: str,
    image_bytes: bytes,
    filename: str
) -> Tuple[Dict[str, Any], MediaAsset]:
    """
    Processes uploaded image, checks exact hash, pHash, and embedding against all existing assets in DB.
    Returns: (evidence_status_dict, created_media_asset)
    """
    os.makedirs(UPLOAD_DIR, exist_ok=True)

    # 1. Process & compress image (Perf Plan 1.1)
    compressed_bytes, exact_hash, phash_str, embedding_json = process_and_compress_image(image_bytes)

    # Save compressed file to disk
    unique_filename = f"{uuid.uuid4().hex[:8]}_{filename}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    with open(file_path, "wb") as f:
        f.write(compressed_bytes)

    # 2. Query existing media assets (excluding current listing's own uploads if any)
    existing_assets = db.query(MediaAsset).all()

    match_found = False
    matched_listing_id = None
    match_type = None

    for asset in existing_assets:
        if asset.listing_id == listing_id:
            continue  # Skip checking against self

        # Check exact SHA-256 hash match
        if asset.exact_hash and asset.exact_hash == exact_hash:
            match_found = True
            matched_listing_id = asset.listing_id
            match_type = "Exact image hash match"
            break

        # Check perceptual hash Hamming distance
        if asset.phash and phash_str:
            dist = calculate_phash_distance(phash_str, asset.phash)
            if dist <= PHASH_HAMMING_THRESHOLD:
                match_found = True
                matched_listing_id = asset.listing_id
                match_type = f"Perceptual similarity match (distance {dist})"
                break

        # Check embedding similarity
        if asset.embedding and embedding_json:
            sim = calculate_cosine_similarity(embedding_json, asset.embedding)
            if sim >= COSINE_SIMILARITY_THRESHOLD:
                match_found = True
                matched_listing_id = asset.listing_id
                match_type = f"Visual vector similarity match ({int(sim * 100)}%)"
                break

    # 3. Create MediaAsset DB record
    new_asset = MediaAsset(
        listing_id=listing_id,
        filename=filename,
        image_path=file_path,
        exact_hash=exact_hash,
        phash=phash_str,
        embedding=embedding_json
    )
    db.add(new_asset)
    db.commit()
    db.refresh(new_asset)

    # 4. Generate categorical evidence status and events/flags if matched
    if match_found:
        status_label = STATUS_FLAGGED
        details_msg = f"Similar media detected — matching prior Listing #{matched_listing_id} ({match_type})"
        
        # Create ReconciliationFlag record
        flag = ReconciliationFlag(
            booking_id=f"LISTING-{listing_id}",  # Associated listing flag
            flag_type="SIMILAR_MEDIA",
            status="OPEN",
            details=json.dumps({
                "listing_id": listing_id,
                "matched_listing_id": matched_listing_id,
                "match_type": match_type,
                "media_asset_id": new_asset.id,
                "status_label": status_label,
                "message": details_msg
            })
        )
        db.add(flag)
        db.commit()

        # Log event to EventLog (Constraint 5: append-only)
        append_event(
            db=db,
            event_type="MEDIA_SIMILARITY_FLAGGED",
            payload={
                "listing_id": listing_id,
                "matched_listing_id": matched_listing_id,
                "match_type": match_type,
                "media_asset_id": new_asset.id,
                "status": status_label,
                "message": details_msg
            },
            listing_id=listing_id,
            actor="evidence_engine"
        )

        result_summary = {
            "status": status_label,
            "flagged": True,
            "message": details_msg,
            "matched_listing_id": matched_listing_id,
            "media_asset_id": new_asset.id
        }
    else:
        status_label = STATUS_CLEAR
        details_msg = "No significant concern — media verified unique."
        
        append_event(
            db=db,
            event_type="MEDIA_VERIFIED_CLEAR",
            payload={
                "listing_id": listing_id,
                "media_asset_id": new_asset.id,
                "status": status_label,
                "message": details_msg
            },
            listing_id=listing_id,
            actor="evidence_engine"
        )

        result_summary = {
            "status": status_label,
            "flagged": False,
            "message": details_msg,
            "matched_listing_id": None,
            "media_asset_id": new_asset.id
        }

    return result_summary, new_asset

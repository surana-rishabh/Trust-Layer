import io
import hashlib
import json
from PIL import Image
import imagehash
import numpy as np
from typing import Tuple, List, Dict, Any

# ponytail: Compress uploaded images server-side (Perf Plan 1.1) to optimize storage & speed up pHash calculation.
MAX_DIMENSION = 1200
JPEG_QUALITY = 85

def process_and_compress_image(image_bytes: bytes) -> Tuple[bytes, str, str, str]:
    """
    Compresses image server-side, calculates exact SHA-256, perceptual hash (pHash),
    and normalized color/feature embedding vector.
    Returns: (compressed_bytes, exact_hash, phash_str, embedding_json_str)
    """
    exact_hash = hashlib.sha256(image_bytes).hexdigest()

    img = Image.open(io.BytesIO(image_bytes))
    if img.mode in ("RGBA", "P"):
        img = img.convert("RGB")

    # Resize if larger than MAX_DIMENSION while keeping aspect ratio
    if max(img.width, img.height) > MAX_DIMENSION:
        img.thumbnail((MAX_DIMENSION, MAX_DIMENSION), Image.Resampling.LANCZOS)

    # Compress image
    output_buffer = io.BytesIO()
    img.save(output_buffer, format="JPEG", quality=JPEG_QUALITY, optimize=True)
    compressed_bytes = output_buffer.getvalue()

    # Perceptual hash (dhash)
    phash_val = str(imagehash.dhash(img))

    # Normalized color histogram embedding vector (8 bins per RGB channel = 512 dimensions -> normalized)
    hist = img.histogram()
    # Ensure 768 elements (256 * 3) or reduce to 64 bins (16 * 4) for lightweight fast comparison
    arr = np.array(hist, dtype=np.float32)
    norm = np.linalg.norm(arr)
    if norm > 0:
        arr = arr / norm
    embedding_json_str = json.dumps(arr.tolist())

    return compressed_bytes, exact_hash, phash_val, embedding_json_str

def calculate_phash_distance(phash1: str, phash2: str) -> int:
    """Calculates Hamming distance between two hex pHash strings."""
    try:
        h1 = imagehash.hex_to_hash(phash1)
        h2 = imagehash.hex_to_hash(phash2)
        return h1 - h2
    except Exception:
        return 64

def calculate_cosine_similarity(emb1_json: str, emb2_json: str) -> float:
    """Calculates cosine similarity between two embedding vectors."""
    try:
        vec1 = np.array(json.loads(emb1_json), dtype=np.float32)
        vec2 = np.array(json.loads(emb2_json), dtype=np.float32)
        dot = np.dot(vec1, vec2)
        norm1 = np.linalg.norm(vec1)
        norm2 = np.linalg.norm(vec2)
        if norm1 > 0 and norm2 > 0:
            return float(dot / (norm1 * norm2))
        return 0.0
    except Exception:
        return 0.0

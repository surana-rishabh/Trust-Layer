import time
from typing import Dict, Any, Optional

# Perf Plan 2.1 & 2.8: Simple in-memory TTL cache (no Redis per Constraint 6)

class SimpleTTLCache:
    def __init__(self, default_ttl: int = 5):
        self._cache: Dict[str, Dict[str, Any]] = {}
        self.default_ttl = default_ttl

    def get(self, key: str) -> Optional[Any]:
        entry = self._cache.get(key)
        if not entry:
            return None
        if time.time() > entry["expires_at"]:
            del self._cache[key]
            return None
        return entry["value"]

    def set(self, key: str, value: Any, ttl: Optional[int] = None):
        expire_in = ttl if ttl is not None else self.default_ttl
        self._cache[key] = {
            "value": value,
            "expires_at": time.time() + expire_in
        }

    def invalidate(self, key: str):
        if key in self._cache:
            del self._cache[key]

    def clear(self):
        self._cache.clear()

reconciliation_cache = SimpleTTLCache(default_ttl=5)
listing_cache = SimpleTTLCache(default_ttl=10)

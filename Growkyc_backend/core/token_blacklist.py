"""
core/token_blacklist.py
=======================
Redis-backed JWT revocation list (logout / "kill this token").

Access tokens are short-lived, so revoked entries are stored with a TTL equal to
the token's remaining lifetime — the key auto-expires exactly when the token
would have expired anyway, keeping the set small with no background cleanup.

Failure policy:
- is_revoked(): FAIL-OPEN. If Redis is briefly unavailable we do not lock every
  user out; tokens are short-lived so the exposure window is bounded. The event
  is logged at WARNING so it is visible.
- revoke(): raises on failure, so /auth/logout can report that the token was NOT
  actually revoked instead of silently lying to the caller.
"""

import logging
import os
import time
from typing import Optional

logger = logging.getLogger(__name__)

_redis_client = None


def _get_client():
    """Lazily build a Redis client from the configured broker URL."""
    global _redis_client
    if _redis_client is None:
        import redis  # imported lazily so the module loads even if redis is absent

        url = (
            os.getenv("TOKEN_BLACKLIST_REDIS_URL")
            or os.getenv("CELERY_BROKER_URL")
            or "redis://localhost:6379/0"
        )
        _redis_client = redis.from_url(
            url, socket_connect_timeout=2, socket_timeout=2, decode_responses=True
        )
    return _redis_client


def _key(jti: str) -> str:
    return f"revoked_jti:{jti}"


def revoke(jti: Optional[str], exp_timestamp: Optional[float]) -> None:
    """
    Add a token's jti to the blacklist until its natural expiry.

    Args:
        jti: the token's unique id claim. No-op if missing (legacy token).
        exp_timestamp: the token 'exp' (unix seconds). No-op if already expired.

    Raises:
        Exception: if the Redis write fails (caller should surface this).
    """
    if not jti:
        return
    ttl = int((exp_timestamp or 0) - time.time())
    if ttl <= 0:
        return  # token already expired; nothing to revoke
    _get_client().setex(_key(jti), ttl, "1")
    logger.info("Token revoked (jti=%s, ttl=%ss)", jti, ttl)


def is_revoked(jti: Optional[str]) -> bool:
    """Return True if the token's jti has been revoked. Fail-open on Redis error."""
    if not jti:
        return False
    try:
        return _get_client().exists(_key(jti)) == 1
    except Exception as exc:  # noqa: BLE001 - intentional fail-open
        logger.warning("Token blacklist check unavailable, failing open: %s", exc)
        return False

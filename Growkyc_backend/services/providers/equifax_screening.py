"""
services/providers/equifax_screening.py
=====================================
Equifax Global Screening adapter (Sprint 3)

Provides screening methods for PEP, sanctions, watchlists and adverse media.
Reuses the OAuth client from `services.providers.equifax` for token management.

This module implements `BaseScreeningProvider` to match existing screening
service expectations and returns `NormalizedScreeningResult` instances.
"""

import logging
import os
import time
from typing import Any, Dict, List, Optional

import httpx

from services.providers.equifax import (EquifaxOAuthError,
                                        get_equifax_oauth_client)
from services.providers.screening.base import (BaseScreeningProvider,
                                               NormalizedScreeningResult)

logger = logging.getLogger(__name__)


class EquifaxScreeningAdapter(BaseScreeningProvider):
    """Adapter for Equifax GlobalScreening APIs.

    Methods:
        - screen_person(full_name, dob, nationality)
        - screen_entity(company_name, registration_number, country)
        - screen_pep(payload)
        - screen_sanctions(payload)
        - screen_watchlists(payload)
        - screen_adverse_media(payload)
    """

    def __init__(self) -> None:
        self._provider_name = "Equifax"
        self.base_url = os.getenv("EQUIFAX_BASE_URL")
        # endpoints may be overridden via env
        self.pep_path = os.getenv("EQUIFAX_PEP_PATH", "/v1/screening/pep")
        self.sanctions_path = os.getenv(
            "EQUIFAX_SANCTIONS_PATH", "/v1/screening/sanctions"
        )
        self.watchlist_path = os.getenv(
            "EQUIFAX_WATCHLIST_PATH", "/v1/screening/watchlists"
        )
        self.adverse_media_path = os.getenv(
            "EQUIFAX_ADVERSE_MEDIA_PATH", "/v1/screening/adverse-media"
        )
        # retry/backoff
        self._max_retries = 2
        self._backoff = 0.25

    @property
    def provider_version(self) -> str:
        return "screening-oauth-0.1"

    @property
    def provider_name(self) -> str:
        return self._provider_name

    def _post(self, path: str, payload: Dict[str, Any]) -> Dict[str, Any]:
        client = get_equifax_oauth_client()
        if not self.base_url:
            msg = "EQUIFAX_BASE_URL not configured"
            logger.error(msg)
            raise EquifaxOAuthError(msg)

        url = self.base_url.rstrip("/") + path
        last_exc: Optional[Exception] = None

        for attempt in range(1, self._max_retries + 1):
            try:
                token = client.get_access_token()
                headers = {
                    "Authorization": f"Bearer {token}",
                    "Content-Type": "application/json",
                }

                logger.info("Equifax screening POST %s (attempt %d)", url, attempt)
                with httpx.Client(timeout=15.0) as http:
                    resp = http.post(url, json=payload, headers=headers)

                if (
                    resp.status_code in (429, 500, 502, 503, 504)
                    and attempt < self._max_retries
                ):
                    logger.warning(
                        "Transient Equifax screening response %s; retrying",
                        resp.status_code,
                    )
                    time.sleep(self._backoff * attempt)
                    continue

                if resp.status_code == 401:
                    logger.warning(
                        "Equifax screening 401 received; refreshing token and retrying"
                    )
                    client.refresh_access_token()
                    if attempt < self._max_retries:
                        time.sleep(self._backoff * attempt)
                        continue

                try:
                    data = resp.json()
                except Exception:
                    data = {"raw_text": resp.text}

                return {"status_code": resp.status_code, "data": data}

            except EquifaxOAuthError as e:
                last_exc = e
                logger.error("Equifax OAuth error: %s", str(e))
                break
            except Exception as e:
                last_exc = e
                logger.exception(
                    "Equifax screening request failed on attempt %d: %s",
                    attempt,
                    str(e),
                )
                if attempt < self._max_retries:
                    time.sleep(self._backoff * attempt)
                    continue

        raise EquifaxOAuthError(f"Equifax screening failed: {last_exc}")

    def _normalize_screening(
        self, raw: Dict[str, Any], provider_name: str
    ) -> NormalizedScreeningResult:
        # Heuristic mapping: treat presence of matches array as match_found
        data = raw.get("data") if "data" in raw else raw
        matches: List[Any] = []
        prov_ref = None
        status = "clear"
        confidence = 0.0

        if isinstance(data, dict):
            matches = data.get("matches") or data.get("results") or []
            prov_ref = (
                data.get("transactionId")
                or data.get("provider_reference")
                or data.get("id")
            )
            # Determine status
            if matches and len(matches) > 0:
                status = "match_found"
            elif data.get("status") in (
                "match",
                "partial_match",
                "possible_match",
                "confirmed_match",
            ):
                status = "match_found"

            # confidence extraction
            confidence = float(data.get("confidence") or data.get("score") or 0.0)

        return NormalizedScreeningResult(
            provider_name=provider_name,
            provider_reference=prov_ref,
            status=status,
            is_pep=bool(data.get("isPep")) if isinstance(data, dict) else False,
            is_sanctioned=(
                bool(data.get("isSanctioned")) if isinstance(data, dict) else False
            ),
            confidence_score=confidence if confidence else None,
            match_summary=("matches found" if matches else "no matches"),
            raw_response=data,
            matched_entities=matches,
        )

    # Public screening capabilities requested by Sprint
    def screen_pep(self, payload: Dict[str, Any]) -> NormalizedScreeningResult:
        resp = self._post(self.pep_path, payload)
        return self._normalize_screening(resp, self.provider_name)

    def screen_sanctions(self, payload: Dict[str, Any]) -> NormalizedScreeningResult:
        resp = self._post(self.sanctions_path, payload)
        return self._normalize_screening(resp, self.provider_name)

    def screen_watchlists(self, payload: Dict[str, Any]) -> NormalizedScreeningResult:
        resp = self._post(self.watchlist_path, payload)
        return self._normalize_screening(resp, self.provider_name)

    def screen_adverse_media(
        self, payload: Dict[str, Any]
    ) -> NormalizedScreeningResult:
        resp = self._post(self.adverse_media_path, payload)
        return self._normalize_screening(resp, self.provider_name)

    # Implement abstract interface methods
    def screen_person(
        self, full_name: str, dob: Optional[str], nationality: Optional[str]
    ) -> NormalizedScreeningResult:
        # Build a person screening payload expected by Equifax
        payload = {"full_name": full_name, "dob": dob, "nationality": nationality}
        # by default perform combined watchlists/sanctions/pep in one call if endpoint supports
        try:
            return self.screen_watchlists(payload)
        except Exception as e:
            logger.exception("Equifax screen_person failed: %s", str(e))
            return NormalizedScreeningResult(
                provider_name=self.provider_name, status="error"
            )

    def screen_entity(
        self,
        company_name: str,
        registration_number: Optional[str],
        country: Optional[str],
    ) -> NormalizedScreeningResult:
        payload = {
            "company_name": company_name,
            "registration_number": registration_number,
            "country": country,
        }
        try:
            return self.screen_watchlists(payload)
        except Exception as e:
            logger.exception("Equifax screen_entity failed: %s", str(e))
            return NormalizedScreeningResult(
                provider_name=self.provider_name, status="error"
            )

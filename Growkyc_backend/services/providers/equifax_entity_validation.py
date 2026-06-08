import logging
import os
import time
from typing import Any, Dict, List, Optional

import httpx

from services.providers.base_verification_provider import \
    BaseVerificationProvider
from services.providers.equifax import (EquifaxOAuthError,
                                        get_equifax_oauth_client)

logger = logging.getLogger(__name__)


class EquifaxEntityValidationProvider(BaseVerificationProvider):
    """Equifax Commercial Entity Validation (Sprint 4).

    Additive provider that reuses the existing Equifax OAuth client and
    follows the same logging/retry patterns used in Sprint 1-3.
    """

    def __init__(self) -> None:
        self._provider_name = "Equifax"
        self.base_url = os.getenv("EQUIFAX_BASE_URL")
        self.entity_path = os.getenv("EQUIFAX_ENTITY_PATH", "/v1/entity/validate")
        self.abn_path = os.getenv("EQUIFAX_ABN_PATH", "/v1/entity/abn-lookup")
        self.acn_path = os.getenv("EQUIFAX_ACN_PATH", "/v1/entity/acn-lookup")
        self.asic_path = os.getenv("EQUIFAX_ASIC_PATH", "/v1/entity/asic-lookup")
        self.directors_path = os.getenv(
            "EQUIFAX_DIRECTORS_PATH", "/v1/entity/directors"
        )
        self.ownership_path = os.getenv(
            "EQUIFAX_OWNERSHIP_PATH", "/v1/entity/ownership"
        )
        self._max_retries = 3

    @property
    def provider_name(self) -> str:
        return self._provider_name

    @property
    def provider_version(self) -> str:
        # Minimal implementation to satisfy BaseVerificationProvider
        return "1.0"

    def _post(self, path: str, payload: Dict[str, Any]) -> Dict[str, Any]:
        if not self.base_url:
            raise EquifaxOAuthError("EQUIFAX_BASE_URL not configured")

        client = get_equifax_oauth_client()
        url = f"{self.base_url.rstrip('/')}{path}"
        last_exc: Optional[Exception] = None

        for attempt in range(1, self._max_retries + 1):
            try:
                token = client.get_access_token()
                headers = {
                    "Authorization": f"Bearer {token}",
                    "Content-Type": "application/json",
                }
                logger.info("Equifax entity POST %s (attempt %d)", url, attempt)
                resp = httpx.post(url, json=payload, headers=headers, timeout=15.0)

                if resp.status_code == 401:
                    logger.warning(
                        "Equifax entity 401 received; refreshing token and retrying"
                    )
                    try:
                        client.refresh_access_token()
                    except Exception:
                        # fall back to requesting new token on next loop
                        logger.exception(
                            "Equifax token refresh failed; will re-request token"
                        )
                    last_exc = EquifaxOAuthError(
                        "Unauthorized from Equifax entity endpoint"
                    )
                    time.sleep(0.5 * attempt)
                    continue

                if 500 <= resp.status_code < 600:
                    logger.warning(
                        "Transient Equifax entity response %s; retrying",
                        resp.status_code,
                    )
                    last_exc = Exception(f"HTTP {resp.status_code}")
                    time.sleep(0.5 * attempt)
                    continue

                # success or client error
                try:
                    return resp.json()
                except Exception as e:
                    logger.exception(
                        "Failed to parse Equifax entity JSON response: %s", str(e)
                    )
                    return {
                        "error": "invalid_json",
                        "status_code": resp.status_code,
                        "text": resp.text,
                    }

            except EquifaxOAuthError as e:
                last_exc = e
                logger.error(
                    "Equifax OAuth error when calling entity endpoint: %s", str(e)
                )
                time.sleep(0.5 * attempt)
            except Exception as e:
                last_exc = e
                logger.exception(
                    "Equifax entity request failed on attempt %d: %s", attempt, str(e)
                )
                time.sleep(0.5 * attempt)

        raise EquifaxOAuthError(
            f"Equifax entity request failed after {self._max_retries} attempts: {last_exc}"
        )

    def _normalize_entity(self, raw: Dict[str, Any]) -> Dict[str, Any]:
        # Normalization is intentionally conservative: keep raw_response,
        # extract a provider reference if present, and map simple status heuristics.
        provider_reference = None
        if isinstance(raw, dict):
            provider_reference = (
                raw.get("transactionId") or raw.get("id") or raw.get("reference")
            )

        status = "failed"
        try:
            if isinstance(raw, dict) and (
                raw.get("verified") is True or raw.get("status") == "verified"
            ):
                status = "verified"
            elif isinstance(raw, dict) and (
                raw.get("confidence") is not None
                and float(raw.get("confidence", 0)) >= 0.7
            ):
                status = "verified"
            else:
                # If the response contains cues that manual review is suggested
                if isinstance(raw, dict) and raw.get("reviewRequired"):
                    status = "review_required"
        except Exception:
            logger.debug(
                "Entity normalization heuristic failed; defaulting to 'failed'"
            )

        entity_details = raw.get("entity") if isinstance(raw, dict) else {}
        directors = raw.get("directors") if isinstance(raw, dict) else []
        ownership = raw.get("ownership") if isinstance(raw, dict) else []

        return {
            "status": status,
            "provider_reference": provider_reference,
            "entity_details": entity_details or {},
            "directors": directors or [],
            "ownership": ownership or [],
            "raw_response": raw,
        }

    # Public capabilities -------------------------------------------------
    def verify_company(
        self,
        company_name: str,
        registration_number: Optional[str] = None,
        country: Optional[str] = None,
    ) -> Dict[str, Any]:
        payload = {"companyName": company_name}
        if registration_number:
            payload["registrationNumber"] = registration_number
        if country:
            payload["country"] = country

        raw = self._post(self.entity_path, payload)
        return self._normalize_entity(raw)

    # Implement base-class identity API to satisfy abstract contract.
    def verify_identity(
        self, identity_data: Dict[str, Any], country_code: str
    ) -> Dict[str, Any]:
        # This provider focuses on entity validation. For identity calls,
        # return a neutral failed structure indicating unsupported operation.
        return {
            "status": "failed",
            "provider_reference": None,
            "raw_response": {},
            "normalized_confidence": 0.0,
        }

    def verify_abn(self, abn: str) -> Dict[str, Any]:
        payload = {"abn": abn}
        raw = self._post(self.abn_path, payload)
        return self._normalize_entity(raw)

    def verify_acn(self, acn: str) -> Dict[str, Any]:
        payload = {"acn": acn}
        raw = self._post(self.acn_path, payload)
        return self._normalize_entity(raw)

    def verify_asic(self, acn_or_abn: str) -> Dict[str, Any]:
        payload = {"id": acn_or_abn}
        raw = self._post(self.asic_path, payload)
        return self._normalize_entity(raw)

    def verify_directors(self, acn_or_abn: str) -> Dict[str, Any]:
        payload = {"id": acn_or_abn}
        raw = self._post(self.directors_path, payload)
        return self._normalize_entity(raw)

    def verify_ownership(self, acn_or_abn: str) -> Dict[str, Any]:
        payload = {"id": acn_or_abn}
        raw = self._post(self.ownership_path, payload)
        return self._normalize_entity(raw)


def get_equifax_entity_provider() -> EquifaxEntityValidationProvider:
    return EquifaxEntityValidationProvider()

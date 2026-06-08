"""
services/providers/equifax_digital_identity.py
===========================================
Equifax Digital Identity Trust integration (Sprint 5)

Provides contact/email/phone/address verification, fraud indicator checks
and contact validation utilities. Additive-only; reuses the OAuth client
from `services.providers.equifax` and follows the existing HTTP/retry/logging
patterns used by other Equifax provider modules.
"""

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


class EquifaxDigitalIdentityProvider(BaseVerificationProvider):
    """Provider for Equifax Digital Identity Trust APIs.

    Public methods:
        - verify_email(email: str)
        - verify_phone(phone: str)
        - verify_address(address: Dict[str,Any] | str)
        - check_fraud_indicators(payload: Dict)
        - validate_contact(contact: Dict[str,Any])  # combined
    """

    def __init__(self) -> None:
        self._provider_name = "Equifax"
        self.base_url = os.getenv("EQUIFAX_BASE_URL")
        # Allow overriding endpoints via env
        self.email_path = os.getenv(
            "EQUIFAX_DIGITAL_EMAIL_PATH", "/v1/digital/email/verify"
        )
        self.phone_path = os.getenv(
            "EQUIFAX_DIGITAL_PHONE_PATH", "/v1/digital/phone/verify"
        )
        self.address_path = os.getenv(
            "EQUIFAX_DIGITAL_ADDRESS_PATH", "/v1/digital/address/verify"
        )
        self.fraud_path = os.getenv(
            "EQUIFAX_DIGITAL_FRAUD_PATH", "/v1/digital/fraud/check"
        )
        self.contact_path = os.getenv(
            "EQUIFAX_DIGITAL_CONTACT_PATH", "/v1/digital/contact/validate"
        )
        self._max_retries = int(os.getenv("EQUIFAX_DIGITAL_MAX_RETRIES", "2"))
        self._backoff = float(os.getenv("EQUIFAX_DIGITAL_BACKOFF", "0.25"))

    @property
    def provider_name(self) -> str:
        return self._provider_name

    @property
    def provider_version(self) -> str:
        return "digital-identity-oauth-0.1"

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

                logger.info("Equifax digital POST %s (attempt %d)", url, attempt)
                with httpx.Client(timeout=15.0) as http:
                    resp = http.post(url, json=payload, headers=headers)

                if (
                    resp.status_code in (429, 500, 502, 503, 504)
                    and attempt < self._max_retries
                ):
                    logger.warning(
                        "Transient Equifax digital response %s; retrying",
                        resp.status_code,
                    )
                    time.sleep(self._backoff * attempt)
                    continue

                if resp.status_code == 401:
                    logger.warning(
                        "Equifax digital 401 received; attempting token refresh"
                    )
                    try:
                        client.refresh_access_token()
                    except Exception:
                        logger.exception(
                            "Equifax token refresh failed during digital call"
                        )
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
                logger.error("Equifax OAuth error during digital call: %s", str(e))
                break
            except Exception as e:
                last_exc = e
                logger.exception(
                    "Equifax digital request failed on attempt %d: %s", attempt, str(e)
                )
                if attempt < self._max_retries:
                    time.sleep(self._backoff * attempt)
                    continue

        raise EquifaxOAuthError(f"Equifax digital request failed: {last_exc}")

    def _normalize(self, raw: Dict[str, Any]) -> Dict[str, Any]:
        # raw expected: {"data": {...}} or direct dict
        data = raw.get("data") if "data" in raw else raw

        prov_ref = None
        email_verified = False
        phone_verified = False
        address_verified = False
        fraud_indicators: List[Any] = []

        if isinstance(data, dict):
            prov_ref = (
                data.get("transactionId") or data.get("id") or data.get("reference")
            )

            # Heuristics for booleans
            email_verified = bool(
                data.get("email_verified")
                or data.get("emailVerified")
                or data.get("verified_email")
                or data.get("emailStatus") == "verified"
            )
            phone_verified = bool(
                data.get("phone_verified")
                or data.get("phoneVerified")
                or data.get("verified_phone")
                or data.get("phoneStatus") == "verified"
            )
            address_verified = bool(
                data.get("address_verified")
                or data.get("addressVerified")
                or data.get("verified_address")
                or data.get("addressStatus") == "verified"
            )

            # fraud indicators may be list or dict of flags
            if isinstance(data.get("fraudIndicators"), list):
                fraud_indicators = data.get("fraudIndicators")
            elif isinstance(data.get("fraud_indicators"), list):
                fraud_indicators = data.get("fraud_indicators")
            elif isinstance(data.get("fraud"), dict):
                # convert truthy fields to list
                fraud_indicators = [k for k, v in data.get("fraud").items() if v]
            elif isinstance(data.get("fraud"), list):
                fraud_indicators = data.get("fraud")

        # Determine overall status
        status = "failed"
        if (
            email_verified
            and phone_verified
            and address_verified
            and not fraud_indicators
        ):
            status = "verified"
        elif fraud_indicators:
            status = "review_required"
        elif email_verified or phone_verified or address_verified:
            status = "review_required"

        return {
            "status": status,
            "provider_reference": prov_ref,
            "email_verified": email_verified,
            "phone_verified": phone_verified,
            "address_verified": address_verified,
            "fraud_indicators": fraud_indicators,
            "raw_response": data,
        }

    # Public operations ---------------------------------------------------
    def verify_email(self, email: str) -> Dict[str, Any]:
        payload = {"email": email}
        resp = self._post(self.email_path, payload)
        return self._normalize(resp)

    def verify_phone(self, phone: str) -> Dict[str, Any]:
        payload = {"phone": phone}
        resp = self._post(self.phone_path, payload)
        return self._normalize(resp)

    def verify_address(self, address: Any) -> Dict[str, Any]:
        # address may be dict or string
        payload = {"address": address}
        resp = self._post(self.address_path, payload)
        return self._normalize(resp)

    def check_fraud_indicators(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        resp = self._post(self.fraud_path, payload)
        return self._normalize(resp)

    def validate_contact(self, contact: Dict[str, Any]) -> Dict[str, Any]:
        # Combined call: prefer server-side combined endpoint if available
        try:
            if self.contact_path and os.getenv(
                "EQUIFAX_USE_COMBINED_CONTACT", "true"
            ).lower() in ("1", "true"):
                resp = self._post(self.contact_path, contact)
                return self._normalize(resp)

            # Fallback: call individual checks and aggregate
            email_res = (
                self.verify_email(contact.get("email"))
                if contact.get("email")
                else {
                    "email_verified": False,
                    "fraud_indicators": [],
                    "raw_response": {},
                }
            )
            phone_res = (
                self.verify_phone(contact.get("phone"))
                if contact.get("phone")
                else {
                    "phone_verified": False,
                    "fraud_indicators": [],
                    "raw_response": {},
                }
            )
            addr_res = (
                self.verify_address(contact.get("address"))
                if contact.get("address")
                else {
                    "address_verified": False,
                    "fraud_indicators": [],
                    "raw_response": {},
                }
            )

            # combine fraud indicators
            frauds: List[Any] = []
            for r in (email_res, phone_res, addr_res):
                frauds.extend(r.get("fraud_indicators") or [])

            # compute combined status
            email_ok = bool(email_res.get("email_verified"))
            phone_ok = bool(phone_res.get("phone_verified"))
            addr_ok = bool(addr_res.get("address_verified"))

            status = "failed"
            if email_ok and phone_ok and addr_ok and not frauds:
                status = "verified"
            elif frauds:
                status = "review_required"
            elif email_ok or phone_ok or addr_ok:
                status = "review_required"

            combined = {
                "status": status,
                "provider_reference": (
                    email_res.get("provider_reference")
                    or phone_res.get("provider_reference")
                    or addr_res.get("provider_reference")
                ),
                "email_verified": email_ok,
                "phone_verified": phone_ok,
                "address_verified": addr_ok,
                "fraud_indicators": frauds,
                "raw_response": {
                    "email": email_res.get("raw_response"),
                    "phone": phone_res.get("raw_response"),
                    "address": addr_res.get("raw_response"),
                },
            }

            return combined
        except Exception as e:
            logger.exception("Equifax validate_contact failed: %s", str(e))
            return {
                "status": "failed",
                "provider_reference": None,
                "email_verified": False,
                "phone_verified": False,
                "address_verified": False,
                "fraud_indicators": [],
                "raw_response": {"error": str(e)},
            }

    # Implement BaseVerificationProvider compatibility
    def verify_identity(
        self, identity_data: Dict[str, Any], country_code: str
    ) -> Dict[str, Any]:
        # Provide a lightweight mapping so this provider can be instantiated
        contact = {
            "email": identity_data.get("email"),
            "phone": identity_data.get("phone"),
            "address": identity_data.get("address"),
        }
        res = self.validate_contact(contact)
        # produce a minimal normalized_confidence for compatibility
        conf = 100.0 if res.get("status") == "verified" else 0.0
        return {
            "status": res.get("status"),
            "provider_reference": res.get("provider_reference"),
            "raw_response": res.get("raw_response"),
            "normalized_confidence": conf,
        }


def get_equifax_digital_identity_provider() -> EquifaxDigitalIdentityProvider:
    return EquifaxDigitalIdentityProvider()

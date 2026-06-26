"""
services/square_service.py
==========================
Service layer for Square Payment SDK operations.
Compatible with squareup SDK v44+.
"""

import os
import uuid
import hashlib
import hmac
import base64
import logging
from decimal import Decimal
from typing import Dict, Any, Optional

# NOTE: The `squareup` SDK (v44+) requires pydantic-core>=2.18.2, which conflicts
# with this project's pinned pydantic==2.5.0. To avoid forcing a risky global
# pydantic upgrade, Square is an OPTIONAL integration: the SDK is imported lazily
# at instantiation time. Endpoints degrade gracefully (HTTP 503) when the SDK is
# not installed, instead of crashing the whole API at import time.
logger = logging.getLogger(__name__)


class SquareNotAvailableError(RuntimeError):
    """Raised when the Square SDK is not installed in the runtime image."""


class SquareService:
    """
    Service for integrating with the official Square API (SDK v44+).
    Uses environment variables for all authentication credentials.

    Environment Variables:
        SQUARE_ACCESS_TOKEN   - Required. OAuth/Personal Access Token.
        SQUARE_APPLICATION_ID - Required. Application ID from Square dashboard.
        SQUARE_ENV            - Optional. 'sandbox' (default) or 'production'.
        SQUARE_LOCATION_ID    - Optional. Override location; auto-detected if omitted.
    """

    def __init__(self):
        self.access_token = os.getenv("SQUARE_ACCESS_TOKEN")
        self.application_id = os.getenv("SQUARE_APPLICATION_ID")
        env_str = os.getenv("SQUARE_ENV", "sandbox").lower()

        # Validate credentials. If missing, raise ValueError so callers
        # can abort with HTTP 500 per acceptance criteria.
        if not self.access_token or not self.application_id:
            logger.error("Square API credentials are not fully configured in environment.")
            raise ValueError("Square API credentials are missing.")

        # Lazy import: keeps the module importable when `squareup` is not installed.
        try:
            from square.client import Square, SquareEnvironment
        except ImportError as exc:  # pragma: no cover - depends on optional dep
            logger.error("Square SDK ('squareup') is not installed in this image.")
            raise SquareNotAvailableError(
                "Square payments are not enabled in this deployment. "
                "Install the 'squareup' SDK (note: requires pydantic-core>=2.18.2) "
                "to enable Square."
            ) from exc

        # Map env string to the SDK enum
        if env_str == "production":
            self.environment = SquareEnvironment.PRODUCTION
        else:
            self.environment = SquareEnvironment.SANDBOX

        # Initialize the v44 SDK client
        self.client = Square(
            token=self.access_token,
            environment=self.environment,
        )

        logger.info(
            f"[SquareService] Initialized. environment={self.environment.name} "
            f"application_id={self.application_id}"
        )

    # ------------------------------------------------------------------
    # Location helpers
    # ------------------------------------------------------------------

    def get_location_id(self) -> str:
        """
        Return the Square location ID to use for checkout operations.
        Priority:
          1. SQUARE_LOCATION_ID env var (fast path).
          2. First active location from the API.
          3. First location of any status if no active ones exist.
        Raises ValueError if no location can be resolved.
        """
        loc_id = os.getenv("SQUARE_LOCATION_ID")
        if loc_id:
            return loc_id

        try:
            # v44 SDK: client.locations.list() returns ListLocationsResponse (Pydantic)
            res = self.client.locations.list()
            locations = res.locations or []
            if not locations:
                raise ValueError("No locations found in Square account.")

            # Prefer ACTIVE status
            active = [loc for loc in locations if loc.status == "ACTIVE"]
            chosen = active[0] if active else locations[0]

            if chosen.id is None:
                raise ValueError("Square returned a location with no ID.")

            logger.info(f"[SquareService] Using location_id={chosen.id}")
            return chosen.id

        except Exception as e:
            logger.exception("Error while listing locations from Square API")
            raise ValueError(f"Square API error during location retrieval: {str(e)}")

    # ------------------------------------------------------------------
    # Checkout / Payment Link
    # ------------------------------------------------------------------

    def create_checkout_link(
        self,
        onboarding_type: str,
        amount: Decimal,
        currency: str = "AUD",
        redirect_url: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Generate a Square payment link for the given onboarding type and amount.

        Returns a dict with:
            checkout_url  - URL the user visits to complete payment.
            payment_id    - The Square payment link ID (used for correlation).
            order_id      - The Square order ID created with the link.
        """
        location_id = self.get_location_id()

        # Square requires integer cents
        amount_in_cents = int(amount * Decimal("100"))

        # Build params using TypedDicts required by v44 SDK
        quick_pay_params: Dict[str, Any] = {
            "name": f"KYC Onboarding - {onboarding_type}",
            "price_money": {
                "amount": amount_in_cents,
                "currency": currency,
            },
            "location_id": location_id,
        }

        create_kwargs: Dict[str, Any] = {
            "idempotency_key": str(uuid.uuid4()),
            "quick_pay": quick_pay_params,
        }

        if redirect_url:
            create_kwargs["checkout_options"] = {"redirect_url": redirect_url}

        try:
            # v44 SDK: client.checkout.payment_links.create(...)
            # Returns CreatePaymentLinkResponse (Pydantic); raises ApiError on failure.
            res = self.client.checkout.payment_links.create(**create_kwargs)

            payment_link = res.payment_link
            if payment_link is None:
                raise ValueError("Square returned no payment_link in response.")

            logger.info(
                f"[SquareService] Checkout link created: "
                f"link_id={payment_link.id} order_id={payment_link.order_id}"
            )

            return {
                "checkout_url": payment_link.url,
                "payment_id": payment_link.id,   # Square payment link ID
                "order_id": payment_link.order_id,
            }

        except Exception as e:
            logger.exception("Error creating checkout link via Square API")
            raise ValueError(f"Square Checkout API error: {str(e)}")

    # ------------------------------------------------------------------
    # Payment Retrieval
    # ------------------------------------------------------------------

    def retrieve_payment(self, payment_id: str) -> Dict[str, Any]:
        """
        Retrieve a payment from Square using its payment/transaction ID.

        Returns a plain dict containing the payment fields for further processing.
        Raises ValueError on API errors.
        """
        try:
            # v44 SDK: client.payments.get(payment_id=...) returns GetPaymentResponse
            res = self.client.payments.get(payment_id=payment_id)

            if res.payment is None:
                raise ValueError(f"Square returned no payment object for id={payment_id}.")

            payment = res.payment
            logger.info(
                f"[SquareService] Retrieved payment: "
                f"id={payment.id} status={payment.status} order_id={payment.order_id}"
            )

            # Return as dict so callers remain decoupled from Square Pydantic models
            return {
                "id": payment.id,
                "status": payment.status,
                "order_id": payment.order_id,
                "amount_money": (
                    {
                        "amount": payment.amount_money.amount,
                        "currency": payment.amount_money.currency,
                    }
                    if payment.amount_money
                    else None
                ),
            }

        except Exception as e:
            logger.exception(f"Error retrieving payment {payment_id} from Square API")
            raise ValueError(f"Square Payments API error: {str(e)}")

    # ------------------------------------------------------------------
    # Status verification
    # ------------------------------------------------------------------

    def verify_payment_status(self, payment_id: str) -> str:
        """
        Verify payment status directly with Square and map it to our
        internal PaymentStatus enum string values.

        Mapping:
            APPROVED / COMPLETED  →  PAID
            PENDING               →  PENDING
            CANCELED              →  CANCELLED
            (anything else)       →  FAILED
        """
        payment = self.retrieve_payment(payment_id)
        sq_status = payment.get("status") or "FAILED"

        if sq_status in ("APPROVED", "COMPLETED"):
            return "PAID"
        elif sq_status == "PENDING":
            return "PENDING"
        elif sq_status == "CANCELED":
            return "CANCELLED"
        else:
            return "FAILED"

    def get_payment_id_from_order(self, order_id: str) -> Optional[str]:
        """
        Resolve the actual Square transaction payment ID from an order.
        Square stores payment IDs in order.tenders[n].payment_id.
        Returns the first payment ID found, or None.
        """
        try:
            res = self.client.orders.get(order_id=order_id)
            order = res.order
            if order and order.tenders:
                for tender in order.tenders:
                    if tender.payment_id:
                        logger.info(
                            f"[SquareService] Resolved payment_id={tender.payment_id} "
                            f"from order_id={order_id}"
                        )
                        return tender.payment_id
            return None
        except Exception as e:
            logger.exception(f"Error resolving payment ID from order {order_id}")
            return None

    # ------------------------------------------------------------------
    # Webhook signature verification
    # ------------------------------------------------------------------

    @staticmethod
    def verify_webhook_signature(
        body_str: str,
        signature_header: str,
        signature_key: str,
        notification_url: str,
    ) -> bool:
        """
        Manually verify the Square webhook HMAC-SHA256 signature.

        Square computes:
            HMAC-SHA256(notification_url + body, signature_key)
        and Base64-encodes the result, sending it in
        `x-square-hmacsha256-signature`.

        Returns True if valid, False otherwise.
        """
        try:
            payload = notification_url + body_str
            digest = hmac.new(
                signature_key.encode("utf-8"),
                payload.encode("utf-8"),
                hashlib.sha256,
            ).digest()
            expected = base64.b64encode(digest).decode("utf-8")
            return hmac.compare_digest(expected, signature_header)
        except Exception:
            logger.exception("Error during webhook signature verification")
            return False

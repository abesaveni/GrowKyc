"""
routers/square_payments.py
==========================
API router for Square payment processing, checkout creation, verification, and webhooks.
"""

import json
import logging
import os
from decimal import Decimal
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Request, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from core.enums import PaymentStatus
from database import get_db
from dependencies import get_current_user
from models import Payment, User
from services.audit_service import AuditService
from services.square_service import SquareService

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/payments", tags=["payments"])


# ---- Pydantic Schemas with OpenAPI docs ----


class CreateCheckoutRequest(BaseModel):
    onboardingType: str = Field(
        ...,
        description="The onboarding flow type, e.g. INDIVIDUAL or ENTITY",
        examples=["INDIVIDUAL"],
    )
    amount: Decimal = Field(
        ...,
        description="The payment amount, specified as a Decimal for precision",
        examples=[Decimal("100.00")],
    )


class CreateCheckoutResponse(BaseModel):
    checkoutUrl: str = Field(
        ...,
        description="The Square-hosted payment page checkout URL",
        examples=["https://square.link/mock/sq_pay_123"],
    )
    paymentId: str = Field(
        ...,
        description="The payment ID registered locally in the database",
        examples=["1"],
    )


class PaymentStatusResponse(BaseModel):
    status: PaymentStatus = Field(
        ...,
        description="The current status of the payment (PENDING, PAID, FAILED, CANCELLED)",
        examples=[PaymentStatus.PAID],
    )


class PaymentVerifyResponse(BaseModel):
    verified: bool = Field(
        ...,
        description="Whether the payment has been successfully completed and verified",
        examples=[True],
    )


# ---- Helpers ----


def log_correlation(
    operation: str,
    user_id: Optional[int] = None,
    payment_id: Optional[int] = None,
    square_payment_id: Optional[str] = None,
):
    """Logs payment operation metadata for request correlation and production debugging."""
    logger.info(
        f"[Payment Correlation Log] Operation={operation} | "
        f"user_id={user_id} | payment_id={payment_id} | "
        f"square_payment_id={square_payment_id}"
    )


# ---- Endpoints ----


@router.post(
    "/create-checkout",
    response_model=CreateCheckoutResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a Square Checkout payment link",
    description="Initializes a pending payment record and retrieves a Square checkout link for the user.",
)
async def create_checkout(
    req: CreateCheckoutRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> CreateCheckoutResponse:
    try:
        square_service = SquareService()
    except ValueError as e:
        logger.error(f"Square client initialization failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Square API credentials are missing.",
        )

    # 1. Create local pending payment record
    payment_rec = Payment(
        user_id=current_user.id,
        onboarding_type=req.onboardingType,
        amount=req.amount,
        currency="AUD",
        status=PaymentStatus.PENDING,
    )
    db.add(payment_rec)
    db.commit()
    db.refresh(payment_rec)

    log_correlation(
        operation="CREATE_CHECKOUT_RECORD",
        user_id=current_user.id,
        payment_id=payment_rec.id,
    )

    # 2. Call Square API to create checkout link
    try:
        checkout_data = square_service.create_checkout_link(
            onboarding_type=req.onboardingType,
            amount=req.amount,
            currency="AUD",
        )
        
        # Checkout API generates payment link ID and order ID.
        # Store payment link ID temporarily as square_payment_id and order_id
        square_link_id = checkout_data.get("payment_id")
        order_id = checkout_data.get("order_id")
        
        payment_rec.square_payment_id = square_link_id
        payment_rec.square_order_id = order_id
        db.commit()

        log_correlation(
            operation="CREATE_CHECKOUT_LINK_SUCCESS",
            user_id=current_user.id,
            payment_id=payment_rec.id,
            square_payment_id=square_link_id,
        )

        # Log audit trail
        audit_service = AuditService(db)
        audit_service.log_event(
            actor_id=current_user.id,
            action="PAYMENT_CREATED",
            entity_type="payment",
            entity_id=payment_rec.id,
            after_data={
                "amount": float(req.amount),
                "onboarding_type": req.onboardingType,
                "square_order_id": order_id,
            },
        )

        return CreateCheckoutResponse(
            checkoutUrl=checkout_data["checkout_url"],
            paymentId=str(payment_rec.id),
        )
    except Exception as e:
        logger.exception("Failed to generate checkout link with Square API")
        payment_rec.status = PaymentStatus.FAILED
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate Square payment link: {str(e)}",
        )


@router.get(
    "/{paymentId}",
    response_model=PaymentStatusResponse,
    summary="Get payment status by local ID",
    description="Retrieve the current status of a payment record from the database.",
)
async def get_payment_status(
    paymentId: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> PaymentStatusResponse:
    payment_rec = db.query(Payment).filter(Payment.id == paymentId).first()
    if not payment_rec:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payment record not found",
        )

    # Security check: User can only see their own payment
    if payment_rec.user_id != current_user.id and current_user.role != "Admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this payment",
        )

    log_correlation(
        operation="GET_PAYMENT_STATUS",
        user_id=current_user.id,
        payment_id=payment_rec.id,
        square_payment_id=payment_rec.square_payment_id,
    )

    return PaymentStatusResponse(status=payment_rec.status)


@router.post(
    "/verify/{paymentId}",
    response_model=PaymentVerifyResponse,
    summary="Verify payment status against Square",
    description="Forces a status check directly with Square APIs and synchronizes the local database status.",
)
async def verify_payment(
    paymentId: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> PaymentVerifyResponse:
    try:
        square_service = SquareService()
    except ValueError as e:
        logger.error(f"Square client initialization failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Square API credentials are missing.",
        )

    payment_rec = db.query(Payment).filter(Payment.id == paymentId).first()
    if not payment_rec:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payment record not found",
        )

    log_correlation(
        operation="VERIFY_PAYMENT_START",
        user_id=current_user.id,
        payment_id=payment_rec.id,
        square_payment_id=payment_rec.square_payment_id,
    )

    if not payment_rec.square_payment_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Payment is missing a valid Square transaction or link ID",
        )

    try:
        # If square_payment_id looks like a payment link ID (not a real payment),
        # resolve the actual transaction payment ID from the order.
        # The webhook would normally do this, but may not have arrived yet.
        resolved_payment_id = payment_rec.square_payment_id
        if payment_rec.square_order_id:
            real_id = square_service.get_payment_id_from_order(payment_rec.square_order_id)
            if real_id:
                resolved_payment_id = real_id
                # Persist the real ID so subsequent calls and webhooks are aligned
                if payment_rec.square_payment_id != real_id:
                    payment_rec.square_payment_id = real_id
                    db.commit()
                    log_correlation(
                        operation="VERIFY_RESOLVED_PAYMENT_ID_FROM_ORDER",
                        user_id=current_user.id,
                        payment_id=payment_rec.id,
                        square_payment_id=real_id,
                    )

        # Check actual status from Square
        new_status_str = square_service.verify_payment_status(resolved_payment_id)
        new_status = PaymentStatus(new_status_str)
        old_status = payment_rec.status

        # Idempotent database update
        if old_status != new_status:
            payment_rec.status = new_status
            db.commit()

            audit_service = AuditService(db)
            if new_status == PaymentStatus.PAID:
                audit_service.log_event(
                    actor_id=payment_rec.user_id,
                    action="PAYMENT_COMPLETED",
                    entity_type="payment",
                    entity_id=payment_rec.id,
                    before_data={"status": old_status.value},
                    after_data={"status": new_status.value, "square_payment_id": payment_rec.square_payment_id},
                )
            elif new_status == PaymentStatus.FAILED:
                audit_service.log_event(
                    actor_id=payment_rec.user_id,
                    action="PAYMENT_FAILED",
                    entity_type="payment",
                    entity_id=payment_rec.id,
                    before_data={"status": old_status.value},
                    after_data={"status": new_status.value, "square_payment_id": payment_rec.square_payment_id},
                )

        log_correlation(
            operation="VERIFY_PAYMENT_SUCCESS",
            user_id=current_user.id,
            payment_id=payment_rec.id,
            square_payment_id=payment_rec.square_payment_id,
        )

        return PaymentVerifyResponse(verified=(new_status == PaymentStatus.PAID))
    except Exception as e:
        logger.exception(f"Error executing verification for payment {paymentId}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Verification failed: {str(e)}",
        )


@router.post(
    "/webhook",
    summary="Square webhook event handler",
    description="Processes asynchronous notifications sent by Square, such as payment.completed, to update statuses.",
)
async def webhook(request: Request, db: Session = Depends(get_db)):
    body_bytes = await request.body()
    body_str = body_bytes.decode("utf-8")

    try:
        payload = json.loads(body_str)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid JSON payload",
        )

    # Signature verification (optional but strongly recommended; runs if key is in environment)
    signature = request.headers.get("x-square-hmacsha256-signature")
    signature_key = os.getenv("SQUARE_APPLICATION_SECRET")
    webhook_url = os.getenv("SQUARE_WEBHOOK_URL")

    if signature_key and signature:
        url = webhook_url or str(request.url)
        is_valid = SquareService.verify_webhook_signature(
            body_str=body_str,
            signature_header=signature,
            signature_key=signature_key,
            notification_url=url,
        )
        if not is_valid:
            logger.warning("Square webhook signature verification failed")
            if os.getenv("SQUARE_ENV", "sandbox").lower() == "production":
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid webhook signature",
                )

    event_type = payload.get("type", "")
    data = payload.get("data", {})
    obj = data.get("object", {})
    payment_obj = obj.get("payment", {})

    if not payment_obj:
        return {"status": "ignored", "message": "No payment object found"}

    sq_payment_id = payment_obj.get("id")
    sq_order_id = payment_obj.get("order_id")
    sq_status = payment_obj.get("status", "")

    # Look up payment record by order ID (set during checkout link creation)
    # or direct square_payment_id if already linked.
    payment_rec = None
    if sq_order_id:
        payment_rec = db.query(Payment).filter(Payment.square_order_id == sq_order_id).first()
    if not payment_rec and sq_payment_id:
        payment_rec = db.query(Payment).filter(Payment.square_payment_id == sq_payment_id).first()

    if not payment_rec:
        logger.warning(
            f"No matching payment record found for webhook. "
            f"Square Payment ID: {sq_payment_id}, Order ID: {sq_order_id}"
        )
        return {"status": "ignored", "message": "No matching payment record"}

    user_id = payment_rec.user_id
    payment_id = payment_rec.id

    log_correlation(
        operation=f"WEBHOOK_RECEIVE_{event_type.upper().replace('.', '_')}",
        user_id=user_id,
        payment_id=payment_id,
        square_payment_id=sq_payment_id,
    )

    # Map Square status: APPROVED/COMPLETED -> PAID, PENDING -> PENDING, CANCELED -> CANCELLED, failed -> FAILED
    new_status = PaymentStatus.FAILED
    if sq_status in ["APPROVED", "COMPLETED"]:
        new_status = PaymentStatus.PAID
    elif sq_status == "PENDING":
        new_status = PaymentStatus.PENDING
    elif sq_status == "CANCELED":
        new_status = PaymentStatus.CANCELLED

    old_status = payment_rec.status

    # IDEMPOTENCY check: Only write to db and emit audit log if status has changed
    if old_status != new_status:
        payment_rec.status = new_status
        if sq_payment_id:
            payment_rec.square_payment_id = sq_payment_id
        db.commit()

        log_correlation(
            operation="WEBHOOK_STATUS_UPDATED",
            user_id=user_id,
            payment_id=payment_id,
            square_payment_id=sq_payment_id,
        )

        audit_service = AuditService(db)
        if new_status == PaymentStatus.PAID:
            audit_service.log_event(
                actor_id=user_id,
                action="PAYMENT_COMPLETED",
                entity_type="payment",
                entity_id=payment_id,
                before_data={"status": old_status.value},
                after_data={"status": new_status.value, "square_payment_id": sq_payment_id},
            )
        elif new_status == PaymentStatus.FAILED:
            audit_service.log_event(
                actor_id=user_id,
                action="PAYMENT_FAILED",
                entity_type="payment",
                entity_id=payment_id,
                before_data={"status": old_status.value},
                after_data={"status": new_status.value, "square_payment_id": sq_payment_id},
            )
    else:
        log_correlation(
            operation="WEBHOOK_STATUS_UNCHANGED_IDEMPOTENT",
            user_id=user_id,
            payment_id=payment_id,
            square_payment_id=sq_payment_id,
        )

    return {"status": "processed", "paymentId": payment_id, "newStatus": new_status.value}

import os

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from dependencies import get_current_user
from models import User

router = APIRouter(prefix="/payments", tags=["payments"])

_IS_DEV = os.getenv("ENV", "development") == "development"


def _assert_payment_provider_configured() -> None:
    if not _IS_DEV:
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="Payment provider not configured. Set ENV=development or integrate a real payment provider.",
        )


class StripeCharge(BaseModel):
    amount: int
    currency: str
    description: str
    cardToken: str


@router.post("/stripe/charge")
async def stripe_charge(
    data: StripeCharge, current_user: User = Depends(get_current_user)
):
    _assert_payment_provider_configured()
    return {"success": True, "transactionId": "ch_mock_123"}


class StripeDirectDebit(BaseModel):
    name: str
    email: str
    bsbNumber: str
    accountNumber: str


@router.post("/stripe/direct-debit")
async def stripe_direct_debit(
    data: StripeDirectDebit, current_user: User = Depends(get_current_user)
):
    _assert_payment_provider_configured()
    return {"success": True, "customerId": "cus_mock_123"}


class PayPalSubscription(BaseModel):
    planId: str
    customerEmail: str
    returnUrl: str
    cancelUrl: str


@router.post("/paypal/subscription")
async def paypal_subscription(
    data: PayPalSubscription, current_user: User = Depends(get_current_user)
):
    _assert_payment_provider_configured()
    return {
        "success": True,
        "approvalUrl": "https://www.paypal.com/mock/approve",
    }

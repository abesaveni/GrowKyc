from fastapi import APIRouter, Depends
from pydantic import BaseModel

from dependencies import get_current_user
from models import User

router = APIRouter(prefix="/payments", tags=["payments"])


class StripeCharge(BaseModel):
    amount: int
    currency: str
    description: str
    cardToken: str


@router.post("/stripe/charge")
async def stripe_charge(
    data: StripeCharge, current_user: User = Depends(get_current_user)
):
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
    return {
        "success": True,
        "approvalUrl": "https://www.paypal.com/mock/approve",
    }

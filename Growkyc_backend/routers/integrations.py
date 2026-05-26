from typing import List, Optional

from fastapi import APIRouter, Depends
from pydantic import BaseModel

from dependencies import get_current_user
from models import User

router = APIRouter(prefix="/integrations", tags=["integrations"])

# Xero


class XeroConnect(BaseModel):
    authCode: str


class XeroContactCreate(BaseModel):
    Name: str
    EmailAddress: Optional[str] = None
    TaxNumber: Optional[str] = None
    Phones: Optional[List[dict]] = []
    Addresses: Optional[List[dict]] = []


@router.post("/xero/connect")
async def connect_xero(data: XeroConnect):
    return {
        "accessToken": "mock_xero_token",
        "refreshToken": "mock_xero_refresh",
    }


@router.post("/xero/contacts")
async def create_xero_contact(
    data: XeroContactCreate, current_user: User = Depends(get_current_user)
):
    return {
        "ContactID": "mock-contact-id",
        "Name": data.Name,
        "EmailAddress": data.EmailAddress,
        "ContactStatus": "ACTIVE",
    }


@router.get("/xero/contacts/{contact_id}")
async def get_xero_contact(
    contact_id: str, current_user: User = Depends(get_current_user)
):
    return {
        "ContactID": contact_id,
        "Name": "Mock Xero Contact",
        "ContactStatus": "ACTIVE",
    }


# ASIC


class ASICLookup(BaseModel):
    acn: str


@router.post("/asic/lookup")
async def asic_lookup(data: ASICLookup):
    return {
        "acn": data.acn,
        "name": "Mock Company Ltd",
        "status": "Registered",
        "type": "Australian Proprietary Company",
    }


@router.post("/asic/directors")
async def asic_directors(data: ASICLookup):
    return {"directors": [{"name": "John Doe", "appointmentDate": "2020-01-01"}]}


# BGL


class BGLConnect(BaseModel):
    apiKey: str
    clientId: str


@router.post("/bgl/connect")
async def connect_bgl(data: BGLConnect, current_user: User = Depends(get_current_user)):
    return {"message": "BGL Connected"}


@router.post("/bgl/funds")
async def create_bgl_fund(data: dict, current_user: User = Depends(get_current_user)):
    return {
        "fundName": data.get("fundName"),
        "abn": data.get("abn"),
        "status": "Created",
    }


@router.get("/bgl/funds/{abn}")
async def get_bgl_fund(abn: str):
    return {"fundName": "Mock SMSF", "abn": abn}


# ATO


class ATOLookup(BaseModel):
    abn: str


@router.post("/ato/lookup")
async def ato_lookup(data: ATOLookup):
    return {
        "abn": data.abn,
        "entityName": "Mock ATO Entity",
        "abnStatus": "Active",
        "gstRegistered": True,
    }


@router.post("/ato/verify-tfn")
async def verify_tfn(data: dict):
    return {"verified": True}

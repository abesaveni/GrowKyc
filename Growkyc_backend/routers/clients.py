import logging
from typing import List

from fastapi import APIRouter, Depends, HTTPException, Request, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

import os

from core.enums import UserRole
from core.limiter import limiter
from database import get_db
from dependencies import get_admin_or_agent_user, get_current_user
from models import Client, User, Payment, PaymentStatus
from schemas import (BeneficialOwnerCreate, BeneficialOwnerResponse,
                     ClientResponse, EntityDirectorCreate,
                     EntityDirectorResponse, EntityProfileCreate,
                     IndividualProfileCreate, OwnershipRelationshipCreate,
                     OwnershipRelationshipResponse, UBOSummaryResponse)
from services.client_service import ClientService
from services.ubo_service import UBOService

router = APIRouter(prefix="/clients", tags=["clients"])

logger = logging.getLogger(__name__)


class StatusUpdate(BaseModel):
    status: str


@router.put("/{client_id}/status")
async def update_client_status(
    client_id: str,
    data: StatusUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_or_agent_user),
):
    try:
        client_db_id = int(client_id)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid client ID")

    client = db.query(Client).filter(Client.id == client_db_id).first()
    if not client:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Client not found")

    if data.status == "approved":
        client.is_locked = False
    elif data.status in ["investigation", "more-info"]:
        client.is_locked = True

    db.commit()

    return {
        "success": True,
        "clientId": client_id,
        "newStatus": data.status,
        "message": f"Client {client_id} status updated in database",
    }


@router.post("/individual", response_model=ClientResponse, status_code=201)
@limiter.limit("10/minute")
async def create_individual_client(
    request: Request,
    profile_data: IndividualProfileCreate,
    trigger_async: bool = False,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Onboard a retail client. Creates Client and IndividualProfile.
    """
    payment_required = os.getenv("PAYMENT_REQUIRED", "false").lower() == "true"
    if payment_required:
        has_paid = db.query(Payment.id).filter(
            Payment.user_id == current_user.id,
            Payment.status == PaymentStatus.PAID
        ).first() is not None
        if not has_paid:
            logger.warning(f"ONBOARDING_BLOCKED: User {current_user.id} has not paid.")
            raise HTTPException(status_code=403, detail="Payment required before verification")

    try:
        client_service = ClientService(db)
        client = client_service.create_individual_client(
            user_id=current_user.id,
            profile_data=profile_data,
            trigger_async=trigger_async,
        )
        return client
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/entity", response_model=ClientResponse, status_code=201)
@limiter.limit("10/minute")
async def create_entity_client(
    request: Request,
    profile_data: EntityProfileCreate,
    trigger_async: bool = False,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Onboard a corporate client. Creates Client and EntityProfile.
    """
    payment_required = os.getenv("PAYMENT_REQUIRED", "false").lower() == "true"
    if payment_required:
        has_paid = db.query(Payment.id).filter(
            Payment.user_id == current_user.id,
            Payment.status == PaymentStatus.PAID
        ).first() is not None
        if not has_paid:
            logger.warning(f"ONBOARDING_BLOCKED: User {current_user.id} has not paid.")
            raise HTTPException(status_code=403, detail="Payment required before verification")

    try:
        client_service = ClientService(db)
        client = client_service.create_entity_client(
            user_id=current_user.id,
            profile_data=profile_data,
            trigger_async=trigger_async,
        )
        return client
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{client_id}", response_model=ClientResponse)
async def get_client(
    client_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Retrieve a specific client with full profile data.
    """
    client_service = ClientService(db)
    client = client_service.get_client_by_id(client_id)
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")

    # Enforce basic ownership or admin access
    if client.user_id != current_user.id and current_user.role == "USER":
        raise HTTPException(
            status_code=403, detail="Not authorized to view this client"
        )

    return client


@router.get("", response_model=dict)
async def list_clients(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    List clients with pagination. Regular users only see their own.
    Returns {total, skip, limit, items}.
    """
    query = db.query(Client)
    if current_user.role == UserRole.USER:
        query = query.filter(Client.user_id == current_user.id)

    total = query.count()
    clients = query.offset(skip).limit(limit).all()
    return {
        "total": total,
        "skip": skip,
        "limit": limit,
        "items": [ClientResponse.model_validate(c) for c in clients],
    }


# ==============================================================
# PHASE 4: UBO (Ultimate Beneficial Owner) Endpoints
# ==============================================================


@router.post(
    "/entity/{client_id}/ubo", response_model=BeneficialOwnerResponse, status_code=201
)
async def add_beneficial_owner(
    client_id: int,
    ubo_data: BeneficialOwnerCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_or_agent_user),
):
    """
    Add an Ultimate Beneficial Owner to a corporate entity.
    """
    ubo_service = UBOService(db)
    ubo = ubo_service.add_beneficial_owner(client_id=client_id, ubo_data=ubo_data)
    return ubo


@router.post(
    "/entity/{client_id}/directors",
    response_model=EntityDirectorResponse,
    status_code=201,
)
async def add_entity_director(
    client_id: int,
    director_data: EntityDirectorCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_or_agent_user),
):
    """
    Add a Director or corporate officer to an entity client.
    """
    ubo_service = UBOService(db)
    director = ubo_service.add_entity_director(
        client_id=client_id, director_data=director_data
    )
    return director


@router.post(
    "/entity/ownership-link",
    response_model=OwnershipRelationshipResponse,
    status_code=201,
)
async def create_ownership_link(
    rel_data: OwnershipRelationshipCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_or_agent_user),
):
    """
    Link two beneficial owners in an ownership graph (layered corporate structures).
    """
    ubo_service = UBOService(db)
    return ubo_service.add_ownership_relationship(rel_data)


@router.get("/entity/{client_id}/ownership-tree")
async def get_ownership_tree(
    client_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Return the layered ownership graph for a corporate entity.
    """
    ubo_service = UBOService(db)
    return ubo_service.get_ownership_tree(client_id=client_id)


@router.get("/entity/{client_id}/ubo-summary", response_model=UBOSummaryResponse)
async def get_ubo_summary(
    client_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Aggregate UBO ownership percentages and risk indicators.
    """
    ubo_service = UBOService(db)
    return ubo_service.aggregate_ubo_summary(client_id=client_id)

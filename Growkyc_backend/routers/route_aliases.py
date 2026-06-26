from typing import Optional

from fastapi import APIRouter, Body, Depends, File, Form, UploadFile
from sqlalchemy.orm import Session

from database import get_db
from dependencies import get_current_user
from routers import compatibility as compat
from schemas import (PasswordChangeRequest, TokenResponse, UserLoginRequest,
                     UserRegisterRequest, UserResponse)
from services.auth_service import ACCESS_TOKEN_EXPIRE_MINUTES, AuthService

router = APIRouter()


# --------------------
# Authentication aliases
# --------------------


@router.post("/auth/login")
async def alias_auth_login(body: UserLoginRequest, db: Session = Depends(get_db)):
    service = AuthService(db)
    user = service.authenticate_user(body.email, body.password)
    role_val = getattr(user, "role", None)
    role_str = getattr(role_val, "value", role_val)
    token = service.create_access_token(user_id=user.id, tenant_id=user.tenant_id, role=role_str)
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        expires_in=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user=UserResponse.model_validate(user),
    )


@router.post("/auth/register")
async def alias_auth_register(body: UserRegisterRequest, db: Session = Depends(get_db)):
    service = AuthService(db)
    user = service.register_user(body.name, body.email, body.password)
    role_val = getattr(user, "role", None)
    role_str = getattr(role_val, "value", role_val)
    token = service.create_access_token(user_id=user.id, tenant_id=user.tenant_id, role=role_str)
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        expires_in=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user=UserResponse.model_validate(user),
    )


@router.post("/auth/oauth")
async def alias_auth_oauth(payload: dict = Body(default_factory=dict)):
    return await compat.compat_auth_oauth(payload=payload)


# /auth/logout removed here — it delegated to a no-op stub and shadowed the real
# token-revoking logout in routers/auth.py (served at /api/v1/auth/logout and
# /api/auth/logout).


@router.get("/auth/session")
async def alias_auth_session(current_user=Depends(get_current_user)):
    try:
        return UserResponse.model_validate(current_user)
    except Exception:
        return {"user": None}


@router.post("/auth/refresh")
async def alias_auth_refresh(
    current_user=Depends(get_current_user), db: Session = Depends(get_db)
):
    return await compat.compat_auth_refresh(current_user=current_user, db=db)


@router.post("/auth/reset-password")
async def alias_auth_reset_password(payload: dict = Body(default_factory=dict)):
    return await compat.compat_auth_reset_password(payload=payload)


@router.post("/auth/update-password")
async def alias_auth_update_password(
    body: PasswordChangeRequest,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return await compat.compat_auth_update_password(
        body=body, current_user=current_user, db=db
    )


@router.post("/auth/verify-email")
async def alias_auth_verify_email(payload: dict = Body(default_factory=dict)):
    return await compat.compat_auth_verify_email(payload=payload)


@router.post("/auth/mfa/setup")
async def alias_auth_mfa_setup():
    return await compat.compat_auth_mfa_setup()


@router.post("/auth/mfa/verify")
async def alias_auth_mfa_verify(payload: dict = Body(default_factory=dict)):
    return await compat.compat_auth_mfa_verify(payload=payload)


# --------------------
# File storage aliases
# --------------------


@router.get("/files/list")
async def alias_files_list(module: Optional[str] = None, folder: Optional[str] = None):
    return await compat.compat_files_list(module=module, folder=folder)


@router.post("/files/upload")
async def alias_files_upload(
    file: UploadFile = File(...),
    module: Optional[str] = Form(None),
    folder: Optional[str] = Form(None),
    metadata: Optional[str] = Form(None),
):
    return await compat.compat_files_upload(
        file=file, module=module, folder=folder, metadata=metadata
    )


@router.get("/files/search")
async def alias_files_search(
    q: Optional[str] = None, module: Optional[str] = None, folder: Optional[str] = None
):
    return await compat.compat_files_search(q=q, module=module, folder=folder)


@router.get("/files/download/{path}")
async def alias_files_download(path: str):
    return await compat.compat_files_download(path=path)


@router.delete("/files/delete/{path}")
async def alias_files_delete(path: str):
    return await compat.compat_files_delete(path=path)


# --------------------
# Deals / audit aliases
# --------------------


@router.get("/deals/{deal_id}/allocations")
async def alias_get_deal_allocations(deal_id: str):
    return await compat.compat_get_deal_allocations(deal_id=deal_id)


@router.post("/deals/{deal_id}/allocations")
async def alias_post_deal_allocation(
    deal_id: str, payload: dict = Body(default_factory=dict)
):
    return await compat.compat_post_deal_allocation(deal_id=deal_id, payload=payload)


@router.post("/audit/log")
async def alias_audit_log(payload: dict = Body(default_factory=dict)):
    return await compat.compat_audit_log(payload=payload)

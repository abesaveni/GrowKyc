from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/pexa", tags=["pexa"])


class PEXAWorkspaceCreate(BaseModel):
    caseData: dict


@router.get("/workspace/{workspace_id}")
async def get_workspace(workspace_id: str):
    # Mock response to match PEXAWorkspaceViewer expectations
    return {
        "workspaceId": workspace_id,
        "status": "active",
        "jurisdiction": "NSW",
        "createdDate": "2024-01-01T00:00:00Z",
        "lastModifiedDate": "2024-01-01T00:00:00Z",
        "parties": [],
        "landTitles": [],
        "roleAllocations": [],
        "financialSettlement": {
            "totalSettlementAmount": 0,
            "disbursementStatus": "pending",
            "sourceItems": [],
            "destinationItems": [],
            "pexaFees": 0,
            "lodgementFees": 0,
            "stampDuty": 0,
            "adjustments": [],
        },
        "documents": [],
        "tasks": [],
    }


@router.post("/workspace/{workspace_id}/sync")
async def sync_workspace(workspace_id: str, caseData: dict):
    return {"message": "Synced with PEXA", "workspaceId": workspace_id}


@router.post("/workspace/create")
async def create_workspace(data: PEXAWorkspaceCreate):
    return {
        "workspaceId": "PEX-MOCK-123",
        "status": "draft",
        "message": "PEXA Workspace Created",
    }


@router.post("/workspace/{workspace_id}/submit")
async def submit_workspace(workspace_id: str):
    return {"message": "Submitted for Settlement", "workspaceId": workspace_id}

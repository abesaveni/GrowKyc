import json
import logging
from datetime import datetime, timezone

from sqlalchemy.orm import Session

from models import Approval, AuditLog, Case, Client, Document, Evidence

logger = logging.getLogger(__name__)


class EvidenceService:
    """Consolidator service generating regulatory evidence packs."""

    def __init__(self, db: Session):
        self.db = db
        self.logger = logger

    def generate_evidence_pack(
        self, client_id: int, target_case_id: int = None
    ) -> dict:
        """
        Gathers immutable state and history into a strict JSON wrapper.
        Provides regulatory explainability.
        """
        client = self.db.query(Client).filter(Client.id == client_id).first()
        if not client:
            return {}

        cases = self.db.query(Case).filter(Case.client_id == client.id).all()
        approvals = (
            self.db.query(Approval).filter(Approval.client_id == client.id).all()
        )
        documents = (
            self.db.query(Document).filter(Document.client_id == client.id).all()
        )

        # Pull audit logs related to this client and its downstream
        # cases/approvals
        case_ids = [c.id for c in cases]
        approval_ids = [a.id for a in approvals]

        audit_logs = (
            self.db.query(AuditLog)
            .filter(
                (AuditLog.entity_type == "client") & (AuditLog.entity_id == client.id)
                | (AuditLog.entity_type == "case")
                & (AuditLog.entity_id.in_(case_ids if case_ids else [-1]))
                | (AuditLog.entity_type == "approval")
                & (AuditLog.entity_id.in_(approval_ids if approval_ids else [-1]))
            )
            .all()
        )

        pack = {
            "client": {
                "id": client.id,
                "name": client.name,
                "risk_level": client.risk_level.value,
                "is_pep": client.is_pep,
                "is_sanctioned": client.is_sanctioned,
            },
            "cases": [
                {"id": c.id, "status": c.status.value, "title": c.title} for c in cases
            ],
            "approvals": [
                {
                    "id": a.id,
                    "role": a.role,
                    "status": a.status,
                    "approver_id": a.approved_by,
                }
                for a in approvals
            ],
            "documents": [
                {"id": d.id, "type": d.type.value, "file_name": d.file_name}
                for d in documents
            ],
            "audit_logs": [
                {
                    "id": al.id,
                    "action": al.action,
                    "entity": al.entity_type,
                    "timestamp": al.timestamp.isoformat(),
                }
                for al in audit_logs
            ],
        }

        # BRD Stabilization: Store in DB Evidence tracking system
        try:
            ev = Evidence(
                client_id=client.id,
                case_id=target_case_id,
                data=json.dumps(pack),
                created_at=datetime.now(timezone.utc),
            )
            self.db.add(ev)
            self.db.commit()
            self.db.refresh(ev)
            pack["evidence_storage_id"] = ev.id
        except Exception as e:
            self.db.rollback()
            self.logger.warning(
                "Failed to cleanly save Evidence Pack to persistence "
                f"layer safely: {str(e)}"
            )

        self.logger.info(f"Generated Evidence Pack for Client {client_id}")
        return pack

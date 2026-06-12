"""
models/__init__.py
==================
Public API of the models package.

Re-exports EVERY model class so that all existing imports of the form:

    from models import User
    from models import KYC, Client, Document
    from models import AuditLog, Evidence

continue to work UNCHANGED across all services, routers, and schedulers.

Import order is load-order safe:
  1. Base (no dependencies)
  2. Tenant (no FK dependencies on other models)
  3. User (FK → tenants)
  4. Client (FK → users, tenants)
  5. Case / workflow models (FK → clients, users, tenants)
  6. KYC / Document / Audit (FK → users, kyc, clients, tenants)
  7. Notification / Evidence / Report (FK → users, kyc, clients, tenants)
  8. New enterprise models (FK → clients, tenants, users)

SQLAlchemy resolves relationship() targets by string name lazily,
so the import order here only matters for FK column resolution —
all back_populates are string-referenced and resolved at mapper config time.

DO NOT import model classes from individual sub-modules in application code.
Always use: `from models import <ClassName>`
"""

from models.alert import Alert  # noqa: F401
from models.audit import AuditLog, KYCAuditLog  # noqa: F401
# ---- Base (must be first) ----
from models.base import Base  # noqa: F401
from models.beneficial_owner import BeneficialOwner  # noqa: F401
from models.case import (Approval, Case, OverrideReason,  # noqa: F401
                         ReviewApproval, ReviewIssue)
from models.case_assignments import CaseAssignment  # noqa: F401
from models.case_comments import CaseComment  # noqa: F401
from models.case_events import CaseEvent  # noqa: F401
from models.case_evidence import CaseEvidence  # noqa: F401
from models.case_sla import CaseSLA  # noqa: F401
from models.case_snapshots import CaseSnapshot  # noqa: F401
from models.client import Client  # noqa: F401
from models.document import Document  # noqa: F401
from models.document_intelligence import (DocumentExtraction,  # noqa: F401
                                          DocumentFace, DocumentFraudCheck,
                                          DocumentLiveness,
                                          DocumentVerification)
from models.edd_workflow import EDDWorkflow  # noqa: F401
from models.entity_directors import EntityDirector  # noqa: F401
from models.entity_profile import EntityProfile  # noqa: F401
from models.evidence import Evidence  # noqa: F401
from models.identity_document import IdentityDocument  # noqa: F401
# ---- New enterprise models (Phase 1 additions) ----
from models.individual_profile import IndividualProfile  # noqa: F401
from models.integration import Integration  # noqa: F401
from models.kyc import KYC  # noqa: F401
from models.notification import Notification  # noqa: F401
from models.ownership_relationships import OwnershipRelationship  # noqa: F401
from models.regulatory import (EvidencePack, EvidencePackItem,  # noqa: F401
                               RegulatoryReport, ReportAcknowledgement,
                               ReportSubmission)
from models.report import Report  # noqa: F401
from models.risk import RiskAssessment  # noqa: F401
from models.screening import ScreeningRecord  # noqa: F401
# ---- Core infrastructure ----
from models.tenant import Tenant  # noqa: F401
# ---- Existing models (Phase 1 — migrated verbatim from monolith) ----
from models.user import User  # noqa: F401
from models.payment import Payment  # noqa: F401
from models.sar import SAR  # noqa: F401
from core.enums import PaymentStatus  # noqa: F401

__all__ = [
    # Base
    "Base",
    # Infrastructure
    "Tenant",
    # Existing models
    "User",
    "Client",
    "Case",
    "Approval",
    "ReviewApproval",
    "ReviewIssue",
    "OverrideReason",
    "Report",
    "KYC",
    "Document",
    "KYCAuditLog",
    "AuditLog",
    "Notification",
    "Evidence",
    # New enterprise models
    "IndividualProfile",
    "EntityProfile",
    "BeneficialOwner",
    "EntityDirector",
    "OwnershipRelationship",
    "ScreeningRecord",
    "RiskAssessment",
    "Alert",
    "Integration",
    "EDDWorkflow",
    "CaseEvent",
    "CaseAssignment",
    "CaseSLA",
    "CaseEvidence",
    "CaseComment",
    "CaseSnapshot",
    "RegulatoryReport",
    "ReportSubmission",
    "ReportAcknowledgement",
    "EvidencePack",
    "EvidencePackItem",
    "DocumentExtraction",
    "DocumentVerification",
    "DocumentFraudCheck",
    "DocumentFace",
    "DocumentLiveness",
    "IdentityDocument",
    "Payment",
    "PaymentStatus",
    "SAR",
]

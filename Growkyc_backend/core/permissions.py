"""
core/permissions.py
===================
Single source of truth for the compliance RBAC matrix.

Encodes the client-provided role/permission matrix. Each role maps to a set of
permission keys. Scope qualifiers from the matrix (own / assigned / all /
summary / limited / partial / read-only / recommend / draft / review / approve /
view) are expressed as suffixes on the relevant permission keys so the exact
matrix is preserved and can drive both backend checks and frontend visibility.

The frontend fetches this same matrix via GET /auth/permissions so there is one
authority, not two drifting copies.
"""

from core.enums import UserRole

# ---------------------------------------------------------------------------
# Permission keys (grouped by function in the matrix)
# ---------------------------------------------------------------------------

# Onboarding / documents
P_ONBOARDING_START = "onboarding:start"
P_ONBOARDING_START_OWN = "onboarding:start:own"
P_DOCS_UPLOAD = "documents:upload"
P_DOCS_UPLOAD_OWN = "documents:upload:own"
P_DOCS_VIEW_OWN = "documents:view:own"
P_DOCS_VIEW_ASSIGNED = "documents:view:assigned"
P_DOCS_VIEW_ALL = "documents:view:all"

# Cases
P_CASE_CREATE = "case:create"
P_CASE_ASSIGN = "case:assign"
P_INFO_REQUEST = "info:request"

# Risk
P_RISK_VIEW_ASSIGNED = "risk:view:assigned"
P_RISK_VIEW_ALL = "risk:view:all"
P_RISK_VIEW_SUMMARY = "risk:view:summary"
P_RISK_EDIT = "risk:edit"

# Approvals (by risk level)
P_APPROVE_LOW = "approve:low"
P_APPROVE_MEDIUM = "approve:medium"
P_APPROVE_HIGH = "approve:high"
P_APPROVE_CRITICAL = "approve:critical"

# EDD
P_EDD_RECOMMEND = "edd:recommend"
P_EDD_APPROVE = "edd:approve"

# Investigations
P_INVESTIGATION_CREATE = "investigation:create"
P_INVESTIGATION_CLOSE = "investigation:close"

# SMR (Suspicious Matter Report)
P_SMR_SUBMIT = "smr:submit"
P_SMR_VIEW_LIMITED = "smr:view:limited"
P_SMR_VIEW_FULL = "smr:view:full"
P_SMR_VIEW_SUMMARY = "smr:view:summary"

# Audit
P_AUDIT_VIEW_ASSIGNED = "audit:view:assigned"
P_AUDIT_VIEW_PARTIAL = "audit:view:partial"
P_AUDIT_VIEW_FULL = "audit:view:full"
P_AUDIT_VIEW_READONLY = "audit:view:readonly"

# Policy
P_POLICY_DRAFT = "policy:draft"
P_POLICY_REVIEW = "policy:review"
P_POLICY_APPROVE = "policy:approve"
P_POLICY_VIEW = "policy:view"

# System administration (not in the compliance matrix; system role only)
P_USERS_MANAGE = "users:manage"

# ---------------------------------------------------------------------------
# Role -> permission set (faithful to the client's matrix)
# ---------------------------------------------------------------------------

_CLIENT = {
    P_ONBOARDING_START_OWN,
    P_DOCS_UPLOAD_OWN,
    P_DOCS_VIEW_OWN,
}

_AML_ANALYST = {
    P_ONBOARDING_START,
    P_CASE_CREATE,
    P_DOCS_UPLOAD,
    P_DOCS_VIEW_ASSIGNED,
    P_RISK_VIEW_ASSIGNED,
    P_INFO_REQUEST,
    P_INVESTIGATION_CREATE,
}

_COMPLIANCE_OFFICER = {
    P_ONBOARDING_START,
    P_CASE_CREATE,
    P_CASE_ASSIGN,
    P_DOCS_UPLOAD,
    P_DOCS_VIEW_ASSIGNED,
    P_RISK_VIEW_ALL,
    P_INFO_REQUEST,
    P_APPROVE_LOW,
    P_APPROVE_MEDIUM,
    P_INVESTIGATION_CREATE,
    P_POLICY_DRAFT,
    P_AUDIT_VIEW_ASSIGNED,
}

_SENIOR_COMPLIANCE_OFFICER = {
    P_ONBOARDING_START,
    P_CASE_CREATE,
    P_CASE_ASSIGN,
    P_DOCS_UPLOAD,
    P_DOCS_VIEW_ALL,
    P_RISK_VIEW_ALL,
    P_INFO_REQUEST,
    P_APPROVE_LOW,
    P_APPROVE_MEDIUM,
    P_APPROVE_HIGH,
    P_EDD_RECOMMEND,
    P_INVESTIGATION_CREATE,
    P_INVESTIGATION_CLOSE,
    P_SMR_VIEW_LIMITED,
    P_AUDIT_VIEW_PARTIAL,
    P_POLICY_REVIEW,
}

_HEAD_OF_COMPLIANCE = {
    P_ONBOARDING_START,
    P_CASE_CREATE,
    P_CASE_ASSIGN,
    P_DOCS_UPLOAD,
    P_DOCS_VIEW_ALL,
    P_RISK_VIEW_ALL,
    P_RISK_EDIT,
    P_INFO_REQUEST,
    P_APPROVE_LOW,
    P_APPROVE_MEDIUM,
    P_APPROVE_HIGH,
    P_APPROVE_CRITICAL,
    P_EDD_APPROVE,
    P_INVESTIGATION_CREATE,
    P_INVESTIGATION_CLOSE,
    P_SMR_SUBMIT,
    P_SMR_VIEW_FULL,
    P_AUDIT_VIEW_FULL,
    P_POLICY_APPROVE,
}

_MANAGING_PARTNER = {
    P_RISK_VIEW_SUMMARY,
    P_SMR_VIEW_SUMMARY,
    P_AUDIT_VIEW_READONLY,
    P_POLICY_VIEW,
}

# System administrator: full access to user/role provisioning plus everything
# the Head of Compliance can do (so an admin can operate the platform).
_ADMIN = {P_USERS_MANAGE} | _HEAD_OF_COMPLIANCE

# Map every UserRole value to its permission set. Legacy aliases reuse the
# canonical set (AGENT -> analyst-level, MLRO -> Head of Compliance).
ROLE_PERMISSIONS = {
    UserRole.USER.value: _CLIENT,
    UserRole.ANALYST.value: _AML_ANALYST,
    UserRole.AGENT.value: _AML_ANALYST,  # legacy reviewer
    UserRole.COMPLIANCE_OFFICER.value: _COMPLIANCE_OFFICER,
    UserRole.SENIOR_COMPLIANCE_OFFICER.value: _SENIOR_COMPLIANCE_OFFICER,
    UserRole.HEAD_OF_COMPLIANCE.value: _HEAD_OF_COMPLIANCE,
    UserRole.MLRO.value: _HEAD_OF_COMPLIANCE,  # legacy alias
    UserRole.PARTNER.value: _MANAGING_PARTNER,
    UserRole.ADMIN.value: _ADMIN,
}

# Human-friendly labels for the canonical roles (used by the UI).
ROLE_LABELS = {
    UserRole.USER.value: "Client",
    UserRole.ANALYST.value: "AML Analyst",
    UserRole.COMPLIANCE_OFFICER.value: "Compliance Officer",
    UserRole.SENIOR_COMPLIANCE_OFFICER.value: "Senior Compliance Officer",
    UserRole.HEAD_OF_COMPLIANCE.value: "Head of Compliance",
    UserRole.MLRO.value: "Head of Compliance",
    UserRole.PARTNER.value: "Managing Partner",
    UserRole.AGENT.value: "AML Analyst",
    UserRole.ADMIN.value: "System Administrator",
}

# The roles an admin may assign through the user-management UI (canonical set).
ASSIGNABLE_ROLES = [
    UserRole.USER.value,
    UserRole.ANALYST.value,
    UserRole.COMPLIANCE_OFFICER.value,
    UserRole.SENIOR_COMPLIANCE_OFFICER.value,
    UserRole.HEAD_OF_COMPLIANCE.value,
    UserRole.PARTNER.value,
    UserRole.ADMIN.value,
]


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _role_value(role) -> str:
    """Normalise a role (enum or string) to its string value."""
    return role.value if isinstance(role, UserRole) else str(role)


def permissions_for(role) -> set:
    """Return the permission set for a role (empty set if unknown)."""
    return set(ROLE_PERMISSIONS.get(_role_value(role), set()))


def has_permission(role, permission: str) -> bool:
    """True if the role grants the given permission key."""
    return permission in ROLE_PERMISSIONS.get(_role_value(role), set())


def label_for(role) -> str:
    """Human-friendly label for a role."""
    return ROLE_LABELS.get(_role_value(role), _role_value(role))

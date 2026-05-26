Below is the direct instruction pack for the Figma AI builder and dev team for both:

Exact API architecture behind the UI
Unified data model that normalises all provider responses into one schema

This assumes the live stack is now:

ASIC direct
Equifax
Illion
ComplyAdvantage
LexisNexis as optional advanced legal
Chainalysis as optional crypto risk

ASIC offers APIs for business names and companies register access, with no fee to access the APIs once approved as a digital service provider, and it also publishes weekly-updated register data through data.gov.au. Equifax Australia exposes API Connect for credit bureau, identity verification, and third-party product access. ComplyAdvantage offers API-based sanctions, PEP, and adverse-media screening with ongoing monitoring.

1. Master architecture

The platform should be designed as one orchestration layer sitting above provider adapters.

Core architecture blocks
A. Front-end layer

This is what Figma should show.

Main workspaces:

Home
Onboarding
Compliance
Clients & Entities
Deals
Intelligence
Automation
Enterprise
B. API gateway

One internal API surface for the front end.

Purpose:

hide vendor complexity
keep auth centralised
keep payloads consistent
make provider swaps easy later
C. Orchestration engine

This is the workflow brain.

It decides:

which provider to call
when to call it
whether to run optional checks
whether to stop, escalate, or continue
D. Provider adapter layer

One adapter per provider.

Adapters:

asic_adapter
equifax_adapter
illion_adapter
complyadvantage_adapter
lexisnexis_adapter
chainalysis_adapter
E. Normalisation layer

Every provider response is converted into one common internal schema.

F. Decision and monitoring layer

Consumes normalised results and drives:

risk scoring
decisioning
monitoring
QA
audit
G. Data layer

Stores:

people
entities
matters
screening events
match records
provider responses
risk scores
audit logs
2. Exact API architecture

The front end must never call providers directly.

Use this pattern:

Front end

Calls only:

/api/intake/...
/api/checks/...
/api/monitoring/...
/api/decisions/...
/api/admin/integrations/...
Internal services

Those routes call:

orchestration_service
screening_service
decision_service
monitoring_service
audit_service
Provider adapters

The screening service then calls:

asic_adapter
equifax_adapter
illion_adapter
complyadvantage_adapter
optional advanced adapters
3. Internal API map

Below is the internal API structure the UI should be designed around.

A. Integration management
GET /api/admin/integrations

Returns all providers with:

status
last sync
enabled modules
sandbox/live mode
monthly usage
error state
POST /api/admin/integrations/{provider}/test

Tests connectivity.

POST /api/admin/integrations/{provider}/configure

Saves credentials and module toggles.

GET /api/admin/integrations/{provider}/logs

Returns API logs and recent failures.

B. Subject and entity creation
POST /api/subjects/person

Creates or updates a person record.

POST /api/subjects/entity

Creates or updates an entity record.

POST /api/subjects/relationship

Creates:

director link
shareholder link
trustee link
guarantor link
beneficial owner link
C. Core screening endpoints
POST /api/checks/identity

Input:

person_id
matter_id
basic identity fields
consent flag

Orchestrates:

Equifax identity and fraud signals
internal ID bot logic
POST /api/checks/entity

Input:

entity_id
matter_id

Orchestrates:

ASIC direct lookup
Illion business lookup if enabled
POST /api/checks/aml

Input:

subject_type
subject_id
matter_id
screening_scope

Orchestrates:

ComplyAdvantage sanctions
ComplyAdvantage PEP
ComplyAdvantage adverse media
internal sanctions, PEP, and media workflows
POST /api/checks/business-risk

Input:

entity_id
linked_people[]
matter_id

Orchestrates:

Illion business credit
Illion insolvency
Illion court and director signals
POST /api/checks/advanced-legal

Input:

subject_id
matter_id
trigger_reason

Calls:

LexisNexis adapter only if enabled
POST /api/checks/crypto-risk

Input:

wallet_address
matter_id
trigger_reason

Calls:

Chainalysis adapter only if enabled
D. Composite orchestration endpoints

These are the main ones the UI should use.

POST /api/workflows/onboarding/run-core-checks

Runs:

identity
entity
AML
business risk

Returns one consolidated object for the UI.

POST /api/workflows/onboarding/run-enhanced-checks

Runs:

ownership
SOF
SOW
legal
POST /api/workflows/decision/generate

Runs:

risk aggregation
approval logic
conditions logic
POST /api/workflows/monitoring/run

Runs:

AML monitoring refresh
Equifax alerts pull
Illion alerts pull
trigger engine
4. Provider adapter responsibilities
A. ASIC adapter

Purpose:

entity existence
status
registration details
directors
basic structure

Returns internal objects:

EntityRegistryResult
OfficerRecord[]
RegistryStatus

ASIC provides register APIs for business names and companies, and also weekly register data via data.gov.au.

B. Equifax adapter

Purpose:

consumer credit
identity signals
fraud indicators

Returns internal objects:

IdentitySignalResult
ConsumerCreditResult
FraudSignalResult

Equifax API Connect is positioned for direct integration into credit bureau, identity verification, and related services.

C. Illion adapter

Purpose in your platform:

business credit
insolvency
court
director-risk intelligence

Returns internal objects:

BusinessCreditResult
InsolvencyResult
CourtSignalResult
DirectorRiskResult
D. ComplyAdvantage adapter

Purpose:

sanctions
PEP
adverse media
monitoring alerts

Returns internal objects:

SanctionsResult
PEPResult
AdverseMediaResult
AMLMonitoringAlert[]

ComplyAdvantage publicly positions its API around sanctions, PEPs including relatives and close associates, and automatic ongoing monitoring.

E. LexisNexis adapter

Optional.
Purpose:

advanced litigation
tribunal and enforcement depth
complex escalations
F. Chainalysis adapter

Optional.
Purpose:

wallet risk
crypto source-of-funds support
5. Figma screen behaviour for integrations

The builder should show provider-backed results as native system cards, not raw external products.

Every result card must include:
status
risk level
confidence
provider badge
checked at timestamp
raw-data drawer
evidence link
Card examples
Identity result card
Verified / Review / Failed
Source: Equifax
identity confidence score
fraud signals count
AML result card
Clear / Possible Match / Confirmed Match
Source: ComplyAdvantage
sanctions, PEP, media tabs
Entity result card
Active / Inactive / Mismatch
Source: ASIC
optional enhanced business risk from Illion
Business risk card
Low / Medium / High
Source: Illion
insolvency, court, director flags
Advanced legal card
Not run / Running / Completed
Source: LexisNexis
Crypto risk card
Not run / Running / Completed
Source: Chainalysis
6. Orchestration logic

The platform should follow this decision order.

Onboarding flow
Create person and entity records
Run ASIC entity lookup if entity exists
Run Equifax identity and fraud signals for person
Run ComplyAdvantage AML screen
Run Illion business risk for entity or director context
Run ownership mapping
Run SOF and SOW logic
Generate risk score and decision
Activate monitoring
Trigger logic
Trigger LexisNexis only when:
Illion returns court or enforcement flags
adverse media severity is high
deal value threshold exceeded
compliance decision status is escalated
Trigger Chainalysis only when:
wallet detected
crypto source of funds declared
crypto exchange transfer identified
7. Unified canonical data model

This is the key piece. Every provider must map into one shared schema.

A. Core subject objects
Person
{
  "person_id": "per_123",
  "legal_name": "Jane Smith",
  "aliases": ["Jane A Smith"],
  "date_of_birth": "1987-05-10",
  "nationalities": ["AU"],
  "residence_country": "AU",
  "occupation": "Director",
  "roles": ["client", "director", "beneficial_owner"],
  "linked_entity_ids": ["ent_456"],
  "wallet_id": "wal_001",
  "status": "active"
}
Entity
{
  "entity_id": "ent_456",
  "legal_name": "Example Pty Ltd",
  "trading_names": [],
  "entity_type": "company",
  "country": "AU",
  "abn": "12 345 678 901",
  "acn": "123456789",
  "status": "active",
  "wallet_id": "wal_002"
}
Relationship
{
  "relationship_id": "rel_001",
  "from_id": "per_123",
  "to_id": "ent_456",
  "relationship_type": "director",
  "ownership_percent": 50,
  "control_flag": true,
  "effective_date": "2026-03-21"
}
B. Provider-independent screening model
ScreeningEvent
{
  "screening_id": "scr_001",
  "matter_id": "mat_001",
  "subject_type": "person",
  "subject_id": "per_123",
  "screening_category": "aml",
  "provider": "complyadvantage",
  "started_at": "2026-03-21T10:00:00Z",
  "completed_at": "2026-03-21T10:00:04Z",
  "status": "completed",
  "bot_outcome": "possible_match",
  "analyst_outcome": null,
  "confidence_score": 0.82,
  "severity_score": 0.60,
  "review_required": true
}
MatchRecord
{
  "match_id": "match_001",
  "screening_id": "scr_001",
  "provider": "complyadvantage",
  "match_type": "pep",
  "matched_name": "Jane Smith",
  "matched_country": "AU",
  "identity_confidence": 0.76,
  "risk_confidence": 0.88,
  "source_url": null,
  "source_reference": "provider_record_abc",
  "raw_evidence_id": "evi_001"
}
ProviderResponseEnvelope
{
  "response_id": "resp_001",
  "provider": "equifax",
  "provider_request_id": "eqx_9876",
  "subject_id": "per_123",
  "received_at": "2026-03-21T10:00:03Z",
  "normalised": true,
  "raw_payload_json": {},
  "http_status": 200,
  "error_code": null
}
C. Normalised result objects by domain
IdentitySignalResult
{
  "subject_id": "per_123",
  "provider": "equifax",
  "identity_verified": true,
  "identity_confidence": 0.91,
  "address_match": true,
  "fraud_flags": ["thin_file"],
  "review_required": false
}
ConsumerCreditResult
{
  "subject_id": "per_123",
  "provider": "equifax",
  "credit_score": 712,
  "repayment_history_status": "good",
  "default_count": 0,
  "recent_enquiry_count": 2,
  "credit_risk_band": "low"
}
EntityRegistryResult
{
  "entity_id": "ent_456",
  "provider": "asic",
  "registry_status": "active",
  "registration_date": "2020-04-15",
  "entity_type": "proprietary_company",
  "officer_count": 2,
  "mismatch_flags": []
}
BusinessCreditResult
{
  "entity_id": "ent_456",
  "provider": "illion",
  "business_credit_score": 640,
  "credit_risk_band": "medium",
  "payment_default_count": 1,
  "enquiry_count": 4
}
InsolvencyResult
{
  "subject_id": "ent_456",
  "provider": "illion",
  "insolvency_flag": false,
  "insolvency_type": null,
  "event_count": 0,
  "review_required": false
}
SanctionsResult
{
  "subject_id": "per_123",
  "provider": "complyadvantage",
  "match_status": "clear",
  "match_count": 0,
  "review_required": false,
  "hard_stop": false
}
PEPResult
{
  "subject_id": "per_123",
  "provider": "complyadvantage",
  "pep_status": "foreign_pep",
  "pep_role_type": "minister",
  "jurisdiction": "CountryX",
  "family_or_associate_flag": false,
  "review_required": true
}
AdverseMediaResult
{
  "subject_id": "per_123",
  "provider": "complyadvantage",
  "media_status": "confirmed_adverse_media",
  "severity": "high",
  "theme_tags": ["fraud", "regulatory_action"],
  "article_count": 5,
  "review_required": true
}
CourtSignalResult
{
  "subject_id": "ent_456",
  "provider": "illion",
  "court_flag": true,
  "case_count": 2,
  "latest_case_date": "2025-11-10",
  "review_required": true
}
CryptoRiskResult
{
  "wallet_address": "0x123",
  "provider": "chainalysis",
  "wallet_risk_band": "high",
  "exposure_tags": ["mixer", "sanctions_exposure"],
  "review_required": true
}
8. Risk aggregation model

All normalised results should feed one central object.

UnifiedRiskProfile
{
  "matter_id": "mat_001",
  "subject_ids": ["per_123", "ent_456"],
  "identity_risk_score": 12,
  "aml_risk_score": 35,
  "business_risk_score": 22,
  "financial_risk_score": 18,
  "legal_risk_score": 20,
  "ownership_risk_score": 25,
  "overall_risk_score": 68,
  "risk_band": "high",
  "hard_stop_flags": ["none"],
  "review_flags": ["foreign_pep", "court_signal"],
  "recommended_decision": "escalate"
}
Hard-stop rules
sanctions confirmed = hard stop
entity inactive where onboarding requires active entity = hard stop
confirmed prohibited wallet exposure where crypto permitted rules require block = hard stop
Escalation rules
foreign PEP = escalate
severe adverse media = escalate
insolvency + weak credit = escalate
unclear ownership = escalate
9. Monitoring architecture
Monitoring sources
ComplyAdvantage for AML monitoring
Equifax for credit and identity alerts where enabled
Illion for insolvency and business alert refresh
internal trigger engine for:
ownership changes
expired documents
deal stage changes
wallet staleness
Internal monitoring endpoints
POST /api/monitoring/register

Registers a subject for provider-based monitoring.

GET /api/monitoring/alerts

Returns all new alerts.

POST /api/monitoring/alerts/{id}/acknowledge

Acknowledges or escalates alert.

POST /api/monitoring/recheck

Runs targeted re-check on selected domain.

10. Error handling model

Every provider adapter should return a standard error envelope.

{
  "provider": "equifax",
  "status": "failed",
  "error_type": "timeout",
  "retryable": true,
  "message": "Provider unavailable",
  "fallback_action": "manual_review"
}

Figma must show four states for all external checks:

success
partial result
failed but retryable
failed, manual review required
11. Audit model

Every provider interaction should write two records:

ProviderResponseEnvelope
AuditEvent
AuditEvent
{
  "audit_id": "aud_001",
  "object_type": "screening_event",
  "object_id": "scr_001",
  "action": "provider_response_received",
  "actor": "system",
  "timestamp": "2026-03-21T10:00:04Z",
  "reason": "AML screen completed"
}

The UI must show:

provider used
time checked
result status
analyst decision
override reason if any
12. Figma page list to add now
Enterprise > Integrations
Integrations Hub
Provider Config
Connection Test
Usage & Health Logs
Shared components
Provider badge
Check status card
Result drawer
Raw payload drawer
Cost badge
Monitoring badge
API health chip
Embedded panels
Risk Intelligence Panel
Data Source & Evidence tab
Monitoring Sources tab
Advanced Check trigger panel
13. Final instruction to builder

Design the platform so that:

the user sees one result, not six vendor systems
every result has a visible provider source
every provider maps to one clean schema
every decision uses the same risk model
optional providers are trigger-based only
the UI can swap vendors later without redesign
14. Final instruction to dev team

Build this as:

one API gateway
one orchestration layer
one adapter per provider
one canonical schema
one risk profile object
one monitoring framework
one audit trail

That gives you a platform where:

providers can change
the UI stays stable
decisioning stays consistent
compliance remains defensibl
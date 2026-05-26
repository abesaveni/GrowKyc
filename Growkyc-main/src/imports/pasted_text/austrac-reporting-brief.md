Use this as the direct build brief for the Figma AI builder.

FIGMA BUILD INSTRUCTION
AUSTRAC REPORTING MODULE
Objective

Design an AUSTRAC Reporting Module inside the platform that handles:

suspicious matter assessment
SMR draft creation
threshold and reportable event capture
compliance officer review
submission status tracking
evidence and audit trail
regulator-ready record keeping

This module is not a screening tool.

It sits after your screening, decision, and monitoring engines and turns risk findings into formal regulatory reporting workflows.

1. MODULE POSITION IN THE PLATFORM
Left nav location

Compliance → AUSTRAC Reporting

Related modules

This module must connect to:

PEP Screening Bot
Adverse Media Screening Bot
Sanctions Screening Bot
Identity Verification Bot
KYB Bot
Beneficial Ownership Bot
Source of Funds Bot
Source of Wealth Bot
Court and Litigation Bot
Compliance Decision Bot
Monitoring Trigger Bot
Compliance File QA Bot
Core purpose

The AUSTRAC module must:

receive escalated alerts from other bots
convert those alerts into reportable cases
guide internal review
generate formal reporting packs
track whether a matter was reported, not reported, or closed
2. MODULE DESIGN PRINCIPLES

The module must feel:

serious
evidence-first
compliance-led
highly traceable
easy to review under pressure
Visual tone
light neutral background
dark text
high-density data layouts
structured panels
timelines
tables
status chips
evidence drawers
Do not design it as
a chat tool
a generic form
a news feed
a simple alert inbox
an unstructured case note system
3. CORE WORKFLOWS TO DESIGN

Build for these workflows:

Workflow 1 - New suspicious matter detected
alert triggered by another bot
AUSTRAC case created
case triaged
evidence reviewed
internal suspicion assessment completed
draft report prepared
compliance officer decision made
case marked:
submitted
not submitted
further monitoring
full audit trail stored
Workflow 2 - Existing client becomes suspicious during monitoring
monitoring event triggers alert
prior history pulled into case
analyst compares old vs new findings
case escalated
report prepared
review and outcome recorded
Workflow 3 - Internal manual referral
staff member raises concern manually
case created without automated trigger
facts and evidence entered
decision path same as normal workflow
4. SCREENS TO BUILD

Build this as 9 screens plus shared components.

SCREEN 1. AUSTRAC REPORTING CONTROL CENTRE
Purpose

Main dashboard for all AUSTRAC-related cases and reporting actions.

Top KPI cards
Open reportable matter reviews
Draft reports pending
Escalated cases
Submitted reports
Not reported cases
Overdue compliance reviews
Monitoring-linked alerts
QA issues on report files
Main tables
Table A - Active reportable matters

Columns:

Case ID
Subject
Subject type
Trigger source
Risk band
Assigned reviewer
Status
Created date
SLA timer
Table B - Draft reports awaiting decision

Columns:

Case ID
Subject
Draft type
Prepared by
Awaiting
Last updated
Table C - Recent submissions and closures

Columns:

Case ID
Subject
Outcome
Decision owner
Closed date
Filters
Case status
Trigger type
Risk level
Subject type
Assigned reviewer
Date range
Matter type
Client / entity / deal
Actions
Open case
Create manual case
Review draft
Export case pack
View audit log
SCREEN 2. REPORTABLE MATTER TRIAGE SCREEN
Purpose

First review screen after an alert or manual referral.

Layout

Three-column layout.

Left panel - Case summary
Case ID
Subject name
Subject type
Linked client or matter
Trigger source
Trigger date
Current risk band
Current service status
Existing monitoring status
Centre panel - Trigger context

Show what caused the case:

sanctions hit
PEP change
severe adverse media
unexplained source of funds
suspicious transaction pattern
false document concern
beneficial ownership inconsistency
court or insolvency signal
manual staff concern

Each trigger card should show:

source module
timestamp
severity
confidence
short explanation
Right panel - Triage decision

Options:

continue review
request more information
escalate to compliance manager
hold service activity
close as non-reportable

Fields:

preliminary suspicion flag
urgency level
service hold required yes/no
notes
assigned owner
SCREEN 3. CASE INVESTIGATION WORKBENCH
Purpose

Main analyst screen for reviewing whether the matter should be reported.

Layout

Evidence-first design.

Left panel - Timeline

Chronological event history:

onboarding completed
identity verified
AML screenings
risk rating changes
monitoring alerts
prior escalations
document uploads
prior report history
Centre panel - Investigation tabs

Tabs:

Facts
Triggers
Evidence
Screening history
Related subjects
Financial context
Service activity
Prior decisions
Right panel - Investigator assessment

Fields:

suspicion category
suspected conduct type
internal risk severity
linked transaction or matter
supporting rationale
missing evidence checklist
recommendation:
report
do not report
monitor
senior review required
Bottom drawer - Evidence viewer

Show:

article snapshots
sanctions / PEP matches
identity issues
ownership graph excerpts
source of funds documents
internal notes
uploaded files
provider result summaries
SCREEN 4. REPORT DRAFT BUILDER
Purpose

Generate structured AUSTRAC report drafts from case data.

Layout

Two-panel drafting screen.

Left panel - Structured source data

Sections:

Subject details
Entity details
Related parties
Trigger summary
Suspicious facts summary
Transactions or service activity
Geographic links
Supporting evidence
Linked prior events
Right panel - Draft report

Structured editable draft with sections:

report type
reporting entity details
subject details
related entities
summary of suspicion
chronology of relevant events
explanation of why the conduct is suspicious
supporting risk indicators
attachments and evidence references
internal decision notes
Draft tools
generate draft
regenerate section
insert timeline
insert evidence references
insert related party data
save draft
submit for review
export PDF
export XML placeholder
Draft types
suspicious matter report draft
internal escalation memo
partner summary
regulator-ready case pack
SCREEN 5. COMPLIANCE MANAGER DECISION SCREEN
Purpose

Final internal decision point before outcome is recorded.

Sections
Section A - Case summary
subject
trigger reason
summary of findings
current risk rating
service status
Section B - Recommendation summary
analyst recommendation
confidence
key evidence
missing evidence if any
Section C - Final decision panel

Decision options:

submit report
do not submit report
request further investigation
keep under enhanced monitoring
apply service restrictions
disengage or block service

Required fields:

final decision
reason
reviewer name
approval date
escalation notes
hold or restriction action
Section D - Submission status
draft complete
approved for submission
submitted
acknowledged
closed
SCREEN 6. SUBMISSION TRACKING SCREEN
Purpose

Track reporting actions and regulator interaction state.

Table columns
Case ID
Report type
Subject
Decision date
Submission method
Submission status
Submitted by
Acknowledgement status
Last updated
Statuses
Draft only
Approved for submission
Submitted
Acknowledged
Submission failed
Closed
Not submitted
Detail drawer
submission reference
submitted timestamp
submission channel
attached files
acknowledgment notes
retry history if failed
SCREEN 7. INTERNAL REFERRAL SCREEN
Purpose

Allow staff to raise suspicious concerns manually.

Fields
referred subject
related client or matter
concern category
free-text concern summary
related documents
urgency
immediate service hold requested yes/no
Concern categories
suspicious source of funds
suspicious client behaviour
false or altered documents
unexplained ownership
unusual transaction activity
media or legal concerns
sanctions / PEP concern
other
Submission action
create AUSTRAC case
notify compliance team
attach to existing case if duplicate
SCREEN 8. REPORTING RULES AND TRIGGERS SCREEN
Purpose

Show and manage the logic that creates AUSTRAC cases.

Rule groups
AML trigger rules
transaction or funding rules
document fraud rules
legal risk triggers
ownership inconsistency triggers
monitoring escalation rules
manual referral rules
Example rules
confirmed sanctions hit → immediate escalation and hold
unexplained source of funds above threshold → create reportable matter review
severe adverse media + financial crime theme → escalate
beneficial ownership cannot be established → high-risk review
false document confidence above threshold → escalation
repeated high-risk monitoring alerts within X days → case creation
UI controls
enable / disable rule
set severity threshold
set auto-case creation
set mandatory manager review
set service hold action
SCREEN 9. AUSTRAC AUDIT AND EVIDENCE PACK SCREEN
Purpose

Produce full internal and regulator-ready audit packs.

Reports to support
active AUSTRAC case register
submitted report register
not-submitted decision register
overdue review register
reporting QA exceptions
case-level evidence pack
board or partner oversight summary
Case-level pack must include
case metadata
trigger events
all screening results
evidence snapshots
analyst notes
decision notes
timestamps
who reviewed
what service actions were taken
submission status
closure notes
5. SHARED COMPONENTS TO BUILD

Create reusable components for:

Case status chip
Submission status chip
Trigger card
Evidence tile
Source module badge
Audit event row
Timeline event row
Reviewer decision drawer
Draft builder section card
Service hold banner
Escalation banner
Missing evidence warning
Compliance owner card
Acknowledgement card
6. REQUIRED STATUS FRAMEWORK

Use these statuses across the module.

Case statuses
New
In triage
Under investigation
Draft in progress
Awaiting manager decision
Approved for submission
Submitted
Acknowledged
Monitoring only
Not reportable
Closed
Service control statuses
No restriction
Review required
Service hold active
Limited services only
Disengagement recommended
QA statuses
Complete
Missing evidence
Missing decision note
Missing reviewer
Submission record incomplete
7. REQUIRED DATA FIELDS

The builder must show these fields in the data model view.

AUSTRAC case
case_id
matter_id
subject_ids[]
entity_ids[]
trigger_source
trigger_reason
created_at
created_by
assigned_to
urgency_level
preliminary_suspicion_flag
service_hold_flag
status
Investigation record
investigation_id
case_id
suspicion_category
conduct_theme_tags[]
fact_summary
chronology_summary
supporting_evidence_ids[]
missing_evidence_flags[]
analyst_recommendation
analyst_notes
updated_at
Draft report
draft_id
case_id
draft_type
report_payload
version
prepared_by
reviewed_by
approval_status
submitted_at
submission_reference
Submission record
submission_id
case_id
submission_method
submission_status
submitted_by
submitted_at
acknowledgement_status
acknowledgement_reference
retry_count
Service action
action_id
case_id
action_type
action_status
action_reason
owner
effective_at
8. HOW IT CONNECTS TO THE REST OF THE PLATFORM
Trigger sources to display

The module must visually show where the case came from:

Sanctions Bot
PEP Bot
Adverse Media Bot
Identity Bot
KYB Bot
Ownership Bot
Source of Funds Bot
Source of Wealth Bot
Court and Litigation Bot
Monitoring Trigger Bot
Manual referral
Related module links

Every AUSTRAC case screen should have quick links to:

subject profile
entity profile
ownership graph
adverse media history
monitoring history
decision history
documents
audit log
9. KEY USER ROLES

Design for these roles.

Intake officer
can raise referral
can view own submitted concerns
cannot decide report outcome
Compliance analyst
triages case
investigates
drafts report
recommends outcome
Compliance manager / MLRO
final decision maker
approves report
applies service restrictions
closes case
Partner / director
limited read access
sees high-level summary
sees service impact
cannot edit submission details unless authorised
Admin
manages rules
manages templates
manages module settings
manages permissions
10. REQUIRED USER JOURNEYS

The Figma prototype must show these complete journeys.

Journey 1 - automated suspicious matter review
adverse media bot finds severe financial crime theme
AUSTRAC case auto-created
analyst investigates
draft report generated
compliance manager approves
case marked submitted
audit pack available
Journey 2 - manual internal referral
staff member spots suspicious source of funds
internal referral lodged
case investigated
further evidence requested
final decision recorded as monitor only
case remains open under enhanced monitoring
Journey 3 - service hold triggered
sanctions-related concern escalates
service hold applied
decision screen reflects hold
case reviewed and resolved
service status updated
11. DESIGN RULES

The builder must follow these rules:

evidence must always be visible
case status must always be obvious
service restrictions must be prominent
no important decision should be hidden in a modal
reports must be editable before finalisation
every outcome must show who approved it
audit trail must be visible on every case
12. WHAT NOT TO BUILD

Do not build this as:

a plain upload form
a text-only note system
a chat interface
a generic task list with no case structure
a black-box AI reporting screen
a submission tool with no investigation workflow
13. FINAL INSTRUCTION TO THE FIGMA BUILDER

Build a module called:

AUSTRAC Reporting

Include these screens:

Control Centre
Triage Screen
Investigation Workbench
Report Draft Builder
Manager Decision Screen
Submission Tracking
Internal Referral
Rules and Triggers
Audit and Evidence Pack

The prototype must prove three things:

alerts from your bots can become formal reportable cases
compliance can investigate and decide cleanly
every outcome is fully traceable and audit-ready

The next useful build after this is the data model and workflow state diagram for the AUSTRAC module.
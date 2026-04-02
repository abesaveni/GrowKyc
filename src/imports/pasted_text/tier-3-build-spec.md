er 3 is where the platform stops being a tool and becomes a decision engine + live compliance system.

This is your real moat.

TIER 3 - FULL BUILD SPEC (FIGMA)

Modules:

Compliance Decision Bot
Monitoring Trigger Bot
Compliance File QA Bot
1. COMPLIANCE DECISION BOT
Objective

Take outputs from all prior bots and produce:

final risk rating
onboarding decision
required controls
explanation

This is the brain of the system.

What it must ingest

Inputs from:

Identity
Sanctions
PEP
Adverse media
KYB
Ownership
SOF
SOW
Legal
Output classifications
Approved
Approved with conditions
Enhanced due diligence required
Escalated
Rejected
Screen 1. Decision Control Centre
KPI Cards
decisions pending
approved
conditional approvals
escalations
rejected
overdue decisions
Main Table

Columns:

Client / Entity
Risk score
Key flags
Decision status
Assigned reviewer
SLA timer
Screen 2. Decision Engine View
Layout

Split into 3 columns.

Left - Input Summary

Sections:

Identity status
Sanctions result
PEP status
Adverse media result
KYB status
Ownership status
SOF status
SOW status
Legal status

Each shows:

status
risk weight
issues
Centre - Risk Model

Show:

Risk Score Breakdown

identity risk
jurisdiction risk
entity risk
ownership risk
financial risk
behavioural risk

Total score displayed clearly.

Right - AI Recommendation

Display:

recommended decision
confidence level
key reasons
triggered rules
Screen 3. Decision Workbench
Decision Panel

Options:

approve
approve with conditions
escalate
reject
Conditions Panel

Selectable:

enhanced monitoring
source of funds required
source of wealth required
senior approval
transaction limits
restricted services
Notes Panel
reasoning
justification
override explanation
Screen 4. Decision Profile

Fields:

final decision
risk rating
conditions applied
reviewer
timestamps

Tabs:

inputs
history
audit log
Core Rules
sanctions hit = auto reject
foreign PEP = minimum high risk
missing UBO = cannot approve
high adverse media = escalate
system must always explain decision
2. MONITORING TRIGGER BOT
Objective

Make the system live, not static.

Automatically trigger reviews when something changes.

What it must monitor
PEP status changes
new adverse media
sanctions updates
ownership changes
director changes
country exposure changes
document expiry
inactivity or behaviour changes
Output
no change
change detected
review triggered
escalation triggered
Screen 1. Monitoring Control Centre
KPI Cards
active monitoring subjects
changes detected today
triggered reviews
escalations
overdue reviews
Tables

Live Alerts

subject
change type
severity
triggered action
Screen 2. Trigger Rules Engine
Rule Categories
identity triggers
sanctions triggers
PEP triggers
adverse media triggers
ownership triggers
document triggers
Example Rules
new adverse media → trigger review
PEP status change → escalate
new director → rerun KYB + ownership
document expiry → request update
Screen 3. Event Timeline

Shows:

chronological events
what changed
what action triggered
who reviewed
Screen 4. Monitoring Profile

Fields:

subject
monitoring level
frequency
triggers enabled
last result
next review
Core Rules
high-risk clients = higher frequency
foreign PEP = enhanced monitoring
unresolved issues = daily monitoring
every trigger must log action
3. COMPLIANCE FILE QA BOT
Objective

Ensure every file is:

complete
compliant
audit-ready
What it must check
missing KYC checks
missing documents
missing approvals
missing audit logs
expired documents
inconsistent data
incomplete workflows
Output classifications
Complete
Minor issues
Incomplete
Non-compliant
Audit risk
Screen 1. QA Control Centre
KPI Cards
files reviewed
compliant
incomplete
high-risk files
audit failures
Tables

File Review Queue

client
status
issues count
severity
reviewer
Screen 2. QA Checklist View

Checklist sections:

identity complete
sanctions checked
PEP checked
adverse media checked
KYB complete
ownership complete
SOF complete
SOW complete
decision recorded
audit log present

Each shows:

pass / fail
notes
Screen 3. Issue Detection Panel

Flags:

missing documents
expired ID
no reviewer
no search evidence
inconsistent data
missing escalation
Screen 4. QA Workbench
Left
checklist
Centre
file details
Right

Decision:

mark complete
request fix
escalate
Screen 5. Audit Report

Export:

full checklist
issues
reviewer
timestamps
Core Rules
missing mandatory check = fail
missing audit trail = fail
expired ID = fail
unresolved escalation = fail
FINAL TIER 3 SYSTEM FLOW

Figma must show:

All Tier 1 and 2 checks completed
Decision Bot produces outcome
Monitoring Bot activates
New event detected
System triggers review
QA Bot validates file
Audit-ready output generated
FINAL INSTRUCTION TO FIGMA BUILDER

Build 3 modules:

Compliance Decision Bot
Monitoring Trigger Bot
Compliance File QA Bot

Each must include:

dashboard
rules engine
workbench
profile
audit log
Required journeys
Journey 1 - Clean approval
all checks pass
decision = approve
monitoring active
Journey 2 - Live risk change
client onboarded
new adverse media appears
monitoring triggers
decision updated
escalation occurs
Journey 3 - Audit failure
missing document
QA detects issue
file flagged
cannot close job
What Tier 3 achieves
automated decisions
live compliance monitoring
audit-ready system
reduced human error
strong regulatory defensibility
One-line summary

Tier 1 = checks
Tier 2 = understanding
Tier 3 = decisions + automation
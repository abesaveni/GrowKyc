FIGMA BUILD INSTRUCTION
CASE MANAGEMENT (RISK & COMPLIANCE)
Objective

Design a system where users can:

see all active risk cases instantly
prioritise what matters
open any case and understand it in seconds
manage investigations, decisions, and actions
link everything back to clients
move fast under pressure
1. MODULE NAME

Cases

2. MAIN SCREEN
CASE CONTROL CENTRE
Layout
Top: KPI strip
Middle: Case table
Right: Filters + quick actions
KPI STRIP

Show:

Open cases
High-risk cases
Escalated cases
Awaiting decision
Overdue cases
Recently closed

Each is clickable → filters table

CASE TABLE (CORE)

Columns:

Case ID
Client / Entity
Case Type
Trigger Source
Risk Level
Status
Assigned To
Last Updated
SLA Timer
Case Types
AML alert
PEP escalation
Adverse media
Sanctions
Ownership issue
Source of funds
Fraud / identity
Legal / court
Manual referral
Statuses
New
Triage
Investigating
Escalated
Awaiting decision
Monitoring
Closed
Row behaviour

Click row → opens Case Workbench (drawer or full page)

3. CASE WORKBENCH (MAIN SCREEN)

This is where users spend most time.

Layout
Left: Timeline
Centre: Investigation
Right: Actions + Decision
LEFT PANEL
TIMELINE

Chronological view:

Case created
Trigger event
Screening results
Documents added
Notes added
Decisions made
Monitoring alerts

Each item shows:

time
user/system
action
CENTRE PANEL
INVESTIGATION

Tabs:

Summary
Triggers
Evidence
Screening
Financial
Ownership
Related Parties
Notes
Summary tab
Case overview
Key risks
Current status
Linked client
Triggers tab

Show exactly why case exists:

source module
reason
severity
confidence
Evidence tab

Show:

adverse media articles
sanctions matches
documents
identity issues
ownership gaps

Each item clickable → full detail

Screening tab

Show:

AML results
Equifax results
Illion results
re-run buttons
Financial tab
credit score
insolvency
unusual behaviour
Ownership tab
ownership graph
missing BO warnings
Notes tab
analyst notes
internal comments
tagged users
RIGHT PANEL
ACTIONS + DECISION
Section 1 - Case Status

Dropdown:

Investigating
Escalated
Monitoring
Closed
Section 2 - Required Actions

Checklist:

verify identity
confirm ownership
request documents
escalate
apply service hold
Section 3 - Run Checks

Buttons:

Run AML
Run Identity
Run Credit
Run Business Risk
Run Ownership
Run SOF / SOW
Section 4 - Advanced Checks
Run Legal (LexisNexis)
Run Crypto (Chainalysis)
Section 5 - Decision Panel

Options:

Approve
Approve with conditions
Escalate
Reject
Send to AUSTRAC
Monitor

Fields:

decision reason
risk summary
conditions
Section 6 - Service Controls
No restriction
Review required
Service hold
Limited service
Disengage
4. QUICK CASE VIEW (DRAWER)

When clicking from table:

Show:

key summary
risk level
trigger
quick actions

Buttons:

open full case
assign
escalate
close
5. CASE CREATION
Manual case

Fields:

client
case type
reason
urgency
attachments
Auto case

Triggered from:

AML
monitoring
identity
financial
6. LINKING

Every case must link to:

client profile
entity
documents
KYC dashboard
AUSTRAC module
7. FILTERS

Right side panel:

risk level
case type
status
assigned user
client
date
trigger source
8. SLA + PRIORITY

Each case shows:

priority (low, medium, high, critical)
SLA timer
overdue indicator
9. VISUAL DESIGN
Use:
strong colour coding
red = critical
amber = warning
green = clear
Icons:
alert
warning
check
lock
document
10. KEY UX RULES
everything visible in one screen
no deep navigation
max 2 clicks to any data
timeline always visible
actions always visible
decisions always visible
11. WHAT MAKES THIS POWERFUL

User can:

open a case
understand it instantly
see all evidence
run checks
make decision
apply controls

All in one place.

12. CONNECTION TO OTHER MODULES

Cases must integrate with:

KYC dashboard
Monitoring
AUSTRAC
Documents
Decision engine
FINAL INSTRUCTION

Build a case management system that feels like a trading desk for risk, where:

nothing is hidden
everything is actionable
decisions are fast
evidence is clear
ONE-LINE GOAL

User should resolve a high-risk case in minutes without leaving the screen.
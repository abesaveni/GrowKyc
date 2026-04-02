FIGMA BUILD INSTRUCTION
CLIENT KYC MASTER DASHBOARD
Objective

Design a single client screen where the user can:

see full client risk instantly
understand status in under 5 seconds
drill into any data in 1 click
run any check or bot instantly
view all history, documents, and decisions
manage compliance without switching screens
1. PAGE NAME

Client Profile - KYC Dashboard

2. OVERALL LAYOUT
Structure

Use a 3-zone layout

Top: Summary strip
Middle: Core panels
Right: Action + risk panel
3. TOP SUMMARY STRIP (CRITICAL)

This must be visible at all times.

Content
Left side
Client name (large, bold)
Entity type (company, trust, individual)
Status badge:
Active
Pending
Under Review
Restricted
Blocked
Centre

Risk Snapshot Bar

Show 5 key scores:

Overall Risk (0–100)
AML Risk
Financial Risk
Business Risk
Ownership Risk

Use:

colour bands (green / amber / red)
numeric score
label
Right side

Quick status indicators:

Identity: Verified / Review
AML: Clear / Matches
Entity: Active / Issue
Monitoring: Active / Overdue
Last review date
Next review date
Action buttons (top right)

Primary:

Run Full Check
Run AML
Run Credit
Run Business Risk

Secondary:

Add Note
Upload Document
Create AUSTRAC Case
4. LEFT SIDEBAR (STICKY NAV)
Tabs
Overview
Identity
AML
Entity
Ownership
Financial
Legal
Documents
Monitoring
Decisions
AUSTRAC
Audit Log
5. MAIN DASHBOARD (OVERVIEW TAB)

This is the default screen.

SECTION 1 - CLIENT SNAPSHOT CARD
Show:
Full legal name
ABN / ACN
DOB (if individual)
Country
Industry
Service type
Client group
SECTION 2 - KEY ALERTS (HIGH VISIBILITY)

Show only critical items:

sanctions match
PEP detected
adverse media high severity
insolvency flag
identity issue
missing ownership

Each alert:

icon
short description
severity colour
click → opens detail
SECTION 3 - KYC STATUS GRID

4 large cards:

Identity
status
confidence %
fraud flags
last checked
button: “Re-run”
AML (ComplyAdvantage)
sanctions result
PEP status
media result
last checked
button: “Re-run AML”
Entity (ASIC)
status
registration
directors
last checked
button: “Refresh”
Business Risk (Illion)
credit score
insolvency
court signals
director risk
button: “Run Business Check”
6. RIGHT PANEL (ALWAYS VISIBLE)
“Risk Intelligence Panel”
Section A - Overall decision
Approved
Conditional
Escalated
Rejected
Section B - Key drivers

List:

foreign PEP
adverse media
weak credit
ownership unclear
Section C - Required actions
review ownership
request documents
escalate to compliance
Section D - Run checks

Buttons:

Run Full Check
Run AML
Run Identity
Run Credit
Run Business Risk
Run Ownership Analysis
Run SOF / SOW
Section E - Advanced checks
Run Legal Check (LexisNexis)
Run Crypto Check (Chainalysis)

(only visible if enabled)

7. TAB BREAKDOWN (DETAILED SCREENS)
TAB: Identity

Show:

ID documents
verification results
Equifax signals
fraud flags

Buttons:

re-run identity
upload new ID
TAB: AML

Show:

Sections:
Sanctions
PEP
Adverse Media

Each shows:

result
matches
confidence
source (ComplyAdvantage)

Include:

expandable match details
evidence links
TAB: Entity

Show:

ASIC data
structure
directors
status
TAB: Ownership

CRITICAL SCREEN

Show:

ownership graph
% ownership
beneficial owners
missing ownership warnings

Buttons:

recalculate
add relationship
TAB: Financial

Show:

Equifax
credit score
repayment history
Illion
business credit
defaults
TAB: Legal

Show:

court signals (Illion)
optional LexisNexis results
TAB: Documents

Show:

uploaded files
extracted data
expiry dates
TAB: Monitoring

Show:

AML monitoring status
credit alerts
insolvency alerts
TAB: Decisions

Show:

past decisions
conditions applied
reviewer
timestamps
TAB: AUSTRAC

Show:

linked cases
status
submissions
TAB: Audit Log

Show:

all actions
who did what
when
8. INTERACTION DESIGN
Clicking any card

→ opens side drawer with:

full data
raw data
evidence
Hover states

Show:

last checked
provider
confidence
Loading states
skeleton cards
progress bars
9. BOT EXECUTION UX
When user clicks “Run Check”

Show:

loading spinner
“Running Equifax check…”
“Running AML screening…”

Then update card live.

Show:
timestamp
provider
result
10. DESIGN STYLE
Must feel:
like a trading dashboard
high density but clean
minimal wasted space
fast scanning
Use:
cards
grids
badges
colour coding
icons
11. KEY UX RULES
no page reloads
everything inline or drawer-based
max 2 clicks to any data
risk always visible
actions always visible
source always visible
12. WHAT MAKES THIS “AWESOME”

This screen must:

answer “is this client safe?” instantly
show exactly why
allow action immediately
never force navigation away
combine all providers into one view
feel faster than any competitor
FINAL INSTRUCTION

Build a single powerful client dashboard where:

all data is visible
all checks are runnable
all risks are clear
all decisions are supported
all evidence is accessible
ONE-LINE GOAL

The user should be able to approve, escalate, or reject a client without leaving this screen.
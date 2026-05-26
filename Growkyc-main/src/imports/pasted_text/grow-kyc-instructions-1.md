FIGMA BUILD INSTRUCTION
GROW KYC MODULE - CLIENT ONBOARDING, PROCESSING, ASSOCIATE EXPANSION, AND CLIENT WORKBENCH
Objective

Design the Grow KYC Module so that:

a client can complete onboarding simply
payment triggers automated processing
external integrations run automatically
new entities and associates are discovered recursively
bots run across the full client network
users can open the client and see everything instantly
users can manage risk, documents, cases, and decisions from one place

This must feel like:

premium onboarding for the client
a high-control command centre for staff
one connected system, not separate tools
1. PLATFORM AREAS TO DESIGN

Build these connected experiences inside the KYC Grow Module:

Client Onboarding Flow
Processing and Live Check Progress Screen
Associate and Entity Expansion Engine UI
Client KYC Master Dashboard
Case Management View
Documents and All Documents View
Risk Intelligence Panel
Bot Run and Check Actions
Monitoring and Ongoing Review View

These must all work together.

2. CLIENT ONBOARDING FLOW
Flow name

Individual KYC Verification

Step sequence

Keep and improve this exact flow:

Personal Details
Upload ID
Consent
Payment
Processing
Results
Layout rules

Use:

top progress bar
centre content area
bottom navigation buttons
save and resume
mobile-first design
minimal friction
Step 1 - Personal Details
Title

Complete your identity verification

Subtitle

We use this to verify who you are and discover any linked entities or associated parties.

Fields
First name
Middle name
Last name
Date of birth
Email
Mobile
Residential address
Country
Postal address if different
Occupation
Citizenship
Are you acting for an entity? yes/no
UX rules
live field validation
address autocomplete
trust indicators
clear helper text
no clutter
CTA

Continue to Upload ID

Step 2 - Upload ID
Title

Upload your ID

Content
passport
driver licence
national ID
upload file or scan
optional selfie / liveness if enabled
UX rules

Show:

image examples
clear upload state
retry flow
success state
CTA

Continue

Step 3 - Consent
Title

Your consent

Checkboxes
consent to identity verification
consent to AML screening
consent to ongoing monitoring
confirm information is accurate
Expandable links
privacy policy
terms
CTA

Agree and Continue

Step 4 - Payment
Title

Payment

Show
amount
what it covers
card or bank debit
secure payment indicator
Critical rule

Once payment details are successfully entered and confirmed, the workflow moves automatically to:

Processing

3. PROCESSING SCREEN

This is a major screen. It must feel active and intelligent.

Title

We’re verifying your details

Purpose

Show the client that checks are running in real time.

Live checklist items
Verifying identity
Running AML screening
Checking business risk
Reviewing linked entities
Searching for associated parties
Analysing ownership and control
Preparing results

Each item should show:

spinner while running
checkmark when complete
warning if review needed
Do not show raw provider names to the client by default

Keep it simple and trust-building.

Client-facing summary text

Keep it plain:

secure
simple
progress-driven
4. WHAT HAPPENS IN PROCESSING - SYSTEM LOGIC TO REPRESENT

After payment, the system must automatically run the following checks.

Initial external integrations
Equifax

Run on the main individual:

identity signals
fraud signals
consumer credit
repayment history where applicable
Illion

Run where relevant:

business credit
insolvency
court actions
director risk
SME risk indicators
ComplyAdvantage

Run on the main subject:

sanctions
PEP
adverse media
ongoing AML monitoring registration
Conditional ASIC extraction

If onboarding data, identity results, declarations, uploaded documents, or external results identify:

companies
directorships
shareholdings
officeholder roles
associated entities
control positions

then the system must automatically run ASIC direct extract searches.

ASIC results may include
company extracts
entity details
directors
officeholders
share structure where available
linked company records
5. ASSOCIATE AND ENTITY EXPANSION LOGIC

This is critical. Build the UI and logic around it.

The system must not stop at the main client.

If checks or documents identify more people or entities, the system must expand the review scope.

Trigger additional subject creation when the system finds:
additional companies
related entities
subsidiaries
holding companies
trusts
trustees
directors
secretaries
officeholders
beneficial owners
controllers
shareholders with 24% or more
appointors
settlors where relevant
guarantors
authorised representatives
other associates linked by ownership or control
Mandatory 24%+ shareholder rule

Any person or entity with 24% or more ownership must be treated as an in-scope associated party.

Default threshold is 24%.
This should be configurable in admin later, but default to 24 now.

Recursive discovery rule

If a newly found entity leads to more linked entities or controllers, keep expanding until:

no more linked entities found
threshold falls below policy
user stops expansion
policy excludes it
manual hold is applied
6. CHECKS TO RUN ON ALL ASSOCIATES
For all identified people

Automatically run:

ComplyAdvantage sanctions
ComplyAdvantage PEP
ComplyAdvantage adverse media

Then run internal bots:

Sanctions Screening Bot
PEP Screening Bot
Adverse Media Screening Bot
Identity Verification Bot where required
Court and Litigation Screening Bot where relevant
Monitoring Trigger Bot
Compliance Decision contribution
For all identified entities

Automatically run:

ASIC direct extract
Illion business risk
ComplyAdvantage sanctions where supported
ComplyAdvantage adverse media where supported

Then run internal bots:

KYB and Entity Verification Bot
Sanctions Screening Bot
Adverse Media Screening Bot
Beneficial Ownership Mapping Bot
Court and Litigation Screening Bot
Monitoring Trigger Bot
Compliance Decision contribution
7. DOCUMENT STORAGE RULE

All retrieved documents and records must save to:

All Documents

Document tagging must show:
subject name
subject type
linked client
source
document type
date retrieved
Example tags
ASIC Extract - ABC Pty Ltd
Director Record - John Smith
AML Screening Result - Jane Brown
Ownership Record - Holding Co
Business Risk Result - XYZ Pty Ltd
8. BOTS THAT MUST RUN AFTER DOCUMENTS AND CHECKS RETURN

Once external checks and ASIC extracts complete, the internal bots begin working automatically.

Bots to include
Identity Verification Bot
Sanctions Screening Bot
PEP Screening Bot
Adverse Media Screening Bot
KYB and Entity Verification Bot
Beneficial Ownership Mapping Bot
Source of Funds Bot
Source of Wealth Bot
Court and Litigation Screening Bot
Compliance Decision Bot
Monitoring Trigger Bot
Compliance File QA Bot
Case Management Module
AUSTRAC Reporting Module
What the bots do

They must:

review documents
extract data
compare records
run online searches
classify risk
flag issues
create cases
update monitoring
contribute to the final decision
9. RESULTS SCREEN
Title

Verification complete

Outcomes
A. Approved
verified successfully
next step CTA
B. Review required
internal team reviewing details
clear status message
C. Additional information required
upload missing items
resume workflow
10. CLIENT KYC MASTER DASHBOARD

This is the staff-facing dashboard after onboarding.

Page name

Client Profile - KYC Dashboard

Goal

The user should be able to:

understand the client instantly
see all risk in one place
drill into any data fast
run checks on demand
manage cases and documents
make decisions without leaving the screen
Overall layout

Use a 3-zone layout:

Top summary strip
Main content area with tabbed workspace
Right-side sticky action and risk panel
Top summary strip
Left
client name
entity type
status badge
Active
Pending
Under Review
Restricted
Blocked
Centre

Risk snapshot bar with:

Overall Risk
AML Risk
Financial Risk
Business Risk
Ownership Risk

Show:

numeric score
colour band
label
Right

Quick statuses:

Identity
AML
Entity
Monitoring
Last review date
Next review date
Top actions

Primary:

Run Full Check
Run AML
Run Credit
Run Business Risk

Secondary:

Add Note
Upload Document
Create Case
Create AUSTRAC Case
Left sticky tab nav

Tabs:

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
Cases
AUSTRAC
Audit Log
Overview tab
Section 1 - Client snapshot card

Show:

full legal name
ABN / ACN
DOB if individual
country
industry
service type
client group
Section 2 - Key alerts

Show critical alerts only:

sanctions match
PEP detected
high adverse media
insolvency flag
identity issue
ownership gap

Each alert card must be clickable.

Section 3 - KYC status grid

Four large cards:

Identity
status
confidence
fraud flags
last checked
Re-run button
AML
sanctions result
PEP result
media result
source badge
Re-run AML
Entity
ASIC status
registration
directors
last checked
Refresh button
Business Risk
Illion score
insolvency
court signals
director risk
Run button
11. RIGHT-SIDE RISK INTELLIGENCE PANEL

This must always stay visible.

Sections
Overall decision
Approved
Conditional
Escalated
Rejected
Key drivers

List the main reasons:

foreign PEP
adverse media
weak credit
ownership unclear
court signal
Required actions

Checklist:

request docs
review ownership
escalate
apply hold
Run checks

Buttons:

Run Full Check
Run AML
Run Identity
Run Credit
Run Business Risk
Run Ownership Analysis
Run SOF / SOW
Advanced checks

Show only if enabled:

Run Legal Check
Run Crypto Check
12. TAB DESIGN REQUIREMENTS
Identity tab

Show:

ID docs
verification results
Equifax identity signals
fraud flags
upload replacement
rerun identity
AML tab

Show three sections:

Sanctions
PEP
Adverse Media

Each section must show:

result
matches
confidence
source badge
timestamp
evidence drawer
Entity tab

Show:

ASIC data
directors
officeholders
linked entities
refresh button
Ownership tab

This is a major screen.

Show:

ownership graph
control graph
24%+ shareholder highlights
beneficial owners
controllers
missing ownership warnings
recalculate button
add relationship button
Financial tab

Show:

Equifax score and identity-financial signals
Illion business risk
defaults
repayment
insolvency
Legal tab

Show:

Illion court signals
optional LexisNexis results if run
Documents tab

Show:

All Documents as the default subview
file list
tag filters
extracted data preview
source labels
expiry dates
Monitoring tab

Show:

AML monitoring
credit alerts
business alerts
active review cycles
associate monitoring status
Decisions tab

Show:

past decisions
conditions
reviewer
timestamps
overrides
Cases tab

Show all linked cases:

case type
severity
status
owner
last updated
AUSTRAC tab

Show:

linked AUSTRAC cases
status
submission state
quick link to case
Audit Log tab

Show:

who did what
when
system and user actions
provider events
13. CASE MANAGEMENT USER VIEW

Build Cases as a separate workspace and also embedded inside the client.

Module name

Cases

Main screen

Case Control Centre

KPI strip
Open cases
High-risk cases
Escalated cases
Awaiting decision
Overdue cases
Recently closed
Case table columns
Case ID
Client / Entity
Case Type
Trigger Source
Risk Level
Status
Assigned To
Last Updated
SLA Timer
Case types
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
Case Workbench
Layout
Left: Timeline
Centre: Investigation tabs
Right: Actions + Decision
Timeline panel

Show:

case created
trigger event
checks run
docs added
decisions made
monitoring alerts
Investigation tabs
Summary
Triggers
Evidence
Screening
Financial
Ownership
Related Parties
Notes
Right panel actions
update case status
assign owner
request docs
run checks
escalate
approve
reject
send to AUSTRAC
apply service hold
monitor only
14. ASSOCIATE EXPANSION UI

This needs a dedicated experience.

Build a panel called

Associated Parties and Entities

It should show:
discovered associates
discovered entities
source of discovery
relationship type
ownership percentage
control flag
screening status
risk status
Group by:
directors
24%+ shareholders
beneficial owners
controllers
related companies
trustees
officeholders
Actions on each row
open profile
run checks
view documents
add to case
exclude with reason
mark verified
Show recursive expansion visually

Build a network or graph view that expands from:

primary client
linked entity
linked people
secondary entities
tertiary entities if discovered
15. BOT EXECUTION UX

Users must be able to run bots from the client screen and the case screen.

Wherever a bot can run, show:
Run button
current status
provider source if external
last checked
result badge
Bot states
Not started
Queued
Running
Review required
Completed
Failed
On click

Open a small progress drawer:

running source checks
analysing results
updating risk profile

Then update the card live.

16. MONITORING RULES TO REPRESENT IN UI

Monitoring must include the main client and all in-scope associates.

In-scope monitoring subjects
primary client
key directors
24%+ shareholders
beneficial owners
related entities
key controllers
Monitoring cards should show:
subject
what is monitored
last check
next check
latest alert
risk impact
17. RISK AGGREGATION RULE

The UI must make clear that risk is aggregated across the full group.

If:

primary client is clear
but a director is a foreign PEP
and a 27% shareholder has severe adverse media
and a related entity has insolvency

the overall client risk must show the combined result.

Build a visual explainer card:
Group Risk Contributors

18. ALL DOCUMENTS VIEW

This is a major screen.

Default subview

All Documents

Layout
left filter panel
centre document table or card list
right preview drawer
Filters
subject
source
type
date
extracted / raw
flagged / unflagged
Document sources
uploaded by client
ASIC
Equifax
Illion
ComplyAdvantage
generated by system
Actions
preview
download
tag
link to case
open related subject
19. DESIGN STYLE
Must feel
high-end
clean
serious
fast
evidence-first
Use
strong cards
dense but readable tables
status chips
confidence badges
source badges
risk bars
graph views
side drawers
Avoid
clutter
long blank pages
hidden critical actions
too many nested screens
20. KEY UX RULES
no page reloads
max 2 clicks to any key data
evidence always visible
source always visible
risk always visible
actions always visible
user can act from the same screen
21. REQUIRED END-TO-END USER JOURNEYS

Build these flows in the prototype.

Journey 1 - simple client passes
onboarding completed
payment entered
processing runs
Equifax, Illion, ComplyAdvantage complete
no linked issues
approved
monitoring activated
Journey 2 - client reveals company links
onboarding completed
processing finds directorship
ASIC extract runs
more entities found
24%+ shareholder found
ComplyAdvantage runs on shareholder
bots run across all associates
ownership graph expands
overall risk elevated
Journey 3 - high-risk associate triggers case
related director hits adverse media
case auto-created
user opens case
reviews evidence
applies service hold
escalates to compliance
AUSTRAC option visible
Journey 4 - ongoing monitoring reopens file
a monitored associate becomes a PEP
monitoring alert appears
client overall risk updates
case created automatically
dashboard reflects new risk
22. FINAL INSTRUCTION TO THE FIGMA BUILDER

Build the Grow KYC Module as one connected system where:

onboarding is simple for the client
processing is intelligent and automated
Equifax, Illion, ComplyAdvantage, and ASIC run in the background
new entities and associates are discovered recursively
all 24%+ shareholders and material associates are screened
all documents save to All Documents
bots review everything automatically
users open one client dashboard and have every detail at their fingertips
users can run checks, review cases, access evidence, and make decisions without leaving the workspace
One-line goal

The user should be able to onboard a client, expand to the full ownership and control network, run all checks, review all evidence, manage all cases, and make a final decision from one connected experience.
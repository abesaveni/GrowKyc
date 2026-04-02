TIER 2 - FULL SYSTEM BUILD (FIGMA SPEC)

Modules:

Beneficial Ownership Mapping Bot
Source of Funds Bot
Source of Wealth Bot
Court and Litigation Screening Bot

Each follows the same structure as Tier 1.

1. BENEFICIAL OWNERSHIP MAPPING BOT
Objective

Identify:

ultimate beneficial owners (UBOs)
controlling persons
ownership chains across entities

This is the core Tranche 2 requirement.

What the bot must do
ingest entity + documents
map ownership layers
calculate % ownership
detect control without ownership
identify UBOs
detect gaps and inconsistencies
Output classifications
Ownership complete
Ownership incomplete
Ownership unclear
High-risk structure
Escalated
Screen 1. Ownership Control Centre
KPI Cards
entities pending mapping
incomplete structures
missing UBOs
high-risk structures
escalations
Tables

Entity Queue

Entity name
Type
Status
UBO identified (yes/no)
Risk level
Assigned

Issues Table

Entity
Issue type
Severity
Status
Screen 2. Ownership Mapping Wizard
Step 1 - Input
entity name
entity type
country
known directors
known shareholders
uploaded docs
Step 2 - Data Sources

Display:

registry data
prior system data
uploaded docs
Step 3 - AI Structure Build

System generates:

ownership tree
% holdings
control relationships
Step 4 - Graph View

Visual:

nodes = people/entities
edges = ownership/control
highlight:
UBOs
controllers
Step 5 - Gap Detection

Flags:

missing owners
ownership not totaling 100%
circular ownership
mismatch with documents
unknown controller
Step 6 - Analyst Decision
approve
request info
escalate
mark high risk
Screen 3. Ownership Graph (Interactive)

Features:

zoom
expand layers
highlight control paths
filter by ownership %
Screen 4. Ownership Profile

Fields:

entity
UBOs
controllers
ownership %
risk rating

Tabs:

graph
history
documents
audit
Screen 5. Monitoring

Triggers:

director change
shareholding change
new entity added
trust update
Core Rules
default UBO threshold 25%
control overrides ownership
unknown UBO = fail
mismatch vs docs = review
2. SOURCE OF FUNDS BOT
Objective

Confirm:

where transaction money comes from
whether evidence supports it
What the bot must do
capture declared source
collect documents
validate amounts and timing
detect suspicious patterns
Output classifications
Verified
Partially verified
Unverified
Suspicious
Escalated
Screen 1. SOF Control Centre
KPI Cards
pending
verified
missing evidence
flagged
escalated
Screen 2. SOF Wizard
Step 1 - Declaration

Options:

salary
business income
property sale
investment
inheritance
loan
gift
other
Step 2 - Document Upload
bank statements
contracts
settlement docs
loan agreements
Step 3 - AI Analysis

Checks:

amount vs documents
timing
source consistency
third-party involvement
Step 4 - Results

Cards:

consistent
inconsistent
missing evidence
suspicious
Step 5 - Analyst Decision
approve
request info
escalate
Screen 3. SOF Profile

Fields:

declared source
verified amount
evidence
status
Screen 4. Risk Flags
large unexplained deposits
round-tripping
third-party funding
mismatch with client profile
Core Rules
high value = mandatory evidence
mismatch = review
unexplained = escalate
3. SOURCE OF WEALTH BOT
Objective

Validate:

how wealth was accumulated
whether it aligns with profile
What the bot must do
capture wealth narrative
validate with evidence
assess plausibility
Output classifications
Verified
Plausible
Unclear
High-risk
Escalated
Screen 1. SOW Control Centre

KPI:

pending
verified
high-risk
escalations
Screen 2. SOW Wizard
Step 1 - Declaration
business
salary
investments
inheritance
property
other
Step 2 - Evidence
financials
sale agreements
asset registers
Step 3 - AI Analysis

Checks:

wealth vs income
timeline vs age
asset consistency
geographic plausibility
Step 4 - Results
consistent
questionable
unsupported
Step 5 - Analyst Decision
approve
request info
escalate
Screen 3. Wealth Profile

Fields:

total wealth estimate
sources
evidence
risk rating
Core Rules
high wealth requires support
mismatch = escalate
foreign wealth = higher risk
4. COURT AND LITIGATION SCREENING BOT
Objective

Identify:

legal exposure
insolvency events
enforcement history
What the bot must detect
court cases
tribunal matters
bankruptcy
liquidation
director bans
enforcement actions
Output classifications
No history
Minor activity
Active litigation
Insolvency event
High-risk legal exposure
Screen 1. Legal Control Centre
KPI Cards
pending
matches
insolvency alerts
escalations
Screen 2. Screening Wizard
Step 1 - Input
name
entity
country
role
Step 2 - Scope
courts
tribunals
insolvency
enforcement
Step 3 - Results

Clusters:

court cases
insolvency
regulatory
Step 4 - Summary

Each result:

type
jurisdiction
date
status
source
Step 5 - Decision
clear
record
escalate
Screen 3. Review Workbench

Left:

result clusters

Centre:

identity match

Right:

classification
severity
decision
Screen 4. Legal Profile

Fields:

cases
insolvency
risk level

Tabs:

history
evidence
audit
Screen 5. Monitoring

Triggers:

new case
insolvency update
enforcement action
Core Rules
insolvency = high risk
active litigation = review
repeat issues = escalate
FINAL TIER 2 SYSTEM FLOW

Figma must show this full journey:

KYB completed
Ownership mapped
UBO identified
SOF verified
SOW assessed
Legal screening completed
Risk elevated or cleared
FINAL INSTRUCTION TO FIGMA BUILDER

Build 4 modules:

Beneficial Ownership Mapping Bot
Source of Funds Bot
Source of Wealth Bot
Court and Litigation Screening Bot

Each must include:

dashboard
wizard
review workbench
profile
monitoring
audit log
Required journeys
Journey 1 - Clean case
simple structure
clear ownership
clean funds
no legal issues
Journey 2 - Complex high-risk case
layered ownership
missing UBO
unclear funds
litigation found
escalated to compliance
What Tier 2 achieves
moves beyond onboarding
introduces real risk intelligence
supports lending and investor workflows
prepares for Tranche 2 properly
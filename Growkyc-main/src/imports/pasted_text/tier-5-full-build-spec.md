TIER 5 - FULL BUILD SPEC (FIGMA)

Modules:

AI Compliance Analyst Copilot
Autonomous Workflow Orchestrator Bot
Predictive Capacity & Workforce Planning Bot
Investor & Lender Intelligence Bot
Reusable Identity & Entity Wallet Bot
Enterprise Multi-Firm Control Bot
1. AI COMPLIANCE ANALYST COPILOT
Objective

Give every user an AI assistant that can:

explain why a case was flagged
summarise findings
draft review notes
draft ECDD memos
draft partner summaries
identify missing evidence
recommend next steps

This is the AI brain beside the reviewer.

It must not make silent decisions on its own.
It must work as an explainable copilot.

What the bot must do
read outputs from all prior bots
summarise risk clearly
highlight contradictions
suggest controls
draft review commentary
prepare decision rationale
answer file-specific questions
identify missing documents or incomplete checks
Output classifications
Summary only
Recommendation only
Draft memo
Draft escalation note
Missing evidence warning
Contradiction detected
Screen 1. Copilot Control Centre
KPI Cards
cases supported today
memos drafted
escalation notes drafted
missing evidence alerts
unresolved contradictions
Main Queue

Columns:

subject
bot task type
status
assigned reviewer
confidence
created date
Filters
task type
reviewer
risk level
subject type
status
Actions
open copilot
generate memo
generate escalation note
generate partner summary
export output
Screen 2. Copilot Workspace
Layout

Three-column layout.

Left panel

Case context:

client or entity name
risk rating
key flags
linked bots completed
reviewer owner
Centre panel

AI output tabs:

Case summary
Missing evidence
Suggested controls
Draft memo
Draft escalation
Decision support
Right panel

Actions:

copy to case
save as memo
send to partner review
mark accepted
edit before save
Screen 3. Case Q&A Panel
Purpose

Let reviewer ask file-specific questions.

Example prompts:

why was this client rated high risk
what evidence is still missing
which bot triggered the escalation
what is the strongest adverse media source
what controls should apply to this foreign PEP
why can this case not be approved yet
Output rules
answer must reference file data
show evidence links
show reasoning chain in plain English
show confidence level
Screen 4. Drafting Workbench
Draft types
ECDD memo
compliance summary
partner approval note
onboarding block notice
request for more information
annual review summary
Editor features
AI draft on left
editable document on right
insert evidence references
insert risk flags
save to file
Screen 5. Copilot Audit Panel

Shows:

who requested draft
what data was used
version history
edits made by human
final saved output
Core Rules
AI cannot silently approve or reject
all outputs must be editable
every answer must point to evidence
confidence must be visible
missing data must be disclosed
2. AUTONOMOUS WORKFLOW ORCHESTRATOR BOT
Objective

Make the platform run work automatically.

This bot takes events and decides:

what task starts next
who gets it
what documents are required
whether the workflow pauses
whether the workflow escalates

This is the operating engine.

What the bot must do
watch all workflow events
route jobs automatically
create tasks
assign owners
trigger bots based on entity type, risk, and stage
pause work when blockers exist
resume work when blockers cleared
escalate where rules require it
Output classifications
Task created
Workflow advanced
Workflow paused
Escalation created
Rework requested
Closed
Screen 1. Workflow Orchestrator Dashboard
KPI Cards
active workflows
tasks auto-created today
blocked workflows
escalations created
jobs auto-advanced
overdue tasks
Tables

Workflow Queue

subject
current stage
next stage
blocker
owner
status

Automation Log

event
action taken
timestamp
rule used
Screen 2. Workflow Studio
Purpose

Visual no-code workflow builder.

Builder blocks
onboarding received
ID complete
sanctions clear
PEP flagged
adverse media clear
KYB complete
ownership incomplete
SOF requested
decision approved
monitoring triggered
payment received
engagement signed
Actions
assign task
send request
pause
escalate
approve next stage
request review
notify partner
notify client
Screen 3. Live Workflow Map
View

Step-by-step flow:

current node
completed nodes
blocked nodes
escalated nodes
timed-out nodes
Side panel
reason blocked
required data
assigned staff
SLA countdown
Screen 4. Rules and Routing Panel
Routing rules
by client tier
by entity complexity
by jurisdiction
by risk rating
by service line
by reviewer level
Examples
foreign PEP -> escalate to compliance manager
simple individual with no flags -> straight-through workflow
missing trust deed -> pause and request document
sanctions hit -> lock all further actions
Screen 5. Workflow Audit Timeline

Shows:

every step triggered
who or what triggered it
rule applied
time delay
overrides
Core Rules
hard-stop events block workflow
every automated action logged
staff can override with reason
workflow must be explainable step by step
3. PREDICTIVE CAPACITY & WORKFORCE PLANNING BOT
Objective

Predict:

staffing needs
bottlenecks
overload risk
future due date pressure
job slippage

This bot turns the platform into a practice management intelligence system.

What the bot must do
analyse volumes by month
predict workload by team and role
predict risk-weighted hours
spot over-capacity teams
recommend staffing changes
predict SLA breaches
forecast seasonal spikes
Output classifications
Capacity healthy
Capacity tight
Overloaded
Underutilised
Hiring required
Reschedule recommended
Screen 1. Capacity Control Centre
KPI Cards
utilisation %
forecast load next 30 days
overloaded teams
idle capacity
expected SLA breaches
hiring gap
Charts
monthly forecast workload
role-based load
team utilisation curve
risk-weighted job load
Screen 2. Forecasting Workbench
Inputs
active clients
onboarding volumes
annual review cycle
risk category mix
staff availability
leave calendar
job duration history
Outputs
expected hours
staff required
overload dates
rescheduling suggestions
Screen 3. Team Capacity View

Table:

staff member
role
allocated hours
risk-weighted load
due date pressure
utilisation %
status
Filters
team
role
office
service line
Screen 4. Scenario Planner
User can model:
hire 2 offshore reviewers
shift annual reviews by 2 weeks
automate 30% of low-risk onboarding
remove one senior reviewer
increase high-risk client load by 20%
Output
capacity delta
margin impact
SLA impact
risk impact
Screen 5. Workforce Recommendations Panel

Example recommendations:

reassign trust jobs to senior reviewer queue
add one offshore analyst in May
move annual refresh cycle earlier
auto-approve low-risk cases to free manager time
Core Rules
high-risk work consumes more weighted capacity
deadline clusters increase priority score
unresolved escalations reduce effective capacity
forecast must separate raw hours from complexity-weighted hours
4. INVESTOR & LENDER INTELLIGENCE BOT
Objective

Give lenders, brokers, and investor managers a live intelligence layer across:

borrowers
guarantors
investors
deals
security positions
portfolio exposure

This module extends the platform beyond accounting into private capital and structured finance.

What the bot must do
profile each borrower and guarantor
track compliance status by deal
track investor onboarding status
score risk by transaction
surface concentration risk
monitor security and document completeness
summarise deal readiness
Output classifications
Deal ready
Deal pending compliance
High-risk borrower
Guarantor review required
Investor incomplete
Security incomplete
Portfolio concentration risk
Screen 1. Investor & Lender Control Centre
KPI Cards
active deals
pending borrower checks
pending investor checks
incomplete security packs
high-risk transactions
concentration alerts
Tables

Deal Pipeline

deal name
borrower
loan amount
compliance status
document status
risk level

Investor Queue

investor name
onboarding status
KYC status
source of funds status
approval status
Screen 2. Deal Intelligence View
Sections
deal summary
borrower profile
guarantor profile
investor readiness
security checklist
risk score
approval status
Risk drivers
borrower structure complexity
guarantor weakness
adverse media
incomplete SOF/SOW
litigation risk
security gaps
Screen 3. Security & Conditions Workbench
Checklist items
mortgage docs
guarantee docs
trust authority docs
valuation current
title search current
investor authority docs
entity authority docs
Statuses
complete
pending
expired
missing
review required
Screen 4. Portfolio Exposure Dashboard
Views
exposure by borrower
exposure by guarantor
exposure by state
exposure by sector
exposure by security rank
investor concentration
Visuals
heatmaps
bar charts
trend charts
deal risk bands
Screen 5. Approval Pack Builder
Outputs
borrower summary
guarantor summary
investor summary
compliance summary
security status pack
conditions precedent checklist
Core Rules
no deal can be deal-ready if hard-stop compliance remains incomplete
expired security item triggers warning
high borrower concentration triggers portfolio alert
guarantor weakness can cap approval status
5. REUSABLE IDENTITY & ENTITY WALLET BOT
Objective

Create a reusable verification wallet for each person and entity.

This wallet stores:

verified identity facts
verified entity data
ownership history
prior checks
reusable evidence
refresh requirements

This is one of the strongest long-term moats.

What the bot must do
store verified facts once
reuse previous checks where allowed
detect what changed
request only delta information
keep historic evidence versions
support one-click annual refresh
Output classifications
Wallet active
Wallet stale
Refresh required
Delta only required
Reverification required
Screen 1. Wallet Control Centre
KPI Cards
active wallets
stale wallets
delta refreshes due
full reverifications due
reused checks this month
Tables
people wallets
entity wallets
stale records
Screen 2. Person Wallet View
Sections
verified identity facts
document history
PEP history
adverse media history
sanctions history
linked entities
review cycle
Status chips
verified
expired
changed
review required
Screen 3. Entity Wallet View
Sections
legal entity details
KYB status
ownership graph
UBO history
linked controllers
litigation history
review cycle
Screen 4. Delta Refresh Wizard
Purpose

Only ask for what changed.

Examples:

ID expired
address changed
new director added
ownership changed
new country exposure
new source of funds needed
Output
no change
partial update only
full recheck needed
Screen 5. Wallet Reuse Audit Panel

Shows:

which checks were reused
why allowed
original verification date
expiry logic
reviewer override
Core Rules
stale core facts cannot be reused without refresh
sanctions and media checks must be current
structural changes trigger selective reverification
reuse logic must be transparent
6. ENTERPRISE MULTI-FIRM CONTROL BOT
Objective

Support:

multiple firms
multiple brands
isolated data environments
central oversight
whitelabel deployment
enterprise policy management

This turns the platform into a multi-tenant enterprise product.

What the bot must do
manage multiple firms
manage firm-specific branding
manage policy differences
isolate permissions and data
aggregate enterprise reporting
support parent-child oversight
Output classifications
Firm healthy
Policy divergence detected
SLA risk
Compliance breach risk
Cross-firm alert
Screen 1. Enterprise Command Centre
KPI Cards
active firms
total users
total live clients
cross-firm high-risk cases
SLA breaches
policy exceptions
Enterprise table
firm name
active matters
high-risk count
overdue reviews
system health
policy version
Screen 2. Firm Management View
Sections
branding
plan and usage
policy settings
integrations
user roles
workflow settings
Screen 3. Cross-Firm Risk Dashboard
Views
high-risk by firm
PEP exposure by firm
overdue reviews by firm
QA failures by firm
client concentration by firm
Screen 4. Policy Deployment Panel
Purpose

Push rules across firms.

Policy types
risk rules
monitoring rules
approval rules
workflow rules
file QA rules
Actions
deploy to all firms
deploy to selected firms
compare versions
rollback
Screen 5. Enterprise Audit & Access Panel

Shows:

admin actions
policy changes
firm access changes
user role changes
deployment history
Core Rules
firm data must remain isolated
enterprise reporting must aggregate safely
policy changes must be versioned
whitelabel settings cannot break compliance controls
FINAL TIER 5 SYSTEM FLOW

Figma must show this end-state journey:

Client or entity enters system
Wallet checked for reusable verified data
Workflow orchestrator launches required path
Bots run only delta checks where possible
Compliance Decision Bot recommends outcome
AI Copilot drafts file summary and partner memo
Monitoring Trigger Bot activates live monitoring
Predictive Capacity Bot updates staff and workload forecast
Portfolio and lender dashboards update in real time
Enterprise command centre shows live risk across all firms
FINAL INSTRUCTION TO FIGMA BUILDER

Build 6 modules:

AI Compliance Analyst Copilot
Autonomous Workflow Orchestrator Bot
Predictive Capacity & Workforce Planning Bot
Investor & Lender Intelligence Bot
Reusable Identity & Entity Wallet Bot
Enterprise Multi-Firm Control Bot

Each must include:

dashboard
workbench or control panel
profile or detailed drill-down
rules/configuration area
audit trail
export/reporting state where relevant
Required journeys
Journey 1 - Autonomous low-risk onboarding
wallet reused
minimal delta checks
straight-through approval
monitoring activated
no manual intervention
Journey 2 - Complex high-risk deal
layered entity structure
guarantor weakness
unclear source of funds
litigation issue found
workflow escalates
copilot drafts memo
deal remains pending conditions
Journey 3 - Multi-firm enterprise oversight
one firm has rising overdue reviews
another has high foreign PEP concentration
policy update pushed centrally
enterprise dashboard updates
audit trail preserved across firms
WHAT TIER 5 ACHIEVES

Tier 5 gives you:

autonomous workflow execution
reusable compliance intelligence
predictive staffing and load planning
investor and lender operating views
multi-firm enterprise rollout
explainable AI support across every file

This is no longer just compliance software.

This is a full enterprise operating system for advisory, finance, lending, and regulated onboarding.
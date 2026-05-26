TIER 4 - FULL BUILD SPEC (FIGMA)

Modules:

Client Risk & Profitability Bot
Pricing & Engagement Intelligence Bot
Portfolio Risk Dashboard Bot
Revenue Leakage & Billing Bot
1. CLIENT RISK & PROFITABILITY BOT
Objective

Score every client on:

compliance risk
operational burden
profitability

This drives:

pricing
retention
client selection
What it must analyse

Inputs:

risk score (from Tier 3)
time spent vs budget
number of revisions
document delays
compliance issues
payment behaviour
service complexity
Output classifications
High value, low risk
High value, high risk
Low value, low risk
Low value, high risk
Loss-making client
Screen 1. Client Intelligence Dashboard
KPI Cards
total clients
high-risk clients
loss-making clients
top 20% revenue clients
bottom 20% clients
Client Table

Columns:

client name
revenue
cost
margin
risk score
profitability score
category
Screen 2. Client Profile Intelligence
Sections

Financial

revenue
time cost
margin

Compliance

risk rating
flags
escalations

Behaviour

response time
document delays
revision count
Screen 3. Client Score Breakdown

Show:

risk score
profitability score
behaviour score

Final classification auto-generated.

Screen 4. Action Panel

Options:

increase fees
restrict services
monitor closely
disengage
Core Rules
low margin + high risk = exit candidate
high revenue + high risk = price increase
high admin burden = flag
2. PRICING & ENGAGEMENT INTELLIGENCE BOT
Objective

Automatically:

recommend pricing
structure engagements
adjust fees based on risk
What it must analyse
entity complexity
number of entities
risk level
compliance workload
historical time cost
client behaviour
Output
recommended price
pricing tier
margin forecast
risk adjustment
Screen 1. Pricing Dashboard

KPI:

average margin
underpriced clients
overpriced clients
pricing adjustments needed
Screen 2. Pricing Engine
Inputs
services selected
entity count
complexity
risk score
Outputs
base price
risk premium
complexity premium
final price
Screen 3. Engagement Builder
service bundles
pricing per entity
group pricing
payment terms
Screen 4. Scenario Modeller

Adjust:

price
scope
frequency

See:

margin impact
workload impact
Core Rules
high risk = price uplift
complex groups = bundled pricing
repeated issues = price increase
3. PORTFOLIO RISK DASHBOARD BOT
Objective

Give a live view of firm-wide risk exposure.

What it must show
total risk exposure
number of high-risk clients
PEP exposure
adverse media exposure
industry exposure
geographic exposure
Screen 1. Portfolio Dashboard
KPI Cards
total clients
high-risk %
foreign PEP count
active escalations
exposure by country
Visuals
risk distribution chart
client risk heatmap
geographic map
Screen 2. Risk Breakdown

By:

industry
country
service type
partner
Screen 3. Drill-Down View

Click any segment:

show clients
show risk drivers
show trends
Screen 4. Trend Analysis
risk over time
escalation trends
onboarding quality
Core Rules
concentration risk flagged
high-risk clusters flagged
sudden spikes flagged
4. REVENUE LEAKAGE & BILLING BOT
Objective

Detect:

lost revenue
underbilling
inefficiencies
What it must analyse
time vs billed
scope vs actual work
unpaid invoices
work before approval
rework and revisions
Output classifications
fully billed
underbilled
unbilled work
over-serviced
high leakage
Screen 1. Revenue Dashboard
KPI Cards
total billed
leakage amount
underbilled jobs
unpaid revenue
Screen 2. Job Analysis Table

Columns:

job
client
budget
actual time
billed
variance
Screen 3. Leakage Breakdown

Categories:

scope creep
free work
missed billing
excessive revisions
Screen 4. Action Panel

Options:

raise invoice
adjust pricing
flag client
update scope
Core Rules
time > budget = flag
work before approval = flag
repeated leakage = pricing review
FINAL TIER 4 SYSTEM FLOW

Figma must show:

Client onboarded
Risk assessed
Work performed
Revenue tracked
Client scored
Pricing adjusted
Portfolio risk updated
FINAL INSTRUCTION TO FIGMA BUILDER

Build 4 modules:

Client Risk & Profitability Bot
Pricing & Engagement Intelligence Bot
Portfolio Risk Dashboard Bot
Revenue Leakage & Billing Bot

Each must include:

dashboard
analysis screens
decision panels
reporting
drill-down capability
Required journeys
Journey 1 - High-value client
low risk
high margin
retained and expanded
Journey 2 - Bad client
high risk
low margin
flagged for exit
Journey 3 - Underpriced client
high workload
low fees
pricing adjusted
What Tier 4 achieves
turns compliance into revenue
improves margins
improves client quality
gives partner-level visibility
One-line summary

Tier 1 = compliance
Tier 2 = risk understanding
Tier 3 = automation and decisions
Tier 4 = profit and control
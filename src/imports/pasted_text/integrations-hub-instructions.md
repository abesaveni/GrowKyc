FIGMA BUILD INSTRUCTION
INTEGRATIONS LAYER (FULL PLATFORM)
Objective

Design a centralised Integration Layer that connects:

ASIC (direct)
Equifax
Illion
ComplyAdvantage
LexisNexis (optional)
Chainalysis (optional)

The UI must:

feel native
hide API complexity
show clear results
support audit and compliance
1. NEW GLOBAL MODULE
“Integrations Hub”
Location

Left nav → Enterprise → Integrations

Screen: Integrations Dashboard
Cards (one per provider)

Each card shows:

Provider name
Status: Connected / Disconnected
Last sync time
API health indicator
Usage this month
Cost estimate (optional toggle)
Providers to include
ASIC (Direct)
Equifax
Illion
ComplyAdvantage
LexisNexis (label: Optional)
Chainalysis (label: Optional)
Card Actions
Connect / Reconnect
Configure
View logs
Test connection
2. PROVIDER CONFIGURATION SCREENS
Each provider needs a config screen
Example: ComplyAdvantage Config

Fields:

API key
Base URL
Environment (sandbox / live)

Options:

enable sanctions
enable PEP
enable adverse media
enable monitoring

Controls:

match threshold slider
fuzzy matching toggle
Example: Equifax Config

Fields:

API credentials
region

Options:

consumer credit
identity signals
fraud detection
Example: Illion Config

Fields:

API key
account ID

Options:

business credit
insolvency
court data
director risk
Example: ASIC (Direct)

Fields:

API key / access token

Options:

company extract
director extract
refresh frequency
Optional Modules
LexisNexis

Toggle:

enable only for escalations
Chainalysis

Toggle:

enable only when crypto detected
3. INTEGRATION USAGE IN WORKFLOWS
Every integration must be embedded into bots

Do NOT create separate screens.

A. ONBOARDING FLOW (FIGMA JOURNEY)
Step UI sequence
Identity screen
→ calls Equifax
AML screening screen
→ calls ComplyAdvantage
Entity verification
→ calls ASIC
Business risk
→ calls Illion
Internal bots
→ ownership, SOF, SOW
Design requirement

Each step must show:

“Data Source Badge”

Example:

“Source: Equifax”
“Source: ComplyAdvantage”
“Source: ASIC”
B. RESULTS DISPLAY (CRITICAL)
Every check result must show:
1. Summary card
status (pass / flag / fail)
risk level
confidence
2. Source attribution
provider name
timestamp
data version
3. Expandable detail panel
raw data (structured)
matched fields
explanation
4. UNIFIED RISK PANEL
New component across all modules

Right-side panel called:

👉 “Risk Intelligence Panel”

Shows combined outputs from:
Equifax
Illion
ComplyAdvantage
optional modules
Sections
Identity risk
AML risk
Business risk
Financial risk
Legal risk
Each section shows:
score
key flags
source
5. OPTIONAL MODULE TRIGGERS (IMPORTANT)
These must NOT run automatically
A. LexisNexis trigger

Trigger when:

Illion shows legal risk
adverse media severe
deal value high
decision = escalate
UI

Button:
👉 “Run Advanced Legal Check”

Status:

not run
running
completed
B. Chainalysis trigger

Trigger when:

crypto detected in SOF
UI

Button:
👉 “Run Crypto Risk Check”

Show:

wallet risk score
flagged activity
6. MONITORING INTEGRATION
Monitoring must be visible
Screen: Monitoring Profile
Show per provider
ComplyAdvantage → AML monitoring
Equifax → credit alerts
Illion → insolvency alerts
Each shows:
last check
next check
alerts triggered
7. AUDIT + COMPLIANCE VIEW
New tab: “Data Sources & Evidence”

For every client file:

Show:
Check	Provider	Date	Result	Reviewer
Must include:
source name
timestamp
decision
version
This is critical for:
audits
regulators
partner review
8. COST VISIBILITY (OPTIONAL BUT STRONG)
Add toggle in dashboard

👉 “Show cost”

Displays:

cost per check
total per client
monthly cost
9. ERROR HANDLING (IMPORTANT)
UI states for all integrations
success
partial data
failed request
timeout
Show fallback message:

“External data unavailable - proceed with caution or retry”

10. DESIGN RULES
Must follow:
integrations invisible unless needed
results always clear and structured
source always visible
no raw API responses exposed directly
everything feeds into one decision view
FINAL BUILD SUMMARY

The Figma builder must create:

1. Integrations Hub
dashboard
config screens
connection status
2. Embedded integration usage

Inside:

onboarding
compliance
decision engine
monitoring
3. Risk Intelligence Panel
unified view of all providers
4. Optional triggers
LexisNexis
Chainalysis
5. Audit and evidence layer
full traceability
FINAL INSTRUCTION

Build the integrations so that:

users never think about APIs
they only see outcomes
every decision is backed by a visible data source
all providers feed into one clean system
ONE-LINE GOAL

Make six different data providers feel like one single intelligent system.
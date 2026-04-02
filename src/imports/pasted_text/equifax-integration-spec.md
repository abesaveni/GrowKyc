Upgrade the existing KYC platform to fully integrate Equifax as the external data layer.

Do not redesign existing onboarding or KYC flows. Extend current screens and add new components where required.

Objective:
Surface Equifax data across the system in a structured, auditable, regulator-ready way.

--------------------------------------------------

1. GLOBAL DESIGN RULES

- Reuse existing layout and component system
- Do not duplicate existing KYC screens
- Add tabs, panels, and drawers to extend functionality
- Every Equifax data point must show:
  - value
  - source (Equifax)
  - pull date
  - expiry date
  - evidence link
- Every dataset must support:
  - refresh action
  - history view
  - raw data view

--------------------------------------------------

2. CLIENT PROFILE UPGRADE

Add new tabs to client profile:

Tabs:
- Identity
- AML Screening
- Entity / Structure
- Affordability
- Credit
- Property
- Monitoring
- Evidence

Each tab must contain:

A. Summary card
- key result (pass/fail/score)
- last updated
- status indicator

B. Detailed data table
- structured fields from Equifax
- expandable rows

C. Evidence panel
- PDF or snapshot viewer
- download button

D. History panel
- previous pulls
- changes over time

E. Actions
- refresh data
- escalate
- add note

--------------------------------------------------

3. IDENTITY MODULE

Add identity verification panel:

- verification status badge
- fraud score indicator
- match sources list
- biometric result (if present)
- email and device risk indicators

Add:
- “View raw response”
- “Download report”

--------------------------------------------------

4. AML SCREENING MODULE

Add screening dashboard:

- PEP match status
- sanctions match status
- watchlist hits
- match confidence score

Add alert handling:
- mark as false positive
- escalate
- add resolution notes
- assign reviewer

Add timeline:
- initial screening
- re-screen events
- decisions

--------------------------------------------------

5. ENTITY + OWNERSHIP MODULE

Add structure viewer:

- visual ownership tree
- beneficial owners list
- control percentages

Add entity summary:
- ABN / ACN
- status
- officeholders

--------------------------------------------------

6. AFFORDABILITY MODULE

Add financial summary:

- income total
- expenses total
- net surplus
- affordability flag

Add:
- transaction breakdown charts
- expense categories
- risk flags

--------------------------------------------------

7. CREDIT MODULE

Add credit overview:

- credit score
- repayment history indicator
- defaults / adverse events

Add:
- enquiry history table
- insolvency indicator

--------------------------------------------------

8. PROPERTY MODULE

Add:
- property valuation card
- ownership confirmation
- title reference

--------------------------------------------------

9. MONITORING MODULE

Create alert center:

- list of all Equifax alerts
- filter by severity and type
- status tracking

States:
- New
- Reviewing
- Resolved

--------------------------------------------------

10. EVIDENCE MODULE

Create central evidence vault:

- all Equifax reports
- grouped by module
- searchable
- filter by date, type, client

Each record must show:
- source
- timestamp
- linked module
- download

--------------------------------------------------

11. CROSS-FUNCTIONAL CONTROLS

Add to all Equifax components:

- “last refreshed” timestamp
- “next refresh due”
- user who triggered pull
- audit log link

--------------------------------------------------

12. ADMIN PANEL

Create Equifax integration settings:

- API status
- last sync time
- error logs
- usage tracking
- rate limits

--------------------------------------------------

13. UX PRIORITY

- Keep screens clean and structured
- Use status badges and colour indicators
- Avoid clutter, use collapsible sections
- Prioritise summary → drill down → evidence

--------------------------------------------------

14. FINAL OUTPUT REQUIRED

Return updated system with:

- new tabs and modules
- updated client profile
- new components
- evidence integration
- alert workflows
- history tracking

Ensure all Equifax data is visible, traceable, and audit-ready across the platform.
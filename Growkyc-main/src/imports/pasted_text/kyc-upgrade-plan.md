Upgrade the existing KYC / compliance platform. Do not redesign from scratch. Review current flows, components, tables, and logic first. Preserve anything already built and only add or extend what is needed.

Objective:
Make the system operationally ready for:
1. AUSTRAC Tranche 2
2. NCCP compliance
3. ASIC RG78 breach reporting
4. ASIC RG271 complaints handling
5. SOC 2 controls
6. ISO 27001 control evidence

Core rule:
Assume much of the KYC engine, onboarding flow, document capture, identity verification, and entity mapping may already exist. Build a gap-closure upgrade, not a replacement.

Design instruction:
Keep the current visual style, navigation, spacing, naming logic, and component system. Extend the product in a modular way. Add missing workflows, screens, states, admin controls, registers, audit views, and evidence layers.

Build the following upgrades:

1. AML / AUSTRAC TRANCHE 2 LAYER

A. AML Program Management
Add a firm-level AML/CTF Program area with:
- Part A and Part B program sections
- version history
- approval status
- approved by
- approval date
- review due date
- policy owner
- linked procedures and controls
- downloadable PDF output
- board / director sign-off record

B. Customer Risk Scoring Engine
Add structured risk scoring to each client file:
- jurisdiction risk
- entity type risk
- ownership complexity
- PEP match risk
- sanctions match risk
- source of funds risk
- service risk
- delivery channel risk
- adverse media flag
- final weighted score
- final risk band: Low / Medium / High / Extreme
- escalation triggers
- override with reason and approval log

Create UI for:
- risk score summary card
- detailed scoring drawer
- risk change history
- reviewer notes
- approval workflow

C. Ongoing Due Diligence
Add ongoing review management:
- next review date
- review frequency by risk
- trigger events
- ownership change trigger
- unusual activity trigger
- large transaction trigger
- stale documents trigger
- manual review request

Create:
- review queue dashboard
- overdue review status
- review checklist
- re-verification flow
- completed review evidence log

D. Screening and Monitoring
Add screening center:
- PEP screening results
- sanctions screening results
- adverse media screening results
- screening date
- rescreening frequency
- alert resolution workflow
- evidence snapshot storage

Create:
- alert queue
- false positive resolution
- escalation state
- case notes
- decision history

E. Suspicious Matter and AUSTRAC Reporting
Add reporting workflow with:
- suspicious matter report case creation
- internal investigation notes
- linked customer profile
- linked transaction activity
- decision to lodge / not lodge
- lodgement record
- reporting officer log
- full audit trail

Create:
- report draft screen
- investigation timeline
- internal escalation approval
- status states: Open, Under Review, Approved, Lodged, Closed

2. NCCP COMPLIANCE LAYER

A. Consumer Profile and Loan Purpose
Add structured borrower profile capture:
- loan purpose
- objectives and requirements
- short term objective
- long term objective
- financial situation
- dependants
- employment type
- consumer vs business purpose flag

B. Verification Hub
Every assessment field must link to evidence:
- income source linked to document
- expenses linked to statement or declared form
- liabilities linked to credit report or statement
- assets linked to evidence
- verified by
- verified date
- verification status

Create:
- field-to-document evidence mapping view
- verification completeness widget
- missing evidence alerts

C. Unsuitability / Responsible Lending Assessment
Add structured assessment module:
- income summary
- fixed expenses
- variable expenses
- benchmark comparison
- liabilities summary
- servicing ratio
- interest rate buffer
- net surplus result
- unsuitable / suitable output
- reasons
- reviewer sign-off

Create:
- calculator screen
- assessment summary page
- final recommendation page
- assumptions log
- override control with approval

D. Disclosure Tracking
Add:
- credit guide version
- date issued
- acknowledgment status
- acknowledgment timestamp
- disclosure register
- document issue history

3. ASIC RG78 BREACH REPORTING LAYER

Create a full breach management module:
- breach ID
- date identified
- identified by
- business unit
- breach category
- severity
- significance assessment
- client impact
- financial impact
- systemic issue flag
- remediation actions
- ASIC report required yes/no
- reporting due date
- lodged date
- linked incidents
- linked complaints
- linked staff or system event

Create screens for:
- breach register list
- breach detail page
- significance assessment form
- remediation tracker
- reporting deadline tracker
- regulator export / report pack

4. ASIC RG271 COMPLAINTS HANDLING LAYER

Create a full complaints module:
- complaint intake from portal, email, phone, manual entry
- complaint category
- complainant details
- related client file
- related loan / service
- urgent complaint flag
- hardship flag
- acknowledgment date
- due date for response
- assigned complaint officer
- investigation notes
- outcome
- resolution date
- AFCA referral status
- IDR data fields

Create:
- complaints inbox
- complaint detail page
- SLA dashboard
- overdue complaints widget
- resolution workflow
- outcome letter generator
- management reporting dashboard

Need statuses:
- New
- Acknowledged
- Investigating
- Waiting on Client
- Escalated
- Resolved
- Closed

Need timers:
- 24 hour acknowledgment tracking
- 30 day resolution tracking
- urgent escalation alerts

5. SOC 2 AND ISO 27001 CONTROL LAYER

A. Access Control
Add admin security area with:
- role based access control
- permission matrix
- least privilege assignment
- MFA enforcement
- user status
- session tracking
- privileged action logging

B. Audit Logs
Create immutable audit trail views for:
- login
- logout
- file view
- file download
- KYC edit
- risk score change
- manual override
- report generation
- user permission change
- complaint status change
- breach status change
- data export

Create:
- searchable audit log page
- filter by user, client, action, module, date
- event timeline panel
- exportable logs

C. Security and Data Handling
Add data protection controls:
- encryption status indicators
- field-level protection tags for ID numbers, TFN, passport, licence
- retention policy settings
- archive status
- deletion request workflow
- legal hold flag

D. Incident Management
Create security incident register:
- incident type
- date detected
- severity
- affected system
- affected data
- containment action
- investigation owner
- regulator notification required
- customer notification required
- closure summary
- lessons learned

E. Vendor and Integration Register
Add a vendor risk module:
- vendor name
- integration type
- data shared
- owner
- risk rating
- contract status
- review date
- security review outcome
- ISO / SOC evidence
- subprocessor notes

6. CROSS-MODULE CONTROLS

Add these to all new and existing modules where missing:
- version history
- approved by
- last modified by
- last modified date
- comments and notes
- document attachments
- linked records
- task creation
- escalation owner
- due dates
- reminder notifications
- export to PDF
- export to CSV where relevant

7. DASHBOARDS TO ADD

A. Compliance Operations Dashboard
Show:
- high risk clients
- pending reviews
- unresolved screening hits
- overdue complaints
- open breaches
- unresolved incidents
- upcoming AML policy reviews

B. Management Dashboard
Show:
- client risk distribution
- complaint aging
- breach aging
- review completion rates
- verification completion
- unresolved escalations
- user access exceptions

C. Security Dashboard
Show:
- failed logins
- MFA status
- privileged access users
- audit log anomalies
- open incidents
- vendor review due dates

8. UX RULES

- Do not remove existing workflows unless duplicated
- Reuse current components before creating new ones
- Extend side navigation only where needed
- Keep forms structured and evidence-based
- Every important decision must show who did it, when, and why
- Every override must require a reason
- Every regulator-facing workflow must have a timeline and audit trail
- Every module needs list view, detail view, status states, filters, and export option

9. TECHNICAL / DATA DESIGN EXPECTATIONS

Where relevant, add or extend entities/tables for:
- aml_programs
- aml_program_versions
- customer_risk_scores
- risk_factor_logs
- ongoing_due_diligence_reviews
- screening_alerts
- suspicious_matter_cases
- responsible_lending_assessments
- evidence_links
- disclosure_register
- breach_register
- complaints_register
- complaint_events
- audit_logs
- security_incidents
- vendor_register
- retention_policies
- access_control_roles
- permission_overrides

10. DELIVERY APPROACH

Step 1:
Audit current designs and identify what already exists.

Step 2:
Mark each requirement as:
- already covered
- partially covered
- missing

Step 3:
Only design missing or incomplete areas.

Step 4:
Produce upgraded flows for:
- AML and risk
- ODD and screening
- NCCP assessment
- breach reporting
- complaints
- security controls
- audit and evidence

Step 5:
Return the upgraded system map with:
- new modules
- updated modules
- new screens
- new components
- new tables / entities
- dependencies

Final output required:
A clean upgraded product structure that keeps the existing KYC engine but closes regulatory, audit, security, and evidence gaps for AUSTRAC Tranche 2, NCCP, ASIC RG78, ASIC RG271, SOC 2, and ISO 27001 readiness.
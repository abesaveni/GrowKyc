Upgrade the existing platform into a complete, regulator-ready compliance and lending system.

Do not redesign from scratch. Audit existing KYC, onboarding, and document flows first. Reuse all existing components. Extend only where required.

Objective:
Deliver a fully integrated system covering:

* AUSTRAC Tranche 2
* NCCP responsible lending
* ASIC RG78 breach reporting
* ASIC RG271 complaints handling
* SOC 2 controls
* ISO 27001 controls

Also integrate Equifax as the primary external data layer.

---

1. SYSTEM ARCHITECTURE OVERVIEW

Design the system as 5 core layers:

1. Data Layer (Equifax + uploads)
2. Decision Layer (risk, lending, compliance logic)
3. Workflow Layer (tasks, reviews, escalations)
4. Evidence Layer (documents, audit logs, history)
5. Governance Layer (policies, breaches, complaints, security)

Ensure all layers are visible in UI and connected.

---

2. GLOBAL UX RULES

* Do not duplicate existing screens
* Extend using tabs, drawers, panels
* Every module must have:

  * list view
  * detail view
  * status states
  * filters
  * export
* Every decision must show:

  * who
  * when
  * why
* Every override must require:

  * reason
  * approval

---

3. CLIENT MASTER PROFILE (CORE HUB)

Upgrade client profile into a full operating hub.

Add tabs:

* Overview
* Identity
* AML / Risk
* Entity / Structure
* Affordability
* Credit
* Property
* Monitoring
* Tasks
* Notes
* Evidence
* Audit Log
* Complaints
* Breaches

Each tab must include:

* summary cards
* detailed data tables
* evidence panel
* history timeline
* actions

---

4. EQUFAX DATA INTEGRATION UI

Embed across modules:

For all Equifax data:

* show value
* show source (Equifax)
* show pull date
* show expiry
* show evidence link

Add:

* refresh button
* history view
* raw JSON viewer

Modules:

A. Identity

* verification result
* fraud score
* biometric result
* device and email risk

B. AML Screening

* PEP / sanctions / watchlist
* match confidence
* alert handling workflow

C. Entity

* ABN / ACN
* officeholders
* structure

D. Ownership

* visual ownership tree

E. Affordability

* income / expenses / surplus
* transaction breakdown

F. Credit

* score
* repayment history
* defaults

G. Property

* valuation
* title ownership

H. Monitoring

* alert center
* status tracking

---

5. AML / AUSTRAC MODULE

Create full AML system:

A. AML Program Register

* Part A / Part B
* version control
* approval logs
* review dates

B. Risk Engine

* risk factors
* weighted scoring
* risk bands
* override workflow

C. Ongoing Due Diligence

* review schedules
* trigger events
* review queue

D. Screening Case Management

* alert queue
* investigation notes
* resolution states

E. Suspicious Matter Workflow

* case creation
* investigation timeline
* decision log
* reporting record

---

6. NCCP RESPONSIBLE LENDING MODULE

A. Consumer Profile

* objectives
* financial situation
* dependants
* employment

B. Verification Hub

* link each field to evidence
* verification status
* verified by + date

C. Assessment Engine

* income
* expenses
* liabilities
* servicing
* buffers
* outcome (suitable / unsuitable)

D. Output

* recommendation
* reasoning
* assumptions
* sign-off

E. Disclosure Register

* credit guide issued
* acknowledgment tracking

---

7. COMPLAINTS MODULE (RG271)

Create full complaint system:

Fields:

* complaint ID
* intake source
* category
* client link
* assigned officer
* acknowledgment date
* resolution due date

Workflow:

* New
* Acknowledged
* Investigating
* Waiting
* Escalated
* Resolved
* Closed

Add:

* SLA timers
* escalation alerts
* investigation notes
* outcome tracking
* AFCA status

Dashboards:

* overdue complaints
* aging
* resolution performance

---

8. BREACH REGISTER (RG78)

Create breach module:

Fields:

* breach ID
* category
* severity
* significance test
* client impact
* financial impact
* remediation plan
* reporting requirement
* due date

Add:

* ASIC reporting tracker
* remediation workflow
* closure summary

---

9. TASK + WORKFLOW ENGINE

Add global task system:

* assign tasks to users
* due dates
* priority
* escalation rules
* linked to:

  * client
  * complaint
  * breach
  * AML review

Views:

* personal tasks
* team tasks
* overdue tasks

---

10. EVIDENCE VAULT

Central document system:

* all documents and reports
* grouped by module
* searchable
* version history

Each record:

* source
* uploaded by
* timestamp
* linked record

---

11. AUDIT LOG SYSTEM

Create immutable audit logs:

Track:

* login / logout
* data changes
* risk changes
* approvals
* overrides
* report generation

UI:

* filterable log
* timeline view
* export

---

12. SECURITY + ACCESS CONTROL

A. RBAC

* roles
* permissions
* access matrix

B. User Management

* status
* MFA required
* session tracking

C. Admin Controls

* permission overrides
* activity logs

---

13. INCIDENT MANAGEMENT (ISO)

Create incident register:

* incident type
* severity
* affected systems
* actions taken
* notifications required
* closure notes

---

14. VENDOR REGISTER

Track integrations:

* vendor name
* data shared
* risk rating
* review date
* contract status

---

15. DATA RETENTION

Add controls:

* retention rules
* archive status
* deletion logs
* legal hold

---

16. DASHBOARDS

A. Compliance Dashboard

* high risk clients
* AML alerts
* overdue reviews
* complaints
* breaches

B. Management Dashboard

* workload
* performance
* resolution times

C. Security Dashboard

* login activity
* incidents
* access risks

---

17. ADMIN PANEL

Create system control center:

* integrations (Equifax status)
* API logs
* error logs
* usage stats

---

18. CROSS-MODULE REQUIREMENTS

Every module must include:

* status
* owner
* timestamps
* comments
* attachments
* history
* export

---

19. DATA STRUCTURE EXPECTATION

Ensure backend supports:

* clients
* identity_checks
* screening_results
* entities
* ownership_structures
* affordability
* credit_reports
* property_data
* monitoring_alerts
* aml_programs
* risk_scores
* due_diligence_reviews
* smr_cases
* complaints
* breaches
* tasks
* audit_logs
* incidents
* vendors
* evidence

---

20. FINAL OUTPUT

Return:

* full upgraded system map
* all new modules
* updated client profile
* new components
* workflows
* dashboards
* admin panels

The system must function as a complete compliance, lending, audit, and governance platform with Equifax fully embedded.

It should be a multi-vertical compliance operating system with a shared core and industry-specific layers.

Core principle

All user types need the same base engine:

identity verification

KYB and beneficial ownership

sanctions, PEP, adverse media

source of funds and wealth

risk scoring

workflow gating

ongoing monitoring

audit trail

document storage

annual refresh

But each profession needs different:

onboarding questions

risk rules

evidence requirements

approval paths

document packs

review frequency

reporting outputs

integrations

regulator-facing logs

So the platform should have:

1. Shared Core Engine

Used by every vertical.

Shared modules

Client intake portal

Proposal and engagement

Identity verification

AML screening

KYB and ownership mapping

Risk scoring engine

Workflow engine

Monitoring engine

Case management

Reporting and audit export

2. Vertical Rule Packs

Each user type gets its own:

intake template

risk model

entity map

compliance checklist

approval workflow

document set

review cycle

dashboard view

That is how you make it best in class.

User types and what each needs differently
A. Accountants
Main use case

Client onboarding, annual re-engagement, tax and advisory compliance, Tranche 2 readiness, practice workflow sync.

What accountants need

individual, company, trust, SMSF, partnership onboarding

family group onboarding in one flow

engagement letters by entity or group

annual re-engagement

ATO and TPB style identity support

ethical clearance workflow

source document verification

practice management sync

document writeback to FYI

job creation in XPM

client data collection for ITR, BAS, tax, SMSF

Extra rules for accountants

reverify on annual engagement renewal

identify beneficial owners for business clients

collect service-purpose data

risk-rate clients by service line

separate workflow for bookkeeping vs tax vs advisory vs SMSF

Key integrations

Xero Practice Manager

FYI Docs

Xero Ledger

MYOB Practice

LodgeiT

Outlook / Microsoft 365

What wins this vertical

accountant-native UX

low-friction annual refresh

XPM/FYI deep sync

group entity onboarding

B. Credit Providers
Main use case

Lender onboarding for borrowers, guarantors, directors, beneficial owners, and security parties before funding.

What credit providers need

borrower and guarantor KYC

entity verification for borrower groups

director and UBO checks

source of funds and source of wealth

purpose of loan capture

asset and liability capture

security party onboarding

related-party exposure checks

loan-specific risk assessment

pre-settlement compliance clearance

post-settlement monitoring triggers

Extra rules for credit providers

no loan progression until KYC cleared

separate review for borrower, guarantor, and security provider

high-risk country or sanctions match blocks settlement

beneficial ownership tracing through layered borrower entities

politically exposed borrower escalation

refinance and repeat borrower fast-track with refresh rules

Key integrations

CRM / deal pipeline

loan origination system

document management

valuation and settlement workflow

e-signature

broker portal

What wins this vertical

deal-room style onboarding

settlement gating

guarantor and borrower linked review

lender-grade compliance pack

C. AFSL Holders
Main use case

Client onboarding, advice engagement, investor classification, AML and suitability controls, ongoing review.

What AFSL holders need

retail vs wholesale classification

investor eligibility capture

adviser and representative workflow

client identification and AML

beneficial ownership for entities and trusts

source of wealth for investment clients

risk profile and investment objective forms

fee consent and advice engagement workflow

ongoing client review and refresh

adviser approval trail

Extra rules for AFSL holders

separate flow for individual investor, family trust, company investor, SMSF

wholesale investor evidence capture

high-risk client escalations

product-specific onboarding rules

cooling-off, consent, and advice acknowledgment checkpoints

periodic re-screening for active investment clients

Key integrations

CRM

portfolio / investment platform

adviser file review tools

document management

e-signature

payment / investor portal

What wins this vertical

investor classification engine

linked advice plus compliance workflow

strong consent logs

ongoing client review cycle

D. Fund Managers
Main use case

Investor onboarding, AML, KYB, UBO mapping, subscription approval, ongoing monitoring, registry-ready records.

What fund managers need

investor onboarding

individual and entity investor verification

trust and company ownership tracing

UBO checks

source of wealth and funds

sanctions and PEP screening

tax residency and investor classification data

subscription document workflow

trustee and manager approval workflow

ongoing investor monitoring

redemption and transfer review triggers

Extra rules for fund managers

no subscription accepted until cleared

separate flow for wholesale vs institutional vs trust investor

complex ownership charting for entity investors

recurring re-screening on existing register

transfer or change-of-control triggers

audit-ready investor register with evidence

Key integrations

investor portal

fund registry

subscription system

document vault

payment / bank confirmation system

CRM

What wins this vertical

strong entity onboarding

investor register compliance view

ongoing screening of investor base

trustee and manager sign-off trail

E. Trustees

This can mean several types, so the system should support at least:

corporate trustees

individual trustees

fund trustees

security trustees

Main use case

Verify parties acting in fiduciary roles and prove control, authority, and trust relationships.

What trustees need

trust deed capture

trustee verification

appointor and controller capture

beneficiary class capture

settlor details if relevant

corporate trustee KYB

authorised signatory workflow

linked trust structure mapping

evidence of authority to act

ongoing control-change monitoring

Extra rules for trustees

must identify both legal owner and controlling person

trust relationship cannot stay as free text

appointor, guardian, trustee, and beneficiary roles need separate fields

authority documents required before action

trust amendments trigger re-review

Key integrations

document vault

legal document systems

fund or deal platform

signing tools

CRM

What wins this vertical

trust-specific ownership map

controller role engine

trust deed parsing

clear authority log

F. Legal Firms
Main use case

Matter opening, client due diligence, beneficial ownership, source checks, matter risk scoring, ongoing matter-based compliance.

What legal firms need

matter intake before file opening

client and beneficial owner verification

source of funds and wealth

matter purpose capture

jurisdiction and sanctions screening

counterparty capture

trust account risk controls

escalation to compliance partner

matter-level and client-level risk rating

refresh for ongoing or high-risk matters

Extra rules for legal firms

no file opening until minimum KYC done

enhanced due diligence for high-risk matters

separate rules by matter type, property, corporate, litigation, trust, private client

risk scoring based on service type and jurisdiction

counterparty and related party capture

trust money triggers and unusual transaction alerts

Key integrations

practice management

document management

e-signature

billing

Outlook / Microsoft 365

What wins this vertical

matter-based compliance workflows

compliance partner review queue

source-of-funds logic by matter type

trust account event triggers

G. Real Estate

This should split into two operating modes:

agency

development / transaction / property investment

Main use case

Vendor, purchaser, landlord, buyer, investor, and developer onboarding with AML, entity verification, and transaction-specific checks.

What real estate users need

seller and buyer KYC

landlord and tenant onboarding

company and trust buyer verification

beneficial ownership tracing

source of funds for purchasers or investors

PEP and sanctions screening

property-specific transaction record

authority to act checks

agent and representative capture

settlement readiness status

Extra rules for real estate

transaction-linked KYC, not just client-level KYC

purchaser entity tracing for trusts and companies

offshore buyer risk rules

property deposit and funds-source triggers

agent authority docs

repeat buyer refresh rules

deal-based audit pack

Key integrations

CRM

listing / deal management

e-signature

trust accounting system

document storage

settlement workflow

What wins this vertical

transaction-based KYC

party-role mapping by property

offshore and high-risk buyer workflow

settlement and authority controls

Build structure by user type

The clean way to build this is:

Shared tables

Person

Entity

Client Group

Role

Ownership Link

Verification Check

Screening Result

Risk Assessment

Document

Case

Approval

Monitoring Event

Engagement

Payment

Workflow Task

Vertical-specific overlays
Accountants overlay

Tax profile

Service type

Annual re-engagement cycle

Ethical clearance

Practice sync profile

Credit providers overlay

Deal

Facility

Security party

Guarantor

Settlement condition

Loan purpose

Credit risk flags

AFSL overlay

Investor classification

Advice consent

Product suitability profile

Adviser assignment

Review cycle

Fund manager overlay

Subscription

Investor register status

Redemption event

Fund eligibility

Wholesale status

Trustee approval

Trustee overlay

Trust role map

Authority record

Deed variation event

Appointor / guardian controls

Legal overlay

Matter

Matter type

Trust account trigger

Counterparty

Compliance partner review

Real estate overlay

Property

Transaction

Vendor / buyer / landlord / tenant role

Authority to act

Settlement status

Role types inside the platform

The system also needs internal user roles.

Internal firm users

Admin

Compliance Manager

Reviewer

Relationship Manager

Operations

Partner / Director

Auditor / Read-only

External users

Individual client

Entity representative

Director

Trustee

Guarantor

Investor

Broker

Adviser

Lawyer

Agent

Each role should have different:

document upload rights

approval rights

visibility

sign-off rights

edit permissions

escalation ability

What changes by industry

These six things should be configurable by vertical:

1. Intake questions

A legal matter needs different fields than a mortgage borrower or accounting client.

2. Required parties

A fund manager needs investor plus trustee plus UBO.
A lender needs borrower plus guarantor plus security provider.

3. Risk model

Real estate offshore buyer risk is different from accountant annual tax client risk.

4. Required evidence

Accountants may need source documents and engagement proof.
Credit providers need loan purpose, security, and guarantor evidence.
Legal firms need matter purpose and source of funds.

5. Approval path

High-risk investor may need trustee sign-off.
High-risk legal matter may need compliance partner sign-off.
High-risk borrower may need credit committee clearance.

6. Monitoring rules

Fund managers need ongoing investor screening.
Accountants need annual re-engagement.
Credit providers need pre-settlement and post-settlement triggers.

Recommended product structure

The best structure is:

Product name level

Compliance OS

Vertical packs inside it

Compliance OS for Accountants

Compliance OS for Credit Providers

Compliance OS for AFSL Holders

Compliance OS for Fund Managers

Compliance OS for Trustees

Compliance OS for Legal Firms

Compliance OS for Real Estate

Each pack uses the same engine, but changes:

forms

rules

dashboards

outputs

integrations

document packs

Best-in-industry position after adding verticals

Now the product is no longer just better than Seamlss or VerifiMe.

Now it becomes:

A multi-industry compliance and onboarding platform with one core engine and vertical rule packs.

That is much bigger.

It means you can sell the same platform into:

accounting

lending

investment

legal

trustee

property

without rebuilding from scratch.

What should be added to the PRD now

Add a full section called:

Vertical User Packs

For each vertical define:

target users

onboarding flow

required entities

required person roles

required documents

risk rules

decision rules

monitoring rules

integrations

dashboard widgets

export packs

Then add:

Persona-based workflow matrix

Map:

who the user is

what they can do

what they must collect

who approves

what blocks progression

Vertical template engine

A configuration layer for:

form templates

rule templates

document templates

email templates

approval templates

monitoring schedules

The next clean step is a full user-type matrix table with columns for documents, workflows, risk rules, integrations, and outputs for each vertical.
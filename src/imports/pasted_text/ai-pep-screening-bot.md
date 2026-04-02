Objective

Design an AI PEP Screening Bot that runs two workflows:

New client PEP screening during onboarding

Monthly global PEP rescreening for all active clients, representatives, and beneficial owners

The bot must support Grow’s current due diligence flow where sanctions are mandatory, PEP checks are required for clients and representatives, and for entities also extend to beneficial owners and related parties. It must capture search terms, date of check, result, role classification, and evidence.

It also needs to align with AUSTRAC guidance that firms must have risk-based procedures to identify whether a customer or beneficial owner is a PEP, and that foreign PEPs must be treated as high risk and pushed into enhanced due diligence.

What the bot must do
Core job

The bot checks whether a person is:

Not a PEP

Domestic PEP

Foreign PEP

International organisation PEP

Possible family member of PEP

Possible close associate of PEP

Unclear, needs analyst review

This matches your onboarding forms, which already require the result to be recorded and classified by PEP type.

Who must be checked

The bot must be able to screen:

individual clients

client representatives

directors

beneficial owners

trustees

beneficiaries where required

CEOs where beneficial owner cannot be identified

existing clients on monthly review

Your current due diligence forms already require PEP screening across these roles.

Product position

This is not just a search box.

It is a PEP screening workbench with:

AI name matching

global public-source search orchestration

evidence capture

risk classification

reviewer queue

monthly monitoring

full audit trail

That fits your internal direction to adopt a digital PEP check process that can exceed the manual process in the AML starter kit.

Figma screens to build

Build the product as 9 screens plus shared components.

Screen 1. PEP Control Centre

This is the landing dashboard.

Purpose

Show everything that needs action now.

Layout

Top row KPI cards:

New clients awaiting PEP check

Monthly reviews due

Possible PEP matches

Foreign PEPs

Escalated cases

Overdue reviews

Middle left:

Queue table: New checks

Columns: Name, role, entity, country, created date, status, risk

Middle right:

Queue table: Monthly rescreens

Columns: Name, last screened, next due, current status, priority

Bottom:

Alerts panel

Recent matches

System health

Source sync health

Failed search jobs

Filters

individual / entity

domestic / foreign / international org

client / representative / BO / beneficiary / trustee / CEO

country

risk rating

status

assigned reviewer

Actions

Run new check

Run batch check

Review possible matches

Export report

View audit log

Screen 2. New Client PEP Check Wizard
Purpose

Run PEP screening during onboarding.

Step 1: Person details

Fields:

full legal name

known aliases

date of birth

country of residence

nationality

occupation

role in matter

entity linked to

beneficial ownership %

known political exposure declaration yes/no

family member or associate declaration yes/no

Step 2: Search scope

Options:

standard search

expanded global search

enhanced search for high-risk country

include transliteration variants

include historic office holders

include family and associate search

Step 3: AI search plan

System shows:

search sources to be used

keywords and translated variants

confidence rules

expected runtime

any missing data warnings

Step 4: Results

Cards:

No PEP indicators

Possible domestic PEP

Possible foreign PEP

Possible IO PEP

Possible family member

Possible close associate

Insufficient data

Each card shows:

confidence score

matched role

matched country

matched source

reason

evidence preview

Step 5: Analyst decision

Choices:

mark not a PEP

mark domestic PEP

mark foreign PEP

mark international organisation PEP

mark family / associate of PEP

send to senior review

request more info

Step 6: Outcome

System writes:

result

date of check

sources searched

search terms used

reviewer

final risk impact

next review date

This fits your forms, which require search terms, date, and result, with screenshots or software verification attached.

Screen 3. Monthly Rescreening Scheduler
Purpose

Manage recurring global PEP monitoring.

Layout

Calendar and queue hybrid.

Sections:

Due today

Due this week

Overdue

Failed jobs

New alerts since last month

Scheduler settings

frequency: monthly default

high-risk clients: weekly or daily option

foreign PEPs: enhanced monitoring toggle

trigger on role change

trigger on ownership change

trigger on adverse media hit

trigger on sanctions hit

trigger on new country exposure

AUSTRAC says ongoing CDD should allow for an existing customer to become a PEP during the relationship, and firms must update status and ECDD where needed.

Screen 4. Search Results Review Workbench
Purpose

This is the analyst review screen.

Left panel

Search result clusters:

exact name match

probable match

weak match

historic office holder

family / associate clue

duplicate / ignore

Centre panel

Entity resolution timeline:

searched name

variants used

country weighting

translated names

matched titles

matched dates

source reliability

Right panel

Decision panel:

final classification

reason

ECDD required yes/no

senior approval required yes/no

source of wealth required yes/no

enhanced monitoring yes/no

notes

attach evidence

Bottom drawer

Evidence viewer:

article snapshot

government profile

parliament page

official org biography

archived page

screenshot record

Screen 5. Person Profile and Monitoring Record
Purpose

Single record of PEP history.

Tabs

Overview

Screening history

Current status

Related entities

Family / associate links

Evidence

Risk actions

Audit log

Overview fields

legal name

aliases

DOB

nationality

residence

linked entities

current role

current PEP status

first flagged date

last reviewed date

next review date

reviewer owner

Risk actions panel

source of funds complete

source of wealth complete

senior approval complete

transaction monitoring uplifted

restrictions applied

This follows AUSTRAC’s requirement that high-risk PEPs, including foreign PEPs, move into ECDD with source of funds, source of wealth, senior management approval, and closer monitoring.

Screen 6. Case Escalation Screen
Purpose

Handle possible or confirmed PEPs.

Workflow states

screening complete

possible match

analyst review

escalated to compliance

approved with controls

blocked pending info

rejected

monitoring active

Required fields for escalation

why escalated

PEP type

role held

jurisdiction

source links

confidence

risk factors

recommended controls

approval decision

approval date

Your current forms already require escalation when risk increases or onboarding checks are not satisfied.

Screen 7. Admin Rules Engine
Purpose

Let compliance set the logic.

Rule categories

PEP type weighting

country risk weighting

source reliability weighting

match confidence threshold

auto-clear threshold

manual review threshold

high-risk triggers

review interval rules

Example rules

foreign PEP = automatic high risk

domestic PEP = medium by default, upgrade if procurement, licensing, or state-owned enterprise connection

IO PEP = medium by default

family member of foreign PEP = high risk review

close associate + high-risk jurisdiction = escalate

Foreign PEPs must always be treated as high risk under AUSTRAC guidance.

Screen 8. Reporting and Audit Export
Purpose

Produce regulator-ready evidence.

Reports

new client PEP summary

monthly monitoring report

open escalation register

foreign PEP register

overdue review report

source coverage report

search failure report

client-level audit pack PDF

Each report must show

person checked

linked role

date

search terms

sources searched

result

reviewer

escalation path

final risk treatment

next review date

This aligns with your internal forms requiring the date of search, search steps used, and final yes/no result.

Screen 9. Source Management Screen
Purpose

Control which global sources the bot uses.

Source groups

official government and parliament sites

official international organisation leadership pages

public beneficial ownership and registry data where available

trusted news sources

archive sources

paid vendor connectors later

Each source row shows

source name

coverage type

countries covered

language support

reliability score

last crawl

active / paused

legal basis notes

Shared components to design

Build these as reusable components:

person card

entity card

match card

confidence badge

risk badge

evidence tile

search source chip

status chip

escalation banner

timeline row

audit event row

review form drawer

filter side panel

bulk action toolbar

User roles

Design for 5 user roles.

1. Intake officer

run new client checks

view results

request more info

cannot clear high-risk cases

2. Compliance analyst

review possible matches

classify PEP type

attach evidence

escalate

3. Compliance manager / MLRO

approve high-risk onboarding

set controls

close escalations

adjust monitoring frequency

4. Partner / director

view risk summary

approve relationship for high-risk clients

export reports

5. Admin

manage rules

manage sources

manage templates

manage integrations

AI bot logic for the builder to model

The Figma prototype should clearly show the bot logic.

Input

The bot receives:

person name

aliases

date of birth

citizenship

residence

linked entity

role type

country context

declared PEP status

related party links

Search engine steps

Clean and standardise the name

Generate alias variations

Generate transliterations if needed

Search official sources first

Search reputable public sources second

Search family and associate clues where needed

Cluster results by person identity

Score confidence

Produce proposed classification

Route to analyst if confidence not high enough

Confidence rules

Use three layers:

identity confidence

role confidence

PEP relevance confidence

Example scoring

same name + same DOB + official government page = very high

same name + same country + news article only = medium

same name only = low

family member relation inferred only from weak media = low

The bot must never auto-clear on weak identity evidence.

Exact source strategy to reflect in the UI

Since there is no single free official global PEP list, the bot should be designed around a multi-source public intelligence model, with a later paid-database connector layer. AUSTRAC explicitly says firms may use vendor databases, but should not assume a person is not a PEP just because they do not appear in one. It also says procedures may include onboarding questions, internet checks, and specialist databases.

Free-source layer

The builder should model these source classes:

national parliament websites

government cabinet and ministry pages

central bank leadership pages

supreme court and constitutional court leadership pages

embassy and diplomatic mission pages

military leadership pages where official

state-owned enterprise board pages where official

UN, WTO, NATO and other international organisation leadership pages

official gazettes and archived government pages

reliable media for family and associate links

Paid-source layer

Leave connector placeholders for:

commercial PEP databases

identity verification vendors

adverse media vendors

corporate registry vendors

Search coverage rules

The bot must support:

all countries

all major scripts

alternate spellings

former office holders

current office holders

family members

close associates

beneficial owners tied to a PEP

clients who become PEPs after onboarding

AUSTRAC states that family members and close associates count, and that an existing customer can become a PEP during the relationship, which is why monthly review matters.

Required statuses

Use these statuses across the product:

Not started

Queued

Searching

Needs analyst review

Possible PEP

Confirmed domestic PEP

Confirmed foreign PEP

Confirmed IO PEP

Family / associate flagged

Escalated

Approved with controls

Blocked

Closed

Monitoring active

Monitoring overdue

Required data fields

The Figma builder must show these fields in the data model.

Person

person_id

full_name

aliases[]

DOB

nationality[]

residence_country

occupation

role_type

linked_entity_id

declared_pep_flag

declared_family_associate_flag

Screening event

screening_id

person_id

screening_type new / monthly / triggered

triggered_by

search_terms_used

search_languages_used

sources_searched[]

started_at

completed_at

bot_outcome

analyst_outcome

confidence_score

review_required_flag

Match record

match_id

screening_id

source_name

source_url

matched_name

matched_role

matched_country

matched_dates

source_type official / media / archive / vendor

reliability_score

evidence_snapshot

identity_confidence

role_confidence

pep_confidence

Compliance action

action_id

person_id

action_type ecdd / source_of_funds / source_of_wealth / senior_approval / monitor

status

owner

due_date

completed_date

Monitoring plan

monitoring_id

person_id

frequency

next_review_date

enhanced_monitoring_flag

change_trigger_rules[]

last_result

Workflow rules to visualise
New client workflow

Client onboarded

Sanctions check runs

PEP check runs

If no match, continue

If possible match, send to analyst

If foreign PEP confirmed, mark high risk and trigger ECDD

If domestic or IO PEP confirmed, risk assess and escalate if needed

Record evidence

Set next review date

Allow or block onboarding

This fits Grow’s internal onboarding sequence where PEP screening happens before engagement and commencement of services.

Monthly monitoring workflow

Scheduler picks active clients due this month

Bot reruns global search

Compare against prior result

If status unchanged, log pass

If new signals appear, create review case

If person now qualifies as PEP, update status

Trigger ECDD and approval rules

Notify assigned compliance owner

Update dashboard and audit trail

Alerts to design

The UI must include alerts for:

new foreign PEP identified

existing client became PEP

possible family associate link found

official source removed or changed

monthly review overdue

source search failed

missing DOB reduced confidence

duplicate person records found

unresolved escalation older than X days

Design style for Figma

Use a serious compliance style, not fintech marketing style.

Visual tone

white or light neutral background

dark text

muted status colours

strong use of tables, panels, timelines

evidence-first layouts

no clutter

no playful illustrations

Status colours

grey = not started

blue = queued / in progress

amber = review required

red = escalated / blocked / high risk

green = cleared / approved

purple = monitoring active

UX principles

reviewer can decide fast

evidence is always visible

no hidden risk logic

every decision must be explainable

export must be one click

What not to build

Do not design the bot as:

a chat-only interface

a simple Google search wrapper

a black-box AI result with no evidence

a one-time onboarding tool only

a sanctions-only screen renamed as PEP

a tool that clears matches without human review

Mandatory compliance notes for the builder

The prototype must reflect these rules:

PEP checks apply to customers and beneficial owners.

Foreign PEPs must be treated as high risk.

High-risk PEPs require ECDD, including source of wealth, source of funds, senior approval, and closer monitoring.

A person can become a PEP after onboarding, so ongoing CDD and monitoring must exist.

Internal process must capture search terms, date of check, evidence, and final yes/no classification.

Final instruction to the Figma builder

Build a prototype called:

Global PEP Screening Bot

Include these modules:

Dashboard

New Check Wizard

Monthly Monitoring Queue

Review Workbench

Person Profile

Escalation Case

Rules Engine

Reporting

Source Management

The prototype should show two complete user journeys:

new client screened and cleared

existing client becomes a foreign PEP on monthly review and gets escalated

That second journey is the one that proves the product is better than the market.
Objective

Design an AI Adverse Media Screening Bot that runs two workflows:

New client adverse media screening during onboarding

Monthly adverse media rescreening for all active clients, directors, guarantors, beneficial owners, trustees, and related parties

This bot must detect negative public information that may indicate financial crime, fraud, dishonesty, regulatory breaches, insolvency risk, corruption, litigation exposure, or reputational risk.

This is not a news reader.

It is a compliance-grade adverse media workbench with:

AI search orchestration

multi-source evidence capture

entity resolution

risk classification

analyst review queue

monthly monitoring

full audit trail

escalation into ECDD and risk review

What the bot must do
Core job

The bot checks whether a person or entity has adverse public information linked to:

fraud

money laundering

bribery or corruption

sanctions evasion

terrorism financing

tax evasion

phoenix activity

insolvency

bankruptcy

winding up

director bans

court actions

regulatory action

licence cancellation

disqualification

criminal charges

civil misconduct

media allegations

reputational controversy

association with high-risk counterparties

Output classifications

The bot must classify results into:

No adverse media found

Low relevance mention

Possible adverse media

Confirmed adverse media

Severe adverse media

Legal action only

Insolvency event

Regulatory action

Financial crime concern

Reputational concern only

Unclear, analyst review required

Who must be screened

The bot must screen:

individual clients

companies

trusts, via controlling persons

directors

shareholders

beneficial owners

trustees

appointors and controllers

guarantors

borrowers

investors

authorised representatives

related entities where risk spillover exists

Product position

This is not just a search box.

It is an adverse media decision engine that:

searches globally

clusters articles and notices

resolves whether the result matches the correct person or entity

scores severity

proposes a compliance outcome

routes to review

tracks changes month to month

Figma screens to build

Build this as 10 screens plus shared components.

Screen 1. Adverse Media Control Centre
Purpose

Main dashboard for all open screening work.

Layout

Top KPI cards:

New clients awaiting media screening

Monthly reviews due

Possible matches

Severe alerts

Escalated cases

Overdue reviews

Failed search jobs

New insolvency or court alerts

Middle left:

Queue table: New checks

Columns: Name, type, role, country, created date, status, priority

Middle right:

Queue table: Monthly rescreens

Columns: Name, last review, next due, current result, alert delta, assigned owner

Bottom:

Recent alerts feed

Search health feed

Source sync issues

High-risk jurisdictions panel

Filters

person / entity

client / BO / director / guarantor / borrower / investor

country

media risk type

legal / insolvency / regulatory / criminal / reputational

status

severity

reviewer

date range

Actions

Run new screen

Run batch screen

Review alerts

Export report

View audit log

Screen 2. New Adverse Media Check Wizard
Purpose

Run adverse media screening during onboarding.

Step 1: Subject details

Fields:

full legal name

aliases

entity name

trading names

date of birth

country of residence

nationality

role in matter

linked entity

director or BO status

known high-risk industry

known litigation disclosure yes/no

known insolvency disclosure yes/no

Step 2: Search scope

Options:

standard search

expanded global search

high-risk enhanced search

include legal databases and court references

include regulatory notices

include insolvency and bankruptcy terms

include related parties

include historic records

include translated and transliterated terms

Step 3: AI search plan

System shows:

sources selected

keyword families

translated search terms

entity resolution rules

expected runtime

missing data warnings

Step 4: Results summary

Cards:

No relevant adverse media

Possible match

Confirmed legal issue

Confirmed insolvency issue

Confirmed regulatory action

Confirmed crime or fraud risk

Reputational concern only

Insufficient confidence

Each card shows:

confidence score

severity score

issue type

country

top source

first seen date

last seen date

evidence preview

Step 5: Analyst decision

Choices:

clear, no adverse media

record low relevance only

confirm adverse media

escalate for enhanced review

request more information

link to related subject

mark false positive

Step 6: Outcome

System writes:

final result

severity

issue category

search terms used

sources searched

reviewer

risk impact

next review date

Screen 3. Monthly Rescreening Scheduler
Purpose

Manage recurring media monitoring.

Layout

Calendar and queue hybrid.

Sections:

Due today

Due this week

Overdue

Failed searches

New alerts since last run

High-risk subjects on accelerated cycle

Scheduler settings

monthly default

weekly for high-risk

daily for escalated severe cases

trigger on entity ownership change

trigger on country change

trigger on sanctions hit

trigger on PEP confirmation

trigger on new court event

trigger on insolvency notice

Monitoring options

compare only new sources

rerun full search every cycle

boost recent results

keep archived articles visible

generate delta summary

Screen 4. Search Results Review Workbench
Purpose

Main analyst review screen.

Left panel

Result clusters:

exact identity match

probable match

weak match

legal action cluster

regulatory cluster

insolvency cluster

crime / fraud cluster

reputational cluster

duplicate / ignore

Centre panel

Entity resolution timeline:

searched subject

aliases used

jurisdictions searched

related party names searched

translated variants

matched dates

role overlap

source reliability

recurrence count

Right panel

Decision panel:

final classification

severity level

linked risk themes

ECDD required yes/no

source of wealth required yes/no

senior approval required yes/no

monitoring uplift yes/no

notes

attach evidence

Bottom drawer

Evidence viewer:

article snapshot

official notice

court result extract

insolvency register notice

regulator media release

archived page

screenshot log

Screen 5. Subject Profile and Media History
Purpose

Single compliance profile for a person or entity.

Tabs

Overview

Screening history

Current findings

Related parties

Linked entities

Evidence

Risk actions

Audit log

Overview fields

legal name

aliases

DOB if person

entity type if business

countries linked

role in matter

linked entities

current adverse media status

highest severity to date

first flagged date

last reviewed date

next review date

assigned owner

Risk actions panel

ECDD active

source of funds requested

source of wealth requested

senior approval pending

relationship restricted

ongoing monitoring uplifted

onboarding blocked

Screen 6. Escalation Case Screen
Purpose

Handle serious or uncertain adverse media results.

Workflow states

screening complete

possible match

analyst review

escalated

approved with controls

blocked pending info

relationship declined

monitoring active

closed

Required fields

reason for escalation

issue category

severity

jurisdiction

source links

confidence

related criminal or civil themes

recommended controls

approval decision

approval date

Severity model

Level 1 - low relevance

Level 2 - moderate concern

Level 3 - material concern

Level 4 - severe concern

Level 5 - prohibited or intolerable risk

Screen 7. Rules Engine
Purpose

Allow compliance to control logic.

Rule categories

source reliability weighting

severity weighting

country risk weighting

issue category weighting

recency weighting

repeat mention weighting

official source uplift

weak media downgrade

false-positive thresholds

auto-clear thresholds

manual review thresholds

escalation thresholds

Example rules

official regulator action = minimum Level 3

active fraud charge = Level 4 or above

insolvency only, older than 7 years = Level 2 unless repeated

one weak article with no identity match = review only

bankruptcy plus director disqualification = escalate

repeated allegations across credible sources = uplift severity

court judgement naming subject = official evidence boost

Screen 8. Reporting and Audit Export
Purpose

Produce compliance-ready outputs.

Reports

new client adverse media summary

monthly monitoring report

open escalation register

severe risk register

insolvency and court action register

regulatory action register

false-positive log

source coverage report

failed search report

client audit pack PDF

Each report must show

subject checked

linked role

search date

search terms

sources searched

result

issue types

severity

reviewer

escalation path

final treatment

next review date

Screen 9. Source Management Screen
Purpose

Control source coverage.

Source groups

official regulator websites

official court and tribunal sources

insolvency and bankruptcy sources

official government gazettes

company register and enforcement notices

reputable news sites

archived web sources

vendor connectors later

Each source row shows

source name

source type

countries covered

language support

reliability score

recency score

legal notes

last crawl

active / paused

Screen 10. Bulk Screening and Portfolio Monitor
Purpose

Let firms run adverse media checks across the full client base.

Layout

Top actions:

upload list

screen all active clients

screen only high-risk clients

rerun failed jobs

export portfolio summary

Table columns

subject

role

country

prior result

latest result

delta

severity

assigned owner

next review date

Bulk actions

assign reviewer

escalate selected

change frequency

export cases

merge duplicates

suppress false positives

Shared components to design

Build these reusable components:

subject card

entity card

result card

issue tag

severity badge

confidence badge

evidence tile

source chip

timeline event row

audit row

article preview card

review drawer

escalation banner

filter side panel

bulk toolbar

delta status chip

User roles

Design for 5 roles.

1. Intake officer

run first-pass checks

view results

request more info

cannot clear severe cases

2. Compliance analyst

review matches

classify issue type

confirm or reject matches

attach evidence

escalate

3. Compliance manager / MLRO

approve high-risk decisions

set controls

decide whether onboarding proceeds

adjust monitoring frequency

4. Partner / director

view summary

approve high-risk relationships

export reports

5. Admin

manage rules

manage sources

manage templates

manage integrations

AI bot logic for the builder to model

The prototype must clearly show the search logic.

Input

The bot receives:

person or entity name

aliases

DOB if person

linked entity

role

countries linked

industry

known related parties

declared disclosures

prior screening history

Search engine steps

Clean and standardise the subject name

Generate alias variants

Add translated and transliterated forms if needed

Generate keyword families by risk type

Search official and high-trust sources first

Search reputable public media second

Search court, insolvency, and regulator terms

Search related parties if configured

Cluster results by likely identity

Score confidence and severity

Produce proposed classification

Route to analyst if not clearly false positive or clearly low-risk

Confidence layers

Use three layers:

identity confidence

source confidence

issue relevance confidence

Severity layers

Use separate severity:

reputational severity

legal severity

regulatory severity

financial crime severity

Example logic

same name + DOB + official court judgement = very high confidence

same company name + ASIC or regulator notice = high confidence

same name only + weak blog = low confidence

multiple credible news reports over time = medium to high depending on details

allegation only with no reliable corroboration = review, not severe

The bot must never auto-escalate purely on weak identity matching.
The bot must never auto-clear a serious official source without human review.

Exact source strategy to reflect in the UI

Design the bot around a multi-source intelligence model.

Free-source layer

Model these source classes:

government regulators

official court and tribunal sites

insolvency and bankruptcy notices

gazettes

company enforcement notices

parliamentary records

official law enforcement press releases

major credible media

archived pages

Source categories to show

official

legal

regulatory

insolvency

news

archive

vendor

Paid-source layer

Leave connector placeholders for:

adverse media vendors

legal database vendors

credit bureau alerts

company registry vendors

sanctions and KYC vendors

Search coverage rules

The bot must support:

global countries

multiple scripts

alternate spellings

old and current results

historic enforcement events

related party spillover

individuals and entities

clients who develop new adverse media after onboarding

Required statuses

Use these statuses:

Not started

Queued

Searching

Needs analyst review

Possible match

Confirmed adverse media

Low relevance only

Severe alert

Escalated

Approved with controls

Blocked

Closed

Monitoring active

Monitoring overdue

False positive confirmed

Required data fields

The Figma builder must show these fields in the data model.

Subject

subject_id

subject_type person / entity

full_name

aliases[]

DOB

nationality[]

residence_country

entity_type

role_type

linked_entity_id

industry

high_risk_flag

Screening event

screening_id

subject_id

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

severity_score

review_required_flag

Match record

match_id

screening_id

source_name

source_url

source_type

matched_name

matched_entity

matched_country

matched_dates

issue_category

issue_subcategory

reliability_score

recency_score

evidence_snapshot

identity_confidence

issue_confidence

severity_score

Compliance action

action_id

subject_id

action_type ecdd / source_of_funds / source_of_wealth / senior_approval / monitor / restrict / decline

status

owner

due_date

completed_date

Monitoring plan

monitoring_id

subject_id

frequency

next_review_date

enhanced_monitoring_flag

change_trigger_rules[]

last_result

last_delta_summary

Workflow rules to visualise
New client workflow

Subject onboarded

Sanctions and PEP checks run

Adverse media check runs

If no match, continue

If possible match, send to analyst

If confirmed serious issue, escalate

Trigger ECDD or block if needed

Record evidence

Set next review date

Allow or stop onboarding

Monthly monitoring workflow

Scheduler selects due subjects

Bot reruns searches

Compare against prior result

If unchanged, log pass

If new results found, create alert case

If severity increased, escalate

Notify owner

Update dashboard and audit trail

Triggered review workflow

A triggered review should run immediately when:

sanctions result changes

PEP status changes

ownership changes

country exposure changes

new insolvency event is logged

regulator action appears

a new related party is added

Alerts to design

The UI must include alerts for:

new severe adverse media identified

existing client now linked to court action

new insolvency or bankruptcy result

director disqualification found

regulatory enforcement action found

repeated fraud or bribery mentions

monthly review overdue

search failed

missing DOB reduced confidence

duplicate subjects found

unresolved escalation older than X days

Design style for Figma

Use a serious compliance style.

Visual tone

light neutral background

dark text

evidence-first interface

high-density tables where needed

side panels and timelines

minimal decoration

no playful graphics

Status colours

grey = not started

blue = queued / searching

amber = review required

red = severe / escalated / blocked

green = cleared

purple = monitoring active

UX principles

decisions must be fast

evidence must stay visible

issue type must be obvious

source quality must be visible

every decision must be explainable

export must be one click

What not to build

Do not design this as:

a chat-only interface

a generic news feed

a black-box AI score with no evidence

a one-time onboarding screen only

a sanctions screen renamed as adverse media

a system that auto-declines without human review

a system that treats every article as equal

Mandatory logic notes for the builder

The prototype must reflect these rules:

official legal and regulatory sources carry the highest weight

weak or anonymous sources should not drive severe outcomes alone

old issues should remain visible but be clearly dated

severity must consider recency, reliability, and relevance

the system must capture search terms, date of check, evidence, and final classification

ongoing monitoring must exist because new adverse media can arise after onboarding

Final instruction to the Figma builder

Build a prototype called:

Global Adverse Media Screening Bot

Include these modules:

Dashboard

New Check Wizard

Monthly Monitoring Queue

Review Workbench

Subject Profile

Escalation Case

Rules Engine

Reporting

Source Management

Bulk Portfolio Monitor

The prototype should show two complete user journeys:

new client screened and cleared

existing client gets new severe adverse media on monthly review and is escalated

That second journey proves the system is better than most onboarding tools.
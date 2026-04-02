SANCTIONS SCREENING BOT - FULL BUILD SPEC
Objective

Detect whether a subject is on any sanctions list and enforce a hard stop decision if confirmed.

This is your non-negotiable compliance gate.

What the bot must detect
Lists to cover (free + core)

DFAT consolidated list

UN sanctions list

OFAC SDN list

UK HMT list

EU consolidated list

Subject types

individuals

entities

vessels

aliases

translated names

Output classifications

No match

Possible match

Confirmed match

False positive

Mandatory rule

Confirmed match → AUTO BLOCK + ESCALATE

Screen 1. Sanctions Control Centre
KPI Cards

New screenings pending

Possible matches

Confirmed hits

Escalations

Monitoring alerts

Failed screenings

Tables

New Screenings

Name

Type (person/entity)

Country

Created date

Status

Priority

Monitoring Alerts

Name

Last screened

New match detected

Severity

Assigned reviewer

Filters

person/entity

country

list source

status

risk level

reviewer

Actions

run new screening

run batch screening

review matches

export results

view audit log

Screen 2. Sanctions Screening Wizard
Step 1 - Input

Fields:

full legal name

aliases

date of birth

nationality

residence country

entity name

registration country

Step 2 - Search Configuration

Options:

standard screening

expanded global screening

include fuzzy matching

include transliteration

include vessel search (if applicable)

Step 3 - AI Search Plan

Display:

lists being checked

alias variants generated

fuzzy match thresholds

confidence rules

expected runtime

Step 4 - Results Summary

Grouped into:

exact matches

probable matches

weak matches

Each result shows:

source (DFAT, OFAC etc)

matched name

alias matched

country

DOB or identifier

reason for listing

confidence score

Step 5 - Analyst Decision

Options:

confirm match

mark false positive

escalate

request more info

Step 6 - Outcome

System logs:

final decision

reviewer

timestamp

sources checked

match details

audit record

Screen 3. Match Review Workbench
Left Panel

match clusters

exact / probable / weak

Centre Panel

Identity comparison:

name similarity

DOB comparison

country comparison

alias match breakdown

Right Panel

Decision:

confirmed sanctions match → BLOCK

false positive

escalate

Bottom Drawer

Evidence:

list record snapshot

identifiers

match explanation

Screen 4. Subject Sanctions Profile
Fields

name

aliases

DOB

nationality

match status

list source

decision

reviewer

timestamps

Tabs

screening history

match details

audit log

Screen 5. Monitoring Scheduler
Purpose

Ongoing sanctions checks

Settings

frequency: monthly default

high-risk: daily

trigger on:

new transaction

onboarding

ownership change

Alerts

new sanctions match

list update detected

screening failure

Core Rules

exact match + DOB = high confidence

sanctions hit = cannot proceed

all matches require review

no silent auto-clear on weak data

IDENTITY VERIFICATION BOT - FULL BUILD SPEC
Objective

Verify:

person is real

document is valid

person matches document

What the bot must do

OCR extraction

biometric face match

document authenticity check

expiry validation

duplicate detection

Output classifications

Verified

Verified with warning

Failed

Manual review required

Screen 1. Identity Control Centre
KPI Cards

pending verifications

completed

failed

manual reviews

duplicate alerts

Tables

active verifications

failed attempts

Screen 2. Verification Flow
Step 1 - Document Upload

Supported:

passport

driver licence

secondary ID

Step 2 - Selfie Capture

live capture

liveness detection

anti-spoofing

Step 3 - Processing

Display:

extracted data

face match %

document validity

expiry status

Step 4 - Results

Cards:

verified

mismatch

suspicious document

expired ID

low confidence

Step 5 - Analyst Review

Options:

approve

reject

request new document

Screen 3. Review Workbench
Left

document image

Centre

extracted vs provided data

Right

Decision:

approve

reject

escalate

Screen 4. Identity Profile

Fields:

full name

DOB

document number

expiry date

verification status

face match score

Tabs

documents

history

audit log

Screen 5. Duplicate Detection Panel

Shows:

possible duplicate identities

matching fields

confidence

Core Rules

expired ID = fail

name mismatch = review

low face match = review

duplicate identity = flag

KYB AND ENTITY VERIFICATION BOT - FULL BUILD SPEC
Objective

Verify:

business exists

is active

data matches official records

What the bot must check

ABN

ACN

GST status

entity status

registration data

directors

company type

trust type (via documents)

Output classifications

Verified

Verified with inconsistency

Failed

Manual review

Screen 1. KYB Control Centre
KPI Cards

pending entities

verified

mismatches

failed checks

Tables

entity queue

flagged inconsistencies

Screen 2. Entity Verification Wizard
Step 1 - Input

entity name

ABN

ACN

country

Step 2 - Registry Lookup

Pull:

official registry data

status

directors

GST status

Step 3 - Results Comparison

Table:

Name vs registry

ABN vs registry

ACN vs registry

Directors vs registry

Status vs registry

Step 4 - Results Summary

Cards:

verified

mismatch

inactive entity

missing data

Step 5 - Analyst Decision

Options:

approve

flag inconsistency

escalate

request documents

Screen 3. Entity Profile

Fields:

entity name

ABN / ACN

GST status

status

directors

linked persons

Tabs

verification history

documents

audit log

Screen 4. Review Workbench
Left

registry data

Centre

comparison view

Right

Decision:

approve

escalate

request info

Screen 5. Monitoring
Purpose

Detect changes in entity status

Triggers:

director change

status change

deregistration risk

Core Rules

inactive entity = fail

ABN mismatch = fail

director mismatch = review

missing key data = incomplete

FINAL TIER 1 SYSTEM FLOW

Figma must show this full journey:

Client onboarded

Identity verified

Entity verified

Sanctions cleared

PEP check runs

Adverse media check runs

Decision made

FINAL INSTRUCTION TO FIGMA BUILDER

Create three modules:

Sanctions Screening Bot

Identity Verification Bot

KYB Verification Bot

Each module must include:

dashboard

wizard

review workbench

profile

monitoring

audit log

And show two flows:

clean client passes all checks

client fails sanctions and gets blocked
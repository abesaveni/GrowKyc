-- --------------------------------------------------------
-- Retention and legal hold fields for database-layer
-- compliance tables.
-- Mirrors the pattern from:
--   supabase/migrations/005_retention_metadata_support.sql
--   supabase/migrations/006_legal_hold_metadata_support.sql
-- AUSTRAC AML/CTF Act s.106 requires 7-year minimum retention
-- for KYC records. Legal hold must block deletion when active.
-- --------------------------------------------------------

-- audit_packs

ALTER TABLE audit_packs
  ADD COLUMN IF NOT EXISTS retention_until         TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS retention_policy_id     TEXT,
  ADD COLUMN IF NOT EXISTS retention_classification TEXT,
  ADD COLUMN IF NOT EXISTS legal_hold              BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS legal_hold_reason       TEXT,
  ADD COLUMN IF NOT EXISTS legal_hold_set_by       TEXT,
  ADD COLUMN IF NOT EXISTS legal_hold_set_at       TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_audit_packs_retention_until
  ON audit_packs (retention_until)
  WHERE retention_until IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_audit_packs_legal_hold
  ON audit_packs (legal_hold)
  WHERE legal_hold = TRUE;

-- override_reasons (append-only compliance audit records)

ALTER TABLE override_reasons
  ADD COLUMN IF NOT EXISTS retention_until         TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS retention_policy_id     TEXT,
  ADD COLUMN IF NOT EXISTS retention_classification TEXT,
  ADD COLUMN IF NOT EXISTS legal_hold              BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS legal_hold_reason       TEXT,
  ADD COLUMN IF NOT EXISTS legal_hold_set_by       TEXT,
  ADD COLUMN IF NOT EXISTS legal_hold_set_at       TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_override_reasons_retention_until
  ON override_reasons (retention_until)
  WHERE retention_until IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_override_reasons_legal_hold
  ON override_reasons (legal_hold)
  WHERE legal_hold = TRUE;

-- report_records

ALTER TABLE report_records
  ADD COLUMN IF NOT EXISTS retention_until         TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS retention_policy_id     TEXT,
  ADD COLUMN IF NOT EXISTS retention_classification TEXT,
  ADD COLUMN IF NOT EXISTS legal_hold              BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS legal_hold_reason       TEXT,
  ADD COLUMN IF NOT EXISTS legal_hold_set_by       TEXT,
  ADD COLUMN IF NOT EXISTS legal_hold_set_at       TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_report_records_retention_until
  ON report_records (retention_until)
  WHERE retention_until IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_report_records_legal_hold
  ON report_records (legal_hold)
  WHERE legal_hold = TRUE;

-- =====================================================
-- GROW KYC - PHASE 2: CASES, FINDINGS, ALERTS
-- Target: Aurora PostgreSQL in ap-southeast-2
-- Scope: Case management, findings, alerts, periodic reviews,
--        provider logs, retention metadata, legal hold support
-- Notes: No Supabase RLS in production path.
--        Tenant isolation is enforced at the application layer
--        via organization_id on every query.
-- =====================================================

-- -----------------------------------------------------
-- Enums
-- -----------------------------------------------------
DO $$ BEGIN
  CREATE TYPE public.case_status AS ENUM (
    'open',
    'in_review',
    'escalated',
    'closed',
    'legal_hold'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.finding_decision AS ENUM (
    'pass',
    'fail',
    'manual_review',
    'insufficient_data'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.finding_severity AS ENUM (
    'low',
    'medium',
    'high',
    'critical'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.alert_type AS ENUM (
    'review_required',
    'escalation',
    'legal_hold_triggered',
    'retention_expiring',
    'provider_failure',
    'compliance_breach'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.escalation_level AS ENUM (
    'level_1',
    'level_2',
    'level_3',
    'regulatory'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- -----------------------------------------------------
-- cases
-- One case per KYC assessment for a client under a tenant.
-- Retention fields and legal hold are top-level columns
-- to enable indexed compliance queries.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE RESTRICT,
    client_id TEXT NOT NULL,
    assigned_to_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    status public.case_status NOT NULL DEFAULT 'open',
    risk_score NUMERIC(5, 2) CHECK (risk_score >= 0 AND risk_score <= 100),
    overall_decision public.finding_decision,
    legal_hold BOOLEAN NOT NULL DEFAULT FALSE,
    legal_hold_reason TEXT,
    legal_hold_until TIMESTAMPTZ,
    legal_hold_set_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    legal_hold_set_at TIMESTAMPTZ,
    retention_until TIMESTAMPTZ,
    retention_policy_id TEXT,
    metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    closed_at TIMESTAMPTZ,
    CONSTRAINT cases_legal_hold_consistency
        CHECK (
            (legal_hold = FALSE)
            OR (legal_hold = TRUE AND legal_hold_set_at IS NOT NULL)
        )
);

CREATE INDEX IF NOT EXISTS idx_cases_org_status
    ON public.cases(organization_id, status);

CREATE INDEX IF NOT EXISTS idx_cases_org_client
    ON public.cases(organization_id, client_id);

CREATE INDEX IF NOT EXISTS idx_cases_legal_hold
    ON public.cases(organization_id, legal_hold)
    WHERE legal_hold = TRUE;

CREATE INDEX IF NOT EXISTS idx_cases_retention_until
    ON public.cases(retention_until)
    WHERE retention_until IS NOT NULL;

-- Prevent legal hold cases from being deleted.
CREATE OR REPLACE FUNCTION public.prevent_legal_hold_case_delete()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF OLD.legal_hold = TRUE THEN
        RAISE EXCEPTION 'Cannot delete a case under legal hold (case_id: %)', OLD.id;
    END IF;
    RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_legal_hold_case_delete ON public.cases;
CREATE TRIGGER trg_prevent_legal_hold_case_delete
    BEFORE DELETE ON public.cases
    FOR EACH ROW EXECUTE FUNCTION public.prevent_legal_hold_case_delete();

-- Auto-update updated_at.
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_cases_updated_at ON public.cases;
CREATE TRIGGER trg_cases_updated_at
    BEFORE UPDATE ON public.cases
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- -----------------------------------------------------
-- case_status_history
-- Append-only ledger of case status transitions.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.case_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID NOT NULL REFERENCES public.cases(id) ON DELETE RESTRICT,
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE RESTRICT,
    from_status public.case_status,
    to_status public.case_status NOT NULL,
    reason TEXT,
    changed_by_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sequence_number BIGSERIAL NOT NULL UNIQUE
);

CREATE INDEX IF NOT EXISTS idx_case_status_history_case_id
    ON public.case_status_history(case_id, changed_at DESC);

-- Block mutations — append only.
CREATE OR REPLACE FUNCTION public.prevent_case_status_history_mutation()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    RAISE EXCEPTION 'case_status_history is append-only';
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_case_status_history_update ON public.case_status_history;
CREATE TRIGGER trg_prevent_case_status_history_update
    BEFORE UPDATE ON public.case_status_history
    FOR EACH ROW EXECUTE FUNCTION public.prevent_case_status_history_mutation();

DROP TRIGGER IF EXISTS trg_prevent_case_status_history_delete ON public.case_status_history;
CREATE TRIGGER trg_prevent_case_status_history_delete
    BEFORE DELETE ON public.case_status_history
    FOR EACH ROW EXECUTE FUNCTION public.prevent_case_status_history_mutation();

-- -----------------------------------------------------
-- bot_findings
-- Each bot run may produce one or more findings.
-- Findings are scoped to a case and carry confidence,
-- decision, and retention metadata.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.bot_findings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE RESTRICT,
    case_id UUID NOT NULL REFERENCES public.cases(id) ON DELETE RESTRICT,
    run_id UUID REFERENCES public.bot_runs(id) ON DELETE SET NULL,
    bot_id TEXT NOT NULL,
    finding_type TEXT NOT NULL,
    severity public.finding_severity NOT NULL DEFAULT 'low',
    decision public.finding_decision NOT NULL,
    confidence NUMERIC(5, 4) CHECK (confidence >= 0 AND confidence <= 1),
    score NUMERIC(5, 2) CHECK (score >= 0 AND score <= 100),
    description TEXT,
    details JSONB NOT NULL DEFAULT '{}'::JSONB,
    evidence_refs JSONB NOT NULL DEFAULT '[]'::JSONB,
    retention_until TIMESTAMPTZ,
    legal_hold BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bot_findings_case_id
    ON public.bot_findings(case_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_bot_findings_org_bot
    ON public.bot_findings(organization_id, bot_id);

CREATE INDEX IF NOT EXISTS idx_bot_findings_decision
    ON public.bot_findings(organization_id, decision);

-- Findings are immutable once written — audit integrity.
CREATE OR REPLACE FUNCTION public.prevent_bot_findings_mutation()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    RAISE EXCEPTION 'bot_findings is append-only';
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_bot_findings_update ON public.bot_findings;
CREATE TRIGGER trg_prevent_bot_findings_update
    BEFORE UPDATE ON public.bot_findings
    FOR EACH ROW EXECUTE FUNCTION public.prevent_bot_findings_mutation();

DROP TRIGGER IF EXISTS trg_prevent_bot_findings_delete ON public.bot_findings;
CREATE TRIGGER trg_prevent_bot_findings_delete
    BEFORE DELETE ON public.bot_findings
    FOR EACH ROW EXECUTE FUNCTION public.prevent_bot_findings_mutation();

-- -----------------------------------------------------
-- alerts
-- Compliance and operational alerts linked to a case.
-- Resolved alerts keep their record; they are never deleted.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE RESTRICT,
    case_id UUID REFERENCES public.cases(id) ON DELETE RESTRICT,
    run_id UUID REFERENCES public.bot_runs(id) ON DELETE SET NULL,
    alert_type public.alert_type NOT NULL,
    escalation_level public.escalation_level,
    title TEXT NOT NULL,
    description TEXT,
    metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
    is_resolved BOOLEAN NOT NULL DEFAULT FALSE,
    resolved_by_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    resolved_at TIMESTAMPTZ,
    resolution_note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_alerts_org_unresolved
    ON public.alerts(organization_id, is_resolved)
    WHERE is_resolved = FALSE;

CREATE INDEX IF NOT EXISTS idx_alerts_case_id
    ON public.alerts(case_id, created_at DESC);

DROP TRIGGER IF EXISTS trg_alerts_updated_at ON public.alerts;
CREATE TRIGGER trg_alerts_updated_at
    BEFORE UPDATE ON public.alerts
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- -----------------------------------------------------
-- periodic_reviews
-- Scheduled compliance re-assessments for a case.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.periodic_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE RESTRICT,
    case_id UUID NOT NULL REFERENCES public.cases(id) ON DELETE RESTRICT,
    due_at TIMESTAMPTZ NOT NULL,
    completed_at TIMESTAMPTZ,
    assigned_to_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    outcome public.finding_decision,
    notes TEXT,
    metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_periodic_reviews_due_at
    ON public.periodic_reviews(organization_id, due_at)
    WHERE completed_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_periodic_reviews_case_id
    ON public.periodic_reviews(case_id);

DROP TRIGGER IF EXISTS trg_periodic_reviews_updated_at ON public.periodic_reviews;
CREATE TRIGGER trg_periodic_reviews_updated_at
    BEFORE UPDATE ON public.periodic_reviews
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- -----------------------------------------------------
-- provider_logs
-- Records every external provider call for a bot run:
-- request hash, response code, duration, retry count.
-- Append-only for audit fidelity.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.provider_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE RESTRICT,
    run_id UUID REFERENCES public.bot_runs(id) ON DELETE SET NULL,
    case_id UUID REFERENCES public.cases(id) ON DELETE SET NULL,
    bot_id TEXT NOT NULL,
    provider_name TEXT NOT NULL,
    request_hash TEXT,
    response_code INTEGER,
    duration_ms INTEGER,
    retry_count INTEGER NOT NULL DEFAULT 0,
    error_code TEXT,
    error_message TEXT,
    succeeded BOOLEAN NOT NULL DEFAULT FALSE,
    called_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_provider_logs_run_id
    ON public.provider_logs(run_id);

CREATE INDEX IF NOT EXISTS idx_provider_logs_org_provider
    ON public.provider_logs(organization_id, provider_name, called_at DESC);

-- Append-only.
CREATE OR REPLACE FUNCTION public.prevent_provider_logs_mutation()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    RAISE EXCEPTION 'provider_logs is append-only';
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_provider_logs_update ON public.provider_logs;
CREATE TRIGGER trg_prevent_provider_logs_update
    BEFORE UPDATE ON public.provider_logs
    FOR EACH ROW EXECUTE FUNCTION public.prevent_provider_logs_mutation();

DROP TRIGGER IF EXISTS trg_prevent_provider_logs_delete ON public.provider_logs;
CREATE TRIGGER trg_prevent_provider_logs_delete
    BEFORE DELETE ON public.provider_logs
    FOR EACH ROW EXECUTE FUNCTION public.prevent_provider_logs_mutation();

-- -----------------------------------------------------
-- Add case_id foreign key to existing bot_runs table.
-- Phase 2 bot runs are always tied to a case.
-- -----------------------------------------------------
ALTER TABLE public.bot_runs
    ADD COLUMN IF NOT EXISTS case_id UUID REFERENCES public.cases(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_bot_runs_case_id
    ON public.bot_runs(case_id)
    WHERE case_id IS NOT NULL;

-- -----------------------------------------------------
-- Add retention and legal hold columns to evidence tables.
-- -----------------------------------------------------
ALTER TABLE public.bot_result_evidence
    ADD COLUMN IF NOT EXISTS retention_until TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS legal_hold BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE public.evidence_pack_items
    ADD COLUMN IF NOT EXISTS retention_until TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS legal_hold BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE public.evidence_packs
    ADD COLUMN IF NOT EXISTS case_id UUID REFERENCES public.cases(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS retention_until TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS legal_hold BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_evidence_packs_case_id
    ON public.evidence_packs(case_id)
    WHERE case_id IS NOT NULL;

-- -----------------------------------------------------
-- Indexes for compliance retention queries
-- -----------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_bot_result_evidence_retention
    ON public.bot_result_evidence(retention_until)
    WHERE retention_until IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_evidence_pack_items_retention
    ON public.evidence_pack_items(retention_until)
    WHERE retention_until IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_bot_findings_retention
    ON public.bot_findings(retention_until)
    WHERE retention_until IS NOT NULL;

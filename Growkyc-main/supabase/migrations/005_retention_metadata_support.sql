-- -----------------------------------------------------
-- Retention metadata support for compliance persistence.
-- Adds policy/classification and archive/delete eligibility
-- metadata fields. No deletion or legal-hold workflows.
-- -----------------------------------------------------

-- Evidence packs (aggregate compliance records)
ALTER TABLE public.evidence_packs
    ADD COLUMN IF NOT EXISTS retention_policy_id TEXT,
    ADD COLUMN IF NOT EXISTS retention_classification TEXT,
    ADD COLUMN IF NOT EXISTS archive_eligible BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS delete_eligible BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_evidence_packs_retention_until
    ON public.evidence_packs(retention_until)
    WHERE retention_until IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_evidence_packs_archive_eligible
    ON public.evidence_packs(archive_eligible)
    WHERE archive_eligible = TRUE;

CREATE INDEX IF NOT EXISTS idx_evidence_packs_delete_eligible
    ON public.evidence_packs(delete_eligible)
    WHERE delete_eligible = TRUE;

-- Document evidence rows (source document metadata)
ALTER TABLE public.bot_result_evidence
    ADD COLUMN IF NOT EXISTS retention_policy_id TEXT,
    ADD COLUMN IF NOT EXISTS retention_classification TEXT,
    ADD COLUMN IF NOT EXISTS archive_eligible BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS delete_eligible BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE public.evidence_pack_items
    ADD COLUMN IF NOT EXISTS retention_policy_id TEXT,
    ADD COLUMN IF NOT EXISTS retention_classification TEXT,
    ADD COLUMN IF NOT EXISTS archive_eligible BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS delete_eligible BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_bot_result_evidence_archive_eligible
    ON public.bot_result_evidence(archive_eligible)
    WHERE archive_eligible = TRUE;

CREATE INDEX IF NOT EXISTS idx_bot_result_evidence_delete_eligible
    ON public.bot_result_evidence(delete_eligible)
    WHERE delete_eligible = TRUE;

CREATE INDEX IF NOT EXISTS idx_evidence_pack_items_archive_eligible
    ON public.evidence_pack_items(archive_eligible)
    WHERE archive_eligible = TRUE;

CREATE INDEX IF NOT EXISTS idx_evidence_pack_items_delete_eligible
    ON public.evidence_pack_items(delete_eligible)
    WHERE delete_eligible = TRUE;

-- Audit events (audit_logs and immutable audit tables)
ALTER TABLE public.audit_logs
    ADD COLUMN IF NOT EXISTS retention_until TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS retention_policy_id TEXT,
    ADD COLUMN IF NOT EXISTS retention_classification TEXT,
    ADD COLUMN IF NOT EXISTS archive_eligible BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS delete_eligible BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE public.audit_events_immutable
    ADD COLUMN IF NOT EXISTS retention_until TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS retention_policy_id TEXT,
    ADD COLUMN IF NOT EXISTS retention_classification TEXT,
    ADD COLUMN IF NOT EXISTS archive_eligible BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS delete_eligible BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE public.bot_audit_events
    ADD COLUMN IF NOT EXISTS retention_until TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS retention_policy_id TEXT,
    ADD COLUMN IF NOT EXISTS retention_classification TEXT,
    ADD COLUMN IF NOT EXISTS archive_eligible BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS delete_eligible BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_audit_logs_retention_until
    ON public.audit_logs(retention_until)
    WHERE retention_until IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_audit_logs_delete_eligible
    ON public.audit_logs(delete_eligible)
    WHERE delete_eligible = TRUE;

CREATE INDEX IF NOT EXISTS idx_audit_events_immutable_retention_until
    ON public.audit_events_immutable(retention_until)
    WHERE retention_until IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_bot_audit_events_retention_until
    ON public.bot_audit_events(retention_until)
    WHERE retention_until IS NOT NULL;

-- Provider logs
ALTER TABLE public.provider_logs
    ADD COLUMN IF NOT EXISTS retention_until TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS retention_policy_id TEXT,
    ADD COLUMN IF NOT EXISTS retention_classification TEXT,
    ADD COLUMN IF NOT EXISTS archive_eligible BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS delete_eligible BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_provider_logs_retention_until
    ON public.provider_logs(retention_until)
    WHERE retention_until IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_provider_logs_archive_eligible
    ON public.provider_logs(archive_eligible)
    WHERE archive_eligible = TRUE;

CREATE INDEX IF NOT EXISTS idx_provider_logs_delete_eligible
    ON public.provider_logs(delete_eligible)
    WHERE delete_eligible = TRUE;

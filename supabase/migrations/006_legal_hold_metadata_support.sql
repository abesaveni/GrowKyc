-- -----------------------------------------------------
-- Legal hold metadata support for evidence and audit records.
-- Adds legal hold reason and provenance fields.
-- No deletion workflow is introduced in this migration.
-- -----------------------------------------------------

-- Evidence pack aggregate records
ALTER TABLE public.evidence_packs
    ADD COLUMN IF NOT EXISTS legal_hold_reason TEXT,
    ADD COLUMN IF NOT EXISTS legal_hold_set_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS legal_hold_set_at TIMESTAMPTZ;

-- Document evidence rows
ALTER TABLE public.bot_result_evidence
    ADD COLUMN IF NOT EXISTS legal_hold_reason TEXT,
    ADD COLUMN IF NOT EXISTS legal_hold_set_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS legal_hold_set_at TIMESTAMPTZ;

ALTER TABLE public.evidence_pack_items
    ADD COLUMN IF NOT EXISTS legal_hold_reason TEXT,
    ADD COLUMN IF NOT EXISTS legal_hold_set_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS legal_hold_set_at TIMESTAMPTZ;

-- Audit-linked records (append-only models preserved)
ALTER TABLE public.audit_logs
    ADD COLUMN IF NOT EXISTS legal_hold BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS legal_hold_reason TEXT,
    ADD COLUMN IF NOT EXISTS legal_hold_set_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS legal_hold_set_at TIMESTAMPTZ;

ALTER TABLE public.audit_events_immutable
    ADD COLUMN IF NOT EXISTS legal_hold BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS legal_hold_reason TEXT,
    ADD COLUMN IF NOT EXISTS legal_hold_set_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS legal_hold_set_at TIMESTAMPTZ;

ALTER TABLE public.bot_audit_events
    ADD COLUMN IF NOT EXISTS legal_hold BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS legal_hold_reason TEXT,
    ADD COLUMN IF NOT EXISTS legal_hold_set_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS legal_hold_set_at TIMESTAMPTZ;

ALTER TABLE public.provider_logs
    ADD COLUMN IF NOT EXISTS legal_hold BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS legal_hold_reason TEXT,
    ADD COLUMN IF NOT EXISTS legal_hold_set_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS legal_hold_set_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_evidence_packs_legal_hold
    ON public.evidence_packs(legal_hold)
    WHERE legal_hold = TRUE;

CREATE INDEX IF NOT EXISTS idx_bot_result_evidence_legal_hold
    ON public.bot_result_evidence(legal_hold)
    WHERE legal_hold = TRUE;

CREATE INDEX IF NOT EXISTS idx_evidence_pack_items_legal_hold
    ON public.evidence_pack_items(legal_hold)
    WHERE legal_hold = TRUE;

CREATE INDEX IF NOT EXISTS idx_audit_logs_legal_hold
    ON public.audit_logs(legal_hold)
    WHERE legal_hold = TRUE;

CREATE INDEX IF NOT EXISTS idx_audit_events_immutable_legal_hold
    ON public.audit_events_immutable(legal_hold)
    WHERE legal_hold = TRUE;

CREATE INDEX IF NOT EXISTS idx_bot_audit_events_legal_hold
    ON public.bot_audit_events(legal_hold)
    WHERE legal_hold = TRUE;

CREATE INDEX IF NOT EXISTS idx_provider_logs_legal_hold
    ON public.provider_logs(legal_hold)
    WHERE legal_hold = TRUE;

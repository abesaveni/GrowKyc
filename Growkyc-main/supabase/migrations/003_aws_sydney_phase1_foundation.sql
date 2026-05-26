-- =====================================================
-- GROW KYC - AWS SYDNEY PHASE 1 FOUNDATION MIGRATION
-- Target: Aurora PostgreSQL in ap-southeast-2
-- Scope: Supabase decoupling + immutable audit + S3 evidence model
-- =====================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- -----------------------------------------------------
-- Public users table replaces auth.users dependency.
-- cognito_sub maps to Cognito user subject.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cognito_sub TEXT UNIQUE,
    email TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'invited')),
    mfa_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------
-- Convert auth.users references to public.users.
-- -----------------------------------------------------
ALTER TABLE public.user_profiles DROP CONSTRAINT IF EXISTS user_profiles_id_fkey;
ALTER TABLE public.user_profiles
    ADD CONSTRAINT user_profiles_id_fkey
    FOREIGN KEY (id) REFERENCES public.users(id) ON DELETE CASCADE;

ALTER TABLE public.audit_logs DROP CONSTRAINT IF EXISTS audit_logs_user_id_fkey;
ALTER TABLE public.audit_logs
    ADD CONSTRAINT audit_logs_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;

ALTER TABLE public.user_invitations DROP CONSTRAINT IF EXISTS user_invitations_invited_by_fkey;
ALTER TABLE public.user_invitations
    ADD CONSTRAINT user_invitations_invited_by_fkey
    FOREIGN KEY (invited_by) REFERENCES public.users(id) ON DELETE SET NULL;

ALTER TABLE public.user_sessions DROP CONSTRAINT IF EXISTS user_sessions_user_id_fkey;
ALTER TABLE public.user_sessions
    ADD CONSTRAINT user_sessions_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

ALTER TABLE public.security_events DROP CONSTRAINT IF EXISTS security_events_user_id_fkey;
ALTER TABLE public.security_events
    ADD CONSTRAINT security_events_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;

ALTER TABLE public.security_events DROP CONSTRAINT IF EXISTS security_events_resolved_by_fkey;
ALTER TABLE public.security_events
    ADD CONSTRAINT security_events_resolved_by_fkey
    FOREIGN KEY (resolved_by) REFERENCES public.users(id) ON DELETE SET NULL;

ALTER TABLE public.bot_audit_events DROP CONSTRAINT IF EXISTS bot_audit_events_actor_user_id_fkey;
ALTER TABLE public.bot_audit_events
    ADD CONSTRAINT bot_audit_events_actor_user_id_fkey
    FOREIGN KEY (actor_user_id) REFERENCES public.users(id) ON DELETE SET NULL;

-- -----------------------------------------------------
-- Immutable audit sequence for tamper-evident checks.
-- -----------------------------------------------------
ALTER TABLE public.audit_logs
    ADD COLUMN IF NOT EXISTS sequence_number BIGSERIAL;

ALTER TABLE public.audit_logs
    ADD COLUMN IF NOT EXISTS event_hash TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_audit_logs_sequence_number
    ON public.audit_logs(sequence_number);

ALTER TABLE public.bot_audit_events
    ADD COLUMN IF NOT EXISTS sequence_number BIGSERIAL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_bot_audit_events_sequence_number
    ON public.bot_audit_events(sequence_number);

-- -----------------------------------------------------
-- Dedicated immutable audit table for high-assurance events.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_events_immutable (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sequence_number BIGSERIAL NOT NULL UNIQUE,
    organization_id UUID REFERENCES public.organizations ON DELETE SET NULL,
    actor_user_id UUID REFERENCES public.users ON DELETE SET NULL,
    event_type TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('info', 'warning', 'error', 'critical')),
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id TEXT,
    event_data JSONB NOT NULL DEFAULT '{}'::JSONB,
    previous_event_hash TEXT,
    event_hash TEXT NOT NULL,
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_events_immutable_org
    ON public.audit_events_immutable(organization_id, occurred_at DESC);

CREATE INDEX IF NOT EXISTS idx_audit_events_immutable_event_type
    ON public.audit_events_immutable(event_type, occurred_at DESC);

-- Prevent updates/deletes to keep immutability semantics.
CREATE OR REPLACE FUNCTION public.prevent_audit_events_mutation()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    RAISE EXCEPTION 'audit_events_immutable is append-only';
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_audit_events_update ON public.audit_events_immutable;
CREATE TRIGGER trg_prevent_audit_events_update
    BEFORE UPDATE ON public.audit_events_immutable
    FOR EACH ROW EXECUTE FUNCTION public.prevent_audit_events_mutation();

DROP TRIGGER IF EXISTS trg_prevent_audit_events_delete ON public.audit_events_immutable;
CREATE TRIGGER trg_prevent_audit_events_delete
    BEFORE DELETE ON public.audit_events_immutable
    FOR EACH ROW EXECUTE FUNCTION public.prevent_audit_events_mutation();

-- -----------------------------------------------------
-- Evidence storage model for S3 object metadata.
-- -----------------------------------------------------
ALTER TABLE public.bot_result_evidence
    ADD COLUMN IF NOT EXISTS s3_bucket TEXT,
    ADD COLUMN IF NOT EXISTS s3_key TEXT,
    ADD COLUMN IF NOT EXISTS s3_version_id TEXT,
    ADD COLUMN IF NOT EXISTS s3_etag TEXT;

ALTER TABLE public.evidence_pack_items
    ADD COLUMN IF NOT EXISTS s3_bucket TEXT,
    ADD COLUMN IF NOT EXISTS s3_key TEXT,
    ADD COLUMN IF NOT EXISTS s3_version_id TEXT,
    ADD COLUMN IF NOT EXISTS s3_etag TEXT;

CREATE INDEX IF NOT EXISTS idx_bot_result_evidence_s3_key
    ON public.bot_result_evidence(s3_bucket, s3_key);

CREATE INDEX IF NOT EXISTS idx_evidence_pack_items_s3_key
    ON public.evidence_pack_items(s3_bucket, s3_key);

-- -----------------------------------------------------
-- Optional bootstrap from Supabase auth.users if present.
-- Safe no-op outside Supabase.
-- -----------------------------------------------------
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'auth' AND table_name = 'users'
  ) THEN
    INSERT INTO public.users (id, email, status, mfa_enabled, created_at, updated_at)
    SELECT u.id,
           COALESCE(u.email, CONCAT('migrated-', u.id::text, '@local.invalid')),
           'active',
           FALSE,
           NOW(),
           NOW()
    FROM auth.users u
    ON CONFLICT (id) DO NOTHING;
  END IF;
END
$$;

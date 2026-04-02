-- ============================================================
-- Migration 007: Frontend tables
-- Creates: clients, documents, austrac_reports,
--           user_invitations, integration_connections
-- with Row Level Security and org-isolation policies.
-- ============================================================

-- ── Clients ──────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.clients (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id  UUID        NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name             TEXT        NOT NULL,
  email            TEXT,
  phone            TEXT,
  type             TEXT        NOT NULL CHECK (type IN ('individual', 'entity')),
  entity_type      TEXT,
  country_code     CHAR(2),
  risk_tier        TEXT        CHECK (risk_tier IN ('low', 'medium', 'high', 'very_high')),
  status           TEXT        NOT NULL DEFAULT 'active'
                               CHECK (status IN ('active', 'inactive', 'archived')),
  metadata         JSONB       DEFAULT '{}',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_clients_org ON public.clients(organization_id);

-- ── Documents ─────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.documents (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id  UUID        NOT NULL,
  case_id          UUID        REFERENCES public.cases(id) ON DELETE SET NULL,
  client_id        UUID        REFERENCES public.clients(id) ON DELETE SET NULL,
  document_type    TEXT,
  filename         TEXT        NOT NULL,
  content_type     TEXT,
  s3_key           TEXT        NOT NULL,
  s3_bucket        TEXT,
  status           TEXT        NOT NULL DEFAULT 'pending_upload'
                               CHECK (status IN (
                                 'pending_upload', 'uploaded', 'verified',
                                 'rejected', 'deleted'
                               )),
  notes            TEXT,
  verified_at      TIMESTAMPTZ,
  uploaded_at      TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_documents_org  ON public.documents(organization_id);
CREATE INDEX IF NOT EXISTS idx_documents_case ON public.documents(case_id);

-- ── AUSTRAC Reports ───────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.austrac_reports (
  id               UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id  UUID           NOT NULL,
  case_id          UUID           REFERENCES public.cases(id) ON DELETE SET NULL,
  report_type      TEXT           NOT NULL CHECK (report_type IN ('SMR', 'TTR', 'IFTI')),
  subject_name     TEXT,
  description      TEXT,
  amount           DECIMAL(18,2),
  currency         CHAR(3)        DEFAULT 'AUD',
  transaction_date TIMESTAMPTZ,
  status           TEXT           NOT NULL DEFAULT 'draft'
                                  CHECK (status IN (
                                    'draft', 'submitted', 'accepted', 'rejected'
                                  )),
  submitted_at     TIMESTAMPTZ,
  reference_number TEXT,
  metadata         JSONB          DEFAULT '{}',
  created_at       TIMESTAMPTZ    NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ    NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_austrac_org ON public.austrac_reports(organization_id);

-- ── User Invitations ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.user_invitations (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id  UUID        NOT NULL,
  email            TEXT        NOT NULL,
  role             TEXT        NOT NULL,
  invited_by       UUID,
  invited_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at       TIMESTAMPTZ NOT NULL,
  status           TEXT        NOT NULL DEFAULT 'pending'
                               CHECK (status IN (
                                 'pending', 'accepted', 'expired', 'cancelled'
                               )),
  UNIQUE (organization_id, email, status)
);

-- ── Integration Connections ───────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.integration_connections (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id   UUID        NOT NULL,
  integration_type  TEXT        NOT NULL,
  status            TEXT        NOT NULL DEFAULT 'pending'
                                CHECK (status IN (
                                  'pending', 'connected', 'disconnected', 'error'
                                )),
  access_token      TEXT,
  refresh_token     TEXT,
  token_expires_at  TIMESTAMPTZ,
  tenant_data       JSONB       DEFAULT '{}',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (organization_id, integration_type)
);

-- ── Row Level Security ────────────────────────────────────────────────────────

ALTER TABLE public.clients               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.austrac_reports       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_invitations      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integration_connections ENABLE ROW LEVEL SECURITY;

-- RLS policies: org isolation via session variable set by application layer.

CREATE POLICY clients_org_isolation ON public.clients
  USING (organization_id::text = current_setting('app.organization_id', true));

CREATE POLICY documents_org_isolation ON public.documents
  USING (organization_id::text = current_setting('app.organization_id', true));

CREATE POLICY austrac_org_isolation ON public.austrac_reports
  USING (organization_id::text = current_setting('app.organization_id', true));

CREATE POLICY invitations_org_isolation ON public.user_invitations
  USING (organization_id::text = current_setting('app.organization_id', true));

CREATE POLICY connections_org_isolation ON public.integration_connections
  USING (organization_id::text = current_setting('app.organization_id', true));

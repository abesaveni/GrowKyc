-- =====================================================
-- GROW KYC - PHASE 1 BOT ORCHESTRATION MODELS
-- =====================================================

-- =====================================================
-- SHARED BOT REGISTRY
-- =====================================================

CREATE TABLE IF NOT EXISTS public.bot_registry (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    provider TEXT NOT NULL,
    version TEXT NOT NULL DEFAULT '1.0.0',
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    default_cost NUMERIC(10,2) NOT NULL DEFAULT 0,
    metadata JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bot_registry_category ON public.bot_registry(category);
CREATE INDEX IF NOT EXISTS idx_bot_registry_enabled ON public.bot_registry(enabled);

-- =====================================================
-- BOT RUNS (ORCHESTRATION EXECUTION)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.bot_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES public.organizations ON DELETE CASCADE,
    client_id TEXT NOT NULL,
    client_name TEXT NOT NULL,
    bot_id TEXT NOT NULL REFERENCES public.bot_registry(id),
    bot_version TEXT NOT NULL,
    provider TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'running', 'passed', 'failed', 'alert', 'error')),
    triggered_by TEXT NOT NULL DEFAULT 'manual' CHECK (triggered_by IN ('manual', 'scheduled', 'event', 'orchestration')),
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    duration_ms INTEGER,
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bot_runs_organization_id ON public.bot_runs(organization_id);
CREATE INDEX IF NOT EXISTS idx_bot_runs_client_id ON public.bot_runs(client_id);
CREATE INDEX IF NOT EXISTS idx_bot_runs_bot_id ON public.bot_runs(bot_id);
CREATE INDEX IF NOT EXISTS idx_bot_runs_status ON public.bot_runs(status);
CREATE INDEX IF NOT EXISTS idx_bot_runs_started_at ON public.bot_runs(started_at DESC);

-- =====================================================
-- BOT RESULT PERSISTENCE MODEL
-- =====================================================

CREATE TABLE IF NOT EXISTS public.bot_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    run_id UUID NOT NULL REFERENCES public.bot_runs(id) ON DELETE CASCADE,
    bot_id TEXT NOT NULL REFERENCES public.bot_registry(id),
    status TEXT NOT NULL CHECK (status IN ('passed', 'failed', 'alert')),
    score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
    summary TEXT NOT NULL,
    findings JSONB NOT NULL DEFAULT '[]'::JSONB,
    raw_result JSONB NOT NULL,
    persisted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bot_results_run_id ON public.bot_results(run_id);
CREATE INDEX IF NOT EXISTS idx_bot_results_bot_id ON public.bot_results(bot_id);
CREATE INDEX IF NOT EXISTS idx_bot_results_status ON public.bot_results(status);

CREATE TABLE IF NOT EXISTS public.bot_result_evidence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    run_id UUID NOT NULL REFERENCES public.bot_runs(id) ON DELETE CASCADE,
    bot_id TEXT NOT NULL REFERENCES public.bot_registry(id),
    title TEXT NOT NULL,
    source TEXT NOT NULL,
    evidence_type TEXT NOT NULL,
    confidence NUMERIC(5,2) NOT NULL DEFAULT 0,
    captured_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bot_result_evidence_run_id ON public.bot_result_evidence(run_id);
CREATE INDEX IF NOT EXISTS idx_bot_result_evidence_bot_id ON public.bot_result_evidence(bot_id);

-- =====================================================
-- AUDIT EVENT MODEL
-- =====================================================

CREATE TABLE IF NOT EXISTS public.bot_audit_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES public.organizations ON DELETE CASCADE,
    actor_user_id UUID REFERENCES auth.users ON DELETE SET NULL,
    event_type TEXT NOT NULL,
    severity TEXT NOT NULL DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'error', 'critical')),
    target_type TEXT NOT NULL,
    target_id TEXT,
    event_data JSONB NOT NULL DEFAULT '{}'::JSONB,
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bot_audit_events_organization_id ON public.bot_audit_events(organization_id);
CREATE INDEX IF NOT EXISTS idx_bot_audit_events_event_type ON public.bot_audit_events(event_type);
CREATE INDEX IF NOT EXISTS idx_bot_audit_events_target ON public.bot_audit_events(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_bot_audit_events_occurred_at ON public.bot_audit_events(occurred_at DESC);

-- =====================================================
-- EVIDENCE PACK BUILDER MODEL
-- =====================================================

CREATE TABLE IF NOT EXISTS public.evidence_packs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES public.organizations ON DELETE CASCADE,
    client_id TEXT NOT NULL,
    client_name TEXT NOT NULL,
    run_ids UUID[] NOT NULL DEFAULT ARRAY[]::UUID[],
    summary JSONB NOT NULL DEFAULT '{}'::JSONB,
    generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_evidence_packs_organization_id ON public.evidence_packs(organization_id);
CREATE INDEX IF NOT EXISTS idx_evidence_packs_client_id ON public.evidence_packs(client_id);
CREATE INDEX IF NOT EXISTS idx_evidence_packs_generated_at ON public.evidence_packs(generated_at DESC);

CREATE TABLE IF NOT EXISTS public.evidence_pack_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    evidence_pack_id UUID NOT NULL REFERENCES public.evidence_packs(id) ON DELETE CASCADE,
    run_id UUID REFERENCES public.bot_runs(id) ON DELETE SET NULL,
    bot_id TEXT REFERENCES public.bot_registry(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    source TEXT NOT NULL,
    evidence_type TEXT NOT NULL,
    confidence NUMERIC(5,2) NOT NULL DEFAULT 0,
    captured_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_evidence_pack_items_pack_id ON public.evidence_pack_items(evidence_pack_id);
CREATE INDEX IF NOT EXISTS idx_evidence_pack_items_run_id ON public.evidence_pack_items(run_id);

-- =====================================================
-- RLS
-- =====================================================

ALTER TABLE public.bot_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bot_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bot_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bot_result_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bot_audit_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evidence_packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evidence_pack_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY bot_registry_view_all ON public.bot_registry
    FOR SELECT USING (TRUE);

CREATE POLICY bot_runs_view_org ON public.bot_runs
    FOR SELECT
    USING (
        organization_id IN (
            SELECT organization_id FROM public.user_profiles
            WHERE id = auth.uid()
        )
    );

CREATE POLICY bot_runs_insert_service ON public.bot_runs
    FOR INSERT
    WITH CHECK (TRUE);

CREATE POLICY bot_results_view_org ON public.bot_results
    FOR SELECT
    USING (
        run_id IN (
            SELECT id FROM public.bot_runs
            WHERE organization_id IN (
                SELECT organization_id FROM public.user_profiles
                WHERE id = auth.uid()
            )
        )
    );

CREATE POLICY bot_results_insert_service ON public.bot_results
    FOR INSERT
    WITH CHECK (TRUE);

CREATE POLICY bot_result_evidence_view_org ON public.bot_result_evidence
    FOR SELECT
    USING (
        run_id IN (
            SELECT id FROM public.bot_runs
            WHERE organization_id IN (
                SELECT organization_id FROM public.user_profiles
                WHERE id = auth.uid()
            )
        )
    );

CREATE POLICY bot_result_evidence_insert_service ON public.bot_result_evidence
    FOR INSERT
    WITH CHECK (TRUE);

CREATE POLICY bot_audit_events_view_org ON public.bot_audit_events
    FOR SELECT
    USING (
        organization_id IN (
            SELECT organization_id FROM public.user_profiles
            WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'manager')
        )
    );

CREATE POLICY bot_audit_events_insert_service ON public.bot_audit_events
    FOR INSERT
    WITH CHECK (TRUE);

CREATE POLICY evidence_packs_view_org ON public.evidence_packs
    FOR SELECT
    USING (
        organization_id IN (
            SELECT organization_id FROM public.user_profiles
            WHERE id = auth.uid()
        )
    );

CREATE POLICY evidence_packs_insert_service ON public.evidence_packs
    FOR INSERT
    WITH CHECK (TRUE);

CREATE POLICY evidence_pack_items_view_org ON public.evidence_pack_items
    FOR SELECT
    USING (
        evidence_pack_id IN (
            SELECT id FROM public.evidence_packs
            WHERE organization_id IN (
                SELECT organization_id FROM public.user_profiles
                WHERE id = auth.uid()
            )
        )
    );

CREATE POLICY evidence_pack_items_insert_service ON public.evidence_pack_items
    FOR INSERT
    WITH CHECK (TRUE);

-- =====================================================
-- SEED BOT REGISTRY
-- =====================================================

INSERT INTO public.bot_registry (id, name, description, category, provider, version, enabled, default_cost)
VALUES
    ('identity-verification', 'Identity Verification', 'Verify identity using government ID, biometrics, and fraud signals.', 'identity', 'Equifax', '1.0.0', TRUE, 2.50),
    ('document-verification', 'Document Verification', 'Verify authenticity of uploaded identity documents.', 'identity', 'Onfido', '1.0.0', TRUE, 3.00),
    ('biometric-check', 'Biometric Verification', 'Run facial recognition and liveness checks.', 'identity', 'Equifax', '1.0.0', TRUE, 1.50),
    ('device-intelligence', 'Device Intelligence', 'Evaluate device fingerprint and risk indicators.', 'identity', 'Equifax', '1.0.0', TRUE, 1.00),
    ('aml-screening', 'AML Screening', 'Screen against PEP, sanctions, and watchlists.', 'aml', 'Equifax', '1.0.0', TRUE, 5.00),
    ('sanctions-check', 'Sanctions Check', 'Check against major sanctions lists.', 'aml', 'Dow Jones', '1.0.0', TRUE, 3.50),
    ('pep-screening', 'PEP Screening', 'Screen politically exposed persons databases.', 'aml', 'World-Check', '1.0.0', TRUE, 4.00),
    ('adverse-media', 'Adverse Media Screening', 'Scan adverse media and reputational signals.', 'aml', 'Equifax', '1.0.0', TRUE, 2.00),
    ('credit-report', 'Credit Report', 'Retrieve credit history and reporting data.', 'credit', 'Equifax', '1.0.0', TRUE, 15.00),
    ('credit-score', 'Credit Score', 'Retrieve primary credit score band.', 'credit', 'Equifax', '1.0.0', TRUE, 5.00),
    ('payment-history', 'Payment History', 'Review repayment behaviour and defaults.', 'credit', 'Equifax', '1.0.0', TRUE, 3.00),
    ('abn-lookup', 'ABN Lookup', 'Validate ABN and entity registration details.', 'entity', 'ABR', '1.0.0', TRUE, 0.00),
    ('asic-search', 'ASIC Company Search', 'Retrieve ASIC company details and officeholders.', 'entity', 'ASIC', '1.0.0', TRUE, 9.00),
    ('beneficial-ownership', 'Beneficial Ownership', 'Identify ultimate beneficial owners and controllers.', 'entity', 'Equifax', '1.0.0', TRUE, 12.00),
    ('property-ownership', 'Property Ownership', 'Run title search and ownership verification.', 'property', 'InfoTrack', '1.0.0', TRUE, 25.00),
    ('property-valuation', 'Property Valuation', 'Get AVM estimate and confidence range.', 'property', 'CoreLogic', '1.0.0', TRUE, 15.00),
    ('bank-statement-analysis', 'Bank Statement Analysis', 'Analyse transactional affordability patterns.', 'affordability', 'Equifax', '1.0.0', TRUE, 8.00),
    ('income-verification', 'Income Verification', 'Verify income and employment information.', 'affordability', 'Equifax', '1.0.0', TRUE, 5.00)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    category = EXCLUDED.category,
    provider = EXCLUDED.provider,
    version = EXCLUDED.version,
    enabled = EXCLUDED.enabled,
    default_cost = EXCLUDED.default_cost,
    updated_at = NOW();

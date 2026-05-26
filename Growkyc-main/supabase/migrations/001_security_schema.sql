-- =====================================================
-- GROW PLATFORM - SECURITY & MULTI-TENANCY SCHEMA
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- ORGANIZATIONS (Multi-Tenant Architecture)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    subscription_tier TEXT NOT NULL DEFAULT 'trial' CHECK (subscription_tier IN ('trial', 'starter', 'professional', 'enterprise')),
    subscription_status TEXT NOT NULL DEFAULT 'active' CHECK (subscription_status IN ('active', 'trial', 'past_due', 'cancelled', 'suspended')),
    enabled_modules TEXT[] DEFAULT ARRAY['brickbanq']::TEXT[],
    
    -- Branding & Customization
    logo_url TEXT,
    primary_color TEXT DEFAULT '#4F46E5',
    custom_domain TEXT,
    
    -- Subscription Management
    trial_ends_at TIMESTAMPTZ,
    subscription_ends_at TIMESTAMPTZ,
    max_users INTEGER DEFAULT 5,
    max_storage_gb INTEGER DEFAULT 10,
    
    -- Billing
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    
    -- Metadata
    settings JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Index for performance
CREATE INDEX idx_organizations_slug ON public.organizations(slug);
CREATE INDEX idx_organizations_subscription_status ON public.organizations(subscription_status);

-- =====================================================
-- USERS (Extended from Supabase Auth)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES public.organizations ON DELETE CASCADE,
    
    -- Profile Info
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    
    -- Role & Permissions
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('super_admin', 'admin', 'manager', 'user', 'client')),
    module_roles JSONB DEFAULT '{}'::JSONB, -- Per-module roles
    permissions JSONB DEFAULT '[]'::JSONB,
    
    -- Status
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'invited')),
    email_verified BOOLEAN DEFAULT FALSE,
    mfa_enabled BOOLEAN DEFAULT FALSE,
    
    -- Preferences
    preferences JSONB DEFAULT '{}'::JSONB,
    last_login_at TIMESTAMPTZ,
    last_login_ip INET,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_user_profiles_organization_id ON public.user_profiles(organization_id);
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX idx_user_profiles_status ON public.user_profiles(status);

-- =====================================================
-- AUDIT LOGS (Compliance & Security)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES public.organizations ON DELETE SET NULL,
    user_id UUID REFERENCES auth.users ON DELETE SET NULL,
    
    -- Action Details
    action TEXT NOT NULL, -- e.g., 'USER_LOGIN', 'DOCUMENT_DOWNLOAD', 'DATA_EXPORT'
    resource_type TEXT, -- e.g., 'user', 'document', 'workpaper'
    resource_id TEXT,
    
    -- Context
    module TEXT, -- Which Grow module
    severity TEXT DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'error', 'critical')),
    
    -- Request Details
    ip_address INET,
    user_agent TEXT,
    request_url TEXT,
    
    -- Data
    old_values JSONB,
    new_values JSONB,
    metadata JSONB DEFAULT '{}'::JSONB,
    
    -- Timestamp
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for audit queries
CREATE INDEX idx_audit_logs_organization_id ON public.audit_logs(organization_id);
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_resource ON public.audit_logs(resource_type, resource_id);

-- Partition audit logs by month for performance (optional)
-- CREATE TABLE audit_logs_2024_02 PARTITION OF audit_logs
--     FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');

-- =====================================================
-- USER INVITATIONS
-- =====================================================

CREATE TABLE IF NOT EXISTS public.user_invitations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations ON DELETE CASCADE,
    invited_by UUID REFERENCES auth.users ON DELETE SET NULL,
    
    -- Invitation Details
    email TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    module_roles JSONB DEFAULT '{}'::JSONB,
    
    -- Token & Status
    token TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired', 'cancelled')),
    
    -- Expiration
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '7 days'),
    accepted_at TIMESTAMPTZ,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_user_invitations_token ON public.user_invitations(token);
CREATE INDEX idx_user_invitations_email ON public.user_invitations(email);
CREATE INDEX idx_user_invitations_organization_id ON public.user_invitations(organization_id);

-- =====================================================
-- SESSION MANAGEMENT
-- =====================================================

CREATE TABLE IF NOT EXISTS public.user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES public.organizations ON DELETE CASCADE,
    
    -- Session Info
    token_hash TEXT NOT NULL,
    device_info TEXT,
    ip_address INET,
    user_agent TEXT,
    
    -- Timing
    last_activity_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX idx_user_sessions_token_hash ON public.user_sessions(token_hash);
CREATE INDEX idx_user_sessions_expires_at ON public.user_sessions(expires_at);

-- =====================================================
-- SECURITY EVENTS
-- =====================================================

CREATE TABLE IF NOT EXISTS public.security_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES public.organizations ON DELETE SET NULL,
    user_id UUID REFERENCES auth.users ON DELETE SET NULL,
    
    -- Event Details
    event_type TEXT NOT NULL, -- 'failed_login', 'suspicious_activity', 'rate_limit_exceeded', etc.
    severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    description TEXT,
    
    -- Context
    ip_address INET,
    user_agent TEXT,
    metadata JSONB DEFAULT '{}'::JSONB,
    
    -- Status
    status TEXT DEFAULT 'unresolved' CHECK (status IN ('unresolved', 'investigating', 'resolved', 'false_positive')),
    resolved_by UUID REFERENCES auth.users ON DELETE SET NULL,
    resolved_at TIMESTAMPTZ,
    
    -- Timestamp
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_security_events_organization_id ON public.security_events(organization_id);
CREATE INDEX idx_security_events_user_id ON public.security_events(user_id);
CREATE INDEX idx_security_events_type ON public.security_events(event_type);
CREATE INDEX idx_security_events_severity ON public.security_events(severity);
CREATE INDEX idx_security_events_created_at ON public.security_events(created_at DESC);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- ORGANIZATIONS RLS
-- =====================================================

-- Users can only view their own organization
CREATE POLICY org_view_own ON public.organizations
    FOR SELECT
    USING (
        id IN (
            SELECT organization_id FROM public.user_profiles
            WHERE id = auth.uid()
        )
    );

-- Only admins can update organization
CREATE POLICY org_update_admin ON public.organizations
    FOR UPDATE
    USING (
        id IN (
            SELECT organization_id FROM public.user_profiles
            WHERE id = auth.uid() AND role IN ('super_admin', 'admin')
        )
    );

-- =====================================================
-- USER PROFILES RLS
-- =====================================================

-- Users can view profiles in their organization
CREATE POLICY user_profiles_view_org ON public.user_profiles
    FOR SELECT
    USING (
        organization_id IN (
            SELECT organization_id FROM public.user_profiles
            WHERE id = auth.uid()
        )
    );

-- Users can update their own profile
CREATE POLICY user_profiles_update_own ON public.user_profiles
    FOR UPDATE
    USING (id = auth.uid());

-- Admins can insert new users in their organization
CREATE POLICY user_profiles_insert_admin ON public.user_profiles
    FOR INSERT
    WITH CHECK (
        organization_id IN (
            SELECT organization_id FROM public.user_profiles
            WHERE id = auth.uid() AND role IN ('super_admin', 'admin')
        )
    );

-- Admins can update users in their organization
CREATE POLICY user_profiles_update_admin ON public.user_profiles
    FOR UPDATE
    USING (
        organization_id IN (
            SELECT organization_id FROM public.user_profiles
            WHERE id = auth.uid() AND role IN ('super_admin', 'admin')
        )
    );

-- =====================================================
-- AUDIT LOGS RLS
-- =====================================================

-- Users can view audit logs from their organization
CREATE POLICY audit_logs_view_org ON public.audit_logs
    FOR SELECT
    USING (
        organization_id IN (
            SELECT organization_id FROM public.user_profiles
            WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'manager')
        )
    );

-- Service role can insert audit logs
CREATE POLICY audit_logs_insert_service ON public.audit_logs
    FOR INSERT
    WITH CHECK (true);

-- =====================================================
-- USER INVITATIONS RLS
-- =====================================================

CREATE POLICY invitations_view_org ON public.user_invitations
    FOR SELECT
    USING (
        organization_id IN (
            SELECT organization_id FROM public.user_profiles
            WHERE id = auth.uid()
        )
    );

CREATE POLICY invitations_insert_admin ON public.user_invitations
    FOR INSERT
    WITH CHECK (
        organization_id IN (
            SELECT organization_id FROM public.user_profiles
            WHERE id = auth.uid() AND role IN ('super_admin', 'admin')
        )
    );

-- =====================================================
-- USER SESSIONS RLS
-- =====================================================

-- Users can view their own sessions
CREATE POLICY sessions_view_own ON public.user_sessions
    FOR SELECT
    USING (user_id = auth.uid());

-- Users can delete their own sessions
CREATE POLICY sessions_delete_own ON public.user_sessions
    FOR DELETE
    USING (user_id = auth.uid());

-- =====================================================
-- SECURITY EVENTS RLS
-- =====================================================

-- Admins can view security events in their organization
CREATE POLICY security_events_view_admin ON public.security_events
    FOR SELECT
    USING (
        organization_id IN (
            SELECT organization_id FROM public.user_profiles
            WHERE id = auth.uid() AND role IN ('super_admin', 'admin')
        )
    );

-- Service role can insert security events
CREATE POLICY security_events_insert_service ON public.security_events
    FOR INSERT
    WITH CHECK (true);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to tables with updated_at
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON public.organizations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, organization_id, full_name, email, role)
    VALUES (
        NEW.id,
        (NEW.raw_user_meta_data->>'organization_id')::UUID,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'Unknown'),
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'role', 'user')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on new user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- SEED DATA (Development Only - Remove in Production)
-- =====================================================

-- Create a demo organization
INSERT INTO public.organizations (id, name, slug, subscription_tier, enabled_modules, max_users)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'Demo Organization',
    'demo-org',
    'professional',
    ARRAY['brickbanq', 'grow_accounting', 'grow_lending', 'grow_hq'],
    50
) ON CONFLICT DO NOTHING;

-- Note: In production, remove this seed data and require proper signup flow

-- ============================================
-- EcoSphere: Initial Schema
-- ESG Management Platform with Gamification
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Users & Profiles
-- ============================================

CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    organization_id UUID,
    role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'manager', 'member')),
    xp INTEGER NOT NULL DEFAULT 0,
    level INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
    ON public.profiles FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- ============================================
-- Organizations
-- ============================================

CREATE TABLE public.organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    industry TEXT,
    description TEXT,
    logo_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view organizations"
    ON public.organizations FOR SELECT
    USING (true);

-- ============================================
-- Environmental Metrics
-- ============================================

CREATE TABLE public.environmental_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    reported_by UUID REFERENCES public.profiles(id),
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    carbon_emissions_tons NUMERIC(12, 2) DEFAULT 0,
    energy_consumption_kwh NUMERIC(12, 2) DEFAULT 0,
    renewable_energy_pct NUMERIC(5, 2) DEFAULT 0,
    water_usage_liters NUMERIC(12, 2) DEFAULT 0,
    waste_generated_kg NUMERIC(12, 2) DEFAULT 0,
    waste_recycled_kg NUMERIC(12, 2) DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.environmental_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Organization members can view environmental metrics"
    ON public.environmental_metrics FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND organization_id = environmental_metrics.organization_id
        )
    );

CREATE POLICY "Managers and admins can insert environmental metrics"
    ON public.environmental_metrics FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid()
            AND organization_id = environmental_metrics.organization_id
            AND role IN ('admin', 'manager')
        )
    );

-- ============================================
-- Social Metrics
-- ============================================

CREATE TABLE public.social_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    reported_by UUID REFERENCES public.profiles(id),
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    employee_count INTEGER DEFAULT 0,
    employee_satisfaction_pct NUMERIC(5, 2) DEFAULT 0,
    diversity_pct NUMERIC(5, 2) DEFAULT 0,
    training_hours NUMERIC(8, 2) DEFAULT 0,
    volunteer_hours NUMERIC(8, 2) DEFAULT 0,
    community_investment NUMERIC(12, 2) DEFAULT 0,
    safety_incidents INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.social_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Organization members can view social metrics"
    ON public.social_metrics FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND organization_id = social_metrics.organization_id
        )
    );

CREATE POLICY "Managers and admins can insert social metrics"
    ON public.social_metrics FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid()
            AND organization_id = social_metrics.organization_id
            AND role IN ('admin', 'manager')
        )
    );

-- ============================================
-- Governance Metrics
-- ============================================

CREATE TABLE public.governance_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    reported_by UUID REFERENCES public.profiles(id),
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    board_independence_pct NUMERIC(5, 2) DEFAULT 0,
    board_diversity_pct NUMERIC(5, 2) DEFAULT 0,
    ethics_training_pct NUMERIC(5, 2) DEFAULT 0,
    data_breaches INTEGER DEFAULT 0,
    compliance_violations INTEGER DEFAULT 0,
    audit_completed BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.governance_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Organization members can view governance metrics"
    ON public.governance_metrics FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND organization_id = governance_metrics.organization_id
        )
    );

CREATE POLICY "Managers and admins can insert governance metrics"
    ON public.governance_metrics FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid()
            AND organization_id = governance_metrics.organization_id
            AND role IN ('admin', 'manager')
        )
    );

-- ============================================
-- Policies (CSR / ESG Policies)
-- ============================================

CREATE TABLE public.policies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL CHECK (category IN ('environmental', 'social', 'governance')),
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending_approval', 'approved', 'rejected', 'archived')),
    approved_by UUID REFERENCES public.profiles(id),
    approved_at TIMESTAMPTZ,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.policies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Organization members can view policies"
    ON public.policies FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND organization_id = policies.organization_id
        )
    );

CREATE POLICY "Managers and admins can manage policies"
    ON public.policies FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid()
            AND organization_id = policies.organization_id
            AND role IN ('admin', 'manager')
        )
    );

-- ============================================
-- CSR Approvals
-- ============================================

CREATE TABLE public.csr_approvals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    policy_id UUID NOT NULL REFERENCES public.policies(id) ON DELETE CASCADE,
    requester_id UUID NOT NULL REFERENCES public.profiles(id),
    approver_id UUID REFERENCES public.profiles(id),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    comments TEXT,
    requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

ALTER TABLE public.csr_approvals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Requesters and approvers can view CSR approvals"
    ON public.csr_approvals FOR SELECT
    USING (
        auth.uid() = requester_id
        OR auth.uid() = approver_id
        OR EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- ============================================
-- Gamification: Badges
-- ============================================

CREATE TABLE public.badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    icon_url TEXT,
    xp_reward INTEGER NOT NULL DEFAULT 0,
    category TEXT NOT NULL CHECK (category IN ('environmental', 'social', 'governance', 'general')),
    tier TEXT NOT NULL DEFAULT 'bronze' CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view badges"
    ON public.badges FOR SELECT
    USING (true);

-- ============================================
-- Gamification: User Badges (earned)
-- ============================================

CREATE TABLE public.user_badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, badge_id)
);

ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own badges"
    ON public.user_badges FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "System can award badges"
    ON public.user_badges FOR INSERT
    WITH CHECK (true);

-- ============================================
-- Gamification: Rewards
-- ============================================

CREATE TABLE public.rewards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    xp_cost INTEGER NOT NULL,
    stock INTEGER NOT NULL DEFAULT -1,
    image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view rewards"
    ON public.rewards FOR SELECT
    USING (true);

-- ============================================
-- Gamification: Reward Redemptions (ACID Ledger)
-- ============================================

CREATE TABLE public.reward_redemptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id),
    reward_id UUID NOT NULL REFERENCES public.rewards(id),
    xp_deducted INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'fulfilled', 'cancelled')),
    redeemed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.reward_redemptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own redemptions"
    ON public.reward_redemptions FOR SELECT
    USING (auth.uid() = user_id);

-- ============================================
-- Notifications (Real-time)
-- ============================================

CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT,
    type TEXT NOT NULL CHECK (type IN ('csr_approval', 'policy_update', 'badge_earned', 'reward_fulfilled', 'system')),
    read BOOLEAN DEFAULT false,
    data JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
    ON public.notifications FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
    ON public.notifications FOR UPDATE
    USING (auth.uid() = user_id);

-- ============================================
-- Gamification: XP Transactions Ledger
-- ============================================

CREATE TABLE public.xp_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id),
    amount INTEGER NOT NULL,
    reason TEXT NOT NULL,
    reference_id UUID,
    reference_type TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.xp_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own XP transactions"
    ON public.xp_transactions FOR SELECT
    USING (auth.uid() = user_id);

-- ============================================
-- Indexes
-- ============================================

CREATE INDEX idx_profiles_organization ON public.profiles(organization_id);
CREATE INDEX idx_environmental_metrics_org ON public.environmental_metrics(organization_id);
CREATE INDEX idx_social_metrics_org ON public.social_metrics(organization_id);
CREATE INDEX idx_governance_metrics_org ON public.governance_metrics(organization_id);
CREATE INDEX idx_policies_org ON public.policies(organization_id);
CREATE INDEX idx_notifications_user ON public.notifications(user_id);
CREATE INDEX idx_user_badges_user ON public.user_badges(user_id);
CREATE INDEX idx_reward_redemptions_user ON public.reward_redemptions(user_id);
CREATE INDEX idx_xp_transactions_user ON public.xp_transactions(user_id);

-- ============================================
-- Functions
-- ============================================

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, avatar_url)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', NULL)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Award XP and update profile level
CREATE OR REPLACE FUNCTION public.award_xp(
    p_user_id UUID,
    p_amount INTEGER,
    p_reason TEXT,
    p_reference_id UUID DEFAULT NULL,
    p_reference_type TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO public.xp_transactions (user_id, amount, reason, reference_id, reference_type)
    VALUES (p_user_id, p_amount, p_reason, p_reference_id, p_reference_type);

    UPDATE public.profiles
    SET xp = xp + p_amount,
        level = GREATEST(1, (xp + p_amount) / 1000 + 1),
        updated_at = NOW()
    WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Redeem reward with ACID guarantees
CREATE OR REPLACE FUNCTION public.redeem_reward(
    p_user_id UUID,
    p_reward_id UUID
)
RETURNS JSON AS $$
DECLARE
    v_xp_cost INTEGER;
    v_user_xp INTEGER;
    v_stock INTEGER;
    v_redemption_id UUID;
BEGIN
    -- Lock the reward row
    SELECT xp_cost, stock INTO v_xp_cost, v_stock
    FROM public.rewards
    WHERE id = p_reward_id
    FOR UPDATE;

    -- Lock the user profile row
    SELECT xp INTO v_user_xp
    FROM public.profiles
    WHERE id = p_user_id
    FOR UPDATE;

    -- Validate stock
    IF v_stock = 0 THEN
        RETURN json_build_object('success', false, 'error', 'Out of stock');
    END IF;

    -- Validate XP
    IF v_user_xp < v_xp_cost THEN
        RETURN json_build_object('success', false, 'error', 'Insufficient XP');
    END IF;

    -- Deduct XP
    UPDATE public.profiles
    SET xp = xp - v_xp_cost, updated_at = NOW()
    WHERE id = p_user_id;

    -- Decrease stock (skip if unlimited: -1)
    IF v_stock > 0 THEN
        UPDATE public.rewards
        SET stock = stock - 1
        WHERE id = p_reward_id;
    END IF;

    -- Create redemption record
    INSERT INTO public.reward_redemptions (user_id, reward_id, xp_deducted, status)
    VALUES (p_user_id, p_reward_id, v_xp_cost, 'pending')
    RETURNING id INTO v_redemption_id;

    -- Log XP transaction
    INSERT INTO public.xp_transactions (user_id, amount, reason, reference_id, reference_type)
    VALUES (p_user_id, -v_xp_cost, 'Reward redemption', v_redemption_id, 'reward_redemption');

    RETURN json_build_object('success', true, 'redemption_id', v_redemption_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable Realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

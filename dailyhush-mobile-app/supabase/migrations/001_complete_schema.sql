-- ============================================================================
-- DailyHush Complete Database Schema Migration
-- Version: 001
-- Description: Adds missing tables for subscriptions, usage tracking,
--              conversation logs, and daily check-ins
-- Created: 2025-11-04
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- ============================================================================
-- TABLE: subscriptions (Enhanced for RevenueCat Integration)
-- ============================================================================
-- Stores RevenueCat subscription data synchronized via webhooks
-- Replaces/enhances the basic subscriptions table from schema.sql

DROP TABLE IF EXISTS public.subscriptions CASCADE;

CREATE TABLE public.subscriptions (
    -- Primary Key
    subscription_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- User Reference
    user_id UUID NOT NULL REFERENCES public.user_profiles(user_id) ON DELETE CASCADE,

    -- RevenueCat Integration
    revenuecat_customer_id TEXT UNIQUE,
    revenuecat_subscriber_id TEXT,
    revenuecat_entitlement_id TEXT,

    -- Subscription Details
    tier TEXT NOT NULL CHECK (tier IN ('free', 'premium', 'premium_annual')),
    status TEXT NOT NULL CHECK (status IN ('active', 'trialing', 'expired', 'canceled', 'grace_period', 'paused')),

    -- Product Information
    product_id TEXT NOT NULL, -- RevenueCat product identifier
    store TEXT CHECK (store IN ('app_store', 'play_store', 'stripe', 'promotional')),

    -- Period Information
    current_period_start TIMESTAMPTZ NOT NULL,
    current_period_end TIMESTAMPTZ NOT NULL,
    trial_start TIMESTAMPTZ,
    trial_end TIMESTAMPTZ,

    -- Billing
    price_cents INTEGER,
    currency TEXT DEFAULT 'USD',
    billing_cycle TEXT CHECK (billing_cycle IN ('monthly', 'annual', 'lifetime')),

    -- Cancellation
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    canceled_at TIMESTAMPTZ,
    cancellation_reason TEXT,

    -- External IDs (for reconciliation)
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    app_store_receipt_id TEXT,
    play_store_purchase_token TEXT,

    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Constraints
    UNIQUE(user_id),
    UNIQUE(revenuecat_customer_id)
);

-- ============================================================================
-- TABLE: user_usage
-- ============================================================================
-- Tracks usage limits for free vs premium tiers
-- Used to enforce conversation and exercise limits

CREATE TABLE public.user_usage (
    -- Primary Key
    usage_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- User Reference
    user_id UUID NOT NULL REFERENCES public.user_profiles(user_id) ON DELETE CASCADE,

    -- Resource Type
    resource_type TEXT NOT NULL CHECK (resource_type IN ('conversation', 'exercise', 'voice_journal', 'shift_session')),

    -- Module/Feature Identifier
    module_id TEXT, -- e.g., 'focus', 'interrupt', 'anna_chat', 'breathing_exercise'

    -- Usage Metadata
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    duration_seconds INTEGER,

    -- Success Tracking
    completed BOOLEAN DEFAULT FALSE,
    interrupted BOOLEAN DEFAULT FALSE,

    -- Tier at Time of Usage
    tier_at_usage TEXT DEFAULT 'free',

    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- TABLE: conversation_logs
-- ============================================================================
-- Detailed logs of Anna chat sessions with message history
-- Links to ai_sessions for analytics

CREATE TABLE public.conversation_logs (
    -- Primary Key
    log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Session Reference
    session_id UUID REFERENCES public.ai_sessions(session_id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.user_profiles(user_id) ON DELETE CASCADE,

    -- Message Details
    message_sequence INTEGER NOT NULL, -- Order of messages in conversation
    sender TEXT NOT NULL CHECK (sender IN ('user', 'anna')),
    message_content TEXT NOT NULL,

    -- AI Model Metadata (for Anna's messages)
    model_used TEXT,
    tokens_used INTEGER,
    latency_ms INTEGER,

    -- Context & Features
    detected_emotion TEXT, -- e.g., 'anxiety', 'sadness', 'anger'
    intervention_type TEXT, -- e.g., 'cognitive_reframe', 'grounding', 'validation'

    -- Timestamp
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Constraints
    CONSTRAINT valid_sequence CHECK (message_sequence > 0)
);

-- ============================================================================
-- TABLE: daily_check_ins
-- ============================================================================
-- Daily mood check-ins and quick status updates
-- Different from mood_entries which are more detailed spiral-related

CREATE TABLE public.daily_check_ins (
    -- Primary Key
    check_in_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- User Reference
    user_id UUID NOT NULL REFERENCES public.user_profiles(user_id) ON DELETE CASCADE,

    -- Check-in Date (one per day)
    check_in_date DATE NOT NULL DEFAULT CURRENT_DATE,

    -- Mood Rating (1-10 scale)
    mood_rating INTEGER NOT NULL CHECK (mood_rating >= 1 AND mood_rating <= 10),

    -- Energy Level (1-5 scale)
    energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 5),

    -- Sleep Quality (1-5 scale)
    sleep_quality INTEGER CHECK (sleep_quality >= 1 AND sleep_quality <= 5),
    sleep_hours DECIMAL(3,1),

    -- Quick Tags
    mood_tags TEXT[], -- e.g., ['anxious', 'motivated', 'tired']
    activities TEXT[], -- e.g., ['exercise', 'meditation', 'work']

    -- Notes
    notes TEXT,
    gratitude TEXT,

    -- FIRE Progress Reference
    fire_modules_practiced TEXT[], -- e.g., ['focus', 'interrupt']

    -- Metadata
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Constraints
    UNIQUE(user_id, check_in_date) -- One check-in per user per day
);

-- ============================================================================
-- TABLE: usage_quotas
-- ============================================================================
-- Define tier-based usage limits (reference table)

CREATE TABLE public.usage_quotas (
    quota_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Tier
    tier TEXT NOT NULL CHECK (tier IN ('free', 'premium', 'premium_annual')),

    -- Resource Limits
    resource_type TEXT NOT NULL CHECK (resource_type IN ('conversation', 'exercise', 'voice_journal', 'shift_session')),

    -- Limits
    daily_limit INTEGER,
    weekly_limit INTEGER,
    monthly_limit INTEGER,

    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE(tier, resource_type)
);

-- ============================================================================
-- INDEXES for Performance
-- ============================================================================

-- Subscriptions Indexes
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON public.subscriptions(status) WHERE status = 'active';
CREATE INDEX idx_subscriptions_period_end ON public.subscriptions(current_period_end) WHERE status = 'active';
CREATE INDEX idx_subscriptions_revenuecat_customer ON public.subscriptions(revenuecat_customer_id);

-- User Usage Indexes
CREATE INDEX idx_user_usage_user_id ON public.user_usage(user_id);
CREATE INDEX idx_user_usage_timestamp ON public.user_usage(timestamp DESC);
CREATE INDEX idx_user_usage_user_resource ON public.user_usage(user_id, resource_type, timestamp DESC);
CREATE INDEX idx_user_usage_today ON public.user_usage(user_id, resource_type)
    WHERE DATE(timestamp) = CURRENT_DATE;
CREATE INDEX idx_user_usage_week ON public.user_usage(user_id, resource_type, timestamp)
    WHERE timestamp >= NOW() - INTERVAL '7 days';

-- Conversation Logs Indexes
CREATE INDEX idx_conversation_logs_session ON public.conversation_logs(session_id, message_sequence);
CREATE INDEX idx_conversation_logs_user ON public.conversation_logs(user_id, timestamp DESC);
CREATE INDEX idx_conversation_logs_timestamp ON public.conversation_logs(timestamp DESC);

-- Daily Check-ins Indexes
CREATE INDEX idx_daily_check_ins_user ON public.daily_check_ins(user_id, check_in_date DESC);
CREATE INDEX idx_daily_check_ins_date ON public.daily_check_ins(check_in_date DESC);
CREATE INDEX idx_daily_check_ins_user_recent ON public.daily_check_ins(user_id, check_in_date DESC)
    WHERE check_in_date >= CURRENT_DATE - INTERVAL '30 days';

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_check_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_quotas ENABLE ROW LEVEL SECURITY;

-- Subscriptions Policies
CREATE POLICY "Users can view their own subscription"
    ON public.subscriptions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscription"
    ON public.subscriptions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscription"
    ON public.subscriptions FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- User Usage Policies
CREATE POLICY "Users can view their own usage"
    ON public.user_usage FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own usage"
    ON public.user_usage FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Conversation Logs Policies
CREATE POLICY "Users can view their own conversations"
    ON public.conversation_logs FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own conversations"
    ON public.conversation_logs FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Daily Check-ins Policies
CREATE POLICY "Users can view their own check-ins"
    ON public.daily_check_ins FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own check-ins"
    ON public.daily_check_ins FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own check-ins"
    ON public.daily_check_ins FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own check-ins"
    ON public.daily_check_ins FOR DELETE
    USING (auth.uid() = user_id);

-- Usage Quotas Policies (read-only for all authenticated users)
CREATE POLICY "Anyone can view usage quotas"
    ON public.usage_quotas FOR SELECT
    TO authenticated
    USING (true);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Auto-update updated_at timestamp
CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON public.subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_check_ins_updated_at
    BEFORE UPDATE ON public.daily_check_ins
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_usage_quotas_updated_at
    BEFORE UPDATE ON public.usage_quotas
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- FUNCTIONS: Usage Tracking & Limits
-- ============================================================================

-- Function to check if user has exceeded usage limits
CREATE OR REPLACE FUNCTION public.check_usage_limit(
    p_user_id UUID,
    p_resource_type TEXT,
    p_period TEXT DEFAULT 'daily' -- 'daily', 'weekly', 'monthly'
)
RETURNS TABLE (
    allowed BOOLEAN,
    current_usage BIGINT,
    limit_amount INTEGER,
    tier TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_tier TEXT;
    v_limit INTEGER;
    v_current BIGINT;
    v_period_start TIMESTAMPTZ;
BEGIN
    -- Get user's current tier
    SELECT s.tier INTO v_tier
    FROM public.subscriptions s
    WHERE s.user_id = p_user_id AND s.status = 'active'
    LIMIT 1;

    -- Default to free tier if no active subscription
    v_tier := COALESCE(v_tier, 'free');

    -- Get the limit for this tier and resource
    IF p_period = 'daily' THEN
        SELECT q.daily_limit INTO v_limit
        FROM public.usage_quotas q
        WHERE q.tier = v_tier AND q.resource_type = p_resource_type;

        v_period_start := CURRENT_DATE;
    ELSIF p_period = 'weekly' THEN
        SELECT q.weekly_limit INTO v_limit
        FROM public.usage_quotas q
        WHERE q.tier = v_tier AND q.resource_type = p_resource_type;

        v_period_start := DATE_TRUNC('week', NOW());
    ELSE -- monthly
        SELECT q.monthly_limit INTO v_limit
        FROM public.usage_quotas q
        WHERE q.tier = v_tier AND q.resource_type = p_resource_type;

        v_period_start := DATE_TRUNC('month', NOW());
    END IF;

    -- Count current usage in period
    SELECT COUNT(*) INTO v_current
    FROM public.user_usage u
    WHERE u.user_id = p_user_id
        AND u.resource_type = p_resource_type
        AND u.timestamp >= v_period_start;

    -- Return results
    RETURN QUERY SELECT
        (v_limit IS NULL OR v_current < v_limit) AS allowed,
        v_current AS current_usage,
        v_limit AS limit_amount,
        v_tier AS tier;
END;
$$;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION public.check_usage_limit(UUID, TEXT, TEXT) TO authenticated;

-- Function to get comprehensive user statistics
CREATE OR REPLACE FUNCTION public.get_comprehensive_user_stats(
    p_user_id UUID,
    p_days INTEGER DEFAULT 30
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'spirals', (
            SELECT json_build_object(
                'total', COUNT(*),
                'avg_duration', ROUND(AVG(duration_seconds)),
                'avg_reduction', ROUND(AVG(post_feeling - pre_feeling), 1),
                'most_common_trigger', (
                    SELECT trigger
                    FROM public.spiral_logs
                    WHERE user_id = p_user_id AND trigger IS NOT NULL
                    GROUP BY trigger
                    ORDER BY COUNT(*) DESC
                    LIMIT 1
                )
            )
            FROM public.spiral_logs
            WHERE user_id = p_user_id
                AND timestamp >= NOW() - (p_days || ' days')::INTERVAL
        ),
        'conversations', (
            SELECT json_build_object(
                'total', COUNT(*),
                'avg_reduction', ROUND(AVG(reduction_percentage), 1),
                'completion_rate', ROUND(
                    (COUNT(*) FILTER (WHERE exercise_completed = true)::NUMERIC /
                     NULLIF(COUNT(*)::NUMERIC, 0)) * 100,
                    1
                )
            )
            FROM public.ai_sessions
            WHERE user_id = p_user_id
                AND timestamp >= NOW() - (p_days || ' days')::INTERVAL
        ),
        'check_ins', (
            SELECT json_build_object(
                'total', COUNT(*),
                'avg_mood', ROUND(AVG(mood_rating), 1),
                'avg_energy', ROUND(AVG(energy_level), 1),
                'avg_sleep', ROUND(AVG(sleep_quality), 1),
                'streak_days', (
                    -- Calculate check-in streak
                    SELECT COUNT(*)
                    FROM generate_series(
                        CURRENT_DATE - INTERVAL '30 days',
                        CURRENT_DATE,
                        INTERVAL '1 day'
                    ) d(date)
                    WHERE EXISTS (
                        SELECT 1 FROM public.daily_check_ins
                        WHERE user_id = p_user_id
                            AND check_in_date = d.date::DATE
                    )
                )
            )
            FROM public.daily_check_ins
            WHERE user_id = p_user_id
                AND check_in_date >= CURRENT_DATE - p_days
        ),
        'usage', (
            SELECT json_build_object(
                'conversations_this_week', (
                    SELECT COUNT(*)
                    FROM public.user_usage
                    WHERE user_id = p_user_id
                        AND resource_type = 'conversation'
                        AND timestamp >= DATE_TRUNC('week', NOW())
                ),
                'exercises_this_week', (
                    SELECT COUNT(*)
                    FROM public.user_usage
                    WHERE user_id = p_user_id
                        AND resource_type = 'exercise'
                        AND timestamp >= DATE_TRUNC('week', NOW())
                )
            )
        )
    ) INTO result;

    RETURN result;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_comprehensive_user_stats(UUID, INTEGER) TO authenticated;

-- ============================================================================
-- SEED DATA: Default Usage Quotas
-- ============================================================================

INSERT INTO public.usage_quotas (tier, resource_type, daily_limit, weekly_limit, monthly_limit) VALUES
    -- Free Tier Limits
    ('free', 'conversation', 2, NULL, NULL),      -- 2 Anna chats per day
    ('free', 'exercise', NULL, 5, NULL),          -- 5 exercises per week
    ('free', 'voice_journal', 1, NULL, NULL),     -- 1 voice journal per day
    ('free', 'shift_session', NULL, NULL, NULL),  -- Unlimited Shift usage

    -- Premium Tier Limits (generous)
    ('premium', 'conversation', NULL, NULL, NULL),      -- Unlimited
    ('premium', 'exercise', NULL, NULL, NULL),          -- Unlimited
    ('premium', 'voice_journal', NULL, NULL, NULL),     -- Unlimited
    ('premium', 'shift_session', NULL, NULL, NULL),     -- Unlimited

    -- Premium Annual Tier (same as premium)
    ('premium_annual', 'conversation', NULL, NULL, NULL),
    ('premium_annual', 'exercise', NULL, NULL, NULL),
    ('premium_annual', 'voice_journal', NULL, NULL, NULL),
    ('premium_annual', 'shift_session', NULL, NULL, NULL)
ON CONFLICT (tier, resource_type) DO NOTHING;

-- ============================================================================
-- COMMENTS (Documentation)
-- ============================================================================

COMMENT ON TABLE public.subscriptions IS 'Stores RevenueCat subscription data for premium tier management';
COMMENT ON TABLE public.user_usage IS 'Tracks resource usage for enforcing tier-based limits';
COMMENT ON TABLE public.conversation_logs IS 'Detailed message logs for Anna AI therapy conversations';
COMMENT ON TABLE public.daily_check_ins IS 'Daily mood and wellness check-ins separate from spiral tracking';
COMMENT ON TABLE public.usage_quotas IS 'Reference table defining usage limits per tier and resource type';

COMMENT ON FUNCTION public.check_usage_limit(UUID, TEXT, TEXT) IS 'Checks if user has exceeded usage limits for a resource in a given period';
COMMENT ON FUNCTION public.get_comprehensive_user_stats(UUID, INTEGER) IS 'Returns comprehensive user statistics across all features for the specified number of days';

-- ============================================================================
-- DATA RETENTION POLICIES
-- ============================================================================

-- Function to archive old data (2+ years)
CREATE OR REPLACE FUNCTION public.archive_old_data()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Archive old conversation logs (keep last 2 years)
    DELETE FROM public.conversation_logs
    WHERE timestamp < NOW() - INTERVAL '2 years';

    -- Archive old user usage records (keep last 2 years)
    DELETE FROM public.user_usage
    WHERE timestamp < NOW() - INTERVAL '2 years';

    -- Keep daily check-ins for longer (3 years for trends)
    DELETE FROM public.daily_check_ins
    WHERE check_in_date < CURRENT_DATE - INTERVAL '3 years';
END;
$$;

-- Function for GDPR data export
CREATE OR REPLACE FUNCTION public.export_user_data(p_user_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN json_build_object(
        'profile', (SELECT row_to_json(t) FROM (SELECT * FROM public.user_profiles WHERE user_id = p_user_id) t),
        'subscription', (SELECT row_to_json(t) FROM (SELECT * FROM public.subscriptions WHERE user_id = p_user_id) t),
        'spiral_logs', (SELECT json_agg(row_to_json(t)) FROM (SELECT * FROM public.spiral_logs WHERE user_id = p_user_id ORDER BY timestamp DESC) t),
        'ai_sessions', (SELECT json_agg(row_to_json(t)) FROM (SELECT * FROM public.ai_sessions WHERE user_id = p_user_id ORDER BY timestamp DESC) t),
        'conversation_logs', (SELECT json_agg(row_to_json(t)) FROM (SELECT * FROM public.conversation_logs WHERE user_id = p_user_id ORDER BY timestamp DESC) t),
        'daily_check_ins', (SELECT json_agg(row_to_json(t)) FROM (SELECT * FROM public.daily_check_ins WHERE user_id = p_user_id ORDER BY check_in_date DESC) t),
        'user_usage', (SELECT json_agg(row_to_json(t)) FROM (SELECT * FROM public.user_usage WHERE user_id = p_user_id ORDER BY timestamp DESC) t),
        'fire_training', (SELECT json_agg(row_to_json(t)) FROM (SELECT * FROM public.fire_training_progress WHERE user_id = p_user_id) t),
        'voice_journals', (SELECT json_agg(row_to_json(t)) FROM (SELECT * FROM public.voice_journals WHERE user_id = p_user_id AND deleted_at IS NULL ORDER BY timestamp DESC) t)
    );
END;
$$;

-- Function to delete all user data (GDPR right to be forgotten)
CREATE OR REPLACE FUNCTION public.delete_user_data(p_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Delete all related data (CASCADE will handle most)
    DELETE FROM public.user_profiles WHERE user_id = p_user_id;

    -- Explicit deletes for non-cascading tables
    DELETE FROM public.shift_devices WHERE user_id = p_user_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.export_user_data(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.delete_user_data(UUID) TO authenticated;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

-- DailyHush Mobile App - Integration Schema
-- Safe to run on EXISTING Supabase project with newsletter tables
-- This will ADD mobile-specific tables without affecting existing data

-- Enable UUID extension (safe to run if already exists)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================
-- MOBILE USER PROFILES (separate from newsletter subscribers)
-- ================================================
CREATE TABLE IF NOT EXISTS public.user_profiles (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    age INTEGER,
    quiz_score INTEGER CHECK (quiz_score >= 1 AND quiz_score <= 10),
    has_shift_necklace BOOLEAN DEFAULT FALSE,
    shift_paired BOOLEAN DEFAULT FALSE,
    onboarding_completed BOOLEAN DEFAULT FALSE,
    fire_progress JSONB DEFAULT '{"focus": false, "interrupt": false, "reframe": false, "execute": false}'::jsonb,
    triggers TEXT[] DEFAULT ARRAY[]::TEXT[],
    peak_spiral_time TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- SPIRAL LOGS TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS public.spiral_logs (
    spiral_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(user_id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    trigger TEXT,
    duration_seconds INTEGER NOT NULL,
    interrupted BOOLEAN DEFAULT TRUE,
    pre_feeling INTEGER CHECK (pre_feeling >= 1 AND pre_feeling <= 10),
    post_feeling INTEGER CHECK (post_feeling >= 1 AND post_feeling <= 10),
    used_shift BOOLEAN DEFAULT FALSE,
    technique_used TEXT NOT NULL,
    location TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- PATTERN INSIGHTS TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS public.pattern_insights (
    insight_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(user_id) ON DELETE CASCADE,
    week_start DATE NOT NULL,
    total_spirals INTEGER DEFAULT 0,
    spirals_prevented INTEGER DEFAULT 0,
    avg_duration_seconds INTEGER DEFAULT 0,
    most_common_trigger TEXT,
    peak_time TEXT,
    improvement_vs_last_week INTEGER DEFAULT 0,
    insights TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, week_start)
);

-- ================================================
-- SHIFT DEVICE TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS public.shift_devices (
    device_id TEXT PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(user_id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    is_connected BOOLEAN DEFAULT FALSE,
    battery_level INTEGER CHECK (battery_level >= 0 AND battery_level <= 100),
    last_sync TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    firmware_version TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- SHIFT USAGE LOGS TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS public.shift_usage_logs (
    log_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(user_id) ON DELETE CASCADE,
    device_id TEXT NOT NULL REFERENCES public.shift_devices(device_id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    duration_seconds INTEGER NOT NULL,
    breath_count INTEGER,
    avg_breath_duration DECIMAL(5,2),
    heart_rate_before INTEGER,
    heart_rate_after INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- VOICE JOURNALS TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS public.voice_journals (
    journal_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(user_id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    audio_file TEXT NOT NULL,
    transcription TEXT,
    duration_seconds INTEGER NOT NULL,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- MOBILE SUBSCRIPTIONS TABLE
-- NOTE: If you already have a 'subscriptions' table for newsletter,
-- this creates a separate 'mobile_subscriptions' table.
-- You can merge them later if needed.
-- ================================================
CREATE TABLE IF NOT EXISTS public.mobile_subscriptions (
    subscription_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(user_id) ON DELETE CASCADE,
    tier TEXT NOT NULL CHECK (tier IN ('free', 'monthly', 'annual')),
    status TEXT NOT NULL CHECK (status IN ('active', 'past_due', 'canceled', 'trialing')),
    current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    trial_end TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- ================================================
-- FIRE TRAINING PROGRESS TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS public.fire_training_progress (
    progress_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(user_id) ON DELETE CASCADE,
    module TEXT NOT NULL CHECK (module IN ('focus', 'interrupt', 'reframe', 'execute')),
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    exercises_completed JSONB DEFAULT '[]'::jsonb,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, module)
);

-- ================================================
-- INDEXES for Performance
-- ================================================

-- Spiral logs indexes
CREATE INDEX IF NOT EXISTS idx_spiral_logs_user_id ON public.spiral_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_spiral_logs_timestamp ON public.spiral_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_spiral_logs_user_timestamp ON public.spiral_logs(user_id, timestamp DESC);

-- Pattern insights indexes
CREATE INDEX IF NOT EXISTS idx_pattern_insights_user_id ON public.pattern_insights(user_id);
CREATE INDEX IF NOT EXISTS idx_pattern_insights_week ON public.pattern_insights(week_start DESC);

-- Shift usage indexes
CREATE INDEX IF NOT EXISTS idx_shift_usage_user_id ON public.shift_usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_shift_usage_timestamp ON public.shift_usage_logs(timestamp DESC);

-- Voice journals indexes
CREATE INDEX IF NOT EXISTS idx_voice_journals_user_id ON public.voice_journals(user_id);
CREATE INDEX IF NOT EXISTS idx_voice_journals_timestamp ON public.voice_journals(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_voice_journals_not_deleted ON public.voice_journals(user_id) WHERE deleted_at IS NULL;

-- ================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ================================================

-- Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spiral_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pattern_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shift_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shift_usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voice_journals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mobile_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fire_training_progress ENABLE ROW LEVEL SECURITY;

-- User Profiles policies
CREATE POLICY "Users can view own profile"
    ON public.user_profiles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
    ON public.user_profiles FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
    ON public.user_profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Spiral Logs policies
CREATE POLICY "Users can view own spirals"
    ON public.spiral_logs FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own spirals"
    ON public.spiral_logs FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Pattern Insights policies
CREATE POLICY "Users can view own insights"
    ON public.pattern_insights FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "System can insert/update insights"
    ON public.pattern_insights FOR ALL
    USING (auth.uid() = user_id);

-- Shift Devices policies
CREATE POLICY "Users can view own devices"
    ON public.shift_devices FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own devices"
    ON public.shift_devices FOR UPDATE
    USING (auth.uid() = user_id);

-- Shift Usage Logs policies
CREATE POLICY "Users can view own usage logs"
    ON public.shift_usage_logs FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own usage logs"
    ON public.shift_usage_logs FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Voice Journals policies
CREATE POLICY "Users can view own journals"
    ON public.voice_journals FOR SELECT
    USING (auth.uid() = user_id AND deleted_at IS NULL);

CREATE POLICY "Users can insert own journals"
    ON public.voice_journals FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can soft-delete own journals"
    ON public.voice_journals FOR UPDATE
    USING (auth.uid() = user_id);

-- Mobile Subscriptions policies
CREATE POLICY "Users can view own subscription"
    ON public.mobile_subscriptions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "System can manage subscriptions"
    ON public.mobile_subscriptions FOR ALL
    USING (auth.uid() = user_id);

-- FIRE Training Progress policies
CREATE POLICY "Users can view own progress"
    ON public.fire_training_progress FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
    ON public.fire_training_progress FOR ALL
    USING (auth.uid() = user_id);

-- ================================================
-- FUNCTIONS & TRIGGERS
-- ================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_shift_devices_updated_at ON public.shift_devices;
CREATE TRIGGER update_shift_devices_updated_at
    BEFORE UPDATE ON public.shift_devices
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_mobile_subscriptions_updated_at ON public.mobile_subscriptions;
CREATE TRIGGER update_mobile_subscriptions_updated_at
    BEFORE UPDATE ON public.mobile_subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_fire_training_updated_at ON public.fire_training_progress;
CREATE TRIGGER update_fire_training_updated_at
    BEFORE UPDATE ON public.fire_training_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to auto-delete old voice journals (90 days)
CREATE OR REPLACE FUNCTION soft_delete_old_voice_journals()
RETURNS void AS $$
BEGIN
    UPDATE public.voice_journals
    SET deleted_at = NOW()
    WHERE created_at < NOW() - INTERVAL '90 days'
    AND deleted_at IS NULL;
END;
$$ LANGUAGE plpgsql;

-- ================================================
-- DONE!
-- ================================================
-- All mobile app tables created successfully.
-- Your existing newsletter tables are untouched.
-- Users can now use the same login for both platforms.

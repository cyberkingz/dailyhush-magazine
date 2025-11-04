-- Migration: Add AI Sessions Table for Therapy Conversation Tracking
-- Description: Track Anna's AI therapy conversations with pre/post scores, analytics, and user stats
-- Created: 2025-01-03

-- ============================================================================
-- TABLE: ai_sessions
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.ai_sessions (
    -- Primary Key
    session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- User Reference (Foreign Key)
    user_id UUID NOT NULL REFERENCES public.user_profiles(user_id) ON DELETE CASCADE,

    -- Session Timing
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    session_duration_seconds INTEGER,

    -- Feeling Scores (1-10 scale)
    pre_feeling INTEGER CHECK (pre_feeling >= 1 AND pre_feeling <= 10),
    post_feeling INTEGER CHECK (post_feeling >= 1 AND post_feeling <= 10),
    reduction_percentage INTEGER,

    -- Session Content
    trigger TEXT,
    conversation_summary TEXT,
    exercise_completed BOOLEAN DEFAULT false,

    -- AI Model Analytics
    model_used TEXT DEFAULT 'claude-sonnet-4-5',
    total_tokens INTEGER,
    cost_cents DECIMAL(10, 4),

    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Index for user-specific queries (most common query pattern)
CREATE INDEX idx_ai_sessions_user_id ON public.ai_sessions(user_id);

-- Index for timestamp-based sorting and filtering
CREATE INDEX idx_ai_sessions_timestamp ON public.ai_sessions(timestamp DESC);

-- Composite index for user + timestamp queries (optimized for user history)
CREATE INDEX idx_ai_sessions_user_timestamp ON public.ai_sessions(user_id, timestamp DESC);

-- Index for analytics queries on exercise completion
CREATE INDEX idx_ai_sessions_exercise_completed ON public.ai_sessions(user_id, exercise_completed);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on the table
ALTER TABLE public.ai_sessions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view only their own sessions
CREATE POLICY "Users can view their own AI sessions"
    ON public.ai_sessions
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: Users can insert only their own sessions
CREATE POLICY "Users can insert their own AI sessions"
    ON public.ai_sessions
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update only their own sessions (for post-session data)
CREATE POLICY "Users can update their own AI sessions"
    ON public.ai_sessions
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete only their own sessions
CREATE POLICY "Users can delete their own AI sessions"
    ON public.ai_sessions
    FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================================================
-- HELPER FUNCTION: get_user_ai_stats
-- ============================================================================

-- Function to get user AI session statistics
CREATE OR REPLACE FUNCTION public.get_user_ai_stats(user_uuid UUID)
RETURNS TABLE (
    total_sessions BIGINT,
    avg_reduction_percentage NUMERIC,
    completion_rate NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(*)::BIGINT as total_sessions,
        ROUND(AVG(reduction_percentage)::NUMERIC, 2) as avg_reduction_percentage,
        ROUND(
            (COUNT(*) FILTER (WHERE exercise_completed = true)::NUMERIC /
            NULLIF(COUNT(*)::NUMERIC, 0)) * 100,
            2
        ) as completion_rate
    FROM public.ai_sessions
    WHERE user_id = user_uuid;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_user_ai_stats(UUID) TO authenticated;

-- ============================================================================
-- TRIGGER: Auto-calculate reduction percentage
-- ============================================================================

-- Function to automatically calculate reduction percentage
CREATE OR REPLACE FUNCTION public.calculate_reduction_percentage()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    -- Calculate reduction percentage if both pre and post feelings are provided
    IF NEW.pre_feeling IS NOT NULL AND NEW.post_feeling IS NOT NULL THEN
        NEW.reduction_percentage := ROUND(
            ((NEW.pre_feeling - NEW.post_feeling)::NUMERIC / NEW.pre_feeling::NUMERIC) * 100
        )::INTEGER;
    END IF;

    RETURN NEW;
END;
$$;

-- Trigger to calculate reduction percentage on INSERT and UPDATE
CREATE TRIGGER trigger_calculate_reduction_percentage
    BEFORE INSERT OR UPDATE OF pre_feeling, post_feeling
    ON public.ai_sessions
    FOR EACH ROW
    EXECUTE FUNCTION public.calculate_reduction_percentage();

-- ============================================================================
-- COMMENTS (Documentation)
-- ============================================================================

COMMENT ON TABLE public.ai_sessions IS 'Tracks Anna AI therapy conversation sessions with pre/post feeling scores and analytics';
COMMENT ON COLUMN public.ai_sessions.session_id IS 'Unique identifier for each AI therapy session';
COMMENT ON COLUMN public.ai_sessions.user_id IS 'Foreign key to user_profiles - identifies the user';
COMMENT ON COLUMN public.ai_sessions.timestamp IS 'When the session occurred';
COMMENT ON COLUMN public.ai_sessions.session_duration_seconds IS 'Duration of the conversation in seconds';
COMMENT ON COLUMN public.ai_sessions.pre_feeling IS 'User feeling score before session (1-10 scale)';
COMMENT ON COLUMN public.ai_sessions.post_feeling IS 'User feeling score after session (1-10 scale)';
COMMENT ON COLUMN public.ai_sessions.reduction_percentage IS 'Auto-calculated percentage reduction in distress';
COMMENT ON COLUMN public.ai_sessions.trigger IS 'What triggered the user to start this session';
COMMENT ON COLUMN public.ai_sessions.conversation_summary IS 'AI-generated summary of the conversation';
COMMENT ON COLUMN public.ai_sessions.exercise_completed IS 'Whether user completed the recommended exercise';
COMMENT ON COLUMN public.ai_sessions.model_used IS 'AI model version used for this session';
COMMENT ON COLUMN public.ai_sessions.total_tokens IS 'Total tokens used in the conversation';
COMMENT ON COLUMN public.ai_sessions.cost_cents IS 'Cost of the session in cents for analytics';

COMMENT ON FUNCTION public.get_user_ai_stats(UUID) IS 'Returns aggregate statistics for a user: total sessions, average reduction %, and exercise completion rate';

-- ============================================================================
-- SAMPLE DATA (Optional - for development/testing)
-- ============================================================================

-- Uncomment below to insert sample data for testing
/*
INSERT INTO public.ai_sessions (
    user_id,
    timestamp,
    pre_feeling,
    post_feeling,
    session_duration_seconds,
    trigger,
    conversation_summary,
    exercise_completed,
    model_used,
    total_tokens,
    cost_cents
) VALUES
    (
        'sample-user-uuid-here',
        NOW() - INTERVAL '2 days',
        8,
        4,
        420,
        'Work deadline stress',
        'Discussed anxiety about upcoming presentation. Explored cognitive reframing techniques.',
        true,
        'claude-sonnet-4-5',
        1250,
        0.75
    );
*/

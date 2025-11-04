-- ============================================================================
-- EXERCISE LOGGING SYSTEM FOR DAILYHUSH
-- ============================================================================
-- Migration: Create comprehensive exercise logging infrastructure
-- Purpose: Track exercise completions, pre/post ratings, triggers, engagement
-- Author: DailyHush Supabase Expert
-- Date: 2025-01-04
-- ============================================================================

-- ============================================================================
-- 1. CREATE EXERCISE TYPES ENUM
-- ============================================================================
-- Defines the 6 exercise types in the app
CREATE TYPE exercise_type AS ENUM (
  'breathing',           -- Breathing exercises (e.g., 4-7-8, box breathing)
  'progressive_muscle',  -- Progressive muscle relaxation
  'brain_dump',          -- Free-form journaling (content not stored)
  'grounding',           -- 5-4-3-2-1 grounding technique
  'body_scan',           -- Body scan meditation
  'cognitive_reframe'    -- Cognitive reframing exercises
);

-- ============================================================================
-- 2. CREATE COMPLETION STATUS ENUM
-- ============================================================================
-- Tracks how the user ended the exercise session
CREATE TYPE completion_status AS ENUM (
  'completed',    -- User finished the entire exercise
  'abandoned',    -- User left mid-exercise (insights on friction points)
  'skipped'       -- User chose to skip before starting
);

-- ============================================================================
-- 3. CREATE MODULE TYPE ENUM
-- ============================================================================
-- Which FIRE module led them to this exercise
CREATE TYPE fire_module AS ENUM (
  'focus',      -- Module 1: FOCUS
  'interrupt',  -- Module 2: INTERRUPT
  'reframe',    -- Module 3: REFRAME
  'execute',    -- Module 4: EXECUTE
  'standalone', -- Not from training, standalone exercise
  'ai_anna',    -- Recommended by Anna AI therapist
  'suggestion'  -- From suggestion system
);

-- ============================================================================
-- 4. CREATE MAIN EXERCISE_LOGS TABLE
-- ============================================================================
CREATE TABLE exercise_logs (
  -- Primary Key
  log_id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),

  -- User Reference
  user_id UUID NOT NULL REFERENCES user_profiles(user_id) ON DELETE CASCADE,

  -- Exercise Identification
  exercise_type exercise_type NOT NULL,
  exercise_name TEXT NOT NULL, -- Human-readable name (e.g., "4-7-8 Breathing")

  -- Context & Source
  module_context fire_module NOT NULL DEFAULT 'standalone',
  fire_module_screen TEXT, -- Specific screen in module (for resume functionality)

  -- Completion Tracking
  completion_status completion_status NOT NULL DEFAULT 'completed',
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ, -- NULL if abandoned/skipped
  duration_seconds INTEGER, -- Actual time spent (even if abandoned)

  -- Pre/Post Anxiety Ratings (1-10 scale)
  pre_anxiety_rating INTEGER CHECK (pre_anxiety_rating >= 1 AND pre_anxiety_rating <= 10),
  post_anxiety_rating INTEGER CHECK (post_anxiety_rating >= 1 AND post_anxiety_rating <= 10),
  anxiety_reduction INTEGER GENERATED ALWAYS AS (
    CASE
      WHEN pre_anxiety_rating IS NOT NULL AND post_anxiety_rating IS NOT NULL
      THEN pre_anxiety_rating - post_anxiety_rating
      ELSE NULL
    END
  ) STORED, -- Auto-calculated reduction (positive = improvement)

  reduction_percentage INTEGER GENERATED ALWAYS AS (
    CASE
      WHEN pre_anxiety_rating IS NOT NULL
           AND post_anxiety_rating IS NOT NULL
           AND pre_anxiety_rating > 0
      THEN ROUND(((pre_anxiety_rating - post_anxiety_rating)::NUMERIC / pre_anxiety_rating::NUMERIC) * 100)::INTEGER
      ELSE NULL
    END
  ) STORED, -- Auto-calculated percentage reduction

  -- Trigger Information (Privacy-First: Optional)
  trigger_text TEXT, -- What caused the anxiety (user can choose to share)
  trigger_category TEXT, -- Pre-defined category if selected from list

  -- Engagement Metrics
  abandoned_at_percentage INTEGER CHECK (abandoned_at_percentage >= 0 AND abandoned_at_percentage <= 100),
  -- ^ If abandoned, how far did they get? (e.g., 30% = left at 30% mark)

  skip_reason TEXT, -- If skipped, why? (optional feedback)

  -- Exercise-Specific Data (JSONB for flexibility)
  exercise_data JSONB DEFAULT '{}'::JSONB,
  -- ^ Examples:
  --   Breathing: {"cycles_completed": 5, "target_cycles": 8}
  --   Brain Dump: {"word_count": 0} -- NO content stored, just count
  --   Grounding: {"items_identified": {"see": 5, "touch": 4, "hear": 3}}

  -- Privacy & Compliance
  is_deleted BOOLEAN DEFAULT FALSE, -- Soft delete for user privacy
  deleted_at TIMESTAMPTZ,

  -- Metadata
  device_type TEXT, -- 'ios', 'android', 'web'
  app_version TEXT, -- For debugging version-specific issues

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Constraints
  CONSTRAINT valid_completion_time CHECK (
    (completion_status = 'completed' AND completed_at IS NOT NULL) OR
    (completion_status IN ('abandoned', 'skipped'))
  ),

  CONSTRAINT valid_post_rating CHECK (
    (completion_status = 'completed' AND post_anxiety_rating IS NOT NULL) OR
    (completion_status IN ('abandoned', 'skipped') AND post_anxiety_rating IS NULL)
  )
);

-- ============================================================================
-- 5. CREATE SUPPORTING TABLE: EXERCISE_TRIGGERS (NORMALIZED)
-- ============================================================================
-- Pre-defined trigger categories for easy filtering & insights
CREATE TABLE exercise_triggers (
  trigger_id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  trigger_name TEXT NOT NULL UNIQUE,
  trigger_category TEXT NOT NULL, -- 'work', 'relationships', 'health', 'financial', 'other'
  display_order INTEGER DEFAULT 999,
  is_active BOOLEAN DEFAULT TRUE,
  loop_type TEXT CHECK (loop_type = ANY (ARRAY[
    'sleep-loop'::text,
    'decision-loop'::text,
    'social-loop'::text,
    'perfectionism-loop'::text,
    'all'::text
  ])), -- Which loop type this trigger is most relevant to
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed common triggers
INSERT INTO exercise_triggers (trigger_name, trigger_category, display_order, loop_type) VALUES
  ('Work deadline stress', 'work', 1, 'perfectionism-loop'),
  ('Difficult conversation', 'relationships', 2, 'social-loop'),
  ('Can''t make a decision', 'decision', 3, 'decision-loop'),
  ('Racing thoughts at night', 'sleep', 4, 'sleep-loop'),
  ('Upcoming presentation', 'work', 5, 'social-loop'),
  ('Health concern', 'health', 6, 'all'),
  ('Financial worry', 'financial', 7, 'all'),
  ('Relationship conflict', 'relationships', 8, 'social-loop'),
  ('Feeling overwhelmed', 'emotional', 9, 'all'),
  ('Comparing myself to others', 'social', 10, 'social-loop'),
  ('Fear of judgment', 'social', 11, 'social-loop'),
  ('Can''t stop overthinking', 'emotional', 12, 'all'),
  ('Something I said earlier', 'social', 13, 'social-loop'),
  ('Waiting for news/response', 'decision', 14, 'decision-loop'),
  ('Other', 'other', 999, 'all');

-- ============================================================================
-- 6. CREATE MATERIALIZED VIEW: EXERCISE_STATS (FOR ANALYTICS)
-- ============================================================================
-- Pre-computed statistics for fast dashboard queries
CREATE MATERIALIZED VIEW exercise_stats_by_user AS
SELECT
  user_id,
  exercise_type,

  -- Completion Metrics
  COUNT(*) as total_sessions,
  COUNT(*) FILTER (WHERE completion_status = 'completed') as completed_count,
  COUNT(*) FILTER (WHERE completion_status = 'abandoned') as abandoned_count,
  COUNT(*) FILTER (WHERE completion_status = 'skipped') as skipped_count,
  ROUND((COUNT(*) FILTER (WHERE completion_status = 'completed')::NUMERIC / NULLIF(COUNT(*), 0)) * 100, 1) as completion_rate,

  -- Effectiveness Metrics
  ROUND(AVG(pre_anxiety_rating) FILTER (WHERE pre_anxiety_rating IS NOT NULL), 1) as avg_pre_anxiety,
  ROUND(AVG(post_anxiety_rating) FILTER (WHERE post_anxiety_rating IS NOT NULL), 1) as avg_post_anxiety,
  ROUND(AVG(anxiety_reduction) FILTER (WHERE anxiety_reduction IS NOT NULL), 1) as avg_anxiety_reduction,
  ROUND(AVG(reduction_percentage) FILTER (WHERE reduction_percentage IS NOT NULL), 1) as avg_reduction_percentage,

  -- Duration Metrics
  ROUND(AVG(duration_seconds) FILTER (WHERE completion_status = 'completed'), 0) as avg_duration_completed,

  -- Engagement Metrics
  ROUND(AVG(abandoned_at_percentage) FILTER (WHERE completion_status = 'abandoned'), 0) as avg_abandonment_point,

  -- Time Metrics
  MAX(completed_at) as last_completed_at,
  DATE_TRUNC('day', MAX(completed_at)) as last_completed_date,

  -- Streak Helper
  COUNT(*) FILTER (WHERE completed_at >= CURRENT_DATE - INTERVAL '7 days' AND completion_status = 'completed') as completions_last_7_days,
  COUNT(*) FILTER (WHERE completed_at >= CURRENT_DATE - INTERVAL '30 days' AND completion_status = 'completed') as completions_last_30_days,

  -- Updated Timestamp
  NOW() as stats_updated_at

FROM exercise_logs
WHERE is_deleted = FALSE
GROUP BY user_id, exercise_type;

-- Create unique index for fast lookups
CREATE UNIQUE INDEX idx_exercise_stats_user_type ON exercise_stats_by_user(user_id, exercise_type);

-- ============================================================================
-- 7. CREATE INDEXES FOR PERFORMANCE
-- ============================================================================

-- Primary lookup: Get user's recent exercises
CREATE INDEX idx_exercise_logs_user_completed ON exercise_logs(user_id, completed_at DESC NULLS LAST)
  WHERE is_deleted = FALSE;

-- Streak calculations: Daily completions (using timestamp for streak queries)
CREATE INDEX idx_exercise_logs_user_completed_at ON exercise_logs(user_id, completed_at)
  WHERE completion_status = 'completed' AND is_deleted = FALSE;

-- Analytics: Exercise type performance
CREATE INDEX idx_exercise_logs_type_completed ON exercise_logs(exercise_type, completion_status, completed_at)
  WHERE is_deleted = FALSE;

-- Module tracking: Which modules lead to most completions
CREATE INDEX idx_exercise_logs_module ON exercise_logs(module_context, completion_status)
  WHERE is_deleted = FALSE;

-- Trigger analysis
CREATE INDEX idx_exercise_logs_trigger_category ON exercise_logs(trigger_category, exercise_type)
  WHERE trigger_category IS NOT NULL AND is_deleted = FALSE;

-- Abandonment analysis: Find friction points
CREATE INDEX idx_exercise_logs_abandoned ON exercise_logs(exercise_type, abandoned_at_percentage)
  WHERE completion_status = 'abandoned' AND is_deleted = FALSE;

-- GIN index for JSONB exercise_data queries
CREATE INDEX idx_exercise_logs_data ON exercise_logs USING GIN (exercise_data)
  WHERE is_deleted = FALSE;

-- Composite index for time-range queries (most common)
CREATE INDEX idx_exercise_logs_user_time_range ON exercise_logs(user_id, started_at, completion_status)
  WHERE is_deleted = FALSE;

-- ============================================================================
-- 8. CREATE ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS
ALTER TABLE exercise_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_triggers ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own exercise logs
CREATE POLICY "Users can view their own exercise logs"
  ON exercise_logs
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own exercise logs
CREATE POLICY "Users can insert their own exercise logs"
  ON exercise_logs
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own exercise logs
CREATE POLICY "Users can update their own exercise logs"
  ON exercise_logs
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can soft-delete their own exercise logs
CREATE POLICY "Users can soft-delete their own exercise logs"
  ON exercise_logs
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id
    AND is_deleted = TRUE
    AND deleted_at IS NOT NULL
  );

-- Policy: Everyone can read trigger categories (public reference data)
CREATE POLICY "Anyone can read exercise triggers"
  ON exercise_triggers
  FOR SELECT
  USING (is_active = TRUE);

-- Policy: Admins can manage triggers (check raw_app_meta_data)
CREATE POLICY "Admins can manage exercise triggers"
  ON exercise_triggers
  FOR ALL
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

-- ============================================================================
-- 9. CREATE HELPER FUNCTIONS
-- ============================================================================

-- Function: Calculate current streak
CREATE OR REPLACE FUNCTION get_exercise_streak(p_user_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_streak INTEGER := 0;
  v_current_date DATE := CURRENT_DATE;
  v_has_exercise BOOLEAN;
BEGIN
  -- Start from today and work backwards
  LOOP
    -- Check if user completed any exercise on this date
    SELECT EXISTS (
      SELECT 1
      FROM exercise_logs
      WHERE user_id = p_user_id
        AND DATE(completed_at) = v_current_date
        AND completion_status = 'completed'
        AND is_deleted = FALSE
    ) INTO v_has_exercise;

    -- If no exercise found, break the streak
    EXIT WHEN NOT v_has_exercise;

    -- Increment streak and move to previous day
    v_streak := v_streak + 1;
    v_current_date := v_current_date - INTERVAL '1 day';

    -- Safety: Don't go back more than 365 days
    EXIT WHEN v_streak > 365;
  END LOOP;

  RETURN v_streak;
END;
$$;

-- Function: Get user's most effective exercise type
CREATE OR REPLACE FUNCTION get_most_effective_exercise(p_user_id UUID)
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT exercise_type::TEXT
  FROM exercise_logs
  WHERE user_id = p_user_id
    AND completion_status = 'completed'
    AND reduction_percentage IS NOT NULL
    AND is_deleted = FALSE
  GROUP BY exercise_type
  ORDER BY AVG(reduction_percentage) DESC, COUNT(*) DESC
  LIMIT 1;
$$;

-- Function: Get most common trigger
CREATE OR REPLACE FUNCTION get_most_common_trigger(p_user_id UUID)
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT trigger_category
  FROM exercise_logs
  WHERE user_id = p_user_id
    AND trigger_category IS NOT NULL
    AND is_deleted = FALSE
  GROUP BY trigger_category
  ORDER BY COUNT(*) DESC
  LIMIT 1;
$$;

-- Function: Refresh materialized view (call periodically)
CREATE OR REPLACE FUNCTION refresh_exercise_stats()
RETURNS VOID
LANGUAGE sql
SECURITY DEFINER
AS $$
  REFRESH MATERIALIZED VIEW CONCURRENTLY exercise_stats_by_user;
$$;

-- ============================================================================
-- 10. CREATE TRIGGERS FOR AUTOMATIC UPDATES
-- ============================================================================

-- Trigger: Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_exercise_logs_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER exercise_logs_updated_at
  BEFORE UPDATE ON exercise_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_exercise_logs_updated_at();

-- Trigger: Set deleted_at when is_deleted is set to TRUE
CREATE OR REPLACE FUNCTION set_exercise_logs_deleted_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.is_deleted = TRUE AND OLD.is_deleted = FALSE THEN
    NEW.deleted_at = NOW();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER exercise_logs_deleted_at
  BEFORE UPDATE ON exercise_logs
  FOR EACH ROW
  WHEN (NEW.is_deleted = TRUE AND OLD.is_deleted = FALSE)
  EXECUTE FUNCTION set_exercise_logs_deleted_at();

-- ============================================================================
-- 11. CREATE SCHEDULED JOB TO REFRESH STATS (via pg_cron)
-- ============================================================================
-- Note: pg_cron must be enabled in Supabase project
-- This refreshes the materialized view every 6 hours

-- Uncomment if pg_cron is enabled:
-- SELECT cron.schedule(
--   'refresh-exercise-stats',
--   '0 */6 * * *', -- Every 6 hours
--   $$SELECT refresh_exercise_stats();$$
-- );

-- ============================================================================
-- 12. GRANT PERMISSIONS
-- ============================================================================

-- Grant access to authenticated users
GRANT SELECT, INSERT, UPDATE ON exercise_logs TO authenticated;
GRANT SELECT ON exercise_triggers TO authenticated;
GRANT SELECT ON exercise_stats_by_user TO authenticated;

-- Grant function execution
GRANT EXECUTE ON FUNCTION get_exercise_streak(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_most_effective_exercise(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_most_common_trigger(UUID) TO authenticated;

-- ============================================================================
-- 13. ADD HELPFUL COMMENTS
-- ============================================================================

COMMENT ON TABLE exercise_logs IS 'Comprehensive exercise completion tracking for DailyHush app. Stores pre/post anxiety ratings, triggers, engagement metrics, and completion status. Privacy-first design: journal content never stored, only metadata.';

COMMENT ON COLUMN exercise_logs.anxiety_reduction IS 'Auto-calculated: pre_anxiety_rating - post_anxiety_rating. Positive = improvement.';

COMMENT ON COLUMN exercise_logs.reduction_percentage IS 'Auto-calculated: ((pre - post) / pre) * 100. Useful for "You reduced anxiety by X%" messaging.';

COMMENT ON COLUMN exercise_logs.exercise_data IS 'Flexible JSONB field for exercise-specific data. Examples: {"cycles_completed": 5}, {"word_count": 247}. Never stores journal content from Brain Dump.';

COMMENT ON COLUMN exercise_logs.abandoned_at_percentage IS 'If user abandoned exercise, what percentage mark did they reach? (0-100). Useful for identifying friction points.';

COMMENT ON TABLE exercise_triggers IS 'Pre-defined trigger categories for exercise sessions. Normalized to enable easy filtering, trending, and personalized insights.';

COMMENT ON MATERIALIZED VIEW exercise_stats_by_user IS 'Pre-computed exercise statistics per user per exercise type. Refresh every 6 hours via pg_cron. Use for fast dashboard queries.';

COMMENT ON FUNCTION get_exercise_streak(UUID) IS 'Calculate current exercise streak for a user. Returns number of consecutive days with at least one completed exercise.';

COMMENT ON FUNCTION get_most_effective_exercise(UUID) IS 'Returns the exercise type with the highest average anxiety reduction percentage for a user.';

COMMENT ON FUNCTION refresh_exercise_stats() IS 'Manually refresh the exercise_stats_by_user materialized view. Called automatically every 6 hours via pg_cron.';

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

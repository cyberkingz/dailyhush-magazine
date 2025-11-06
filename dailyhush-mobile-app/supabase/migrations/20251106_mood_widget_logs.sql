-- ================================================
-- MOOD WIDGET LOGS TABLE
-- Inline quick mood capture for home page widget
-- ================================================
-- This table stores quick mood logs from the inline widget.
-- This is separate from the therapeutic 4-step mood_entries flow.
--
-- Widget captures:
-- - Mood selection (calm, anxious, sad, frustrated, mixed)
-- - Intensity rating (1-7 scale)
-- - Optional quick notes
-- - Timestamp
--
-- Design principles:
-- - One log per user per day (upsert pattern)
-- - Fast writes for instant feedback
-- - No encryption (quick notes are optional and non-therapeutic)
-- - Full RLS for data security
--
-- Author: Supabase Expert
-- Date: 2025-11-06
-- ================================================

-- ================================================
-- TABLE DEFINITION
-- ================================================

CREATE TABLE IF NOT EXISTS public.mood_logs (
  -- Primary identification
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  user_id UUID NOT NULL,

  -- Mood data (uses existing mood_type enum)
  mood mood_type NOT NULL,
  mood_emoji TEXT NOT NULL, -- Emoji representation (e.g., '😊', '😰', '😢', '😤', '🌤️')

  -- Intensity (1-7 scale for widget)
  intensity INTEGER NOT NULL CHECK (intensity >= 1 AND intensity <= 7),

  -- Optional quick notes (not encrypted - for quick capture only)
  notes TEXT,

  -- Date tracking (for "one log per day" logic)
  log_date DATE NOT NULL DEFAULT CURRENT_DATE,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Soft delete support
  deleted_at TIMESTAMPTZ,

  -- Foreign key constraint
  CONSTRAINT mood_logs_user_fk FOREIGN KEY (user_id)
    REFERENCES public.user_profiles(user_id)
    ON DELETE CASCADE,

  -- Unique constraint: one log per user per day
  CONSTRAINT mood_logs_user_date_unique UNIQUE (user_id, log_date)
);

-- ================================================
-- INDEXES FOR PERFORMANCE
-- ================================================

-- Primary query patterns
CREATE INDEX idx_mood_logs_user_id ON public.mood_logs(user_id);
CREATE INDEX idx_mood_logs_user_date ON public.mood_logs(user_id, log_date DESC);
CREATE INDEX idx_mood_logs_created ON public.mood_logs(user_id, created_at DESC);

-- Today's mood lookup (most common query)
CREATE INDEX idx_mood_logs_today ON public.mood_logs(user_id, log_date)
  WHERE deleted_at IS NULL;

-- Analytics queries
CREATE INDEX idx_mood_logs_mood_type ON public.mood_logs(mood)
  WHERE deleted_at IS NULL;

-- Soft delete support
CREATE INDEX idx_mood_logs_not_deleted ON public.mood_logs(user_id)
  WHERE deleted_at IS NULL;

-- ================================================
-- AUTO-UPDATE TRIGGER
-- ================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_mood_logs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER mood_logs_updated_at
  BEFORE UPDATE ON public.mood_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_mood_logs_updated_at();

-- ================================================
-- HELPER FUNCTIONS
-- ================================================

/**
 * Get today's mood log for current user
 * Most common query pattern
 */
CREATE OR REPLACE FUNCTION get_today_mood_log(p_user_id UUID)
RETURNS TABLE (
  id UUID,
  mood mood_type,
  mood_emoji TEXT,
  intensity INTEGER,
  notes TEXT,
  log_date DATE,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ml.id,
    ml.mood,
    ml.mood_emoji,
    ml.intensity,
    ml.notes,
    ml.log_date,
    ml.created_at,
    ml.updated_at
  FROM public.mood_logs ml
  WHERE ml.user_id = p_user_id
    AND ml.log_date = CURRENT_DATE
    AND ml.deleted_at IS NULL
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION get_today_mood_log IS
  'Retrieves today''s mood log for a specific user. Returns null if no log exists for today.';

/**
 * Get mood log history for date range
 * Used for charts and analytics
 */
CREATE OR REPLACE FUNCTION get_mood_log_history(
  p_user_id UUID,
  p_start_date DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
  p_end_date DATE DEFAULT CURRENT_DATE,
  p_limit INTEGER DEFAULT 100
)
RETURNS TABLE (
  id UUID,
  mood mood_type,
  mood_emoji TEXT,
  intensity INTEGER,
  notes TEXT,
  log_date DATE,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ml.id,
    ml.mood,
    ml.mood_emoji,
    ml.intensity,
    ml.notes,
    ml.log_date,
    ml.created_at
  FROM public.mood_logs ml
  WHERE ml.user_id = p_user_id
    AND ml.log_date >= p_start_date
    AND ml.log_date <= p_end_date
    AND ml.deleted_at IS NULL
  ORDER BY ml.log_date DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION get_mood_log_history IS
  'Retrieves mood log history for a user within a date range. Defaults to last 30 days.';

/**
 * Get mood statistics for analytics
 */
CREATE OR REPLACE FUNCTION get_mood_stats(
  p_user_id UUID,
  p_days INTEGER DEFAULT 30
)
RETURNS TABLE (
  total_logs INTEGER,
  most_common_mood mood_type,
  avg_intensity NUMERIC,
  mood_distribution JSONB,
  streak_days INTEGER
) AS $$
BEGIN
  RETURN QUERY
  WITH stats AS (
    SELECT
      COUNT(*)::INTEGER as total,
      MODE() WITHIN GROUP (ORDER BY mood) as common_mood,
      AVG(intensity) as avg_int,
      jsonb_object_agg(
        mood::TEXT,
        COUNT(*)
      ) as mood_dist
    FROM public.mood_logs
    WHERE user_id = p_user_id
      AND deleted_at IS NULL
      AND log_date >= CURRENT_DATE - (p_days || ' days')::INTERVAL
  ),
  streak AS (
    SELECT COUNT(*)::INTEGER as streak
    FROM (
      SELECT log_date
      FROM public.mood_logs
      WHERE user_id = p_user_id
        AND deleted_at IS NULL
        AND log_date >= CURRENT_DATE - INTERVAL '365 days'
      ORDER BY log_date DESC
    ) dates
    WHERE log_date >= CURRENT_DATE - (ROW_NUMBER() OVER () - 1)
  )
  SELECT
    COALESCE(stats.total, 0),
    stats.common_mood,
    ROUND(COALESCE(stats.avg_int, 0), 2),
    COALESCE(stats.mood_dist, '{}'::jsonb),
    COALESCE(streak.streak, 0)
  FROM stats
  CROSS JOIN streak;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION get_mood_stats IS
  'Calculates mood statistics for a user over a specified time period.';

-- ================================================
-- ROW LEVEL SECURITY (RLS)
-- ================================================

ALTER TABLE public.mood_logs ENABLE ROW LEVEL SECURITY;

-- Users can only view their own mood logs
CREATE POLICY "Users can view own mood logs"
  ON public.mood_logs
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own mood logs
CREATE POLICY "Users can insert own mood logs"
  ON public.mood_logs
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own mood logs
CREATE POLICY "Users can update own mood logs"
  ON public.mood_logs
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete (soft delete) their own mood logs
CREATE POLICY "Users can delete own mood logs"
  ON public.mood_logs
  FOR DELETE
  USING (auth.uid() = user_id);

-- ================================================
-- TABLE COMMENTS & DOCUMENTATION
-- ================================================

COMMENT ON TABLE public.mood_logs IS
  'Quick mood logs from inline widget. Stores daily mood check-ins with mood type, intensity (1-7), and optional notes. One log per user per day.';

COMMENT ON COLUMN public.mood_logs.mood IS
  'Selected mood type (calm, anxious, sad, frustrated, mixed). Uses existing mood_type enum.';

COMMENT ON COLUMN public.mood_logs.intensity IS
  'Intensity rating from 1-7 (1=Very Mild, 4=Moderate, 7=Very Strong).';

COMMENT ON COLUMN public.mood_logs.notes IS
  'Optional quick notes. Not encrypted (use mood_entries for sensitive therapeutic content).';

COMMENT ON COLUMN public.mood_logs.log_date IS
  'Date key for "one log per day" logic. Defaults to current date in user timezone.';

-- ================================================
-- EXAMPLE QUERIES
-- ================================================

/*
-- Insert or update today's mood log
INSERT INTO public.mood_logs (user_id, mood, mood_emoji, intensity, notes, log_date)
VALUES (
  auth.uid(),
  'calm',
  '😊',
  4,
  'Feeling peaceful today',
  CURRENT_DATE
)
ON CONFLICT (user_id, log_date)
DO UPDATE SET
  mood = EXCLUDED.mood,
  mood_emoji = EXCLUDED.mood_emoji,
  intensity = EXCLUDED.intensity,
  notes = EXCLUDED.notes,
  updated_at = NOW();

-- Get today's mood
SELECT * FROM get_today_mood_log(auth.uid());

-- Get last 30 days
SELECT * FROM get_mood_log_history(auth.uid());

-- Get statistics
SELECT * FROM get_mood_stats(auth.uid(), 30);
*/

-- ================================================
-- GRANTS
-- ================================================

-- Grant execute permissions on functions to authenticated users
GRANT EXECUTE ON FUNCTION get_today_mood_log(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_mood_log_history(UUID, DATE, DATE, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_mood_stats(UUID, INTEGER) TO authenticated;

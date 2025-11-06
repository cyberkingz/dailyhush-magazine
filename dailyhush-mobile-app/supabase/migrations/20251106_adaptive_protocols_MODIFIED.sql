-- ============================================================================
-- Adaptive Protocol System Migration (MODIFIED FOR EXISTING SCHEMA)
-- ============================================================================
-- Creates tables, triggers, and indexes to track technique effectiveness
-- and enable personalized protocol recommendations based on user history.
--
-- MODIFICATIONS FROM ORIGINAL:
-- 1. FK references user_profiles.user_id (not auth.users) - matches existing pattern
-- 2. Uses existing technique_used column (not technique_name)
-- 3. Uses existing duration_seconds column (not protocol_duration)
-- 4. Adds RLS policies for new table
-- 5. Trigger function updated to work with existing column names
--
-- This migration:
-- 1. Creates user_technique_stats table for tracking technique effectiveness
-- 2. Enhances spiral_logs with NEW protocol-specific columns only
-- 3. Implements automatic stats calculation via triggers
-- 4. Adds performance indexes
-- 5. Adds RLS policies
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. CREATE user_technique_stats TABLE
-- ----------------------------------------------------------------------------
-- Tracks effectiveness metrics for each technique per user
-- Stats are automatically updated via trigger when new spiral_logs are inserted

CREATE TABLE IF NOT EXISTS user_technique_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(user_id) ON DELETE CASCADE,
  technique_id TEXT NOT NULL,
  times_used INTEGER NOT NULL DEFAULT 0,
  times_successful INTEGER NOT NULL DEFAULT 0,
  avg_reduction DECIMAL(3,2) NOT NULL DEFAULT 0.00,
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Ensure one row per user per technique
  CONSTRAINT unique_user_technique UNIQUE (user_id, technique_id),

  -- Validation constraints
  CONSTRAINT valid_usage_counts CHECK (times_used >= 0),
  CONSTRAINT valid_success_counts CHECK (times_successful >= 0 AND times_successful <= times_used),
  CONSTRAINT valid_avg_reduction CHECK (avg_reduction >= -10.00 AND avg_reduction <= 10.00)
);

-- Add documentation comments
COMMENT ON TABLE user_technique_stats IS 'Tracks effectiveness metrics for each technique per user. Updated automatically via trigger when spiral_logs are inserted.';
COMMENT ON COLUMN user_technique_stats.technique_id IS 'Matches technique IDs from app (e.g., "grounding-5-4-3-2-1", "box-breathing", "cognitive-reframe")';
COMMENT ON COLUMN user_technique_stats.times_used IS 'Total number of times this technique has been used by the user';
COMMENT ON COLUMN user_technique_stats.times_successful IS 'Count of uses where anxiety reduction >= 2 points (pre_feeling - post_feeling >= 2)';
COMMENT ON COLUMN user_technique_stats.avg_reduction IS 'Running average of anxiety reduction (pre_feeling - post_feeling). Positive = improvement';
COMMENT ON COLUMN user_technique_stats.last_used_at IS 'Timestamp of most recent use of this technique';

-- ----------------------------------------------------------------------------
-- 2. ENHANCE spiral_logs TABLE (ADD ONLY NEW COLUMNS)
-- ----------------------------------------------------------------------------
-- Add columns for protocol-specific tracking and AI decision rationale
-- NOTE: We use existing technique_used and duration_seconds columns

ALTER TABLE spiral_logs
  ADD COLUMN IF NOT EXISTS technique_id TEXT;

ALTER TABLE spiral_logs
  ADD COLUMN IF NOT EXISTS selection_confidence DECIMAL(3,2);

ALTER TABLE spiral_logs
  ADD COLUMN IF NOT EXISTS selection_rationale TEXT;

ALTER TABLE spiral_logs
  ADD COLUMN IF NOT EXISTS interactive_responses JSONB;

-- Add comments for new columns
COMMENT ON COLUMN spiral_logs.technique_id IS 'Unique identifier for the technique used (matches user_technique_stats.technique_id). Maps to existing technique_used for human-readable name.';
COMMENT ON COLUMN spiral_logs.selection_confidence IS 'AI confidence score (0.00-1.00) for technique selection';
COMMENT ON COLUMN spiral_logs.selection_rationale IS 'AI explanation for why this technique was selected';
COMMENT ON COLUMN spiral_logs.interactive_responses IS 'Stores user responses during interactive protocols (e.g., 5-4-3-2-1 items, naming exercise responses)';

-- Add comment clarifying existing columns are used
COMMENT ON COLUMN spiral_logs.technique_used IS 'Human-readable name of technique (existing column used by adaptive system instead of technique_name)';
COMMENT ON COLUMN spiral_logs.duration_seconds IS 'Duration of the protocol execution in seconds (existing column used by adaptive system instead of protocol_duration)';

-- ----------------------------------------------------------------------------
-- 3. CREATE TRIGGER FUNCTION FOR AUTOMATIC STATS UPDATES
-- ----------------------------------------------------------------------------
-- Automatically recalculates user_technique_stats when new spiral_logs are inserted
-- Uses running average formula to efficiently update avg_reduction
-- MODIFIED: Works with existing column names (technique_used, duration_seconds)

CREATE OR REPLACE FUNCTION update_technique_stats()
RETURNS TRIGGER AS $$
DECLARE
  reduction DECIMAL(3,2);
  is_successful BOOLEAN;
BEGIN
  -- Only process if technique_id is provided and both feelings are recorded
  IF NEW.technique_id IS NULL OR NEW.pre_feeling IS NULL OR NEW.post_feeling IS NULL THEN
    RETURN NEW;
  END IF;

  -- Calculate anxiety reduction (positive = improvement)
  reduction := NEW.pre_feeling - NEW.post_feeling;

  -- Determine if intervention was successful (>= 2 point reduction)
  is_successful := reduction >= 2;

  -- UPSERT into user_technique_stats
  -- If row exists: update stats using running average formula
  -- If row doesn't exist: insert new row with initial stats
  INSERT INTO user_technique_stats (
    user_id,
    technique_id,
    times_used,
    times_successful,
    avg_reduction,
    last_used_at,
    updated_at
  )
  VALUES (
    NEW.user_id,
    NEW.technique_id,
    1, -- Initial use count
    CASE WHEN is_successful THEN 1 ELSE 0 END, -- Initial success count
    reduction, -- Initial average
    NEW.timestamp,
    NOW()
  )
  ON CONFLICT (user_id, technique_id)
  DO UPDATE SET
    times_used = user_technique_stats.times_used + 1,
    times_successful = user_technique_stats.times_successful + CASE WHEN is_successful THEN 1 ELSE 0 END,
    -- Running average formula: ((old_avg * old_count) + new_value) / new_count
    avg_reduction = (
      (user_technique_stats.avg_reduction * user_technique_stats.times_used) + reduction
    ) / (user_technique_stats.times_used + 1),
    last_used_at = NEW.timestamp,
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION update_technique_stats() IS 'Trigger function that automatically updates user_technique_stats when new spiral_logs are inserted. Calculates success rate and running average of anxiety reduction.';

-- ----------------------------------------------------------------------------
-- 4. CREATE TRIGGER ON spiral_logs
-- ----------------------------------------------------------------------------
-- Executes after each insert to keep stats synchronized

DROP TRIGGER IF EXISTS trigger_update_technique_stats ON spiral_logs;

CREATE TRIGGER trigger_update_technique_stats
  AFTER INSERT ON spiral_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_technique_stats();

COMMENT ON TRIGGER trigger_update_technique_stats ON spiral_logs IS 'Automatically updates user_technique_stats after each spiral log insertion';

-- ----------------------------------------------------------------------------
-- 5. CREATE PERFORMANCE INDEXES
-- ----------------------------------------------------------------------------
-- Optimizes common query patterns for adaptive protocol selection

-- Fast lookup of stats for a specific user and technique
CREATE INDEX IF NOT EXISTS idx_user_technique_stats_lookup
  ON user_technique_stats(user_id, technique_id);

-- Efficient ordering by most recently used (for recency-based recommendations)
CREATE INDEX IF NOT EXISTS idx_user_technique_stats_last_used
  ON user_technique_stats(user_id, last_used_at DESC NULLS LAST);

-- Quick access to recent logs by technique for pattern analysis
CREATE INDEX IF NOT EXISTS idx_spiral_logs_technique
  ON spiral_logs(user_id, technique_id, timestamp DESC)
  WHERE technique_id IS NOT NULL;

-- Support queries filtering by success (for analytics)
CREATE INDEX IF NOT EXISTS idx_user_technique_stats_success_rate
  ON user_technique_stats(user_id, times_successful, times_used)
  WHERE times_used > 0;

-- ----------------------------------------------------------------------------
-- 6. ADD RLS POLICIES FOR user_technique_stats
-- ----------------------------------------------------------------------------
-- Enable RLS and create policies matching spiral_logs pattern

ALTER TABLE user_technique_stats ENABLE ROW LEVEL SECURITY;

-- Users can view their own technique stats
CREATE POLICY "Users can view own technique stats"
  ON user_technique_stats
  FOR SELECT
  TO public
  USING (auth.uid() = user_id);

-- Users can insert their own technique stats (though trigger usually handles this)
CREATE POLICY "Users can insert own technique stats"
  ON user_technique_stats
  FOR INSERT
  TO public
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own technique stats (though trigger usually handles this)
CREATE POLICY "Users can update own technique stats"
  ON user_technique_stats
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own technique stats
CREATE POLICY "Users can delete own technique stats"
  ON user_technique_stats
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- 7. BACKFILL EXISTING DATA (OPTIONAL)
-- ----------------------------------------------------------------------------
-- If you want to populate stats for existing 16 spiral_logs:
-- Uncomment the following INSERT statement
/*
INSERT INTO user_technique_stats (user_id, technique_id, times_used, times_successful, avg_reduction, last_used_at)
SELECT
  user_id,
  COALESCE(technique_id, technique_used) as technique_id,
  COUNT(*) as times_used,
  COUNT(*) FILTER (WHERE (pre_feeling - post_feeling) >= 2) as times_successful,
  AVG(pre_feeling - post_feeling) as avg_reduction,
  MAX(timestamp) as last_used_at
FROM spiral_logs
WHERE pre_feeling IS NOT NULL AND post_feeling IS NOT NULL
GROUP BY user_id, COALESCE(technique_id, technique_used)
ON CONFLICT (user_id, technique_id) DO NOTHING;
*/

-- ----------------------------------------------------------------------------
-- MIGRATION COMPLETE
-- ----------------------------------------------------------------------------
-- The adaptive protocol system is now ready to:
-- - Track which techniques work best for each user
-- - Calculate success rates and average anxiety reduction
-- - Enable personalized protocol recommendations
-- - Support pattern analysis and insights
--
-- INTEGRATION NOTES:
-- 1. App should populate technique_id when logging spirals (e.g., "grounding-5-4-3-2-1")
-- 2. technique_used remains for human-readable display (e.g., "5-4-3-2-1 Grounding")
-- 3. duration_seconds is used for protocol duration (existing column)
-- 4. Query user_technique_stats for personalized recommendations
-- 5. Use selection_confidence and selection_rationale for transparency
-- 6. Existing 16 spiral_logs remain untouched (technique_id will be NULL)
-- ----------------------------------------------------------------------------

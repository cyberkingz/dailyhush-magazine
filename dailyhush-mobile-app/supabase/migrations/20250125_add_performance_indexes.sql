-- Add performance indexes for spiral_logs table
-- These optimize common query patterns for the insights feature

-- Index for user's spiral history (most common query)
-- Speeds up: SELECT * FROM spiral_logs WHERE user_id = ? ORDER BY timestamp DESC
CREATE INDEX IF NOT EXISTS idx_spiral_logs_user_timestamp
  ON spiral_logs(user_id, timestamp DESC);

-- Index for time-based queries (last 7 days, last 30 days, etc.)
-- Speeds up: SELECT * FROM spiral_logs WHERE timestamp >= ?
CREATE INDEX IF NOT EXISTS idx_spiral_logs_timestamp
  ON spiral_logs(timestamp DESC);

-- Index for trigger analysis
-- Speeds up: SELECT trigger, COUNT(*) FROM spiral_logs WHERE user_id = ? GROUP BY trigger
CREATE INDEX IF NOT EXISTS idx_spiral_logs_user_trigger
  ON spiral_logs(user_id, trigger)
  WHERE trigger IS NOT NULL;

-- Index for technique effectiveness queries
-- Speeds up: SELECT technique_used, AVG(post_feeling - pre_feeling) FROM spiral_logs...
CREATE INDEX IF NOT EXISTS idx_spiral_logs_user_technique
  ON spiral_logs(user_id, technique_used)
  WHERE technique_used IS NOT NULL;

-- Index for successful interruptions analytics
-- Speeds up: SELECT COUNT(*) FROM spiral_logs WHERE user_id = ? AND interrupted = true
CREATE INDEX IF NOT EXISTS idx_spiral_logs_user_interrupted
  ON spiral_logs(user_id, interrupted);

-- Index for Shift necklace usage tracking
-- Speeds up: SELECT COUNT(*) FROM spiral_logs WHERE user_id = ? AND used_shift = true
CREATE INDEX IF NOT EXISTS idx_spiral_logs_user_shift
  ON spiral_logs(user_id, used_shift)
  WHERE used_shift = true;

-- Composite index for insights calculation (time range + user)
-- Speeds up: SELECT * FROM spiral_logs WHERE user_id = ? AND timestamp BETWEEN ? AND ?
CREATE INDEX IF NOT EXISTS idx_spiral_logs_user_time_range
  ON spiral_logs(user_id, timestamp DESC, interrupted);

-- Add comments for documentation
COMMENT ON INDEX idx_spiral_logs_user_timestamp IS
  'Optimizes user spiral history queries sorted by time';
COMMENT ON INDEX idx_spiral_logs_timestamp IS
  'Optimizes time-based queries across all users';
COMMENT ON INDEX idx_spiral_logs_user_trigger IS
  'Optimizes trigger analysis and pattern detection';
COMMENT ON INDEX idx_spiral_logs_user_technique IS
  'Optimizes technique effectiveness calculations';
COMMENT ON INDEX idx_spiral_logs_user_interrupted IS
  'Optimizes success rate calculations';
COMMENT ON INDEX idx_spiral_logs_user_shift IS
  'Optimizes Shift necklace usage analytics';
COMMENT ON INDEX idx_spiral_logs_user_time_range IS
  'Optimizes insights calculation for specific time periods';

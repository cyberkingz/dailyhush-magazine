-- Create spiral_logs table to track all rumination spirals
-- This is the core data table for pattern insights and analytics

CREATE TABLE spiral_logs (
  spiral_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  trigger TEXT,
  duration_seconds INTEGER NOT NULL,
  interrupted BOOLEAN DEFAULT false,
  pre_feeling INTEGER CHECK (pre_feeling BETWEEN 1 AND 10),
  post_feeling INTEGER CHECK (post_feeling BETWEEN 1 AND 10),
  used_shift BOOLEAN DEFAULT false,
  technique_used TEXT,
  location TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add comment for documentation
COMMENT ON TABLE spiral_logs IS 'Records each rumination spiral and intervention outcome';
COMMENT ON COLUMN spiral_logs.trigger IS 'What triggered the spiral (e.g., "conversations", "health concerns")';
COMMENT ON COLUMN spiral_logs.duration_seconds IS 'Total duration of the spiral in seconds';
COMMENT ON COLUMN spiral_logs.interrupted IS 'Whether the spiral was successfully interrupted';
COMMENT ON COLUMN spiral_logs.pre_feeling IS 'Anxiety level before intervention (1-10 scale)';
COMMENT ON COLUMN spiral_logs.post_feeling IS 'Anxiety level after intervention (1-10 scale)';
COMMENT ON COLUMN spiral_logs.used_shift IS 'Whether Shift necklace was used during intervention';
COMMENT ON COLUMN spiral_logs.technique_used IS 'Technique used (e.g., "breathing", "5-4-3-2-1", "naming")';

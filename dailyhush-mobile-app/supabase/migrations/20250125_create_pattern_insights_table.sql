-- Create pattern_insights table to store aggregated analytics
-- This powers the "Pattern Insights" feature showing trends and effectiveness

CREATE TABLE pattern_insights (
  insight_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  time_period TEXT NOT NULL, -- e.g., 'last_7_days', 'last_30_days', 'all_time'
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ NOT NULL,

  -- Spiral Statistics
  total_spirals INTEGER DEFAULT 0,
  successful_interruptions INTEGER DEFAULT 0,
  success_rate NUMERIC(5,2), -- Percentage: 0.00 to 100.00

  -- Trigger Analysis
  most_common_trigger TEXT,
  trigger_counts JSONB, -- {"conversations": 15, "health_concerns": 8, ...}

  -- Technique Effectiveness
  most_effective_technique TEXT,
  technique_stats JSONB, -- {"breathing": {"count": 10, "avg_improvement": 3.5}, ...}

  -- Feeling Improvements
  average_pre_feeling NUMERIC(4,2), -- Average 1-10 scale before intervention
  average_post_feeling NUMERIC(4,2), -- Average 1-10 scale after intervention
  average_improvement NUMERIC(4,2), -- Average improvement in feeling

  -- Time Patterns
  peak_spiral_hours JSONB, -- {"0": 2, "1": 0, "2": 1, ..., "23": 3} - count per hour
  peak_spiral_days JSONB, -- {"monday": 5, "tuesday": 3, ...}

  -- Shift Necklace Usage
  shift_usage_count INTEGER DEFAULT 0,
  shift_success_rate NUMERIC(5,2),

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for fast lookups
CREATE INDEX idx_pattern_insights_user_period ON pattern_insights(user_id, time_period);
CREATE INDEX idx_pattern_insights_period_end ON pattern_insights(period_end DESC);

-- Add comments for documentation
COMMENT ON TABLE pattern_insights IS 'Stores aggregated analytics about user rumination patterns';
COMMENT ON COLUMN pattern_insights.time_period IS 'Time window for this insight: last_7_days, last_30_days, all_time';
COMMENT ON COLUMN pattern_insights.success_rate IS 'Percentage of spirals successfully interrupted (0-100)';
COMMENT ON COLUMN pattern_insights.trigger_counts IS 'Count of each trigger type in JSON format';
COMMENT ON COLUMN pattern_insights.technique_stats IS 'Effectiveness stats for each technique in JSON format';
COMMENT ON COLUMN pattern_insights.peak_spiral_hours IS 'Distribution of spirals by hour of day (0-23)';
COMMENT ON COLUMN pattern_insights.peak_spiral_days IS 'Distribution of spirals by day of week';
COMMENT ON COLUMN pattern_insights.shift_success_rate IS 'Success rate when using Shift necklace';

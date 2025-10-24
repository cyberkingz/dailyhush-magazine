-- Create F.I.R.E. Training Analytics Table
-- Tracks user engagement and progress metrics

CREATE TABLE IF NOT EXISTS public.fire_training_analytics (
    analytics_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES user_profiles(user_id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    event_properties JSONB DEFAULT '{}'::jsonb,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_analytics_user_id
ON public.fire_training_analytics(user_id);

CREATE INDEX IF NOT EXISTS idx_analytics_event_type
ON public.fire_training_analytics(event_type);

CREATE INDEX IF NOT EXISTS idx_analytics_timestamp
ON public.fire_training_analytics(timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_analytics_user_timestamp
ON public.fire_training_analytics(user_id, timestamp DESC);

-- Create index on event_properties for module filtering
CREATE INDEX IF NOT EXISTS idx_analytics_module
ON public.fire_training_analytics
USING GIN ((event_properties->'module'));

-- Enable Row Level Security
ALTER TABLE public.fire_training_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only read their own analytics
CREATE POLICY "Users can view their own analytics"
ON public.fire_training_analytics
FOR SELECT
USING (auth.uid() = user_id);

-- RLS Policy: Users can insert their own analytics
CREATE POLICY "Users can insert their own analytics"
ON public.fire_training_analytics
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users cannot update or delete analytics (immutable)
-- Analytics events should be append-only for data integrity

-- Add comment to table
COMMENT ON TABLE public.fire_training_analytics IS
'Tracks F.I.R.E. training module engagement and progress metrics for analytics and insights';

-- Add comments to columns
COMMENT ON COLUMN public.fire_training_analytics.analytics_id IS
'Unique identifier for the analytics event';

COMMENT ON COLUMN public.fire_training_analytics.user_id IS
'Reference to the user who triggered this event';

COMMENT ON COLUMN public.fire_training_analytics.event_type IS
'Type of analytics event (e.g., module_started, module_completed, screen_viewed)';

COMMENT ON COLUMN public.fire_training_analytics.event_properties IS
'JSON object containing event-specific data (module, screen, duration, etc.)';

COMMENT ON COLUMN public.fire_training_analytics.timestamp IS
'When the event occurred';

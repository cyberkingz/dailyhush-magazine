-- Migration: Quiz Analytics Tracking System
-- Description: Adds granular event tracking for quiz interactions, dropoff analysis, and session management
-- Created: 2025-10-07

-- ============================================================================
-- TABLE: quiz_sessions
-- Purpose: Track aggregate session-level data for each quiz attempt
-- ============================================================================
CREATE TABLE quiz_sessions (
  -- Primary identifier
  session_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Session lifecycle
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,

  -- Progress tracking
  last_question_index INTEGER DEFAULT 0,
  total_questions INTEGER NOT NULL,
  is_completed BOOLEAN DEFAULT false,
  completion_time_ms BIGINT,

  -- Link to submission (if quiz was completed)
  submission_id UUID REFERENCES quiz_submissions(id) ON DELETE SET NULL,

  -- Tracking context (aligned with quiz_submissions structure)
  source_page TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,

  -- Device & browser info
  device_type TEXT,
  browser TEXT,
  user_agent TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- TABLE: quiz_events
-- Purpose: Track every user interaction with granular event-level detail
-- ============================================================================
CREATE TABLE quiz_events (
  -- Primary identifier
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Session reference
  session_id UUID NOT NULL REFERENCES quiz_sessions(session_id) ON DELETE CASCADE,

  -- Event classification
  event_type TEXT NOT NULL CHECK (event_type IN (
    'page_view',
    'quiz_start',
    'question_view',
    'question_answer',
    'question_complete',
    'quiz_complete',
    'quiz_abandon'
  )),

  -- Question-specific data (nullable for non-question events)
  question_id TEXT,
  question_index INTEGER,
  time_spent_ms BIGINT,

  -- Flexible metadata for additional tracking
  metadata JSONB DEFAULT '{}'::jsonb,

  -- Tracking context (for events that may occur before session is fully created)
  source_page TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  device_type TEXT,
  browser TEXT,

  -- Timestamp
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- INDEXES: Optimize query performance for analytics
-- ============================================================================

-- quiz_sessions indexes
CREATE INDEX idx_quiz_sessions_created_at ON quiz_sessions(created_at DESC);
CREATE INDEX idx_quiz_sessions_completed_at ON quiz_sessions(completed_at DESC) WHERE completed_at IS NOT NULL;
CREATE INDEX idx_quiz_sessions_is_completed ON quiz_sessions(is_completed);
CREATE INDEX idx_quiz_sessions_submission_id ON quiz_sessions(submission_id) WHERE submission_id IS NOT NULL;
CREATE INDEX idx_quiz_sessions_source_tracking ON quiz_sessions(source_page, utm_source, utm_campaign);
CREATE INDEX idx_quiz_sessions_device_type ON quiz_sessions(device_type);

-- quiz_events indexes
CREATE INDEX idx_quiz_events_session_id ON quiz_events(session_id);
CREATE INDEX idx_quiz_events_event_type ON quiz_events(event_type);
CREATE INDEX idx_quiz_events_created_at ON quiz_events(created_at DESC);
CREATE INDEX idx_quiz_events_question_id ON quiz_events(question_id) WHERE question_id IS NOT NULL;
CREATE INDEX idx_quiz_events_question_index ON quiz_events(question_index) WHERE question_index IS NOT NULL;

-- Composite indexes for common query patterns
CREATE INDEX idx_quiz_events_type_created ON quiz_events(event_type, created_at DESC);
CREATE INDEX idx_quiz_events_question_analytics ON quiz_events(question_id, event_type, created_at)
  WHERE question_id IS NOT NULL;
CREATE INDEX idx_quiz_events_session_type ON quiz_events(session_id, event_type);

-- ============================================================================
-- TRIGGERS: Auto-update timestamps
-- ============================================================================

-- Update quiz_sessions.updated_at on modification
CREATE TRIGGER update_quiz_sessions_updated_at
  BEFORE UPDATE ON quiz_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on both tables
ALTER TABLE quiz_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_events ENABLE ROW LEVEL SECURITY;

-- quiz_sessions policies
-- Allow anonymous users to insert and update their own sessions
CREATE POLICY "Allow anonymous session creation" ON quiz_sessions
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anonymous session updates" ON quiz_sessions
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users (admins) to read all sessions
CREATE POLICY "Allow authenticated users to read sessions" ON quiz_sessions
  FOR SELECT
  TO authenticated
  USING (true);

-- quiz_events policies
-- Allow anonymous users to insert events
CREATE POLICY "Allow anonymous event creation" ON quiz_events
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow authenticated users (admins) to read all events
CREATE POLICY "Allow authenticated users to read events" ON quiz_events
  FOR SELECT
  TO authenticated
  USING (true);

-- ============================================================================
-- GRANTS: Ensure proper permissions
-- ============================================================================

-- Grant permissions to anon role (for quiz participants)
GRANT INSERT, UPDATE ON quiz_sessions TO anon;
GRANT INSERT ON quiz_events TO anon;

-- Grant permissions to authenticated role (for admin dashboard)
GRANT SELECT ON quiz_sessions TO authenticated;
GRANT SELECT ON quiz_events TO authenticated;

-- ============================================================================
-- ANALYTICS VIEWS: Pre-computed analytics for dashboard
-- ============================================================================

-- View: Quiz Funnel Analytics
-- Shows conversion at each stage of the quiz
CREATE VIEW quiz_funnel_analytics AS
WITH funnel_data AS (
  SELECT
    DATE_TRUNC('day', e.created_at) as date,
    e.event_type,
    COUNT(DISTINCT e.session_id) as unique_sessions,
    COUNT(*) as total_events
  FROM quiz_events e
  WHERE e.event_type IN ('page_view', 'quiz_start', 'quiz_complete')
  GROUP BY DATE_TRUNC('day', e.created_at), e.event_type
)
SELECT
  date,
  MAX(CASE WHEN event_type = 'page_view' THEN unique_sessions ELSE 0 END) as page_views,
  MAX(CASE WHEN event_type = 'quiz_start' THEN unique_sessions ELSE 0 END) as quiz_starts,
  MAX(CASE WHEN event_type = 'quiz_complete' THEN unique_sessions ELSE 0 END) as quiz_completions,
  ROUND(
    MAX(CASE WHEN event_type = 'quiz_start' THEN unique_sessions ELSE 0 END)::numeric /
    NULLIF(MAX(CASE WHEN event_type = 'page_view' THEN unique_sessions ELSE 0 END), 0) * 100,
    2
  ) as start_rate_percent,
  ROUND(
    MAX(CASE WHEN event_type = 'quiz_complete' THEN unique_sessions ELSE 0 END)::numeric /
    NULLIF(MAX(CASE WHEN event_type = 'quiz_start' THEN unique_sessions ELSE 0 END), 0) * 100,
    2
  ) as completion_rate_percent
FROM funnel_data
GROUP BY date
ORDER BY date DESC;

-- View: Question-Level Analytics
-- Shows engagement and completion for each question
CREATE VIEW quiz_question_performance AS
SELECT
  e.question_id,
  e.question_index,
  COUNT(DISTINCT CASE WHEN e.event_type = 'question_view' THEN e.session_id END) as views,
  COUNT(DISTINCT CASE WHEN e.event_type = 'question_answer' THEN e.session_id END) as answers,
  COUNT(DISTINCT CASE WHEN e.event_type = 'question_complete' THEN e.session_id END) as completions,
  ROUND(
    COUNT(DISTINCT CASE WHEN e.event_type = 'question_answer' THEN e.session_id END)::numeric /
    NULLIF(COUNT(DISTINCT CASE WHEN e.event_type = 'question_view' THEN e.session_id END), 0) * 100,
    2
  ) as answer_rate_percent,
  ROUND(AVG(e.time_spent_ms) / 1000.0, 2) as avg_time_seconds,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY e.time_spent_ms) / 1000.0 as median_time_seconds
FROM quiz_events e
WHERE e.question_id IS NOT NULL
GROUP BY e.question_id, e.question_index
ORDER BY e.question_index;

-- View: Session Summary Statistics
-- Aggregate metrics for quiz sessions
CREATE VIEW quiz_session_stats AS
SELECT
  DATE_TRUNC('day', created_at) as date,
  COUNT(*) as total_sessions,
  COUNT(*) FILTER (WHERE is_completed = true) as completed_sessions,
  COUNT(*) FILTER (WHERE is_completed = false) as abandoned_sessions,
  ROUND(
    COUNT(*) FILTER (WHERE is_completed = true)::numeric /
    NULLIF(COUNT(*), 0) * 100,
    2
  ) as completion_rate_percent,
  ROUND(AVG(completion_time_ms) FILTER (WHERE is_completed = true) / 1000.0, 2) as avg_completion_time_seconds,
  ROUND(AVG(last_question_index + 1)::numeric / NULLIF(AVG(total_questions), 0) * 100, 2) as avg_progress_percent
FROM quiz_sessions
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY date DESC;

-- View: Dropoff Analysis
-- Identify where users abandon the quiz
CREATE VIEW quiz_dropoff_analysis AS
WITH last_questions AS (
  SELECT
    s.session_id,
    s.last_question_index,
    s.total_questions,
    s.is_completed,
    MAX(e.question_index) as last_viewed_question
  FROM quiz_sessions s
  LEFT JOIN quiz_events e ON s.session_id = e.session_id
    AND e.event_type = 'question_view'
  WHERE s.is_completed = false
  GROUP BY s.session_id, s.last_question_index, s.total_questions, s.is_completed
)
SELECT
  COALESCE(last_viewed_question, 0) as question_index,
  COUNT(*) as dropoff_count,
  ROUND(
    COUNT(*)::numeric /
    SUM(COUNT(*)) OVER () * 100,
    2
  ) as dropoff_percentage
FROM last_questions
GROUP BY COALESCE(last_viewed_question, 0)
ORDER BY question_index;

-- View: Traffic Source Performance
-- Compare quiz performance by traffic source
CREATE VIEW quiz_source_performance AS
SELECT
  s.utm_source,
  s.utm_medium,
  s.utm_campaign,
  s.source_page,
  COUNT(*) as total_sessions,
  COUNT(*) FILTER (WHERE s.is_completed = true) as completed_sessions,
  ROUND(
    COUNT(*) FILTER (WHERE s.is_completed = true)::numeric /
    NULLIF(COUNT(*), 0) * 100,
    2
  ) as completion_rate_percent,
  ROUND(AVG(s.completion_time_ms) FILTER (WHERE s.is_completed = true) / 1000.0, 2) as avg_completion_time_seconds
FROM quiz_sessions s
GROUP BY s.utm_source, s.utm_medium, s.utm_campaign, s.source_page
ORDER BY total_sessions DESC;

-- View: Device & Browser Analytics
-- Performance metrics by device type and browser
CREATE VIEW quiz_device_analytics AS
SELECT
  s.device_type,
  s.browser,
  COUNT(*) as total_sessions,
  COUNT(*) FILTER (WHERE s.is_completed = true) as completed_sessions,
  ROUND(
    COUNT(*) FILTER (WHERE s.is_completed = true)::numeric /
    NULLIF(COUNT(*), 0) * 100,
    2
  ) as completion_rate_percent,
  ROUND(AVG(s.completion_time_ms) FILTER (WHERE s.is_completed = true) / 1000.0, 2) as avg_completion_time_seconds
FROM quiz_sessions s
GROUP BY s.device_type, s.browser
ORDER BY total_sessions DESC;

-- ============================================================================
-- FUNCTIONS: Helper functions for analytics
-- ============================================================================

-- Function: Get session completion funnel for a date range
CREATE OR REPLACE FUNCTION get_quiz_funnel(
  start_date TIMESTAMPTZ DEFAULT now() - INTERVAL '30 days',
  end_date TIMESTAMPTZ DEFAULT now()
)
RETURNS TABLE (
  stage TEXT,
  count BIGINT,
  percentage NUMERIC
) AS $$
WITH funnel AS (
  SELECT
    'Page Views' as stage,
    COUNT(DISTINCT session_id) as count,
    1 as sort_order
  FROM quiz_events
  WHERE event_type = 'page_view'
    AND created_at BETWEEN start_date AND end_date

  UNION ALL

  SELECT
    'Quiz Starts' as stage,
    COUNT(DISTINCT session_id) as count,
    2 as sort_order
  FROM quiz_events
  WHERE event_type = 'quiz_start'
    AND created_at BETWEEN start_date AND end_date

  UNION ALL

  SELECT
    'Quiz Completions' as stage,
    COUNT(DISTINCT session_id) as count,
    3 as sort_order
  FROM quiz_events
  WHERE event_type = 'quiz_complete'
    AND created_at BETWEEN start_date AND end_date
),
total_views AS (
  SELECT count as total FROM funnel WHERE stage = 'Page Views'
)
SELECT
  f.stage,
  f.count,
  ROUND(f.count::numeric / NULLIF(tv.total, 0) * 100, 2) as percentage
FROM funnel f
CROSS JOIN total_views tv
ORDER BY f.sort_order;
$$ LANGUAGE SQL STABLE;

-- Function: Get question-level dropoff rates
CREATE OR REPLACE FUNCTION get_question_dropoff_rates()
RETURNS TABLE (
  question_index INTEGER,
  question_id TEXT,
  views BIGINT,
  answers BIGINT,
  completions BIGINT,
  dropoff_count BIGINT,
  dropoff_rate NUMERIC
) AS $$
SELECT
  e.question_index,
  e.question_id,
  COUNT(DISTINCT CASE WHEN e.event_type = 'question_view' THEN e.session_id END) as views,
  COUNT(DISTINCT CASE WHEN e.event_type = 'question_answer' THEN e.session_id END) as answers,
  COUNT(DISTINCT CASE WHEN e.event_type = 'question_complete' THEN e.session_id END) as completions,
  COUNT(DISTINCT CASE WHEN e.event_type = 'question_view' THEN e.session_id END) -
    COUNT(DISTINCT CASE WHEN e.event_type = 'question_complete' THEN e.session_id END) as dropoff_count,
  ROUND(
    (COUNT(DISTINCT CASE WHEN e.event_type = 'question_view' THEN e.session_id END) -
     COUNT(DISTINCT CASE WHEN e.event_type = 'question_complete' THEN e.session_id END))::numeric /
    NULLIF(COUNT(DISTINCT CASE WHEN e.event_type = 'question_view' THEN e.session_id END), 0) * 100,
    2
  ) as dropoff_rate
FROM quiz_events e
WHERE e.question_id IS NOT NULL
GROUP BY e.question_index, e.question_id
ORDER BY e.question_index;
$$ LANGUAGE SQL STABLE;

-- ============================================================================
-- COMMENTS: Add table and column documentation
-- ============================================================================

COMMENT ON TABLE quiz_sessions IS 'Tracks aggregate session-level data for each quiz attempt';
COMMENT ON TABLE quiz_events IS 'Tracks granular event-level interactions within quiz sessions';

COMMENT ON COLUMN quiz_sessions.session_id IS 'Unique identifier for the quiz attempt session';
COMMENT ON COLUMN quiz_sessions.completion_time_ms IS 'Total time from start to completion in milliseconds';
COMMENT ON COLUMN quiz_sessions.submission_id IS 'Links to quiz_submissions table if quiz was completed';

COMMENT ON COLUMN quiz_events.event_type IS 'Type of event: page_view, quiz_start, question_view, question_answer, question_complete, quiz_complete, quiz_abandon';
COMMENT ON COLUMN quiz_events.time_spent_ms IS 'Time spent on this event (particularly useful for questions) in milliseconds';
COMMENT ON COLUMN quiz_events.metadata IS 'Flexible JSONB field for additional event-specific data';

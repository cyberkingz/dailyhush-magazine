-- Add missing tracking columns to quiz_sessions table
-- These columns are used by the service code but were missing from the original schema

ALTER TABLE quiz_sessions
ADD COLUMN IF NOT EXISTS source_url TEXT,
ADD COLUMN IF NOT EXISTS referrer_url TEXT;

-- Add index for source_url since it's commonly used in queries
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_source_url ON quiz_sessions(source_url);

-- Update the existing composite index to include referrer tracking
DROP INDEX IF EXISTS idx_quiz_sessions_source_tracking;
CREATE INDEX idx_quiz_sessions_source_tracking ON quiz_sessions(source_page, source_url, utm_source, utm_campaign);

-- Grant necessary permissions (these are already in place but ensuring consistency)
GRANT UPDATE ON quiz_sessions TO anon;

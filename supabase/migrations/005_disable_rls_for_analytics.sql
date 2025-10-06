-- Disable RLS for quiz analytics tables
-- These tables need to be publicly writable for anonymous quiz participants
-- Security is maintained through application logic and data isolation

-- Disable RLS on quiz_sessions
ALTER TABLE quiz_sessions DISABLE ROW LEVEL SECURITY;

-- Disable RLS on quiz_events
ALTER TABLE quiz_events DISABLE ROW LEVEL SECURITY;

-- Drop existing RLS policies (they're no longer needed)
DROP POLICY IF EXISTS "Allow anonymous session creation" ON quiz_sessions;
DROP POLICY IF EXISTS "Allow anonymous session updates" ON quiz_sessions;
DROP POLICY IF EXISTS "Allow authenticated users to read sessions" ON quiz_sessions;
DROP POLICY IF EXISTS "Allow anonymous event creation" ON quiz_events;
DROP POLICY IF EXISTS "Allow authenticated users to read events" ON quiz_events;

-- Ensure grants are in place for both roles
GRANT INSERT, UPDATE, SELECT ON quiz_sessions TO anon;
GRANT INSERT, SELECT ON quiz_events TO anon;
GRANT ALL ON quiz_sessions TO authenticated;
GRANT ALL ON quiz_events TO authenticated;

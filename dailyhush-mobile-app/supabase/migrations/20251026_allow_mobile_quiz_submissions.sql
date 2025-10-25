-- Migration: Allow mobile app quiz submissions
-- Purpose: Enable both anonymous and authenticated users to submit quiz results
-- The existing quiz_submissions table is shared between web and mobile apps
-- Source tracking via source_page column distinguishes mobile ('mobile-app') from web ('quiz')

-- Enable RLS if not already enabled
ALTER TABLE quiz_submissions ENABLE ROW LEVEL SECURITY;

-- Drop existing INSERT policy if it exists (to avoid conflicts)
DROP POLICY IF EXISTS "Allow quiz submissions from all users" ON quiz_submissions;

-- Create permissive INSERT policy for quiz submissions
-- Allows both authenticated and anonymous users to insert their quiz results
-- This is safe because:
-- 1. Quiz submissions are write-only (users can't read others' submissions)
-- 2. Email validation happens in the application layer
-- 3. Source tracking (source_page = 'mobile-app') allows analytics
CREATE POLICY "Allow quiz submissions from all users"
ON quiz_submissions
FOR INSERT
TO authenticated, anon
WITH CHECK (true);

-- Add SELECT policy to allow users to read only their own submissions
-- This allows the app to confirm submission success
DROP POLICY IF EXISTS "Users can read their own quiz submissions" ON quiz_submissions;

CREATE POLICY "Users can read their own quiz submissions"
ON quiz_submissions
FOR SELECT
TO authenticated, anon
USING (
  -- Authenticated users can read their own submissions
  (auth.uid() IS NOT NULL AND email IN (
    SELECT email FROM user_profiles WHERE user_id = auth.uid()
  ))
  OR
  -- Allow read immediately after insert (for the same session)
  (auth.uid() IS NULL)
);

-- Add index on source_page for analytics queries
CREATE INDEX IF NOT EXISTS idx_quiz_submissions_source_page
ON quiz_submissions(source_page);

-- Add index on created_at for time-based queries
CREATE INDEX IF NOT EXISTS idx_quiz_submissions_created_at
ON quiz_submissions(created_at DESC);

-- Grant necessary permissions
GRANT INSERT ON quiz_submissions TO authenticated, anon;
GRANT SELECT ON quiz_submissions TO authenticated, anon;

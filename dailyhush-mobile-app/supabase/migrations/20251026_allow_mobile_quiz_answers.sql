-- Migration: Allow mobile app quiz answer submissions
-- Purpose: Enable both anonymous and authenticated users to submit individual quiz answers
-- The existing quiz_answers table is shared between web and mobile apps
-- Links to quiz_submissions via submission_id foreign key

-- Enable RLS if not already enabled
ALTER TABLE quiz_answers ENABLE ROW LEVEL SECURITY;

-- Drop existing INSERT policy if it exists (to avoid conflicts)
DROP POLICY IF EXISTS "Allow quiz answers from all users" ON quiz_answers;

-- Create permissive INSERT policy for quiz answers
-- Allows both authenticated and anonymous users to insert quiz answer details
-- This is safe because:
-- 1. Answers are linked to submissions via foreign key
-- 2. Used for analytics and pattern detection
-- 3. No sensitive data in individual answers
CREATE POLICY "Allow quiz answers from all users"
ON quiz_answers
FOR INSERT
TO authenticated, anon
WITH CHECK (true);

-- Add SELECT policy to allow users to read their own quiz answers
DROP POLICY IF EXISTS "Users can read their own quiz answers" ON quiz_answers;

CREATE POLICY "Users can read their own quiz answers"
ON quiz_answers
FOR SELECT
TO authenticated, anon
USING (
  -- Users can read answers linked to their submissions
  submission_id IN (
    SELECT id FROM quiz_submissions
    WHERE (
      -- Authenticated users: match by email
      (auth.uid() IS NOT NULL AND email IN (
        SELECT email FROM user_profiles WHERE user_id = auth.uid()
      ))
      OR
      -- Anonymous users: allow read (for immediate feedback)
      (auth.uid() IS NULL)
    )
  )
);

-- Add index on submission_id for fast lookups
CREATE INDEX IF NOT EXISTS idx_quiz_answers_submission_id
ON quiz_answers(submission_id);

-- Grant necessary permissions
GRANT INSERT ON quiz_answers TO authenticated, anon;
GRANT SELECT ON quiz_answers TO authenticated, anon;

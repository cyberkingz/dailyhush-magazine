-- Fix RLS policies for quiz submissions
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow anonymous quiz submission creation" ON quiz_submissions;
DROP POLICY IF EXISTS "Allow authenticated users to read quiz submissions" ON quiz_submissions;
DROP POLICY IF EXISTS "Allow authenticated users to update quiz submissions" ON quiz_submissions;
DROP POLICY IF EXISTS "Allow anonymous quiz answer creation" ON quiz_answers;
DROP POLICY IF EXISTS "Allow authenticated users to read quiz answers" ON quiz_answers;

-- Re-create RLS policies for quiz_submissions with correct permissions
-- CRITICAL: Allow anonymous (anon role) to insert quiz submissions
CREATE POLICY "Allow anonymous quiz submission creation" ON quiz_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow authenticated users to read all submissions (for admin dashboard)
CREATE POLICY "Allow authenticated users to read quiz submissions" ON quiz_submissions
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to update submissions (for admin management)
CREATE POLICY "Allow authenticated users to update quiz submissions" ON quiz_submissions
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Re-create RLS policies for quiz_answers with correct permissions
-- CRITICAL: Allow anonymous (anon role) to insert answers
CREATE POLICY "Allow anonymous quiz answer creation" ON quiz_answers
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow authenticated users to read all answers (for admin dashboard)
CREATE POLICY "Allow authenticated users to read quiz answers" ON quiz_answers
  FOR SELECT
  TO authenticated
  USING (true);

-- Grant necessary permissions to anon role
GRANT INSERT ON quiz_submissions TO anon;
GRANT INSERT ON quiz_answers TO anon;

-- Grant necessary permissions to authenticated role
GRANT SELECT, UPDATE ON quiz_submissions TO authenticated;
GRANT SELECT ON quiz_answers TO authenticated;

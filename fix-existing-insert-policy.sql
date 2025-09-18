-- Drop both existing INSERT policies
DROP POLICY IF EXISTS "Allow anonymous contact submission creation" ON contact_submissions;
DROP POLICY IF EXISTS "anonymous_contact_insert" ON contact_submissions;

-- Create new INSERT policy with explicit role targeting
CREATE POLICY "contact_insert_policy" ON contact_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
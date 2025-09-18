-- Check what INSERT policies currently exist
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'contact_submissions' AND cmd = 'INSERT';

-- Drop any existing INSERT policies
DROP POLICY IF EXISTS "contact_insert_policy" ON contact_submissions;
DROP POLICY IF EXISTS "allow_all_contact_inserts" ON contact_submissions;
DROP POLICY IF EXISTS "Allow anonymous contact submission creation" ON contact_submissions;
DROP POLICY IF EXISTS "anonymous_contact_insert" ON contact_submissions;

-- Create a fresh INSERT policy for anonymous users
CREATE POLICY "anonymous_users_can_contact" ON contact_submissions
  FOR INSERT
  WITH CHECK (true);

-- Grant explicit permissions
GRANT INSERT ON contact_submissions TO anon;
GRANT INSERT ON contact_submissions TO authenticated;
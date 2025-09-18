-- Check existing policies for contact_submissions table
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'contact_submissions';

-- Re-enable RLS (in case it's not already enabled)
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create INSERT policy for anonymous users
CREATE POLICY "anonymous_contact_insert" ON contact_submissions
  FOR INSERT
  WITH CHECK (true);
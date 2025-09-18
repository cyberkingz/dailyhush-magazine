-- First, let's check the table owner and current RLS status
SELECT 
  schemaname, 
  tablename, 
  tableowner, 
  rowsecurity 
FROM pg_tables 
WHERE tablename = 'contact_submissions';

-- Check all policies
SELECT * FROM pg_policies WHERE tablename = 'contact_submissions';

-- Temporarily disable RLS completely to test
ALTER TABLE contact_submissions DISABLE ROW LEVEL SECURITY;

-- Alternative: If you want to keep RLS enabled, try this instead:
-- DROP ALL policies and create a single permissive one
-- DROP POLICY IF EXISTS "anonymous_users_can_contact" ON contact_submissions;
-- DROP POLICY IF EXISTS "authenticated_read_contact_submissions" ON contact_submissions;
-- DROP POLICY IF EXISTS "authenticated_update_contact_submissions" ON contact_submissions;

-- CREATE POLICY "allow_all_operations" ON contact_submissions
--   FOR ALL
--   USING (true)
--   WITH CHECK (true);
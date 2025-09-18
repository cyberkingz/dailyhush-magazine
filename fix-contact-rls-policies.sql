-- Complete fix for contact_submissions RLS policies
-- This addresses both table-level permissions AND row-level policies

-- Step 1: Clean up existing policies
DROP POLICY IF EXISTS "public_can_submit_contact" ON contact_submissions;
DROP POLICY IF EXISTS "authenticated_can_read_contact" ON contact_submissions;
DROP POLICY IF EXISTS "authenticated_can_update_contact" ON contact_submissions;
DROP POLICY IF EXISTS "allow_all_contact_inserts" ON contact_submissions;
DROP POLICY IF EXISTS "anonymous_users_can_contact" ON contact_submissions;

-- Step 2: Grant table-level permissions (THIS WAS THE MISSING PIECE!)
GRANT INSERT ON contact_submissions TO anon;
GRANT SELECT, UPDATE ON contact_submissions TO authenticated;
GRANT ALL ON contact_submissions TO service_role;

-- Step 3: Ensure RLS is enabled
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Step 4: Create clean RLS policies
-- Allow anonymous users to insert contact submissions
CREATE POLICY "anon_can_insert_contact" ON contact_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow authenticated users to read contact submissions
CREATE POLICY "auth_can_read_contact" ON contact_submissions
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to update contact submissions
CREATE POLICY "auth_can_update_contact" ON contact_submissions
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Step 5: Verification queries
SELECT 'Checking policies:' as status;
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'contact_submissions';

SELECT 'Checking permissions:' as status;
SELECT grantee, privilege_type FROM information_schema.table_privileges 
WHERE table_name = 'contact_submissions';
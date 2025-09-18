-- Drop the current INSERT policy
DROP POLICY IF EXISTS "contact_insert_policy" ON contact_submissions;

-- Create a more permissive INSERT policy without role restrictions
CREATE POLICY "allow_all_contact_inserts" ON contact_submissions
  FOR INSERT
  WITH CHECK (true);

-- Also check if we need to grant permissions to public schema
GRANT INSERT ON contact_submissions TO anon;
GRANT INSERT ON contact_submissions TO authenticated;
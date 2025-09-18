-- Drop and recreate the INSERT policy with explicit settings
DROP POLICY "Allow anonymous contact submission creation" ON contact_submissions;

-- Create new INSERT policy that explicitly allows anonymous users
CREATE POLICY "anonymous_contact_insert" ON contact_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Alternative: If the above doesn't work, try this simpler version
-- DROP POLICY IF EXISTS "anonymous_contact_insert" ON contact_submissions;
-- CREATE POLICY "anonymous_contact_insert_simple" ON contact_submissions
--   FOR INSERT  
--   WITH CHECK (
--     name IS NOT NULL AND 
--     email IS NOT NULL AND 
--     subject IS NOT NULL AND 
--     message IS NOT NULL
--   );
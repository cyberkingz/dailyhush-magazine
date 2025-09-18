-- Enable RLS to control permissions properly
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "allow_all_contact_inserts" ON contact_submissions;
DROP POLICY IF EXISTS "authenticated_read_contact_submissions" ON contact_submissions;
DROP POLICY IF EXISTS "authenticated_update_contact_submissions" ON contact_submissions;

-- Allow ANYONE to INSERT (submit contact forms)
CREATE POLICY "public_can_submit_contact" ON contact_submissions
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Only authenticated users can READ submissions (for admin dashboard)
CREATE POLICY "authenticated_can_read_contact" ON contact_submissions
  FOR SELECT
  TO authenticated
  USING (true);

-- Only authenticated users can update submissions (for admin management)
CREATE POLICY "authenticated_can_update_contact" ON contact_submissions
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Grant explicit permissions
GRANT INSERT ON contact_submissions TO anon;
GRANT SELECT, UPDATE ON contact_submissions TO authenticated;
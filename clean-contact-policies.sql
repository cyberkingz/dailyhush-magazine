-- Clean up duplicate RLS policies for contact_submissions table
-- Run this in Supabase SQL Editor

-- Drop all duplicate SELECT and UPDATE policies
DROP POLICY IF EXISTS "Allow authenticated users to read contact submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Allow authenticated users to update contact submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Allow authenticated users to
  read contact submissions" ON contact_submissions;
DROP POLICY IF EXISTS "authenticated_read_contact_submissions" ON contact_submissions;
DROP POLICY IF EXISTS "authenticated_update_contact_submissions" ON contact_submissions;

-- Create clean policies
CREATE POLICY "authenticated_read_contact_submissions" ON contact_submissions
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "authenticated_update_contact_submissions" ON contact_submissions
  FOR UPDATE
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);
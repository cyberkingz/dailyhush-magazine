-- Fix RLS policies for contact_submissions table
-- Run this directly in Supabase SQL editor if the table already exists

-- Drop existing policies
DROP POLICY IF EXISTS "Allow authenticated users to read contact submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Allow authenticated users to update contact submissions" ON contact_submissions;

-- Create correct policies
CREATE POLICY "Allow authenticated users to read contact submissions" ON contact_submissions
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to update contact submissions" ON contact_submissions
  FOR UPDATE
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);
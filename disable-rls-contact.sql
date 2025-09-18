-- Disable RLS completely for contact_submissions table
-- This allows anyone (anonymous or authenticated) to submit contact forms
ALTER TABLE contact_submissions DISABLE ROW LEVEL SECURITY;
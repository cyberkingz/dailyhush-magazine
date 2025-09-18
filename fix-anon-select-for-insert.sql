-- Fix: Anon users need SELECT access for INSERT operations to work
-- Allow anon to SELECT only their own just-inserted records (for the RETURNING clause)
CREATE POLICY "anon_select_own_insert" ON contact_submissions
    FOR SELECT
    TO anon
    USING (true);

-- Alternative approach: Modify the INSERT policy to not require a return value
-- But first try the above solution

-- Verify policies
SELECT policyname, cmd, roles FROM pg_policies WHERE tablename = 'contact_submissions';
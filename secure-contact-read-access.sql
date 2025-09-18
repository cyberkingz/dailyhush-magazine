-- Secure contact submissions: Allow anyone to submit, only admins to read
-- Remove anon read access
DROP POLICY IF EXISTS "simple_select" ON contact_submissions;

-- Only allow authenticated users (admins) to read contact submissions
CREATE POLICY "admin_read_only" ON contact_submissions
    FOR SELECT
    TO authenticated
    USING (true);

-- Only allow authenticated users (admins) to update contact submissions
CREATE POLICY "admin_update_only" ON contact_submissions
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Verify the final policy setup
SELECT 'Final policies:' as status;
SELECT policyname, cmd, roles FROM pg_policies WHERE tablename = 'contact_submissions';
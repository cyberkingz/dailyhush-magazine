-- Check current policies on contact_submissions
SELECT 
    policyname,
    cmd,
    roles,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'contact_submissions';

-- Check if RLS is enabled
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'contact_submissions';

-- Test with a simple policy - drop all and create one permissive INSERT policy
DROP POLICY IF EXISTS "anon_can_insert_contact" ON contact_submissions;
DROP POLICY IF EXISTS "auth_can_read_contact" ON contact_submissions;
DROP POLICY IF EXISTS "auth_can_update_contact" ON contact_submissions;

-- Create a very permissive INSERT policy that should definitely work
CREATE POLICY "simple_insert" ON contact_submissions
    FOR INSERT
    WITH CHECK (true);

-- Also try temporarily allowing anon to read (for testing)
CREATE POLICY "simple_select" ON contact_submissions
    FOR SELECT
    TO anon
    USING (true);
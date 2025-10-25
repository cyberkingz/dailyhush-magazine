-- Enable Row Level Security for spiral_logs table
ALTER TABLE spiral_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any (for re-running migration)
DROP POLICY IF EXISTS "Users can insert their own spiral logs" ON spiral_logs;
DROP POLICY IF EXISTS "Users can view their own spiral logs" ON spiral_logs;
DROP POLICY IF EXISTS "Users can update their own spiral logs" ON spiral_logs;
DROP POLICY IF EXISTS "Users can delete their own spiral logs" ON spiral_logs;

-- Policy: Users can insert their own spiral logs
-- This allows users to log new rumination spirals
CREATE POLICY "Users can insert their own spiral logs"
  ON spiral_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can view their own spiral logs
-- This allows users to see their spiral history and pattern insights
CREATE POLICY "Users can view their own spiral logs"
  ON spiral_logs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Users can update their own spiral logs
-- This allows users to add notes or corrections after logging
CREATE POLICY "Users can update their own spiral logs"
  ON spiral_logs
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own spiral logs
-- This gives users control to remove entries if needed
CREATE POLICY "Users can delete their own spiral logs"
  ON spiral_logs
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Add comment for documentation
COMMENT ON POLICY "Users can insert their own spiral logs" ON spiral_logs IS
  'Allows authenticated users to log their own rumination spirals';
COMMENT ON POLICY "Users can view their own spiral logs" ON spiral_logs IS
  'Allows users to view their spiral history for pattern insights';
COMMENT ON POLICY "Users can update their own spiral logs" ON spiral_logs IS
  'Allows users to update their own spiral entries (e.g., add notes)';
COMMENT ON POLICY "Users can delete their own spiral logs" ON spiral_logs IS
  'Allows users to delete their own spiral entries for privacy control';

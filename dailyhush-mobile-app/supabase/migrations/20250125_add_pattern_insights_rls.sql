-- Enable Row Level Security for pattern_insights table
ALTER TABLE pattern_insights ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any (for re-running migration)
DROP POLICY IF EXISTS "Users can insert their own pattern insights" ON pattern_insights;
DROP POLICY IF EXISTS "Users can view their own pattern insights" ON pattern_insights;
DROP POLICY IF EXISTS "Users can update their own pattern insights" ON pattern_insights;
DROP POLICY IF EXISTS "Users can delete their own pattern insights" ON pattern_insights;

-- Policy: Users can insert their own pattern insights
-- This allows the system to create new insight records for users
CREATE POLICY "Users can insert their own pattern insights"
  ON pattern_insights
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can view their own pattern insights
-- This allows users to see their analytics and trends
CREATE POLICY "Users can view their own pattern insights"
  ON pattern_insights
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Users can update their own pattern insights
-- This allows the system to recalculate and update insights
CREATE POLICY "Users can update their own pattern insights"
  ON pattern_insights
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own pattern insights
-- This allows users to clear their analytics if needed
CREATE POLICY "Users can delete their own pattern insights"
  ON pattern_insights
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Add comment for documentation
COMMENT ON POLICY "Users can insert their own pattern insights" ON pattern_insights IS
  'Allows system to create insight records for authenticated users';
COMMENT ON POLICY "Users can view their own pattern insights" ON pattern_insights IS
  'Allows users to view their pattern analytics and trends';
COMMENT ON POLICY "Users can update their own pattern insights" ON pattern_insights IS
  'Allows system to recalculate and update user insights';
COMMENT ON POLICY "Users can delete their own pattern insights" ON pattern_insights IS
  'Allows users to clear their analytics for privacy control';

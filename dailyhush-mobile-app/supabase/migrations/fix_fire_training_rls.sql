-- Fix RLS Policy for fire_training_progress table
-- Issue: INSERT operations were blocked because policy only had USING clause
-- Solution: Drop and recreate policy with both USING and WITH CHECK

-- Drop the existing problematic policy
DROP POLICY IF EXISTS "Users can update own progress" ON public.fire_training_progress;

-- Create separate policies for better clarity
CREATE POLICY "Users can insert own progress"
    ON public.fire_training_progress FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
    ON public.fire_training_progress FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own progress"
    ON public.fire_training_progress FOR DELETE
    USING (auth.uid() = user_id);

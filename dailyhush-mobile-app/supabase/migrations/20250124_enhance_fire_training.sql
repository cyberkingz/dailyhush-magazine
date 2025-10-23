-- DailyHush - Enhance F.I.R.E. Training Progress Table
-- Migration: Add fields for save/resume functionality and user selections
-- Created: 2025-01-24

-- Add new columns to fire_training_progress table
ALTER TABLE public.fire_training_progress
ADD COLUMN IF NOT EXISTS current_screen TEXT,
ADD COLUMN IF NOT EXISTS selected_triggers TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN IF NOT EXISTS selected_physical_signs TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN IF NOT EXISTS selected_mental_cues TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN IF NOT EXISTS reframe_text TEXT,
ADD COLUMN IF NOT EXISTS selected_routines TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN IF NOT EXISTS selected_environment TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN IF NOT EXISTS last_accessed_at TIMESTAMP WITH TIME ZONE;

-- Create index for last_accessed_at for quick lookups
CREATE INDEX IF NOT EXISTS idx_fire_training_last_accessed
ON public.fire_training_progress(user_id, last_accessed_at DESC);

-- Comment the new columns for documentation
COMMENT ON COLUMN public.fire_training_progress.current_screen IS 'Current screen user is on (for resume functionality)';
COMMENT ON COLUMN public.fire_training_progress.selected_triggers IS 'User-selected triggers from Module 1: FOCUS';
COMMENT ON COLUMN public.fire_training_progress.selected_physical_signs IS 'User-selected physical warning signs from Module 2: INTERRUPT';
COMMENT ON COLUMN public.fire_training_progress.selected_mental_cues IS 'User-selected mental cues from Module 2: INTERRUPT';
COMMENT ON COLUMN public.fire_training_progress.reframe_text IS 'User-written reframe exercise from Module 3: REFRAME';
COMMENT ON COLUMN public.fire_training_progress.selected_routines IS 'User-selected daily routines from Module 4: EXECUTE';
COMMENT ON COLUMN public.fire_training_progress.selected_environment IS 'User-selected environment changes from Module 4: EXECUTE';
COMMENT ON COLUMN public.fire_training_progress.last_accessed_at IS 'Last time user accessed this module';

-- Add in_progress status to completion_status enum
-- This is needed for exercises that are started but not yet completed

ALTER TYPE completion_status ADD VALUE IF NOT EXISTS 'in_progress';

-- Fix constraints to allow in_progress status
-- Drop the old constraints
ALTER TABLE exercise_logs DROP CONSTRAINT IF EXISTS valid_completion_time;
ALTER TABLE exercise_logs DROP CONSTRAINT IF EXISTS valid_post_rating;

-- Re-add with correct logic that allows in_progress
ALTER TABLE exercise_logs ADD CONSTRAINT valid_completion_time CHECK (
    (completion_status = 'completed' AND completed_at IS NOT NULL) OR
    (completion_status IN ('in_progress', 'abandoned', 'skipped'))
);

ALTER TABLE exercise_logs ADD CONSTRAINT valid_post_rating CHECK (
    (completion_status = 'completed' AND post_anxiety_rating IS NOT NULL) OR
    (completion_status IN ('in_progress', 'abandoned', 'skipped'))
);

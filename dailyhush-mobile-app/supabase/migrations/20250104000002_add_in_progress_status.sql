-- Add in_progress status to completion_status enum
-- This is needed for exercises that are started but not yet completed

ALTER TYPE completion_status ADD VALUE IF NOT EXISTS 'in_progress';

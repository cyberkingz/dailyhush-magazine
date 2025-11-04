-- Add missing module IDs to fire_module enum
-- These are the actual module IDs used in the app

ALTER TYPE fire_module ADD VALUE IF NOT EXISTS 'stop-spiraling';
ALTER TYPE fire_module ADD VALUE IF NOT EXISTS 'calm-anxiety';
ALTER TYPE fire_module ADD VALUE IF NOT EXISTS 'gain-focus';
ALTER TYPE fire_module ADD VALUE IF NOT EXISTS 'process-emotions';
ALTER TYPE fire_module ADD VALUE IF NOT EXISTS 'better-sleep';

-- Performance optimization indexes for contact submissions admin interface
-- Run this in your Supabase SQL Editor

-- Composite index for status + created_at (most common admin filter combination)
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status_created_at 
ON contact_submissions (status, created_at DESC);

-- Composite index for date range queries with status filtering
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at_status
ON contact_submissions (created_at DESC, status);

-- Index for UTM source filtering (commonly used in analytics)
CREATE INDEX IF NOT EXISTS idx_contact_submissions_utm_source
ON contact_submissions (utm_source) WHERE utm_source IS NOT NULL;

-- Index for device type analytics
CREATE INDEX IF NOT EXISTS idx_contact_submissions_device_type
ON contact_submissions (device_type) WHERE device_type IS NOT NULL;

-- Index for replied_at queries (used in response time calculations)
CREATE INDEX IF NOT EXISTS idx_contact_submissions_replied_at
ON contact_submissions (replied_at) WHERE replied_at IS NOT NULL;

-- Composite index for overdue submissions query optimization
CREATE INDEX IF NOT EXISTS idx_contact_submissions_overdue_lookup
ON contact_submissions (created_at, status) 
WHERE status IN ('new', 'in_progress');

-- Index for browser filtering
CREATE INDEX IF NOT EXISTS idx_contact_submissions_browser
ON contact_submissions (browser) WHERE browser IS NOT NULL;

-- Partial index for source_page filtering (common in analytics)
CREATE INDEX IF NOT EXISTS idx_contact_submissions_source_page_analytics
ON contact_submissions (source_page, created_at DESC, status);

-- Index for updated_at (used in real-time subscriptions)
CREATE INDEX IF NOT EXISTS idx_contact_submissions_updated_at
ON contact_submissions (updated_at DESC);

-- Composite index for search optimization (name, email, subject)
-- This will help with ILIKE queries used in the search function
CREATE INDEX IF NOT EXISTS idx_contact_submissions_name_lower
ON contact_submissions (LOWER(name));

CREATE INDEX IF NOT EXISTS idx_contact_submissions_email_lower  
ON contact_submissions (LOWER(email));

CREATE INDEX IF NOT EXISTS idx_contact_submissions_subject_lower
ON contact_submissions (LOWER(subject));

-- Verify indexes were created
SELECT 
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename = 'contact_submissions' 
    AND indexname LIKE 'idx_contact_submissions%'
ORDER BY indexname;
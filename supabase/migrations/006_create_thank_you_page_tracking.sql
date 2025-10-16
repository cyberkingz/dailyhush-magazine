-- Create thank_you_page_sessions table
CREATE TABLE IF NOT EXISTS thank_you_page_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL UNIQUE,
  email TEXT,
  quiz_submission_id TEXT,
  quiz_score INTEGER,
  quiz_type TEXT,
  page_url TEXT NOT NULL,
  referrer_url TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,
  user_agent TEXT,
  browser TEXT,
  device_type TEXT,
  max_scroll_depth INTEGER DEFAULT 0,
  time_on_page_ms INTEGER,
  clicked_buy_button BOOLEAN DEFAULT FALSE,
  sections_viewed TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create thank_you_page_events table
CREATE TABLE IF NOT EXISTS thank_you_page_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  email TEXT,
  event_type TEXT NOT NULL,
  scroll_depth INTEGER,
  section_id TEXT,
  time_since_page_load_ms INTEGER,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_thank_you_sessions_session_id ON thank_you_page_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_thank_you_sessions_email ON thank_you_page_sessions(email);
CREATE INDEX IF NOT EXISTS idx_thank_you_sessions_quiz_submission ON thank_you_page_sessions(quiz_submission_id);
CREATE INDEX IF NOT EXISTS idx_thank_you_sessions_created_at ON thank_you_page_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_thank_you_sessions_utm_campaign ON thank_you_page_sessions(utm_campaign);

CREATE INDEX IF NOT EXISTS idx_thank_you_events_session_id ON thank_you_page_events(session_id);
CREATE INDEX IF NOT EXISTS idx_thank_you_events_email ON thank_you_page_events(email);
CREATE INDEX IF NOT EXISTS idx_thank_you_events_event_type ON thank_you_page_events(event_type);
CREATE INDEX IF NOT EXISTS idx_thank_you_events_created_at ON thank_you_page_events(created_at DESC);

-- Add foreign key relationship (if quiz_submissions table exists)
-- ALTER TABLE thank_you_page_sessions
-- ADD CONSTRAINT fk_quiz_submission
-- FOREIGN KEY (quiz_submission_id) REFERENCES quiz_submissions(id)
-- ON DELETE SET NULL;

-- Disable RLS for analytics tables (same as quiz_sessions and quiz_events)
ALTER TABLE thank_you_page_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE thank_you_page_events DISABLE ROW LEVEL SECURITY;

-- Add comments for documentation
COMMENT ON TABLE thank_you_page_sessions IS 'Tracks user sessions on the thank you page with email identification and journey data';
COMMENT ON TABLE thank_you_page_events IS 'Tracks individual events on the thank you page (scroll depth, section views, button clicks)';

COMMENT ON COLUMN thank_you_page_sessions.email IS 'User email from URL params for journey tracking';
COMMENT ON COLUMN thank_you_page_sessions.quiz_submission_id IS 'Links to quiz submission if user came from quiz';
COMMENT ON COLUMN thank_you_page_sessions.max_scroll_depth IS 'Maximum scroll depth percentage reached (0-100)';
COMMENT ON COLUMN thank_you_page_sessions.clicked_buy_button IS 'Whether user clicked any buy button on the page';
COMMENT ON COLUMN thank_you_page_events.time_since_page_load_ms IS 'Time elapsed since page load when event occurred';

-- ============================================================
-- PRODUCT PAGE TRACKING TABLES
-- ============================================================

-- Create product_page_sessions table
CREATE TABLE IF NOT EXISTS product_page_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL UNIQUE,
  email TEXT,
  product_id TEXT,
  page_url TEXT NOT NULL,
  referrer_url TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,
  user_agent TEXT,
  browser TEXT,
  device_type TEXT,
  max_scroll_depth INTEGER DEFAULT 0,
  time_on_page_ms INTEGER,
  clicked_buy_button BOOLEAN DEFAULT FALSE,
  viewed_price BOOLEAN DEFAULT FALSE,
  sections_viewed TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create product_page_events table
CREATE TABLE IF NOT EXISTS product_page_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  email TEXT,
  event_type TEXT NOT NULL,
  scroll_depth INTEGER,
  section_id TEXT,
  time_since_page_load_ms INTEGER,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_product_sessions_session_id ON product_page_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_product_sessions_email ON product_page_sessions(email);
CREATE INDEX IF NOT EXISTS idx_product_sessions_product_id ON product_page_sessions(product_id);
CREATE INDEX IF NOT EXISTS idx_product_sessions_created_at ON product_page_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_product_sessions_utm_campaign ON product_page_sessions(utm_campaign);
CREATE INDEX IF NOT EXISTS idx_product_sessions_clicked_buy ON product_page_sessions(clicked_buy_button);

CREATE INDEX IF NOT EXISTS idx_product_events_session_id ON product_page_events(session_id);
CREATE INDEX IF NOT EXISTS idx_product_events_email ON product_page_events(email);
CREATE INDEX IF NOT EXISTS idx_product_events_event_type ON product_page_events(event_type);
CREATE INDEX IF NOT EXISTS idx_product_events_created_at ON product_page_events(created_at DESC);

-- Disable RLS for analytics tables
ALTER TABLE product_page_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE product_page_events DISABLE ROW LEVEL SECURITY;

-- Add comments for documentation
COMMENT ON TABLE product_page_sessions IS 'Tracks user sessions on product pages with email identification from retargeting emails';
COMMENT ON TABLE product_page_events IS 'Tracks individual events on product pages (scroll depth, section views, button clicks, FAQ opens)';

COMMENT ON COLUMN product_page_sessions.email IS 'User email from URL params for retargeting attribution';
COMMENT ON COLUMN product_page_sessions.product_id IS 'Product identifier (e.g., fire-starter)';
COMMENT ON COLUMN product_page_sessions.max_scroll_depth IS 'Maximum scroll depth percentage reached (0-100)';
COMMENT ON COLUMN product_page_sessions.clicked_buy_button IS 'Whether user clicked any buy button on the page';
COMMENT ON COLUMN product_page_sessions.viewed_price IS 'Whether user scrolled to price section';
COMMENT ON COLUMN product_page_events.time_since_page_load_ms IS 'Time elapsed since page load when event occurred';

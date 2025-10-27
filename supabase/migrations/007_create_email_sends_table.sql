-- Create email_sends table for tracking all outbound emails
CREATE TABLE IF NOT EXISTS email_sends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Email identification
  recipient_email TEXT NOT NULL,
  email_sequence_day INTEGER NOT NULL, -- 0, 1, 2, 3, 4 for the 5-email sequence
  email_subject TEXT NOT NULL,

  -- Campaign tracking
  campaign_name TEXT DEFAULT 'necklace-launch',
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,

  -- Quiz data (for segmentation)
  quiz_score INTEGER,
  quiz_result_type TEXT,
  quiz_result_title TEXT,

  -- Metadata
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_email_sends_recipient ON email_sends(recipient_email);
CREATE INDEX IF NOT EXISTS idx_email_sends_campaign ON email_sends(campaign_name);
CREATE INDEX IF NOT EXISTS idx_email_sends_sequence_day ON email_sends(email_sequence_day);
CREATE INDEX IF NOT EXISTS idx_email_sends_sent_at ON email_sends(sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_email_sends_utm_campaign ON email_sends(utm_campaign);
CREATE INDEX IF NOT EXISTS idx_email_sends_utm_content ON email_sends(utm_content);

-- Disable RLS for analytics table
ALTER TABLE email_sends DISABLE ROW LEVEL SECURITY;

-- Add comments for documentation
COMMENT ON TABLE email_sends IS 'Tracks all emails sent in automated sequences for open rate calculation';
COMMENT ON COLUMN email_sends.email_sequence_day IS 'Day in sequence: 0=instant, 1=day1, 2=day2, 3=day3, 4=day4';
COMMENT ON COLUMN email_sends.recipient_email IS 'Email address of recipient';
COMMENT ON COLUMN email_sends.utm_content IS 'Identifies specific email: quiz-day0-confirmation, day1-brain-science, etc';

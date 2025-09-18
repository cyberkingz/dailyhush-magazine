
CREATE TABLE contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(500) NOT NULL,
  message TEXT NOT NULL,
  source_url TEXT,
  source_page VARCHAR(255) DEFAULT 'contact',
  referrer_url TEXT,
  utm_source VARCHAR(100),
  utm_medium VARCHAR(100), 
  utm_campaign VARCHAR(100),
  utm_term VARCHAR(100),
  utm_content VARCHAR(100),
  user_agent TEXT,
  ip_address INET,
  country_code VARCHAR(2),
  browser VARCHAR(50),
  device_type VARCHAR(20),
  status VARCHAR(20) DEFAULT 'new',
  replied_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);


CREATE INDEX idx_contact_submissions_email ON contact_submissions(email);
CREATE INDEX idx_contact_submissions_created_at ON contact_submissions(created_at DESC);
CREATE INDEX idx_contact_submissions_status ON contact_submissions(status);
CREATE INDEX idx_contact_submissions_source_page ON contact_submissions(source_page);


CREATE TRIGGER update_contact_submissions_updated_at 
  BEFORE UPDATE ON contact_submissions 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();


ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;



CREATE POLICY "Allow anonymous contact submission creation" ON contact_submissions
  FOR INSERT 
  WITH CHECK (true);


CREATE POLICY "Allow authenticated users to read contact submissions" ON contact_submissions
  FOR SELECT
  USING (auth.uid() IS NOT NULL);


CREATE POLICY "Allow authenticated users to update contact submissions" ON contact_submissions
  FOR UPDATE
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);


CREATE VIEW contact_submission_analytics AS
SELECT 
  DATE_TRUNC('day', created_at) as date,
  status,
  source_page,
  utm_source,
  utm_campaign,
  COUNT(*) as submission_count,
  COUNT(CASE WHEN replied_at IS NOT NULL THEN 1 END) as replied_count
FROM contact_submissions
GROUP BY DATE_TRUNC('day', created_at), status, source_page, utm_source, utm_campaign
ORDER BY date DESC;
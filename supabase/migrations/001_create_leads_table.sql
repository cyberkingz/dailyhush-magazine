-- Create leads table for email opt-ins
CREATE TABLE leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  source_url TEXT,
  source_page VARCHAR(255),
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
  is_subscribed BOOLEAN DEFAULT true,
  confirmed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX idx_leads_source_page ON leads(source_page);
CREATE INDEX idx_leads_utm_source ON leads(utm_source);
CREATE INDEX idx_leads_is_subscribed ON leads(is_subscribed);

-- Create unique constraint on email to prevent duplicates
ALTER TABLE leads ADD CONSTRAINT unique_email UNIQUE (email);

-- Create function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_leads_updated_at 
  BEFORE UPDATE ON leads 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Allow anonymous users to insert leads (for opt-ins)
CREATE POLICY "Allow anonymous lead creation" ON leads
  FOR INSERT 
  WITH CHECK (true);

-- Allow authenticated users to read all leads (for admin dashboard)
CREATE POLICY "Allow authenticated users to read leads" ON leads
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Allow authenticated users to update leads (for admin management)
CREATE POLICY "Allow authenticated users to update leads" ON leads
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Create view for lead analytics
CREATE VIEW lead_analytics AS
SELECT 
  DATE_TRUNC('day', created_at) as date,
  source_page,
  utm_source,
  utm_campaign,
  COUNT(*) as lead_count,
  COUNT(CASE WHEN confirmed_at IS NOT NULL THEN 1 END) as confirmed_count
FROM leads
GROUP BY DATE_TRUNC('day', created_at), source_page, utm_source, utm_campaign
ORDER BY date DESC;
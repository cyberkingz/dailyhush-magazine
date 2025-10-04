-- Create quiz_submissions table to store quiz completions
CREATE TABLE quiz_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- User identification
  email VARCHAR(255) NOT NULL,

  -- Quiz results
  overthinker_type VARCHAR(50) NOT NULL,
  score INTEGER NOT NULL,
  result_title TEXT NOT NULL,
  result_description TEXT,
  result_insight TEXT,
  result_cta_hook TEXT,

  -- Tracking context (same as leads table for consistency)
  source_url TEXT,
  source_page VARCHAR(255) DEFAULT 'quiz',
  referrer_url TEXT,
  utm_source VARCHAR(100),
  utm_medium VARCHAR(100),
  utm_campaign VARCHAR(100),
  utm_term VARCHAR(100),
  utm_content VARCHAR(100),
  user_agent TEXT,
  browser VARCHAR(50),
  device_type VARCHAR(20),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create quiz_answers table to store individual question answers
CREATE TABLE quiz_answers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Link to submission
  submission_id UUID NOT NULL REFERENCES quiz_submissions(id) ON DELETE CASCADE,

  -- Question details
  question_id VARCHAR(50) NOT NULL,
  question_section VARCHAR(50) NOT NULL,
  question_type VARCHAR(20) NOT NULL,
  question_text TEXT,

  -- Answer details (only one will be populated based on question type)
  option_id VARCHAR(50),
  option_text TEXT,
  option_value INTEGER,
  scale_value INTEGER,
  multiple_option_ids TEXT[], -- Array of option IDs for multiple choice

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX idx_quiz_submissions_email ON quiz_submissions(email);
CREATE INDEX idx_quiz_submissions_created_at ON quiz_submissions(created_at DESC);
CREATE INDEX idx_quiz_submissions_overthinker_type ON quiz_submissions(overthinker_type);
CREATE INDEX idx_quiz_submissions_source_page ON quiz_submissions(source_page);
CREATE INDEX idx_quiz_submissions_utm_source ON quiz_submissions(utm_source);

CREATE INDEX idx_quiz_answers_submission_id ON quiz_answers(submission_id);
CREATE INDEX idx_quiz_answers_question_id ON quiz_answers(question_id);
CREATE INDEX idx_quiz_answers_question_section ON quiz_answers(question_section);

-- Create trigger to automatically update updated_at on quiz_submissions
CREATE TRIGGER update_quiz_submissions_updated_at
  BEFORE UPDATE ON quiz_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE quiz_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_answers ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for quiz_submissions
-- Allow anonymous users to insert quiz submissions (for quiz completion)
CREATE POLICY "Allow anonymous quiz submission creation" ON quiz_submissions
  FOR INSERT
  WITH CHECK (true);

-- Allow authenticated users to read all submissions (for admin dashboard)
CREATE POLICY "Allow authenticated users to read quiz submissions" ON quiz_submissions
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Allow authenticated users to update submissions (for admin management)
CREATE POLICY "Allow authenticated users to update quiz submissions" ON quiz_submissions
  FOR UPDATE
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Create RLS policies for quiz_answers
-- Allow anonymous users to insert answers (as part of quiz submission)
CREATE POLICY "Allow anonymous quiz answer creation" ON quiz_answers
  FOR INSERT
  WITH CHECK (true);

-- Allow authenticated users to read all answers (for admin dashboard)
CREATE POLICY "Allow authenticated users to read quiz answers" ON quiz_answers
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Create view for quiz analytics
CREATE VIEW quiz_analytics AS
SELECT
  DATE_TRUNC('day', created_at) as date,
  overthinker_type,
  source_page,
  utm_source,
  utm_campaign,
  COUNT(*) as submission_count,
  AVG(score) as avg_score
FROM quiz_submissions
GROUP BY DATE_TRUNC('day', created_at), overthinker_type, source_page, utm_source, utm_campaign
ORDER BY date DESC;

-- Create view for question-level analytics
CREATE VIEW quiz_question_analytics AS
SELECT
  question_id,
  question_section,
  question_type,
  option_id,
  option_text,
  COUNT(*) as answer_count,
  AVG(option_value) as avg_option_value
FROM quiz_answers
WHERE option_id IS NOT NULL
GROUP BY question_id, question_section, question_type, option_id, option_text
ORDER BY question_id, answer_count DESC;

-- Create view for overthinker type distribution
CREATE VIEW overthinker_type_distribution AS
SELECT
  overthinker_type,
  result_title,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
FROM quiz_submissions
GROUP BY overthinker_type, result_title
ORDER BY count DESC;

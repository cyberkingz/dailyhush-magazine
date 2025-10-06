-- Make total_questions nullable since we don't know it until quiz starts
-- The session is created on page view, but total_questions is only known when user clicks "Start Quiz"

ALTER TABLE quiz_sessions
ALTER COLUMN total_questions DROP NOT NULL;

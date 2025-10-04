// Quiz database types for Supabase tables

/**
 * Quiz submission database record
 * Represents a completed quiz submission with results
 */
export interface QuizSubmissionDB {
  id: string
  email: string
  overthinker_type: 'chronic-planner' | 'research-addict' | 'self-doubter' | 'vision-hopper'
  score: number
  result_title: string
  result_description: string
  result_insight: string
  result_cta_hook: string
  source_url?: string
  source_page?: string
  referrer_url?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
  user_agent?: string
  browser?: string
  device_type?: 'desktop' | 'mobile' | 'tablet' | 'unknown'
  created_at: string
  updated_at: string
}

/**
 * Quiz answer database record
 * Represents an individual question answer within a quiz submission
 */
export interface QuizAnswerDB {
  id: string
  submission_id: string
  question_id: string
  question_section: 'mental' | 'action' | 'emotional' | 'habits' | 'reflection'
  question_type: 'single' | 'scale' | 'multiple'
  question_text?: string
  option_id?: string
  option_text?: string
  option_value?: number
  scale_value?: number
  multiple_option_ids?: string[]
  created_at: string
}

/**
 * Quiz analytics view
 * Aggregated quiz submission analytics by date, type, and source
 */
export interface QuizAnalyticsDB {
  date: string
  overthinker_type: string
  source_page?: string
  utm_source?: string
  utm_campaign?: string
  submission_count: number
  avg_score: number
}

/**
 * Question-level analytics view
 * Answer distribution and statistics for each question
 */
export interface QuizQuestionAnalyticsDB {
  question_id: string
  question_section: string
  question_type: string
  option_id?: string
  option_text?: string
  answer_count: number
  avg_option_value?: number
}

/**
 * Overthinker type distribution view
 * Count and percentage distribution of each overthinker type
 */
export interface OverthinkerTypeDistributionDB {
  overthinker_type: string
  result_title: string
  count: number
  percentage: number
}

/**
 * Create quiz submission input
 * Data required to create a new quiz submission
 */
export interface CreateQuizSubmissionData {
  email: string
  overthinker_type: 'chronic-planner' | 'research-addict' | 'self-doubter' | 'vision-hopper'
  score: number
  result_title: string
  result_description: string
  result_insight: string
  result_cta_hook: string
  source_url?: string
  source_page?: string
  referrer_url?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
  user_agent?: string
  browser?: string
  device_type?: 'desktop' | 'mobile' | 'tablet' | 'unknown'
}

/**
 * Create quiz answer input
 * Data required to create a new quiz answer
 */
export interface CreateQuizAnswerData {
  submission_id: string
  question_id: string
  question_section: 'mental' | 'action' | 'emotional' | 'habits' | 'reflection'
  question_type: 'single' | 'scale' | 'multiple'
  question_text?: string
  option_id?: string
  option_text?: string
  option_value?: number
  scale_value?: number
  multiple_option_ids?: string[]
}

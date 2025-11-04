-- ============================================================================
-- COMMON QUERY EXAMPLES FOR EXERCISE_LOGS
-- ============================================================================
-- Author: DailyHush Supabase Expert
-- Date: 2025-01-04
-- Purpose: Ready-to-use SQL queries for common analytics and dashboard needs
-- ============================================================================

-- ============================================================================
-- 1. USER DASHBOARD QUERIES
-- ============================================================================

-- Get user's last 7 days of exercises
-- Use case: Exercise history list in the app
SELECT
  log_id,
  exercise_name,
  exercise_type,
  completed_at,
  ROUND(duration_seconds / 60.0, 1) as duration_minutes,
  pre_anxiety_rating,
  post_anxiety_rating,
  anxiety_reduction,
  reduction_percentage,
  trigger_category,
  module_context,
  completion_status
FROM exercise_logs
WHERE user_id = 'USER_ID_HERE'
  AND started_at >= CURRENT_DATE - INTERVAL '7 days'
  AND is_deleted = FALSE
ORDER BY started_at DESC;

-- Get user's exercise summary (for dashboard header)
-- Use case: "You've completed 23 exercises this week!"
SELECT
  COUNT(*) as total_exercises,
  COUNT(*) FILTER (WHERE completion_status = 'completed') as completed_exercises,
  COUNT(*) FILTER (WHERE completion_status = 'abandoned') as abandoned_exercises,
  ROUND(AVG(anxiety_reduction) FILTER (WHERE completion_status = 'completed'), 1) as avg_anxiety_reduction,
  ROUND(AVG(reduction_percentage) FILTER (WHERE completion_status = 'completed'), 1) as avg_reduction_percentage,
  COUNT(*) FILTER (WHERE started_at >= CURRENT_DATE - INTERVAL '7 days') as exercises_this_week,
  COUNT(*) FILTER (WHERE started_at >= CURRENT_DATE - INTERVAL '30 days') as exercises_this_month
FROM exercise_logs
WHERE user_id = 'USER_ID_HERE'
  AND is_deleted = FALSE;

-- ============================================================================
-- 2. STREAK CALCULATIONS
-- ============================================================================

-- Calculate current streak using the helper function
-- Use case: "You're on a 5-day streak! 🔥"
SELECT get_exercise_streak('USER_ID_HERE') as current_streak;

-- Get dates with exercises in the last 30 days (for calendar view)
-- Use case: Visual calendar showing which days had exercises
SELECT
  DATE(completed_at) as exercise_date,
  COUNT(*) as exercise_count,
  ARRAY_AGG(DISTINCT exercise_type) as exercise_types,
  ROUND(AVG(anxiety_reduction), 1) as avg_reduction
FROM exercise_logs
WHERE user_id = 'USER_ID_HERE'
  AND completion_status = 'completed'
  AND completed_at >= CURRENT_DATE - INTERVAL '30 days'
  AND is_deleted = FALSE
GROUP BY DATE(completed_at)
ORDER BY DATE(completed_at) DESC;

-- Longest streak calculation (more complex)
-- Use case: "Your longest streak was 12 days!"
WITH RECURSIVE date_series AS (
  -- Get all dates in the last 365 days
  SELECT generate_series(
    CURRENT_DATE - INTERVAL '365 days',
    CURRENT_DATE,
    INTERVAL '1 day'
  )::DATE as date
),
exercise_dates AS (
  -- Get dates when user completed exercises
  SELECT DISTINCT DATE(completed_at) as date
  FROM exercise_logs
  WHERE user_id = 'USER_ID_HERE'
    AND completion_status = 'completed'
    AND is_deleted = FALSE
),
streak_groups AS (
  -- Assign group numbers to consecutive dates
  SELECT
    date,
    date - (ROW_NUMBER() OVER (ORDER BY date))::INTEGER * INTERVAL '1 day' as streak_group
  FROM exercise_dates
)
SELECT MAX(streak_length) as longest_streak
FROM (
  SELECT
    streak_group,
    COUNT(*) as streak_length
  FROM streak_groups
  GROUP BY streak_group
) streaks;

-- ============================================================================
-- 3. EFFECTIVENESS ANALYSIS
-- ============================================================================

-- Get average anxiety reduction per exercise type
-- Use case: "Breathing exercises reduce anxiety by 4.2 points on average"
SELECT
  exercise_type,
  COUNT(*) as total_sessions,
  ROUND(AVG(pre_anxiety_rating), 1) as avg_pre_anxiety,
  ROUND(AVG(post_anxiety_rating), 1) as avg_post_anxiety,
  ROUND(AVG(anxiety_reduction), 1) as avg_anxiety_reduction,
  ROUND(AVG(reduction_percentage), 1) as avg_reduction_percentage,
  ROUND(AVG(duration_seconds) / 60.0, 1) as avg_duration_minutes
FROM exercise_logs
WHERE user_id = 'USER_ID_HERE'
  AND completion_status = 'completed'
  AND is_deleted = FALSE
GROUP BY exercise_type
ORDER BY avg_anxiety_reduction DESC;

-- Get most effective exercise for the user
-- Use case: "Your most effective exercise is: Breathing"
SELECT get_most_effective_exercise('USER_ID_HERE') as most_effective_exercise;

-- Compare effectiveness by time of day
-- Use case: "You respond best to exercises in the evening"
SELECT
  CASE
    WHEN EXTRACT(HOUR FROM started_at) BETWEEN 6 AND 11 THEN 'Morning (6am-12pm)'
    WHEN EXTRACT(HOUR FROM started_at) BETWEEN 12 AND 17 THEN 'Afternoon (12pm-6pm)'
    WHEN EXTRACT(HOUR FROM started_at) BETWEEN 18 AND 23 THEN 'Evening (6pm-12am)'
    ELSE 'Night (12am-6am)'
  END as time_of_day,
  COUNT(*) as session_count,
  ROUND(AVG(anxiety_reduction), 1) as avg_anxiety_reduction,
  ROUND(AVG(reduction_percentage), 1) as avg_reduction_percentage
FROM exercise_logs
WHERE user_id = 'USER_ID_HERE'
  AND completion_status = 'completed'
  AND is_deleted = FALSE
GROUP BY time_of_day
ORDER BY avg_anxiety_reduction DESC;

-- ============================================================================
-- 4. TRIGGER ANALYSIS
-- ============================================================================

-- Get most common triggers
-- Use case: "Your top triggers: Work stress, Relationship conflict"
SELECT
  trigger_category,
  COUNT(*) as occurrence_count,
  ROUND(AVG(pre_anxiety_rating), 1) as avg_starting_anxiety,
  ROUND(AVG(anxiety_reduction), 1) as avg_reduction,
  ARRAY_AGG(DISTINCT exercise_type) as exercises_used
FROM exercise_logs
WHERE user_id = 'USER_ID_HERE'
  AND trigger_category IS NOT NULL
  AND completion_status = 'completed'
  AND is_deleted = FALSE
GROUP BY trigger_category
ORDER BY occurrence_count DESC
LIMIT 5;

-- Get most common trigger using helper function
-- Use case: Quick lookup for Pattern Insights
SELECT get_most_common_trigger('USER_ID_HERE') as most_common_trigger;

-- Trigger effectiveness by exercise type
-- Use case: "For work stress, breathing exercises are most effective"
SELECT
  trigger_category,
  exercise_type,
  COUNT(*) as usage_count,
  ROUND(AVG(anxiety_reduction), 1) as avg_reduction,
  ROUND(AVG(reduction_percentage), 1) as avg_reduction_percentage
FROM exercise_logs
WHERE user_id = 'USER_ID_HERE'
  AND trigger_category IS NOT NULL
  AND completion_status = 'completed'
  AND is_deleted = FALSE
GROUP BY trigger_category, exercise_type
HAVING COUNT(*) >= 2 -- Only show if used at least twice
ORDER BY trigger_category, avg_reduction DESC;

-- ============================================================================
-- 5. COMPLETION RATE ANALYSIS
-- ============================================================================

-- Get completion rate per module
-- Use case: "85% of users complete exercises from Module 2"
SELECT
  module_context,
  COUNT(*) as total_sessions,
  COUNT(*) FILTER (WHERE completion_status = 'completed') as completed,
  COUNT(*) FILTER (WHERE completion_status = 'abandoned') as abandoned,
  COUNT(*) FILTER (WHERE completion_status = 'skipped') as skipped,
  ROUND(
    (COUNT(*) FILTER (WHERE completion_status = 'completed')::NUMERIC / NULLIF(COUNT(*), 0)) * 100,
    1
  ) as completion_rate
FROM exercise_logs
WHERE user_id = 'USER_ID_HERE'
  AND is_deleted = FALSE
GROUP BY module_context
ORDER BY completion_rate DESC;

-- Get completion rate per exercise type
-- Use case: Identify which exercises have highest abandonment
SELECT
  exercise_type,
  COUNT(*) as total_attempts,
  COUNT(*) FILTER (WHERE completion_status = 'completed') as completed,
  COUNT(*) FILTER (WHERE completion_status = 'abandoned') as abandoned,
  ROUND(
    (COUNT(*) FILTER (WHERE completion_status = 'completed')::NUMERIC / NULLIF(COUNT(*), 0)) * 100,
    1
  ) as completion_rate,
  ROUND(AVG(abandoned_at_percentage) FILTER (WHERE completion_status = 'abandoned'), 0) as avg_abandonment_point
FROM exercise_logs
WHERE user_id = 'USER_ID_HERE'
  AND is_deleted = FALSE
GROUP BY exercise_type
ORDER BY completion_rate ASC; -- Show problematic exercises first

-- ============================================================================
-- 6. PATTERN INSIGHTS (WEEKLY TRENDS)
-- ============================================================================

-- Weekly progress comparison (last 8 weeks)
-- Use case: "Your anxiety reduction improved by 15% this week!"
WITH weekly_stats AS (
  SELECT
    DATE_TRUNC('week', started_at)::DATE as week_start,
    COUNT(*) FILTER (WHERE completion_status = 'completed') as completed_count,
    ROUND(AVG(anxiety_reduction) FILTER (WHERE completion_status = 'completed'), 1) as avg_reduction,
    ROUND(AVG(duration_seconds) FILTER (WHERE completion_status = 'completed') / 60.0, 1) as avg_duration_minutes
  FROM exercise_logs
  WHERE user_id = 'USER_ID_HERE'
    AND started_at >= CURRENT_DATE - INTERVAL '8 weeks'
    AND is_deleted = FALSE
  GROUP BY DATE_TRUNC('week', started_at)
)
SELECT
  week_start,
  week_start + INTERVAL '6 days' as week_end,
  completed_count,
  avg_reduction,
  avg_duration_minutes,
  LAG(avg_reduction) OVER (ORDER BY week_start) as prev_week_reduction,
  ROUND(
    ((avg_reduction - LAG(avg_reduction) OVER (ORDER BY week_start)) /
     NULLIF(LAG(avg_reduction) OVER (ORDER BY week_start), 0)) * 100,
    0
  ) as improvement_percentage
FROM weekly_stats
ORDER BY week_start DESC;

-- Day-of-week analysis
-- Use case: "You use exercises most on Mondays"
SELECT
  TO_CHAR(started_at, 'Day') as day_of_week,
  EXTRACT(ISODOW FROM started_at) as day_number, -- 1=Monday, 7=Sunday
  COUNT(*) as exercise_count,
  ROUND(AVG(anxiety_reduction) FILTER (WHERE completion_status = 'completed'), 1) as avg_reduction
FROM exercise_logs
WHERE user_id = 'USER_ID_HERE'
  AND is_deleted = FALSE
GROUP BY day_of_week, day_number
ORDER BY day_number;

-- ============================================================================
-- 7. ABANDONMENT FRICTION POINT ANALYSIS
-- ============================================================================

-- Find where users abandon exercises
-- Use case: Product team identifies friction points
SELECT
  exercise_type,
  COUNT(*) as abandonment_count,
  ROUND(AVG(abandoned_at_percentage), 0) as avg_abandonment_point,
  MODE() WITHIN GROUP (ORDER BY abandoned_at_percentage) as most_common_abandonment_point,
  ROUND(AVG(duration_seconds), 0) as avg_time_before_abandon
FROM exercise_logs
WHERE user_id = 'USER_ID_HERE'
  AND completion_status = 'abandoned'
  AND is_deleted = FALSE
GROUP BY exercise_type
ORDER BY abandonment_count DESC;

-- Identify early-abandon vs late-abandon patterns
-- Use case: "Most users who abandon do so in first 30 seconds"
SELECT
  exercise_type,
  CASE
    WHEN abandoned_at_percentage <= 25 THEN 'Early (0-25%)'
    WHEN abandoned_at_percentage <= 50 THEN 'Middle (25-50%)'
    WHEN abandoned_at_percentage <= 75 THEN 'Late (50-75%)'
    ELSE 'Very Late (75-100%)'
  END as abandonment_stage,
  COUNT(*) as count
FROM exercise_logs
WHERE user_id = 'USER_ID_HERE'
  AND completion_status = 'abandoned'
  AND is_deleted = FALSE
GROUP BY exercise_type, abandonment_stage
ORDER BY exercise_type, abandonment_stage;

-- ============================================================================
-- 8. RECENT ACTIVITY
-- ============================================================================

-- Get user's last completed exercise
-- Use case: "Resume where you left off"
SELECT
  log_id,
  exercise_name,
  exercise_type,
  completed_at,
  module_context,
  fire_module_screen,
  anxiety_reduction
FROM exercise_logs
WHERE user_id = 'USER_ID_HERE'
  AND completion_status = 'completed'
  AND is_deleted = FALSE
ORDER BY completed_at DESC
LIMIT 1;

-- Get exercises started but not completed (drafts)
-- Use case: "You have an exercise in progress"
SELECT
  log_id,
  exercise_name,
  exercise_type,
  started_at,
  module_context,
  fire_module_screen
FROM exercise_logs
WHERE user_id = 'USER_ID_HERE'
  AND completion_status NOT IN ('completed', 'skipped')
  AND is_deleted = FALSE
ORDER BY started_at DESC
LIMIT 5;

-- ============================================================================
-- 9. MATERIALIZED VIEW QUERIES (FAST)
-- ============================================================================

-- Get pre-computed stats for all exercise types
-- Use case: Fast dashboard loading
SELECT
  exercise_type,
  total_sessions,
  completion_rate,
  avg_anxiety_reduction,
  avg_reduction_percentage,
  completions_last_7_days,
  completions_last_30_days
FROM exercise_stats_by_user
WHERE user_id = 'USER_ID_HERE'
ORDER BY avg_anxiety_reduction DESC;

-- Get overall user stats (aggregated across all exercises)
-- Use case: "You've reduced anxiety by an average of 42%"
SELECT
  user_id,
  SUM(total_sessions) as total_all_exercises,
  SUM(completed_count) as total_completed,
  ROUND(AVG(avg_anxiety_reduction), 1) as overall_avg_reduction,
  ROUND(AVG(avg_reduction_percentage), 1) as overall_avg_reduction_pct,
  SUM(completions_last_7_days) as total_this_week,
  SUM(completions_last_30_days) as total_this_month
FROM exercise_stats_by_user
WHERE user_id = 'USER_ID_HERE'
GROUP BY user_id;

-- ============================================================================
-- 10. ADMIN / ANALYTICS QUERIES
-- ============================================================================

-- Platform-wide exercise usage
-- Use case: Product analytics dashboard
SELECT
  exercise_type,
  COUNT(DISTINCT user_id) as unique_users,
  COUNT(*) as total_sessions,
  ROUND(AVG(anxiety_reduction) FILTER (WHERE completion_status = 'completed'), 1) as avg_reduction,
  ROUND(
    (COUNT(*) FILTER (WHERE completion_status = 'completed')::NUMERIC / NULLIF(COUNT(*), 0)) * 100,
    1
  ) as completion_rate
FROM exercise_logs
WHERE is_deleted = FALSE
  AND started_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY exercise_type
ORDER BY total_sessions DESC;

-- User retention by exercise usage
-- Use case: "Users who do 3+ exercises per week have 80% retention"
WITH user_weekly_usage AS (
  SELECT
    user_id,
    DATE_TRUNC('week', started_at)::DATE as week,
    COUNT(*) FILTER (WHERE completion_status = 'completed') as exercises_completed
  FROM exercise_logs
  WHERE is_deleted = FALSE
    AND started_at >= CURRENT_DATE - INTERVAL '8 weeks'
  GROUP BY user_id, week
)
SELECT
  CASE
    WHEN exercises_completed = 0 THEN '0 exercises'
    WHEN exercises_completed BETWEEN 1 AND 2 THEN '1-2 exercises'
    WHEN exercises_completed BETWEEN 3 AND 5 THEN '3-5 exercises'
    WHEN exercises_completed BETWEEN 6 AND 10 THEN '6-10 exercises'
    ELSE '10+ exercises'
  END as usage_bucket,
  COUNT(DISTINCT user_id) as user_count,
  COUNT(*) as week_count
FROM user_weekly_usage
GROUP BY usage_bucket
ORDER BY MIN(exercises_completed);

-- ============================================================================
-- 11. PERSONALIZED RECOMMENDATIONS
-- ============================================================================

-- Recommend exercises based on user's most effective ones
-- Use case: "Based on your history, try Brain Dump for work stress"
WITH user_effectiveness AS (
  SELECT
    exercise_type,
    trigger_category,
    AVG(reduction_percentage) as avg_reduction,
    COUNT(*) as usage_count
  FROM exercise_logs
  WHERE user_id = 'USER_ID_HERE'
    AND completion_status = 'completed'
    AND reduction_percentage IS NOT NULL
    AND is_deleted = FALSE
  GROUP BY exercise_type, trigger_category
  HAVING COUNT(*) >= 2 -- Need at least 2 data points
)
SELECT
  trigger_category,
  exercise_type as recommended_exercise,
  ROUND(avg_reduction, 1) as expected_reduction,
  usage_count as times_used
FROM user_effectiveness
WHERE avg_reduction >= 30 -- Only recommend if >30% reduction
ORDER BY trigger_category, avg_reduction DESC;

-- Find under-utilized but effective exercises
-- Use case: "You haven't tried Body Scan yet, but similar users find it helpful"
SELECT
  e.exercise_type,
  COUNT(*) FILTER (WHERE el.log_id IS NULL) as times_available,
  COUNT(*) FILTER (WHERE el.log_id IS NOT NULL) as times_used
FROM (SELECT UNNEST(ENUM_RANGE(NULL::exercise_type)) as exercise_type) e
LEFT JOIN exercise_logs el ON el.exercise_type = e.exercise_type
  AND el.user_id = 'USER_ID_HERE'
  AND el.is_deleted = FALSE
WHERE el.log_id IS NULL OR COUNT(*) FILTER (WHERE el.log_id IS NOT NULL) < 3
GROUP BY e.exercise_type;

-- ============================================================================
-- 12. TIME-SERIES TREND ANALYSIS
-- ============================================================================

-- Daily anxiety trends (last 30 days)
-- Use case: Graph showing anxiety reduction over time
SELECT
  DATE(started_at) as date,
  COUNT(*) FILTER (WHERE completion_status = 'completed') as exercises_completed,
  ROUND(AVG(pre_anxiety_rating), 1) as avg_starting_anxiety,
  ROUND(AVG(post_anxiety_rating) FILTER (WHERE completion_status = 'completed'), 1) as avg_ending_anxiety,
  ROUND(AVG(anxiety_reduction) FILTER (WHERE completion_status = 'completed'), 1) as avg_reduction
FROM exercise_logs
WHERE user_id = 'USER_ID_HERE'
  AND started_at >= CURRENT_DATE - INTERVAL '30 days'
  AND is_deleted = FALSE
GROUP BY DATE(started_at)
ORDER BY DATE(started_at);

-- ============================================================================
-- PERFORMANCE NOTES
-- ============================================================================
-- 1. All user-specific queries use the idx_exercise_logs_user_completed index
-- 2. Time-range queries use idx_exercise_logs_user_time_range index
-- 3. For dashboard loads, prefer the exercise_stats_by_user materialized view
-- 4. Refresh materialized view every 6 hours via pg_cron
-- 5. Add .explain() in Supabase client to verify index usage
-- ============================================================================

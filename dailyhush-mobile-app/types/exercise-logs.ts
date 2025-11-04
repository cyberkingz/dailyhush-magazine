// ============================================================================
// TYPESCRIPT TYPES FOR EXERCISE LOGS
// ============================================================================
// Auto-generated types matching the exercise_logs schema
// Sync with: supabase/migrations/20250104000000_create_exercise_logs.sql
// ============================================================================

/**
 * Exercise Type Enum
 * Maps to the database exercise_type enum
 */
export type ExerciseType =
  | 'breathing'
  | 'progressive_muscle'
  | 'brain_dump'
  | 'grounding'
  | 'body_scan'
  | 'cognitive_reframe';

/**
 * Completion Status Enum
 * Maps to the database completion_status enum
 */
export type CompletionStatus = 'completed' | 'abandoned' | 'skipped';

/**
 * FIRE Module Context Enum
 * Maps to the database fire_module enum
 */
export type FireModule =
  | 'focus'
  | 'interrupt'
  | 'reframe'
  | 'execute'
  | 'standalone'
  | 'ai_anna'
  | 'suggestion';

/**
 * Loop Type (from quiz results)
 * Maps to user's overthinking pattern
 */
export type LoopType =
  | 'sleep-loop'
  | 'decision-loop'
  | 'social-loop'
  | 'perfectionism-loop'
  | 'all';

/**
 * Exercise Log Database Row
 * Complete record from the database
 */
export interface ExerciseLog {
  // Primary Key
  log_id: string;

  // User Reference
  user_id: string;

  // Exercise Identification
  exercise_type: ExerciseType;
  exercise_name: string;

  // Context & Source
  module_context: FireModule;
  fire_module_screen?: string | null;

  // Completion Tracking
  completion_status: CompletionStatus;
  started_at: string; // ISO 8601 timestamp
  completed_at?: string | null; // ISO 8601 timestamp
  duration_seconds?: number | null;

  // Pre/Post Anxiety Ratings
  pre_anxiety_rating?: number | null; // 1-10
  post_anxiety_rating?: number | null; // 1-10
  anxiety_reduction?: number | null; // Auto-calculated
  reduction_percentage?: number | null; // Auto-calculated

  // Trigger Information
  trigger_text?: string | null;
  trigger_category?: string | null;

  // Engagement Metrics
  abandoned_at_percentage?: number | null; // 0-100
  skip_reason?: string | null;

  // Exercise-Specific Data
  exercise_data: Record<string, any>; // JSONB

  // Privacy & Compliance
  is_deleted: boolean;
  deleted_at?: string | null;

  // Metadata
  device_type?: string | null;
  app_version?: string | null;

  // Timestamps
  created_at: string;
  updated_at: string;
}

/**
 * Exercise Trigger Record
 * Pre-defined trigger categories
 */
export interface ExerciseTrigger {
  trigger_id: string;
  trigger_name: string;
  trigger_category: string;
  display_order: number;
  is_active: boolean;
  loop_type?: LoopType | null;
  created_at: string;
}

/**
 * Exercise Stats (from materialized view)
 * Pre-computed statistics per user per exercise type
 */
export interface ExerciseStats {
  user_id: string;
  exercise_type: ExerciseType;

  // Completion Metrics
  total_sessions: number;
  completed_count: number;
  abandoned_count: number;
  skipped_count: number;
  completion_rate: number; // Percentage (0-100)

  // Effectiveness Metrics
  avg_pre_anxiety: number;
  avg_post_anxiety: number;
  avg_anxiety_reduction: number;
  avg_reduction_percentage: number;

  // Duration Metrics
  avg_duration_completed: number; // seconds

  // Engagement Metrics
  avg_abandonment_point: number; // percentage (0-100)

  // Time Metrics
  last_completed_at?: string | null;
  last_completed_date?: string | null;

  // Streak Helper
  completions_last_7_days: number;
  completions_last_30_days: number;

  // Updated Timestamp
  stats_updated_at: string;
}

/**
 * Insert Payload: Start Exercise
 * Data needed to create a new exercise log
 */
export interface StartExercisePayload {
  exercise_type: ExerciseType;
  exercise_name: string;
  module_context: FireModule;
  fire_module_screen?: string;
  pre_anxiety_rating?: number; // 1-10
  trigger_text?: string;
  trigger_category?: string;
  device_type?: string;
  app_version?: string;
}

/**
 * Update Payload: Complete Exercise
 * Data needed to mark exercise as completed
 */
export interface CompleteExercisePayload {
  completion_status: 'completed';
  completed_at: string; // ISO 8601
  duration_seconds: number;
  post_anxiety_rating: number; // 1-10
  exercise_data?: Record<string, any>;
}

/**
 * Update Payload: Abandon Exercise
 * Data needed to mark exercise as abandoned
 */
export interface AbandonExercisePayload {
  completion_status: 'abandoned';
  duration_seconds?: number;
  abandoned_at_percentage: number; // 0-100
  exercise_data?: Record<string, any>;
}

/**
 * Update Payload: Skip Exercise
 * Data needed to mark exercise as skipped
 */
export interface SkipExercisePayload {
  completion_status: 'skipped';
  skip_reason?: string;
}

/**
 * Exercise-Specific Data Structures
 * Type-safe structures for the exercise_data JSONB field
 */

export interface BreathingExerciseData {
  cycles_completed: number;
  target_cycles: number;
  technique: string; // e.g., "4-7-8", "box-breathing"
  interruptions?: number;
}

export interface BrainDumpExerciseData {
  word_count: number; // NO CONTENT STORED, just count
  writing_duration_seconds?: number;
}

export interface GroundingExerciseData {
  items_identified: {
    see: number;
    touch: number;
    hear: number;
    smell?: number;
    taste?: number;
  };
}

export interface ProgressiveMuscleData {
  muscle_groups_completed: number;
  target_muscle_groups: number;
  muscle_groups?: string[]; // e.g., ["shoulders", "neck", "jaw"]
}

export interface BodyScanData {
  body_parts_scanned: number;
  total_body_parts: number;
  tension_areas?: string[]; // e.g., ["shoulders", "lower back"]
}

export interface CognitiveReframeData {
  negative_thought_recorded: boolean;
  reframe_recorded: boolean;
  evidence_for_count?: number;
  evidence_against_count?: number;
}

/**
 * Query Result: User Exercise Summary
 * Aggregated data for user's exercise history
 */
export interface UserExerciseSummary {
  user_id: string;
  total_exercises: number;
  completed_exercises: number;
  current_streak: number;
  longest_streak: number;
  total_anxiety_reduction: number;
  avg_reduction_percentage: number;
  most_effective_exercise: ExerciseType | null;
  most_common_trigger: string | null;
  last_exercise_date: string | null;
  exercises_this_week: number;
  exercises_this_month: number;
}

/**
 * Query Result: Weekly Progress
 * For Pattern Insights feature
 */
export interface WeeklyExerciseProgress {
  week_start: string; // ISO 8601 date
  week_end: string; // ISO 8601 date
  total_sessions: number;
  completed_sessions: number;
  avg_anxiety_reduction: number;
  most_used_exercise: ExerciseType;
  completion_rate: number;
  improvement_vs_last_week: number; // percentage change
}

/**
 * Query Result: Trigger Analysis
 * Identify patterns in what triggers anxiety
 */
export interface TriggerAnalysis {
  trigger_category: string;
  occurrence_count: number;
  avg_pre_anxiety: number;
  avg_anxiety_reduction: number;
  most_effective_exercise: ExerciseType;
  time_of_day_distribution?: {
    morning: number; // 6am-12pm
    afternoon: number; // 12pm-6pm
    evening: number; // 6pm-12am
    night: number; // 12am-6am
  };
}

/**
 * Response: Exercise History Item
 * Formatted response for exercise history list
 */
export interface ExerciseHistoryItem {
  log_id: string;
  exercise_name: string;
  exercise_type: ExerciseType;
  completed_at: string;
  duration_minutes: number;
  anxiety_reduction: number;
  reduction_percentage: number;
  trigger_category?: string;
  module_context: FireModule;
}

/**
 * Database Functions Return Types
 */

export interface ExerciseStreakResult {
  current_streak: number;
  longest_streak: number;
  last_exercise_date: string | null;
}

/**
 * Supabase Query Helpers
 * Type-safe query builders
 */

export interface ExerciseLogsQuery {
  select?: string;
  where?: Partial<ExerciseLog>;
  order?: {
    column: keyof ExerciseLog;
    ascending?: boolean;
  };
  limit?: number;
  offset?: number;
}

/**
 * Exercise Configuration
 * Metadata about each exercise type
 */
export interface ExerciseConfig {
  type: ExerciseType;
  name: string;
  display_name: string;
  description: string;
  typical_duration_seconds: number;
  icon: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  recommended_for: LoopType[];
  fire_modules: FireModule[];
}

/**
 * Exercise Completion Event
 * For analytics tracking
 */
export interface ExerciseCompletionEvent {
  log_id: string;
  user_id: string;
  exercise_type: ExerciseType;
  completed_at: string;
  duration_seconds: number;
  anxiety_reduction: number;
  reduction_percentage: number;
  module_context: FireModule;
}

/**
 * Exercise Abandonment Event
 * For analytics and friction point analysis
 */
export interface ExerciseAbandonmentEvent {
  log_id: string;
  user_id: string;
  exercise_type: ExerciseType;
  abandoned_at: string;
  duration_seconds: number;
  abandoned_at_percentage: number;
  module_context: FireModule;
}

// ============================================================================
// HELPER TYPE GUARDS
// ============================================================================

export function isCompletedExercise(
  log: ExerciseLog
): log is ExerciseLog & {
  completion_status: 'completed';
  completed_at: string;
  post_anxiety_rating: number;
} {
  return (
    log.completion_status === 'completed' &&
    log.completed_at !== null &&
    log.post_anxiety_rating !== null
  );
}

export function isAbandonedExercise(
  log: ExerciseLog
): log is ExerciseLog & {
  completion_status: 'abandoned';
  abandoned_at_percentage: number;
} {
  return (
    log.completion_status === 'abandoned' &&
    log.abandoned_at_percentage !== null
  );
}

export function isSkippedExercise(
  log: ExerciseLog
): log is ExerciseLog & { completion_status: 'skipped' } {
  return log.completion_status === 'skipped';
}

// ============================================================================
// CONSTANTS
// ============================================================================

export const EXERCISE_TYPES: ExerciseType[] = [
  'breathing',
  'progressive_muscle',
  'brain_dump',
  'grounding',
  'body_scan',
  'cognitive_reframe',
];

export const FIRE_MODULES: FireModule[] = [
  'focus',
  'interrupt',
  'reframe',
  'execute',
  'standalone',
  'ai_anna',
  'suggestion',
];

export const ANXIETY_RATING_MIN = 1;
export const ANXIETY_RATING_MAX = 10;

export const PERCENTAGE_MIN = 0;
export const PERCENTAGE_MAX = 100;

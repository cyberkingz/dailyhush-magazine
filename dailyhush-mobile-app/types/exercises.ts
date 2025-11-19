/**
 * Nœma - Exercise Type Definitions
 * Comprehensive TypeScript interfaces for the exercise system
 *
 * Architecture:
 * - ExerciseType: Enum of all 6 exercise types
 * - ExerciseConfig: Configuration for each exercise type
 * - ExerciseSession: Runtime state for active exercise session
 * - Exercise-specific data types: BreathingData, GroundingData, etc.
 */

// ============================================================================
// ENUMS
// ============================================================================

/**
 * Exercise Types
 * Maps to database enum: exercise_type
 */
export enum ExerciseType {
  CYCLIC_SIGH = 'breathing',
  GROUNDING_5_4_3_2_1 = 'grounding',
  BREATHING_4_7_8 = 'breathing',
  EMOTION_WHEEL = 'cognitive_reframe',
  BRAIN_DUMP = 'brain_dump',
  MIND_CLEAR = 'cognitive_reframe',
}

/**
 * Exercise Categories (UI grouping)
 */
export enum ExerciseCategory {
  BREATHING = 'breathing',
  SENSORY = 'sensory',
  COGNITIVE = 'cognitive',
  EXPRESSIVE = 'expressive',
  MINDFULNESS = 'mindfulness',
}

/**
 * Exercise Stage
 * Linear flow: PRE_RATING → INSTRUCTIONS → EXERCISE → POST_RATING → TRIGGER_LOG → COMPLETE
 */
export enum ExerciseStage {
  PRE_RATING = 'pre_rating',
  INSTRUCTIONS = 'instructions',
  EXERCISE = 'exercise',
  POST_RATING = 'post_rating',
  TRIGGER_LOG = 'trigger_log',
  COMPLETE = 'complete',
}

/**
 * Completion Status
 * Maps to database enum: completion_status
 */
export enum CompletionStatus {
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  ABANDONED = 'abandoned',
  SKIPPED = 'skipped',
}

/**
 * Module Context
 * Maps to database enum: fire_module
 */
export enum ModuleContext {
  FOCUS = 'focus',
  INTERRUPT = 'interrupt',
  REFRAME = 'reframe',
  EXECUTE = 'execute',
  STANDALONE = 'standalone',
  AI_ANNA = 'ai_anna',
  SUGGESTION = 'suggestion',
}

// ============================================================================
// CONFIGURATION TYPES
// ============================================================================

/**
 * Exercise Configuration
 * Static config for each exercise type (stored in /constants/exerciseConfigs.ts)
 */
export interface ExerciseConfig {
  // Identification
  type: ExerciseType;
  category: ExerciseCategory;
  title: string;
  shortTitle: string;
  description: string;

  // Instructions
  instructions: string[];
  tips?: string[];

  // Duration
  duration: {
    min: number; // seconds
    max: number; // seconds
    default: number; // seconds
  };

  // Stage configuration
  stages: {
    requirePreRating: boolean;
    requirePostRating: boolean;
    requireTriggerLog: boolean;
    showInstructions: boolean;
    allowSkip: boolean;
    allowPause: boolean;
  };

  // Cialdini persuasion hooks
  persuasion?: {
    authorityBadge?: string; // e.g., "Stanford-tested"
    socialProof?: string; // e.g., "10,247 people used this today"
    preCommitment?: string; // e.g., "Just 60 seconds"
  };

  // Copy (from Ogilvy)
  copy: {
    headline: string;
    subheadline: string;
    ctaStart: string;
    ctaComplete: string;
    completionMessage: string;
  };

  // Accessibility
  accessibility: {
    hapticFeedback: boolean;
    voiceoverLabels: Record<string, string>;
    screenReaderAnnouncements: string[];
  };

  // Analytics
  analytics: {
    eventPrefix: string; // e.g., "CYCLIC_SIGH"
    trackCycleCompletion?: boolean;
    trackAbandonmentPoint: boolean;
  };
}

// ============================================================================
// SESSION TYPES
// ============================================================================

/**
 * Exercise Session
 * Runtime state for an active exercise session
 */
export interface ExerciseSession {
  // Session identification
  sessionId: string; // UUID
  logId?: string; // Database log_id (once inserted)

  // User & context
  userId: string;
  exerciseType: ExerciseType;
  moduleContext: ModuleContext;
  moduleScreen?: string;

  // Timing
  startedAt: string; // ISO timestamp
  completedAt?: string; // ISO timestamp
  currentStageDuration: number; // seconds in current stage
  totalDuration: number; // seconds total

  // Current state
  currentStage: ExerciseStage;
  completionStatus: CompletionStatus;

  // Ratings
  preRating: number | null; // 1-10
  postRating: number | null; // 1-10

  // Trigger
  trigger?: TriggerData;

  // Exercise-specific data
  exerciseData: ExerciseData;

  // Progress tracking
  progress: ProgressData;

  // Flags
  isPaused: boolean;
  canResume: boolean;
}

/**
 * Trigger Data
 */
export interface TriggerData {
  category?: string; // From exercise_triggers table
  customText?: string; // User's own description
  timestamp: string; // ISO timestamp
}

/**
 * Progress Data
 * Generic progress tracking for all exercises
 */
export interface ProgressData {
  currentStep: number;
  totalSteps: number;
  percentage: number; // 0-100
  abandonedAtPercentage?: number; // If abandoned, at what %
}

// ============================================================================
// EXERCISE-SPECIFIC DATA TYPES
// ============================================================================

/**
 * Exercise Data (union type)
 */
export type ExerciseData =
  | BreathingData
  | GroundingData
  | EmotionWheelData
  | BrainDumpData
  | MindClearData;

/**
 * Breathing Exercise Data
 * For: Cyclic Sigh, 4-7-8, Box Breathing
 */
export interface BreathingData {
  type: 'breathing';
  protocol: 'cyclic-sigh' | '4-7-8' | 'box' | 'coherence';
  targetCycles: number;
  completedCycles: number;
  currentPhase: 'inhale' | 'hold' | 'exhale' | 'rest';
  breathDurations: {
    inhale: number; // seconds
    hold?: number; // seconds (optional for cyclic sigh)
    exhale: number; // seconds
    rest?: number; // seconds (optional between cycles)
  };
  cycleHistory: {
    cycleNumber: number;
    startedAt: string;
    completedAt: string;
    durationSeconds: number;
  }[];
}

/**
 * Grounding Exercise Data (5-4-3-2-1)
 */
export interface GroundingData {
  type: 'grounding';
  senses: {
    see: {
      target: 5;
      identified: number;
      items: string[];
    };
    touch: {
      target: 4;
      identified: number;
      items: string[];
    };
    hear: {
      target: 3;
      identified: number;
      items: string[];
    };
    smell: {
      target: 2;
      identified: number;
      items: string[];
    };
    taste: {
      target: 1;
      identified: number;
      items: string[];
    };
  };
  currentSense: 'see' | 'touch' | 'hear' | 'smell' | 'taste';
  totalIdentified: number;
  totalTarget: 15; // 5+4+3+2+1
}

/**
 * Emotion Wheel Exercise Data
 */
export interface EmotionWheelData {
  type: 'emotion';
  selectedEmotions: {
    primary: string; // e.g., "Anger"
    secondary: string; // e.g., "Frustration"
    tertiary?: string; // e.g., "Annoyed"
    intensity: number; // 1-10
    timestamp: string;
  }[];
  dominantEmotion?: string;
  emotionFamily?: string; // "Fear", "Anger", "Sadness", etc.
  notes?: string; // Optional reflection
}

/**
 * Brain Dump Exercise Data
 * PRIVACY: Never store actual journal content, only metadata
 */
export interface BrainDumpData {
  type: 'brain_dump';
  wordCount: number;
  sessionDuration: number; // seconds
  autoSaveCount: number; // How many times auto-saved locally
  estimatedReduction?: number; // Self-reported feeling after
  // NOTE: Actual text stored in AsyncStorage ONLY, never synced
}

/**
 * Mind Clear Exercise Data
 * Similar to Brain Dump but structured
 */
export interface MindClearData {
  type: 'mind_clear';
  thoughtCategories: {
    category: 'worry' | 'task' | 'memory' | 'decision' | 'other';
    count: number;
    cleared: boolean;
  }[];
  totalThoughts: number;
  clearedThoughts: number;
  focusScore: number; // 1-10, self-reported after
}

// ============================================================================
// RATING TYPES
// ============================================================================

/**
 * Anxiety Rating
 * 1-10 scale with labels
 */
export interface AnxietyRating {
  value: number; // 1-10
  label: string; // "Calm", "Moderate", "Intense", etc.
  timestamp: string;
}

/**
 * Rating Scale Config
 */
export const ANXIETY_SCALE: Record<number, string> = {
  1: 'Completely calm',
  2: 'Very relaxed',
  3: 'Mostly calm',
  4: 'Slightly tense',
  5: 'Moderately anxious',
  6: 'Noticeably anxious',
  7: 'Very anxious',
  8: 'Severely anxious',
  9: 'Extremely anxious',
  10: 'Panic level',
};

// ============================================================================
// COMPONENT PROP TYPES
// ============================================================================

/**
 * ExerciseContainer Props
 */
export interface ExerciseContainerProps {
  config: ExerciseConfig;
  session: ExerciseSession;
  onUpdateSession: (updates: Partial<ExerciseSession>) => void;
  onComplete: () => void;
  onAbandon: () => void;
}

/**
 * PrePostRatingCard Props
 */
export interface PrePostRatingCardProps {
  type: 'pre' | 'post';
  currentRating: number | null;
  onRatingSelect: (rating: number) => void;
  onContinue: () => void;
  showComparison?: boolean;
  comparisonRating?: number;
}

/**
 * BreathingAnimation Props
 */
export interface BreathingAnimationProps {
  protocol: BreathingData['protocol'];
  phase: BreathingData['currentPhase'];
  cycleNumber: number;
  totalCycles: number;
  onCycleComplete: () => void;
  isPaused: boolean;
}

/**
 * TriggerLogCard Props
 */
export interface TriggerLogCardProps {
  triggers: TriggerOption[];
  selectedTrigger?: string;
  customText?: string;
  onSelectTrigger: (category: string) => void;
  onCustomTextChange: (text: string) => void;
  onContinue: () => void;
  onSkip: () => void;
}

/**
 * CompletionScreen Props
 */
export interface CompletionScreenProps {
  preRating: number;
  postRating: number;
  reduction: number;
  reductionPercentage: number;
  duration: number; // seconds
  exerciseTitle: string;
  completionMessage: string;
  onContinue: () => void;
  onReturnHome: () => void;
  showSocialProof?: boolean;
  socialProofCount?: number;
}

// ============================================================================
// DATABASE MAPPING TYPES
// ============================================================================

/**
 * Exercise Log Insert
 * Data structure for inserting into exercise_logs table
 */
export interface ExerciseLogInsert {
  user_id: string;
  exercise_type: ExerciseType;
  exercise_name: string;
  module_context: ModuleContext;
  fire_module_screen?: string;
  completion_status: CompletionStatus;
  started_at: string;
  completed_at?: string;
  duration_seconds?: number;
  pre_anxiety_rating?: number;
  post_anxiety_rating?: number;
  trigger_text?: string;
  trigger_category?: string;
  abandoned_at_percentage?: number;
  skip_reason?: string;
  exercise_data?: Record<string, any>;
  device_type?: 'ios' | 'android' | 'web';
  app_version?: string;
}

/**
 * Exercise Log (from database)
 */
export interface ExerciseLog extends ExerciseLogInsert {
  log_id: string;
  anxiety_reduction: number | null;
  reduction_percentage: number | null;
  is_deleted: boolean;
  deleted_at?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Trigger Option (from exercise_triggers table)
 */
export interface TriggerOption {
  trigger_id: string;
  trigger_name: string;
  trigger_category: string;
  display_order: number;
  loop_type: string;
}

// ============================================================================
// ANALYTICS EVENT TYPES
// ============================================================================

/**
 * Exercise Analytics Events
 */
export interface ExerciseAnalyticsEvent {
  event: string;
  properties: {
    exercise_type: ExerciseType;
    exercise_name: string;
    module_context: ModuleContext;
    duration?: number;
    completed?: boolean;
    abandoned_at_percentage?: number;
    pre_rating?: number;
    post_rating?: number;
    reduction?: number;
    reduction_percentage?: number;
    [key: string]: any;
  };
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Stage Transition
 */
export type StageTransition = {
  from: ExerciseStage;
  to: ExerciseStage;
  timestamp: string;
  durationInPreviousStage: number; // seconds
};

/**
 * Exercise History Item
 */
export interface ExerciseHistoryItem {
  log_id: string;
  exercise_type: ExerciseType;
  exercise_name: string;
  completed_at: string;
  duration_seconds: number;
  pre_anxiety_rating: number;
  post_anxiety_rating: number;
  reduction: number;
  reduction_percentage: number;
}

/**
 * Exercise Stats (from materialized view)
 */
export interface ExerciseStats {
  user_id: string;
  exercise_type: ExerciseType;
  total_sessions: number;
  completed_count: number;
  abandoned_count: number;
  skipped_count: number;
  completion_rate: number; // percentage
  avg_pre_anxiety: number;
  avg_post_anxiety: number;
  avg_anxiety_reduction: number;
  avg_reduction_percentage: number;
  avg_duration_completed: number; // seconds
  avg_abandonment_point: number; // percentage
  last_completed_at: string;
  completions_last_7_days: number;
  completions_last_30_days: number;
}

// ============================================================================
// HELPER FUNCTIONS (Type Guards)
// ============================================================================

/**
 * Type guard: Check if ExerciseData is BreathingData
 */
export function isBreathingData(data: ExerciseData): data is BreathingData {
  return data.type === 'breathing';
}

/**
 * Type guard: Check if ExerciseData is GroundingData
 */
export function isGroundingData(data: ExerciseData): data is GroundingData {
  return data.type === 'grounding';
}

/**
 * Type guard: Check if ExerciseData is EmotionWheelData
 */
export function isEmotionWheelData(data: ExerciseData): data is EmotionWheelData {
  return data.type === 'emotion';
}

/**
 * Type guard: Check if ExerciseData is BrainDumpData
 */
export function isBrainDumpData(data: ExerciseData): data is BrainDumpData {
  return data.type === 'brain_dump';
}

/**
 * Type guard: Check if ExerciseData is MindClearData
 */
export function isMindClearData(data: ExerciseData): data is MindClearData {
  return data.type === 'mind_clear';
}

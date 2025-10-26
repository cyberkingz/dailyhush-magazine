/**
 * DailyHush - Quiz Flow Constants
 * Centralized configuration for quiz onboarding flow
 */

/**
 * Quiz flow stages - determines which content to show
 */
export enum QuizFlowStage {
  /** Taking the quiz questions */
  IN_PROGRESS = 'in_progress',
  /** Quiz complete, awaiting account creation */
  AWAITING_SIGNUP = 'awaiting_signup',
  /** Account created, results can be revealed */
  RESULTS_UNLOCKED = 'results_unlocked',
  /** Full onboarding complete */
  COMPLETED = 'completed',
}

/**
 * Storage keys for quiz data persistence
 */
export const QUIZ_STORAGE_KEYS = {
  /** Current quiz progress */
  PROGRESS: 'quiz_progress',
  /** Completed quiz results (stored until account creation) */
  PENDING_RESULTS: 'quiz_pending_results',
  /** User's quiz flow stage */
  FLOW_STAGE: 'quiz_flow_stage',
} as const;

/**
 * Quiz result reveal configuration
 */
export const QUIZ_REVEAL_CONFIG = {
  /** Delay before showing results after signup (ms) */
  REVEAL_DELAY: 800,
  /** Animation duration for reveal (ms) */
  ANIMATION_DURATION: 600,
  /** Teaser text shown before signup */
  TEASER_TITLE: 'Your Results Are Ready! 🎉',
  TEASER_DESCRIPTION: 'Create your account to discover your unique overthinking type and unlock personalized strategies.',
} as const;

/**
 * Quiz routing paths
 */
export const QUIZ_ROUTES = {
  /** Main quiz screen */
  QUIZ: '/onboarding/quiz',
  /** Account creation before results reveal */
  SIGNUP_FOR_RESULTS: '/onboarding/quiz/signup',
  /** Results reveal screen */
  RESULTS: '/onboarding/quiz/results',
} as const;

/**
 * Quiz completion thresholds
 */
export const QUIZ_VALIDATION = {
  /** Minimum number of questions required */
  MIN_QUESTIONS: 10,
  /** Maximum allowed score */
  MAX_SCORE: 100,
  /** Minimum score for valid results */
  MIN_SCORE: 0,
} as const;

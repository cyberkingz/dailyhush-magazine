/**
 * DailyHush Mobile App - TypeScript Type Definitions
 * Based on PRD Section 7.3: Data Architecture
 */

/**
 * User Profile
 * Stores user settings, preferences, and onboarding data
 */
export interface UserProfile {
  user_id: string;
  email: string;
  age?: number;
  quiz_score?: number; // 1-10 from Overthinking Quiz
  has_shift_necklace: boolean;
  shift_paired: boolean;
  onboarding_completed: boolean;
  fire_progress: {
    focus: boolean;
    interrupt: boolean;
    reframe: boolean;
    execute: boolean;
  };
  triggers: string[]; // e.g., ["conversations", "health"]
  peak_spiral_time?: string; // e.g., "03:00"
  created_at: string;
  updated_at: string;
}

/**
 * Spiral Log
 * Records each rumination spiral and intervention
 */
export interface SpiralLog {
  spiral_id: string;
  user_id: string;
  timestamp: string; // ISO datetime
  trigger?: string;
  duration_seconds: number;
  interrupted: boolean;
  pre_feeling: number; // 1-10 scale
  post_feeling: number; // 1-10 scale
  used_shift: boolean;
  technique_used: string; // "breathing", "5-4-3-2-1", "naming"
  location?: string; // "home", "work", etc.
  notes?: string;
}

/**
 * Pattern Insights
 * Weekly aggregated analytics about user's rumination patterns
 */
export interface PatternInsights {
  user_id: string;
  week_start: string; // ISO date
  total_spirals: number;
  spirals_prevented: number;
  avg_duration_seconds: number;
  most_common_trigger: string;
  peak_time: string; // e.g., "03:00"
  improvement_vs_last_week: number; // percentage
  insights: string[]; // e.g., ["You spiral less after exercise"]
}

/**
 * F.I.R.E. Protocol Modules
 * Training content and progress
 */
export enum FireModule {
  FOCUS = 'focus',
  INTERRUPT = 'interrupt',
  REFRAME = 'reframe',
  EXECUTE = 'execute',
}

export interface FireModuleContent {
  module: FireModule;
  title: string;
  description: string;
  video_url: string;
  duration_minutes: number;
  exercises: Exercise[];
  unlocks: string[]; // Features unlocked upon completion
}

export interface Exercise {
  exercise_id: string;
  title: string;
  description: string;
  type: 'video' | 'interactive' | 'worksheet';
  content: string;
  duration_minutes: number;
  completed: boolean;
}

/**
 * Spiral Intervention Protocols
 * Different techniques for interrupting rumination
 */
export enum InterventionTechnique {
  BREATHING = 'breathing',
  GROUNDING_5_4_3_2_1 = '5-4-3-2-1',
  SPIRAL_NAMING = 'naming',
  BODY_SCAN = 'body-scan',
  WORRY_POSTPONEMENT = 'worry-postponement',
}

export interface InterventionProtocol {
  technique: InterventionTechnique;
  name: string;
  description: string;
  duration_seconds: number;
  audio_file: string; // Path to guided audio
  steps: ProtocolStep[];
  best_for: string[]; // e.g., ["evening spirals", "3AM wake-ups"]
}

export interface ProtocolStep {
  step_number: number;
  instruction: string;
  duration_seconds: number;
  haptic_feedback?: boolean; // Vibrate phone or Shift necklace
}

/**
 * The Shift Necklace Integration
 * Bluetooth device management
 */
export interface ShiftDevice {
  device_id: string;
  name: string;
  is_connected: boolean;
  battery_level?: number;
  last_sync: string; // ISO datetime
  firmware_version?: string;
}

export interface ShiftUsageLog {
  log_id: string;
  user_id: string;
  device_id: string;
  timestamp: string;
  duration_seconds: number;
  breath_count: number;
  avg_breath_duration: number;
  heart_rate_before?: number;
  heart_rate_after?: number;
}

/**
 * 3AM Mode Settings
 * Nighttime-specific preferences
 */
export interface NightModeSettings {
  enabled: boolean;
  auto_detect: boolean; // Auto-enable between 10PM-6AM
  start_time: string; // e.g., "22:00"
  end_time: string; // e.g., "06:00"
  red_light_mode: boolean; // True = red tint, false = dark mode
  sleep_tracking: boolean;
  fall_back_asleep_protocol: boolean;
}

/**
 * Voice Journal Entry
 * For 3AM voice notes
 */
export interface VoiceJournal {
  journal_id: string;
  user_id: string;
  timestamp: string;
  audio_file: string; // Local file path
  transcription?: string;
  duration_seconds: number;
  tags?: string[];
  deleted_at?: string; // Soft delete after 90 days
}

/**
 * Subscription Status
 * Premium features access
 */
export enum SubscriptionTier {
  FREE = 'free',
  MONTHLY = 'monthly',
  ANNUAL = 'annual',
}

export interface Subscription {
  user_id: string;
  tier: SubscriptionTier;
  status: 'active' | 'past_due' | 'canceled' | 'trialing';
  current_period_start: string;
  current_period_end: string;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  trial_end?: string;
}

/**
 * App State (Global State Management)
 */
export interface AppState {
  user: UserProfile | null;
  subscription: Subscription | null;
  shift_device: ShiftDevice | null;
  is_spiraling: boolean;
  night_mode_active: boolean;
  current_protocol: InterventionProtocol | null;
  loading: boolean;
  error: string | null;
}

/**
 * Navigation Types for Expo Router
 */
export type RootStackParamList = {
  '(tabs)': undefined;
  'onboarding': undefined;
  'spiral': undefined;
  'training/[module]': { module: FireModule };
  'insights': undefined;
  'settings': undefined;
  'shift-pairing': undefined;
};

/**
 * Component Props
 */
export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  accessibilityLabel?: string;
}

export interface CardProps {
  title?: string;
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'default' | 'elevated' | 'outlined';
  accessibilityLabel?: string;
}

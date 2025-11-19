/**
 * Nœma - Analytics Utilities
 *
 * Privacy-first event tracking with PostHog
 *
 * IMPORTANT PRIVACY GUIDELINES:
 * - NEVER track sensitive data (mood notes, journal entries, personal thoughts)
 * - NEVER track PII (email, phone, address) - only use hashed user IDs
 * - DO track: user actions, feature usage, conversion funnels
 * - Always anonymize data where possible
 */

import { usePostHog } from 'posthog-react-native';
import type { LoopType, OverthinkerType } from '@/data/quizQuestions';

/**
 * JSON-serializable value type for analytics properties
 */


/**
 * Analytics Events
 * All events we track in the app
 */
export const AnalyticsEvents = {
  // Onboarding
  ONBOARDING_STARTED: 'onboarding_started',
  ONBOARDING_COMPLETED: 'onboarding_completed',
  QUIZ_STARTED: 'quiz_started',
  QUIZ_COMPLETED: 'quiz_completed',
  PROFILE_SETUP_COMPLETED: 'profile_setup_completed',

  // Authentication
  SIGNUP_STARTED: 'signup_started',
  SIGNUP_COMPLETED: 'signup_completed',
  LOGIN_COMPLETED: 'login_completed',
  LOGOUT: 'logout',

  // Paywall & Subscriptions
  PAYWALL_VIEWED: 'paywall_viewed',
  SUBSCRIPTION_SELECTED: 'subscription_selected',
  TRIAL_STARTED: 'trial_started',
  SUBSCRIPTION_PURCHASED: 'subscription_purchased',
  SUBSCRIPTION_CANCELLED: 'subscription_cancelled',

  // Check-ins
  CHECKIN_STARTED: 'checkin_started',
  CHECKIN_COMPLETED: 'checkin_completed',
  STREAK_MILESTONE: 'streak_milestone',

  // Features
  TRAINING_STARTED: 'training_started',
  TRAINING_COMPLETED: 'training_completed',
  SPIRAL_STARTED: 'spiral_started',
  SPIRAL_INTERRUPTED: 'spiral_interrupted',

  // Anna AI Therapy
  SPIRAL_CHOICE_ANNA: 'spiral_choice_anna',
  SPIRAL_CHOICE_PROTOCOL: 'spiral_choice_protocol',
  ANNA_CONVERSATION_STARTED: 'anna_conversation_started',
  ANNA_CONVERSATION_ENDED: 'anna_conversation_ended',
  ANNA_MESSAGE_SENT: 'anna_message_sent',
  ANNA_EXERCISE_TRIGGERED: 'anna_exercise_triggered',
  ANNA_EXERCISE_COMPLETED: 'anna_exercise_completed',
  ANNA_CONVERSATION_BACK: 'anna_conversation_back',
  SPIRAL_COMPLETED_FROM_ANNA: 'spiral_completed_from_anna',

  // Exercise System (New)
  EXERCISE_STARTED: 'exercise_started',
  EXERCISE_COMPLETED: 'exercise_completed',
  EXERCISE_ABANDONED: 'exercise_abandoned',
  EXERCISE_SKIPPED: 'exercise_skipped',
  EXERCISE_STAGE_TRANSITION: 'exercise_stage_transition',
  EXERCISE_CYCLE_COMPLETED: 'exercise_cycle_completed',
  EXERCISE_RATING_PRE: 'exercise_rating_pre',
  EXERCISE_RATING_POST: 'exercise_rating_post',
  EXERCISE_TRIGGER_LOGGED: 'exercise_trigger_logged',
  EXERCISE_PAUSED: 'exercise_paused',
  EXERCISE_RESUMED: 'exercise_resumed',

  // Profile
  PROFILE_VIEWED: 'profile_viewed',
  SETTINGS_UPDATED: 'settings_updated',

  // Insights
  INSIGHT_VIEWED: 'insight_viewed',
  INSIGHT_DISMISSED: 'insight_dismissed',
} as const;

/**
 * Analytics Properties
 * Common properties for events
 */
export type AnalyticsProperties = {
  // User context (non-PII)
  loop_type?: LoopType;
  overthinker_type?: OverthinkerType;
  is_premium?: boolean;

  // Subscription context
  subscription_plan?: 'monthly' | 'annual' | 'lifetime';
  subscription_price?: number;
  is_trial?: boolean;

  // Feature usage
  feature_name?: string;
  screen_name?: string;

  // Milestones
  streak_count?: number;
  checkin_count?: number;

  // Funnels
  source?: string;
  step?: number;

  // Anna AI Therapy

  pre_feeling?: number;
  pre_feeling_score?: number;
  post_feeling?: number;
  post_feeling_score?: number;
  message_length?: number;
  message_count?: number;
  reduction?: number;
  trigger?: string;
  technique_id?: string;
  technique_name?: string;
  confidence?: number;

  // Module Selection
  module_id?: string;
  module_name?: string;
  module_count?: number;
  method_id?: string;
  method_title?: string;
  duration?: string;
  is_recommended?: boolean;
  is_urgent?: boolean;
  available_methods?: number;

  // Exercise System (New)
  exercise_type?: string;
  exercise_name?: string;
  exercise_category?: string;
  completion_status?: 'completed' | 'abandoned' | 'skipped';
  session_id?: string;
  stage?: string;
  from_stage?: string;
  to_stage?: string;
  cycle_number?: number;
  total_cycles?: number;
  pre_anxiety_rating?: number;
  post_anxiety_rating?: number;
  anxiety_reduction?: number;
  reduction_percentage?: number;
  duration_seconds?: number;
  trigger_category?: string;
  trigger_text?: string;
  abandoned_at_percentage?: number;
  skip_reason?: string;
  device_type?: 'ios' | 'android' | 'web';
  app_version?: string;
};

/**
 * Hook to track analytics events
 * Usage: const analytics = useAnalytics()s
 */
export function useAnalytics() {
  const posthog = usePostHog();

  /**
   * Track a custom event
   */
  const track = (
    event: keyof typeof AnalyticsEvents | string,
    properties?: AnalyticsProperties
  ) => {
    try {
      const eventName = typeof event === 'string' ? event : AnalyticsEvents[event];
      posthog.capture(eventName, properties);

      if (__DEV__) {
        console.log('[Analytics]', eventName, properties);
      }
    } catch (error) {
      console.error('[Analytics] Error tracking event:', error);
    }
  };

  /**
   * Identify a user (call after authentication)
   * NOTE: Use hashed/anonymized user ID, not email or PII
   */
  const identify = (
    userId: string,
    properties?: {
      loop_type?: LoopType;
      is_premium?: boolean;
      created_at?: string;
    }
  ) => {
    try {
      posthog.identify(userId, properties);

      if (__DEV__) {
        console.log('[Analytics] Identified user:', userId);
      }
    } catch (error) {
      console.error('[Analytics] Error identifying user:', error);
    }
  };

  /**
   * Track screen view
   */
  const screenView = (screenName: string, properties?: AnalyticsProperties) => {
    try {
      posthog.screen(screenName, properties);

      if (__DEV__) {
        console.log('[Analytics] Screen view:', screenName);
      }
    } catch (error) {
      console.error('[Analytics] Error tracking screen view:', error);
    }
  };

  /**
   * Reset analytics (call on logout)
   */
  const reset = () => {
    try {
      posthog.reset();

      if (__DEV__) {
        console.log('[Analytics] Reset');
      }
    } catch (error) {
      console.error('[Analytics] Error resetting:', error);
    }
  };

  return {
    track,
    identify,
    screenView,
    reset,
  };
}

/**
 * Standalone functions for tracking (when hook can't be used)
 */
export const analytics = {
  /**
   * Track onboarding events
   */
  onboarding: {
    started: () => ({
      event: AnalyticsEvents.ONBOARDING_STARTED,
    }),
    completed: (loopType: LoopType, overthinkerType: OverthinkerType) => ({
      event: AnalyticsEvents.ONBOARDING_COMPLETED,
      properties: { loop_type: loopType, overthinker_type: overthinkerType },
    }),
  },

  /**
   * Track subscription events
   */
  subscription: {
    viewed: (loopType: LoopType, source?: string) => ({
      event: AnalyticsEvents.PAYWALL_VIEWED,
      properties: { loop_type: loopType, source },
    }),
    selected: (plan: 'monthly' | 'annual' | 'lifetime', price: number) => ({
      event: AnalyticsEvents.SUBSCRIPTION_SELECTED,
      properties: { subscription_plan: plan, subscription_price: price },
    }),
    purchased: (plan: 'monthly' | 'annual' | 'lifetime', isTrial: boolean) => ({
      event: AnalyticsEvents.SUBSCRIPTION_PURCHASED,
      properties: { subscription_plan: plan, is_trial: isTrial },
    }),
  },

  /**
   * Track check-in events
   */
  checkin: {
    completed: (streakCount: number, checkinCount: number) => ({
      event: AnalyticsEvents.CHECKIN_COMPLETED,
      properties: { streak_count: streakCount, checkin_count: checkinCount },
    }),
    milestone: (streakCount: number) => ({
      event: AnalyticsEvents.STREAK_MILESTONE,
      properties: { streak_count: streakCount },
    }),
  },
};

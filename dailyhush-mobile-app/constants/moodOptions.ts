/**
 * DailyHush - Mood Options & Writing Prompts
 *
 * Therapeutic mood options and gentle writing prompts for mood capture flow.
 * Designed for women 55-70 with compassionate, non-clinical language.
 *
 * @see MOOD_CAPTURE_ROADMAP.md
 */

import { colors } from './colors';
import type { Enums } from '@/types/supabase';

// ============================================================================
// MOOD OPTIONS
// ============================================================================

export interface MoodOption {
  /** Database enum value */
  id: Enums<'mood_type'>;
  /** User-facing label */
  label: string;
  /** Emoji representation */
  emoji: string;
  /** Brief description of the mood */
  description: string;
  /** Associated color from emerald palette */
  color: string;
}

/**
 * Five core mood options for Step 1
 * Covers the emotional spectrum therapeutically
 */
export const MOOD_OPTIONS: readonly MoodOption[] = [
  {
    id: 'calm',
    emoji: '😊',
    label: 'Calm & Content',
    description: 'Feeling peaceful and at ease',
    color: colors.emerald[600], // #059669
  },
  {
    id: 'anxious',
    emoji: '😰',
    label: 'Anxious & Worried',
    description: 'Mind feels restless and concerned',
    color: colors.emerald[700], // #047857
  },
  {
    id: 'sad',
    emoji: '😔',
    label: 'Sad & Heavy',
    description: 'Feeling down or melancholy',
    color: colors.emerald[500], // #10B981
  },
  {
    id: 'frustrated',
    emoji: '😤',
    label: 'Frustrated & Restless',
    description: 'Feeling agitated or irritable',
    color: colors.emerald[400], // #34D399
  },
  {
    id: 'mixed',
    emoji: '🌤️',
    label: 'Mixed Feelings',
    description: 'Experiencing multiple emotions',
    color: colors.emerald[300], // #6EE7B7
  },
] as const;

/**
 * Helper to get mood option by ID
 */
export function getMoodOption(id: Enums<'mood_type'>): MoodOption | undefined {
  return MOOD_OPTIONS.find((mood) => mood.id === id);
}

/**
 * Helper to get mood emoji by ID
 */
export function getMoodEmoji(id: Enums<'mood_type'>): string {
  return getMoodOption(id)?.emoji ?? '😊';
}

/**
 * Helper to get mood label by ID
 */
export function getMoodLabel(id: Enums<'mood_type'>): string {
  return getMoodOption(id)?.label ?? 'Calm & Content';
}

// ============================================================================
// INTENSITY LABELS
// ============================================================================

/**
 * Labels for 10-point intensity scale (Step 2)
 */
export const INTENSITY_LABELS = {
  1: 'Very Mild',
  2: 'Mild',
  3: 'Light',
  4: 'Moderate',
  5: 'Noticeable',
  6: 'Notable',
  7: 'Strong',
  8: 'Very Strong',
  9: 'Intense',
  10: 'Extreme',
} as const;

/**
 * Get intensity label by value
 */
export function getIntensityLabel(intensity: number): string {
  if (intensity < 1 || intensity > 10) {
    return 'Moderate';
  }
  return INTENSITY_LABELS[intensity as keyof typeof INTENSITY_LABELS];
}

// ============================================================================
// WRITING PROMPTS
// ============================================================================

export interface WritingPrompt {
  id: string;
  text: string;
  /** Which moods this prompt is most relevant for */
  relevantMoods?: readonly Enums<'mood_type'>[];
}

/**
 * Gentle writing prompts for Step 3
 * These are tap-to-insert starters to help users begin journaling
 */
export const WRITING_PROMPTS: readonly WritingPrompt[] = [
  {
    id: 'because',
    text: "Today I'm feeling this way because...",
    relevantMoods: ['anxious', 'sad', 'frustrated'],
  },
  {
    id: 'weighing',
    text: "What's weighing on me is...",
    relevantMoods: ['anxious', 'sad', 'mixed'],
  },
  {
    id: 'grateful',
    text: "I'm grateful for...",
    relevantMoods: ['calm', 'mixed'],
  },
  {
    id: 'wish',
    text: 'I wish I could...',
    relevantMoods: ['sad', 'frustrated', 'mixed'],
  },
  {
    id: 'helped',
    text: 'What helped me today was...',
    relevantMoods: ['calm', 'anxious'],
  },
  {
    id: 'noticing',
    text: "I'm noticing that...",
    relevantMoods: ['calm', 'anxious', 'mixed'],
  },
  {
    id: 'need',
    text: 'Right now, I need...',
    relevantMoods: ['anxious', 'sad', 'frustrated'],
  },
  {
    id: 'comfort',
    text: 'What brings me comfort is...',
    relevantMoods: ['calm', 'sad'],
  },
] as const;

/**
 * Get relevant prompts for a specific mood
 * Returns all prompts if no mood specified
 */
export function getPromptsForMood(
  moodId?: Enums<'mood_type'>
): readonly WritingPrompt[] {
  if (!moodId) {
    return WRITING_PROMPTS;
  }

  // Filter prompts that are relevant to the mood, or have no mood restriction
  const relevant = WRITING_PROMPTS.filter(
    (prompt) =>
      !prompt.relevantMoods || prompt.relevantMoods.includes(moodId)
  );

  // Return at least 3 prompts, even if not all are perfectly relevant
  return relevant.length >= 3 ? relevant : WRITING_PROMPTS.slice(0, 5);
}

// ============================================================================
// PRIVACY & REASSURANCE MESSAGES
// ============================================================================

/**
 * Privacy messages shown during mood capture
 */
export const PRIVACY_MESSAGES = {
  /** Shown in Step 3 (writing) */
  encrypted: '🔒 Your thoughts are private and encrypted',

  /** Shown during auto-save */
  saving: 'Your thoughts are being saved...',

  /** Shown after successful save */
  saved: 'Saved',

  /** Shown in confirmation dialogs */
  draftPrompt:
    'We found an unsaved draft from earlier. Would you like to restore it?',
} as const;

/**
 * Reassuring subtitle messages for each step
 */
export const STEP_SUBTITLES = {
  step1: "Take your time. There's no rush.",
  step2: 'Your feelings matter, however intense they may be.',
  step3: 'Share as much or as little as you\'d like.',
  step4: 'A gentle suggestion, just for you.',
} as const;

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type MoodId = typeof MOOD_OPTIONS[number]['id'];
export type IntensityValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export type PromptId = typeof WRITING_PROMPTS[number]['id'];

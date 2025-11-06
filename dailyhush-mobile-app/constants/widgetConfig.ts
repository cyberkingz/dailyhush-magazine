/**
 * Mood Widget Configuration
 *
 * Central configuration for the inline mood logging widget.
 * All values are configurable via props to support theming and customization.
 *
 * @module constants/widgetConfig
 */

import type {
  WidgetConfig,
  MoodOption,
  AnimationConfig,
  DimensionConfig,
  FeatureConfig,
  MoodSelectorConfig,
  IntensitySliderConfig,
  QuickNotesConfig,
  SuccessConfig,
} from '@/types/widget.types';
import { colors } from './colors';
import { SPACING } from './designTokens';
import { Sun, CloudRain, CloudDrizzle, CloudLightning, Cloudy } from 'lucide-react-native';

// ============================================================================
// MOOD OPTIONS
// ============================================================================

/**
 * Available mood choices with display metadata
 * Matches emotional_weather enum in database
 * Uses weather-themed Lucide icons for high-quality visuals
 */
export const MOOD_OPTIONS: MoodOption[] = [
  {
    value: 'calm',
    label: 'Calm',
    emoji: '😊', // Kept for backward compatibility
    icon: Sun,
    color: colors.lime[400],
    description: 'Feeling peaceful and centered',
  },
  {
    value: 'anxious',
    label: 'Anxious',
    emoji: '😰',
    icon: CloudRain,
    color: colors.status.warning,
    description: 'Feeling worried or nervous',
  },
  {
    value: 'sad',
    label: 'Sad',
    emoji: '😢',
    icon: CloudDrizzle,
    color: colors.text.secondary,
    description: 'Feeling down or blue',
  },
  {
    value: 'frustrated',
    label: 'Frustrated',
    emoji: '😤',
    icon: CloudLightning,
    color: colors.status.error,
    description: 'Feeling irritated or stuck',
  },
  {
    value: 'mixed',
    label: 'Mixed',
    emoji: '😐',
    icon: Cloudy,
    color: colors.text.muted,
    description: 'Feeling a blend of emotions',
  },
];

// ============================================================================
// ANIMATION CONFIGURATION
// ============================================================================

/**
 * Default animation timings and easing
 * All durations in milliseconds
 */
export const DEFAULT_ANIMATION_CONFIG: AnimationConfig = {
  /** Card expansion duration (smooth ease-out) */
  expansionDuration: 300,

  /** Card collapse duration (smooth ease-in) */
  collapseDuration: 400,

  /** Delay between mood choice stagger (creates wave effect) */
  moodStaggerDelay: 50,

  /** Success checkmark animation duration */
  successDuration: 400,

  /** How long to show success before auto-collapse */
  successDisplayDelay: 800,

  /** Content fade in/out duration */
  contentFadeDuration: 200,
};

/**
 * Easing curves for animations
 * Using React Native Reanimated 4 compatible values
 */
export const EASING_CURVES = {
  /** Smooth expansion (bezier curve) */
  expansion: [0.25, 0.1, 0.25, 1] as const,

  /** Smooth collapse */
  collapse: [0.25, 0.1, 0.25, 1] as const,

  /** Quick fade */
  fade: [0.4, 0.0, 0.2, 1] as const,
} as const;

/**
 * Spring configurations for bouncy animations
 */
export const SPRING_CONFIGS = {
  /** Mood selection bounce */
  moodSelection: {
    damping: 12,
    stiffness: 120,
  },

  /** Button bounce */
  buttonBounce: {
    damping: 15,
    stiffness: 100,
  },

  /** Slider snap */
  sliderSnap: {
    damping: 14,
    stiffness: 120,
  },
} as const;

// ============================================================================
// DIMENSION CONFIGURATION
// ============================================================================

/**
 * Default dimensions (responsive per device size)
 * Using existing SPACING constants for consistency
 */
export const DEFAULT_DIMENSION_CONFIG: DimensionConfig = {
  /** Card height when collapsed (showing empty state or weather) */
  collapsedHeight: 360, // Increased for additional breathing room

  /** Card height when expanded (showing mood/intensity/notes) */
  expandedHeight: 500, // Optimized for compact circular intensity dial + continue button

  /** Mood emoji size */
  moodEmojiSize: 48,

  /** Intensity slider width */
  sliderWidth: 280,

  /** Card border radius (matches design system) */
  borderRadius: SPACING.xxl, // 24px

  /** Card padding */
  cardPadding: SPACING.xxl, // 24px
};

/**
 * Responsive dimension overrides
 * Adjusts for small screens (iPhone SE) and large screens (iPad)
 */
export const RESPONSIVE_DIMENSIONS = {
  small: {
    // iPhone SE (375x667)
    collapsedHeight: 280, // Increased from 220
    expandedHeight: 400, // Optimized for vertical pill button layout
    moodEmojiSize: 40,
    sliderWidth: 240,
  },
  large: {
    // iPad (744x1133)
    collapsedHeight: 360, // Increased from 280
    expandedHeight: 480, // Optimized for vertical pill button layout with more space
    moodEmojiSize: 56,
    sliderWidth: 360,
  },
} as const;

// ============================================================================
// FEATURE CONFIGURATION
// ============================================================================

/**
 * Feature flags to enable/disable functionality
 */
export const DEFAULT_FEATURE_CONFIG: FeatureConfig = {
  /** Enable quick notes input stage */
  enableQuickNotes: true,

  /** Enable voice input for notes (future feature) */
  enableVoiceInput: false,

  /** Enable haptic feedback throughout flow */
  enableHaptics: true,

  /** Enable confetti on success (can be performance-heavy) */
  enableConfetti: false,

  /** Enable tap-outside to cancel (recommended for UX) */
  enableTapOutside: true,

  /** Show progress indicators (Step 1 of 3, etc.) */
  showProgress: true,
};

// ============================================================================
// MOOD SELECTOR CONFIGURATION
// ============================================================================

/**
 * Mood selector display configuration
 */
export const DEFAULT_MOOD_SELECTOR_CONFIG: MoodSelectorConfig = {
  /** Available mood choices */
  moods: MOOD_OPTIONS,

  /** Layout: horizontal row is most compact and clear */
  layout: 'horizontal',

  /** Spacing between mood choices */
  spacing: SPACING.md, // 12px

  /** Show mood labels below icons */
  showLabels: true,
};

// ============================================================================
// INTENSITY SLIDER CONFIGURATION
// ============================================================================

/**
 * Intensity slider configuration
 */
export const DEFAULT_INTENSITY_SLIDER_CONFIG: IntensitySliderConfig = {
  /** Intensity range [min, max] (1-7 scale) */
  range: [1, 7],

  /** Show both dots AND numbers for maximum clarity */
  showIndicators: 'both',

  /** Show scale labels (addresses P0 UX finding) */
  showScaleLabels: true,

  /** Disable gesture slider, use tap-to-select buttons only (simpler, no GestureHandlerRootView required) */
  enableGesture: false,

  /** Default intensity value (middle of range) */
  defaultValue: 4,
};

// ============================================================================
// QUICK NOTES CONFIGURATION
// ============================================================================

/**
 * Quick notes input configuration
 */
export const DEFAULT_QUICK_NOTES_CONFIG: QuickNotesConfig = {
  /** Placeholder text */
  placeholder: "What's on your mind? (optional)",

  /** Maximum character length (keep notes brief) */
  maxLength: 200,

  /** Auto-focus when visible (keyboard will show) */
  autoFocus: true,

  /** Show character counter */
  showCounter: true,
};

// ============================================================================
// SUCCESS ANIMATION CONFIGURATION
// ============================================================================

/**
 * Success checkmark animation configuration
 */
export const DEFAULT_SUCCESS_CONFIG: SuccessConfig = {
  /** Checkmark stroke width (bold for visibility) */
  strokeWidth: 4,

  /** Checkmark color (lime for success) */
  color: colors.lime[500],

  /** Show glow effect around checkmark */
  showGlow: true,

  /** Animation duration (ms) */
  duration: 400,

  /** Success message text */
  message: 'Mood logged!',
};

// ============================================================================
// COMPLETE DEFAULT CONFIGURATION
// ============================================================================

/**
 * Complete default widget configuration
 * Can be overridden via props for customization
 */
export const DEFAULT_WIDGET_CONFIG: WidgetConfig = {
  animation: DEFAULT_ANIMATION_CONFIG,
  dimensions: DEFAULT_DIMENSION_CONFIG,
  features: DEFAULT_FEATURE_CONFIG,
  moodSelector: DEFAULT_MOOD_SELECTOR_CONFIG,
  intensitySlider: DEFAULT_INTENSITY_SLIDER_CONFIG,
  quickNotes: DEFAULT_QUICK_NOTES_CONFIG,
  success: DEFAULT_SUCCESS_CONFIG,
};

// ============================================================================
// ACCESSIBILITY LABELS
// ============================================================================

/**
 * Accessibility labels for screen readers
 * Following WCAG 2.1 AA guidelines
 */
export const ACCESSIBILITY_LABELS = {
  /** Empty state */
  emptyState: {
    logMoodButton: 'Log your mood',
    logMoodHint: "Opens mood selector to record how you're feeling",
  },

  /** Mood selector */
  moodSelector: {
    closeButton: 'Cancel mood logging',
    closeHint: 'Tap to close without saving',
    moodButton: (mood: string) => `Select ${mood} mood`,
    moodHint: (mood: string) => `Tap to log ${mood} as your current mood`,
  },

  /** Intensity slider */
  intensitySlider: {
    slider: 'Adjust mood intensity',
    sliderHint: 'Drag to select intensity level from 1 to 7',
    stepButton: (value: number) => `Set intensity to ${value}`,
    scaleLabel: {
      low: 'Low intensity',
      high: 'High intensity',
    },
  },

  /** Quick notes */
  quickNotes: {
    input: 'Add notes about your mood',
    inputHint: 'Type optional notes to remember this moment',
    submitButton: 'Submit mood log',
    submitHint: 'Tap to save your mood entry',
    skipButton: 'Skip notes',
    skipHint: 'Tap to skip adding notes and save mood',
  },

  /** Weather display */
  weatherDisplay: {
    updateButton: 'Update mood',
    updateHint: 'Tap to change your mood entry for today',
  },
} as const;

// ============================================================================
// ANALYTICS EVENT NAMES
// ============================================================================

/**
 * Analytics event names
 * Consistent naming for tracking throughout widget
 */
export const ANALYTICS_EVENTS = {
  WIDGET_EXPANDED: 'MOOD_WIDGET_EXPANDED',
  MOOD_SELECTED: 'MOOD_SELECTED',
  INTENSITY_SELECTED: 'INTENSITY_SELECTED',
  NOTES_SUBMITTED: 'NOTES_SUBMITTED',
  NOTES_SKIPPED: 'NOTES_SKIPPED',
  MOOD_LOG_COMPLETED: 'MOOD_LOG_COMPLETED',
  WIDGET_CANCELED: 'MOOD_WIDGET_CANCELED',
  WIDGET_ERROR: 'MOOD_WIDGET_ERROR',
} as const;

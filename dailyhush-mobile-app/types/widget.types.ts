/**
 * Mood Widget Type Definitions
 *
 * Complete TypeScript types for the inline mood logging widget.
 * All types are strictly defined with no 'any' types.
 *
 * @module types/widget.types
 */

import type { Enums } from './supabase';

// ============================================================================
// WIDGET STATE
// ============================================================================

/**
 * Widget flow states
 * - empty: Initial state, no mood logged today
 * - mood: Mood selection stage
 * - intensity: Intensity rating stage (1-7)
 * - notes: Optional quick notes input
 * - success: Success animation playing
 * - display: Final state showing logged mood
 */
export type WidgetState = 'empty' | 'mood' | 'intensity' | 'notes' | 'success' | 'display';

// ============================================================================
// MOOD DATA
// ============================================================================

/**
 * Available mood choices
 * Maps to emotional_weather enum in database
 */
export type MoodChoice = 'calm' | 'anxious' | 'sad' | 'frustrated' | 'mixed';

/**
 * Mood choice with display metadata
 */
export interface MoodOption {
  value: MoodChoice;
  label: string;
  emoji: string;
  color: string;
  description?: string;
}

/**
 * Intensity rating (1-7 scale)
 * 1 = Very low intensity
 * 7 = Very high intensity
 */
export type IntensityValue = 1 | 2 | 3 | 4 | 5 | 6 | 7;

/**
 * Complete mood submission data
 */
export interface MoodSubmitData {
  mood: MoodChoice;
  intensity: IntensityValue;
  notes?: string;
  timestamp?: Date;
}

// ============================================================================
// WIDGET CONFIGURATION
// ============================================================================

/**
 * Animation timing configuration
 */
export interface AnimationConfig {
  /** Card expansion duration (ms) */
  expansionDuration: number;

  /** Card collapse duration (ms) */
  collapseDuration: number;

  /** Delay between mood choice stagger (ms) */
  moodStaggerDelay: number;

  /** Success checkmark animation duration (ms) */
  successDuration: number;

  /** Delay before auto-collapse after success (ms) */
  successDisplayDelay: number;

  /** Content fade in/out duration (ms) */
  contentFadeDuration: number;
}

/**
 * Dimension configuration (responsive)
 */
export interface DimensionConfig {
  /** Card height when collapsed */
  collapsedHeight: number;

  /** Card height when expanded */
  expandedHeight: number;

  /** Mood emoji size */
  moodEmojiSize: number;

  /** Intensity slider width */
  sliderWidth: number;

  /** Card border radius */
  borderRadius: number;

  /** Card padding */
  cardPadding: number;
}

/**
 * Feature flags
 */
export interface FeatureConfig {
  /** Enable quick notes input stage */
  enableQuickNotes: boolean;

  /** Enable voice input for notes */
  enableVoiceInput: boolean;

  /** Enable haptic feedback */
  enableHaptics: boolean;

  /** Enable confetti on success */
  enableConfetti: boolean;

  /** Enable tap-outside to cancel */
  enableTapOutside: boolean;

  /** Show progress indicators */
  showProgress: boolean;
}

/**
 * Mood selector configuration
 */
export interface MoodSelectorConfig {
  /** Available mood choices */
  moods: MoodOption[];

  /** Grid layout (columns x rows) */
  layout: 'horizontal' | 'grid-2x3' | 'grid-3x2';

  /** Spacing between choices */
  spacing: number;

  /** Show mood labels below emojis */
  showLabels: boolean;
}

/**
 * Intensity slider configuration
 */
export interface IntensitySliderConfig {
  /** Intensity range [min, max] */
  range: [number, number];

  /** Show step indicators (dots or numbers) */
  showIndicators: 'none' | 'dots' | 'numbers' | 'both';

  /** Show scale labels (Low / High) */
  showScaleLabels: boolean;

  /** Enable gesture slider (vs. tap-only) */
  enableGesture: boolean;

  /** Default intensity value */
  defaultValue: IntensityValue;
}

/**
 * Quick notes configuration
 */
export interface QuickNotesConfig {
  /** Placeholder text */
  placeholder: string;

  /** Maximum character length */
  maxLength?: number;

  /** Auto-focus when visible */
  autoFocus: boolean;

  /** Show character counter */
  showCounter: boolean;
}

/**
 * Success animation configuration
 */
export interface SuccessConfig {
  /** Checkmark stroke width */
  strokeWidth: number;

  /** Checkmark color */
  color: string;

  /** Show glow effect */
  showGlow: boolean;

  /** Success message text */
  message: string;
}

/**
 * Complete widget configuration
 */
export interface WidgetConfig {
  animation: AnimationConfig;
  dimensions: DimensionConfig;
  features: FeatureConfig;
  moodSelector: MoodSelectorConfig;
  intensitySlider: IntensitySliderConfig;
  quickNotes: QuickNotesConfig;
  success: SuccessConfig;
}

// ============================================================================
// COMPONENT PROPS
// ============================================================================

/**
 * Main widget component props
 */
export interface EmotionalWeatherWidgetProps {
  /** Existing weather data (if already logged today) */
  weather?: Enums<'emotional_weather'>;

  /** Existing mood rating (1-5 or 1-7) */
  moodRating?: number;

  /** Existing notes */
  notes?: string;

  /** Callback when mood is submitted */
  onMoodSubmit: (data: MoodSubmitData) => Promise<void>;

  /** Callback when user wants to update existing mood */
  onUpdate?: () => void;

  /** Custom configuration (optional, uses defaults if not provided) */
  config?: Partial<WidgetConfig>;

  /** Custom styles */
  style?: any;
}

/**
 * Empty state component props
 */
export interface EmptyStateProps {
  /** Callback when "Log Mood" is pressed */
  onPress: () => void;

  /** Custom title */
  title?: string;

  /** Custom description */
  description?: string;

  /** Show loading state */
  isLoading?: boolean;
}

/**
 * Mood selector component props
 */
export interface MoodSelectorProps {
  /** Available mood choices */
  moods: MoodOption[];

  /** Callback when mood is selected */
  onSelect: (mood: MoodOption) => void;

  /** Currently selected mood */
  selected?: MoodChoice;

  /** Is component visible */
  visible: boolean;

  /** Configuration */
  config: MoodSelectorConfig;
}

/**
 * Intensity slider component props
 */
export interface IntensitySliderProps {
  /** Intensity range [min, max] */
  range: [number, number];

  /** Initial value */
  initialValue: IntensityValue;

  /** Callback when value changes */
  onChange: (value: IntensityValue) => void;

  /** Is component visible */
  visible: boolean;

  /** Configuration */
  config: IntensitySliderConfig;
}

/**
 * Quick notes input component props
 */
export interface QuickNotesInputProps {
  /** Current notes value */
  value: string;

  /** Callback when text changes */
  onChange: (text: string) => void;

  /** Callback when skip is pressed */
  onSkip: () => void;

  /** Callback when submit is pressed */
  onSubmit: () => void;

  /** Is component visible */
  visible: boolean;

  /** Configuration */
  config: QuickNotesConfig;

  /** Is submitting */
  isSubmitting?: boolean;
}

/**
 * Success checkmark component props
 */
export interface SuccessCheckmarkProps {
  /** Is component visible */
  visible: boolean;

  /** Callback when animation completes */
  onComplete: () => void;

  /** Configuration */
  config: SuccessConfig;
}

/**
 * Weather display component props
 */
export interface WeatherDisplayProps {
  /** Weather type */
  weather: Enums<'emotional_weather'>;

  /** Mood rating */
  moodRating: number;

  /** Notes preview */
  notes?: string;

  /** Callback when update button is pressed */
  onUpdate: () => void;

  /** Is component visible */
  visible: boolean;
}

// ============================================================================
// HOOK RETURN TYPES
// ============================================================================

/**
 * Card expansion hook return type
 */
export interface UseCardExpansionReturn {
  /** Expand the card */
  expand: () => void;

  /** Collapse the card */
  collapse: () => void;

  /** Animated style for card */
  animatedCardStyle: any;

  /** Is card expanded */
  isExpanded: boolean;
}

/**
 * Mood selection hook return type
 */
export interface UseMoodSelectionReturn {
  /** Select a mood */
  selectMood: (mood: MoodOption) => void;

  /** Animated values for each mood */
  moodAnimations: Record<MoodChoice, any>;

  /** Currently selected mood */
  selectedMood: MoodChoice | null;

  /** Is selection complete */
  isComplete: boolean;
}

/**
 * Intensity slider hook return type
 */
export interface UseIntensitySliderReturn {
  /** Current intensity value */
  currentValue: IntensityValue;

  /** Set intensity value */
  setValue: (value: IntensityValue) => void;

  /** Pan gesture handler */
  panGesture: any;

  /** Animated style for slider */
  animatedStyle: any;

  /** Animated style for thumb */
  thumbStyle: any;
}

/**
 * Success animation hook return type
 */
export interface UseSuccessAnimationReturn {
  /** Trigger success animation */
  trigger: () => void;

  /** Animated props for SVG path */
  animatedProps: any;

  /** Animated style for container */
  animatedStyle: any;

  /** Is animation playing */
  isPlaying: boolean;
}

/**
 * Widget state machine hook return type
 */
export interface UseWidgetStateMachineReturn {
  /** Current state */
  state: WidgetState;

  /** Current mood data */
  data: Partial<MoodSubmitData>;

  /** Transition: Start flow (empty → mood) */
  startFlow: () => void;

  /** Transition: Select mood (mood → intensity) */
  selectMood: (mood: MoodChoice) => void;

  /** Transition: Select intensity (intensity → notes or success) */
  selectIntensity: (intensity: IntensityValue) => void;

  /** Transition: Submit notes (notes → success) */
  submitNotes: (notes?: string) => Promise<void>;

  /** Transition: Skip notes (notes → success) */
  skipNotes: () => Promise<void>;

  /** Transition: Complete success (success → display) */
  completeSuccess: () => void;

  /** Reset to empty state */
  reset: () => void;

  /** Cancel flow (any state → collapse to original) */
  cancel: () => void;

  /** Is widget in loading state */
  isLoading: boolean;

  /** Error message (if any) */
  error: string | null;
}

// ============================================================================
// ANALYTICS EVENTS
// ============================================================================

/**
 * Analytics event types
 */
export type WidgetAnalyticsEvent =
  | 'MOOD_WIDGET_EXPANDED'
  | 'MOOD_SELECTED'
  | 'INTENSITY_SELECTED'
  | 'NOTES_SUBMITTED'
  | 'NOTES_SKIPPED'
  | 'MOOD_LOG_COMPLETED'
  | 'MOOD_WIDGET_CANCELED'
  | 'MOOD_WIDGET_ERROR';

/**
 * Analytics event data
 */
export interface WidgetAnalyticsData {
  event: WidgetAnalyticsEvent;
  properties: {
    state?: WidgetState;
    mood?: MoodChoice;
    intensity?: IntensityValue;
    hasNotes?: boolean;
    timeToComplete?: number;
    error?: string;
    source?: string;
  };
  timestamp: Date;
}

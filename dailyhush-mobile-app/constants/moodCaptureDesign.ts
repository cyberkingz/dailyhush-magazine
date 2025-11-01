/**
 * DailyHush - Mood Capture Design System
 *
 * Complete design tokens for the therapeutic mood capture bottom sheet flow.
 * Extracted from UI/UX specification for consistent implementation.
 *
 * Target demographic: Women 55-70 (therapeutic, accessible, calming)
 * Design system: Dark emerald, WCAG AAA compliant
 *
 * @see MOOD_CAPTURE_ROADMAP.md for complete specification
 */

import { colors } from './colors';
import { SPACING, BORDER_RADIUS, SHADOWS } from './designTokens';

// ============================================================================
// BOTTOM SHEET CONFIGURATION
// ============================================================================

export const BOTTOM_SHEET_CONFIG = {
  /**
   * Dynamic heights per step
   * - Step 1 (Mood): 95% - Full screen to show all 5 mood cards
   * - Step 2 (Intensity): 55% - Compact for intensity scale
   * - Step 3 (Writing): 85% - Maximum space for journaling
   * - Step 4 (Suggestion): 70% - Comfortable for suggestion card
   */
  heights: {
    step1: '95%',
    step2: '55%',
    step3: '85%',
    step4: '70%',
  },

  /** Animation timings (all in milliseconds) */
  animation: {
    entrance: {
      duration: 400, // Spring animation from bottom
      easing: 'ease-out' as const,
      type: 'spring' as const,
      springDamping: 0.85, // Gentle spring
    },
    transition: {
      duration: 300, // Between steps
      easing: 'ease-in-out' as const,
    },
    exit: {
      duration: 250, // Slide down and fade
      easing: 'ease-in' as const,
    },
  },

  /** Background overlay */
  overlay: {
    backgroundColor: 'rgba(10, 22, 18, 0.92)', // Deep forest dark with high opacity
    opacity: 1,
    backdropBlur: 8, // iOS only
  },

  /** Gesture configuration */
  gestures: {
    swipeDown: true,
    swipeVelocity: 500, // px/second threshold to trigger dismiss
    tapOutside: true, // Show confirmation before dismiss
    minDragDistance: 50, // Minimum drag to trigger dismiss
  },

  /** Container styling */
  container: {
    backgroundColor: colors.background.primary, // #0A1612 - Deep forest dark
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    shadowColor: colors.emerald[700],
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8, // Android shadow
  },

  /** Drag handle (visual affordance for swipe-down) */
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: colors.emerald[800], // #065F46 - Deep emerald
    borderRadius: BORDER_RADIUS.full,
    alignSelf: 'center' as const,
    marginTop: SPACING.sm,
    marginBottom: SPACING.lg,
  },
} as const;

// ============================================================================
// STEP HEADER STYLING
// ============================================================================

export const STEP_HEADER = {
  /** Main title for each step */
  title: {
    fontSize: 28, // Large for 55-70 age group
    fontWeight: '700' as const,
    lineHeight: 36,
    letterSpacing: 0.3,
    color: colors.text.primary,
    textAlign: 'center' as const,
    marginBottom: SPACING.sm,
  },

  /** Subtitle/reassuring message */
  subtitle: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
    letterSpacing: 0,
    color: colors.text.secondary,
    textAlign: 'center' as const,
    opacity: 0.85,
    marginBottom: SPACING.xxl,
  },

  /** Skip button (top-right, Steps 1-2) */
  skipButton: {
    container: {
      position: 'absolute' as const,
      top: 12,
      right: 16,
      minWidth: 56,
      minHeight: 56, // WCAG AAA touch target
      paddingHorizontal: 12,
      paddingVertical: 12,
      borderRadius: BORDER_RADIUS.full,
      backgroundColor: colors.background.secondary, // #0F1F1A - Dark card
    },
    text: {
      fontSize: 16,
      fontWeight: '600' as const,
      letterSpacing: 0.3,
      color: colors.text.secondary,
    },
  },
} as const;

// ============================================================================
// MOOD CARD (STEP 1)
// ============================================================================

export const MOOD_CARD = {
  /** Card container */
  container: {
    width: '100%' as const,
    minHeight: 88, // Large touch target + generous spacing
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.md,
    backgroundColor: colors.background.secondary, // #0F1F1A - Dark card background
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 2,
    borderColor: 'transparent',
  },

  /** Selected state */
  selected: {
    borderColor: colors.emerald[600], // #059669 - Dark emerald brand color
    backgroundColor: colors.background.tertiary, // #1A4D3C - Elevated dark background
    shadowColor: colors.emerald[700],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },

  /** Pressed state */
  pressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.9,
  },

  /** Layout */
  layout: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: SPACING.lg,
  },

  /** Emoji styling */
  emoji: {
    fontSize: 48, // Large, clear emoji
    width: 64,
    height: 64,
    textAlign: 'center' as const,
  },

  /** Text container */
  textContainer: {
    flex: 1,
    gap: SPACING.xs,
  },

  /** Label typography */
  label: {
    fontSize: 20, // Large for 55-70 age group
    fontWeight: '600' as const,
    lineHeight: 28,
    letterSpacing: 0.2,
    color: colors.text.primary,
  },

  /** Description typography */
  description: {
    fontSize: 15,
    fontWeight: '400' as const,
    lineHeight: 22,
    letterSpacing: 0,
    color: colors.text.secondary,
    opacity: 0.85,
  },
} as const;

// ============================================================================
// INTENSITY SCALE (STEP 2)
// ============================================================================

export const INTENSITY_SCALE = {
  /** Scale container */
  container: {
    width: '100%' as const,
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.xxl,
    backgroundColor: colors.background.secondary, // #0F1F1A - Dark card background
    borderRadius: BORDER_RADIUS.xl,
    marginTop: SPACING.xxl,
    marginBottom: SPACING.xl,
  },

  /** Individual dot configuration */
  dot: {
    /** Default state */
    default: {
      width: 56,
      height: 56, // WCAG AAA touch target
      borderRadius: BORDER_RADIUS.full,
      backgroundColor: colors.background.tertiary, // #1A4D3C - Elevated dark
      borderWidth: 2,
      borderColor: colors.emerald[700], // #047857 - Deep emerald
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
    },

    /** Selected state */
    selected: {
      backgroundColor: colors.emerald[700], // #047857 - Deep emerald brand
      borderColor: colors.emerald[600], // #059669 - Dark emerald brand
      shadowColor: colors.emerald[700],
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.5,
      shadowRadius: 12,
      elevation: 6,
      transform: [{ scale: 1.1 }],
    },

    /** Pressed state */
    pressed: {
      transform: [{ scale: 0.95 }],
      opacity: 0.8,
    },

    /** Number typography */
    number: {
      fontSize: 24,
      fontWeight: '700' as const,
      lineHeight: 32,
      color: colors.text.primary,
      fontVariant: ['tabular-nums' as const],
    },
  },

  /** Dots layout */
  dotsContainer: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: SPACING.xxl,
    gap: SPACING.sm,
  },

  /** Labels container */
  labelsContainer: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    paddingHorizontal: SPACING.sm,
  },

  /** Label typography */
  label: {
    fontSize: 14,
    fontWeight: '500' as const,
    lineHeight: 20,
    letterSpacing: 0.2,
    color: colors.text.secondary,
    opacity: 0.85,
  },

  /** Visual connector line (optional) */
  connector: {
    position: 'absolute' as const,
    top: 28, // Centered vertically with dots
    left: 28,
    right: 28,
    height: 2,
    backgroundColor: colors.emerald[800], // #065F46 - Deep emerald
    zIndex: -1,
  },
} as const;

/** Mood reminder badge (shows selected mood in Step 2) */
export const MOOD_REMINDER = {
  container: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: SPACING.md,
    paddingVertical: 12,
    paddingHorizontal: SPACING.lg,
    backgroundColor: colors.background.tertiary, // #1A4D3C - Elevated dark
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.xxl,
    alignSelf: 'center' as const,
  },
  emoji: {
    fontSize: 32,
  },
  text: {
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 24,
    letterSpacing: 0.2,
    color: colors.text.primary,
  },
} as const;

// ============================================================================
// TEXT AREA (STEP 3 - FREE WRITING)
// ============================================================================

export const TEXT_AREA = {
  /** Container */
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary, // #0F1F1A - Dark card background
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 2,
    borderColor: colors.emerald[800], // #065F46 - Deep emerald border
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    minHeight: 240, // Generous writing space
  },

  /** Focused state */
  focused: {
    borderColor: colors.emerald[600], // #059669 - Dark emerald brand
    shadowColor: colors.emerald[700],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },

  /** Text input styling */
  input: {
    flex: 1,
    fontSize: 18, // Large for 55-70 age group
    fontWeight: '400' as const,
    lineHeight: 28, // 1.56x for comfortable reading/writing
    letterSpacing: 0,
    color: colors.text.primary,
    textAlignVertical: 'top' as const,
    padding: 0,
    minHeight: 180,
  },

  /** Placeholder styling */
  placeholder: {
    color: colors.text.muted,
    opacity: 0.8,
  },
} as const;

// ============================================================================
// VOICE-TO-TEXT BUTTON
// ============================================================================

export const VOICE_BUTTON = {
  /** Positioned at bottom-right of text area */
  container: {
    position: 'absolute' as const,
    bottom: 12, // Changed from top to bottom
    right: 12,
    width: 56,
    height: 56, // WCAG AAA touch target
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: colors.emerald[700], // #047857 - Deep emerald brand
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    zIndex: 10,
    ...SHADOWS.emeraldGlow,
  },

  /** Recording state (red background) */
  recording: {
    backgroundColor: '#EF4444', // Red for recording
  },

  /** Processing state (amber background) */
  processing: {
    backgroundColor: '#F59E0B', // Amber for processing
  },

  /** Error state */
  error: {
    backgroundColor: '#EF4444', // Red for error
  },

  /** Icon configuration */
  icon: {
    size: 24,
    color: colors.text.primary,
  },

  /** Pressed state */
  pressed: {
    transform: [{ scale: 0.95 }],
    opacity: 0.9,
  },
} as const;

/** Recording indicator overlay */
export const RECORDING_INDICATOR = {
  container: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    paddingVertical: 12,
    paddingHorizontal: SPACING.lg,
    backgroundColor: 'rgba(239, 68, 68, 0.95)', // Red with opacity
    borderTopLeftRadius: BORDER_RADIUS.lg,
    borderTopRightRadius: BORDER_RADIUS.lg,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: SPACING.md,
    zIndex: 20,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
  },
  text: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
} as const;

// ============================================================================
// PROMPT CHIPS (STEP 3)
// ============================================================================

export const PROMPT_CHIPS = {
  /** Container */
  container: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: SPACING.sm,
    marginTop: SPACING.lg,
    marginBottom: SPACING.lg,
  },

  /** Individual chip */
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: colors.background.tertiary, // #1A4D3C - Elevated dark
    borderRadius: BORDER_RADIUS.xl, // Pill shape
    borderWidth: 1,
    borderColor: colors.emerald[700], // #047857 - Deep emerald
    minHeight: 44, // WCAG touch target
  },

  /** Pressed state */
  pressed: {
    backgroundColor: colors.background.muted, // #1A2E26 - Muted dark
    transform: [{ scale: 0.98 }],
  },

  /** Typography */
  text: {
    fontSize: 15,
    fontWeight: '500' as const,
    lineHeight: 20,
    letterSpacing: 0.1,
    color: colors.text.secondary,
  },
} as const;

// ============================================================================
// STATUS INDICATORS (STEP 3)
// ============================================================================

export const STATUS_INDICATORS = {
  /** Container (bottom of text area) */
  container: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: colors.emerald[800], // #065F46 - Deep emerald
  },

  /** Privacy badge */
  privacy: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 6,
    icon: {
      size: 16,
      color: colors.emerald[600], // #059669 - Dark emerald brand
    },
    text: {
      fontSize: 13,
      fontWeight: '500' as const,
      lineHeight: 18,
      letterSpacing: 0,
      color: colors.text.secondary,
      opacity: 0.85,
    },
  },

  /** Auto-save indicator */
  autoSave: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 6,
    icon: {
      size: 16,
      color: colors.emerald[600], // #059669 - Dark emerald brand
    },
    text: {
      fontSize: 13,
      fontWeight: '500' as const,
      lineHeight: 18,
      letterSpacing: 0,
      color: colors.text.secondary,
      opacity: 0.85,
    },
  },
} as const;

/** Character count (optional, informational only) */
export const CHARACTER_COUNT = {
  container: {
    marginTop: SPACING.sm,
    alignSelf: 'flex-end' as const,
  },
  text: {
    fontSize: 12,
    fontWeight: '500' as const,
    letterSpacing: 0.5,
    lineHeight: 16,
    color: colors.text.muted,
    opacity: 0.6,
  },
  showThreshold: 50, // Only show if > 50 characters
} as const;

// ============================================================================
// SUGGESTION CARD (STEP 4)
// ============================================================================

export const SUGGESTION_CARD = {
  /** Container */
  container: {
    width: '100%' as const,
    backgroundColor: colors.background.secondary, // #0F1F1A - Dark card background
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xxl,
    marginBottom: SPACING.xxl,
    ...SHADOWS.emeraldGlow,
  },

  /** Illustration container */
  illustration: {
    width: '100%' as const,
    height: 180,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: colors.background.tertiary, // #1A4D3C - Elevated dark
    marginBottom: SPACING.xl,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    overflow: 'hidden' as const,
    icon: {
      size: 80,
      color: colors.emerald[600], // #059669 - Dark emerald brand
    },
  },

  /** Title section */
  title: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: SPACING.sm,
    marginBottom: SPACING.md,
    emoji: {
      fontSize: 24,
    },
    text: {
      fontSize: 24,
      fontWeight: '700' as const,
      lineHeight: 32,
      letterSpacing: 0.3,
      color: colors.text.primary,
      flex: 1,
    },
  },

  /** Description */
  description: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
    letterSpacing: 0,
    color: colors.text.secondary,
    opacity: 0.85,
    marginBottom: SPACING.xl,
  },

  /** Steps/bullet points */
  steps: {
    gap: SPACING.md,
    step: {
      flexDirection: 'row' as const,
      alignItems: 'flex-start' as const,
      gap: SPACING.md,
      bullet: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: colors.emerald[600], // #059669 - Dark emerald brand
        marginTop: 8, // Align with text
      },
      text: {
        flex: 1,
        fontSize: 15,
        fontWeight: '400' as const,
        lineHeight: 22,
        letterSpacing: 0,
        color: colors.text.secondary,
        opacity: 0.85,
      },
    },
  },

  /** Badge (e.g., "Recommended for Sleep Loop") */
  badge: {
    alignSelf: 'flex-start' as const,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: colors.background.tertiary, // #1A4D3C - Elevated dark
    borderRadius: BORDER_RADIUS.xl, // Pill shape
    marginBottom: SPACING.lg,
    text: {
      fontSize: 12,
      fontWeight: '600' as const,
      lineHeight: 16,
      letterSpacing: 0.6,
      textTransform: 'uppercase' as const,
      color: colors.emerald[600], // #059669 - Dark emerald brand
    },
  },
} as const;

// ============================================================================
// ACTION BUTTONS
// ============================================================================

export const BUTTONS = {
  /** Primary CTA (Continue, Try This Exercise) */
  primary: {
    width: '100%' as const,
    height: 62, // Large for 55-70 age group
    backgroundColor: colors.emerald[700], // #047857 - Deep emerald brand
    borderRadius: BORDER_RADIUS.xl,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginBottom: SPACING.md,
    ...SHADOWS.emeraldGlowStrong,
    text: {
      fontSize: 18,
      fontWeight: '600' as const,
      letterSpacing: 0.3,
      color: colors.text.primary,
    },
    pressed: {
      transform: [{ scale: 0.98 }],
      opacity: 0.9,
    },
    disabled: {
      backgroundColor: colors.background.muted, // #1A2E26 - Muted dark
      opacity: 0.6,
    },
  },

  /** Secondary CTA (Save & Close) */
  secondary: {
    width: '100%' as const,
    height: 56,
    backgroundColor: 'transparent',
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: colors.emerald[700], // #047857 - Deep emerald
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    text: {
      fontSize: 16,
      fontWeight: '600' as const,
      letterSpacing: 0.2,
      color: colors.text.secondary,
    },
    pressed: {
      backgroundColor: colors.background.tertiary, // #1A4D3C - Elevated dark
      transform: [{ scale: 0.98 }],
    },
  },

  /** Back button (top-left) */
  back: {
    position: 'absolute' as const,
    top: 0,
    left: 4,
    width: 44,
    height: 44,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    zIndex: 10,
    icon: {
      size: 24,
      strokeWidth: 2,
      color: colors.text.secondary, // Subtle gray
    },
    pressed: {
      transform: [{ scale: 0.95 }],
    },
  },

  /** Close button (top-right) */
  close: {
    position: 'absolute' as const,
    top: 12,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: colors.background.secondary, // #0F1F1A - Dark card
    borderWidth: 2,
    borderColor: colors.emerald[800], // #065F46 - Deep emerald
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    zIndex: 10,
    icon: {
      size: 24,
      strokeWidth: 2.5,
      color: colors.text.primary,
    },
    pressed: {
      backgroundColor: colors.background.tertiary, // #1A4D3C - Elevated dark
      transform: [{ scale: 0.95 }],
    },
  },
} as const;

// ============================================================================
// PROGRESS INDICATOR
// ============================================================================

export const PROGRESS_INDICATOR = {
  /** Container - Optimized for compact header */
  container: {
    flexDirection: 'row' as const,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    gap: SPACING.sm, // Reduced from SPACING.md (12px instead of 16px)
    marginTop: 0, // Removed top margin
    marginBottom: 0, // Removed bottom margin
    paddingVertical: 0, // Removed vertical padding
  },

  /** Individual dot - Slightly smaller for compactness */
  dot: {
    /** Default state (incomplete) */
    default: {
      width: 8, // Reduced from 10px
      height: 8, // Reduced from 10px
      borderRadius: 4,
      backgroundColor: colors.background.tertiary, // #1A4D3C - Elevated dark
      borderWidth: 1,
      borderColor: colors.emerald[800], // #065F46 - Deep emerald
    },

    /** Active state (current step) */
    active: {
      width: 28, // Reduced from 32px (elongated pill)
      height: 8, // Reduced from 10px
      borderRadius: 4,
      backgroundColor: colors.emerald[600], // #059669 - Dark emerald brand
      borderWidth: 0,
      shadowColor: colors.emerald[700],
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.5,
      shadowRadius: 6,
      elevation: 3,
    },

    /** Completed state */
    completed: {
      width: 8, // Reduced from 10px
      height: 8, // Reduced from 10px
      borderRadius: 4,
      backgroundColor: colors.emerald[700], // #047857 - Deep emerald brand
      borderWidth: 0,
    },
  },
} as const;

// ============================================================================
// ANIMATIONS
// ============================================================================

export const ANIMATIONS = {
  /** Card selection */
  cardSelect: {
    duration: 400,
    easing: 'ease-out' as const,
  },

  /** Dot fill */
  dotFill: {
    duration: 300,
    easing: 'ease-out' as const,
  },

  /** Button press */
  buttonPress: {
    duration: 150,
    easing: 'ease-in-out' as const,
  },

  /** Text input focus */
  textInputFocus: {
    duration: 200,
    easing: 'ease-out' as const,
  },

  /** Step transitions */
  stepTransition: {
    forward: {
      duration: 300,
      easing: 'ease-in-out' as const,
    },
    backward: {
      duration: 300,
      easing: 'ease-in-out' as const,
    },
  },

  /** Fade in animation */
  fadeIn: {
    duration: 400,
    easing: 'ease-out' as const,
  },
} as const;

// ============================================================================
// HAPTIC FEEDBACK TYPES
// ============================================================================

export const HAPTICS = {
  /** Selection feedback */
  selection: {
    moodCard: 'impactLight' as const,
    intensityDot: 'impactMedium' as const,
  },

  /** Button feedback */
  buttons: {
    primary: 'impactMedium' as const,
    secondary: 'impactLight' as const,
    skip: 'impactLight' as const,
  },

  /** Voice recording */
  voice: {
    start: 'impactHeavy' as const,
    stop: 'impactMedium' as const,
    error: 'notificationError' as const,
  },

  /** Navigation */
  navigation: {
    forward: 'impactLight' as const,
    backward: 'impactLight' as const,
    close: 'impactLight' as const,
  },

  /** Completion */
  completion: {
    success: 'notificationSuccess' as const,
  },
} as const;

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type BottomSheetHeight = keyof typeof BOTTOM_SHEET_CONFIG.heights;
export type HapticType = typeof HAPTICS[keyof typeof HAPTICS][keyof typeof HAPTICS[keyof typeof HAPTICS]];

/**
 * Complete Design Token System
 * Centralized design values for consistency across the app
 * Optimized for 55-70 demographic with accessibility focus
 */

import { Platform } from 'react-native';

// ============================================================================
// SPACING (8px grid system - base unit)
// ============================================================================
export const SPACING = {
  xs: 4, // Smallest gaps, icon spacing
  sm: 8, // Compact spacing between elements
  md: 12, // Default padding, standard spacing
  lg: 16, // Component spacing, section margins
  xl: 20, // Large sections, major spacing
  xxl: 24, // Extra large spacing
  xxxl: 40, // Super large spacing for major sections
} as const;

// ============================================================================
// TOUCH TARGETS (Accessibility - WCAG AAA compliant)
// ============================================================================
export const TOUCH_TARGETS = {
  // Primary actions: back buttons, main CTAs, critical interactions
  primary: {
    minWidth: 56, // WCAG AAA + older adult accommodation
    minHeight: 56,
    padding: 12, // Inner padding for content
  },
  // Secondary actions: navigation tabs, secondary buttons
  secondary: {
    minWidth: 48, // WCAG AAA minimum
    minHeight: 48,
    padding: 8,
  },
  // Small utility buttons: close, expand, minor actions
  utility: {
    minWidth: 40, // Minimum viable touch target
    minHeight: 40,
    padding: 4,
  },
} as const;

// ============================================================================
// ICONS (Size and styling)
// ============================================================================
export const ICONS = {
  // Navigation and header icons (back, menu, etc.)
  navigation: {
    size: 24, // Icon visual size in pixels
    strokeWidth: 2.5, // Line weight for lucide icons
    containerSize: 40, // Visual container diameter for circular icons
    containerBorderWidth: 2,
  },
  // Utility icons (close, settings, etc.)
  utility: {
    size: 20,
    strokeWidth: 2,
    containerSize: 32,
    containerBorderWidth: 1.5,
  },
  // Large display icons (feature icons, empty states)
  display: {
    size: 32,
    strokeWidth: 2,
    containerSize: 48,
    containerBorderWidth: 2,
  },
  // Tab icons (bottom navigation)
  tab: {
    size: 23,
    strokeWidth: 2.5, // Active state
    containerSize: 32,
  },
} as const;

// ============================================================================
// COLORS - Emerald Theme
// ============================================================================
export const COLORS = {
  // Primary color palette (emerald green theme)
  primary: {
    darkest: '#0A1612', // Primary background (very dark)
    dark: '#1A4D3C', // Secondary background
    medium: '#40916C', // Primary action color (button, selected state)
    light: '#52B788', // Highlight, hover state
    lightest: '#7dd3c0', // Bright accent, focus indicator
  },

  // Text colors
  text: {
    primary: '#E8F4F0', // Main text color (light on dark)
    secondary: '#95B8A8', // Secondary text, hints, labels
    muted: '#6B7280', // Disabled, low-importance text
    inverted: '#0A1612', // Text on light backgrounds
  },

  // Semantic colors
  states: {
    success: '#10B981', // Success messages, positive actions
    error: '#EF4444', // Errors, destructive actions
    warning: '#F59E0B', // Warnings, attention needed
    info: '#3B82F6', // Information, neutral state
  },

  // Interactive feedback colors
  feedback: {
    pressed: 'rgba(82, 183, 136, 0.2)', // Press/active state
    hover: 'rgba(82, 183, 136, 0.1)', // Hover state
    focused: 'rgba(125, 211, 192, 0.3)', // Focus ring/outline
    disabled: 'rgba(107, 114, 128, 0.5)', // Disabled state opacity
  },

  // Overlay and transparency
  overlay: {
    dark: 'rgba(10, 22, 18, 0.85)', // Dark overlay for images
    light: 'rgba(232, 244, 240, 0.1)', // Light overlay for buttons
  },
} as const;

// ============================================================================
// BORDER RADIUS (Consistency in curve radius)
// ============================================================================
export const BORDER_RADIUS = {
  none: 0,
  sm: 8, // Small elements, small cards
  md: 12, // Medium elements, input fields
  lg: 16, // Large buttons, dialog boxes
  xl: 20, // Navigation bars, large sections
  full: 9999, // Circular (buttons, avatars)
} as const;

// ============================================================================
// SHADOWS (Platform-specific, depth indication)
// ============================================================================
export const SHADOWS = {
  // Subtle elevation for slight depth
  sm: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    android: { elevation: 2 },
    default: { elevation: 2 },
  })!,

  // Medium elevation for important elements
  md: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
    },
    android: { elevation: 4 },
    default: { elevation: 4 },
  })!,

  // Large elevation for floating elements (FAB, modals)
  lg: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
    },
    android: { elevation: 8 },
    default: { elevation: 8 },
  })!,

  // Brand glow effect (emerald theme)
  emeraldGlow: Platform.select({
    ios: {
      shadowColor: '#40916C',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
    },
    android: { elevation: 4 },
    default: { elevation: 4 },
  })!,

  // Strong glow for active/highlight states
  emeraldGlowStrong: Platform.select({
    ios: {
      shadowColor: '#40916C',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
    },
    android: { elevation: 6 },
    default: { elevation: 6 },
  })!,
} as const;

// ============================================================================
// ANIMATIONS (Duration and easing)
// ============================================================================
export const ANIMATIONS = {
  // Quick feedback for button presses
  quick: {
    duration: 150,
    easing: 'ease-out',
  },
  // Standard animation for navigation and transitions
  standard: {
    duration: 300,
    easing: 'ease-in-out',
  },
  // Slower animation for emphasis and attention
  slow: {
    duration: 500,
    easing: 'ease-in-out',
  },
  // Entrance animation for appearing elements
  entrance: {
    duration: 400,
    easing: 'ease-out-cubic',
  },
  // Exit animation for disappearing elements
  exit: {
    duration: 250,
    easing: 'ease-in-cubic',
  },
} as const;

// ============================================================================
// TYPOGRAPHY (Font sizes and weights)
// ============================================================================
export const TYPOGRAPHY = {
  // Heading 1 (page titles)
  h1: {
    fontSize: 32,
    fontFamily: 'Poppins_700Bold',
    lineHeight: 40,
    letterSpacing: 0.5,
  },

  // Heading 2 (section titles)
  h2: {
    fontSize: 28,
    fontFamily: 'Poppins_700Bold',
    lineHeight: 36,
    letterSpacing: 0.3,
  },

  // Heading 3 (subsection titles)
  h3: {
    fontSize: 24,
    fontFamily: 'Poppins_600SemiBold',
    lineHeight: 32,
    letterSpacing: 0.2,
  },

  // Body text (main content)
  body: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    lineHeight: 24,
    letterSpacing: 0,
  },

  // Small body text (secondary content)
  bodySmall: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    lineHeight: 20,
    letterSpacing: 0,
  },

  // Button text
  button: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    letterSpacing: 0.3,
  },

  // Label text (form labels, captions)
  label: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    letterSpacing: 0.5,
    lineHeight: 16,
  },

  // Caption text (smallest, helper text)
  caption: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    lineHeight: 14,
    letterSpacing: 0.2,
  },
} as const;

// ============================================================================
// HEADER NAVIGATION (Back button specific)
// ============================================================================
export const HEADER_NAV = {
  // Touch target area (includes hitSlop)
  touchTarget: TOUCH_TARGETS.primary,

  // Icon styling
  icon: ICONS.navigation,

  // Color scheme
  colors: {
    icon: COLORS.text.primary,
    background: 'rgba(26, 77, 60, 0.4)', // Subtle emerald background
    border: COLORS.primary.medium,
    active: COLORS.primary.light,
    focus: COLORS.primary.lightest,
  },

  // Spacing from screen edges
  spacing: SPACING.md,

  // Extended touch zone (hitSlop in all directions)
  hitSlop: 20,

  // Animation settings
  animation: {
    pressDuration: 150,
    scalePressedValue: 0.95,
  },

  // Accessibility settings
  accessibility: {
    label: 'Go back to previous screen',
    hint: 'Tap to return to the previous screen. Your progress will be saved.',
    role: 'button' as const,
  },
} as const;

// ============================================================================
// FORM INPUTS
// ============================================================================
export const FORM = {
  // Input field styling
  input: {
    height: 56, // Touch-friendly height
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.primary.dark,
    borderColor: COLORS.primary.medium,
    borderWidth: 1,
    color: COLORS.text.primary,
  },

  // Label styling
  label: {
    ...TYPOGRAPHY.label,
    color: COLORS.text.secondary,
    marginBottom: SPACING.sm,
  },

  // Helper text styling
  helper: {
    fontSize: 12,
    color: COLORS.text.secondary,
    marginTop: SPACING.sm,
  },

  // Error state
  error: {
    color: COLORS.states.error,
    backgroundColor: `rgba(239, 68, 68, 0.1)`,
    borderColor: COLORS.states.error,
  },

  // Disabled state
  disabled: {
    opacity: 0.5,
    backgroundColor: COLORS.primary.dark,
    color: COLORS.text.muted,
  },
} as const;

// ============================================================================
// BUTTONS
// ============================================================================
export const BUTTON = {
  // Primary button (main CTA)
  primary: {
    backgroundColor: COLORS.primary.medium,
    height: 62,
    borderRadius: BORDER_RADIUS.xl,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    ...SHADOWS.md,
  },

  // Secondary button (alternative action)
  secondary: {
    backgroundColor: COLORS.primary.dark,
    borderColor: COLORS.primary.medium,
    borderWidth: 1,
    height: 62,
    borderRadius: BORDER_RADIUS.xl,
  },

  // Minimal button (tertiary action)
  minimal: {
    backgroundColor: 'transparent',
    height: 56,
    borderRadius: BORDER_RADIUS.md,
  },

  // Text styling
  text: {
    ...TYPOGRAPHY.button,
    color: COLORS.text.primary,
  },

  // Disabled state
  disabled: {
    opacity: 0.5,
  },
} as const;

// ============================================================================
// CARDS
// ============================================================================
export const CARD = {
  // Default card styling
  default: {
    backgroundColor: COLORS.primary.dark,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    ...SHADOWS.sm,
  },

  // Elevated card
  elevated: {
    backgroundColor: COLORS.primary.dark,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    ...SHADOWS.md,
  },

  // Outlined card
  outlined: {
    backgroundColor: 'transparent',
    borderColor: COLORS.primary.medium,
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
  },
} as const;

// ============================================================================
// BOTTOM NAVIGATION
// ============================================================================
export const BOTTOM_NAV = {
  height: 80, // Tab height + safe area bottom
  paddingBottom: SPACING.md,
  paddingHorizontal: SPACING.lg,
  paddingTop: SPACING.lg,
  gap: SPACING.sm,
  backgroundColor: COLORS.primary.darkest,
  borderTopLeftRadius: BORDER_RADIUS.xl,
  borderTopRightRadius: BORDER_RADIUS.xl,
} as const;

// ============================================================================
// MODAL / DIALOG
// ============================================================================
export const MODAL = {
  // Overlay backdrop
  overlay: {
    backgroundColor: COLORS.overlay.dark,
  },

  // Modal container
  container: {
    backgroundColor: COLORS.primary.dark,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    ...SHADOWS.lg,
  },

  // Title styling
  title: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },

  // Content styling
  content: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.secondary,
    marginBottom: SPACING.lg,
  },
} as const;

// ============================================================================
// UTILITY TYPES
// ============================================================================
export type SpacingSize = keyof typeof SPACING;
export type ColorKey = keyof typeof COLORS.primary | keyof typeof COLORS.text;
export type BorderRadiusSize = keyof typeof BORDER_RADIUS;
export type TypographyStyle = keyof typeof TYPOGRAPHY;
export type ShadowSize = keyof typeof SHADOWS;

export default {
  SPACING,
  TOUCH_TARGETS,
  ICONS,
  COLORS,
  BORDER_RADIUS,
  SHADOWS,
  ANIMATIONS,
  TYPOGRAPHY,
  HEADER_NAV,
  FORM,
  BUTTON,
  CARD,
  BOTTOM_NAV,
  MODAL,
};

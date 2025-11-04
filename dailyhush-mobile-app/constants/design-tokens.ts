/**
 * DailyHush Design Token System
 * Complete design system for module-based navigation
 * Optimized for dark theme with emerald accent (#40916C)
 */

import { Platform, ViewStyle, TextStyle } from 'react-native';

// ============================================================================
// SPACING SYSTEM (8px grid)
// ============================================================================
export const SPACING = {
  xs: 4,    // Micro spacing
  sm: 8,    // Small gaps
  md: 12,   // Default spacing
  lg: 16,   // Large spacing
  xl: 20,   // Extra large
  xxl: 24,  // Section spacing
  xxxl: 32, // Major sections
} as const;

// ============================================================================
// COLORS - Emerald Dark Theme
// ============================================================================
export const COLORS = {
  // Backgrounds
  background: {
    primary: '#0A1612',      // Main dark background
    secondary: '#0F1F1A',    // Card backgrounds
    tertiary: '#1A4D3C',     // Elevated elements
    overlay: 'rgba(10, 22, 18, 0.92)',
  },

  // Primary emerald scale
  primary: {
    50: '#E8F4F0',
    100: '#D1FAE5',
    200: '#95B8A8',
    300: '#7dd3c0',
    400: '#52B788',
    500: '#40916C',  // Main brand color
    600: '#2D6A4F',
    700: '#1A4D3C',
    800: '#0F1F1A',
    900: '#0A1612',
  },

  // Text colors
  text: {
    primary: '#E8F4F0',      // Main text
    secondary: '#95B8A8',    // Secondary text
    tertiary: '#6B8376',     // Muted text
    inverted: '#0A1612',     // Text on light bg
    disabled: 'rgba(149, 184, 168, 0.4)',
  },

  // Semantic colors
  semantic: {
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6',
  },

  // Anxiety rating colors (low/medium/high intensity)
  anxiety: {
    low: {
      primary: '#10B981',      // green-500
      shadow: '#059669',       // green-600
      border: 'rgba(16, 185, 129, 0.3)',
    },
    medium: {
      primary: '#F59E0B',      // yellow-500
      shadow: '#D97706',       // yellow-600
      border: 'rgba(245, 158, 11, 0.3)',
    },
    high: {
      primary: '#EF4444',      // red-500
      shadow: '#DC2626',       // red-600
      border: 'rgba(239, 68, 68, 0.3)',
    },
  },

  // Outcome-based colors for rating comparisons
  outcome: {
    improved: {
      background: '#E8F5E9',      // Light green background
      backgroundDark: '#0D3818',  // Dark theme version
      text: '#2E7D32',            // Dark green text
      textDark: '#4CAF50',        // Light green text for dark theme
      icon: '#4CAF50',            // Green-500
      border: 'rgba(76, 175, 80, 0.3)',
    },
    worsened: {
      background: '#FFEBEE',      // Light red background
      backgroundDark: '#3D1415',  // Dark theme version
      text: '#C62828',            // Dark red text
      textDark: '#EF4444',        // Light red text for dark theme
      icon: '#EF4444',            // Red-500
      border: 'rgba(239, 68, 68, 0.3)',
    },
    noChange: {
      background: '#E3F2FD',      // Light blue background
      backgroundDark: '#0F2537',  // Dark theme version
      text: '#1565C0',            // Dark blue text
      textDark: '#2196F3',        // Light blue text for dark theme
      icon: '#2196F3',            // Blue-500
      border: 'rgba(33, 150, 243, 0.3)',
    },
  },

  // Interactive states
  interactive: {
    pressed: 'rgba(64, 145, 108, 0.3)',
    hover: 'rgba(64, 145, 108, 0.15)',
    focus: 'rgba(125, 211, 192, 0.25)',
    disabled: 'rgba(107, 131, 118, 0.3)',
  },

  // Borders
  border: {
    default: 'rgba(64, 145, 108, 0.2)',
    focus: '#40916C',
    disabled: 'rgba(107, 131, 118, 0.2)',
  },
} as const;

// ============================================================================
// TYPOGRAPHY
// ============================================================================
export const TYPOGRAPHY = {
  // Display styles
  display: {
    fontSize: 32,
    fontFamily: 'Poppins_700Bold',
    lineHeight: 40,
    letterSpacing: -0.5,
  } as TextStyle,

  // Heading styles
  h1: {
    fontSize: 28,
    fontFamily: 'Poppins_700Bold',
    lineHeight: 36,
    letterSpacing: -0.3,
  } as TextStyle,

  h2: {
    fontSize: 24,
    fontFamily: 'Poppins_600SemiBold',
    lineHeight: 32,
    letterSpacing: -0.2,
  } as TextStyle,

  h3: {
    fontSize: 20,
    fontFamily: 'Poppins_600SemiBold',
    lineHeight: 28,
    letterSpacing: 0,
  } as TextStyle,

  h4: {
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
    lineHeight: 26,
    letterSpacing: 0,
  } as TextStyle,

  // Body styles
  body: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    lineHeight: 24,
    letterSpacing: 0,
  } as TextStyle,

  bodyMedium: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    lineHeight: 24,
    letterSpacing: 0,
  } as TextStyle,

  bodySmall: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    lineHeight: 20,
    letterSpacing: 0,
  } as TextStyle,

  // UI styles
  button: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    letterSpacing: 0.3,
  } as TextStyle,

  buttonSmall: {
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
    letterSpacing: 0.3,
  } as TextStyle,

  label: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    letterSpacing: 0.5,
    lineHeight: 16,
    textTransform: 'uppercase',
  } as TextStyle,

  caption: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    lineHeight: 16,
    letterSpacing: 0.2,
  } as TextStyle,
} as const;

// ============================================================================
// BORDER RADIUS
// ============================================================================
export const RADIUS = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
} as const;

// ============================================================================
// SHADOWS (Platform-specific)
// ============================================================================
export const SHADOWS = {
  none: Platform.select({
    ios: {
      shadowColor: 'transparent',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
    },
    android: { elevation: 0 },
    default: {},
  }),

  sm: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    android: { elevation: 2 },
    default: { elevation: 2 },
  }),

  md: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
    },
    android: { elevation: 4 },
    default: { elevation: 4 },
  }),

  lg: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
    },
    android: { elevation: 8 },
    default: { elevation: 8 },
  }),

  xl: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.25,
      shadowRadius: 24,
    },
    android: { elevation: 12 },
    default: { elevation: 12 },
  }),

  // Emerald glow effect
  emerald: Platform.select({
    ios: {
      shadowColor: '#40916C',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
    android: { elevation: 4 },
    default: { elevation: 4 },
  }),

  emeraldStrong: Platform.select({
    ios: {
      shadowColor: '#40916C',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.4,
      shadowRadius: 16,
    },
    android: { elevation: 8 },
    default: { elevation: 8 },
  }),
} as const;

// ============================================================================
// ANIMATIONS
// ============================================================================
export const ANIMATIONS = {
  // Duration
  duration: {
    instant: 100,
    fast: 150,
    normal: 250,
    slow: 350,
    slower: 500,
  },

  // Spring configs (for react-native-reanimated)
  spring: {
    gentle: {
      damping: 20,
      stiffness: 90,
      mass: 1,
    },
    default: {
      damping: 15,
      stiffness: 100,
      mass: 1,
    },
    snappy: {
      damping: 10,
      stiffness: 120,
      mass: 0.8,
    },
    bouncy: {
      damping: 8,
      stiffness: 100,
      mass: 0.5,
    },
  },

  // Easing curves
  easing: {
    default: 'ease-in-out',
    entrance: 'ease-out',
    exit: 'ease-in',
    smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;

// ============================================================================
// TOUCH TARGETS (Accessibility)
// ============================================================================
export const TOUCH_TARGET = {
  // Minimum sizes (WCAG AAA)
  min: 44,
  comfortable: 48,
  large: 56,
  xlarge: 64,

  // Hit slop for better tap experience
  hitSlop: {
    top: 12,
    bottom: 12,
    left: 12,
    right: 12,
  },

  hitSlopSmall: {
    top: 8,
    bottom: 8,
    left: 8,
    right: 8,
  },
} as const;

// ============================================================================
// ICON SIZES
// ============================================================================
export const ICON_SIZE = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
  xl: 40,
  xxl: 48,
} as const;

// ============================================================================
// MODULE-SPECIFIC TOKENS
// ============================================================================
export const MODULE = {
  // Module card
  card: {
    height: 160,
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
  },

  // Method card (horizontal)
  methodCard: {
    width: 280,
    height: 120,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
  },

  // Header
  header: {
    height: 56,
    paddingHorizontal: SPACING.lg,
    backButtonSize: 44,
  },

  // Progress dots
  progressDot: {
    size: 8,
    activeSize: 10,
    spacing: SPACING.sm,
  },

  // Premium badge
  premiumBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
} as const;

// ============================================================================
// LAYOUT
// ============================================================================
export const LAYOUT = {
  // Screen padding
  screenPadding: {
    horizontal: SPACING.lg,
    vertical: SPACING.xl,
  },

  // Safe area insets
  safeArea: {
    top: Platform.OS === 'ios' ? 44 : 0,
    bottom: Platform.OS === 'ios' ? 34 : 0,
  },

  // Content width
  maxContentWidth: 600,

  // Grid system
  grid: {
    columns: 12,
    gutter: SPACING.lg,
  },
} as const;

// ============================================================================
// Z-INDEX LAYERS
// ============================================================================
export const Z_INDEX = {
  base: 0,
  elevated: 10,
  dropdown: 100,
  sticky: 500,
  modal: 1000,
  popover: 1100,
  tooltip: 1200,
  toast: 1300,
  overlay: 9000,
  max: 9999,
} as const;

// ============================================================================
// OPACITY LEVELS
// ============================================================================
export const OPACITY = {
  disabled: 0.4,
  muted: 0.6,
  hover: 0.8,
  default: 1,
} as const;

// ============================================================================
// PRESET COMPONENT STYLES
// ============================================================================

// Button presets
export const BUTTON_STYLES = {
  primary: {
    backgroundColor: COLORS.primary[500],
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    minHeight: TOUCH_TARGET.comfortable,
    ...SHADOWS.md,
  } as ViewStyle,

  secondary: {
    backgroundColor: COLORS.background.tertiary,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    minHeight: TOUCH_TARGET.comfortable,
    borderWidth: 1,
    borderColor: COLORS.primary[500],
  } as ViewStyle,

  ghost: {
    backgroundColor: 'transparent',
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    minHeight: TOUCH_TARGET.comfortable,
  } as ViewStyle,
} as const;

// Card presets
export const CARD_STYLES = {
  default: {
    backgroundColor: COLORS.background.secondary,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border.default,
  } as ViewStyle,

  elevated: {
    backgroundColor: COLORS.background.secondary,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    ...SHADOWS.md,
  } as ViewStyle,

  outlined: {
    backgroundColor: 'transparent',
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1.5,
    borderColor: COLORS.primary[500],
  } as ViewStyle,
} as const;

// ============================================================================
// ACCESSIBILITY
// ============================================================================
export const A11Y = {
  // Minimum contrast ratios (WCAG AA)
  contrastRatios: {
    normalText: 4.5,
    largeText: 3,
    interactive: 3,
  },

  // Focus indicator
  focusIndicator: {
    width: 2,
    color: COLORS.primary[300],
    offset: 2,
  },

  // Minimum touch targets (WCAG AAA)
  minTouchTarget: 44,
} as const;

// ============================================================================
// BREAKPOINTS (for responsive design if needed)
// ============================================================================
export const BREAKPOINTS = {
  phone: 0,
  tablet: 768,
  desktop: 1024,
} as const;

// ============================================================================
// TYPE EXPORTS
// ============================================================================
export type SpacingKey = keyof typeof SPACING;
export type ColorKey = keyof typeof COLORS;
export type RadiusKey = keyof typeof RADIUS;
export type ShadowKey = keyof typeof SHADOWS;
export type TypographyKey = keyof typeof TYPOGRAPHY;
export type IconSizeKey = keyof typeof ICON_SIZE;

// ============================================================================
// DEFAULT EXPORT
// ============================================================================
export default {
  SPACING,
  COLORS,
  TYPOGRAPHY,
  RADIUS,
  SHADOWS,
  ANIMATIONS,
  TOUCH_TARGET,
  ICON_SIZE,
  MODULE,
  LAYOUT,
  Z_INDEX,
  OPACITY,
  BUTTON_STYLES,
  CARD_STYLES,
  A11Y,
  BREAKPOINTS,
};

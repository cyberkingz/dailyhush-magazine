/**
 * Nœma - Spacing Constants
 * Centralized spacing values for consistent layout
 */

export const spacing = {
  // Base spacing scale
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 56,

  // Safe area adjustments
  safeArea: {
    top: 8,
    bottom: 16,
  },

  // Screen-level padding
  screenPadding: 20, // Standard horizontal padding for all screens

  // Component-specific spacing
  card: {
    padding: 20,
    gap: 24,
  },

  container: {
    horizontal: 20,
    vertical: 40,
  },

  button: {
    height: 56, // h-14
    heightSmall: 48, // h-12
  },

  // Tab bar height (bottom navigation)
  tabBar: {
    height: 72,
  },
} as const;

export type Spacing = typeof spacing;

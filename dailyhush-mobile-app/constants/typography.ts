/**
 * DailyHush - Typography Constants
 * Centralized font sizes, weights, and text styles
 */

export const typography = {
  // Font sizes (in pixels for React Native)
  size: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
  },

  // Font weights (NativeWind classes)
  weight: {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  },

  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
} as const;

export type Typography = typeof typography;

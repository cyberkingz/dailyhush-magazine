/**
 * Nœma - Typography Constants
 * Age-friendly typography optimized for 55-70 year old demographic
 * WCAG AAA compliant font sizes and line heights
 */

export const typography = {
  // Age-friendly font sizes (minimum 16px for body text)
  // Increased by 2-4px for better readability for older users
  size: {
    xs: 14, // Increased from 12px - small labels only
    sm: 16, // Increased from 14px - secondary text
    base: 18, // Increased from 16px - primary body text
    lg: 20, // Increased from 18px - emphasized text
    xl: 24, // Increased from 20px - section headers
    '2xl': 32, // Increased from 24px - page headers
    '3xl': 40, // Increased from 28px - large numbers
    '4xl': 48, // Increased from 32px - hero numbers/stats
  },

  // Font weights (React Native numeric values)
  fontWeight: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },

  // Optimal line heights (1.5-1.6x for body, 1.2-1.3x for headings)
  lineHeight: {
    tight: 1.2, // For headings and large text
    normal: 1.5, // For body text
    relaxed: 1.6, // For longer text blocks
    loose: 1.8, // For maximum readability
  },
} as const;

export type Typography = typeof typography;

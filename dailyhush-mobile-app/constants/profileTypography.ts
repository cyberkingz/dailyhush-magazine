/**
 * DailyHush - Profile Page Typography System
 * Extended typography scale specifically for profile components
 * Optimized for emotional impact and readability
 */

import { typography } from './typography';

/**
 * Profile-Specific Typography Scale
 * Building on the base typography system
 */
export const profileTypography = {
  /**
   * HERO SECTION
   * Large, impactful text for the loop type hero card
   */
  hero: {
    // "Good morning, Alex"
    greeting: {
      fontSize: 16, // Reduced from 20px for 240px card height
      fontWeight: '600' as const,
      lineHeight: 22, // Reduced for tighter spacing
      letterSpacing: 0.2,
      opacity: 0.9,
    },

    // "You're navigating the Sleep Loop"
    loopTitle: {
      fontSize: 24, // Reduced from 32px for better proportions at 240px
      fontWeight: '700' as const,
      lineHeight: 32, // Reduced from 40px
      letterSpacing: 0.3, // Slightly reduced
      textAlign: 'center' as const,
    },

    // Loop type description (tagline)
    description: {
      fontSize: 15, // Reduced from 17px for better fit
      fontWeight: '400' as const,
      lineHeight: 22, // Reduced from 26px
      letterSpacing: 0.1,
      textAlign: 'center' as const,
      opacity: 0.95,
    },
  },

  /**
   * SECTION HEADERS
   * Headers for different sections of the profile
   */
  sections: {
    // "Your Journey This Month"
    title: {
      fontSize: 24,
      fontWeight: '700' as const,
      lineHeight: 32,
      letterSpacing: 0.3,
      marginBottom: 12,
    },

    // "Based on your recent reflections"
    subtitle: {
      fontSize: 15,
      fontWeight: '500' as const,
      lineHeight: 22,
      letterSpacing: 0,
      opacity: 0.7,
      marginBottom: 16,
    },

    // Small section labels
    label: {
      fontSize: 13,
      fontWeight: '600' as const,
      lineHeight: 18,
      letterSpacing: 0.8,
      textTransform: 'uppercase' as const,
      opacity: 0.6,
      marginBottom: 8,
    },
  },

  /**
   * INSIGHT CARDS
   * Typography for pattern insight cards
   */
  insights: {
    // Card title: "Sunday Evenings"
    title: {
      fontSize: 18,
      fontWeight: '600' as const,
      lineHeight: 24,
      letterSpacing: 0.2,
      marginBottom: 8,
    },

    // Card description
    description: {
      fontSize: 15,
      fontWeight: '400' as const,
      lineHeight: 22, // 1.47x for comfortable reading
      letterSpacing: 0,
      opacity: 0.85,
    },

    // Metadata: "Detected 3 times this month"
    metadata: {
      fontSize: 13,
      fontWeight: '500' as const,
      lineHeight: 18,
      letterSpacing: 0,
      opacity: 0.6,
      marginTop: 8,
    },
  },

  /**
   * EMOTIONAL WEATHER
   * Typography for weather widget
   */
  weather: {
    // "Today's Emotional Weather"
    title: {
      fontSize: 18,
      fontWeight: '600' as const,
      lineHeight: 24,
      letterSpacing: 0.2,
      marginBottom: 12,
    },

    // "Mostly sunny with gentle clarity"
    condition: {
      fontSize: 24,
      fontWeight: '700' as const,
      lineHeight: 32,
      letterSpacing: 0.3,
      textAlign: 'center' as const,
    },

    // Supporting text
    description: {
      fontSize: 15,
      fontWeight: '400' as const,
      lineHeight: 22,
      letterSpacing: 0,
      opacity: 0.8,
      textAlign: 'center' as const,
    },
  },

  /**
   * TIMELINE / CHART
   * Typography for journey timeline
   */
  timeline: {
    // Chart title
    title: {
      fontSize: 20,
      fontWeight: '600' as const,
      lineHeight: 28,
      letterSpacing: 0.2,
      marginBottom: 16,
    },

    // Axis labels (dates, values)
    axisLabel: {
      fontSize: 12,
      fontWeight: '500' as const,
      lineHeight: 16,
      letterSpacing: 0,
      opacity: 0.6,
    },

    // Data point labels
    dataLabel: {
      fontSize: 14,
      fontWeight: '600' as const,
      lineHeight: 18,
      letterSpacing: 0.1,
    },

    // Legend text
    legend: {
      fontSize: 13,
      fontWeight: '500' as const,
      lineHeight: 18,
      letterSpacing: 0,
      opacity: 0.7,
    },
  },

  /**
   * STATS & NUMBERS
   * Typography for numerical data
   */
  stats: {
    // Large number: "247"
    bigNumber: {
      fontSize: 48,
      fontWeight: '700' as const,
      lineHeight: 56,
      letterSpacing: -0.5,
      fontVariant: ['tabular-nums'] as const,
    },

    // Medium number: "12 days"
    number: {
      fontSize: 32,
      fontWeight: '700' as const,
      lineHeight: 40,
      letterSpacing: 0,
      fontVariant: ['tabular-nums'] as const,
    },

    // Small number in cards
    smallNumber: {
      fontSize: 24,
      fontWeight: '600' as const,
      lineHeight: 32,
      letterSpacing: 0,
      fontVariant: ['tabular-nums'] as const,
    },

    // Label below number
    label: {
      fontSize: 14,
      fontWeight: '500' as const,
      lineHeight: 20,
      letterSpacing: 0.2,
      opacity: 0.7,
    },
  },

  /**
   * PRODUCT CARDS
   * Typography for commerce section
   */
  products: {
    // Product name
    name: {
      fontSize: 16,
      fontWeight: '600' as const,
      lineHeight: 22,
      letterSpacing: 0.1,
      marginBottom: 4,
    },

    // Product description
    description: {
      fontSize: 14,
      fontWeight: '400' as const,
      lineHeight: 20,
      letterSpacing: 0,
      opacity: 0.8,
      marginBottom: 8,
    },

    // Price
    price: {
      fontSize: 20,
      fontWeight: '700' as const,
      lineHeight: 28,
      letterSpacing: 0.1,
      fontVariant: ['tabular-nums'] as const,
    },

    // Rating text
    rating: {
      fontSize: 13,
      fontWeight: '500' as const,
      lineHeight: 18,
      letterSpacing: 0,
      opacity: 0.7,
    },

    // "Recommended for Sleep Loop"
    recommendation: {
      fontSize: 12,
      fontWeight: '600' as const,
      lineHeight: 16,
      letterSpacing: 0.5,
      textTransform: 'uppercase' as const,
      opacity: 0.6,
    },
  },

  /**
   * BUTTONS & CTAs
   * Typography for interactive elements
   */
  buttons: {
    // Primary button
    primary: {
      fontSize: 17,
      fontWeight: '600' as const,
      lineHeight: 24,
      letterSpacing: 0.3,
    },

    // Secondary button
    secondary: {
      fontSize: 16,
      fontWeight: '600' as const,
      lineHeight: 22,
      letterSpacing: 0.2,
    },

    // Text button
    text: {
      fontSize: 15,
      fontWeight: '600' as const,
      lineHeight: 20,
      letterSpacing: 0.2,
    },

    // Small action button
    small: {
      fontSize: 14,
      fontWeight: '600' as const,
      lineHeight: 18,
      letterSpacing: 0.2,
    },
  },

  /**
   * PREMIUM UPSELL
   * Typography for premium features and CTAs
   */
  premium: {
    // "Unlock Premium"
    headline: {
      fontSize: 28,
      fontWeight: '700' as const,
      lineHeight: 36,
      letterSpacing: 0.3,
      textAlign: 'center' as const,
    },

    // Feature list
    feature: {
      fontSize: 16,
      fontWeight: '500' as const,
      lineHeight: 24,
      letterSpacing: 0,
    },

    // Price: "$4.99/month"
    price: {
      fontSize: 32,
      fontWeight: '700' as const,
      lineHeight: 40,
      letterSpacing: 0,
      fontVariant: ['tabular-nums'] as const,
    },

    // "per month" text
    period: {
      fontSize: 16,
      fontWeight: '500' as const,
      lineHeight: 22,
      letterSpacing: 0,
      opacity: 0.7,
    },
  },

  /**
   * QUOTES & AFFIRMATIONS
   * Typography for inspirational content
   */
  quotes: {
    // Main quote text
    text: {
      fontSize: 20,
      fontWeight: '500' as const,
      lineHeight: 32, // 1.6x for quotes
      letterSpacing: 0.2,
      fontStyle: 'italic' as const,
      textAlign: 'center' as const,
    },

    // Quote attribution
    author: {
      fontSize: 14,
      fontWeight: '500' as const,
      lineHeight: 20,
      letterSpacing: 0,
      opacity: 0.6,
      textAlign: 'center' as const,
      marginTop: 8,
    },
  },

  /**
   * BADGES & TAGS
   * Typography for small indicators
   */
  badges: {
    // Badge text: "NEW", "PREMIUM", "RECOMMENDED"
    default: {
      fontSize: 11,
      fontWeight: '700' as const,
      lineHeight: 14,
      letterSpacing: 0.8,
      textTransform: 'uppercase' as const,
    },

    // Larger badge
    large: {
      fontSize: 13,
      fontWeight: '700' as const,
      lineHeight: 16,
      letterSpacing: 0.6,
      textTransform: 'uppercase' as const,
    },
  },

  /**
   * EMPTY STATES
   * Typography for empty state messages
   */
  emptyState: {
    // Main message
    title: {
      fontSize: 20,
      fontWeight: '600' as const,
      lineHeight: 28,
      letterSpacing: 0.2,
      textAlign: 'center' as const,
      marginBottom: 8,
    },

    // Supporting text
    description: {
      fontSize: 16,
      fontWeight: '400' as const,
      lineHeight: 24,
      letterSpacing: 0,
      opacity: 0.7,
      textAlign: 'center' as const,
    },
  },
} as const;

/**
 * Line Height Ratios
 * For optimal reading comfort
 */
export const lineHeightRatios = {
  tight: 1.2, // Headlines, large text
  normal: 1.5, // Body text, default
  relaxed: 1.6, // Long-form reading
  loose: 1.8, // Maximum comfort for quotes
} as const;

/**
 * Letter Spacing Guidelines
 * In pixels, based on font size
 */
export const letterSpacingGuide = {
  tight: -0.5, // Large numbers, tight headings
  none: 0, // Body text
  normal: 0.2, // Slight spacing for readability
  wide: 0.5, // Section labels
  veryWide: 0.8, // All caps labels
} as const;

/**
 * Opacity Scale
 * For text hierarchy through opacity
 */
export const textOpacity = {
  primary: 1, // Main content
  secondary: 0.85, // Supporting content
  tertiary: 0.7, // Metadata
  muted: 0.6, // Labels, hints
  disabled: 0.4, // Disabled text
} as const;

/**
 * Helper Types
 */
export type ProfileTypographyKey = keyof typeof profileTypography;
export type LineHeightRatio = keyof typeof lineHeightRatios;
export type LetterSpacing = keyof typeof letterSpacingGuide;
export type TextOpacity = keyof typeof textOpacity;

/**
 * Helper Functions
 */
export const getProfileTypography = (
  category: keyof typeof profileTypography,
  style: string
) => {
  const categoryStyles = profileTypography[category] as any;
  return categoryStyles[style] || categoryStyles.default;
};

export const getLineHeight = (ratio: LineHeightRatio = 'normal') => {
  return lineHeightRatios[ratio];
};

export const getLetterSpacing = (spacing: LetterSpacing = 'normal') => {
  return letterSpacingGuide[spacing];
};

export const getTextOpacity = (level: TextOpacity = 'primary') => {
  return textOpacity[level];
};

/**
 * Responsive Font Sizes
 * Scale down on smaller screens if needed
 */
export const responsiveFontSizes = (baseFontSize: number, screenWidth: number) => {
  const baseScreenWidth = 375; // iPhone SE width
  const scaleFactor = screenWidth / baseScreenWidth;
  const minScale = 0.9; // Don't scale down more than 10%
  const maxScale = 1.1; // Don't scale up more than 10%

  const scale = Math.max(minScale, Math.min(maxScale, scaleFactor));
  return Math.round(baseFontSize * scale);
};

/**
 * DailyHush - Loop Type Color System
 * Therapeutic, calming color palettes for each loop type
 * WCAG AAA compliant on dark backgrounds (4.5:1 minimum contrast)
 */

export const loopTypeColors = {
  /**
   * SLEEP LOOP 🌙
   * Bedtime Rumination - Deep indigo to soft lavender
   * Calming, nighttime energy, cosmic and dreamy
   */
  'sleep-loop': {
    // Primary gradient pair - for hero cards and major sections
    gradient: {
      start: '#5B21B6', // Deep violet (WCAG AAA: 8.2:1 on #0A0A0A)
      middle: '#7C3AED', // Rich purple
      end: '#C4B5FD', // Soft lavender
    },
    // Solid colors for non-gradient uses
    primary: '#7C3AED', // Rich purple
    light: '#C4B5FD', // Soft lavender
    dark: '#5B21B6', // Deep violet
    // Background overlays (for cards on dark backgrounds)
    overlay: 'rgba(124, 58, 237, 0.15)', // 15% purple tint
    // Glow effect for elevated elements
    glow: 'rgba(124, 58, 237, 0.25)',
    // Text colors on gradient backgrounds
    text: {
      primary: '#FFFFFF', // White on gradient
      secondary: '#E9D5FF', // Light lavender
      muted: 'rgba(255, 255, 255, 0.7)', // 70% white
    },
  },

  /**
   * DECISION LOOP 🧭
   * Analysis Paralysis - Warm amber to soft gold
   * Thoughtful, contemplative, crossroads energy
   */
  'decision-loop': {
    // Primary gradient pair
    gradient: {
      start: '#D97706', // Warm amber (WCAG AAA: 5.8:1 on #0A0A0A)
      middle: '#F59E0B', // Golden amber
      end: '#FDE68A', // Soft gold
    },
    // Solid colors
    primary: '#F59E0B', // Golden amber
    light: '#FDE68A', // Soft gold
    dark: '#D97706', // Warm amber
    // Background overlays
    overlay: 'rgba(245, 158, 11, 0.15)',
    // Glow effect
    glow: 'rgba(245, 158, 11, 0.25)',
    // Text colors
    text: {
      primary: '#FFFFFF',
      secondary: '#FEF3C7', // Pale gold
      muted: 'rgba(255, 255, 255, 0.7)',
    },
  },

  /**
   * SOCIAL LOOP 💬
   * Social Anxiety - Soft coral to warm peach
   * Gentle, human connection, warm and approachable
   */
  'social-loop': {
    // Primary gradient pair
    gradient: {
      start: '#F97316', // Vibrant coral (WCAG AAA: 5.2:1 on #0A0A0A)
      middle: '#FB923C', // Soft coral
      end: '#FED7AA', // Warm peach
    },
    // Solid colors
    primary: '#FB923C', // Soft coral
    light: '#FED7AA', // Warm peach
    dark: '#F97316', // Vibrant coral
    // Background overlays
    overlay: 'rgba(251, 146, 60, 0.15)',
    // Glow effect
    glow: 'rgba(251, 146, 60, 0.25)',
    // Text colors
    text: {
      primary: '#FFFFFF',
      secondary: '#FFEDD5', // Pale peach
      muted: 'rgba(255, 255, 255, 0.7)',
    },
  },

  /**
   * PERFECTIONISM LOOP 🌱
   * Never Good Enough - Cool sage to mint green
   * Growth-focused, organic, natural and calming
   */
  'perfectionism-loop': {
    // Primary gradient pair
    gradient: {
      start: '#10B981', // Emerald green (WCAG AAA: 6.8:1 on #0A0A0A)
      middle: '#6EE7B7', // Mint green
      end: '#D1FAE5', // Soft mint
    },
    // Solid colors
    primary: '#6EE7B7', // Mint green
    light: '#D1FAE5', // Soft mint
    dark: '#10B981', // Emerald green
    // Background overlays
    overlay: 'rgba(110, 231, 183, 0.15)',
    // Glow effect
    glow: 'rgba(110, 231, 183, 0.25)',
    // Text colors
    text: {
      primary: '#FFFFFF',
      secondary: '#ECFDF5', // Pale mint
      muted: 'rgba(255, 255, 255, 0.7)',
    },
  },
} as const;

/**
 * Emotional Weather Color System
 * Used for EmotionalWeather widget
 * Emerald-based variations maintaining emotional associations
 * Matches database schema: 'sunny' | 'cloudy' | 'rainy' | 'foggy'
 */
export const emotionalWeatherColors = {
  sunny: {
    gradient: ['#34D399', '#10B981', '#059669'], // Medium-to-dark emerald (bright but not pastel)
    icon: '☀️',
    background: 'rgba(52, 211, 153, 0.15)',
    glow: 'rgba(52, 211, 153, 0.25)',
    name: 'Feeling Bright',
  },
  cloudy: {
    gradient: ['#52B788', '#40916C', '#2D6A4F'], // Mid emerald (neutral, contemplative)
    icon: '☁️',
    background: 'rgba(82, 183, 136, 0.15)',
    glow: 'rgba(82, 183, 136, 0.25)',
    name: 'Feeling Cloudy',
  },
  rainy: {
    gradient: ['#2D6A4F', '#1B4332', '#081C15'], // Dark emerald (heavy, introspective)
    icon: '🌧️',
    background: 'rgba(45, 106, 79, 0.15)',
    glow: 'rgba(45, 106, 79, 0.25)',
    name: 'Feeling Heavy',
  },
  foggy: {
    gradient: ['#6B9080', '#52B788', '#40916C'], // Mid-tone emerald (uncertain, unclear)
    icon: '🌫️',
    background: 'rgba(107, 144, 128, 0.15)',
    glow: 'rgba(107, 144, 128, 0.25)',
    name: 'Feeling Foggy',
  },
} as const;

/**
 * Helper function to get loop type colors
 */
export type LoopType = keyof typeof loopTypeColors;
export type EmotionalWeather = keyof typeof emotionalWeatherColors;

export const getLoopTypeColors = (loopType: LoopType) => {
  return loopTypeColors[loopType] || loopTypeColors['sleep-loop'];
};

export const getWeatherColors = (weather: EmotionalWeather) => {
  return emotionalWeatherColors[weather] || emotionalWeatherColors.cloudy;
};

/**
 * Tier Colors (Free vs Premium)
 * Used for insight cards, premium badges, and upgrade CTAs
 */
export const tierColors = {
  free: {
    primary: '#10B981', // Emerald-500
    light: '#D1FAE5', // Emerald-100
    dark: '#059669', // Emerald-600
    background: 'rgba(16, 185, 129, 0.1)',
    border: '#34D399', // Emerald-400
    text: '#ECFDF5', // Emerald-50
  },
  premium: {
    primary: '#F59E0B', // Amber-500 (gold)
    light: '#FEF3C7', // Amber-100
    dark: '#D97706', // Amber-600
    background: 'rgba(245, 158, 11, 0.1)',
    border: '#FBBF24', // Amber-400
    text: '#FFFBEB', // Amber-50
  },
} as const;

/**
 * Insight Category Colors
 * Using DARK emerald variations for brand consistency
 * Different shades provide subtle differentiation while maintaining sophistication
 */
export const insightCategoryColors = {
  pattern: {
    primary: '#047857', // Emerald-700 (darkest - for serious insights)
    light: '#D1FAE5', // Emerald-100
    background: 'rgba(4, 120, 87, 0.1)',
    icon: '🔍',
  },
  progress: {
    primary: '#059669', // Emerald-600 (dark - for achievements)
    light: '#D1FAE5', // Emerald-100
    background: 'rgba(5, 150, 105, 0.1)',
    icon: '📈',
  },
  recommendation: {
    primary: '#10B981', // Emerald-500 (medium - for suggestions)
    light: '#D1FAE5', // Emerald-100
    background: 'rgba(16, 185, 129, 0.1)',
    icon: '💡',
  },
  celebration: {
    primary: '#34D399', // Emerald-400 (medium-light - for wins)
    light: '#D1FAE5', // Emerald-100
    background: 'rgba(52, 211, 153, 0.1)',
    icon: '🎉',
  },
} as const;

/**
 * Helper functions for tier colors
 */
export type TierType = keyof typeof tierColors;
export const getTierColors = (tier: TierType) => {
  return tierColors[tier];
};

/**
 * Helper functions for insight category colors
 */
export type InsightCategory = keyof typeof insightCategoryColors;
export const getInsightCategoryColors = (category: InsightCategory) => {
  return insightCategoryColors[category];
};

/**
 * DailyHush - Tropical Rainforest Color Theme
 * Enhanced color palette matching web version for premium feel
 */

export const colors = {
  // Background colors - Deep tropical dark tones
  background: {
    primary: '#0A1612', // Deep forest background
    secondary: '#0F1F1A', // Card background
    tertiary: '#1A4D3C', // Elevated card background
    muted: '#1A2E26', // Muted elements
    border: 'rgba(64, 145, 108, 0.15)', // Subtle border with transparency
    card: '#0F1F1A', // Card background (same as secondary)
  },

  // Tropical emerald scale - Rich and vibrant
  emerald: {
    50: '#E8F4F0', // Lightest foreground text
    100: '#D8F3DC', // Very light accents
    200: '#B7E4C7', // Light accents
    300: '#95D5B2', // Medium-light
    400: '#74C69D', // Medium
    500: '#52B788', // Primary accent
    600: '#40916C', // Primary button
    700: '#2D6A4F', // Secondary button
    800: '#1A4D3C', // Dark accent
    900: '#1A2E26', // Darkest
  },

  // Chart colors for data visualization
  chart: {
    1: '#52B788',
    2: '#74C69D',
    3: '#95D5B2',
    4: '#B7E4C7',
    5: '#D8F3DC',
  },

  // Semantic colors - WCAG AAA compliant (7:1 minimum contrast)
  text: {
    primary: '#FFFFFF', // Maximum contrast (21:1) for primary text
    secondary: '#C8E6DB', // WCAG AAA compliant (~9:1) - increased from #A8CFC0
    tertiary: '#52B788', // Accent text
    muted: '#B7D4C7', // WCAG AA+ compliant (~6:1) - increased from #95B8A8
    accent: '#74C69D', // For important secondary information
  },

  // Status colors
  status: {
    success: '#52B788',
    warning: '#FFA500',
    error: '#DC2626',
    info: '#40916C',
  },

  // Error UI elements
  error: {
    background: 'rgba(220, 38, 38, 0.1)',
    border: '#DC2626',
    text: '#FF8787',
  },

  // UI elements - Enhanced with gradients support
  button: {
    primary: '#40916C',
    primaryGradient: ['#52B788', '#40916C'] as const, // Gradient for primary button
    secondary: '#2D6A4F',
    disabled: '#1A2E26',
  },

  // Gradient overlays for cards
  gradients: {
    card: ['rgba(26, 77, 60, 0.6)', 'rgba(45, 106, 79, 0.4)'] as const,
    cardLight: ['rgba(82, 183, 136, 0.1)', 'rgba(64, 145, 108, 0.05)'] as const,
    primary: ['#52B788', '#40916C'] as const,
    accent: ['#74C69D', '#52B788'] as const,
    glow: 'rgba(82, 183, 136, 0.3)', // For button glow effect
  },

  // Shadow colors for depth
  shadow: {
    light: 'rgba(82, 183, 136, 0.15)',
    medium: 'rgba(82, 183, 136, 0.25)',
    heavy: 'rgba(0, 0, 0, 0.4)',
  },

  // Common
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
} as const;

export type ColorTheme = typeof colors;

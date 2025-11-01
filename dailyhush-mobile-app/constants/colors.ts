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

  // Dark emerald scale - Tailwind standard (SINGLE SOURCE OF TRUTH)
  // This is our brand color system - dark emerald for sophisticated, therapeutic feel
  emerald: {
    50: '#ECFDF5', // Lightest - text on dark backgrounds only
    100: '#D1FAE5', // Very light - use sparingly
    200: '#A7F3D0', // Light - minimal use
    300: '#6EE7B7', // Medium-light - accents only
    400: '#34D399', // Medium - secondary accents
    500: '#10B981', // Medium-dark - secondary brand color
    600: '#059669', // PRIMARY BRAND COLOR - main dark emerald
    700: '#047857', // Deep emerald - primary use for depth
    800: '#065F46', // Deepest - backgrounds
    900: '#064E3B', // Darkest - deep backgrounds
  },

  // Chart colors for data visualization (dark emerald progression)
  chart: {
    1: '#047857', // Darkest (emerald-700)
    2: '#059669', // Dark (emerald-600)
    3: '#10B981', // Medium-dark (emerald-500)
    4: '#34D399', // Medium (emerald-400)
    5: '#6EE7B7', // Medium-light (emerald-300)
  },

  // Semantic colors - WCAG AAA compliant (7:1 minimum contrast)
  text: {
    primary: '#FFFFFF', // Maximum contrast (21:1) for primary text
    secondary: '#C8E6DB', // WCAG AAA compliant (~9:1) - increased from #A8CFC0
    tertiary: '#059669', // Accent text (dark emerald-600)
    muted: '#B7D4C7', // WCAG AA+ compliant (~6:1) - increased from #95B8A8
    accent: '#10B981', // For important secondary information (emerald-500)
  },

  // Status colors (dark emerald for success/info)
  status: {
    success: '#059669', // Dark emerald-600
    warning: '#FFA500',
    error: '#DC2626',
    info: '#047857', // Deep emerald-700
  },

  // Error UI elements
  error: {
    background: 'rgba(220, 38, 38, 0.1)',
    border: '#DC2626',
    text: '#FF8787',
  },

  // UI elements - Dark emerald buttons
  button: {
    primary: '#059669', // Dark emerald-600
    primaryGradient: ['#047857', '#059669'] as const, // Deep to dark emerald
    secondary: '#047857', // Deep emerald-700
    disabled: '#1A2E26',
  },

  // Gradient overlays for cards (dark emerald)
  gradients: {
    card: ['rgba(4, 120, 87, 0.6)', 'rgba(5, 150, 105, 0.4)'] as const, // emerald-700 to 600
    cardLight: ['rgba(5, 150, 105, 0.1)', 'rgba(16, 185, 129, 0.05)'] as const, // emerald-600 to 500
    primary: ['#047857', '#059669'] as const, // Deep to dark emerald
    accent: ['#10B981', '#059669'] as const, // Medium-dark to dark
    glow: 'rgba(5, 150, 105, 0.3)', // Dark emerald glow (emerald-600)
  },

  // Shadow colors for depth (dark emerald)
  shadow: {
    light: 'rgba(5, 150, 105, 0.15)', // emerald-600 shadow
    medium: 'rgba(5, 150, 105, 0.25)', // emerald-600 shadow
    heavy: 'rgba(0, 0, 0, 0.4)',
  },

  // Common
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
} as const;

export type ColorTheme = typeof colors;

/**
 * Nœma - Tropical Rainforest Color Theme
 * Enhanced color palette matching web version for premium feel
 */

export const colors = {
  // Background colors - Deep tropical dark tones
  background: {
    primary: '#0a1f1a', // Deep forest background
    secondary: '#0F1F1A', // Card background
    tertiary: '#1A4D3C', // Elevated card background
    muted: '#1A2E26', // Muted elements
    border: 'rgba(64, 145, 108, 0.15)', // Subtle border with transparency
    card: '#0F1F1A', // Card background (same as secondary)
  },

  // PRIMARY BRAND: Neon Lime Scale - Modern, energizing, high-visibility
  // Use for primary actions, active states, progress, success
  lime: {
    50: '#F4FFE5', // Lightest - text highlights only
    100: '#E5FFCC', // Very light - subtle accents
    200: '#CCFFAA', // Light - hover states
    300: '#B3FF88', // Medium-light - secondary highlights
    400: '#99FF66', // Medium - active states
    500: '#7AF859', // PRIMARY BRAND COLOR - main neon lime (matching target)
    600: '#65D948', // Dark - pressed states
    700: '#50BA37', // Deeper - borders/shadows
    800: '#3B9B26', // Deepest - subtle backgrounds
    900: '#267C15', // Darkest - very subtle accents
  },

  // SECONDARY BRAND: Dark Emerald Scale - Supporting, calming, therapeutic
  // Use for secondary actions, calm backgrounds, informational elements
  emerald: {
    50: '#ECFDF5', // Lightest - text on dark backgrounds only
    100: '#D1FAE5', // Very light - use sparingly
    200: '#A7F3D0', // Light - minimal use
    300: '#6EE7B7', // Medium-light - accents only
    400: '#34D399', // Medium - secondary accents
    500: '#10B981', // Medium-dark - secondary brand color
    600: '#059669', // SECONDARY BRAND - dark emerald for calm elements
    700: '#047857', // Deep emerald - backgrounds and depth
    800: '#065F46', // Deepest - backgrounds
    900: '#064E3B', // Darkest - deep backgrounds
  },

  // CRISIS NEON LIME - MONOPOLY BRANDING
  // Use ONLY for crisis interruption CTAs ("I'M SPIRALING" buttons)
  // This creates unmistakable visual hierarchy: calm emerald app vs URGENT crisis button
  crisis: {
    lime: '#7AF859', // Neon lime - impossible to miss
    limeGlow: 'rgba(122, 248, 89, 0.3)', // Glow effect
    limeDark: '#65D948', // Darker lime for pressed state
    limeBackground: 'rgba(122, 248, 89, 0.1)', // Subtle background
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
    tertiary: '#7AF859', // Accent text (lime-500) - matching target
    muted: '#B7D4C7', // WCAG AA+ compliant (~6:1) - increased from #95B8A8
    accent: '#65D948', // Interactive text (lime-600) - high visibility
    emeraldAccent: '#10B981', // Emerald accent for calm/secondary info
  },

  // Status colors - Lime for modern success/info, emerald alternative
  status: {
    success: '#7AF859', // Lime-500 for modern success (energizing)
    successAlt: '#059669', // Emerald-600 alternative for calm success
    warning: '#FFA500',
    error: '#DC2626',
    info: '#7AF859', // Lime-500 for info highlights
  },

  // Error UI elements
  error: {
    background: 'rgba(220, 38, 38, 0.1)',
    border: '#DC2626',
    text: '#FF8787',
  },

  // UI elements - Lime primary, emerald secondary
  button: {
    primary: '#7AF859', // Lime-500 - primary brand
    primaryText: '#0A1F1A', // Deep forest text for contrast on lime buttons (WCAG AAA)
    primaryGradient: ['#65D948', '#7AF859'] as const, // Lime-600 to lime-500
    secondary: '#047857', // Emerald-700 for secondary actions
    tertiary: '#0F1F1A', // Dark background for ghost buttons
    disabled: '#1A2E26',
    danger: '#DC2626', // Red for destructive actions
  },

  // Gradient overlays - Lime primary, emerald secondary
  gradients: {
    primary: ['#65D948', '#7AF859'] as const, // Lime gradient (lime-600 to lime-500)
    secondary: ['#047857', '#059669'] as const, // Emerald gradient (emerald-700 to 600)
    card: ['rgba(122, 248, 89, 0.15)', 'rgba(101, 217, 72, 0.1)'] as const, // Lime card overlay
    cardSubtle: ['rgba(4, 120, 87, 0.3)', 'rgba(5, 150, 105, 0.2)'] as const, // Emerald subtle
    accent: ['#10B981', '#059669'] as const, // Medium-dark to dark emerald
    glow: 'rgba(122, 248, 89, 0.4)', // Lime glow
    glowStrong: 'rgba(122, 248, 89, 0.6)', // Strong lime glow
    glowSubtle: 'rgba(122, 248, 89, 0.2)', // Subtle lime aura
  },

  // Shadow colors - Lime for emphasis, emerald for subtle depth
  shadow: {
    lime: 'rgba(122, 248, 89, 0.3)', // Primary lime shadow for emphasis
    limeStrong: 'rgba(122, 248, 89, 0.5)', // Strong lime emphasis
    emerald: 'rgba(5, 150, 105, 0.2)', // Secondary emerald shadow
    dark: 'rgba(0, 0, 0, 0.4)', // Depth shadow
  },

  // Interactive states - Lime for all interactions
  interactive: {
    hover: '#B3FF88', // lime-300
    active: '#99FF66', // lime-400
    pressed: '#65D948', // lime-600
    focus: 'rgba(122, 248, 89, 0.3)', // lime glow for focus ring
  },

  // Common
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
} as const;

export type ColorTheme = typeof colors;

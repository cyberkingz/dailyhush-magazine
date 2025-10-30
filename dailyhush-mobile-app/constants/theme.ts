/**
 * DailyHush Design System - Theme Constants
 * Based on PRD Section 8.2: Visual Design System
 *
 * Brand colors match the DailyHush admin dashboard for consistency
 * Updated to match tailwind.config.js from webapp
 */

export const Colors = {
  // Primary Brand Colors - Emerald (matches admin dashboard exactly)
  primary: {
    emerald50: '#ecfdf5',
    emerald100: '#d1fae5',
    emerald200: '#a7f3d0',
    emerald300: '#6ee7b7',
    emerald400: '#34d399',
    emerald500: '#10b981',
    emerald600: '#059669', // Main brand color
    emerald700: '#047857',
    emerald800: '#065f46',
    emerald900: '#064e3b',
  },

  // Secondary Colors - Sage (matches admin dashboard supporting colors)
  secondary: {
    sage100: '#e8f0ed',
    sage200: '#d1e1da',
    sage300: '#b9d2c7',
    sage400: '#a2c3b4',
    sage500: '#8bb4a1',
    sage600: '#6d9280',
    sage700: '#527060',
    sage800: '#364d40',
    sage900: '#1b2620',
    // Backward compatibility (amber was previous accent)
    amber500: '#8bb4a1', // Map to sage500 for subtle transition
    amber100: '#e8f0ed', // Map to sage100
  },

  // Background Colors - Dark Emerald Theme (matches admin dashboard dark mode)
  background: {
    // Default: Dark emerald aesthetic
    primary: '#064e3b', // emerald-900 (main dark emerald background - matches admin)
    secondary: '#047857', // emerald-700 (elevated surfaces)
    tertiary: '#059669', // emerald-600 (cards, borders)
    // Light mode alternatives (kept for compatibility)
    cream50: '#fefdf9',
    cream100: '#fdfbf3',
    cream200: '#fbf7e7',
    white: '#FFFFFF',
  },

  // Neutral Colors (matches admin dashboard exactly)
  neutral: {
    neutral0: '#ffffff',
    neutral50: '#f8fafc',
    neutral100: '#f1f5f9',
    neutral200: '#e2e8f0',
    neutral300: '#cbd5e1',
    neutral400: '#94a3b8',
    neutral500: '#64748b',
    neutral600: '#475569',
    neutral700: '#334155',
    neutral800: '#1e293b',
    neutral900: '#0f172a',
    neutral950: '#020617',
  },

  // Text Colors (using neutral scale from admin)
  text: {
    primary: '#0f172a', // neutral-900
    secondary: '#475569', // neutral-600
    tertiary: '#64748b', // neutral-500
    muted: '#94a3b8', // neutral-400
    // Backward compatibility aliases
    slate900: '#0f172a',
    slate700: '#334155',
    slate600: '#475569',
    slate500: '#64748b',
    slate300: '#cbd5e1',
  },

  // Functional Colors (matches admin dashboard)
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
  },

  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
  },

  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
  },

  // 3AM Mode (Dark Mode)
  nightMode: {
    background: '#064e3b', // emerald-900 (dark emerald background - matches admin)
    surface: '#047857', // emerald-700 (elevated surfaces)
    text: '#F1F5F9', // neutral-50 (white text)
    textMuted: '#94A3B8', // neutral-400 (muted text)
    red: '#7F1D1D', // Low-intensity red for dark mode
  },
};

export const Typography = {
  // Font Sizes (minimum 18pt for 65+ users)
  fontSize: {
    heading1: 32,
    heading2: 28,
    heading3: 24,
    body: 18, // Minimum per PRD
    button: 20,
    caption: 16, // Never smaller per PRD
  },

  // Font Weights
  fontWeight: {
    regular: '400' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },

  // Line Heights
  lineHeight: {
    heading: 1.2,
    body: 1.5,
  },
};

export const Spacing = {
  // Spacing scale
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,

  // Touch targets (minimum 44x44pt for accessibility)
  touchTarget: 44,
  buttonHeight: 60, // Large buttons for 65+ users
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
};

/**
 * Accessibility Constants
 * PRD Section 7.5: Accessibility Requirements for 65+ users
 */
export const Accessibility = {
  // Minimum text contrast ratio (WCAG AA)
  minContrastRatio: 4.5,

  // Minimum touch target size
  minTouchTarget: 44,

  // Large text mode scaling
  largeTextScale: 1.2,

  // Voice commands
  voiceCommandTimeout: 5000, // ms
};

/**
 * Animation Constants
 * Gentle, reassuring animations for older users
 */
export const Animation = {
  duration: {
    fast: 200,
    normal: 300,
    slow: 500,
  },

  easing: {
    easeInOut: [0.4, 0.0, 0.2, 1],
    easeOut: [0.0, 0.0, 0.2, 1],
  },
};

export default {
  Colors,
  Typography,
  Spacing,
  BorderRadius,
  Shadows,
  Accessibility,
  Animation,
};

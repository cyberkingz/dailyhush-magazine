/**
 * DailyHush - Authentication Screen Styles
 * Simple, clean design system
 */

import { DimensionValue } from 'react-native';
import { colors } from './colors';

/**
 * Typography
 */
export const authTypography = {
  headline: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: '#E8F4F0',
  },

  subheadline: {
    fontSize: 17,
    fontWeight: '400' as const,
    color: '#A8CFC0',
  },

  label: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#E8F4F0',
  },

  inputText: {
    fontSize: 17,
    fontWeight: '400' as const,
    color: '#E8F4F0',
  },

  helperText: {
    fontSize: 15,
    fontWeight: '400' as const,
    color: '#95B8A8',
  },

  errorText: {
    fontSize: 15,
    fontWeight: '500' as const,
    color: '#FF8787',
  },

  buttonText: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.background.primary, // Dark text on lime button
  },

  linkText: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: colors.lime[500], // Lime-500 for link text
  },

  footerText: {
    fontSize: 15,
    fontWeight: '400' as const,
    color: '#A8CFC0',
  },
};

/**
 * Input Field Styles
 */
export const inputFieldStyles = {
  container: {
    marginBottom: 24,
  },

  label: {
    marginBottom: 10,
    ...authTypography.label,
  },

  input: {
    height: 56,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: colors.background.secondary,
    borderWidth: 2,
    borderColor: colors.background.border,
    borderRadius: 12,
    ...authTypography.inputText,
  },

  inputFocused: {
    borderColor: colors.lime[500], // Lime-500 for focus state
    backgroundColor: colors.background.secondary,
  },

  inputError: {
    borderColor: '#FF8787',
  },

  passwordToggle: {
    position: 'absolute' as const,
    right: 16,
    top: 14, // Centers 20px icon + 16px padding (8 top + 8 bottom) in 56px input: (56 - 28) / 2 = 14
    padding: 8,
  },

  helperText: {
    ...authTypography.helperText,
    marginTop: 8,
  },

  errorText: {
    ...authTypography.errorText,
    marginTop: 8,
  },
};

/**
 * Input Colors
 */
export const inputColors = {
  text: {
    input: '#E8F4F0',
    placeholder: '#95B8A8',
    label: '#E8F4F0',
    helper: '#95B8A8',
    error: '#FF8787',
  },
};

/**
 * Button Styles
 */
export const authButtons = {
  primary: {
    container: {
      width: '100%' as DimensionValue,
      height: 56,
      marginBottom: 16,
    },

    style: {
      backgroundColor: colors.lime[500], // Lime-500 primary button
      borderRadius: 12,
      height: 56,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },

    pressedStyle: {
      backgroundColor: colors.lime[600], // Lime-600 pressed state
    },

    disabledStyle: {
      backgroundColor: '#1A2E26',
      opacity: 0.5,
    },

    text: {
      ...authTypography.buttonText,
    },

    hitSlop: { top: 8, bottom: 8, left: 8, right: 8 },
  },

  secondary: {
    container: {
      width: '100%' as DimensionValue,
      height: 56,
      marginBottom: 24,
    },

    style: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: colors.lime[500], // Lime-500 border for secondary button
      borderRadius: 12,
      height: 56,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },

    pressedStyle: {
      backgroundColor: colors.lime[500] + '1A', // Lime background on press (10% opacity)
    },

    text: {
      ...authTypography.buttonText,
      color: '#E8F4F0',
    },

    hitSlop: { top: 8, bottom: 8, left: 8, right: 8 },
  },

  link: {
    container: {
      paddingVertical: 16,
      paddingHorizontal: 24,
      alignItems: 'center' as const,
      minHeight: 56,
    },

    text: {
      ...authTypography.linkText,
      textDecorationLine: 'underline' as const,
    },

    pressedText: {
      color: colors.lime[600], // Lime-600 for pressed link
    },

    hitSlop: { top: 12, bottom: 12, left: 12, right: 12 },
  },
};

/**
 * Layout & Spacing
 */
export const authSpacing = {
  screenPadding: {
    horizontal: 24,
    top: 60,
    bottom: 40,
  },

  headlineToSubhead: 12,
  subheadToForm: 40,
};

/**
 * Screen Layouts
 */
export const screenLayout = {
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },

  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },

  centerWrapper: {
    flex: 1,
    justifyContent: 'center' as const,
    maxWidth: 420,
    width: '100%' as DimensionValue,
    alignSelf: 'center' as const,
  },

  formWrapper: {
    marginBottom: 32,
  },

  footerSection: {
    marginTop: 24,
    alignItems: 'center' as const,
  },
};

/**
 * Error Alert
 */
export const errorAlert = {
  container: {
    backgroundColor: '#0F1F1A',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FF8787',
    padding: 16,
    marginBottom: 24,
  },

  header: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 8,
  },

  title: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: '#FF8787',
    marginLeft: 8,
  },

  message: {
    fontSize: 15,
    lineHeight: 22,
    color: '#E8F4F0',
    marginTop: 4,
  },
};

export const statusColors = {
  error: {
    border: '#FF8787',
    text: '#FF8787',
    background: 'rgba(255, 135, 135, 0.1)',
    icon: '#FF8787',
  },

  success: {
    border: colors.lime[500], // Lime-500 for success
    text: colors.lime[500],
    background: colors.lime[500] + '1A', // 10% opacity
    icon: colors.lime[500],
  },
};

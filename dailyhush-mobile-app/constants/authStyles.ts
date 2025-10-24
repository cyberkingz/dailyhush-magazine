/**
 * DailyHush - Authentication Screen Styles
 * Complete design system from UI designer consultation
 * Optimized for 55-70 demographic
 */

import { colors } from './colors';

/**
 * Typography System
 */
export const authTypography = {
  headline: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
    color: '#E8F4F0',
  },

  subheadline: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '400' as const,
    letterSpacing: 0,
    color: '#A8CFC0',
  },

  label: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600' as const,
    letterSpacing: 0.2,
    color: '#E8F4F0',
  },

  inputText: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '400' as const,
    letterSpacing: 0,
    color: '#E8F4F0',
  },

  helperText: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '400' as const,
    letterSpacing: 0,
    color: '#95B8A8',
  },

  errorText: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '500' as const,
    letterSpacing: 0,
    color: '#DC2626',
  },

  buttonText: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600' as const,
    letterSpacing: 0.3,
    color: '#FFFFFF',
  },

  linkText: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '500' as const,
    letterSpacing: 0.1,
    color: '#52B788',
  },

  footerText: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '400' as const,
    letterSpacing: 0,
    color: '#A8CFC0',
  },
};

/**
 * Input Field Styles
 */
export const inputFieldStyles = {
  container: {
    marginBottom: 20,
  },

  label: {
    marginBottom: 8,
    ...authTypography.label,
  },

  input: {
    height: 56,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#0F1F1A',
    borderWidth: 2,
    borderColor: 'rgba(64, 145, 108, 0.25)',
    borderRadius: 12,
    ...authTypography.inputText,
  },

  inputFocused: {
    backgroundColor: '#1A2E26',
    borderColor: '#40916C',
    borderWidth: 2,
    shadowColor: '#52B788',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },

  inputError: {
    backgroundColor: '#0F1F1A',
    borderColor: '#DC2626',
    borderWidth: 2,
  },

  placeholder: {
    color: '#95B8A8',
    opacity: 0.7,
  },

  helperText: {
    ...authTypography.helperText,
    marginTop: 8,
  },

  passwordToggle: {
    position: 'absolute' as const,
    right: 16,
    top: 16,
    padding: 8,
    zIndex: 1,
  },
};

/**
 * Input Field Colors
 */
export const inputColors = {
  background: {
    normal: '#0F1F1A',
    focus: '#1A2E26',
    error: '#0F1F1A',
  },

  border: {
    normal: 'rgba(64, 145, 108, 0.25)',
    focus: '#40916C',
    error: '#DC2626',
  },

  text: {
    input: '#E8F4F0',
    placeholder: '#95B8A8',
    label: '#E8F4F0',
    helper: '#95B8A8',
    error: '#DC2626',
  },

  shadow: {
    focus: '#52B788',
    error: '#DC2626',
  },
};

/**
 * Button Styles
 */
export const authButtons = {
  // Primary button (email actions)
  primary: {
    container: {
      width: '100%',
      height: 56,
      marginBottom: 16,
    },

    style: {
      backgroundColor: '#40916C',
      borderRadius: 12,
      height: 56,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      shadowColor: '#52B788',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },

    pressedStyle: {
      backgroundColor: '#2D6A4F',
      transform: [{ scale: 0.98 }],
    },

    disabledStyle: {
      backgroundColor: '#1A2E26',
      opacity: 0.5,
    },

    text: {
      ...authTypography.buttonText,
      color: '#FFFFFF',
    },

    hitSlop: { top: 8, bottom: 8, left: 8, right: 8 },
  },

  // Secondary button (outlined)
  secondary: {
    container: {
      width: '100%',
      height: 56,
      marginBottom: 24,
    },

    style: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: '#40916C',
      borderRadius: 12,
      height: 56,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },

    pressedStyle: {
      backgroundColor: 'rgba(64, 145, 108, 0.1)',
      borderColor: '#52B788',
    },

    text: {
      ...authTypography.buttonText,
      fontSize: 17,
      color: '#E8F4F0',
    },

    hitSlop: { top: 8, bottom: 8, left: 8, right: 8 },
  },

  // Text link button
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
      textDecorationColor: '#52B788',
    },

    pressedText: {
      color: '#74C69D',
      textDecorationColor: '#74C69D',
    },

    hitSlop: { top: 12, bottom: 12, left: 12, right: 12 },
  },
};

/**
 * Apple Sign-In Button (scaffolded for future)
 */
export const appleButton = {
  container: {
    width: '100%',
    height: 60,
    marginBottom: 16,
  },

  style: {
    backgroundColor: '#000000',
    borderRadius: 12,
    height: 60,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  pressedStyle: {
    backgroundColor: '#1C1C1E',
    transform: [{ scale: 0.97 }],
  },

  text: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600' as const,
    letterSpacing: 0.3,
  },

  icon: {
    marginRight: 12,
    width: 24,
    height: 24,
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

  labelToInput: 8,
  inputToHelper: 8,
  inputToInput: 20,
  inputToButton: 32,

  buttonToButton: 16,
  buttonToLink: 24,

  linkToFooter: 32,
};

/**
 * Touch Targets (55-70 demographic)
 */
export const touchTargets = {
  button: {
    primary: 60,
    secondary: 56,
    tertiary: 56,
    minimum: 44,
  },

  input: {
    height: 56,
  },

  hitSlop: {
    small: { top: 8, bottom: 8, left: 8, right: 8 },
    medium: { top: 12, bottom: 12, left: 12, right: 12 },
    large: { top: 16, bottom: 16, left: 16, right: 16 },
  },
};

/**
 * Screen Layouts
 */
export const screenLayout = {
  container: {
    flex: 1,
    backgroundColor: '#0A1612',
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
    width: '100%',
    alignSelf: 'center' as const,
  },

  formWrapper: {
    flex: 1,
    maxWidth: 420,
    width: '100%',
    alignSelf: 'center' as const,
  },

  headerSection: {
    marginBottom: 32,
  },

  footerSection: {
    marginTop: 'auto' as const,
    paddingTop: 24,
    alignItems: 'center' as const,
  },
};

/**
 * Error & Success Alerts
 */
export const statusColors = {
  error: {
    border: '#DC2626',
    text: '#DC2626',
    background: 'rgba(220, 38, 38, 0.1)',
    icon: '#DC2626',
  },

  success: {
    border: '#52B788',
    text: '#52B788',
    background: 'rgba(82, 183, 136, 0.1)',
    icon: '#52B788',
  },
};

export const errorAlert = {
  container: {
    backgroundColor: '#0F1F1A',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#DC2626',
    padding: 16,
    marginBottom: 24,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },

  header: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 8,
  },

  icon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },

  title: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: '#DC2626',
  },

  message: {
    fontSize: 15,
    lineHeight: 21,
    color: '#E8F4F0',
    marginTop: 4,
  },
};

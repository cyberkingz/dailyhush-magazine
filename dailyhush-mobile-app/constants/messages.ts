/**
 * Nœma - User-facing Messages
 * Centralized messages for consistency and easy localization
 */

export const messages = {
  // Account detection messages
  account: {
    alreadyExists: 'This email already has an account. Redirecting to sign in...',
    notFound:
      "We couldn't find a quiz with this email. Double-check your email or continue as a new user.",
    checkingAccount: 'Checking for existing account...',
  },

  // Validation messages
  validation: {
    emailRequired: 'Please enter your email address',
    emailInvalid: 'Please enter a valid email address',
    passwordRequired: 'Please enter your password',
    passwordTooShort: 'Password must be at least 8 characters',
  },

  // Generic error messages
  error: {
    generic: 'An unexpected error occurred. Please try again.',
    network: 'Network error. Please check your connection and try again.',
    database: 'Something went wrong. Please try again.',
  },

  // Success messages
  success: {
    quizSubmitted: 'Quiz submitted successfully!',
    accountCreated: 'Account created successfully!',
    signedIn: 'Signed in! Redirecting...',
    passwordReset: 'Password reset email sent!',
  },

  // Onboarding messages
  onboarding: {
    quizNotFound: "We couldn't find a quiz with this email.",
    continueAsNewUser: 'You can still use Nœma and take the quiz later.',
  },
} as const;

export type Messages = typeof messages;

/**
 * DailyHush - Route Constants
 * Centralized route paths for type-safe navigation
 */

export const routes = {
  // Main app routes
  home: '/',
  spiral: '/spiral',
  insights: '/insights',
  settings: '/settings',

  // Onboarding routes
  onboarding: {
    welcome: '/onboarding',
    quizRecognition: '/onboarding/quiz-recognition',
    emailLookup: '/onboarding/email-lookup',
    quiz: '/onboarding/quiz',
    quizSignup: '/onboarding/quiz/signup',
    quizResults: '/onboarding/quiz/results',
    passwordSetup: '/onboarding/password-setup',
    profileSetup: '/onboarding/profile-setup',
  },

  // Auth routes
  auth: {
    index: '/auth',
    login: '/auth/login',
    signup: '/auth/signup',
    forgotPassword: '/auth/forgot-password',
  },

  // Training routes
  training: {
    index: '/training/index',
    focus: '/training/focus',
    interrupt: '/training/interrupt',
    reframe: '/training/reframe',
    execute: '/training/execute',
  },
} as const;

export type Routes = typeof routes;

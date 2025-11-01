/**
 * DailyHush - Subscription Copy Constants
 * Emotional, supportive messaging for subscription features
 * Following brand voice: warm, empathetic, transformation-focused
 * Created: 2025-11-01
 */

export const SUBSCRIPTION_COPY = {
  // Subscription Management Screen
  management: {
    header: 'Your Journey',
    subheader: 'Every journey needs support. We are here for yours.',

    // Status messages
    status: {
      active: 'Your path to peace continues',
      trial: (daysRemaining: number) =>
        `Exploring your way forward • ${daysRemaining} ${daysRemaining === 1 ? 'day' : 'days'} remaining`,
      paymentIssue: 'Let us keep your progress going',
      canceled: (endDate: string) => `Your access continues until ${endDate}`,
      expired: 'Your journey paused',
    },

    // Action buttons
    actions: {
      changePlan: 'Explore Other Paths',
      manage: 'Manage Your Journey',
      restore: 'Welcome Back',
      contactSupport: 'We are Here to Help',
    },

    // Plan details
    planCard: {
      nextBilling: (date: string) => `Renews ${date}`,
      trialEnds: (date: string) => `Trial ends ${date}`,
      canceledAccess: (date: string) => `Access until ${date}`,
    },
  },

  // Payment Failed Screen
  paymentFailed: {
    header: 'Let us Keep Your Journey Going',
    body: 'We could not process your recent payment, but your progress matters to us. Update your payment method to continue quieting the noise.',
    gracePeriod: (date: string) =>
      `You have access until ${date} while we sort this out together.`,
    cta: 'Update Payment Method',
    secondary: 'Not now',
    support: 'Need help? We are here for you.',

    // Different tones for different payment errors
    errors: {
      cardDeclined: 'Your card was declined. This happens - let us update it.',
      cardExpired: 'Your card has expired. Time for a refresh.',
      insufficientFunds: 'There were not enough funds. We will try again when you are ready.',
      generic: 'Something went wrong with your payment. Let us fix it together.',
    },
  },

  // Restore Purchases
  restore: {
    button: 'Restore Purchases',
    loading: 'Looking for your journey...',
    success: {
      title: 'Welcome Back',
      message: 'Your Premium access has been restored. Ready to continue?',
      cta: 'Continue',
    },
    notFound: {
      title: 'No Active Subscription',
      message: 'We could not find an active subscription. If you think this is wrong, we are here to help.',
      cta: 'Contact Support',
    },
    error: {
      title: 'Something Went Wrong',
      message: 'We could not restore your purchases right now. Let us try again.',
      cta: 'Try Again',
    },
  },

  // Subscription Status Badges
  badges: {
    active: 'Active',
    trial: 'Trial',
    paymentIssue: 'Payment Issue',
    canceled: 'Canceled',
    expired: 'Expired',
  },

  // Change Plan
  changePlan: {
    header: 'Choose Your Path',
    upgrade: {
      cta: 'Upgrade',
      message: 'Deepen your journey with more support',
    },
    downgrade: {
      cta: 'Change Plan',
      message: 'We understand. Choose what feels right for you.',
    },
  },

  // Legal
  legal: {
    termsOfService: 'Terms of Service',
    privacyPolicy: 'Privacy Policy',
    autoRenewal: 'Subscriptions renew automatically unless canceled 24 hours before the end of your current period.',
    cancellation: 'You can cancel anytime through your App Store or Google Play settings.',
  },

  // Subscription Purchase (enhanced from existing)
  purchase: {
    header: 'Begin Your Journey to Peace',
    subheader: 'Choose the path that feels right for you',
    trialOffer: 'Start your 7-day journey',
    trialDisclaimer: 'Cancel anytime before trial ends to avoid charges.',
    processing: 'Starting your journey...',
    success: {
      title: 'Welcome to Your Journey',
      message: 'You now have everything you need to quiet the noise and find your peace.',
      cta: 'Begin',
    },
  },
} as const;

/**
 * Format date for display (e.g., "Dec 15" or "Dec 15, 2025")
 */
export function formatSubscriptionDate(date: Date | string, includeYear: boolean = false): string {
  const d = typeof date === 'string' ? new Date(date) : date;

  const month = d.toLocaleDateString('en-US', { month: 'short' });
  const day = d.getDate();
  const year = d.getFullYear();

  if (includeYear) {
    return `${month} ${day}, ${year}`;
  }

  return `${month} ${day}`;
}

/**
 * Get time remaining text (e.g., "3 days", "2 hours", "1 month")
 */
export function getTimeRemainingText(endDate: Date | string): string {
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  const now = new Date();
  const diffMs = end.getTime() - now.getTime();

  if (diffMs <= 0) {
    return 'Expired';
  }

  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMonths = Math.floor(diffDays / 30);

  if (diffMonths > 0) {
    return `${diffMonths} ${diffMonths === 1 ? 'month' : 'months'}`;
  }

  if (diffDays > 0) {
    return `${diffDays} ${diffDays === 1 ? 'day' : 'days'}`;
  }

  if (diffHours > 0) {
    return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'}`;
  }

  return 'Less than an hour';
}

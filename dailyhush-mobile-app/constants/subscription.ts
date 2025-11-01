/**
 * DailyHush - Subscription Constants
 * Features and subscription-related configuration
 *
 * NOTE: Pricing data below is for REFERENCE ONLY and is NOT used in production.
 * Actual pricing and currency is loaded dynamically from RevenueCat/App Store/Play Store.
 * RevenueCat provides localized pricing (e.g., "$9.99", "€9.99", "¥1,200") automatically.
 */

/**
 * @deprecated Use RevenueCat offerings instead. This is kept for reference/documentation only.
 * Production app loads pricing from RevenueCat SDK which handles international currencies.
 */
export const SUBSCRIPTION_PRICING = {
  monthly: {
    id: 'monthly',
    title: 'Monthly',
    price: '$9.99',
    priceValue: 9.99,
    period: '/month',
    description: 'Perfect for trying Premium',
  },
  annual: {
    id: 'annual',
    title: 'Annual',
    price: '$59.99',
    priceValue: 59.99,
    period: '/year',
    badge: 'MOST POPULAR',
    savings: 'Save 50%',
    description: 'Best value - 2 months free',
  },
  lifetime: {
    id: 'lifetime',
    title: 'Lifetime',
    price: '$149.99',
    priceValue: 149.99,
    period: 'one-time',
    badge: 'BEST VALUE',
    savings: 'Pay once, keep forever',
    description: 'Never pay again',
  },
} as const;

export const PREMIUM_FEATURES = [
  'Personalized loop-breaking exercises',
  'Advanced rumination interrupt techniques',
  'Progress tracking & insights',
  'Voice journaling (coming soon)',
  'Priority support',
  'Ad-free experience',
] as const;

export const FREE_FEATURES = [
  'Spiral interrupt exercises',
  'Daily content',
  'Community support',
  'Basic progress tracking',
] as const;

export const SUBSCRIPTION_TERMS =
  'Subscriptions auto-renew unless canceled 24 hours before the end of the current period. Cancel anytime in your App Store settings.';

export const PRICING_PREVIEW_TEXT = `${SUBSCRIPTION_PRICING.monthly.price}/month • ${SUBSCRIPTION_PRICING.annual.price}/year (save 50%) • ${SUBSCRIPTION_PRICING.lifetime.price} lifetime`;

export const FREE_PLAN_DESCRIPTION =
  'Free features always available. Upgrade anytime to unlock Premium.';

// TypeScript Type Exports
export type SubscriptionPricingConfig = typeof SUBSCRIPTION_PRICING;
export type SubscriptionTier = keyof typeof SUBSCRIPTION_PRICING;
export type PremiumFeature = (typeof PREMIUM_FEATURES)[number];
export type FreeFeature = (typeof FREE_FEATURES)[number];

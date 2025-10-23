/**
 * DailyHush - Stripe Integration
 * Subscription management for Premium tier ($9.99/month)
 *
 * Pricing Tiers:
 * - Free: Basic spiral interrupt, limited insights
 * - Premium: $9.99/month - Advanced insights, export reports, unlimited history
 */

import { supabase } from './supabase';

export const STRIPE_PRICES = {
  PREMIUM_MONTHLY: 'price_premium_monthly', // Replace with actual Stripe Price ID
  PREMIUM_ANNUAL: 'price_premium_annual', // Replace with actual Stripe Price ID (discounted)
};

export const SUBSCRIPTION_TIERS = {
  FREE: 'free',
  MONTHLY: 'monthly',
  ANNUAL: 'annual',
} as const;

export type SubscriptionTier = typeof SUBSCRIPTION_TIERS[keyof typeof SUBSCRIPTION_TIERS];

export interface SubscriptionInfo {
  tier: SubscriptionTier;
  status: 'active' | 'past_due' | 'canceled' | 'trialing';
  current_period_end?: string;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
}

/**
 * Get user's current subscription info from Supabase
 */
export async function getUserSubscription(userId: string): Promise<SubscriptionInfo | null> {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching subscription:', error);
      return null;
    }

    return data as SubscriptionInfo;
  } catch (err) {
    console.error('Error in getUserSubscription:', err);
    return null;
  }
}

/**
 * Create Stripe Customer (called after user signup)
 */
export async function createStripeCustomer(userId: string, email: string): Promise<string | null> {
  try {
    // This would typically call your backend API endpoint
    // which then creates a Stripe customer using the Stripe API
    // For now, this is a placeholder

    const response = await fetch('/api/stripe/create-customer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, email }),
    });

    const data = await response.json();
    return data.customerId;
  } catch (err) {
    console.error('Error creating Stripe customer:', err);
    return null;
  }
}

/**
 * Create Checkout Session for Premium subscription
 */
export async function createCheckoutSession(
  userId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string
): Promise<string | null> {
  try {
    // This would call your backend API endpoint
    // which creates a Stripe Checkout Session

    const response = await fetch('/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        priceId,
        successUrl,
        cancelUrl,
      }),
    });

    const data = await response.json();
    return data.checkoutUrl;
  } catch (err) {
    console.error('Error creating checkout session:', err);
    return null;
  }
}

/**
 * Create Customer Portal Session (for managing subscriptions)
 */
export async function createPortalSession(customerId: string, returnUrl: string): Promise<string | null> {
  try {
    // This would call your backend API endpoint
    // which creates a Stripe Customer Portal session

    const response = await fetch('/api/stripe/create-portal-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerId,
        returnUrl,
      }),
    });

    const data = await response.json();
    return data.portalUrl;
  } catch (err) {
    console.error('Error creating portal session:', err);
    return null;
  }
}

/**
 * Cancel subscription
 */
export async function cancelSubscription(subscriptionId: string): Promise<boolean> {
  try {
    const response = await fetch('/api/stripe/cancel-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ subscriptionId }),
    });

    return response.ok;
  } catch (err) {
    console.error('Error canceling subscription:', err);
    return false;
  }
}

/**
 * Check if user has active premium subscription
 */
export function isPremiumUser(subscription: SubscriptionInfo | null): boolean {
  if (!subscription) return false;

  return (
    (subscription.tier === SUBSCRIPTION_TIERS.MONTHLY || subscription.tier === SUBSCRIPTION_TIERS.ANNUAL) &&
    (subscription.status === 'active' || subscription.status === 'trialing')
  );
}

/**
 * Get subscription benefits based on tier
 */
export function getSubscriptionBenefits(tier: SubscriptionTier) {
  const benefits = {
    [SUBSCRIPTION_TIERS.FREE]: [
      '90-second spiral interrupts',
      'Basic F.I.R.E. training',
      'Weekly pattern insights',
      'Limited history (30 days)',
    ],
    [SUBSCRIPTION_TIERS.MONTHLY]: [
      'Everything in Free',
      'Advanced AI insights',
      'Daily predictions',
      'Custom reframes',
      'Export reports for therapist',
      'Unlimited history',
      '3AM Mode premium features',
      'Priority support',
    ],
    [SUBSCRIPTION_TIERS.ANNUAL]: [
      'Everything in Premium',
      '2 months free (annual billing)',
      'Early access to new features',
    ],
  };

  return benefits[tier] || benefits[SUBSCRIPTION_TIERS.FREE];
}

/**
 * Format subscription price
 */
export function formatPrice(tier: SubscriptionTier): string {
  const prices = {
    [SUBSCRIPTION_TIERS.FREE]: 'Free',
    [SUBSCRIPTION_TIERS.MONTHLY]: '$9.99/month',
    [SUBSCRIPTION_TIERS.ANNUAL]: '$99.99/year (save $20)',
  };

  return prices[tier] || 'Free';
}

/**
 * DailyHush - Subscription Helper Utilities
 * Pure functions for transforming subscription data
 * Created: 2025-11-01
 */

import { PremiumStatusData } from '@/hooks/useTrialGuard';
import { SubscriptionStatus } from '@/components/subscription/SubscriptionStatusBadge';

export interface SubscriptionDisplayData {
  planName: string;
  price: string;
  period: string;
  status: SubscriptionStatus;
  nextBillingDate: Date | null;
  trialEndDate: Date | null;
  accessEndDate: Date | null;
}

/**
 * Transform premium status data into display-ready format
 */
export function getSubscriptionDisplayData(
  premiumStatus: PremiumStatusData
): SubscriptionDisplayData | null {
  // Trial subscription
  if (premiumStatus.source === 'trial') {
    return {
      planName: 'Premium Trial',
      price: '$0',
      period: '',
      status: 'trial',
      nextBillingDate: null,
      trialEndDate: premiumStatus.trialEndDate,
      accessEndDate: null,
    };
  }

  // Paid subscription
  if (premiumStatus.source === 'subscription') {
    const price = getPriceForPlan(premiumStatus.planIdentifier);

    return {
      planName: premiumStatus.planName || 'Premium',
      price,
      period: premiumStatus.period || '/month',
      status: premiumStatus.subscriptionStatus || 'active',
      nextBillingDate: premiumStatus.nextBillingDate,
      trialEndDate: null,
      accessEndDate: !premiumStatus.willRenew ? premiumStatus.nextBillingDate : null,
    };
  }

  // No subscription
  return null;
}

/**
 * Get display price based on plan identifier
 */
function getPriceForPlan(planIdentifier: string | null): string {
  if (!planIdentifier) return '$9.99';

  if (planIdentifier.includes('annual') || planIdentifier.includes('year')) {
    return '$59.99';
  }

  if (planIdentifier.includes('lifetime')) {
    return '$199.99';
  }

  return '$9.99'; // Default monthly
}

/**
 * Check if user should see resubscribe option
 */
export function shouldShowResubscribe(displayData: SubscriptionDisplayData | null): boolean {
  return displayData !== null && displayData.status === 'canceled';
}

/**
 * Check if user should see restore purchases option
 */
export function shouldShowRestore(premiumStatus: PremiumStatusData): boolean {
  return premiumStatus.source === 'subscription' || !premiumStatus.isPremium;
}

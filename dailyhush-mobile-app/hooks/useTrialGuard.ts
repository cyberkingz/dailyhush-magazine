/**
 * DailyHush - Trial Guard Hook
 * Detects trial expiration and redirects to trial-expired screen
 * Created: 2025-10-31
 */

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSegments } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/utils/supabase';
import { getTrialStatus } from '@/utils/trialManager';

const TRIAL_CHECK_KEY = 'last_trial_check';
const CHECK_INTERVAL_MS = 1000 * 60 * 60; // Check every hour

/**
 * Hook to detect trial expiration and redirect user
 * Call this in the root layout or main app screen
 *
 * @param enabled - Whether trial checking is enabled (default: true)
 */
export function useTrialGuard(enabled: boolean = true) {
  const router = useRouter();
  const segments = useSegments();
  const hasChecked = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    const checkTrialExpiration = async () => {
      try {
        // Don't check if already on trial-expired screen
        if (segments.includes('trial-expired')) {
          return;
        }

        // Get authenticated user
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.user) {
          return; // Not authenticated
        }

        // Check if we've checked recently (avoid excessive checks)
        const lastCheck = await AsyncStorage.getItem(TRIAL_CHECK_KEY);
        const now = Date.now();

        if (lastCheck && now - parseInt(lastCheck) < CHECK_INTERVAL_MS) {
          return; // Already checked recently
        }

        // Get trial status
        const trialStatus = await getTrialStatus(supabase, session.user.id);

        // Save check timestamp
        await AsyncStorage.setItem(TRIAL_CHECK_KEY, now.toString());

        // If trial just expired, show trial-expired screen
        if (
          !trialStatus.isActive &&
          trialStatus.startDate &&
          trialStatus.endDate &&
          !hasChecked.current
        ) {
          // Check if trial ended recently (within last 24 hours)
          const endDate = new Date(trialStatus.endDate);
          const hoursSinceExpiration = (now - endDate.getTime()) / (1000 * 60 * 60);

          if (hoursSinceExpiration < 24 && hoursSinceExpiration > 0) {
            console.log('Trial expired recently - redirecting to trial-expired screen');
            hasChecked.current = true;
            router.push('/trial-expired');
          }
        }
      } catch (error) {
        console.error('Error checking trial expiration:', error);
      }
    };

    // Check on mount
    checkTrialExpiration();

    // Set up interval for periodic checks (every hour)
    const interval = setInterval(checkTrialExpiration, CHECK_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [enabled, router, segments]);
}

export type SubscriptionSource = 'trial' | 'subscription' | null;

export interface PremiumStatusData {
  // Access status
  isPremium: boolean;
  isLoading: boolean;
  source: SubscriptionSource;

  // Trial details (if source is 'trial')
  daysRemaining: number;
  trialEndDate: Date | null;

  // Subscription details (if source is 'subscription')
  subscriptionStatus: 'active' | 'trial' | 'payment_issue' | 'canceled' | 'expired' | null;
  planIdentifier: string | null;
  planName: string | null;
  period: string | null;
  nextBillingDate: Date | null;
  willRenew: boolean;

  // Billing issue details
  hasBillingIssue: boolean;
  billingIssueDetectedAt: Date | null;
  gracePeriodEnd: Date | null;
  isInGracePeriod: boolean;
}

/**
 * Hook to check if Premium features are accessible
 * Checks both trial status AND RevenueCat subscription status
 * Returns comprehensive subscription details including billing issues
 */
export function usePremiumStatus(): PremiumStatusData {
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [source, setSource] = useState<SubscriptionSource>(null);

  // Trial details
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [trialEndDate, setTrialEndDate] = useState<Date | null>(null);

  // Subscription details
  const [subscriptionStatus, setSubscriptionStatus] = useState<
    'active' | 'trial' | 'payment_issue' | 'canceled' | 'expired' | null
  >(null);
  const [planIdentifier, setPlanIdentifier] = useState<string | null>(null);
  const [planName, setPlanName] = useState<string | null>(null);
  const [period, setPeriod] = useState<string | null>(null);
  const [nextBillingDate, setNextBillingDate] = useState<Date | null>(null);
  const [willRenew, setWillRenew] = useState(false);

  // Billing issue details
  const [hasBillingIssue, setHasBillingIssue] = useState(false);
  const [billingIssueDetectedAt, setBillingIssueDetectedAt] = useState<Date | null>(null);
  const [gracePeriodEnd, setGracePeriodEnd] = useState<Date | null>(null);
  const [isInGracePeriod, setIsInGracePeriod] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.user) {
          setIsPremium(false);
          setIsLoading(false);
          return;
        }

        // Check trial status first (no-CC trials from our system)
        const trialStatus = await getTrialStatus(supabase, session.user.id);

        if (trialStatus.isActive) {
          setIsPremium(true);
          setDaysRemaining(trialStatus.daysRemaining);
          setTrialEndDate(trialStatus.endDate ? new Date(trialStatus.endDate) : null);
          setSource('trial');
          setSubscriptionStatus('trial');
          setIsLoading(false);
          return;
        }

        // If trial is not active, check RevenueCat subscription
        try {
          const { checkPremiumStatus } = await import('@/utils/revenueCat');
          const revenueCatStatus = await checkPremiumStatus();

          if (revenueCatStatus.isPremium) {
            setIsPremium(true);
            setSource('subscription');

            // Set plan details
            setPlanIdentifier(revenueCatStatus.planIdentifier);
            setPeriod(revenueCatStatus.period);
            setWillRenew(revenueCatStatus.willRenew);

            // Determine plan name
            if (revenueCatStatus.planIdentifier?.includes('monthly')) {
              setPlanName('Premium Monthly');
            } else if (revenueCatStatus.planIdentifier?.includes('annual')) {
              setPlanName('Premium Annual');
            } else if (revenueCatStatus.planIdentifier?.includes('lifetime')) {
              setPlanName('Premium Lifetime');
            }

            // Set next billing date (if applicable)
            if (revenueCatStatus.expirationDate && revenueCatStatus.willRenew) {
              setNextBillingDate(new Date(revenueCatStatus.expirationDate));
            }

            // Check for billing issues
            setHasBillingIssue(revenueCatStatus.isInGracePeriod);
            setIsInGracePeriod(revenueCatStatus.isInGracePeriod);
            if (revenueCatStatus.billingIssueDetectedAt) {
              setBillingIssueDetectedAt(new Date(revenueCatStatus.billingIssueDetectedAt));
            }
            if (revenueCatStatus.gracePeriodExpiresAt) {
              setGracePeriodEnd(new Date(revenueCatStatus.gracePeriodExpiresAt));
            }

            // Determine subscription status
            if (revenueCatStatus.isInGracePeriod) {
              setSubscriptionStatus('payment_issue');
            } else if (revenueCatStatus.isTrial) {
              setSubscriptionStatus('trial');
            } else if (!revenueCatStatus.willRenew) {
              setSubscriptionStatus('canceled');
            } else {
              setSubscriptionStatus('active');
            }
          } else {
            // No active subscription
            setIsPremium(false);
            setSource(null);
            setSubscriptionStatus('expired');
          }
        } catch (error) {
          console.error('Error checking RevenueCat status:', error);
          // Fallback to false if RevenueCat check fails
          setIsPremium(false);
          setSource(null);
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error checking Premium status:', error);
        setIsPremium(false);
        setIsLoading(false);
      }
    };

    checkStatus();
  }, []);

  return {
    // Access status
    isPremium,
    isLoading,
    source,

    // Trial details
    daysRemaining,
    trialEndDate,

    // Subscription details
    subscriptionStatus,
    planIdentifier,
    planName,
    period,
    nextBillingDate,
    willRenew,

    // Billing issue details
    hasBillingIssue,
    billingIssueDetectedAt,
    gracePeriodEnd,
    isInGracePeriod,
  };
}

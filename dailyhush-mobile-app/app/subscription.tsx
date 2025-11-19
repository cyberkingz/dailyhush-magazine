/**
 * Nœma - Subscription Screen
 * Shows RevenueCat subscription options with localized pricing
 * Monthly, Annual, Lifetime (prices from RevenueCat/App Store)
 * Created: 2025-10-31
 * Updated: 2025-11-01 - Integrated RevenueCat SDK
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ScrollView, Alert, Pressable, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Crown, Check, Sparkles } from 'lucide-react-native';
import type { PurchasesPackage } from 'react-native-purchases';

import { Text } from '@/components/ui/text';
import { SubscriptionOption } from '@/components/subscription/SubscriptionOption';
import { LegalFooter } from '@/components/legal';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { PREMIUM_FEATURES } from '@/constants/subscription';
import { usePremiumStatus } from '@/hooks/useTrialGuard';
import {
  getOfferings,
  purchasePackage,
  restorePurchases,
  packageToSubscriptionPlan,
  getRecommendedPackages,
  calculateAnnualSavings,
  PACKAGE_IDS,
  PREMIUM_ENTITLEMENT_ID,
} from '@/utils/revenueCat';
import { supabase } from '@/utils/supabase';
import { useAnalytics } from '@/utils/analytics';
import { useStore } from '@/store/useStore';

interface SubscriptionPlanWithPackage {
  id: string;
  title: string;
  price: string;
  priceValue: number;
  period: string;
  badge?: string;
  savings?: string;
  description: string;
  package: PurchasesPackage;
}

export default function SubscriptionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const premiumStatus = usePremiumStatus();
  const analytics = useAnalytics();
  const { user } = useStore();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [subscriptionOptions, setSubscriptionOptions] = useState<SubscriptionPlanWithPackage[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isLoadingRef = useRef(false);
  const hasLoadedRef = useRef(false);

  const loadSubscriptionOptions = useCallback(async () => {
    // Prevent multiple simultaneous calls
    if (isLoadingRef.current || hasLoadedRef.current) {
      console.log('⏭️ Skipping - already loading or loaded');
      return;
    }

    console.log('🔄 loadSubscriptionOptions called');
    isLoadingRef.current = true;

    try {
      setIsLoading(true);
      setErrorMessage(null);

      console.log('📡 Fetching offerings from RevenueCat...');
      const offering = await getOfferings();
      console.log('✅ Offerings received:', offering?.identifier);

      if (!offering) {
        setErrorMessage('Unable to load subscription options. Please try again later.');
        setIsLoading(false);
        return;
      }

      // Get available packages
      const packages = offering.availablePackages;

      if (packages.length === 0) {
        setErrorMessage('No subscription options available.');
        setIsLoading(false);
        return;
      }

      // Find specific packages (Monthly and Annual only)
      const monthlyPkg = packages.find((p) => p.identifier === PACKAGE_IDS.MONTHLY);
      const annualPkg = packages.find((p) => p.identifier === PACKAGE_IDS.ANNUAL);

      // Get recommendations
      const recommendations = getRecommendedPackages(packages);

      // Calculate savings
      const annualSavings =
        monthlyPkg && annualPkg ? calculateAnnualSavings(monthlyPkg, annualPkg) : null;

      // Build subscription options
      const options: SubscriptionPlanWithPackage[] = [];

      if (monthlyPkg) {
        options.push(packageToSubscriptionPlan(monthlyPkg));
      }

      if (annualPkg) {
        options.push(
          packageToSubscriptionPlan(
            annualPkg,
            recommendations.mostPopular === annualPkg.identifier ? 'MOST POPULAR' : undefined,
            annualSavings || 'Best value'
          )
        );
      }

      setSubscriptionOptions(options);

      // Pre-select user's current plan if they have an active subscription
      // Otherwise default to Monthly plan
      let planToSelect = monthlyPkg?.identifier; // Default to monthly

      if (premiumStatus.source === 'subscription' && premiumStatus.planIdentifier) {
        // User has active subscription - pre-select their current plan
        const currentPlanIdentifier = premiumStatus.planIdentifier;
        const currentPlanExists = options.find((opt) => opt.id === currentPlanIdentifier);

        if (currentPlanExists) {
          planToSelect = currentPlanIdentifier;
          console.log('✅ Pre-selected current plan:', currentPlanIdentifier);
        }
      }

      if (planToSelect) {
        setSelectedPlan(planToSelect);
      } else if (options.length > 0) {
        setSelectedPlan(options[0].id);
      }

      hasLoadedRef.current = true;
      setIsLoading(false);
      console.log('✅ Subscription options loaded successfully');

      // Track paywall viewed
      analytics.track('PAYWALL_VIEWED', {
        loop_type: user?.loop_type,
      });
    } catch (error) {
      console.error('❌ Error loading subscription options:', error);
      setErrorMessage('Failed to load subscription options. Please check your connection.');
      setIsLoading(false);
    } finally {
      isLoadingRef.current = false;
    }
  }, [analytics, user]);

  // Load RevenueCat offerings on mount
  useEffect(() => {
    console.log('🎬 Subscription screen mounted');
    console.log('📊 Current state:', {
      isLoadingRef: isLoadingRef.current,
      hasLoadedRef: hasLoadedRef.current,
      subscriptionOptionsLength: subscriptionOptions.length,
      isLoading,
    });

    loadSubscriptionOptions();

    return () => {
      console.log('🛑 Subscription screen unmounting');
      console.log('📊 State at unmount:', {
        isLoadingRef: isLoadingRef.current,
        hasLoadedRef: hasLoadedRef.current,
        subscriptionOptionsLength: subscriptionOptions.length,
        isLoading,
      });
      // Don't reset refs to preserve loaded state across remounts
      // hasLoadedRef.current = false;
      isLoadingRef.current = false;
    };
  }, [loadSubscriptionOptions]);

  const handlePurchase = async () => {
    if (!selectedPlan) {
      Alert.alert('No Plan Selected', 'Please select a subscription plan.', [{ text: 'OK' }]);
      return;
    }

    try {
      setIsPurchasing(true);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // Find selected package
      const selectedOption = subscriptionOptions.find((opt) => opt.id === selectedPlan);

      if (!selectedOption) {
        throw new Error('Selected plan not found');
      }

      // Purchase via RevenueCat
      const { customerInfo, userCancelled } = await purchasePackage(selectedOption.package);

      if (userCancelled) {
        setIsPurchasing(false);
        return;
      }

      // Check if Premium entitlement is now active
      if (customerInfo.entitlements.active['premium']) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        // Track successful purchase
        const isTrial =
          customerInfo.entitlements.active['premium'].periodType === 'TRIAL' ||
          customerInfo.entitlements.active['premium'].isActive === true;

        analytics.track('SUBSCRIPTION_PURCHASED', {
          subscription_plan:
            selectedOption.id === PACKAGE_IDS.MONTHLY
              ? 'monthly'
              : selectedOption.id === PACKAGE_IDS.ANNUAL
                ? 'annual'
                : 'lifetime',
          is_trial: isTrial,
        });

        // Update user profile in Supabase
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          await supabase
            .from('profiles')
            .update({
              subscription_status: 'active',
              subscription_tier: selectedOption.id,
              updated_at: new Date().toISOString(),
            })
            .eq('id', session.user.id);
        }

        // Stop loading state BEFORE navigation
        setIsPurchasing(false);

        // Navigate back to home
        router.replace('/');

        Alert.alert(
          '🎉 Welcome to Premium!',
          'You now have access to all Premium features. Enjoy your journey to quieter thoughts!',
          [{ text: 'Get Started' }]
        );
      }
    } catch (error: any) {
      console.error('Purchase error:', error);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

      Alert.alert(
        'Purchase Failed',
        error.message || 'Unable to complete purchase. Please try again.',
        [{ text: 'OK' }]
      );
      setIsPurchasing(false);
    }
  };

  /**
   * Handle Restore Purchases
   * Restores previous purchases for users who reinstalled or switched devices
   */
  const handleRestore = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      console.log('🔄 Restoring purchases...');
      const customerInfo = await restorePurchases();

      // Check if Premium entitlement is active after restore
      const hasPremium = customerInfo.entitlements.active[PREMIUM_ENTITLEMENT_ID];

      if (hasPremium) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        Alert.alert(
          '✅ Purchases Restored',
          'Your Premium access has been restored. Welcome back!',
          [
            {
              text: 'Continue',
              onPress: () => router.replace('/'),
            },
          ]
        );
      } else {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);

        Alert.alert(
          'No Purchases Found',
          'We could not find any active subscriptions associated with your account. If you believe this is an error, please contact support.',
          [{ text: 'OK' }]
        );
      }
    } catch (error: any) {
      console.error('Restore error:', error);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

      Alert.alert(
        'Restore Failed',
        error.message || 'Unable to restore purchases. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Choose Your Plan',
          headerStyle: {
            backgroundColor: colors.background.primary,
          },
          headerTintColor: colors.emerald[500],
          headerShadowVisible: false,
          headerBackVisible: true,
        }}
      />
      <StatusBar style="light" />

      <View style={{ flex: 1, backgroundColor: colors.background.primary }}>
        <ScrollView
          contentContainerStyle={{
            paddingTop: spacing.md,
            paddingBottom: spacing.safeArea.bottom + insets.bottom + 100,
            paddingHorizontal: spacing.screenPadding,
          }}
          showsVerticalScrollIndicator={false}>
          {/* Header Icon */}
          <View style={{ alignItems: 'center', marginBottom: 24 }}>
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: colors.emerald[600] + '20',
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 2,
                borderColor: colors.emerald[600] + '40',
                marginBottom: 16,
              }}>
              <Crown size={40} color={colors.emerald[500]} strokeWidth={2} />
            </View>
          </View>

          {/* Title */}
          <Text
            style={{
              fontSize: 28,
              fontWeight: 'bold',
              color: colors.text.primary,
              textAlign: 'center',
              marginBottom: 12,
              lineHeight: 36,
            }}>
            Choose Your Premium Plan
          </Text>

          <Text
            style={{
              fontSize: 16,
              color: colors.text.secondary,
              textAlign: 'center',
              lineHeight: 24,
              marginBottom: 32,
            }}>
            Unlock all Premium features and keep quieting your thoughts
          </Text>

          {/* Loading State */}
          {isLoading && (
            <View style={{ alignItems: 'center', paddingVertical: 40 }}>
              <ActivityIndicator size="large" color={colors.emerald[500]} />
              <Text
                style={{
                  fontSize: 14,
                  color: colors.text.secondary,
                  marginTop: 16,
                }}>
                Loading subscription options...
              </Text>
            </View>
          )}

          {/* Error State */}
          {errorMessage && !isLoading && (
            <View
              style={{
                backgroundColor: colors.background.card,
                borderRadius: 16,
                padding: 20,
                marginBottom: 24,
                borderWidth: 1,
                borderColor: colors.emerald[700] + '30',
              }}>
              <Text
                style={{
                  fontSize: 16,
                  color: colors.text.primary,
                  textAlign: 'center',
                  marginBottom: 12,
                }}>
                {errorMessage}
              </Text>
              <Pressable
                onPress={loadSubscriptionOptions}
                style={{
                  backgroundColor: colors.emerald[600],
                  borderRadius: 12,
                  paddingVertical: 12,
                  paddingHorizontal: 20,
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: 'bold',
                    color: colors.white,
                  }}>
                  Retry
                </Text>
              </Pressable>
            </View>
          )}

          {/* Subscription Options */}
          {!isLoading && !errorMessage && subscriptionOptions.length > 0 && (
            <View style={{ marginBottom: 24 }}>
              {subscriptionOptions.map((option) => (
                <SubscriptionOption
                  key={option.id}
                  plan={option}
                  isSelected={selectedPlan === option.id}
                  onSelect={(id) => {
                    setSelectedPlan(id);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

                    // Track subscription plan selection
                    const selected = subscriptionOptions.find((opt) => opt.id === id);
                    if (selected) {
                      analytics.track('SUBSCRIPTION_SELECTED', {
                        subscription_plan:
                          id === PACKAGE_IDS.MONTHLY
                            ? 'monthly'
                            : id === PACKAGE_IDS.ANNUAL
                              ? 'annual'
                              : 'lifetime',
                        subscription_price: selected.priceValue,
                      });
                    }
                  }}
                />
              ))}
            </View>
          )}

          {/* Premium Features */}
          {!isLoading && !errorMessage && (
            <View
              style={{
                backgroundColor: colors.background.card,
                borderRadius: 16,
                padding: 20,
                marginBottom: 24,
                borderWidth: 1,
                borderColor: colors.emerald[700] + '30',
              }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: colors.emerald[300],
                  marginBottom: 16,
                }}>
                What's Included:
              </Text>

              {PREMIUM_FEATURES.map((feature) => (
                <View
                  key={feature}
                  accessible={true}
                  accessibilityRole="text"
                  style={{
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    marginBottom: 12,
                  }}>
                  <Check
                    size={18}
                    color={colors.emerald[500]}
                    strokeWidth={2}
                    style={{ marginRight: 12, marginTop: 2 }}
                  />
                  <Text
                    style={{
                      flex: 1,
                      fontSize: 14,
                      color: colors.text.secondary,
                      lineHeight: 20,
                    }}>
                    {feature}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Terms */}
          {!isLoading && !errorMessage && (
            <Text
              style={{
                fontSize: 12,
                color: colors.text.tertiary,
                textAlign: 'center',
                lineHeight: 18,
              }}>
              Subscriptions auto-renew unless canceled 24 hours before the end of the current
              period.
              {'\n'}
              Cancel anytime in your App Store settings.
            </Text>
          )}

          {/* Legal Footer */}
          {!isLoading && !errorMessage && (
            <LegalFooter
              showRestore={true}
              onRestorePurchases={handleRestore}
              containerStyle={{ marginTop: spacing.xl }}
            />
          )}
        </ScrollView>

        {/* Purchase Button */}
        {!isLoading && !errorMessage && subscriptionOptions.length > 0 && (
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: colors.background.primary,
              paddingHorizontal: spacing.screenPadding,
              paddingTop: 16,
              paddingBottom: spacing.safeArea.bottom + insets.bottom,
              borderTopWidth: 1,
              borderTopColor: colors.emerald[800] + '30',
            }}>
            <Pressable
              onPress={handlePurchase}
              disabled={isPurchasing || !selectedPlan}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Subscribe Now"
              accessibilityState={{ disabled: isPurchasing || !selectedPlan, busy: isPurchasing }}
              testID="subscription-purchase-button"
              style={{
                backgroundColor:
                  isPurchasing || !selectedPlan ? colors.emerald[700] : colors.emerald[600],
                borderRadius: 20,
                paddingVertical: 18,
                paddingHorizontal: 24,
                shadowColor: colors.emerald[500],
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.4,
                shadowRadius: 12,
                elevation: 8,
              }}>
              {({ pressed }) => (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: pressed && !isPurchasing ? 0.9 : 1,
                  }}>
                  {isPurchasing ? (
                    <>
                      <ActivityIndicator size="small" color={colors.white} />
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: 'bold',
                          color: colors.white,
                          marginLeft: 12,
                        }}>
                        Processing...
                      </Text>
                    </>
                  ) : (
                    <>
                      <Sparkles size={20} color={colors.white} strokeWidth={2} />
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: 'bold',
                          color: colors.white,
                          marginLeft: 12,
                        }}>
                        Subscribe Now
                      </Text>
                    </>
                  )}
                </View>
              )}
            </Pressable>
          </View>
        )}
      </View>
    </>
  );
}

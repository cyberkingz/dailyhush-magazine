/**
 * DailyHush - Quiz Paywall Screen
 * Shows subscription options with 7-day trial
 * Created: 2025-11-01
 */

import { useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Text as RNText, ScrollView, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Brain, Sparkles } from 'lucide-react-native';

import { Text } from '@/components/ui/text';
import { SubscriptionOption } from '@/components/subscription/SubscriptionOption';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { supabase } from '@/utils/supabase';
import { submitQuizToSupabase, calculateQuizResult } from '@/utils/quizScoring';
import {
  getOfferings,
  packageToSubscriptionPlan,
  calculateAnnualSavings,
  purchasePackage,
  PACKAGE_IDS,
  PREMIUM_ENTITLEMENT_ID,
} from '@/utils/revenueCat';
import type { QuizAnswer } from '@/utils/quizScoring';
import type { LoopType, OverthinkerType } from '@/data/quizQuestions';
import { useStore } from '@/store/useStore';
import { LOOP_PAYWALL_CONFIG } from '@/constants/loopPaywalls';

export default function QuizPaywall() {
  const router = useRouter();
  const { setUser } = useStore();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    loopType: LoopType;
    type: OverthinkerType;
    answers: string; // JSON stringified QuizAnswer[]
  }>();

  const [isStartingTrial, setIsStartingTrial] = useState(false);
  const [isLoadingOfferings, setIsLoadingOfferings] = useState(true);
  const [subscriptionOptions, setSubscriptionOptions] = useState<any[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const config = LOOP_PAYWALL_CONFIG[params.loopType];

  // Verify user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        console.warn('⚠️ Paywall accessed without authentication');
        Alert.alert(
          'Authentication Required',
          'Please complete signup first.',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/onboarding/signup'),
            },
          ]
        );
      }
    };

    checkAuth();
  }, []);

  // Load RevenueCat subscription options
  useEffect(() => {
    loadSubscriptionOptions();
  }, []);

  const loadSubscriptionOptions = async () => {
    try {
      setIsLoadingOfferings(true);
      console.log('Loading RevenueCat offerings...');
      const offering = await getOfferings();

      if (!offering) {
        console.error('No offerings available - RevenueCat returned null');
        Alert.alert(
          'Setup Required',
          'Subscription options are not configured yet. Please check RevenueCat dashboard.'
        );
        setIsLoadingOfferings(false);
        return;
      }

      if (offering.availablePackages.length === 0) {
        console.error('No packages in offering');
        Alert.alert(
          'Configuration Error',
          'No subscription packages found. Please check RevenueCat setup.'
        );
        setIsLoadingOfferings(false);
        return;
      }

      console.log('RevenueCat: Loaded offerings:', offering.identifier);

      const packages = offering.availablePackages;

      // Find specific packages
      const monthlyPkg = packages.find((p) => p.identifier === PACKAGE_IDS.MONTHLY);
      const annualPkg = packages.find((p) => p.identifier === PACKAGE_IDS.ANNUAL);
      const lifetimePkg = packages.find((p) => p.identifier === PACKAGE_IDS.LIFETIME);

      console.log('RevenueCat packages found:', {
        total: packages.length,
        identifiers: packages.map((p) => p.identifier),
        monthly: !!monthlyPkg,
        annual: !!annualPkg,
        lifetime: !!lifetimePkg,
      });

      if (!monthlyPkg || !annualPkg || !lifetimePkg) {
        console.error('Missing subscription packages:', {
          monthly: !!monthlyPkg,
          annual: !!annualPkg,
          lifetime: !!lifetimePkg,
        });
        Alert.alert(
          'Configuration Error',
          'Some subscription options are not available. Please contact support.'
        );
        setIsLoadingOfferings(false);
        return;
      }

      // Calculate annual savings
      const annualSavings = calculateAnnualSavings(monthlyPkg, annualPkg);

      // Build subscription options
      const options = [
        packageToSubscriptionPlan(monthlyPkg),
        packageToSubscriptionPlan(annualPkg, 'MOST POPULAR', annualSavings || undefined),
        packageToSubscriptionPlan(lifetimePkg, 'BEST VALUE', 'Pay once, keep forever'),
      ];

      setSubscriptionOptions(options);
      setSelectedPlan(monthlyPkg.identifier); // Default to monthly
      setIsLoadingOfferings(false);
    } catch (error: any) {
      console.error('Error loading subscription options:', error);
      Alert.alert('Error', 'Unable to load subscription options. Please try again.');
      setIsLoadingOfferings(false);
    }
  };

  // Start Premium trial with selected plan (auto-renewing)
  const handleStartTrial = async () => {
    if (!selectedPlan) {
      Alert.alert('Please select a plan', 'Choose your subscription plan to continue.');
      return;
    }

    try {
      setIsStartingTrial(true);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // Get current authenticated user
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        console.error('Session error:', sessionError);
        Alert.alert('Authentication Error', 'Please try signing in again.');
        setIsStartingTrial(false);
        return;
      }

      if (!session?.user) {
        console.error('No authenticated user found - attempting to restore session');

        // Try to refresh session
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();

        if (refreshError || !refreshData?.session?.user) {
          console.error('Session refresh failed:', refreshError);
          Alert.alert(
            'Session Expired',
            'Your session has expired. Please sign in again.',
            [
              {
                text: 'OK',
                onPress: () => router.replace('/onboarding/signup'),
              },
            ]
          );
          setIsStartingTrial(false);
          return;
        }

        // Use refreshed session
        console.log('✅ Session refreshed successfully');
      }

      // Get final session (either original or refreshed)
      const {
        data: { session: finalSession },
      } = await supabase.auth.getSession();

      if (!finalSession?.user) {
        console.error('Unable to establish authenticated session');
        Alert.alert('Authentication Error', 'Unable to verify your account. Please try again.');
        setIsStartingTrial(false);
        return;
      }

      const userId = finalSession.user.id;
      console.log('✅ Authenticated user:', userId);

      // Find the selected package
      const selectedOption = subscriptionOptions.find((opt) => opt.id === selectedPlan);
      if (!selectedOption?.package) {
        console.error('Selected package not found');
        Alert.alert('Error', 'Unable to process subscription. Please try again.');
        setIsStartingTrial(false);
        return;
      }

      // Save quiz results first
      const answers: QuizAnswer[] = JSON.parse(params.answers);
      const result = calculateQuizResult(answers);

      const { success: quizSuccess, submissionId } = await submitQuizToSupabase(
        finalSession.user.email || '',
        answers,
        result,
        supabase
      );

      if (!quizSuccess) {
        console.error('Failed to save quiz');
        setIsStartingTrial(false);
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        return;
      }

      // Purchase subscription with trial (auto-renewing)
      const { customerInfo, userCancelled } = await purchasePackage(selectedOption.package);

      if (userCancelled) {
        console.log('User cancelled subscription purchase');
        setIsStartingTrial(false);
        return;
      }

      // Verify Premium entitlement
      const hasPremium = customerInfo.entitlements.active[PREMIUM_ENTITLEMENT_ID];
      if (!hasPremium) {
        console.error('Premium entitlement not granted after purchase');
        Alert.alert('Error', 'Subscription activation failed. Please contact support.');
        setIsStartingTrial(false);
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        return;
      }

      console.log('✅ Subscription purchased successfully with trial!');

      // Update user profile with quiz data + subscription info
      await supabase
        .from('user_profiles')
        .update({
          quiz_email: finalSession.user.email,
          quiz_connected: true,
          quiz_submission_id: submissionId,
          quiz_overthinker_type: params.type,
          quiz_connected_at: new Date().toISOString(),
          onboarding_completed: true,
          subscription_status: 'active',
          subscription_tier: selectedPlan,
        })
        .eq('user_id', userId);

      // Fetch fresh profile
      const { data: updatedProfile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (updatedProfile) {
        setUser(updatedProfile);
      }

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace('/');
    } catch (error: any) {
      console.error('Exception starting trial:', error);
      Alert.alert(
        'Subscription Error',
        error.message || 'Unable to start subscription. Please try again.'
      );
      setIsStartingTrial(false);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
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
          {/* Loop-Specific Header */}
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
              <Brain size={40} color={colors.emerald[500]} strokeWidth={2} />
            </View>

            <Text
              style={{
                fontSize: 28,
                fontWeight: 'bold',
                color: colors.text.primary,
                textAlign: 'center',
                marginBottom: 8,
              }}>
              You're a {config.emoji}
            </Text>

            <Text
              style={{
                fontSize: 24,
                fontWeight: 'bold',
                color: colors.emerald[400],
                textAlign: 'center',
                marginBottom: 12,
              }}>
              {config.title}
            </Text>

            <Text
              style={{
                fontSize: 16,
                color: colors.text.secondary,
                textAlign: 'center',
                lineHeight: 24,
              }}>
              {config.subtitle}
            </Text>
          </View>

          {/* Personalized Features */}
          <View
            style={{
              backgroundColor: colors.emerald[800] + '30',
              borderRadius: 16,
              padding: 20,
              marginBottom: 32,
              borderWidth: 1,
              borderColor: colors.emerald[700] + '40',
            }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: colors.emerald[200],
                marginBottom: 16,
              }}>
              Your Personalized 7-Day Protocol:
            </Text>

            {config.features.map((feature, index) => (
              <View
                key={index}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: index < config.features.length - 1 ? 12 : 0,
                }}>
                <View
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    backgroundColor: colors.emerald[600] + '40',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12,
                  }}>
                  <Text style={{ color: colors.emerald[400], fontSize: 16 }}>✓</Text>
                </View>
                <Text
                  style={{
                    fontSize: 16,
                    color: colors.emerald[100],
                    flex: 1,
                  }}>
                  {feature}
                </Text>
              </View>
            ))}
          </View>

          {/* Choose Your Plan */}
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: colors.text.primary,
              marginBottom: 16,
              textAlign: 'center',
            }}>
            Choose Your Plan
          </Text>

          {/* Loading State */}
          {isLoadingOfferings && (
            <View style={{ paddingVertical: 40, alignItems: 'center' }}>
              <ActivityIndicator size="large" color={colors.emerald[500]} />
              <Text
                style={{
                  fontSize: 16,
                  color: colors.text.secondary,
                  marginTop: 16,
                }}>
                Loading subscription options...
              </Text>
            </View>
          )}

          {/* Subscription Options */}
          {!isLoadingOfferings &&
            subscriptionOptions.map((option) => (
              <SubscriptionOption
                key={option.id}
                plan={option}
                isSelected={selectedPlan === option.id}
                onSelect={(id) => {
                  setSelectedPlan(id);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
              />
            ))}

          {/* Trial Info */}
          {!isLoadingOfferings && (
            <View
              style={{
                backgroundColor: colors.emerald[800] + '20',
                borderRadius: 12,
                padding: 16,
                marginTop: 24,
                borderWidth: 1,
                borderColor: colors.emerald[700] + '30',
              }}>
              <Text
                style={{
                  fontSize: 15,
                  color: colors.emerald[200],
                  textAlign: 'center',
                  lineHeight: 22,
                }}>
                ✨ Start your 7-day FREE trial.{'\n'}
                Cancel anytime before trial ends to avoid charges.
              </Text>
            </View>
          )}

          {/* Urgency */}
          {!isLoadingOfferings && (
            <View
              style={{
                marginTop: 16,
                paddingVertical: 12,
                paddingHorizontal: 16,
                backgroundColor: 'rgba(255, 165, 0, 0.15)',
                borderRadius: 12,
                borderWidth: 1,
                borderColor: 'rgba(255, 165, 0, 0.3)',
              }}>
              <Text
                style={{
                  fontSize: 14,
                  color: '#FFB84D',
                  textAlign: 'center',
                  fontWeight: '600',
                }}>
                {config.urgency}
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Fixed Bottom CTA */}
        {!isLoadingOfferings && (
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: colors.background.primary,
              paddingTop: 16,
              paddingBottom: spacing.safeArea.bottom + insets.bottom,
              paddingHorizontal: spacing.screenPadding,
              borderTopWidth: 1,
              borderTopColor: colors.emerald[800] + '20',
            }}>
            <Pressable
              onPress={handleStartTrial}
              disabled={isStartingTrial || !selectedPlan}
              style={{
                backgroundColor: selectedPlan ? colors.emerald[600] : colors.background.muted,
                borderRadius: 20,
                paddingVertical: 20,
                paddingHorizontal: 32,
                shadowColor: colors.emerald[500],
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 12,
                elevation: 6,
              }}>
              {({ pressed }) => (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: pressed && !isStartingTrial ? 0.9 : 1,
                  }}>
                  {isStartingTrial ? (
                    <>
                      <ActivityIndicator size="small" color={colors.white} style={{ marginRight: 12 }} />
                      <Text
                        style={{
                          fontSize: 20,
                          fontWeight: 'bold',
                          color: colors.white,
                        }}>
                        Starting Trial...
                      </Text>
                    </>
                  ) : (
                    <>
                      <Sparkles
                        size={24}
                        color={colors.white}
                        strokeWidth={2}
                        style={{ marginRight: 12 }}
                      />
                      <Text
                        style={{
                          fontSize: 20,
                          fontWeight: 'bold',
                          color: colors.white,
                        }}>
                        Start 7-Day Free Trial
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

/**
 * Nœma - Subscription Management Screen
 * Manage active subscription, handle billing issues, restore purchases
 * Created: 2025-11-01
 */

import { useState } from 'react';
import { useRouter, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  View,
  ScrollView,
  Alert,
  Pressable,
  ActivityIndicator,
  Linking,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import {
  ArrowLeft,
  ExternalLink,
  RefreshCw,
  Settings as SettingsIcon,
  Crown,
} from 'lucide-react-native';

import { Text } from '@/components/ui/text';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { SUBSCRIPTION_COPY } from '@/constants/subscriptionCopy';
import { usePremiumStatus } from '@/hooks/useTrialGuard';
import { SubscriptionPlanCard } from '@/components/subscription/SubscriptionPlanCard';
import { PaymentIssueAlert } from '@/components/subscription/PaymentIssueAlert';
import { EmptySubscriptionCard } from '@/components/subscription/EmptySubscriptionCard';
import { SubscriptionActionButton } from '@/components/subscription/SubscriptionActionButton';
import { restorePurchases } from '@/utils/revenueCat';
import {
  getSubscriptionDisplayData,
  shouldShowResubscribe,
  shouldShowRestore,
} from '@/utils/subscriptionHelpers';

export default function SubscriptionManagementScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [isRestoring, setIsRestoring] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  const premiumStatus = usePremiumStatus();
  const subscriptionData = getSubscriptionDisplayData(premiumStatus);

  // Navigation handlers
  const navigateBack = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const navigateToPlans = async () => {
    if (isNavigating) {
      console.log('⚠️ Navigation already in progress, skipping');
      return;
    }

    try {
      setIsNavigating(true);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      console.log('🚀 Navigating to subscription screen');
      router.push('/subscription');
    } finally {
      // Reset after a delay to prevent rapid double-clicks
      setTimeout(() => setIsNavigating(false), 1000);
    }
  };

  const navigateToTerms = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/legal/terms');
  };

  const navigateToPrivacy = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/legal/privacy');
  };

  // External link handlers
  const openStoreSettings = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const url =
      Platform.OS === 'ios'
        ? 'https://apps.apple.com/account/subscriptions'
        : 'https://play.google.com/store/account/subscriptions';

    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert(
          'Unable to Open',
          'Please manage your subscription through the App Store settings.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error opening store settings:', error);
    }
  };

  const openSupport = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert(
      SUBSCRIPTION_COPY.management.actions.contactSupport,
      'For assistance, email hello@daily-hush.com',
      [{ text: 'OK' }]
    );
  };

  // Restore purchases handler
  const handleRestore = async () => {
    try {
      setIsRestoring(true);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      const customerInfo = await restorePurchases();

      const hasActivePremium = customerInfo.entitlements.active['premium'];

      if (hasActivePremium) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert(
          SUBSCRIPTION_COPY.restore.success.title,
          SUBSCRIPTION_COPY.restore.success.message,
          [
            {
              text: SUBSCRIPTION_COPY.restore.success.cta,
              onPress: () => router.replace('/settings/subscription'),
            },
          ]
        );
      } else {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        Alert.alert(
          SUBSCRIPTION_COPY.restore.notFound.title,
          SUBSCRIPTION_COPY.restore.notFound.message,
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Restore error:', error);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(SUBSCRIPTION_COPY.restore.error.title, SUBSCRIPTION_COPY.restore.error.message, [
        { text: 'Cancel', style: 'cancel' },
        { text: SUBSCRIPTION_COPY.restore.error.cta, onPress: handleRestore },
      ]);
    } finally {
      setIsRestoring(false);
    }
  };

  // Loading state
  if (premiumStatus.isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background.primary }}>
        <StatusBar style="light" />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={colors.emerald[500]} />
          <Text style={{ fontSize: 14, color: colors.text.secondary, marginTop: 16 }}>
            Loading subscription details...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View style={{ flex: 1, backgroundColor: colors.background.primary }}>
        <StatusBar style="light" />

        {/* Header */}
        <View
          style={{
            paddingTop: insets.top + 16,
            paddingHorizontal: spacing.screenPadding,
            paddingBottom: 16,
            borderBottomWidth: 1,
            borderBottomColor: colors.emerald[800] + '30',
          }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Pressable
              onPress={navigateBack}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Go back"
              style={{
                width: 40,
                height: 40,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12,
              }}>
              <ArrowLeft size={24} color={colors.text.primary} />
            </Pressable>

            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: 'bold',
                  color: colors.text.primary,
                }}>
                {SUBSCRIPTION_COPY.management.header}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: colors.text.secondary,
                  marginTop: 2,
                }}>
                {SUBSCRIPTION_COPY.management.subheader}
              </Text>
            </View>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: spacing.screenPadding,
            paddingTop: spacing.lg,
            paddingBottom: spacing.safeArea.bottom + insets.bottom + 32,
          }}
          showsVerticalScrollIndicator={false}>
          {/* Payment Issue Alert */}
          {premiumStatus.isInGracePeriod && (
            <View style={{ marginBottom: spacing.lg }}>
              <PaymentIssueAlert
                gracePeriodEnd={premiumStatus.gracePeriodEnd}
                onUpdatePayment={openStoreSettings}
              />
            </View>
          )}

          {/* Current Plan Card */}
          {subscriptionData && (
            <View style={{ marginBottom: spacing.lg }}>
              <SubscriptionPlanCard
                planName={subscriptionData.planName}
                price={subscriptionData.price}
                period={subscriptionData.period}
                status={subscriptionData.status}
                nextBillingDate={subscriptionData.nextBillingDate}
                trialEndDate={subscriptionData.trialEndDate}
                accessEndDate={subscriptionData.accessEndDate}
              />
            </View>
          )}

          {/* No Subscription State */}
          {!subscriptionData && (
            <EmptySubscriptionCard
              title={SUBSCRIPTION_COPY.management.status.expired}
              message="Start your journey with Premium to access all features."
              buttonLabel="Start Your Premium Journey"
              onButtonPress={navigateToPlans}
            />
          )}

          {/* Resubscribe Button */}
          {shouldShowResubscribe(subscriptionData) && (
            <View style={{ marginBottom: spacing.lg }}>
              <SubscriptionActionButton
                label={SUBSCRIPTION_COPY.management.actions.restore}
                icon={Crown}
                onPress={navigateToPlans}
                variant="primary"
              />
            </View>
          )}

          {/* Management Actions */}
          <View style={{ marginBottom: spacing.lg }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: colors.text.primary,
                marginBottom: spacing.md,
              }}>
              Manage Your Subscription
            </Text>

            <SubscriptionActionButton
              label={SUBSCRIPTION_COPY.management.actions.changePlan}
              icon={SettingsIcon}
              onPress={navigateToPlans}
            />

            {premiumStatus.source === 'subscription' && (
              <SubscriptionActionButton
                label={SUBSCRIPTION_COPY.management.actions.manage}
                icon={ExternalLink}
                onPress={openStoreSettings}
              />
            )}

            {shouldShowRestore(premiumStatus) && (
              <SubscriptionActionButton
                label={
                  isRestoring ? SUBSCRIPTION_COPY.restore.loading : SUBSCRIPTION_COPY.restore.button
                }
                icon={RefreshCw}
                onPress={handleRestore}
                loading={isRestoring}
              />
            )}

            <SubscriptionActionButton
              label={SUBSCRIPTION_COPY.management.actions.contactSupport}
              icon={ExternalLink}
              onPress={openSupport}
            />
          </View>

          {/* Legal Links */}
          <View style={{ marginBottom: spacing.lg }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: colors.text.primary,
                marginBottom: spacing.md,
              }}>
              Legal
            </Text>

            <SubscriptionActionButton
              label={SUBSCRIPTION_COPY.legal.termsOfService}
              icon={ExternalLink}
              onPress={navigateToTerms}
            />

            <SubscriptionActionButton
              label={SUBSCRIPTION_COPY.legal.privacyPolicy}
              icon={ExternalLink}
              onPress={navigateToPrivacy}
            />
          </View>

          {/* Subscription Info */}
          <View
            style={{
              backgroundColor: colors.background.card + '80',
              borderRadius: 12,
              padding: spacing.md,
            }}>
            <Text
              style={{
                fontSize: 12,
                color: colors.text.tertiary,
                lineHeight: 18,
                textAlign: 'center',
              }}>
              {SUBSCRIPTION_COPY.legal.autoRenewal}
              {'\n\n'}
              {SUBSCRIPTION_COPY.legal.cancellation}
            </Text>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

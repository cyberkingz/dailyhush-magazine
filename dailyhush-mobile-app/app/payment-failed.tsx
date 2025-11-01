/**
 * DailyHush - Payment Failed Screen
 * Full-screen alert for billing issues with grace period countdown
 * Created: 2025-11-01
 */

import { useRouter, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ScrollView, Pressable, Linking, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { AlertCircle, CreditCard, X } from 'lucide-react-native';

import { Text } from '@/components/ui/text';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { SUBSCRIPTION_COPY, formatSubscriptionDate } from '@/constants/subscriptionCopy';
import { usePremiumStatus } from '@/hooks/useTrialGuard';

export default function PaymentFailedScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const premiumStatus = usePremiumStatus();

  const handleUpdatePayment = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Direct to App Store / Play Store subscription management
    const url =
      Platform.OS === 'ios'
        ? 'https://apps.apple.com/account/subscriptions'
        : 'https://play.google.com/store/account/subscriptions';

    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
        // After opening settings, user can dismiss this screen
      }
    } catch (error) {
      console.error('Error opening payment settings:', error);
    }
  };

  const handleNotNow = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const handleContactSupport = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // TODO: Open support email or contact screen
    const email = 'hello@daily-hush.com';
    const subject = 'Help with Payment Issue';
    const mailUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}`;

    try {
      const supported = await Linking.canOpenURL(mailUrl);
      if (supported) {
        await Linking.openURL(mailUrl);
      }
    } catch (error) {
      console.error('Error opening email:', error);
    }
  };

  const handleClose = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
          presentation: 'modal',
        }}
      />
      <View style={{ flex: 1, backgroundColor: colors.background.primary }}>
        <StatusBar style="light" />

        {/* Close Button */}
        <Pressable
          onPress={handleClose}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Close"
          style={{
            position: 'absolute',
            top: insets.top + 16,
            right: spacing.screenPadding,
            zIndex: 10,
            backgroundColor: colors.background.card,
            borderRadius: 20,
            padding: 8,
          }}>
          <X size={20} color={colors.text.secondary} />
        </Pressable>

        <ScrollView
          contentContainerStyle={{
            paddingTop: insets.top + 80,
            paddingBottom: spacing.safeArea.bottom + insets.bottom + 120,
            paddingHorizontal: spacing.screenPadding,
            alignItems: 'center',
          }}
          showsVerticalScrollIndicator={false}>
          {/* Alert Icon */}
          <View
            style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              backgroundColor: '#F59E0B' + '20',
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 4,
              borderColor: '#F59E0B' + '40',
              marginBottom: 32,
            }}>
            <AlertCircle size={64} color="#F59E0B" strokeWidth={2} />
          </View>

          {/* Header */}
          <Text
            style={{
              fontSize: 28,
              fontWeight: 'bold',
              color: colors.text.primary,
              textAlign: 'center',
              marginBottom: 16,
              lineHeight: 36,
            }}>
            {SUBSCRIPTION_COPY.paymentFailed.header}
          </Text>

          {/* Body */}
          <Text
            style={{
              fontSize: 16,
              color: colors.text.secondary,
              textAlign: 'center',
              lineHeight: 24,
              marginBottom: 32,
              maxWidth: 400,
            }}>
            {SUBSCRIPTION_COPY.paymentFailed.body}
          </Text>

          {/* Grace Period Info */}
          {premiumStatus.gracePeriodEnd && (
            <View
              style={{
                backgroundColor: colors.background.card,
                borderRadius: 20,
                padding: spacing.lg,
                marginBottom: 32,
                width: '100%',
                maxWidth: 400,
                borderWidth: 2,
                borderColor: '#F59E0B' + '30',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: spacing.sm,
                }}>
                <View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: '#F59E0B',
                    marginRight: 8,
                  }}
                />
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '700',
                    color: '#F59E0B',
                    letterSpacing: 0.5,
                  }}>
                  Grace Period Active
                </Text>
              </View>

              <Text
                style={{
                  fontSize: 15,
                  color: colors.text.secondary,
                  lineHeight: 22,
                }}>
                {SUBSCRIPTION_COPY.paymentFailed.gracePeriod(
                  formatSubscriptionDate(premiumStatus.gracePeriodEnd, true)
                )}
              </Text>
            </View>
          )}

          {/* Error-specific messaging (if we have more details) */}
          {/* This can be enhanced later with specific error codes from RevenueCat */}

          {/* Support Notice */}
          <View
            style={{
              backgroundColor: colors.emerald[900] + '40',
              borderRadius: 16,
              padding: spacing.md,
              marginBottom: 24,
              width: '100%',
              maxWidth: 400,
            }}>
            <Text
              style={{
                fontSize: 14,
                color: colors.text.secondary,
                textAlign: 'center',
                lineHeight: 20,
              }}>
              {SUBSCRIPTION_COPY.paymentFailed.support}
            </Text>
          </View>
        </ScrollView>

        {/* Action Buttons */}
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
          {/* Primary CTA: Update Payment */}
          <Pressable
            onPress={handleUpdatePayment}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={SUBSCRIPTION_COPY.paymentFailed.cta}
            style={{
              backgroundColor: '#F59E0B',
              borderRadius: 20,
              paddingVertical: 18,
              paddingHorizontal: 24,
              marginBottom: spacing.sm,
              shadowColor: '#F59E0B',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 12,
              elevation: 8,
            }}>
            {({ pressed }) => (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: pressed ? 0.9 : 1,
                }}>
                <CreditCard size={20} color={colors.white} strokeWidth={2} />
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: colors.white,
                    marginLeft: 12,
                  }}>
                  {SUBSCRIPTION_COPY.paymentFailed.cta}
                </Text>
              </View>
            )}
          </Pressable>

          {/* Secondary Actions */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              gap: spacing.sm,
            }}>
            <Pressable
              onPress={handleNotNow}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={SUBSCRIPTION_COPY.paymentFailed.secondary}
              style={{
                flex: 1,
                backgroundColor: colors.background.card,
                borderRadius: 16,
                paddingVertical: 14,
                paddingHorizontal: 20,
                borderWidth: 1,
                borderColor: colors.emerald[700] + '30',
              }}>
              {({ pressed }) => (
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: colors.text.secondary,
                    textAlign: 'center',
                    opacity: pressed ? 0.7 : 1,
                  }}>
                  {SUBSCRIPTION_COPY.paymentFailed.secondary}
                </Text>
              )}
            </Pressable>

            <Pressable
              onPress={handleContactSupport}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Contact Support"
              style={{
                flex: 1,
                backgroundColor: colors.background.card,
                borderRadius: 16,
                paddingVertical: 14,
                paddingHorizontal: 20,
                borderWidth: 1,
                borderColor: colors.emerald[700] + '30',
              }}>
              {({ pressed }) => (
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: colors.text.secondary,
                    textAlign: 'center',
                    opacity: pressed ? 0.7 : 1,
                  }}>
                  Get Help
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </>
  );
}

/**
 * DailyHush - Subscription Management
 * Premium tier upgrade and management
 */

import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, Typography, BorderRadius } from '@/constants/theme';
import { useNightMode, useUser } from '@/store/useStore';
import {
  getUserSubscription,
  isPremiumUser,
  getSubscriptionBenefits,
  formatPrice,
  SUBSCRIPTION_TIERS,
  type SubscriptionInfo,
  type SubscriptionTier,
} from '@/utils/stripe';

export default function Subscription() {
  const router = useRouter();
  const user = useUser();
  const nightMode = useNightMode();

  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier>(SUBSCRIPTION_TIERS.MONTHLY);

  const backgroundColor = nightMode ? Colors.nightMode.background : Colors.background.primary;
  const textColor = nightMode ? Colors.nightMode.text : Colors.neutral.neutral50;

  // Load user's current subscription
  useEffect(() => {
    loadSubscription();
  }, [user]);

  const loadSubscription = async () => {
    if (!user) return;

    setIsLoading(true);
    const subInfo = await getUserSubscription(user.user_id);
    setSubscription(subInfo);
    setIsLoading(false);
  };

  const handleUpgrade = async (tier: SubscriptionTier) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // TODO: Implement Stripe Checkout
    // This would typically open a Stripe Checkout session
    // or navigate to a payment screen

    console.log('Upgrading to:', tier);

    // For now, just show a message
    alert('Stripe Checkout would open here. This will be implemented with your Stripe account.');
  };

  const handleManageSubscription = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // TODO: Open Stripe Customer Portal
    // This would open the Stripe billing portal for subscription management

    console.log('Opening Stripe portal');
    alert('Stripe Customer Portal would open here.');
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.primary.emerald600} />
      </View>
    );
  }

  const isPremium = isPremiumUser(subscription);
  const currentTier = subscription?.tier || SUBSCRIPTION_TIERS.FREE;

  return (
    <View style={{ flex: 1, backgroundColor }}>
      <StatusBar style="light" />

      <ScrollView
        contentContainerStyle={{
          padding: Spacing.lg,
          paddingTop: Spacing.xxxl,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginBottom: Spacing.md }}
        >
          <Text
            style={{
              fontSize: Typography.fontSize.body,
              color: Colors.primary.emerald600,
            }}
          >
            ‹ Back
          </Text>
        </TouchableOpacity>

        <Text
          style={{
            fontSize: Typography.fontSize.heading1,
            fontWeight: Typography.fontWeight.bold as any,
            color: textColor,
            marginBottom: Spacing.sm,
          }}
        >
          Subscription
        </Text>

        <Text
          style={{
            fontSize: Typography.fontSize.body,
            color: nightMode ? Colors.nightMode.textMuted : Colors.neutral.neutral300,
            marginBottom: Spacing.xl,
          }}
        >
          {isPremium
            ? 'You have access to all Premium features'
            : 'Unlock advanced insights and export reports'}
        </Text>

        {/* Current Plan */}
        {isPremium && (
          <View
            style={{
              backgroundColor: Colors.success.green100,
              borderRadius: BorderRadius.md,
              padding: Spacing.lg,
              marginBottom: Spacing.xl,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.xs }}>
              <Text style={{ fontSize: 24, marginRight: Spacing.sm }}>✨</Text>
              <Text
                style={{
                  fontSize: Typography.fontSize.heading3,
                  fontWeight: Typography.fontWeight.bold as any,
                  color: Colors.neutral.neutral50,
                }}
              >
                Premium Active
              </Text>
            </View>
            <Text
              style={{
                fontSize: Typography.fontSize.body,
                color: Colors.neutral.neutral300,
                marginBottom: Spacing.md,
              }}
            >
              {currentTier === SUBSCRIPTION_TIERS.ANNUAL ? 'Annual Plan' : 'Monthly Plan'}
            </Text>
            {subscription?.current_period_end && (
              <Text
                style={{
                  fontSize: Typography.fontSize.caption,
                  color: Colors.text.slate600,
                }}
              >
                Renews {new Date(subscription.current_period_end).toLocaleDateString()}
              </Text>
            )}
          </View>
        )}

        {/* Pricing Cards */}
        <View style={{ marginBottom: Spacing.xl }}>
          {/* Monthly Plan */}
          <TouchableOpacity
            onPress={() => setSelectedTier(SUBSCRIPTION_TIERS.MONTHLY)}
            disabled={currentTier === SUBSCRIPTION_TIERS.MONTHLY}
            activeOpacity={0.8}
            style={{
              backgroundColor:
                selectedTier === SUBSCRIPTION_TIERS.MONTHLY
                  ? Colors.primary.emerald50
                  : nightMode
                  ? Colors.nightMode.surface
                  : '#FFFFFF',
              borderRadius: BorderRadius.md,
              padding: Spacing.lg,
              marginBottom: Spacing.md,
              borderWidth: 3,
              borderColor:
                selectedTier === SUBSCRIPTION_TIERS.MONTHLY
                  ? Colors.primary.emerald600
                  : 'transparent',
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: Typography.fontSize.heading3,
                    fontWeight: Typography.fontWeight.bold as any,
                    color: textColor,
                    marginBottom: Spacing.xs,
                  }}
                >
                  Premium Monthly
                </Text>
                <Text
                  style={{
                    fontSize: Typography.fontSize.heading2,
                    fontWeight: Typography.fontWeight.bold as any,
                    color: Colors.primary.emerald600,
                  }}
                >
                  {formatPrice(SUBSCRIPTION_TIERS.MONTHLY)}
                </Text>
              </View>
              {currentTier === SUBSCRIPTION_TIERS.MONTHLY && (
                <View
                  style={{
                    backgroundColor: Colors.primary.emerald600,
                    borderRadius: BorderRadius.sm,
                    paddingHorizontal: Spacing.sm,
                    paddingVertical: Spacing.xs,
                  }}
                >
                  <Text
                    style={{
                      fontSize: Typography.fontSize.caption,
                      fontWeight: Typography.fontWeight.bold as any,
                      color: '#FFFFFF',
                    }}
                  >
                    Current
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>

          {/* Annual Plan */}
          <TouchableOpacity
            onPress={() => setSelectedTier(SUBSCRIPTION_TIERS.ANNUAL)}
            disabled={currentTier === SUBSCRIPTION_TIERS.ANNUAL}
            activeOpacity={0.8}
            style={{
              backgroundColor:
                selectedTier === SUBSCRIPTION_TIERS.ANNUAL
                  ? Colors.primary.emerald50
                  : nightMode
                  ? Colors.nightMode.surface
                  : '#FFFFFF',
              borderRadius: BorderRadius.md,
              padding: Spacing.lg,
              marginBottom: Spacing.md,
              borderWidth: 3,
              borderColor:
                selectedTier === SUBSCRIPTION_TIERS.ANNUAL
                  ? Colors.primary.emerald600
                  : 'transparent',
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.xs }}>
                  <Text
                    style={{
                      fontSize: Typography.fontSize.heading3,
                      fontWeight: Typography.fontWeight.bold as any,
                      color: textColor,
                      marginRight: Spacing.sm,
                    }}
                  >
                    Premium Annual
                  </Text>
                  <View
                    style={{
                      backgroundColor: Colors.secondary.amber500,
                      borderRadius: BorderRadius.xs,
                      paddingHorizontal: Spacing.xs,
                      paddingVertical: 2,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: Typography.fontSize.caption,
                        fontWeight: Typography.fontWeight.bold as any,
                        color: '#FFFFFF',
                      }}
                    >
                      SAVE $20
                    </Text>
                  </View>
                </View>
                <Text
                  style={{
                    fontSize: Typography.fontSize.heading2,
                    fontWeight: Typography.fontWeight.bold as any,
                    color: Colors.primary.emerald600,
                  }}
                >
                  {formatPrice(SUBSCRIPTION_TIERS.ANNUAL)}
                </Text>
              </View>
              {currentTier === SUBSCRIPTION_TIERS.ANNUAL && (
                <View
                  style={{
                    backgroundColor: Colors.primary.emerald600,
                    borderRadius: BorderRadius.sm,
                    paddingHorizontal: Spacing.sm,
                    paddingVertical: Spacing.xs,
                  }}
                >
                  <Text
                    style={{
                      fontSize: Typography.fontSize.caption,
                      fontWeight: Typography.fontWeight.bold as any,
                      color: '#FFFFFF',
                    }}
                  >
                    Current
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>

        {/* Benefits List */}
        <View
          style={{
            backgroundColor: nightMode ? Colors.nightMode.surface : '#FFFFFF',
            borderRadius: BorderRadius.md,
            padding: Spacing.lg,
            marginBottom: Spacing.xl,
          }}
        >
          <Text
            style={{
              fontSize: Typography.fontSize.heading3,
              fontWeight: Typography.fontWeight.bold as any,
              color: textColor,
              marginBottom: Spacing.md,
            }}
          >
            Premium Benefits
          </Text>

          {getSubscriptionBenefits(SUBSCRIPTION_TIERS.MONTHLY).map((benefit, index) => (
            <View
              key={index}
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                marginBottom: index < getSubscriptionBenefits(SUBSCRIPTION_TIERS.MONTHLY).length - 1 ? Spacing.sm : 0,
              }}
            >
              <Text
                style={{
                  fontSize: Typography.fontSize.body,
                  color: Colors.primary.emerald600,
                  marginRight: Spacing.sm,
                }}
              >
                ✓
              </Text>
              <Text
                style={{
                  flex: 1,
                  fontSize: Typography.fontSize.body,
                  color: nightMode ? Colors.nightMode.textMuted : Colors.neutral.neutral300,
                  lineHeight: Typography.lineHeight.body * Typography.fontSize.body,
                }}
              >
                {benefit}
              </Text>
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        {!isPremium ? (
          <TouchableOpacity
            onPress={() => handleUpgrade(selectedTier)}
            style={{
              backgroundColor: Colors.primary.emerald600,
              borderRadius: BorderRadius.lg,
              padding: Spacing.lg,
              alignItems: 'center',
              minHeight: 64,
              justifyContent: 'center',
              marginBottom: Spacing.md,
            }}
          >
            <Text
              style={{
                fontSize: Typography.fontSize.button,
                fontWeight: Typography.fontWeight.bold as any,
                color: '#FFFFFF',
              }}
            >
              Upgrade to Premium
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={handleManageSubscription}
            style={{
              backgroundColor: nightMode ? Colors.nightMode.surface : '#FFFFFF',
              borderRadius: BorderRadius.lg,
              padding: Spacing.lg,
              alignItems: 'center',
              borderWidth: 2,
              borderColor: Colors.primary.emerald600,
              marginBottom: Spacing.md,
            }}
          >
            <Text
              style={{
                fontSize: Typography.fontSize.button,
                fontWeight: Typography.fontWeight.bold as any,
                color: Colors.primary.emerald600,
              }}
            >
              Manage Subscription
            </Text>
          </TouchableOpacity>
        )}

        {/* Fine Print */}
        <Text
          style={{
            fontSize: Typography.fontSize.caption,
            color: nightMode ? Colors.nightMode.textMuted : Colors.text.slate500,
            textAlign: 'center',
            lineHeight: Typography.lineHeight.caption * Typography.fontSize.caption,
          }}
        >
          Cancel anytime. No hidden fees. Secure payments via Stripe.
        </Text>
      </ScrollView>
    </View>
  );
}

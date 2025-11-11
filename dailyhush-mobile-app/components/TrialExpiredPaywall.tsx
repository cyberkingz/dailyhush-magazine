/**
 * Nœma - Trial Expired Paywall Component
 * Shows when 7-day Premium trial expires
 * Offers subscription or Free tier continuation
 * Created: 2025-10-31
 */

import { View } from 'react-native';
import { Clock, Crown } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import type { LoopType } from '@/data/quizQuestions';

import { PaywallHeader } from '@/components/paywall/PaywallHeader';
import { FeaturesList } from '@/components/paywall/FeaturesList';
import { PaywallButton } from '@/components/paywall/PaywallButton';
import { PaywallSecondaryButton } from '@/components/paywall/PaywallSecondaryButton';
import { PaywallCloseButton } from '@/components/paywall/PaywallCloseButton';
import { PricingPreview } from '@/components/paywall/PricingPreview';
import { LegalFooter } from '@/components/legal';
import {
  PREMIUM_FEATURES,
  PRICING_PREVIEW_TEXT,
  FREE_PLAN_DESCRIPTION,
} from '@/constants/subscription';

interface TrialExpiredPaywallProps {
  loopType: LoopType | null;
  onSubscribe: () => void;
  onContinueFree: () => void;
  onRestorePurchases?: () => void | Promise<void>;
  onClose?: () => void;
  isLoading?: boolean;
  showClose?: boolean;
}

const LOOP_MESSAGES: Record<LoopType, { title: string; description: string }> = {
  'sleep-loop': {
    title: 'Your 3AM thoughts miss the quiet',
    description:
      "You've experienced better sleep these past 7 days.\nKeep breaking the nighttime rumination loop.",
  },
  'decision-loop': {
    title: "You've made faster decisions this week",
    description:
      'Analysis paralysis is fading.\nKeep building your confident decision-making momentum.',
  },
  'social-loop': {
    title: "You've replayed fewer conversations",
    description:
      'Social interactions feel lighter now.\nKeep building confidence in your social moments.',
  },
  'perfectionism-loop': {
    title: "You've let go of perfect this week",
    description:
      'Mistakes sting less now.\nKeep practicing self-compassion and progress over perfection.',
  },
};

export function TrialExpiredPaywall({
  loopType,
  onSubscribe,
  onContinueFree,
  onRestorePurchases,
  onClose,
  isLoading = false,
  showClose = false,
}: TrialExpiredPaywallProps) {
  const loopMessage = loopType ? LOOP_MESSAGES[loopType] : null;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background.primary }}>
      {/* Close Button */}
      {showClose && onClose && <PaywallCloseButton onClose={onClose} />}

      {/* Header */}
      <View style={{ marginTop: 80 }}>
        <PaywallHeader icon={Clock} title="Your 7-Day Trial Has Ended" />
      </View>

      {/* Loop-specific message */}
      {loopMessage && (
        <>
          <Text
            style={{
              fontSize: 20,
              fontWeight: '600',
              color: colors.emerald[400],
              textAlign: 'center',
              marginBottom: 8,
              paddingHorizontal: spacing.screenPadding,
              lineHeight: 28,
            }}>
            {loopMessage.title}
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: colors.text.secondary,
              textAlign: 'center',
              lineHeight: 24,
              marginBottom: 32,
              paddingHorizontal: spacing.screenPadding,
            }}>
            {loopMessage.description}
          </Text>
        </>
      )}

      {/* Premium Features with Icon Title */}
      <View style={{ marginHorizontal: spacing.screenPadding, marginBottom: 24 }}>
        <View
          style={{
            backgroundColor: colors.background.card,
            borderRadius: 20,
            padding: 24,
            borderWidth: 1,
            borderColor: colors.emerald[700] + '30',
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
            }}>
            <Crown
              size={20}
              color={colors.emerald[400]}
              strokeWidth={2}
              style={{ marginRight: 8 }}
            />
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: colors.emerald[300],
              }}>
              Continue with Premium
            </Text>
          </View>
          <FeaturesList features={PREMIUM_FEATURES} backgroundColor="transparent" />
        </View>
      </View>

      {/* CTA Buttons */}
      <View style={{ paddingHorizontal: spacing.screenPadding, marginBottom: 16 }}>
        <PaywallButton
          onPress={onSubscribe}
          isLoading={isLoading}
          title="Subscribe to Premium"
          subtitle="Choose your plan: Monthly, Annual, or Lifetime"
        />

        <View style={{ marginTop: 12 }}>
          <PricingPreview text={PRICING_PREVIEW_TEXT} variant="urgency" />
        </View>
      </View>

      {/* Secondary Action */}
      <View style={{ marginBottom: 24 }}>
        <PaywallSecondaryButton
          onPress={onContinueFree}
          text="Continue with Free plan"
          disabled={isLoading}
        />
      </View>

      {/* Free Plan Description */}
      <View style={{ paddingHorizontal: spacing.screenPadding, marginBottom: 24 }}>
        <Text
          style={{
            fontSize: 13,
            color: colors.text.tertiary,
            textAlign: 'center',
            lineHeight: 20,
          }}>
          {FREE_PLAN_DESCRIPTION}
        </Text>
      </View>

      {/* Legal Footer */}
      {onRestorePurchases && (
        <LegalFooter showRestore={true} onRestorePurchases={onRestorePurchases} />
      )}
    </View>
  );
}

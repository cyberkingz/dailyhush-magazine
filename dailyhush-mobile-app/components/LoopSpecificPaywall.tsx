/**
 * DailyHush - Loop-Specific Paywall Component
 * Shows personalized Premium trial offer based on quiz loop type
 * Created: 2025-10-31
 */

import { View } from 'react-native';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import type { LoopType } from '@/data/quizQuestions';

import { PaywallHeader } from '@/components/paywall/PaywallHeader';
import { FeaturesList } from '@/components/paywall/FeaturesList';
import { PaywallButton } from '@/components/paywall/PaywallButton';
import { PaywallCloseButton } from '@/components/paywall/PaywallCloseButton';
import { PricingPreview } from '@/components/paywall/PricingPreview';
import { LOOP_PAYWALL_CONFIG } from '@/constants/loopPaywalls';
import { FREE_PLAN_DESCRIPTION } from '@/constants/subscription';

interface LoopSpecificPaywallProps {
  loopType: LoopType;
  onStartTrial: () => void;
  onContinueFree?: () => void; // Optional - may not be used
  onClose?: () => void; // Optional - only for modal usage
  showCloseButton?: boolean; // Default: true
  isLoading?: boolean;
}

export function LoopSpecificPaywall({
  loopType,
  onStartTrial,
  onContinueFree,
  onClose,
  showCloseButton = true,
  isLoading = false,
}: LoopSpecificPaywallProps) {
  const config = LOOP_PAYWALL_CONFIG[loopType];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background.primary }}>
      {/* Close Button (optional) */}
      {showCloseButton && onClose && <PaywallCloseButton onClose={onClose} />}

      {/* Header */}
      <View style={{ marginTop: 80 }}>
        <PaywallHeader
          icon={config.icon}
          title={`You're a ${config.emoji}\n${config.title}`}
          subtitle={config.subtitle}
        />
      </View>

      {/* Features List */}
      <View style={{ marginHorizontal: spacing.screenPadding, marginBottom: 24 }}>
        <FeaturesList title="Your Personalized 7-Day Protocol:" features={config.features} />
      </View>

      {/* Trial CTA */}
      <View style={{ paddingHorizontal: spacing.screenPadding, marginBottom: 16 }}>
        <PaywallButton
          onPress={onStartTrial}
          isLoading={isLoading}
          title="Try FREE for 7 Days"
          subtitle="No credit card required • Cancel anytime"
          loadingText="Starting Trial..."
        />

        {/* Urgency Tag */}
        <View style={{ marginTop: 12 }}>
          <PricingPreview text={config.urgency} variant="urgency" />
        </View>
      </View>

      {/* Pricing Preview */}
      <View style={{ paddingHorizontal: spacing.screenPadding, marginBottom: 40 }}>
        <PricingPreview
          text={`After trial: $9.99/month • $59.99/year • $149.99 lifetime\n${FREE_PLAN_DESCRIPTION}`}
        />
      </View>
    </View>
  );
}

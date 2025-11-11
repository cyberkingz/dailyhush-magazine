/**
 * Nœma - Pricing Preview Component
 * Shows pricing information in a card
 */

import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { colors } from '@/constants/colors';

interface PricingPreviewProps {
  text: string;
  variant?: 'default' | 'urgency';
}

export function PricingPreview({ text, variant = 'default' }: PricingPreviewProps) {
  return (
    <View
      style={{
        backgroundColor: colors.emerald[800] + '30',
        borderRadius: 12,
        padding: 12,
        borderWidth: 1,
        borderColor: colors.emerald[700] + '30',
      }}>
      <Text
        style={{
          fontSize: variant === 'urgency' ? 14 : 13,
          color: colors.emerald[300],
          textAlign: 'center',
          fontWeight: '600',
          lineHeight: variant === 'urgency' ? 20 : 18,
        }}>
        {text}
      </Text>
    </View>
  );
}

/**
 * Nœma - Subscription Status Badge Component
 * Displays current subscription status with appropriate styling
 * Created: 2025-11-01
 */

import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { colors } from '@/constants/colors';
import { SUBSCRIPTION_COPY } from '@/constants/subscriptionCopy';

export type SubscriptionStatus = 'active' | 'trial' | 'payment_issue' | 'canceled' | 'expired';

interface SubscriptionStatusBadgeProps {
  status: SubscriptionStatus;
  size?: 'small' | 'medium' | 'large';
}

export function SubscriptionStatusBadge({ status, size = 'small' }: SubscriptionStatusBadgeProps) {
  const isSmall = size === 'small';
  const isLarge = size === 'large';

  // Status-specific styling
  const config = {
    active: {
      backgroundColor: colors.emerald[600] + '20',
      borderColor: colors.emerald[600] + '40',
      textColor: colors.emerald[400],
      label: SUBSCRIPTION_COPY.badges.active,
    },
    trial: {
      backgroundColor: colors.emerald[700] + '20',
      borderColor: colors.emerald[700] + '40',
      textColor: colors.emerald[300],
      label: SUBSCRIPTION_COPY.badges.trial,
    },
    payment_issue: {
      backgroundColor: '#F59E0B' + '20',
      borderColor: '#F59E0B' + '40',
      textColor: '#F59E0B',
      label: SUBSCRIPTION_COPY.badges.paymentIssue,
    },
    canceled: {
      backgroundColor: colors.text.tertiary + '20',
      borderColor: colors.text.tertiary + '30',
      textColor: colors.text.secondary,
      label: SUBSCRIPTION_COPY.badges.canceled,
    },
    expired: {
      backgroundColor: colors.text.tertiary + '15',
      borderColor: colors.text.tertiary + '25',
      textColor: colors.text.tertiary,
      label: SUBSCRIPTION_COPY.badges.expired,
    },
  }[status];

  // Size-specific styling
  const paddingHorizontal = isLarge ? 16 : isSmall ? 10 : 12;
  const paddingVertical = isLarge ? 8 : isSmall ? 4 : 6;
  const borderRadius = isLarge ? 20 : isSmall ? 12 : 16;
  const fontSize = isLarge ? 16 : isSmall ? 12 : 14;

  return (
    <View
      accessible={true}
      accessibilityLabel={`Subscription status: ${config.label}`}
      accessibilityRole="text"
      style={{
        backgroundColor: config.backgroundColor,
        borderWidth: isLarge ? 2 : 1,
        borderColor: config.borderColor,
        paddingHorizontal,
        paddingVertical,
        borderRadius,
        alignSelf: 'flex-start',
        shadowColor:
          isLarge && (status === 'active' || status === 'trial') ? config.textColor : 'transparent',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: isLarge ? 4 : 0,
      }}>
      <Text
        style={{
          fontSize,
          fontWeight: '700',
          color: config.textColor,
          letterSpacing: 0.5,
        }}>
        {config.label}
      </Text>
    </View>
  );
}

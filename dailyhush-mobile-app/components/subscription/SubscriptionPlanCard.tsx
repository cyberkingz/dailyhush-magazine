/**
 * DailyHush - Subscription Plan Card Component
 * Shows current subscription plan details with premium visual design
 * Created: 2025-11-01
 * Updated: 2025-11-01 - Enhanced UI/UX with improved hierarchy and premium feel
 */

import { View } from 'react-native';
import { Crown, Calendar } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { SubscriptionStatusBadge, SubscriptionStatus } from './SubscriptionStatusBadge';
import { SUBSCRIPTION_COPY, formatSubscriptionDate } from '@/constants/subscriptionCopy';

interface SubscriptionPlanCardProps {
  planName: string; // e.g., "Premium Monthly"
  price: string; // e.g., "$9.99"
  period: string; // e.g., "/month"
  status: SubscriptionStatus;
  nextBillingDate?: Date | string | null;
  trialEndDate?: Date | string | null;
  accessEndDate?: Date | string | null; // For canceled subscriptions
}

export function SubscriptionPlanCard({
  planName,
  price,
  period,
  status,
  nextBillingDate,
  trialEndDate,
  accessEndDate,
}: SubscriptionPlanCardProps) {
  // Determine the date text to show
  let dateText = '';
  if (trialEndDate) {
    dateText = SUBSCRIPTION_COPY.management.planCard.trialEnds(
      formatSubscriptionDate(trialEndDate)
    );
  } else if (nextBillingDate && status === 'active') {
    dateText = SUBSCRIPTION_COPY.management.planCard.nextBilling(
      formatSubscriptionDate(nextBillingDate)
    );
  } else if (accessEndDate && status === 'canceled') {
    dateText = SUBSCRIPTION_COPY.management.planCard.canceledAccess(
      formatSubscriptionDate(accessEndDate)
    );
  }

  const isActive = status === 'active' || status === 'trial';

  return (
    <View
      accessible={true}
      accessibilityLabel={`Current plan: ${planName}, ${price} ${period}, Status: ${status}`}
      accessibilityHint={dateText}
      style={{
        backgroundColor: isActive
          ? colors.emerald[900] + '40'
          : colors.background.card,
        borderRadius: 20,
        padding: spacing.lg,
        borderWidth: 2,
        borderColor: isActive
          ? colors.emerald[600] + '50'
          : colors.text.tertiary + '20',
        shadowColor: isActive ? colors.emerald[500] : 'transparent',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: isActive ? 6 : 0,
      }}>
      {/* Header Row: Crown Icon + Status Badge */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: spacing.sm,
        }}>
        <View
          style={{
            width: 52,
            height: 52,
            borderRadius: 26,
            backgroundColor: colors.emerald[600] + '25',
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 2,
            borderColor: colors.emerald[600] + '40',
            shadowColor: colors.emerald[500],
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: isActive ? 0.25 : 0,
            shadowRadius: 6,
            elevation: isActive ? 3 : 0,
          }}>
          <Crown size={26} color={colors.emerald[500]} strokeWidth={2.5} />
        </View>

        <SubscriptionStatusBadge status={status} size="medium" />
      </View>

      {/* Plan Name */}
      <Text
        style={{
          fontSize: 22,
          fontWeight: 'bold',
          color: colors.text.primary,
          marginBottom: spacing.xs,
          letterSpacing: -0.3,
        }}>
        {planName}
      </Text>

      {/* Renewal Date - Compact */}
      {dateText && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: spacing.xs,
          }}>
          <Calendar
            size={14}
            color={colors.emerald[400]}
            strokeWidth={2}
            style={{ marginRight: 6 }}
          />
          <Text
            style={{
              fontSize: 14,
              fontWeight: '600',
              color: colors.emerald[300],
            }}>
            {dateText}
          </Text>
        </View>
      )}

      {/* Price - Compact */}
      <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: '700',
            color: colors.text.secondary,
          }}>
          {price}
        </Text>
        <Text
          style={{
            fontSize: 13,
            color: colors.text.tertiary,
            marginLeft: 3,
          }}>
          {period}
        </Text>
      </View>
    </View>
  );
}

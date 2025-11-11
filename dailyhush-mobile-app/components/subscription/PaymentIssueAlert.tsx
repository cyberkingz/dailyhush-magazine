/**
 * Nœma - Payment Issue Alert Component
 * Displays warning when there's a billing problem
 * Created: 2025-11-01
 */

import { View, Pressable } from 'react-native';
import { AlertCircle, ChevronRight } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Text } from '@/components/ui/text';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { SUBSCRIPTION_COPY, formatSubscriptionDate } from '@/constants/subscriptionCopy';

interface PaymentIssueAlertProps {
  gracePeriodEnd?: Date | string | null;
  onUpdatePayment: () => void;
}

export function PaymentIssueAlert({ gracePeriodEnd, onUpdatePayment }: PaymentIssueAlertProps) {
  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onUpdatePayment();
  };

  return (
    <View
      accessible={true}
      accessibilityLabel="Payment issue alert"
      accessibilityHint="Tap to update payment method"
      style={{
        backgroundColor: '#F59E0B' + '15',
        borderRadius: 16,
        padding: spacing.md,
        borderWidth: 1.5,
        borderColor: '#F59E0B' + '40',
      }}>
      {/* Icon and Title */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-start',
          marginBottom: spacing.sm,
        }}>
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: '#F59E0B' + '25',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
          }}>
          <AlertCircle size={20} color="#F59E0B" strokeWidth={2.5} />
        </View>

        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: '#F59E0B',
              marginBottom: 4,
            }}>
            {SUBSCRIPTION_COPY.management.status.paymentIssue}
          </Text>

          <Text
            style={{
              fontSize: 14,
              color: colors.text.secondary,
              lineHeight: 20,
            }}>
            {SUBSCRIPTION_COPY.paymentFailed.body}
          </Text>

          {/* Grace Period Info */}
          {gracePeriodEnd && (
            <View
              style={{
                backgroundColor: colors.background.card,
                borderRadius: 10,
                padding: spacing.sm,
                marginTop: spacing.sm,
              }}>
              <Text
                style={{
                  fontSize: 13,
                  color: colors.text.secondary,
                  lineHeight: 18,
                }}>
                {SUBSCRIPTION_COPY.paymentFailed.gracePeriod(
                  formatSubscriptionDate(gracePeriodEnd, true)
                )}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Update Payment Button */}
      <Pressable
        onPress={handlePress}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={SUBSCRIPTION_COPY.paymentFailed.cta}
        style={{
          backgroundColor: '#F59E0B',
          borderRadius: 14,
          paddingVertical: 14,
          paddingHorizontal: 20,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: spacing.sm,
        }}>
        {({ pressed }) => (
          <>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: colors.white,
                opacity: pressed ? 0.9 : 1,
              }}>
              {SUBSCRIPTION_COPY.paymentFailed.cta}
            </Text>
            <ChevronRight
              size={20}
              color={colors.white}
              strokeWidth={2.5}
              style={{ marginLeft: 8, opacity: pressed ? 0.9 : 1 }}
            />
          </>
        )}
      </Pressable>
    </View>
  );
}

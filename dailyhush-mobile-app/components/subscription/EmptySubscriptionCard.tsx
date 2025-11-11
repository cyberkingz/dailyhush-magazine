/**
 * Nœma - Empty Subscription Card Component
 * Displays when user has no active subscription
 * Created: 2025-11-01
 */

import { View, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';

interface EmptySubscriptionCardProps {
  title: string;
  message: string;
  buttonLabel: string;
  onButtonPress: () => void;
}

export function EmptySubscriptionCard({
  title,
  message,
  buttonLabel,
  onButtonPress,
}: EmptySubscriptionCardProps) {
  return (
    <View
      style={{
        backgroundColor: colors.background.card,
        borderRadius: 20,
        padding: spacing.lg,
        marginBottom: spacing.lg,
        borderWidth: 2,
        borderColor: colors.text.tertiary + '20',
      }}>
      <Text
        style={{
          fontSize: 18,
          fontWeight: 'bold',
          color: colors.text.primary,
          marginBottom: 8,
        }}>
        {title}
      </Text>
      <Text
        style={{
          fontSize: 15,
          color: colors.text.secondary,
          lineHeight: 22,
          marginBottom: spacing.md,
        }}>
        {message}
      </Text>

      <Pressable
        onPress={onButtonPress}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={buttonLabel}
        style={{
          backgroundColor: colors.emerald[600],
          borderRadius: 14,
          paddingVertical: 14,
          paddingHorizontal: 20,
          alignItems: 'center',
          shadowColor: colors.emerald[500],
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 6,
        }}>
        {({ pressed }) => (
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: colors.white,
              opacity: pressed ? 0.9 : 1,
            }}>
            {buttonLabel}
          </Text>
        )}
      </Pressable>
    </View>
  );
}

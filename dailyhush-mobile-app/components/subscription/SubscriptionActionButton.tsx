/**
 * DailyHush - Subscription Action Button Component
 * Reusable button for subscription actions
 * Created: 2025-11-01
 */

import { Pressable, View, ActivityIndicator } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';

interface SubscriptionActionButtonProps {
  label: string;
  icon: LucideIcon;
  onPress: () => void;
  loading?: boolean;
  variant?: 'default' | 'primary';
}

export function SubscriptionActionButton({
  label,
  icon: Icon,
  onPress,
  loading = false,
  variant = 'default',
}: SubscriptionActionButtonProps) {
  const isPrimary = variant === 'primary';

  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ busy: loading }}
      style={{
        backgroundColor: isPrimary ? colors.emerald[600] : colors.background.card,
        borderRadius: isPrimary ? 14 : 16,
        padding: spacing.md,
        marginBottom: spacing.sm,
        borderWidth: isPrimary ? 0 : 1,
        borderColor: colors.emerald[700] + '30',
        ...(isPrimary && {
          shadowColor: colors.emerald[500],
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 6,
        }),
      }}>
      {({ pressed }) => (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            opacity: pressed && !loading ? 0.7 : 1,
          }}>
          {loading ? (
            <ActivityIndicator
              size="small"
              color={isPrimary ? colors.white : colors.emerald[400]}
              style={{ marginRight: 12 }}
            />
          ) : (
            <Icon
              size={20}
              color={isPrimary ? colors.white : colors.emerald[400]}
              style={{ marginRight: 12 }}
            />
          )}
          <Text
            style={{
              flex: 1,
              fontSize: 16,
              color: isPrimary ? colors.white : colors.text.primary,
              fontWeight: isPrimary ? 'bold' : '600',
            }}>
            {label}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

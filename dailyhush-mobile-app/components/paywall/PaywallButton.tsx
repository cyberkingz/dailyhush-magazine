/**
 * DailyHush - Paywall Button Component
 * Reusable CTA button for paywall screens
 */

import { Pressable, View, ActivityIndicator } from 'react-native';
import { LucideIcon, Sparkles } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { colors } from '@/constants/colors';

interface PaywallButtonProps {
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  loadingText?: string;
}

export function PaywallButton({
  onPress,
  isLoading = false,
  disabled = false,
  title,
  subtitle,
  icon: Icon = Sparkles,
  loadingText = 'Loading...',
}: PaywallButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={{
        backgroundColor: isDisabled ? colors.emerald[700] : colors.emerald[600],
        borderRadius: 20,
        paddingVertical: 20,
        paddingHorizontal: 24,
        shadowColor: colors.emerald[500],
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: isDisabled ? 0.2 : 0.4,
        shadowRadius: 12,
        elevation: isDisabled ? 4 : 8,
      }}>
      {({ pressed }) => (
        <View
          style={{
            opacity: pressed && !isDisabled ? 0.9 : 1,
            alignItems: 'center',
          }}>
          {isLoading ? (
            <>
              <ActivityIndicator size="small" color={colors.white} />
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  color: colors.white,
                  marginTop: 8,
                }}>
                {loadingText}
              </Text>
            </>
          ) : (
            <>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: subtitle ? 4 : 0 }}>
                <Icon size={20} color={colors.white} strokeWidth={2} />
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: colors.white,
                    marginLeft: 8,
                  }}>
                  {title}
                </Text>
              </View>
              {subtitle && (
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.emerald[100],
                    marginTop: 4,
                  }}>
                  {subtitle}
                </Text>
              )}
            </>
          )}
        </View>
      )}
    </Pressable>
  );
}

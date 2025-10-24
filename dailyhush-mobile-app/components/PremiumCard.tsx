/**
 * DailyHush - Premium Card Component
 * Enhanced card with glassmorphism, shadows, and gradient overlays
 */

import { View, Pressable, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/constants/colors';

interface PremiumCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'default' | 'elevated' | 'gradient';
  style?: ViewStyle;
  activeOpacity?: number;
}

export function PremiumCard({
  children,
  onPress,
  variant = 'default',
  style,
  activeOpacity = 0.9,
}: PremiumCardProps) {
  const baseStyle: ViewStyle = {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: colors.shadow.light,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 3,
  };

  const variantStyles: Record<string, ViewStyle> = {
    default: {
      backgroundColor: colors.background.secondary,
      borderWidth: 1,
      borderColor: colors.background.border,
    },
    elevated: {
      backgroundColor: colors.background.tertiary,
      borderWidth: 1,
      borderColor: colors.emerald[600] + '30',
      shadowRadius: 16,
      elevation: 5,
    },
    gradient: {
      borderWidth: 1,
      borderColor: colors.emerald[600] + '40',
      shadowRadius: 20,
      elevation: 6,
    },
  };

  const content = (
    <View style={[baseStyle, variantStyles[variant], style]}>
      {variant === 'gradient' && (
        <LinearGradient
          colors={colors.gradients.card}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />
      )}
      <View style={{ position: 'relative', zIndex: 1 }}>{children}</View>
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={{ opacity: 1 }} android_ripple={{ color: colors.emerald[600] + '20' }}>
        {({ pressed }) => (
          <View style={{ opacity: pressed ? activeOpacity : 1 }}>{content}</View>
        )}
      </Pressable>
    );
  }

  return content;
}

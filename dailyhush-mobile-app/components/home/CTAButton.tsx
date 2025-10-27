/**
 * CTAButton Component
 * Large, prominent call-to-action button
 */

import { Pressable, View, Text } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { colors } from '@/constants/colors';

interface CTAButtonProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  onPress: () => void;
  iconSize?: number;
  backgroundColor?: string;
  pressedColor?: string;
}

export function CTAButton({
  title,
  subtitle,
  icon: Icon,
  onPress,
  iconSize = 32,
  backgroundColor = colors.emerald[400],
  pressedColor = colors.emerald[500],
}: CTAButtonProps) {
  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    onPress();
  };

  return (
    <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
      <Pressable
        onPress={handlePress}
        style={{
          backgroundColor: backgroundColor,
          borderRadius: 24,
          padding: 24,
          alignItems: 'center',
          shadowColor: colors.emerald[500],
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.4,
          shadowRadius: 16,
          elevation: 8,
        }}
      >
        <View style={{
          width: 64,
          height: 64,
          borderRadius: 32,
          backgroundColor: 'rgba(10, 22, 18, 0.3)',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 16,
        }}>
          <Icon size={iconSize} color={colors.background.primary} strokeWidth={2.5} />
        </View>
        <Text
          style={{
            fontSize: 24,
            fontWeight: '700',
            color: colors.background.primary,
            marginBottom: 8,
            letterSpacing: 1,
          }}
        >
          {title}
        </Text>
        <Text
          style={{
            fontSize: 15,
            color: colors.background.primary,
            opacity: 0.9,
          }}
        >
          {subtitle}
        </Text>
      </Pressable>
    </View>
  );
}

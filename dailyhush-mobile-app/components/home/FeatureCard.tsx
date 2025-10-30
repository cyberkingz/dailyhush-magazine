/**
 * FeatureCard Component
 * Reusable card for feature grid items
 */

import { Pressable, View } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Text } from '@/components/ui/text';
import { colors } from '@/constants/colors';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  iconColor: string;
  iconBackgroundColor: string;
  onPress?: () => void;
  isInteractive?: boolean;
}

export function FeatureCard({
  title,
  description,
  icon: Icon,
  iconColor,
  iconBackgroundColor,
  onPress,
  isInteractive = true,
}: FeatureCardProps) {
  const handlePress = async () => {
    if (onPress && isInteractive) {
      await Haptics.selectionAsync();
      onPress();
    }
  };

  const cardStyle = {
    flex: 1,
    flexShrink: 0,
    height: '100%' as const,
    backgroundColor: colors.background.card,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1.5,
    borderColor: colors.emerald[600] + '30',
  };

  const content = (
    <>
      <View
        style={{
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: iconBackgroundColor,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 16,
        }}>
        <Icon size={28} color={iconColor} />
      </View>
      <Text
        numberOfLines={1}
        style={{
          fontSize: 16,
          fontWeight: '600',
          color: colors.text.primary,
          marginBottom: 6,
        }}>
        {title}
      </Text>
      <Text
        numberOfLines={2}
        style={{
          fontSize: 13,
          color: colors.text.secondary,
          opacity: 0.7,
          lineHeight: 18,
        }}>
        {description}
      </Text>
    </>
  );

  if (isInteractive) {
    return (
      <Pressable onPress={handlePress} style={cardStyle}>
        {content}
      </Pressable>
    );
  }

  return <View style={cardStyle}>{content}</View>;
}

/**
 * Nœma - ContentCard Component
 * Reusable card for training module educational content
 */

import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { colors } from '@/constants/colors';

interface ContentCardProps {
  icon?: React.ReactNode;
  heading?: string;
  body: string;
  variant?: 'default' | 'highlight';
}

export function ContentCard({ icon, heading, body, variant = 'default' }: ContentCardProps) {
  const isHighlight = variant === 'highlight';
  const textColor = isHighlight ? colors.background.primary : colors.text.primary;
  const bodyColor = isHighlight ? colors.background.primary : colors.text.secondary;

  return (
    <View
      className="rounded-2xl p-6"
      style={{
        borderWidth: 1,
        borderColor: isHighlight ? colors.lime[500] : colors.background.border,
        backgroundColor: isHighlight ? colors.lime[600] : colors.background.secondary,
      }}>
      {/* Icon */}
      {icon && <View className="mb-4">{icon}</View>}

      {/* Heading */}
      {heading && (
        <Text className="mb-3 text-lg font-semibold" style={{ color: textColor }}>
          {heading}
        </Text>
      )}

      {/* Body */}
      <Text className="text-base leading-relaxed" style={{ color: bodyColor }}>
        {body}
      </Text>
    </View>
  );
}

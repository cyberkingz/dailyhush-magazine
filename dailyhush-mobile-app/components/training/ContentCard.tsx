/**
 * DailyHush - ContentCard Component
 * Reusable card for training module educational content
 */

import { View } from 'react-native';
import { Text } from '@/components/ui/text';

interface ContentCardProps {
  icon?: React.ReactNode;
  heading?: string;
  body: string;
  variant?: 'default' | 'highlight';
}

export function ContentCard({
  icon,
  heading,
  body,
  variant = 'default'
}: ContentCardProps) {
  return (
    <View
      className={`rounded-2xl p-6 ${
        variant === 'highlight'
          ? 'bg-[#2D6A4F] border border-[#40916C]/30'
          : 'bg-[#1A4D3C] border border-[#40916C]/20'
      }`}
    >
      {/* Icon */}
      {icon && (
        <View className="mb-4">
          {icon}
        </View>
      )}

      {/* Heading */}
      {heading && (
        <Text className="text-[#E8F4F0] text-lg font-semibold mb-3">
          {heading}
        </Text>
      )}

      {/* Body */}
      <Text className="text-[#95B8A8] text-base leading-relaxed">
        {body}
      </Text>
    </View>
  );
}

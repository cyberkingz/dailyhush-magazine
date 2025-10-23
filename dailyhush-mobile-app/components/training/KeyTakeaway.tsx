/**
 * DailyHush - KeyTakeaway Component
 * Highlighted key learning point for module content
 */

import { View } from 'react-native';
import { Lightbulb } from 'lucide-react-native';
import { Text } from '@/components/ui/text';

interface KeyTakeawayProps {
  title?: string;
  message: string;
}

export function KeyTakeaway({
  title = 'Key Takeaway',
  message
}: KeyTakeawayProps) {
  return (
    <View className="bg-[#2D6A4F] border border-[#52B788] rounded-2xl p-5">
      {/* Header with Icon */}
      <View className="flex-row items-center mb-3">
        <Lightbulb size={20} color="#52B788" strokeWidth={2} />
        <Text className="text-[#E8F4F0] text-base font-semibold ml-2">
          {title}
        </Text>
      </View>

      {/* Divider */}
      <View className="h-px bg-[#52B788]/30 mb-3" />

      {/* Message */}
      <Text className="text-[#E8F4F0] text-base leading-relaxed">
        {message}
      </Text>
    </View>
  );
}

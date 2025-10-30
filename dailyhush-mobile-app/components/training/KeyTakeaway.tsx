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

export function KeyTakeaway({ title = 'Key Takeaway', message }: KeyTakeawayProps) {
  return (
    <View className="rounded-2xl border border-[#52B788] bg-[#2D6A4F] p-5">
      {/* Header with Icon */}
      <View className="mb-3 flex-row items-center">
        <Lightbulb size={20} color="#52B788" strokeWidth={2} />
        <Text className="ml-2 text-base font-semibold text-[#E8F4F0]">{title}</Text>
      </View>

      {/* Divider */}
      <View className="mb-3 h-px bg-[#52B788]/30" />

      {/* Message */}
      <Text className="text-base leading-relaxed text-[#E8F4F0]">{message}</Text>
    </View>
  );
}

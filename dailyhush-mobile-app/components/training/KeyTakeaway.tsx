/**
 * DailyHush - KeyTakeaway Component
 * Highlighted key learning point for module content
 */

import { View } from 'react-native';
import { Lightbulb } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { colors } from '@/constants/colors';

interface KeyTakeawayProps {
  title?: string;
  message: string;
}

export function KeyTakeaway({ title = 'Key Takeaway', message }: KeyTakeawayProps) {
  return (
    <View
      className="rounded-2xl p-5"
      style={{
        borderWidth: 1,
        borderColor: colors.lime[500],
        backgroundColor: colors.lime[600],
      }}>
      {/* Header with Icon */}
      <View className="mb-3 flex-row items-center">
        <Lightbulb size={20} color={colors.background.primary} strokeWidth={2} />
        <Text className="ml-2 text-base font-semibold" style={{ color: colors.background.primary }}>
          {title}
        </Text>
      </View>

      {/* Divider */}
      <View className="mb-3 h-px" style={{ backgroundColor: colors.background.primary + '30' }} />

      {/* Message */}
      <Text className="text-base leading-relaxed" style={{ color: colors.background.primary }}>
        {message}
      </Text>
    </View>
  );
}

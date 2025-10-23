/**
 * DailyHush - ProgressIndicator Component
 * Visual dot-based progress indicator for module screens
 */

import { View } from 'react-native';
import { Text } from '@/components/ui/text';

interface ProgressIndicatorProps {
  current: number;
  total: number;
  showText?: boolean;
}

export function ProgressIndicator({
  current,
  total,
  showText = true
}: ProgressIndicatorProps) {
  return (
    <View className="flex-row items-center justify-center gap-2">
      {/* Dots */}
      <View className="flex-row gap-2">
        {Array.from({ length: total }).map((_, index) => (
          <View
            key={index}
            className={`w-2 h-2 rounded-full ${
              index < current ? 'bg-[#40916C]' : 'bg-[#1A2E26]'
            }`}
          />
        ))}
      </View>

      {/* Text */}
      {showText && (
        <Text className="text-[#95B8A8] text-xs ml-2">
          {current}/{total}
        </Text>
      )}
    </View>
  );
}

/**
 * DailyHush - ModuleLoading Component
 * Loading state for modules while loading saved progress
 */

import { View, ActivityIndicator } from 'react-native';
import { Text } from '@/components/ui/text';

interface ModuleLoadingProps {
  moduleTitle: string;
}

export function ModuleLoading({ moduleTitle }: ModuleLoadingProps) {
  return (
    <View className="flex-1 bg-[#0A1612] items-center justify-center px-6">
      <ActivityIndicator size="large" color="#40916C" />
      <Text className="text-[#95B8A8] text-base mt-4 text-center">
        Loading {moduleTitle}...
      </Text>
      <Text className="text-[#95B8A8]/60 text-sm mt-2 text-center">
        Restoring your progress
      </Text>
    </View>
  );
}

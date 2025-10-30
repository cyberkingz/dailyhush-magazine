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
    <View className="flex-1 items-center justify-center bg-[#0A1612] px-6">
      <ActivityIndicator size="large" color="#40916C" />
      <Text className="mt-4 text-center text-base text-[#95B8A8]">Loading {moduleTitle}...</Text>
      <Text className="mt-2 text-center text-sm text-[#95B8A8]/60">Restoring your progress</Text>
    </View>
  );
}

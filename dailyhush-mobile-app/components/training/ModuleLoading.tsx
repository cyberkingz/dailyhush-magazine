/**
 * DailyHush - ModuleLoading Component
 * Loading state for modules while loading saved progress
 */

import { View, ActivityIndicator } from 'react-native';
import { Text } from '@/components/ui/text';
import { colors } from '@/constants/colors';

interface ModuleLoadingProps {
  moduleTitle: string;
}

export function ModuleLoading({ moduleTitle }: ModuleLoadingProps) {
  return (
    <View
      className="flex-1 items-center justify-center px-6"
      style={{ backgroundColor: colors.background.primary }}>
      <ActivityIndicator size="large" color={colors.lime[500]} />
      <Text className="mt-4 text-center text-base" style={{ color: colors.text.secondary }}>
        Loading {moduleTitle}...
      </Text>
      <Text className="mt-2 text-center text-sm" style={{ color: colors.text.muted }}>
        Restoring your progress
      </Text>
    </View>
  );
}

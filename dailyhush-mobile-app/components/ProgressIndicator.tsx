/**
 * Nœma - Progress Indicator
 * Shows step progress through onboarding
 */

import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { colors } from '@/constants/colors';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepLabel?: string;
}

export function ProgressIndicator({ currentStep, totalSteps, stepLabel }: ProgressIndicatorProps) {
  return (
    <View className="mb-6 items-center">
      {/* Progress Dots */}
      <View className="mb-2 flex-row items-center gap-2">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <View
            key={index}
            className="h-2 rounded-full"
            style={{
              width: index === currentStep - 1 ? 24 : 8,
              backgroundColor:
                index < currentStep ? colors.button.primary : colors.background.border,
            }}
          />
        ))}
      </View>

      {/* Step Text */}
      <Text className="text-xs" style={{ color: colors.text.secondary }}>
        {stepLabel || `Step ${currentStep} of ${totalSteps}`}
      </Text>
    </View>
  );
}

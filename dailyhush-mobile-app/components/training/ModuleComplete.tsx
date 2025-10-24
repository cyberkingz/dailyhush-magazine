/**
 * DailyHush - ModuleComplete Component
 * Success state component for module completion
 */

import { View, Pressable } from 'react-native';
import { useEffect } from 'react';
import * as Haptics from 'expo-haptics';
import { SuccessRipple } from '@/components/SuccessRipple';
import { Text } from '@/components/ui/text';
import { FireModule } from '@/types';
import { useUser, useStore } from '@/store/useStore';
import { completeModule, updateUserFireProgress } from '@/services/training';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';

interface ModuleCompleteProps {
  moduleTitle: string;
  module: FireModule;
  keyLearnings: string[];
  nextModuleTitle?: string;
  onContinue: () => void;
  showCertification?: boolean;
}

export function ModuleComplete({
  moduleTitle,
  module,
  keyLearnings,
  nextModuleTitle,
  onContinue,
  showCertification = false
}: ModuleCompleteProps) {
  const user = useUser();
  const { completeFireModule } = useStore();

  // Mark module as completed when component mounts
  useEffect(() => {
    const markComplete = async () => {
      if (!user?.user_id) return;

      // Update local state immediately (works for all users)
      completeFireModule(module);

      // Try to save to database (works for authenticated users)
      await completeModule(user.user_id, module);
      await updateUserFireProgress(user.user_id, module, true);
    };

    markComplete();
  }, [user?.user_id, module, completeFireModule]);

  const handleContinue = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onContinue();
  };

  return (
    <View className="flex-1 justify-center items-center px-6">
      {/* Success Animation - Reduced from 100px to 70px */}
      <View className="mb-5">
        <SuccessRipple size={70} />
      </View>

      {/* Title */}
      <Text className="text-2xl font-bold text-center mb-1" style={{ color: colors.text.primary }}>
        {moduleTitle} Complete!
      </Text>

      {/* Certification Badge - Reduced size and spacing */}
      {showCertification && (
        <View className="mb-4">
          <Text className="text-5xl text-center" style={{ lineHeight: 60, paddingTop: 4 }}>🎓</Text>
        </View>
      )}

      {/* Subtitle */}
      <Text className="text-base text-center mb-6" style={{ color: colors.text.secondary }}>
        {showCertification
          ? "You've completed all F.I.R.E. modules!"
          : "Great work. Here's what you learned:"}
      </Text>

      {/* Key Learnings */}
      <View
        className="w-full rounded-2xl p-5 mb-6 border"
        style={{
          backgroundColor: colors.background.secondary,
          borderColor: colors.emerald[500] + '33', // 20% opacity
        }}
      >
        {keyLearnings.map((learning, index) => (
          <View key={index} className="flex-row items-start mb-3 last:mb-0">
            <Text className="text-base mr-2" style={{ color: colors.emerald[400], lineHeight: 24, paddingTop: 2 }}>✓</Text>
            <Text className="text-base flex-1 leading-relaxed" style={{ color: colors.text.primary }}>
              {learning}
            </Text>
          </View>
        ))}
      </View>

      {/* Progress Stats */}
      {nextModuleTitle && (
        <Text className="text-sm text-center mb-6" style={{ color: colors.text.secondary }}>
          92% of people who complete this module finish all 4 modules.
          You're on track.
        </Text>
      )}

      {/* CTA Button - Standard height 56px */}
      <Pressable
        onPress={handleContinue}
        className="w-full rounded-2xl items-center justify-center active:opacity-90"
        style={{
          backgroundColor: colors.button.primary,
          height: spacing.button.height,
        }}
      >
        <Text className="text-lg font-bold" style={{ color: colors.white }}>
          {nextModuleTitle ? `Continue to ${nextModuleTitle}` : 'Back to Training'}
        </Text>
      </Pressable>
    </View>
  );
}

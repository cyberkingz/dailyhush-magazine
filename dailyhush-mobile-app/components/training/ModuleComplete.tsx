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
import { useUser } from '@/store/useStore';
import { completeModule, updateUserFireProgress } from '@/services/training';

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

  // Mark module as completed when component mounts
  useEffect(() => {
    const markComplete = async () => {
      if (!user?.user_id) return;

      // Mark module as completed in fire_training_progress table
      await completeModule(user.user_id, module);

      // Update user's fire_progress in user_profiles table
      await updateUserFireProgress(user.user_id, module, true);
    };

    markComplete();
  }, [user?.user_id, module]);

  const handleContinue = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onContinue();
  };

  return (
    <View className="flex-1 justify-center items-center px-6">
      {/* Success Animation */}
      <View className="mb-8">
        <SuccessRipple size={100} />
      </View>

      {/* Title */}
      <Text className="text-[#E8F4F0] text-2xl font-bold text-center mb-2">
        {moduleTitle} Complete!
      </Text>

      {/* Certification Badge */}
      {showCertification && (
        <View className="mb-6">
          <Text className="text-6xl text-center">🎓</Text>
        </View>
      )}

      {/* Subtitle */}
      <Text className="text-[#95B8A8] text-base text-center mb-8">
        {showCertification
          ? "You've completed all F.I.R.E. modules!"
          : "Great work. Here's what you learned:"}
      </Text>

      {/* Key Learnings */}
      <View className="w-full bg-[#1A4D3C] rounded-2xl p-5 mb-8 border border-[#40916C]/20">
        {keyLearnings.map((learning, index) => (
          <View key={index} className="flex-row items-start mb-3 last:mb-0">
            <Text className="text-[#52B788] text-base mr-2">✓</Text>
            <Text className="text-[#E8F4F0] text-base flex-1 leading-relaxed">
              {learning}
            </Text>
          </View>
        ))}
      </View>

      {/* Progress Stats */}
      {nextModuleTitle && (
        <Text className="text-[#95B8A8] text-sm text-center mb-8">
          92% of people who complete this module finish all 4 modules.
          You're on track.
        </Text>
      )}

      {/* CTA Button */}
      <Pressable
        onPress={handleContinue}
        className="w-full bg-[#40916C] h-16 rounded-2xl items-center justify-center active:opacity-90"
      >
        <Text className="text-white text-lg font-bold">
          {nextModuleTitle ? `Continue to ${nextModuleTitle}` : 'Back to Training'}
        </Text>
      </Pressable>
    </View>
  );
}

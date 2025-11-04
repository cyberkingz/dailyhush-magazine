/**
 * DailyHush - ModuleComplete Component
 * Success state component for module completion
 */

import { View, Pressable, ScrollView } from 'react-native';
import { useEffect } from 'react';
import * as Haptics from 'expo-haptics';
import { SuccessRipple } from '@/components/SuccessRipple';
import { Text } from '@/components/ui/text';
import { FireModule } from '@/types';
import { useUser, useStore } from '@/store/useStore';
import { completeModule, updateUserFireProgress } from '@/services/training';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { useAnalytics } from '@/utils/analytics';

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
  showCertification = false,
}: ModuleCompleteProps) {
  const user = useUser();
  const { completeFireModule } = useStore();
  const analytics = useAnalytics();

  // Mark module as completed when component mounts
  useEffect(() => {
    const markComplete = async () => {
      if (!user?.user_id) return;

      // Update local state immediately (works for all users)
      completeFireModule(module);

      // Try to save to database (works for authenticated users)
      await completeModule(user.user_id, module);
      await updateUserFireProgress(user.user_id, module, true);

      // Track training completion
      analytics.track('TRAINING_COMPLETED', {
        feature_name: module,
      });
    };

    markComplete();
  }, [user?.user_id, module, completeFireModule, analytics]);

  const handleContinue = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onContinue();
  };

  return (
    <View className="flex-1">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 justify-center px-6 py-8">
          {/* Success Animation */}
          <View className="mb-5 items-center">
            <SuccessRipple size={70} />
          </View>

          {/* Title */}
          <Text
            className="mb-3 text-center text-2xl font-bold"
            style={{ color: colors.text.primary }}>
            {moduleTitle} Complete!
          </Text>

          {/* Certification Badge */}
          {showCertification && (
            <View className="mb-4">
              <Text className="text-center text-5xl" style={{ lineHeight: 60 }}>
                🎓
              </Text>
            </View>
          )}

          {/* Subtitle */}
          <Text className="mb-5 text-center text-base" style={{ color: colors.text.secondary }}>
            {showCertification
              ? "You've completed all F.I.R.E. modules!"
              : "Great work. Here's what you learned:"}
          </Text>

          {/* Key Learnings */}
          <View
            className="mb-5 w-full rounded-2xl border-2 p-5"
            style={{
              backgroundColor: colors.background.secondary,
              borderColor: colors.lime[500] + '33', // 20% opacity
            }}>
            {keyLearnings.map((learning, index) => (
              <View key={index} className="mb-3 flex-row items-start last:mb-0">
                <Text
                  className="mr-3 text-base"
                  style={{ color: colors.lime[500], lineHeight: 24 }}>
                  ✓
                </Text>
                <Text
                  className="flex-1 text-sm leading-relaxed"
                  style={{ color: colors.text.primary }}>
                  {learning}
                </Text>
              </View>
            ))}
          </View>

          {/* Progress Stats */}
          {nextModuleTitle && (
            <Text
              className="mb-6 text-center text-sm leading-relaxed"
              style={{ color: colors.text.secondary }}>
              92% of people who complete this module finish all 4 modules. You're on track.
            </Text>
          )}

          {/* CTA Button */}
          <Pressable
            onPress={handleContinue}
            className="w-full items-center justify-center rounded-2xl active:opacity-90"
            style={{
              backgroundColor: colors.button.primary,
              height: spacing.button.height,
            }}>
            <Text className="text-base font-bold" style={{ color: colors.button.primaryText }}>
              {nextModuleTitle ? `Continue to ${nextModuleTitle}` : 'Back to Training'}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

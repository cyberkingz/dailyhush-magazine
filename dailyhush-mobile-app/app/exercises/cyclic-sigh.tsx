/**
 * DailyHush - Cyclic Physiological Sigh Exercise
 *
 * Stanford-tested rapid calm-down technique
 * Two quick inhales + long exhale = fastest anxiety reduction
 *
 * Flow:
 * 1. Pre-rating (1-10 anxiety scale)
 * 2. Instructions (Ogilvy copy + Cialdini hooks)
 * 3. Breathing exercise (BreathingAnimation)
 * 4. Post-rating (with comparison)
 * 5. Trigger log (optional)
 * 6. Completion (celebration + stats)
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ExerciseContainer } from '@/components/exercises/ExerciseContainer';
import { PrePostRatingCard } from '@/components/exercises/PrePostRatingCard';
import { BreathingAnimation } from '@/components/exercises/BreathingAnimation';
import { CompletionScreen } from '@/components/exercises/CompletionScreen';
import { TriggerLogCard } from '@/components/exercises/TriggerLogCard';
import { useExerciseSession } from '@/hooks/useExerciseSession';
import { CYCLIC_SIGH_CONFIG } from '@/constants/exerciseConfigs';
import { ChevronRight, BookOpen, Sparkles } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import type { TriggerOption } from '@/types/exercises';

// Mock trigger data (in production, fetch from Supabase)
const MOCK_TRIGGERS: TriggerOption[] = [
  {
    trigger_id: '1',
    trigger_name: 'Work stress',
    trigger_category: 'work',
    display_order: 1,
    loop_type: 'all',
  },
  {
    trigger_id: '2',
    trigger_name: 'Social situation',
    trigger_category: 'social',
    display_order: 2,
    loop_type: 'all',
  },
  {
    trigger_id: '3',
    trigger_name: 'Health worry',
    trigger_category: 'health',
    display_order: 3,
    loop_type: 'all',
  },
  {
    trigger_id: '4',
    trigger_name: 'Relationship',
    trigger_category: 'relationship',
    display_order: 4,
    loop_type: 'all',
  },
  {
    trigger_id: '5',
    trigger_name: 'Financial concern',
    trigger_category: 'financial',
    display_order: 5,
    loop_type: 'all',
  },
];

export default function CyclicSighExercise() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Extract module context from params
  const moduleContext = (params.moduleId as string) || 'standalone';
  const moduleScreen = params.moduleScreen as string;

  // State for trigger logging
  const [selectedTrigger, setSelectedTrigger] = useState<string | undefined>();
  const [customTriggerText, setCustomTriggerText] = useState('');

  // Initialize exercise session
  const {
    session,
    isLoading,
    error,
    goToNextStage,
    setPreRating,
    setPostRating,
    logTrigger,
    updateExerciseData,
    complete,
    abandon,
    pause,
    resume,
  } = useExerciseSession({
    config: CYCLIC_SIGH_CONFIG,
    moduleContext: moduleContext as any,
    moduleScreen,
    onComplete: () => {
      router.back();
    },
    onAbandon: () => {
      router.back();
    },
  });

  /**
   * Handle trigger log submission
   */
  const handleTriggerLog = async () => {
    if (selectedTrigger) {
      await logTrigger({
        category: selectedTrigger,
        customText: selectedTrigger === 'custom' ? customTriggerText : undefined,
        timestamp: new Date().toISOString(),
      });
    }
    await goToNextStage();
  };

  /**
   * Skip trigger log
   */
  const handleSkipTrigger = async () => {
    await goToNextStage();
  };

  /**
   * Handle breathing cycle completion
   */
  const handleCycleComplete = () => {
    if (!session) return;

    const exerciseData = session.exerciseData;
    if (exerciseData.type !== 'breathing') return;

    const newCycleNumber = exerciseData.completedCycles + 1;

    // Update cycle count
    updateExerciseData({
      ...exerciseData,
      completedCycles: newCycleNumber,
      cycleHistory: [
        ...exerciseData.cycleHistory,
        {
          cycleNumber: newCycleNumber,
          startedAt: new Date().toISOString(),
          completedAt: new Date().toISOString(),
          durationSeconds: Math.floor(session.currentStageDuration),
        },
      ],
    });

    // If target reached, advance to post-rating
    if (newCycleNumber >= exerciseData.targetCycles) {
      goToNextStage();
    }
  };

  /**
   * Handle completion screen actions
   */
  const handleCompletionContinue = async () => {
    await complete();
  };

  const handleReturnHome = async () => {
    await complete();
  };

  // Loading state
  if (isLoading) {
    return (
      <View className="bg-forest-900 flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#4FD1C5" />
        <Text className="font-inter-medium mt-4 text-base text-sage-300">Loading exercise...</Text>
      </View>
    );
  }

  // Error state
  if (error || !session) {
    return (
      <View className="bg-forest-900 flex-1 items-center justify-center px-6">
        <Text className="font-poppins-semibold mb-2 text-xl text-red-400">Error</Text>
        <Text className="font-inter-regular mb-6 text-center text-base text-sage-300">
          {error || 'Failed to start exercise'}
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-mindful-teal rounded-xl px-6 py-3">
          <Text className="text-forest-900 font-poppins-semibold text-base">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Render appropriate stage
  const renderStage = () => {
    switch (session.currentStage) {
      case 'pre_rating':
        return (
          <PrePostRatingCard
            type="pre"
            currentRating={session.preRating}
            onRatingSelect={setPreRating}
            onContinue={() => goToNextStage()}
          />
        );

      case 'instructions':
        return <InstructionsStage onContinue={() => goToNextStage()} />;

      case 'exercise':
        const breathingData = session.exerciseData;
        if (breathingData.type !== 'breathing') return null;

        return (
          <BreathingAnimation
            protocol={breathingData.protocol}
            phase={breathingData.currentPhase}
            cycleNumber={breathingData.completedCycles + 1}
            totalCycles={breathingData.targetCycles}
            onCycleComplete={handleCycleComplete}
            isPaused={session.isPaused}
            breathDurations={breathingData.breathDurations}
          />
        );

      case 'post_rating':
        return (
          <PrePostRatingCard
            type="post"
            currentRating={session.postRating}
            onRatingSelect={setPostRating}
            onContinue={() => goToNextStage()}
            showComparison={true}
            comparisonRating={session.preRating || undefined}
          />
        );

      case 'trigger_log':
        return (
          <TriggerLogCard
            triggers={MOCK_TRIGGERS}
            selectedTrigger={selectedTrigger}
            customText={customTriggerText}
            onSelectTrigger={setSelectedTrigger}
            onCustomTextChange={setCustomTriggerText}
            onContinue={handleTriggerLog}
            onSkip={handleSkipTrigger}
          />
        );

      case 'complete':
        const reduction =
          session.preRating && session.postRating ? session.preRating - session.postRating : 0;
        const reductionPercentage =
          session.preRating && session.preRating > 0
            ? Math.round((reduction / session.preRating) * 100)
            : 0;

        return (
          <CompletionScreen
            preRating={session.preRating || 0}
            postRating={session.postRating || 0}
            reduction={reduction}
            reductionPercentage={reductionPercentage}
            duration={session.totalDuration}
            exerciseTitle={CYCLIC_SIGH_CONFIG.title}
            completionMessage={CYCLIC_SIGH_CONFIG.copy.completionMessage}
            onContinue={handleCompletionContinue}
            onReturnHome={handleReturnHome}
            showSocialProof={true}
            socialProofCount={10247}
          />
        );

      default:
        return null;
    }
  };

  return (
    <ExerciseContainer
      config={CYCLIC_SIGH_CONFIG}
      session={session}
      onPause={pause}
      onResume={resume}
      onAbandon={abandon}>
      {renderStage()}
    </ExerciseContainer>
  );
}

/**
 * Instructions Stage Component
 * Includes Ogilvy copy + Cialdini persuasion hooks
 */
function InstructionsStage({ onContinue }: { onContinue: () => void }) {
  const handleContinue = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onContinue();
  };

  return (
    <ScrollView className="flex-1 px-6 py-8" showsVerticalScrollIndicator={false}>
      <View className="space-y-6">
        {/* Headline (Ogilvy) */}
        <View className="space-y-2">
          <Text className="text-sage-50 font-poppins-bold text-3xl leading-tight">
            {CYCLIC_SIGH_CONFIG.copy.headline}
          </Text>
          <Text className="font-inter-regular text-lg leading-relaxed text-sage-300">
            {CYCLIC_SIGH_CONFIG.copy.subheadline}
          </Text>
        </View>

        {/* Cialdini Hooks */}
        <View className="flex-row gap-3">
          {/* Authority */}
          <View className="bg-mindful-teal/10 border-mindful-teal/30 flex-1 rounded-xl border p-3">
            <View className="mb-1 flex-row items-center gap-2">
              <BookOpen size={16} color="#4FD1C5" />
              <Text className="text-mindful-teal font-inter-semibold text-xs uppercase">
                Research
              </Text>
            </View>
            <Text className="font-inter-medium text-sm text-sage-300">
              {CYCLIC_SIGH_CONFIG.persuasion?.authorityBadge}
            </Text>
          </View>

          {/* Pre-commitment */}
          <View className="flex-1 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3">
            <View className="mb-1 flex-row items-center gap-2">
              <Sparkles size={16} color="#F59E0B" />
              <Text className="font-inter-semibold text-xs uppercase text-amber-400">Quick</Text>
            </View>
            <Text className="font-inter-medium text-sm text-sage-300">
              {CYCLIC_SIGH_CONFIG.persuasion?.preCommitment}
            </Text>
          </View>
        </View>

        {/* Instructions */}
        <View className="space-y-3">
          <Text className="text-sage-50 font-poppins-semibold text-xl">How it works:</Text>
          {CYCLIC_SIGH_CONFIG.instructions.map((instruction, index) => (
            <View key={index} className="flex-row gap-3">
              <View className="bg-mindful-teal/20 h-8 w-8 items-center justify-center rounded-full">
                <Text className="text-mindful-teal font-poppins-bold text-sm">{index + 1}</Text>
              </View>
              <Text className="font-inter-regular flex-1 pt-1 text-base leading-relaxed text-sage-300">
                {instruction}
              </Text>
            </View>
          ))}
        </View>

        {/* Tips */}
        {CYCLIC_SIGH_CONFIG.tips && (
          <View className="bg-forest-800/50 border-forest-700/30 rounded-xl border p-4">
            <Text className="text-sage-50 font-poppins-semibold mb-2 text-base">💡 Pro Tips:</Text>
            {CYCLIC_SIGH_CONFIG.tips.map((tip, index) => (
              <Text
                key={index}
                className="font-inter-regular mb-1 text-sm leading-relaxed text-sage-300">
                • {tip}
              </Text>
            ))}
          </View>
        )}

        {/* Social Proof (Cialdini) */}
        <View className="bg-mindful-teal/5 border-mindful-teal/20 rounded-xl border p-4">
          <Text className="font-inter-medium text-center text-sm text-sage-300">
            {CYCLIC_SIGH_CONFIG.persuasion?.socialProof}
          </Text>
        </View>

        {/* CTA */}
        <TouchableOpacity
          onPress={handleContinue}
          className="bg-mindful-teal mt-2 flex-row items-center justify-center gap-2 rounded-xl py-4 shadow-lg"
          accessibilityLabel={CYCLIC_SIGH_CONFIG.copy.ctaStart}
          accessibilityRole="button">
          <Text className="text-forest-900 font-poppins-semibold text-lg">
            {CYCLIC_SIGH_CONFIG.copy.ctaStart}
          </Text>
          <ChevronRight size={20} color="#0A1612" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

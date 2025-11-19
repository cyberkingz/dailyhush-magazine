/**
 * DailyHush - 4-7-8 Breathing Exercise
 *
 * Dr. Andrew Weil's relaxation breathing technique
 * Inhale 4 seconds → Hold 7 seconds → Exhale 8 seconds
 *
 * Includes:
 * - Cialdini persuasion hooks (Authority, Social Proof, Pre-commitment)
 * - Ogilvy copywriting (research-backed, specific claims)
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ExerciseContainer } from '@/components/exercises/ExerciseContainer';
import { PrePostRatingCard } from '@/components/exercises/PrePostRatingCard';
import { BreathingAnimation } from '@/components/exercises/BreathingAnimation';
import { CompletionScreen } from '@/components/exercises/CompletionScreen';
import { TriggerLogCard } from '@/components/exercises/TriggerLogCard';
import { InstructionsCard } from '@/components/exercises/InstructionsCard';
import { useExerciseSession } from '@/hooks/useExerciseSession';
import { BREATHING_4_7_8_CONFIG } from '@/constants/exerciseConfigs';
import type { TriggerOption } from '@/types/exercises';

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

export default function Breathing478Exercise() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const moduleContext = (params.moduleId as string) || 'standalone';
  const moduleScreen = params.moduleScreen as string;

  const [selectedTrigger, setSelectedTrigger] = useState<string | undefined>();
  const [customTriggerText, setCustomTriggerText] = useState('');

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
    config: BREATHING_4_7_8_CONFIG,
    moduleContext: moduleContext as any,
    moduleScreen,
    onComplete: () => router.back(),
    onAbandon: () => router.back(),
  });

  const handleCycleComplete = () => {
    if (!session) return;
    const exerciseData = session.exerciseData;
    if (exerciseData.type !== 'breathing') return;

    const newCycleNumber = exerciseData.completedCycles + 1;
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

    if (newCycleNumber >= exerciseData.targetCycles) {
      goToNextStage();
    }
  };

  if (isLoading) {
    return (
      <View className="bg-forest-900 flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#4FD1C5" />
        <Text className="font-inter-medium mt-4 text-base text-sage-300">Loading exercise...</Text>
      </View>
    );
  }

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
        return (
          <InstructionsCard config={BREATHING_4_7_8_CONFIG} onContinue={() => goToNextStage()} />
        );

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
            onContinue={async () => {
              if (selectedTrigger) {
                await logTrigger({
                  category: selectedTrigger,
                  customText: selectedTrigger === 'custom' ? customTriggerText : undefined,
                  timestamp: new Date().toISOString(),
                });
              }
              await goToNextStage();
            }}
            onSkip={() => goToNextStage()}
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
            exerciseTitle={BREATHING_4_7_8_CONFIG.title}
            completionMessage={BREATHING_4_7_8_CONFIG.copy.completionMessage}
            onContinue={async () => await complete()}
            onReturnHome={async () => await complete()}
            showSocialProof={true}
            socialProofCount={15892}
          />
        );

      default:
        return null;
    }
  };

  return (
    <ExerciseContainer
      config={BREATHING_4_7_8_CONFIG}
      session={session}
      onPause={pause}
      onResume={resume}
      onAbandon={abandon}>
      {renderStage()}
    </ExerciseContainer>
  );
}

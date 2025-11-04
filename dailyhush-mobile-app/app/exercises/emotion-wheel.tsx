/**
 * DailyHush - Emotion Wheel Exercise
 *
 * Name your emotions to tame them (Dr. Dan Siegel: "Name it to tame it")
 * Identify specific emotions to reduce emotional intensity
 *
 * Includes:
 * - Cialdini hooks (Authority: Dr. Dan Siegel research)
 * - Ogilvy copy (specific, research-backed claims)
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ExerciseContainer } from '@/components/exercises/ExerciseContainer';
import { PrePostRatingCard } from '@/components/exercises/PrePostRatingCard';
import { CompletionScreen } from '@/components/exercises/CompletionScreen';
import { TriggerLogCard } from '@/components/exercises/TriggerLogCard';
import { useExerciseSession } from '@/hooks/useExerciseSession';
import { EMOTION_WHEEL_CONFIG } from '@/constants/exerciseConfigs';
import { ChevronRight, BookOpen, Sparkles, Users, Heart } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import type { TriggerOption, EmotionWheelData } from '@/types/exercises';

const MOCK_TRIGGERS: TriggerOption[] = [
  { trigger_id: '1', trigger_name: 'Work stress', trigger_category: 'work', display_order: 1, loop_type: 'all' },
  { trigger_id: '2', trigger_name: 'Social situation', trigger_category: 'social', display_order: 2, loop_type: 'all' },
  { trigger_id: '3', trigger_name: 'Health worry', trigger_category: 'health', display_order: 3, loop_type: 'all' },
  { trigger_id: '4', trigger_name: 'Relationship', trigger_category: 'relationship', display_order: 4, loop_type: 'all' },
  { trigger_id: '5', trigger_name: 'Financial concern', trigger_category: 'financial', display_order: 5, loop_type: 'all' },
];

// Emotion categories with primary emotions
const EMOTION_CATEGORIES = {
  Anxious: ['Worried', 'Nervous', 'Overwhelmed', 'Panicked', 'Stressed', 'Tense'],
  Sad: ['Depressed', 'Disappointed', 'Lonely', 'Hurt', 'Discouraged', 'Hopeless'],
  Angry: ['Frustrated', 'Irritated', 'Resentful', 'Bitter', 'Furious', 'Annoyed'],
  Fearful: ['Scared', 'Terrified', 'Anxious', 'Insecure', 'Vulnerable', 'Threatened'],
  Disgusted: ['Revulsed', 'Repelled', 'Horrified', 'Disapproving', 'Judgmental', 'Loathing'],
  Happy: ['Joyful', 'Content', 'Grateful', 'Peaceful', 'Excited', 'Optimistic'],
  Surprised: ['Amazed', 'Confused', 'Startled', 'Shocked', 'Dismayed', 'Stunned'],
};

export default function EmotionWheelExercise() {
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
    config: EMOTION_WHEEL_CONFIG,
    moduleContext: moduleContext as any,
    moduleScreen,
    onComplete: () => router.back(),
    onAbandon: () => router.back(),
  });

  if (isLoading) {
    return (
      <View className="flex-1 bg-forest-900 items-center justify-center">
        <ActivityIndicator size="large" color="#4FD1C5" />
        <Text className="text-sage-300 font-inter-medium text-base mt-4">Loading exercise...</Text>
      </View>
    );
  }

  if (error || !session) {
    return (
      <View className="flex-1 bg-forest-900 items-center justify-center px-6">
        <Text className="text-red-400 font-poppins-semibold text-xl mb-2">Error</Text>
        <Text className="text-sage-300 font-inter-regular text-base text-center mb-6">
          {error || 'Failed to start exercise'}
        </Text>
        <TouchableOpacity onPress={() => router.back()} className="bg-mindful-teal rounded-xl px-6 py-3">
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
        return <InstructionsStage onContinue={() => goToNextStage()} />;

      case 'exercise':
        return (
          <EmotionSelectionStage
            session={session}
            updateExerciseData={updateExerciseData}
            goToNextStage={goToNextStage}
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
        const reduction = session.preRating && session.postRating ? session.preRating - session.postRating : 0;
        const reductionPercentage = session.preRating && session.preRating > 0
          ? Math.round((reduction / session.preRating) * 100)
          : 0;

        return (
          <CompletionScreen
            preRating={session.preRating || 0}
            postRating={session.postRating || 0}
            reduction={reduction}
            reductionPercentage={reductionPercentage}
            duration={session.totalDuration}
            exerciseTitle={EMOTION_WHEEL_CONFIG.title}
            completionMessage={EMOTION_WHEEL_CONFIG.copy.completionMessage}
            onContinue={async () => await complete()}
            onReturnHome={async () => await complete()}
            showSocialProof={true}
            socialProofCount={12456}
          />
        );

      default:
        return null;
    }
  };

  return (
    <ExerciseContainer
      config={EMOTION_WHEEL_CONFIG}
      session={session}
      onPause={pause}
      onResume={resume}
      onAbandon={abandon}
    >
      {renderStage()}
    </ExerciseContainer>
  );
}

/**
 * Instructions Stage with Cialdini + Ogilvy
 */
function InstructionsStage({ onContinue }: { onContinue: () => void }) {
  return (
    <ScrollView className="flex-1 px-6 py-8" showsVerticalScrollIndicator={false}>
      <View className="space-y-6">
        {/* Ogilvy Headline */}
        <View className="space-y-2">
          <Text className="text-sage-50 font-poppins-bold text-3xl leading-tight">
            {EMOTION_WHEEL_CONFIG.copy.headline}
          </Text>
          <Text className="text-sage-300 font-inter-regular text-lg leading-relaxed">
            {EMOTION_WHEEL_CONFIG.copy.subheadline}
          </Text>
        </View>

        {/* Cialdini Hooks */}
        <View className="space-y-3">
          <View className="bg-mindful-teal/10 border border-mindful-teal/30 rounded-xl p-4">
            <View className="flex-row items-center gap-2 mb-2">
              <View className="w-8 h-8 bg-mindful-teal/20 rounded-full items-center justify-center">
                <BookOpen size={16} color="#4FD1C5" />
              </View>
              <Text className="text-mindful-teal font-inter-semibold text-sm uppercase tracking-wide">
                Research-Backed
              </Text>
            </View>
            <Text className="text-sage-300 font-inter-medium text-base">
              {EMOTION_WHEEL_CONFIG.persuasion?.authorityBadge}
            </Text>
          </View>

          <View className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
            <View className="flex-row items-center gap-2 mb-2">
              <View className="w-8 h-8 bg-amber-500/20 rounded-full items-center justify-center">
                <Sparkles size={16} color="#F59E0B" />
              </View>
              <Text className="text-amber-400 font-inter-semibold text-sm uppercase tracking-wide">
                Quick Process
              </Text>
            </View>
            <Text className="text-sage-300 font-inter-medium text-base">
              {EMOTION_WHEEL_CONFIG.persuasion?.preCommitment}
            </Text>
          </View>

          <View className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
            <View className="flex-row items-center gap-2 mb-2">
              <View className="w-8 h-8 bg-purple-500/20 rounded-full items-center justify-center">
                <Users size={16} color="#A855F7" />
              </View>
              <Text className="text-purple-400 font-inter-semibold text-sm uppercase tracking-wide">
                Proven Technique
              </Text>
            </View>
            <Text className="text-sage-300 font-inter-medium text-base">
              {EMOTION_WHEEL_CONFIG.persuasion?.socialProof}
            </Text>
          </View>
        </View>

        {/* Instructions */}
        <View className="space-y-3">
          <Text className="text-sage-50 font-poppins-semibold text-xl">How it works:</Text>
          {EMOTION_WHEEL_CONFIG.instructions.map((instruction, index) => (
            <View key={index} className="flex-row gap-3">
              <View className="w-8 h-8 bg-mindful-teal/20 rounded-full items-center justify-center">
                <Text className="text-mindful-teal font-poppins-bold text-sm">{index + 1}</Text>
              </View>
              <Text className="flex-1 text-sage-300 font-inter-regular text-base leading-relaxed pt-1">
                {instruction}
              </Text>
            </View>
          ))}
        </View>

        {/* Ogilvy CTA */}
        <TouchableOpacity
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onContinue(); }}
          className="bg-mindful-teal rounded-xl py-4 flex-row items-center justify-center gap-2 shadow-lg mt-2"
        >
          <Text className="text-forest-900 font-poppins-semibold text-lg">
            {EMOTION_WHEEL_CONFIG.copy.ctaStart}
          </Text>
          <ChevronRight size={20} color="#0A1612" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

/**
 * Emotion Selection Stage
 */
function EmotionSelectionStage({
  session,
  updateExerciseData,
  goToNextStage,
}: {
  session: any;
  updateExerciseData: (data: any) => void;
  goToNextStage: () => void;
}) {
  const emotionData = session.exerciseData as EmotionWheelData;
  const [selectedPrimary, setSelectedPrimary] = useState<string | null>(null);
  const [selectedSecondary, setSelectedSecondary] = useState<string | null>(null);

  const handleAddEmotion = async () => {
    if (!selectedPrimary || !selectedSecondary) return;

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const newEmotion = {
      primary: selectedPrimary,
      secondary: selectedSecondary,
      intensity: session.preRating || 5,
      timestamp: new Date().toISOString(),
    };

    updateExerciseData({
      ...emotionData,
      selectedEmotions: [...emotionData.selectedEmotions, newEmotion],
      dominantEmotion: selectedSecondary,
      emotionFamily: selectedPrimary,
    });

    // Move to next stage after identifying emotions
    if (emotionData.selectedEmotions.length >= 0) {
      setTimeout(() => goToNextStage(), 500);
    }
  };

  return (
    <ScrollView className="flex-1 px-6 py-8" showsVerticalScrollIndicator={false}>
      <View className="space-y-6">
        {/* Header */}
        <View className="items-center">
          <View className="w-20 h-20 bg-pink-500/20 rounded-full items-center justify-center mb-4">
            <Heart size={40} color="#EC4899" />
          </View>
          <Text className="text-sage-50 font-poppins-bold text-2xl text-center mb-2">
            What are you feeling?
          </Text>
          <Text className="text-sage-300 font-inter-regular text-base text-center">
            Choose the category, then the specific emotion
          </Text>
        </View>

        {/* Primary Emotions */}
        <View className="space-y-3">
          <Text className="text-sage-300 font-inter-semibold text-sm">1. Choose a category:</Text>
          <View className="flex-row flex-wrap gap-2">
            {Object.keys(EMOTION_CATEGORIES).map((category) => (
              <TouchableOpacity
                key={category}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setSelectedPrimary(category);
                  setSelectedSecondary(null);
                }}
                className={`px-4 py-2 rounded-full border-2 ${
                  selectedPrimary === category
                    ? 'bg-mindful-teal/20 border-mindful-teal'
                    : 'bg-forest-800 border-forest-700'
                }`}
              >
                <Text
                  className={`font-inter-semibold text-sm ${
                    selectedPrimary === category ? 'text-mindful-teal' : 'text-sage-300'
                  }`}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Secondary Emotions */}
        {selectedPrimary && (
          <View className="space-y-3">
            <Text className="text-sage-300 font-inter-semibold text-sm">2. Which specific feeling?</Text>
            <View className="flex-row flex-wrap gap-2">
              {EMOTION_CATEGORIES[selectedPrimary as keyof typeof EMOTION_CATEGORIES].map((emotion) => (
                <TouchableOpacity
                  key={emotion}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setSelectedSecondary(emotion);
                  }}
                  className={`px-4 py-2 rounded-full border-2 ${
                    selectedSecondary === emotion
                      ? 'bg-mindful-teal/20 border-mindful-teal'
                      : 'bg-forest-800 border-forest-700'
                  }`}
                >
                  <Text
                    className={`font-inter-medium text-sm ${
                      selectedSecondary === emotion ? 'text-mindful-teal' : 'text-sage-300'
                    }`}
                  >
                    {emotion}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Continue Button */}
        {selectedPrimary && selectedSecondary && (
          <TouchableOpacity
            onPress={handleAddEmotion}
            className="bg-mindful-teal rounded-xl py-4 shadow-lg mt-2"
          >
            <Text className="text-forest-900 font-poppins-semibold text-base text-center">
              I'm feeling {selectedSecondary}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

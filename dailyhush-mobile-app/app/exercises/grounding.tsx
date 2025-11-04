/**
 * DailyHush - 5-4-3-2-1 Grounding Exercise
 *
 * Sensory grounding technique to anchor in the present moment
 * Identify: 5 things you see, 4 you touch, 3 you hear, 2 you smell, 1 you taste
 *
 * Flow: Same as cyclic-sigh but with custom grounding UI instead of breathing
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ExerciseContainer } from '@/components/exercises/ExerciseContainer';
import { PrePostRatingCard } from '@/components/exercises/PrePostRatingCard';
import { CompletionScreen } from '@/components/exercises/CompletionScreen';
import { TriggerLogCard } from '@/components/exercises/TriggerLogCard';
import { useExerciseSession } from '@/hooks/useExerciseSession';
import { GROUNDING_5_4_3_2_1_CONFIG } from '@/constants/exerciseConfigs';
import { Eye, Hand, Ear, Wind, Cookie, ChevronRight, Check } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import type { TriggerOption, GroundingData } from '@/types/exercises';

// Mock trigger data
const MOCK_TRIGGERS: TriggerOption[] = [
  { trigger_id: '1', trigger_name: 'Work stress', trigger_category: 'work', display_order: 1, loop_type: 'all' },
  { trigger_id: '2', trigger_name: 'Social situation', trigger_category: 'social', display_order: 2, loop_type: 'all' },
  { trigger_id: '3', trigger_name: 'Health worry', trigger_category: 'health', display_order: 3, loop_type: 'all' },
  { trigger_id: '4', trigger_name: 'Relationship', trigger_category: 'relationship', display_order: 4, loop_type: 'all' },
  { trigger_id: '5', trigger_name: 'Financial concern', trigger_category: 'financial', display_order: 5, loop_type: 'all' },
];

const SENSE_CONFIG = {
  see: { icon: Eye, color: '#4FD1C5', label: '5 things you see', target: 5 },
  touch: { icon: Hand, color: '#6366F1', label: '4 things you touch', target: 4 },
  hear: { icon: Ear, color: '#8B5CF6', label: '3 things you hear', target: 3 },
  smell: { icon: Wind, color: '#EC4899', label: '2 things you smell', target: 2 },
  taste: { icon: Cookie, color: '#F59E0B', label: '1 thing you taste', target: 1 },
};

export default function GroundingExercise() {
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
    config: GROUNDING_5_4_3_2_1_CONFIG,
    moduleContext: moduleContext as any,
    moduleScreen,
    onComplete: () => router.back(),
    onAbandon: () => router.back(),
  });

  const handlePreRating = async (rating: number) => {
    await setPreRating(rating);
    await goToNextStage();
  };

  const handlePostRating = async (rating: number) => {
    await setPostRating(rating);
    await goToNextStage();
  };

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

  const handleCompletionContinue = async () => {
    await complete();
  };

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
          <GroundingExerciseStage
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
            onContinue={handleTriggerLog}
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
            exerciseTitle={GROUNDING_5_4_3_2_1_CONFIG.title}
            completionMessage={GROUNDING_5_4_3_2_1_CONFIG.copy.completionMessage}
            onContinue={handleCompletionContinue}
            onReturnHome={handleCompletionContinue}
            showSocialProof={true}
            socialProofCount={8632}
          />
        );

      default:
        return null;
    }
  };

  return (
    <ExerciseContainer
      config={GROUNDING_5_4_3_2_1_CONFIG}
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
 * Instructions Stage
 */
function InstructionsStage({ onContinue }: { onContinue: () => void }) {
  return (
    <ScrollView className="flex-1 px-6 py-8" showsVerticalScrollIndicator={false}>
      <View className="space-y-6">
        <View className="space-y-2">
          <Text className="text-sage-50 font-poppins-bold text-3xl leading-tight">
            {GROUNDING_5_4_3_2_1_CONFIG.copy.headline}
          </Text>
          <Text className="text-sage-300 font-inter-regular text-lg leading-relaxed">
            {GROUNDING_5_4_3_2_1_CONFIG.copy.subheadline}
          </Text>
        </View>

        {/* Instructions */}
        <View className="space-y-3">
          <Text className="text-sage-50 font-poppins-semibold text-xl">How it works:</Text>
          {GROUNDING_5_4_3_2_1_CONFIG.instructions.map((instruction, index) => (
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

        <TouchableOpacity
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onContinue(); }}
          className="bg-mindful-teal rounded-xl py-4 flex-row items-center justify-center gap-2 shadow-lg mt-2"
        >
          <Text className="text-forest-900 font-poppins-semibold text-lg">
            {GROUNDING_5_4_3_2_1_CONFIG.copy.ctaStart}
          </Text>
          <ChevronRight size={20} color="#0A1612" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

/**
 * Grounding Exercise Stage
 */
function GroundingExerciseStage({
  session,
  updateExerciseData,
  goToNextStage,
}: {
  session: any;
  updateExerciseData: (data: any) => void;
  goToNextStage: () => void;
}) {
  const groundingData = session.exerciseData as GroundingData;
  const [currentInput, setCurrentInput] = useState('');
  const currentSense = groundingData.currentSense;
  const senseData = groundingData.senses[currentSense];
  const config = SENSE_CONFIG[currentSense];
  const Icon = config.icon;

  const handleAddItem = async () => {
    if (!currentInput.trim()) return;

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const updatedSenses = { ...groundingData.senses };
    updatedSenses[currentSense] = {
      ...senseData,
      identified: senseData.identified + 1,
      items: [...senseData.items, currentInput.trim()],
    };

    const newTotalIdentified = groundingData.totalIdentified + 1;

    updateExerciseData({
      ...groundingData,
      senses: updatedSenses,
      totalIdentified: newTotalIdentified,
    });

    setCurrentInput('');

    // Check if sense is complete
    if (senseData.identified + 1 >= senseData.target) {
      // Move to next sense or complete
      const senseOrder: Array<keyof typeof SENSE_CONFIG> = ['see', 'touch', 'hear', 'smell', 'taste'];
      const currentIndex = senseOrder.indexOf(currentSense);

      if (currentIndex < senseOrder.length - 1) {
        // Move to next sense
        const nextSense = senseOrder[currentIndex + 1];
        updateExerciseData({ ...groundingData, senses: updatedSenses, totalIdentified: newTotalIdentified, currentSense: nextSense });
      } else {
        // Exercise complete
        goToNextStage();
      }
    }
  };

  return (
    <ScrollView className="flex-1 px-6 py-8" showsVerticalScrollIndicator={false}>
      <View className="space-y-6">
        {/* Sense Header */}
        <View className="items-center">
          <View
            className="w-20 h-20 rounded-full items-center justify-center mb-4"
            style={{ backgroundColor: `${config.color}20` }}
          >
            <Icon size={40} color={config.color} />
          </View>
          <Text className="text-sage-50 font-poppins-bold text-2xl text-center mb-2">
            {config.label}
          </Text>
          <Text className="text-sage-300 font-inter-regular text-base text-center">
            Identify {senseData.target - senseData.identified} more
          </Text>
        </View>

        {/* Progress */}
        <View className="bg-forest-800/50 rounded-xl p-4 border border-forest-700/30">
          <View className="flex-row justify-between mb-2">
            <Text className="text-sage-300 font-inter-medium text-sm">Progress</Text>
            <Text className="text-sage-50 font-poppins-semibold text-sm">
              {groundingData.totalIdentified}/{groundingData.totalTarget}
            </Text>
          </View>
          <View className="h-2 bg-forest-900 rounded-full overflow-hidden">
            <View
              className="h-full bg-mindful-teal"
              style={{ width: `${(groundingData.totalIdentified / groundingData.totalTarget) * 100}%` }}
            />
          </View>
        </View>

        {/* Input */}
        <View className="space-y-3">
          <TextInput
            value={currentInput}
            onChangeText={setCurrentInput}
            placeholder={`E.g., ${currentSense === 'see' ? 'blue lamp on desk' : currentSense === 'touch' ? 'soft fabric of chair' : currentSense === 'hear' ? 'humming of refrigerator' : currentSense === 'smell' ? 'coffee brewing' : 'mint from gum'}`}
            placeholderTextColor="#64748B"
            className="bg-forest-800 border border-forest-700 rounded-xl p-4 text-sage-50 font-inter-regular text-base"
            autoCapitalize="none"
            returnKeyType="done"
            onSubmitEditing={handleAddItem}
          />
          <TouchableOpacity
            onPress={handleAddItem}
            disabled={!currentInput.trim()}
            className={`rounded-xl py-4 ${currentInput.trim() ? 'bg-mindful-teal' : 'bg-forest-800'}`}
          >
            <Text className={`text-center font-poppins-semibold text-base ${currentInput.trim() ? 'text-forest-900' : 'text-sage-600'}`}>
              Add Item
            </Text>
          </TouchableOpacity>
        </View>

        {/* Items List */}
        {senseData.items.length > 0 && (
          <View className="space-y-2">
            <Text className="text-sage-300 font-inter-semibold text-sm">Identified:</Text>
            {senseData.items.map((item, index) => (
              <View key={index} className="flex-row items-center gap-3 bg-forest-800/50 rounded-lg p-3 border border-forest-700/30">
                <View className="w-6 h-6 bg-mindful-teal/20 rounded-full items-center justify-center">
                  <Check size={14} color="#4FD1C5" />
                </View>
                <Text className="flex-1 text-sage-300 font-inter-regular text-base">{item}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

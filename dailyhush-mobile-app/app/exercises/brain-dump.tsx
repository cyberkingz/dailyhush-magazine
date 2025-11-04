/**
 * DailyHush - Brain Dump Exercise
 *
 * Free-form journaling to externalize racing thoughts
 * PRIVACY: Only stores word count, never the actual content
 *
 * Includes:
 * - Cialdini hooks (Authority: expressive writing research)
 * - Ogilvy copy (specific claims about cognitive load reduction)
 */

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, ActivityIndicator, Keyboard } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ExerciseContainer } from '@/components/exercises/ExerciseContainer';
import { PrePostRatingCard } from '@/components/exercises/PrePostRatingCard';
import { CompletionScreen } from '@/components/exercises/CompletionScreen';
import { TriggerLogCard } from '@/components/exercises/TriggerLogCard';
import { useExerciseSession } from '@/hooks/useExerciseSession';
import { BRAIN_DUMP_CONFIG } from '@/constants/exerciseConfigs';
import { ChevronRight, BookOpen, Sparkles, Users, FileText, Lock } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { TriggerOption, BrainDumpData } from '@/types/exercises';

const MOCK_TRIGGERS: TriggerOption[] = [
  { trigger_id: '1', trigger_name: 'Work stress', trigger_category: 'work', display_order: 1, loop_type: 'all' },
  { trigger_id: '2', trigger_name: 'Social situation', trigger_category: 'social', display_order: 2, loop_type: 'all' },
  { trigger_id: '3', trigger_name: 'Health worry', trigger_category: 'health', display_order: 3, loop_type: 'all' },
  { trigger_id: '4', trigger_name: 'Relationship', trigger_category: 'relationship', display_order: 4, loop_type: 'all' },
  { trigger_id: '5', trigger_name: 'Financial concern', trigger_category: 'financial', display_order: 5, loop_type: 'all' },
];

const BRAIN_DUMP_STORAGE_KEY = '@dailyhush_brain_dump_temp';

export default function BrainDumpExercise() {
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
    config: BRAIN_DUMP_CONFIG,
    moduleContext: moduleContext as any,
    moduleScreen,
    onComplete: async () => {
      // Clear temporary brain dump content from storage
      await AsyncStorage.removeItem(BRAIN_DUMP_STORAGE_KEY);
      router.back();
    },
    onAbandon: async () => {
      await AsyncStorage.removeItem(BRAIN_DUMP_STORAGE_KEY);
      router.back();
    },
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
          <BrainDumpStage
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
            exerciseTitle={BRAIN_DUMP_CONFIG.title}
            completionMessage={BRAIN_DUMP_CONFIG.copy.completionMessage}
            onContinue={async () => await complete()}
            onReturnHome={async () => await complete()}
            showSocialProof={true}
            socialProofCount={9834}
          />
        );

      default:
        return null;
    }
  };

  return (
    <ExerciseContainer
      config={BRAIN_DUMP_CONFIG}
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
 * Instructions with Cialdini + Ogilvy
 */
function InstructionsStage({ onContinue }: { onContinue: () => void }) {
  return (
    <ScrollView className="flex-1 px-6 py-8" showsVerticalScrollIndicator={false}>
      <View className="space-y-6">
        {/* Ogilvy Headline */}
        <View className="space-y-2">
          <Text className="text-sage-50 font-poppins-bold text-3xl leading-tight">
            {BRAIN_DUMP_CONFIG.copy.headline}
          </Text>
          <Text className="text-sage-300 font-inter-regular text-lg leading-relaxed">
            {BRAIN_DUMP_CONFIG.copy.subheadline}
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
              {BRAIN_DUMP_CONFIG.persuasion?.authorityBadge}
            </Text>
          </View>

          <View className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
            <View className="flex-row items-center gap-2 mb-2">
              <View className="w-8 h-8 bg-amber-500/20 rounded-full items-center justify-center">
                <Sparkles size={16} color="#F59E0B" />
              </View>
              <Text className="text-amber-400 font-inter-semibold text-sm uppercase tracking-wide">
                Quick Relief
              </Text>
            </View>
            <Text className="text-sage-300 font-inter-medium text-base">
              {BRAIN_DUMP_CONFIG.persuasion?.preCommitment}
            </Text>
          </View>

          <View className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
            <View className="flex-row items-center gap-2 mb-2">
              <View className="w-8 h-8 bg-purple-500/20 rounded-full items-center justify-center">
                <Users size={16} color="#A855F7" />
              </View>
              <Text className="text-purple-400 font-inter-semibold text-sm uppercase tracking-wide">
                Widely Used
              </Text>
            </View>
            <Text className="text-sage-300 font-inter-medium text-base">
              {BRAIN_DUMP_CONFIG.persuasion?.socialProof}
            </Text>
          </View>
        </View>

        {/* Instructions */}
        <View className="space-y-3">
          <Text className="text-sage-50 font-poppins-semibold text-xl">How it works:</Text>
          {BRAIN_DUMP_CONFIG.instructions.map((instruction, index) => (
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

        {/* Privacy Notice */}
        <View className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
          <View className="flex-row items-center gap-2 mb-2">
            <View className="w-8 h-8 bg-green-500/20 rounded-full items-center justify-center">
              <Lock size={16} color="#10B981" />
            </View>
            <Text className="text-green-400 font-inter-semibold text-sm uppercase tracking-wide">
              Your Privacy
            </Text>
          </View>
          <Text className="text-sage-300 font-inter-medium text-sm leading-relaxed">
            Your words stay on your device. We only track word count to measure effectiveness—never the content itself.
          </Text>
        </View>

        {/* Ogilvy CTA */}
        <TouchableOpacity
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onContinue(); }}
          className="bg-mindful-teal rounded-xl py-4 flex-row items-center justify-center gap-2 shadow-lg mt-2"
        >
          <Text className="text-forest-900 font-poppins-semibold text-lg">
            {BRAIN_DUMP_CONFIG.copy.ctaStart}
          </Text>
          <ChevronRight size={20} color="#0A1612" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

/**
 * Brain Dump Stage
 * Privacy-first: Content stays local, only word count synced
 */
function BrainDumpStage({
  session,
  updateExerciseData,
  goToNextStage,
}: {
  session: any;
  updateExerciseData: (data: any) => void;
  goToNextStage: () => void;
}) {
  const brainDumpData = session.exerciseData as BrainDumpData;
  const [text, setText] = useState('');
  const [wordCount, setWordCount] = useState(0);

  // Auto-save to AsyncStorage only (privacy)
  useEffect(() => {
    const saveTimer = setTimeout(async () => {
      if (text.trim()) {
        await AsyncStorage.setItem(BRAIN_DUMP_STORAGE_KEY, text);
        updateExerciseData({
          ...brainDumpData,
          wordCount: wordCount,
          autoSaveCount: brainDumpData.autoSaveCount + 1,
        });
      }
    }, 2000);

    return () => clearTimeout(saveTimer);
  }, [text]);

  // Count words
  useEffect(() => {
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  }, [text]);

  const handleContinue = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Keyboard.dismiss();

    // Update only word count (privacy)
    updateExerciseData({
      ...brainDumpData,
      wordCount,
      sessionDuration: session.currentStageDuration,
    });

    goToNextStage();
  };

  return (
    <View className="flex-1 px-6 py-8">
      <View className="space-y-4 flex-1">
        {/* Header */}
        <View className="items-center">
          <View className="w-16 h-16 bg-blue-500/20 rounded-full items-center justify-center mb-3">
            <FileText size={32} color="#3B82F6" />
          </View>
          <Text className="text-sage-50 font-poppins-bold text-2xl text-center mb-2">
            Write everything down
          </Text>
          <Text className="text-sage-300 font-inter-regular text-base text-center">
            No filter. No judgment. Just release it.
          </Text>
        </View>

        {/* Word Counter */}
        <View className="bg-forest-800/50 rounded-xl p-4 border border-forest-700/30">
          <View className="flex-row items-center justify-between">
            <Text className="text-sage-300 font-inter-medium text-sm">Words written:</Text>
            <Text className="text-mindful-teal font-poppins-bold text-2xl">{wordCount}</Text>
          </View>
        </View>

        {/* Text Input */}
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Start writing whatever's on your mind..."
          placeholderTextColor="#64748B"
          multiline
          textAlignVertical="top"
          className="flex-1 bg-forest-800 border border-forest-700 rounded-xl p-4 text-sage-50 font-inter-regular text-base"
          autoFocus
        />

        {/* Continue Button */}
        {wordCount >= 10 && (
          <TouchableOpacity
            onPress={handleContinue}
            className="bg-mindful-teal rounded-xl py-4 shadow-lg"
          >
            <Text className="text-forest-900 font-poppins-semibold text-base text-center">
              I'm done writing
            </Text>
          </TouchableOpacity>
        )}

        {/* Minimum words notice */}
        {wordCount < 10 && (
          <View className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3">
            <Text className="text-amber-400 font-inter-medium text-sm text-center">
              Write at least 10 words to continue ({10 - wordCount} more)
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

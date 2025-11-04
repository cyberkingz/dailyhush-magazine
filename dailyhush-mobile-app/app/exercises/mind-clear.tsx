/**
 * DailyHush - Mind Clear Exercise
 *
 * Categorize and externalize mental clutter for focus
 * Sort thoughts into: Worry, Task, Memory, Decision, Other
 *
 * Includes:
 * - Cialdini hooks (Authority, Social Proof, Pre-commitment)
 * - Ogilvy copy (specific claims about mental load)
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ExerciseContainer } from '@/components/exercises/ExerciseContainer';
import { PrePostRatingCard } from '@/components/exercises/PrePostRatingCard';
import { CompletionScreen } from '@/components/exercises/CompletionScreen';
import { TriggerLogCard } from '@/components/exercises/TriggerLogCard';
import { useExerciseSession } from '@/hooks/useExerciseSession';
import { MIND_CLEAR_CONFIG } from '@/constants/exerciseConfigs';
import { ChevronRight, BookOpen, Sparkles, Users, Brain, AlertCircle, CheckSquare, Clock, HelpCircle, MoreHorizontal } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import type { TriggerOption, MindClearData } from '@/types/exercises';

const MOCK_TRIGGERS: TriggerOption[] = [
  { trigger_id: '1', trigger_name: 'Work stress', trigger_category: 'work', display_order: 1, loop_type: 'all' },
  { trigger_id: '2', trigger_name: 'Social situation', trigger_category: 'social', display_order: 2, loop_type: 'all' },
  { trigger_id: '3', trigger_name: 'Health worry', trigger_category: 'health', display_order: 3, loop_type: 'all' },
  { trigger_id: '4', trigger_name: 'Relationship', trigger_category: 'relationship', display_order: 4, loop_type: 'all' },
  { trigger_id: '5', trigger_name: 'Financial concern', trigger_category: 'financial', display_order: 5, loop_type: 'all' },
];

const THOUGHT_CATEGORIES = {
  worry: { icon: AlertCircle, color: '#F59E0B', label: 'Worry', example: 'What if...' },
  task: { icon: CheckSquare, color: '#10B981', label: 'Task', example: 'Need to...' },
  memory: { icon: Clock, color: '#6366F1', label: 'Memory', example: 'Remember...' },
  decision: { icon: HelpCircle, color: '#EC4899', label: 'Decision', example: 'Should I...' },
  other: { icon: MoreHorizontal, color: '#94A3B8', label: 'Other', example: 'Random thought' },
};

export default function MindClearExercise() {
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
    config: MIND_CLEAR_CONFIG,
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
          <MindClearStage
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
            exerciseTitle={MIND_CLEAR_CONFIG.title}
            completionMessage={MIND_CLEAR_CONFIG.copy.completionMessage}
            onContinue={async () => await complete()}
            onReturnHome={async () => await complete()}
            showSocialProof={true}
            socialProofCount={7621}
          />
        );

      default:
        return null;
    }
  };

  return (
    <ExerciseContainer
      config={MIND_CLEAR_CONFIG}
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
            {MIND_CLEAR_CONFIG.copy.headline}
          </Text>
          <Text className="text-sage-300 font-inter-regular text-lg leading-relaxed">
            {MIND_CLEAR_CONFIG.copy.subheadline}
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
              {MIND_CLEAR_CONFIG.persuasion?.authorityBadge}
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
              {MIND_CLEAR_CONFIG.persuasion?.preCommitment}
            </Text>
          </View>

          <View className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
            <View className="flex-row items-center gap-2 mb-2">
              <View className="w-8 h-8 bg-purple-500/20 rounded-full items-center justify-center">
                <Users size={16} color="#A855F7" />
              </View>
              <Text className="text-purple-400 font-inter-semibold text-sm uppercase tracking-wide">
                Proven Effective
              </Text>
            </View>
            <Text className="text-sage-300 font-inter-medium text-base">
              {MIND_CLEAR_CONFIG.persuasion?.socialProof}
            </Text>
          </View>
        </View>

        {/* Instructions */}
        <View className="space-y-3">
          <Text className="text-sage-50 font-poppins-semibold text-xl">How it works:</Text>
          {MIND_CLEAR_CONFIG.instructions.map((instruction, index) => (
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
            {MIND_CLEAR_CONFIG.copy.ctaStart}
          </Text>
          <ChevronRight size={20} color="#0A1612" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

/**
 * Mind Clear Stage
 */
function MindClearStage({
  session,
  updateExerciseData,
  goToNextStage,
}: {
  session: any;
  updateExerciseData: (data: any) => void;
  goToNextStage: () => void;
}) {
  const mindClearData = session.exerciseData as MindClearData;
  const [selectedCategory, setSelectedCategory] = useState<'worry' | 'task' | 'memory' | 'decision' | 'other' | null>(null);
  const [thoughtInput, setThoughtInput] = useState('');

  const handleAddThought = async () => {
    if (!selectedCategory || !thoughtInput.trim()) return;

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const updatedCategories = mindClearData.thoughtCategories.map(cat =>
      cat.category === selectedCategory
        ? { ...cat, count: cat.count + 1 }
        : cat
    );

    updateExerciseData({
      ...mindClearData,
      thoughtCategories: updatedCategories,
      totalThoughts: mindClearData.totalThoughts + 1,
      clearedThoughts: mindClearData.clearedThoughts + 1,
    });

    setThoughtInput('');
    setSelectedCategory(null);

    // Complete after 5 thoughts
    if (mindClearData.totalThoughts + 1 >= 5) {
      setTimeout(() => goToNextStage(), 500);
    }
  };

  const progress = (mindClearData.totalThoughts / 5) * 100;

  return (
    <ScrollView className="flex-1 px-6 py-8" showsVerticalScrollIndicator={false}>
      <View className="space-y-6">
        {/* Header */}
        <View className="items-center">
          <View className="w-20 h-20 bg-indigo-500/20 rounded-full items-center justify-center mb-4">
            <Brain size={40} color="#6366F1" />
          </View>
          <Text className="text-sage-50 font-poppins-bold text-2xl text-center mb-2">
            Clear your mental clutter
          </Text>
          <Text className="text-sage-300 font-inter-regular text-base text-center">
            Categorize 5 thoughts to free up mental space
          </Text>
        </View>

        {/* Progress */}
        <View className="bg-forest-800/50 rounded-xl p-4 border border-forest-700/30">
          <View className="flex-row justify-between mb-2">
            <Text className="text-sage-300 font-inter-medium text-sm">Progress</Text>
            <Text className="text-sage-50 font-poppins-semibold text-sm">
              {mindClearData.totalThoughts}/5
            </Text>
          </View>
          <View className="h-2 bg-forest-900 rounded-full overflow-hidden">
            <View
              className="h-full bg-mindful-teal"
              style={{ width: `${progress}%` }}
            />
          </View>
        </View>

        {/* Categories */}
        <View className="space-y-3">
          <Text className="text-sage-300 font-inter-semibold text-sm">1. What type of thought?</Text>
          <View className="flex-row flex-wrap gap-2">
            {(Object.keys(THOUGHT_CATEGORIES) as Array<keyof typeof THOUGHT_CATEGORIES>).map((category) => {
              const config = THOUGHT_CATEGORIES[category];
              const Icon = config.icon;
              const isSelected = selectedCategory === category;

              return (
                <TouchableOpacity
                  key={category}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setSelectedCategory(category);
                  }}
                  className={`flex-1 min-w-[45%] border-2 rounded-xl p-3 ${
                    isSelected ? `border-[${config.color}]` : 'border-forest-700'
                  }`}
                  style={{
                    backgroundColor: isSelected ? `${config.color}20` : '#1A2825',
                    borderColor: isSelected ? config.color : '#2D3A36',
                  }}
                >
                  <View className="flex-row items-center gap-2 mb-1">
                    <Icon size={16} color={config.color} />
                    <Text className={`font-inter-semibold text-sm ${isSelected ? 'text-sage-50' : 'text-sage-300'}`}>
                      {config.label}
                    </Text>
                  </View>
                  <Text className="text-sage-400 font-inter-regular text-xs">{config.example}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Input */}
        {selectedCategory && (
          <View className="space-y-3">
            <Text className="text-sage-300 font-inter-semibold text-sm">2. Describe the thought:</Text>
            <TextInput
              value={thoughtInput}
              onChangeText={setThoughtInput}
              placeholder="Type it out..."
              placeholderTextColor="#64748B"
              className="bg-forest-800 border border-forest-700 rounded-xl p-4 text-sage-50 font-inter-regular text-base"
              autoCapitalize="sentences"
              returnKeyType="done"
              onSubmitEditing={handleAddThought}
            />
            <TouchableOpacity
              onPress={handleAddThought}
              disabled={!thoughtInput.trim()}
              className={`rounded-xl py-4 ${thoughtInput.trim() ? 'bg-mindful-teal' : 'bg-forest-800'}`}
            >
              <Text className={`text-center font-poppins-semibold text-base ${thoughtInput.trim() ? 'text-forest-900' : 'text-sage-600'}`}>
                Clear This Thought
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

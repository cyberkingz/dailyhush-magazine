/**
 * Nœma - Trigger Log Card Component
 *
 * Optional stage to log what triggered the anxiety
 *
 * Features:
 * - Common trigger categories
 * - Custom text input
 * - Skip option
 * - Pattern tracking for insights
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { AlertCircle, ChevronRight } from 'lucide-react-native';
import type { TriggerOption } from '@/types/exercises';

interface TriggerLogCardProps {
  triggers: TriggerOption[];
  selectedTrigger?: string;
  customText?: string;
  onSelectTrigger: (category: string) => void;
  onCustomTextChange: (text: string) => void;
  onContinue: () => void;
  onSkip: () => void;
}

export function TriggerLogCard({
  triggers,
  selectedTrigger,
  customText,
  onSelectTrigger,
  onCustomTextChange,
  onContinue,
  onSkip,
}: TriggerLogCardProps) {
  const [showCustomInput, setShowCustomInput] = useState(false);

  /**
   * Handle trigger selection
   */
  const handleSelect = async (category: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelectTrigger(category);
    setShowCustomInput(false);
  };

  /**
   * Show custom input
   */
  const handleShowCustom = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowCustomInput(true);
    onSelectTrigger('custom');
  };

  /**
   * Handle continue
   */
  const handleContinue = async () => {
    if (!selectedTrigger) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onContinue();
  };

  /**
   * Handle skip
   */
  const handleSkip = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSkip();
  };

  return (
    <ScrollView className="flex-1 px-6 py-8" showsVerticalScrollIndicator={false}>
      <Animated.View entering={FadeIn} className="space-y-6">
        {/* Header */}
        <View className="space-y-2">
          <View className="flex-row items-center gap-2 mb-2">
            <View className="w-10 h-10 bg-amber-500/10 rounded-full items-center justify-center">
              <AlertCircle size={20} color="#F59E0B" />
            </View>
            <Text className="text-sage-50 font-poppins-bold text-2xl">
              What triggered this?
            </Text>
          </View>
          <Text className="text-sage-300 font-inter-regular text-base leading-relaxed">
            Tracking triggers helps you see patterns and prevent future spirals. (Optional)
          </Text>
        </View>

        {/* Trigger Options */}
        <View className="space-y-2">
          {triggers
            .sort((a, b) => a.display_order - b.display_order)
            .map((trigger) => {
              const isSelected = selectedTrigger === trigger.trigger_category;

              return (
                <TouchableOpacity
                  key={trigger.trigger_id}
                  onPress={() => handleSelect(trigger.trigger_category)}
                  className={`border-2 rounded-xl p-4 flex-row items-center justify-between ${
                    isSelected
                      ? 'border-mindful-teal bg-mindful-teal/10'
                      : 'border-forest-700 bg-forest-800/50'
                  }`}
                  accessibilityLabel={`Select trigger: ${trigger.trigger_name}`}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                >
                  <Text
                    className={`font-inter-medium text-base ${
                      isSelected ? 'text-sage-50' : 'text-sage-300'
                    }`}
                  >
                    {trigger.trigger_name}
                  </Text>
                  {isSelected && (
                    <View className="w-6 h-6 bg-mindful-teal rounded-full items-center justify-center">
                      <View className="w-3 h-3 bg-forest-900 rounded-full" />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}

          {/* Custom Option */}
          <TouchableOpacity
            onPress={handleShowCustom}
            className={`border-2 rounded-xl p-4 flex-row items-center justify-between ${
              selectedTrigger === 'custom'
                ? 'border-mindful-teal bg-mindful-teal/10'
                : 'border-forest-700 bg-forest-800/50'
            }`}
            accessibilityLabel="Enter custom trigger"
            accessibilityRole="button"
            accessibilityState={{ selected: selectedTrigger === 'custom' }}
          >
            <Text
              className={`font-inter-medium text-base ${
                selectedTrigger === 'custom' ? 'text-sage-50' : 'text-sage-300'
              }`}
            >
              Something else...
            </Text>
            {selectedTrigger === 'custom' && (
              <View className="w-6 h-6 bg-mindful-teal rounded-full items-center justify-center">
                <View className="w-3 h-3 bg-forest-900 rounded-full" />
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Custom Text Input */}
        {showCustomInput && (
          <Animated.View
            entering={FadeInDown}
            className="bg-forest-800 border border-forest-700 rounded-xl p-4"
          >
            <Text className="text-sage-300 font-inter-semibold text-sm mb-3">
              Describe what happened:
            </Text>
            <TextInput
              value={customText}
              onChangeText={onCustomTextChange}
              placeholder="E.g., Difficult conversation with boss"
              placeholderTextColor="#64748B"
              multiline
              numberOfLines={3}
              className="bg-forest-900 border border-forest-700 rounded-lg p-3 text-sage-50 font-inter-regular text-base min-h-[80px]"
              textAlignVertical="top"
              accessibilityLabel="Custom trigger description"
            />
          </Animated.View>
        )}

        {/* CTAs */}
        <View className="space-y-3 pt-2">
          {/* Continue */}
          {selectedTrigger && (
            <Animated.View entering={FadeInDown.delay(100)}>
              <TouchableOpacity
                onPress={handleContinue}
                className="bg-mindful-teal rounded-xl py-4 flex-row items-center justify-center gap-2 shadow-lg"
                accessibilityLabel="Continue"
                accessibilityRole="button"
              >
                <Text className="text-forest-900 font-poppins-semibold text-lg">
                  Continue
                </Text>
                <ChevronRight size={20} color="#0A1612" />
              </TouchableOpacity>
            </Animated.View>
          )}

          {/* Skip */}
          <TouchableOpacity
            onPress={handleSkip}
            className="border border-forest-700 rounded-xl py-4"
            accessibilityLabel="Skip trigger logging"
            accessibilityRole="button"
          >
            <Text className="text-sage-300 font-poppins-semibold text-base text-center">
              Skip This Step
            </Text>
          </TouchableOpacity>
        </View>

        {/* Privacy Note */}
        <View className="bg-forest-800/50 rounded-xl p-4 border border-forest-700/30">
          <Text className="text-sage-300 font-inter-regular text-sm leading-relaxed">
            🔒 <Text className="font-inter-semibold">Private:</Text> Trigger data stays on your
            device and is only used to show you personal patterns in your Insights tab.
          </Text>
        </View>
      </Animated.View>
    </ScrollView>
  );
}

/**
 * DailyHush - QuizQuestion Component
 * Interactive quiz question with radio button answers
 */

import { useState } from 'react';
import { View, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Check } from 'lucide-react-native';
import { Text } from '@/components/ui/text';

interface QuizOption {
  id: string;
  text: string;
  isCorrect?: boolean;
}

interface QuizQuestionProps {
  question: string;
  options: QuizOption[];
  onAnswer: (answerId: string, isCorrect: boolean) => void;
  showFeedback?: boolean;
}

export function QuizQuestion({
  question,
  options,
  onAnswer,
  showFeedback = true
}: QuizQuestionProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);

  const handleSelect = (option: QuizOption) => {
    if (hasAnswered) return;

    setSelectedId(option.id);
    setHasAnswered(true);

    const isCorrect = option.isCorrect || false;

    if (isCorrect) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }

    onAnswer(option.id, isCorrect);
  };

  const getOptionStyle = (option: QuizOption) => {
    if (!hasAnswered) {
      return selectedId === option.id ? 'bg-[#40916C]' : 'bg-[#1A4D3C]';
    }

    // After answering, show correct/incorrect
    if (option.isCorrect) {
      return 'bg-[#2D6A4F] border border-[#40916C]';
    }

    if (selectedId === option.id && !option.isCorrect) {
      return 'bg-[#DC2626]/20 border border-[#DC2626]/40';
    }

    return 'bg-[#1A4D3C]/50';
  };

  const getTextColor = (option: QuizOption) => {
    if (!hasAnswered) {
      return selectedId === option.id ? 'text-white' : 'text-[#E8F4F0]';
    }

    if (option.isCorrect || selectedId === option.id) {
      return 'text-[#E8F4F0]';
    }

    return 'text-[#95B8A8]';
  };

  return (
    <View className="w-full">
      {/* Question */}
      <Text className="text-[#E8F4F0] text-lg font-semibold mb-6">
        {question}
      </Text>

      {/* Options */}
      <View className="gap-3">
        {options.map((option) => (
          <Pressable
            key={option.id}
            onPress={() => handleSelect(option)}
            disabled={hasAnswered}
            className={`rounded-2xl p-4 flex-row items-center justify-between ${getOptionStyle(option)} ${
              !hasAnswered && 'active:opacity-90'
            }`}
          >
            <View className="flex-1 flex-row items-center">
              {/* Radio button */}
              <View
                className={`w-5 h-5 rounded-full border-2 mr-3 ${
                  selectedId === option.id
                    ? 'border-white bg-white'
                    : 'border-[#95B8A8]'
                }`}
              >
                {selectedId === option.id && (
                  <View className="flex-1 items-center justify-center">
                    <View className="w-2.5 h-2.5 rounded-full bg-[#40916C]" />
                  </View>
                )}
              </View>

              {/* Option text */}
              <Text className={`text-base flex-1 ${getTextColor(option)}`}>
                {option.text}
              </Text>
            </View>

            {/* Checkmark for correct answer */}
            {hasAnswered && showFeedback && option.isCorrect && (
              <View className="ml-2">
                <Check size={20} color="#52B788" strokeWidth={3} />
              </View>
            )}
          </Pressable>
        ))}
      </View>
    </View>
  );
}

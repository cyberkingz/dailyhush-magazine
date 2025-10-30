/**
 * DailyHush - InteractiveExercise Component
 * Text input exercise for reflection and practice
 */

import { useState } from 'react';
import { View, TextInput } from 'react-native';
import { Text } from '@/components/ui/text';

interface InteractiveExerciseProps {
  emoji?: string;
  title: string;
  prompt: string;
  placeholder?: string;
  onComplete?: (response: string) => void;
  minLength?: number;
  maxLength?: number;
  multiline?: boolean;
}

export function InteractiveExercise({
  emoji = '💭',
  title,
  prompt,
  placeholder = 'Type your thoughts here...',
  onComplete,
  minLength = 10,
  maxLength = 500,
  multiline = true,
}: InteractiveExerciseProps) {
  const [text, setText] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleChangeText = (value: string) => {
    if (value.length <= maxLength) {
      setText(value);
      if (onComplete && value.length >= minLength) {
        onComplete(value);
      }
    }
  };

  const characterCount = text.length;
  const isValid = characterCount >= minLength;

  return (
    <View className="rounded-2xl border border-[#40916C]/20 bg-[#1A4D3C] p-6">
      {/* Header */}
      <View className="mb-4 flex-row items-center">
        <Text className="mr-3 text-4xl" style={{ lineHeight: 48, paddingTop: 4 }}>
          {emoji}
        </Text>
        <Text className="flex-1 text-lg font-semibold text-[#E8F4F0]">{title}</Text>
      </View>

      {/* Prompt */}
      <Text className="mb-4 text-base leading-relaxed text-[#95B8A8]">{prompt}</Text>

      {/* Text Input */}
      <TextInput
        value={text}
        onChangeText={handleChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        placeholderTextColor="#95B8A8"
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
        className={`rounded-xl border-2 bg-[#0A1612] p-4 text-base text-[#E8F4F0] ${
          isFocused ? 'border-[#40916C]' : 'border-[#1A2E26]'
        } ${multiline ? 'min-h-[100px]' : 'h-12'}`}
        style={{ textAlignVertical: multiline ? 'top' : 'center' }}
      />

      {/* Character Count */}
      <View className="mt-2 flex-row items-center justify-between">
        <Text
          className={`text-xs ${isValid ? 'text-[#52B788]' : 'text-[#95B8A8]'}`}
          style={{ lineHeight: 18 }}>
          {isValid ? '✓ Ready to continue' : `At least ${minLength} characters`}
        </Text>
        <Text className="text-xs text-[#95B8A8]">
          {characterCount}/{maxLength}
        </Text>
      </View>
    </View>
  );
}

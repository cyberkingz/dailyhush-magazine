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
  multiline = true
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
    <View className="bg-[#1A4D3C] rounded-2xl p-6 border border-[#40916C]/20">
      {/* Header */}
      <View className="flex-row items-center mb-4">
        <Text className="text-4xl mr-3">{emoji}</Text>
        <Text className="text-[#E8F4F0] text-lg font-semibold flex-1">
          {title}
        </Text>
      </View>

      {/* Prompt */}
      <Text className="text-[#95B8A8] text-base mb-4 leading-relaxed">
        {prompt}
      </Text>

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
        className={`bg-[#0A1612] rounded-xl p-4 text-[#E8F4F0] text-base border-2 ${
          isFocused ? 'border-[#40916C]' : 'border-[#1A2E26]'
        } ${multiline ? 'min-h-[100px]' : 'h-12'}`}
        style={{ textAlignVertical: multiline ? 'top' : 'center' }}
      />

      {/* Character Count */}
      <View className="flex-row justify-between items-center mt-2">
        <Text className={`text-xs ${isValid ? 'text-[#52B788]' : 'text-[#95B8A8]'}`}>
          {isValid ? '✓ Ready to continue' : `At least ${minLength} characters`}
        </Text>
        <Text className="text-[#95B8A8] text-xs">
          {characterCount}/{maxLength}
        </Text>
      </View>
    </View>
  );
}

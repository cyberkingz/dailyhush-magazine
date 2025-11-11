/**
 * Nœma - InteractiveExercise Component
 * Text input exercise for reflection and practice
 */

import { useState } from 'react';
import { View, TextInput } from 'react-native';
import { Text } from '@/components/ui/text';
import { colors } from '@/constants/colors';

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
    <View
      className="rounded-2xl p-6"
      style={{
        borderWidth: 1,
        borderColor: colors.background.border,
        backgroundColor: colors.background.secondary,
      }}>
      {/* Header */}
      <View className="mb-4 flex-row items-center">
        <Text className="mr-3 text-4xl" style={{ lineHeight: 48, paddingTop: 4 }}>
          {emoji}
        </Text>
        <Text className="flex-1 text-lg font-semibold" style={{ color: colors.text.primary }}>
          {title}
        </Text>
      </View>

      {/* Prompt */}
      <Text className="mb-4 text-base leading-relaxed" style={{ color: colors.text.secondary }}>
        {prompt}
      </Text>

      {/* Text Input */}
      <TextInput
        value={text}
        onChangeText={handleChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        placeholderTextColor={colors.text.muted}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
        style={{
          borderRadius: 12,
          borderWidth: 2,
          borderColor: isFocused ? colors.lime[500] : colors.background.border,
          backgroundColor: colors.background.primary,
          padding: 16,
          fontSize: 16,
          color: colors.text.primary,
          textAlignVertical: multiline ? 'top' : 'center',
          minHeight: multiline ? 100 : 48,
        }}
      />

      {/* Character Count */}
      <View className="mt-2 flex-row items-center justify-between">
        <Text
          className="text-xs"
          style={{
            lineHeight: 18,
            color: isValid ? colors.lime[500] : colors.text.secondary,
          }}>
          {isValid ? '✓ Ready to continue' : `At least ${minLength} characters`}
        </Text>
        <Text className="text-xs" style={{ color: colors.text.secondary }}>
          {characterCount}/{maxLength}
        </Text>
      </View>
    </View>
  );
}

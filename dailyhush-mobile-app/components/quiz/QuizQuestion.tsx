/**
 * DailyHush - Quiz Question Component
 * Mobile-optimized radio button question with WCAG AAA compliance
 */

import { View, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';

import { Text } from '@/components/ui/text';
import { colors } from '@/constants/colors';
import type { QuizOption } from '@/data/quizQuestions';

interface QuizQuestionProps {
  question: string;
  options: QuizOption[];
  selectedOptionId?: string;
  onSelect: (optionId: string, value: number) => void;
}

export function QuizQuestion({ question, options, selectedOptionId, onSelect }: QuizQuestionProps) {
  const handleSelect = (option: QuizOption) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelect(option.id, option.value);
  };

  return (
    <View style={{ width: '100%' }}>
      {/* Question */}
      <Text
        style={{
          fontSize: 20,
          fontWeight: '600',
          color: colors.text.primary,
          marginBottom: 24,
          lineHeight: 30,
        }}>
        {question}
      </Text>

      {/* Options */}
      <View style={{ gap: 12 }}>
        {options.map((option) => {
          const isSelected = selectedOptionId === option.id;

          return (
            <Pressable
              key={option.id}
              onPress={() => handleSelect(option)}
              accessibilityLabel={option.text}
              accessibilityRole="radio"
              accessibilityState={{ checked: isSelected }}
              testID={`quiz-option-${option.id}`}
              style={{
                backgroundColor: isSelected ? colors.lime[700] + '40' : colors.background.card,
                borderRadius: 16,
                paddingVertical: 18,
                paddingHorizontal: 20,
                minHeight: 64, // WCAG AAA touch target
                flexDirection: 'row',
                alignItems: 'center',
                borderWidth: 2,
                borderColor: isSelected ? colors.lime[600] : colors.lime[800] + '30',
              }}>
              {({ pressed }) => (
                <>
                  {/* Radio Button */}
                  <View
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      borderWidth: 2,
                      borderColor: isSelected ? colors.lime[500] : colors.text.secondary + '60',
                      backgroundColor: isSelected ? colors.lime[600] : 'transparent',
                      marginRight: 16,
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: pressed ? 0.8 : 1,
                    }}>
                    {isSelected && (
                      <View
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: 5,
                          backgroundColor: colors.button.primaryText,
                        }}
                      />
                    )}
                  </View>

                  {/* Option Text */}
                  <Text
                    style={{
                      flex: 1,
                      fontSize: 17,
                      color: isSelected ? colors.text.primary : colors.text.secondary,
                      lineHeight: 24,
                      opacity: pressed ? 0.8 : 1,
                    }}>
                    {option.text}
                  </Text>
                </>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

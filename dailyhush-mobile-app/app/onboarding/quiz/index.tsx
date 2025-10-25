/**
 * DailyHush - Quiz Flow Screen
 * In-app quiz for new users who haven't taken the website quiz
 */

import { useState, useEffect } from 'react';
import { useRouter, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Text } from '@/components/ui/text';
import { ScrollFadeView } from '@/components/ScrollFadeView';
import { QuizQuestion } from '@/components/quiz/QuizQuestion';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { quizQuestions } from '@/data/quizQuestions';
import { calculateQuizResult } from '@/utils/quizScoring';
import type { QuizAnswer } from '@/utils/quizScoring';

export default function QuizFlow() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<string, QuizAnswer>>(new Map());

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === quizQuestions.length - 1;
  const currentAnswer = answers.get(currentQuestion.id);
  const canGoNext = currentAnswer !== undefined;

  // Restore quiz progress on mount
  useEffect(() => {
    const restoreProgress = async () => {
      try {
        const saved = await AsyncStorage.getItem('quiz_progress');
        if (saved) {
          const { answers: savedAnswers, lastQuestionIndex, timestamp } = JSON.parse(saved);

          // Only restore if saved within last 24 hours
          const savedTime = new Date(timestamp).getTime();
          const now = new Date().getTime();
          const hoursSince = (now - savedTime) / (1000 * 60 * 60);

          if (hoursSince < 24) {
            setAnswers(new Map(savedAnswers));
            setCurrentQuestionIndex(lastQuestionIndex);
            console.log('✅ Quiz progress restored');
          } else {
            // Clear stale progress
            await AsyncStorage.removeItem('quiz_progress');
          }
        }
      } catch (error) {
        console.error('Failed to restore quiz progress:', error);
      }
    };
    restoreProgress();
  }, []);

  const handleSelectAnswer = async (optionId: string, value: number) => {
    const newAnswers = new Map(answers);
    newAnswers.set(currentQuestion.id, {
      questionId: currentQuestion.id,
      optionId,
      value,
    });
    setAnswers(newAnswers);

    // Save progress to AsyncStorage after each answer
    try {
      await AsyncStorage.setItem(
        'quiz_progress',
        JSON.stringify({
          answers: Array.from(newAnswers.entries()),
          lastQuestionIndex: currentQuestionIndex,
          timestamp: new Date().toISOString(),
        })
      );
    } catch (error) {
      console.error('Failed to save quiz progress:', error);
    }
  };

  const handleNext = async () => {
    if (!canGoNext) return;

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (isLastQuestion) {
      // Calculate result and route to results screen
      const answersArray = Array.from(answers.values());
      const result = calculateQuizResult(answersArray);

      router.push({
        pathname: '/onboarding/quiz/results' as any,
        params: {
          type: result.type,
          score: result.score.toString(),
          rawScore: result.rawScore.toString(),
          title: result.title,
          description: result.description,
          insight: result.insight,
          ctaHook: result.ctaHook,
          // Pass answers as JSON string
          answers: JSON.stringify(answersArray),
        },
      });
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = async () => {
    if (isFirstQuestion) return;

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCurrentQuestionIndex(currentQuestionIndex - 1);
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Overthinking Type Quiz',
          headerStyle: {
            backgroundColor: colors.background.primary,
          },
          headerTintColor: colors.emerald[500],
          headerShadowVisible: false,
        }}
      />
      <View style={{ flex: 1, backgroundColor: colors.background.primary }}>
        <StatusBar style="light" />

        {/* Progress Bar */}
        <View
          style={{
            paddingHorizontal: spacing.screenPadding,
            paddingTop: 16,
            paddingBottom: 24,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 12,
            }}
          >
            <Text
              style={{
                fontSize: 15,
                color: colors.text.secondary,
                fontWeight: '600',
              }}
            >
              Question {currentQuestionIndex + 1} of {quizQuestions.length}
            </Text>
            <Text
              style={{
                fontSize: 15,
                color: colors.emerald[400],
                fontWeight: '600',
              }}
            >
              {Math.round(progress)}%
            </Text>
          </View>
          <View
            style={{
              height: 8,
              backgroundColor: colors.emerald[900] + '40',
              borderRadius: 4,
              overflow: 'hidden',
            }}
          >
            <View
              style={{
                height: '100%',
                width: `${progress}%`,
                backgroundColor: colors.emerald[600],
                borderRadius: 4,
              }}
            />
          </View>
        </View>

        <ScrollFadeView
          style={{ flex: 1 }}
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: spacing.screenPadding,
            paddingBottom: spacing.safeArea.bottom + insets.bottom + 100,
          }}
          showsVerticalScrollIndicator={false}
          fadeColor={colors.background.primary}
          fadeHeight={48}
          fadeIntensity={0.95}
          fadeVisibility="always"
        >
          <QuizQuestion
            question={currentQuestion.question}
            options={currentQuestion.options}
            selectedOptionId={currentAnswer?.optionId}
            onSelect={handleSelectAnswer}
          />
        </ScrollFadeView>

        {/* Navigation Buttons */}
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: colors.background.primary,
            paddingHorizontal: spacing.screenPadding,
            paddingTop: 16,
            paddingBottom: spacing.safeArea.bottom + insets.bottom,
            borderTopWidth: 1,
            borderTopColor: colors.emerald[800] + '30',
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              gap: 12,
            }}
          >
            {/* Previous Button */}
            {!isFirstQuestion && (
              <Pressable
                onPress={handlePrevious}
                style={{
                  flex: 1,
                  backgroundColor: colors.background.card,
                  borderRadius: 16,
                  paddingVertical: 18,
                  paddingHorizontal: 24,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 2,
                  borderColor: colors.emerald[700],
                  minHeight: 56,
                }}
              >
                {({ pressed }) => (
                  <>
                    <ChevronLeft
                      size={24}
                      color={colors.emerald[500]}
                      strokeWidth={2}
                      style={{ marginRight: 8, opacity: pressed ? 0.7 : 1 }}
                    />
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: '600',
                        color: colors.text.primary,
                        opacity: pressed ? 0.7 : 1,
                      }}
                    >
                      Back
                    </Text>
                  </>
                )}
              </Pressable>
            )}

            {/* Next Button */}
            <Pressable
              onPress={handleNext}
              disabled={!canGoNext}
              style={{
                flex: isFirstQuestion ? 1 : 2,
                backgroundColor: canGoNext
                  ? colors.emerald[600]
                  : colors.emerald[800] + '40',
                borderRadius: 16,
                paddingVertical: 18,
                paddingHorizontal: 24,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 56,
                shadowColor: canGoNext ? colors.emerald[500] : 'transparent',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 12,
                elevation: canGoNext ? 6 : 0,
              }}
            >
              {({ pressed }) => (
                <>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: 'bold',
                      color: canGoNext ? colors.white : colors.text.secondary,
                      marginRight: 8,
                      opacity: pressed && canGoNext ? 0.9 : 1,
                    }}
                  >
                    {isLastQuestion ? 'See Results' : 'Next'}
                  </Text>
                  <ChevronRight
                    size={24}
                    color={canGoNext ? colors.white : colors.text.secondary}
                    strokeWidth={2}
                    style={{ opacity: pressed && canGoNext ? 0.9 : 1 }}
                  />
                </>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </>
  );
}

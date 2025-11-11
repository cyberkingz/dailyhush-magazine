/**
 * Nœma - Quiz Results Screen
 * Shows overthinker type with loop-specific Premium trial paywall
 * Updated: 2025-10-31
 */

import { useEffect } from 'react';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Sparkles } from 'lucide-react-native';

import { Text } from '@/components/ui/text';
import { ScrollFadeView } from '@/components/ScrollFadeView';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import type { OverthinkerType, LoopType } from '@/data/quizQuestions';
import { QUIZ_REVEAL_CONFIG } from '@/constants/quiz';

export default function QuizResults() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    type: OverthinkerType;
    score: string;
    rawScore: string;
    title: string;
    description: string;
    insight: string;
    ctaHook: string;
    loopType: LoopType;
    answers: string; // JSON stringified QuizAnswer[]
    reveal?: string;
  }>();
  const insets = useSafeAreaInsets();

  // Check if this is a results reveal (after signup) or legacy flow
  const isReveal = params.reveal === 'true';

  useEffect(() => {
    if (isReveal) {
      // Show reveal animation
      setTimeout(() => {
        // Animation complete
      }, QUIZ_REVEAL_CONFIG.ANIMATION_DURATION);
    }
  }, [isReveal]);

  // Navigate to paywall screen
  const handleViewPaywall = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({
      pathname: '/onboarding/quiz/paywall',
      params: {
        loopType: params.loopType,
        type: params.type,
        answers: params.answers,
      },
    });
  };

  // Show quiz results
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Your Results',
          headerStyle: {
            backgroundColor: colors.background.primary,
          },
          headerTintColor: colors.lime[500],
          headerShadowVisible: false,
          headerBackVisible: true,
        }}
      />
      <View style={{ flex: 1, backgroundColor: colors.background.primary }}>
        <StatusBar style="light" />

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <ScrollFadeView
            style={{ flex: 1 }}
            contentContainerStyle={{
              flexGrow: 1,
              paddingTop: 24,
              paddingBottom: spacing.safeArea.bottom + insets.bottom,
              paddingHorizontal: spacing.screenPadding,
            }}
            showsVerticalScrollIndicator={false}
            fadeColor={colors.background.primary}
            fadeHeight={48}
            fadeIntensity={0.95}
            fadeVisibility="always"
            keyboardShouldPersistTaps="handled">
            {/* Sparkle Icon */}
            <View style={{ alignItems: 'center', marginBottom: 24 }}>
              <View
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: colors.lime[600] + '20',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 2,
                  borderColor: colors.lime[600] + '40',
                }}>
                <Sparkles size={40} color={colors.lime[500]} strokeWidth={2} />
              </View>
            </View>

            {/* Result Title */}
            <Text
              style={{
                fontSize: 32,
                fontWeight: 'bold',
                color: colors.text.primary,
                textAlign: 'center',
                marginBottom: 12,
                lineHeight: 40,
              }}>
              {params.title}
            </Text>

            {/* Loop Type Badge - Show specific pattern */}
            {params.loopType && (
              <View
                style={{
                  alignSelf: 'center',
                  backgroundColor: colors.lime[600] + '25',
                  borderRadius: 20,
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  marginBottom: 20,
                  borderWidth: 1,
                  borderColor: colors.lime[600] + '40',
                }}>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: '600',
                    color: colors.lime[400],
                    textAlign: 'center',
                  }}>
                  {/* Add emoji based on loop type */}
                  {params.loopType === 'sleep-loop' && '🌙 '}
                  {params.loopType === 'decision-loop' && '🧠 '}
                  {params.loopType === 'social-loop' && '💬 '}
                  {params.loopType === 'perfectionism-loop' && '🎯 '}
                  {params.loopType
                    .split('-')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')}{' '}
                  Pattern
                </Text>
              </View>
            )}

            {/* Description */}
            <Text
              style={{
                fontSize: 18,
                color: colors.text.secondary,
                textAlign: 'center',
                lineHeight: 28,
                marginBottom: 24,
              }}>
              {params.description}
            </Text>

            {/* Insight Card */}
            <View
              style={{
                backgroundColor: colors.lime[800] + '30',
                borderRadius: 16,
                padding: 20,
                marginBottom: 40,
                borderWidth: 1,
                borderColor: colors.lime[700] + '40',
              }}>
              <Text
                style={{
                  fontSize: 16,
                  color: colors.lime[200],
                  textAlign: 'center',
                  lineHeight: 24,
                  fontWeight: '600',
                }}>
                {params.insight}
              </Text>
            </View>

            {/* Success Message */}
            <View
              style={{
                backgroundColor: colors.lime[800] + '30',
                borderRadius: 16,
                padding: spacing.lg,
                marginBottom: spacing.xl,
                borderWidth: 1,
                borderColor: colors.lime[700] + '40',
              }}>
              <Text
                style={{
                  fontSize: 17,
                  color: colors.lime[200],
                  textAlign: 'center',
                  lineHeight: 26,
                  fontWeight: '600',
                }}>
                ✨ You&apos;re all set! Let&apos;s start your journey to quieter thoughts.
              </Text>
            </View>

            {/* Unlock Your Solution Button */}
            <Pressable
              onPress={handleViewPaywall}
              style={{
                backgroundColor: colors.lime[600],
                borderRadius: 20,
                paddingVertical: 20,
                paddingHorizontal: 32,
                marginBottom: 24,
                shadowColor: colors.lime[500],
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 12,
                elevation: 6,
              }}>
              {({ pressed }) => (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: pressed ? 0.9 : 1,
                  }}>
                  <Sparkles
                    size={24}
                    color={colors.button.primaryText}
                    strokeWidth={2}
                    style={{ marginRight: 12 }}
                  />
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: 'bold',
                      color: colors.button.primaryText,
                    }}>
                    Unlock Your Path to Peace
                  </Text>
                </View>
              )}
            </Pressable>

            {/* CTA Hook */}
            <View
              style={{
                backgroundColor: colors.background.card,
                borderRadius: 16,
                padding: 20,
                borderWidth: 1,
                borderColor: colors.lime[700] + '40',
              }}>
              <Text
                style={{
                  fontSize: 15,
                  color: colors.text.secondary,
                  textAlign: 'center',
                  lineHeight: 22,
                }}>
                {params.ctaHook}
              </Text>
            </View>
          </ScrollFadeView>
        </KeyboardAvoidingView>
      </View>
    </>
  );
}

/**
 * DailyHush - Quiz Results Screen
 * Shows overthinker type and collects email for account creation
 */

import { useState } from 'react';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Pressable, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Sparkles, Mail } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Text } from '@/components/ui/text';
import { ScrollFadeView } from '@/components/ScrollFadeView';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { supabase } from '@/utils/supabase';
import { submitQuizToSupabase } from '@/utils/quizScoring';
import type { QuizAnswer } from '@/utils/quizScoring';
import type { OverthinkerType } from '@/data/quizQuestions';

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
    answers: string; // JSON stringified QuizAnswer[]
  }>();
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showRetryButton, setShowRetryButton] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const submitWithRetry = async (attempt = 1): Promise<void> => {
    try {
      // Parse answers from params
      const answers: QuizAnswer[] = JSON.parse(params.answers);

      // Submit quiz to Supabase
      const result = {
        type: params.type,
        score: parseInt(params.score),
        rawScore: parseInt(params.rawScore),
        title: params.title,
        description: params.description,
        insight: params.insight,
        ctaHook: params.ctaHook,
      };

      const { success, submissionId, error } = await submitQuizToSupabase(
        email.trim().toLowerCase(),
        answers,
        result,
        supabase
      );

      if (!success || !submissionId) {
        // Retry logic with exponential backoff
        if (attempt < 3) {
          console.log(`Retry attempt ${attempt}/3 after network error`);
          // Exponential backoff: 1s, 2s
          const delay = Math.pow(2, attempt) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
          return submitWithRetry(attempt + 1);
        }

        // After 3 attempts, show manual retry button
        setErrorMessage(error || 'Network error. Please check your connection and try again.');
        setShowRetryButton(true);
        setIsSubmitting(false);
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        return;
      }

      // Success! Route to password setup
      console.log('✅ Quiz submitted successfully, routing to password setup');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Clear quiz progress from AsyncStorage since quiz is now submitted
      try {
        await AsyncStorage.removeItem('quiz_progress');
        console.log('✅ Quiz progress cleared from storage');
      } catch (error) {
        console.error('Failed to clear quiz progress:', error);
      }

      router.push({
        pathname: '/onboarding/password-setup' as any,
        params: {
          email: email.trim().toLowerCase(),
          quizSubmissionId: submissionId,
          overthinkerType: params.type,
          score: params.rawScore,
        },
      });
    } catch (error: any) {
      console.error('Exception during quiz submission:', error);
      setErrorMessage('An unexpected error occurred. Please try again.');
      setShowRetryButton(true);
      setIsSubmitting(false);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const handleContinue = async () => {
    try {
      setErrorMessage('');
      setShowRetryButton(false);

      // Validate email
      if (!email.trim()) {
        setErrorMessage('Please enter your email address');
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        return;
      }

      if (!validateEmail(email.trim())) {
        setErrorMessage('Please enter a valid email address');
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        return;
      }

      setIsSubmitting(true);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      // Submit with automatic retry
      await submitWithRetry(1);
    } catch (error: any) {
      console.error('Exception in handleContinue:', error);
      setErrorMessage('An unexpected error occurred. Please try again.');
      setShowRetryButton(true);
      setIsSubmitting(false);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Your Results',
          headerStyle: {
            backgroundColor: colors.background.primary,
          },
          headerTintColor: colors.emerald[500],
          headerShadowVisible: false,
          headerBackVisible: true, // Allow going back to fix email typos
        }}
      />
      <View style={{ flex: 1, backgroundColor: colors.background.primary }}>
        <StatusBar style="light" />

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
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
            keyboardShouldPersistTaps="handled"
          >
            {/* Sparkle Icon */}
            <View style={{ alignItems: 'center', marginBottom: 24 }}>
              <View
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: colors.emerald[600] + '20',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 2,
                  borderColor: colors.emerald[600] + '40',
                }}
              >
                <Sparkles size={40} color={colors.emerald[500]} strokeWidth={2} />
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
              }}
            >
              {params.title}
            </Text>

            {/* Description */}
            <Text
              style={{
                fontSize: 18,
                color: colors.text.secondary,
                textAlign: 'center',
                lineHeight: 28,
                marginBottom: 24,
              }}
            >
              {params.description}
            </Text>

            {/* Insight Card */}
            <View
              style={{
                backgroundColor: colors.emerald[800] + '30',
                borderRadius: 16,
                padding: 20,
                marginBottom: 40,
                borderWidth: 1,
                borderColor: colors.emerald[700] + '40',
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: colors.emerald[200],
                  textAlign: 'center',
                  lineHeight: 24,
                  fontWeight: '600',
                }}
              >
                {params.insight}
              </Text>
            </View>

            {/* Email Input Section */}
            <Text
              style={{
                fontSize: 20,
                fontWeight: '600',
                color: colors.text.primary,
                textAlign: 'center',
                marginBottom: 12,
              }}
            >
              Save Your Results
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: colors.text.secondary,
                textAlign: 'center',
                lineHeight: 24,
                marginBottom: 24,
              }}
            >
              Enter your email to create your account and unlock the F.I.R.E. Protocol
            </Text>

            {/* Email Input */}
            <View style={{ marginBottom: 24 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: colors.text.primary,
                  marginBottom: 12,
                }}
              >
                Email Address
              </Text>
              <TextInput
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="your.email@example.com"
                placeholderTextColor={colors.text.secondary + '60'}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                returnKeyType="done"
                onSubmitEditing={handleContinue}
                editable={!isSubmitting}
                style={{
                  backgroundColor: colors.background.card,
                  borderRadius: 16,
                  paddingVertical: 18,
                  paddingHorizontal: 20,
                  fontSize: 17,
                  minHeight: 56,
                  color: colors.text.primary,
                  borderWidth: 2,
                  borderColor: errorMessage ? '#EF4444' : colors.emerald[700] + '60',
                }}
              />

              {errorMessage ? (
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: '#EF4444',
                    marginTop: 8,
                    lineHeight: 24,
                  }}
                >
                  {errorMessage}
                </Text>
              ) : null}
            </View>

            {/* Retry Button (shown after 3 failed attempts) */}
            {showRetryButton && (
              <Pressable
                onPress={handleContinue}
                style={{
                  backgroundColor: colors.emerald[700],
                  borderRadius: 16,
                  paddingVertical: 16,
                  paddingHorizontal: 24,
                  marginBottom: 16,
                  borderWidth: 2,
                  borderColor: colors.emerald[600],
                }}
              >
                {({ pressed }) => (
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: '600',
                      color: colors.white,
                      textAlign: 'center',
                      opacity: pressed ? 0.7 : 1,
                    }}
                  >
                    Retry Submission
                  </Text>
                )}
              </Pressable>
            )}

            {/* Continue Button */}
            <Pressable
              onPress={handleContinue}
              disabled={isSubmitting}
              style={{
                backgroundColor: isSubmitting ? colors.emerald[700] : colors.emerald[600],
                borderRadius: 20,
                paddingVertical: 20,
                paddingHorizontal: 32,
                marginBottom: 24,
                shadowColor: colors.emerald[500],
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 12,
                elevation: 6,
              }}
            >
              {({ pressed }) => (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: pressed && !isSubmitting ? 0.9 : 1,
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <ActivityIndicator size="small" color={colors.white} />
                      <Text
                        style={{
                          fontSize: 20,
                          fontWeight: 'bold',
                          color: colors.white,
                          marginLeft: 12,
                        }}
                      >
                        Saving...
                      </Text>
                    </>
                  ) : (
                    <>
                      <Mail
                        size={24}
                        color={colors.white}
                        strokeWidth={2}
                        style={{ marginRight: 12 }}
                      />
                      <Text
                        style={{
                          fontSize: 20,
                          fontWeight: 'bold',
                          color: colors.white,
                        }}
                      >
                        Continue
                      </Text>
                    </>
                  )}
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
                borderColor: colors.emerald[700] + '40',
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  color: colors.text.secondary,
                  textAlign: 'center',
                  lineHeight: 22,
                }}
              >
                {params.ctaHook}
              </Text>
            </View>
          </ScrollFadeView>
        </KeyboardAvoidingView>
      </View>
    </>
  );
}

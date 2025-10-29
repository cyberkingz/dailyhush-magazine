/**
 * DailyHush - Quiz Results Screen
 * Shows overthinker type and collects email for account creation
 */

import { useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Pressable, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Sparkles, ChevronRight } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Text } from '@/components/ui/text';
import { ScrollFadeView } from '@/components/ScrollFadeView';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { supabase } from '@/utils/supabase';
import { submitQuizToSupabase } from '@/utils/quizScoring';
import type { QuizAnswer } from '@/utils/quizScoring';
import type { OverthinkerType } from '@/data/quizQuestions';
import { QUIZ_REVEAL_CONFIG } from '@/constants/quiz';
import { useStore } from '@/store/useStore';

export default function QuizResults() {
  const router = useRouter();
  const { user, setUser } = useStore();
  const params = useLocalSearchParams<{
    type: OverthinkerType;
    score: string;
    rawScore: string;
    title: string;
    description: string;
    insight: string;
    ctaHook: string;
    answers: string; // JSON stringified QuizAnswer[]
    reveal?: string;
  }>();
  const insets = useSafeAreaInsets();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);

  // Check if this is a results reveal (after signup) or legacy flow
  const isReveal = params.reveal === 'true';

  useEffect(() => {
    if (isReveal) {
      // Show reveal animation
      setIsRevealing(true);
      setTimeout(() => {
        setIsRevealing(false);
      }, QUIZ_REVEAL_CONFIG.ANIMATION_DURATION);
    }
  }, [isReveal]);

  const handleContinue = async () => {
    try {
      setIsSubmitting(true);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      // Get current authenticated user
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user) {
        console.error('No authenticated user found');
        setIsSubmitting(false);
        return;
      }

      // Parse answers from params
      const answers: QuizAnswer[] = JSON.parse(params.answers);

      const result = {
        type: params.type,
        score: parseInt(params.score),
        rawScore: parseInt(params.rawScore),
        title: params.title,
        description: params.description,
        insight: params.insight,
        ctaHook: params.ctaHook,
      };

      // Submit quiz with the authenticated user\'s email
      const { success, submissionId, error } = await submitQuizToSupabase(
        session.user.email || '',
        answers,
        result,
        supabase
      );

      if (!success || !submissionId) {
        console.error('Failed to save quiz:', error);
        setIsSubmitting(false);
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        return;
      }

      // Update user profile with quiz data and mark onboarding complete
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({
          quiz_email: session.user.email,
          quiz_connected: true,
          quiz_submission_id: submissionId,
          quiz_overthinker_type: params.type,
          quiz_connected_at: new Date().toISOString(),
          onboarding_completed: true, // Profile already collected, quiz now linked
        })
        .eq('user_id', session.user.id);

      if (updateError) {
        console.error('Failed to update user profile:', updateError);
        setIsSubmitting(false);
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        return;
      }

      // BEST PRACTICE: Fetch fresh profile from database (single source of truth)
      // This ensures local store always matches database state
      const { data: updatedProfile, error: fetchError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (fetchError || !updatedProfile) {
        console.error('Failed to fetch updated profile:', fetchError);
        // Continue anyway - database is updated, store will sync on next app launch
      } else {
        console.log('✅ Profile updated and synced from database');
        setUser(updatedProfile);
      }

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Route to home - onboarding complete!
      router.replace('/');
    } catch (error: any) {
      console.error('Exception in handleContinue:', error);
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

            {/* Success Message */}
            <View
              style={{
                backgroundColor: colors.emerald[800] + '30',
                borderRadius: 16,
                padding: spacing.lg,
                marginBottom: spacing.xl,
                borderWidth: 1,
                borderColor: colors.emerald[700] + '40',
              }}
            >
              <Text
                style={{
                  fontSize: 17,
                  color: colors.emerald[200],
                  textAlign: 'center',
                  lineHeight: 26,
                  fontWeight: '600',
                }}
              >
                ✨ You&apos;re all set! Let&apos;s start your journey to quieter thoughts.
              </Text>
            </View>

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
                      <ChevronRight
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
                        Get Started
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

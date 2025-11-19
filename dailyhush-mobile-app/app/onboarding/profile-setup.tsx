/**
 * Nœma - Profile Setup Screen
 * Collects basic user information: name, age, rumination frequency
 */

import { useRouter, Stack, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { View, Pressable, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { User, Calendar, Brain } from 'lucide-react-native';

import { Text } from '@/components/ui/text';
import { ScrollFadeView } from '@/components/ScrollFadeView';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { routes } from '@/constants/routes';
import type { OverthinkerType } from '@/data/quizQuestions';
import { supabase } from '@/utils/supabase';
import { useStore } from '@/store/useStore';

export default function ProfileSetup() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Receive quiz params from previous screen
  const params = useLocalSearchParams<{
    type?: OverthinkerType;
    score?: string;
    rawScore?: string;
    title?: string;
    description?: string;
    insight?: string;
    ctaHook?: string;
    answers?: string;
  }>();

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [ruminationFrequency, setRuminationFrequency] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  const frequencyOptions = [
    { value: 'rarely', label: 'Rarely (1-2 times/week)', icon: '🌱' },
    { value: 'sometimes', label: 'Sometimes (3-5 times/week)', icon: '🌿' },
    { value: 'often', label: 'Often (Daily)', icon: '🌳' },
    { value: 'constantly', label: 'Almost Constantly', icon: '🌊' },
  ];

  const handleContinue = async () => {
    try {
      setIsSaving(true);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // Check if user is already authenticated (orphaned account recovery)
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user && !session.user.is_anonymous) {
        console.log('User already authenticated - updating profile');

        // Check if profile already exists (from password-setup flow)
        const { data: existingProfile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .single();

        if (existingProfile && existingProfile.quiz_connected) {
          // Profile exists from password-setup flow
          // Just update name/age and route to paywall
          console.log('Updating existing profile from password-setup flow');

          const { error: updateError } = await supabase
            .from('user_profiles')
            .update({
              name: name.trim() || null,
              age: age ? parseInt(age) : null,
              updated_at: new Date().toISOString(),
            })
            .eq('user_id', session.user.id);

          if (updateError) {
            console.error('Failed to update profile:', updateError);
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            return;
          }

          // Fetch updated profile
          const { data: updatedProfile } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('user_id', session.user.id)
            .single();

          if (updatedProfile) {
            useStore.getState().setUser(updatedProfile);
          }

          // Fetch quiz data to pass to paywall
          const { data: quizSubmission } = await supabase
            .from('quiz_submissions')
            .select('*')
            .eq('id', existingProfile.quiz_submission_id)
            .single();

          console.log('Quiz submission data:', {
            id: quizSubmission?.id,
            routing: quizSubmission?.routing, // Database column name
            overthinker_type: quizSubmission?.overthinker_type,
            has_answers: !!quizSubmission?.answers,
          });

          console.log('Profile updated - routing to paywall');
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

          // Route to paywall with quiz data (don't skip subscription!)
          // Note: Database uses 'routing' column, not 'loop_type'
          if (quizSubmission && quizSubmission.routing) {
            router.replace({
              pathname: '/onboarding/quiz/paywall' as any,
              params: {
                loopType: quizSubmission.routing, // routing column contains the loop type
                type: existingProfile.quiz_overthinker_type || quizSubmission.overthinker_type,
                answers: JSON.stringify(quizSubmission.answers || []),
              },
            });
          } else {
            // Fallback if quiz data incomplete - use default loop type
            console.warn('Quiz data incomplete, using default loop type');
            router.replace({
              pathname: '/onboarding/quiz/paywall' as any,
              params: {
                loopType: 'social-loop', // Default to social-loop as most common
                type: existingProfile.quiz_overthinker_type || 'worrier',
                answers: '[]',
              },
            });
          }
        } else {
          // Orphaned account recovery flow (no profile exists yet)
          // Look up quiz data by email and create profile
          const { data: quizData, error: quizError } = await supabase
            .from('quiz_submissions')
            .select('*')
            .eq('email', session.user.email)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          if (quizError || !quizData) {
            console.error('Failed to fetch quiz data:', quizError);
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            return;
          }

          // Create profile with quiz data
          const { data: profile, error: profileError } = await supabase
            .from('user_profiles')
            .upsert(
              {
                user_id: session.user.id,
                email: session.user.email,
                name: name.trim() || null,
                age: age ? parseInt(age) : null,
                quiz_overthinker_type: quizData.overthinker_type,
                quiz_submission_id: quizData.id,
                quiz_email: session.user.email,
                quiz_connected: true,
                quiz_connected_at: new Date().toISOString(),
                onboarding_completed: true, // Mark complete for orphaned account recovery
                updated_at: new Date().toISOString(),
              },
              {
                onConflict: 'user_id',
              }
            )
            .select()
            .single();

          if (profileError) {
            console.error('Failed to create profile:', profileError);
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            return;
          }

          // Update store with new profile
          useStore.getState().setUser(profile);

          console.log('Profile created (orphaned account) - navigating to home');
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

          // Navigate to home (orphaned account has already "completed" onboarding before)
          router.replace('/');
        }
      } else {
        // Not authenticated, continue to signup screen (existing flow)
        router.push({
          pathname: routes.onboarding.quizSignup as any,
          params: {
            // Quiz params
            ...params,
            // Profile data
            profileName: name.trim() || '',
            profileAge: age || '',
            profileRuminationFrequency: ruminationFrequency,
          },
        });
      }
    } catch (error) {
      console.error('Exception during profile setup:', error);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsSaving(false);
    }
  };

  const canContinue = ruminationFrequency !== ''; // At minimum, require frequency selection

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Complete Your Profile',
          headerStyle: {
            backgroundColor: colors.background.primary,
          },
          headerTintColor: colors.lime[500],
          headerShadowVisible: false,
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
            {/* Description */}
            <Text
              style={{
                fontSize: 17,
                color: colors.text.secondary,
                textAlign: 'center',
                lineHeight: 26,
                marginBottom: 32,
              }}>
              Help us personalize your Nœma experience
            </Text>

            {/* Name Input */}
            <View style={{ marginBottom: 24 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <User size={20} color={colors.lime[500]} strokeWidth={2} />
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: colors.text.primary,
                    marginLeft: 8,
                  }}>
                  What&apos;s your name? (Optional)
                </Text>
              </View>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Your name"
                placeholderTextColor={colors.text.secondary + '60'}
                autoCapitalize="words"
                autoCorrect={false}
                returnKeyType="next"
                editable={!isSaving}
                style={{
                  backgroundColor: colors.background.card,
                  borderRadius: 16,
                  paddingVertical: 18,
                  paddingHorizontal: 20,
                  fontSize: 17,
                  minHeight: 56,
                  color: colors.text.primary,
                  borderWidth: 2,
                  borderColor: colors.lime[700] + '60',
                }}
              />
            </View>

            {/* Age Input */}
            <View style={{ marginBottom: 32 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <Calendar size={20} color={colors.lime[500]} strokeWidth={2} />
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: colors.text.primary,
                    marginLeft: 8,
                  }}>
                  What&apos;s your age? (Optional)
                </Text>
              </View>
              <TextInput
                value={age}
                onChangeText={(text) => {
                  // Only allow numbers
                  const numericValue = text.replace(/[^0-9]/g, '');
                  setAge(numericValue);
                }}
                placeholder="Your age"
                placeholderTextColor={colors.text.secondary + '60'}
                keyboardType="number-pad"
                returnKeyType="done"
                editable={!isSaving}
                maxLength={3}
                style={{
                  backgroundColor: colors.background.card,
                  borderRadius: 16,
                  paddingVertical: 18,
                  paddingHorizontal: 20,
                  fontSize: 17,
                  minHeight: 56,
                  color: colors.text.primary,
                  borderWidth: 2,
                  borderColor: colors.lime[700] + '60',
                }}
              />
            </View>

            {/* Rumination Frequency */}
            <View style={{ marginBottom: 32 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <Brain size={20} color={colors.lime[500]} strokeWidth={2} />
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: colors.text.primary,
                    marginLeft: 8,
                  }}>
                  How often do you ruminate? *
                </Text>
              </View>

              {frequencyOptions.map((option) => (
                <Pressable
                  key={option.value}
                  onPress={async () => {
                    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setRuminationFrequency(option.value);
                  }}
                  accessibilityLabel={option.label}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: ruminationFrequency === option.value }}
                  testID={`frequency-option-${option.value}`}
                  style={{
                    backgroundColor:
                      ruminationFrequency === option.value
                        ? colors.lime[600] + '30'
                        : colors.background.card,
                    borderRadius: 16,
                    paddingVertical: 18,
                    paddingHorizontal: 20,
                    marginBottom: 12,
                    borderWidth: 2,
                    borderColor:
                      ruminationFrequency === option.value
                        ? colors.lime[600]
                        : colors.lime[700] + '40',
                  }}>
                  {({ pressed }) => (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        opacity: pressed ? 0.7 : 1,
                      }}>
                      <Text style={{ fontSize: 24, marginRight: 12 }}>{option.icon}</Text>
                      <Text
                        style={{
                          fontSize: 17,
                          fontWeight: ruminationFrequency === option.value ? '600' : '500',
                          color: colors.text.primary,
                          flex: 1,
                        }}>
                        {option.label}
                      </Text>
                      {ruminationFrequency === option.value && (
                        <View
                          style={{
                            width: 24,
                            height: 24,
                            borderRadius: 12,
                            backgroundColor: colors.lime[600],
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <Text
                            style={{
                              color: colors.button.primaryText,
                              fontSize: 16,
                              fontWeight: 'bold',
                            }}>
                            ✓
                          </Text>
                        </View>
                      )}
                    </View>
                  )}
                </Pressable>
              ))}
            </View>

            {/* Continue Button */}
            <Pressable
              onPress={handleContinue}
              disabled={!canContinue || isSaving}
              style={{
                backgroundColor:
                  canContinue && !isSaving ? colors.lime[600] : colors.lime[700] + '60',
                borderRadius: 20,
                paddingVertical: 20,
                paddingHorizontal: 32,
                marginBottom: 24,
                shadowColor: canContinue ? colors.lime[500] : 'transparent',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 12,
                elevation: canContinue ? 6 : 0,
              }}>
              {({ pressed }) => (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: pressed && canContinue && !isSaving ? 0.9 : 1,
                  }}>
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: 'bold',
                      color: colors.button.primaryText,
                    }}>
                    {isSaving ? 'Saving...' : 'Complete Setup'}
                  </Text>
                </View>
              )}
            </Pressable>
          </ScrollFadeView>
        </KeyboardAvoidingView>
      </View>
    </>
  );
}

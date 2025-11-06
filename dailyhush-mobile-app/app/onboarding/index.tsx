/**
 * DailyHush - Improved Onboarding Flow
 * Based on comprehensive UX audit
 *
 * NEW Flow (UX-optimized with Quiz Connection):
 * 1. Welcome & Value Proposition (with privacy messaging)
 * 2. Quiz Recognition (Did you take our quiz?)
 *    - If YES → Email Lookup → Password Setup → Home (skip rest of onboarding)
 *    - If NO/Not Sure → Continue to Demo
 * 3. Demo Spiral Interrupt (Let them try it FIRST - experience before commitment)
 * 4. Optional Assessment (personalization, not gatekeeping)
 * 5. Conditional Shift Necklace (only if they have one)
 * 6. Complete Setup (with name collection)
 */

import { useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Pressable, TextInput, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { Clock, Sparkles, Check, ArrowRight, Lock } from 'lucide-react-native';

import { Text } from '@/components/ui/text';
import { TopBar } from '@/components/TopBar';
import { useStore } from '@/store/useStore';
import { supabase } from '@/utils/supabase';
import { signInAnonymously } from '@/services/auth';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { brandFonts } from '@/constants/profileTypography';
import type { UserProfile } from '@/types';

// NEW: Reordered flow - demo before assessment
type OnboardingStep = 'welcome' | 'demo' | 'assessment' | 'shift' | 'complete';

interface AssessmentData {
  name?: string;
  age?: number;
  quizScore?: number;
  hasShiftNecklace?: boolean;
}

export default function Onboarding() {
  const router = useRouter();
  const params = useLocalSearchParams<{ completed?: string }>();
  const insets = useSafeAreaInsets();
  const { setUser } = useStore();

  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [assessmentData, setAssessmentData] = useState<AssessmentData>({});
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  /**
   * Stop and unload background music
   */
  const stopBackgroundMusic = async () => {
    if (sound) {
      try {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
      } catch (error) {
        console.error('Error stopping background music:', error);
      }
    }
  };

  /**
   * Background Music - Play calming forest sounds throughout onboarding
   */
  useEffect(() => {
    let isMounted = true;
    let loadedSound: Audio.Sound | null = null;

    async function loadAndPlaySound() {
      try {
        // Configure audio mode
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          shouldDuckAndroid: true,
        });

        // Load sound
        const { sound: newSound } = await Audio.Sound.createAsync(
          require('@/assets/sounds/forest-sound.mp3'),
          {
            isLooping: true,
            volume: 0.85, // Increased volume for better audibility
          }
        );

        loadedSound = newSound;

        if (isMounted) {
          setSound(newSound);
          await newSound.playAsync();
        } else {
          // Component unmounted before we could play
          await newSound.unloadAsync();
        }
      } catch (error) {
        console.error('Error loading background music:', error);
      }
    }

    loadAndPlaySound();

    // Cleanup when component unmounts
    return () => {
      isMounted = false;
      if (loadedSound) {
        loadedSound.stopAsync().catch(() => {});
        loadedSound.unloadAsync().catch(() => {});
      }
    };
  }, []);

  /**
   * Auto-advance when returning from demo
   */
  useEffect(() => {
    if (params.completed === 'demo' && currentStep === 'welcome') {
      // User completed the demo, advance to assessment
      setCurrentStep('assessment');
    }
  }, [params.completed]);

  /**
   * Get total steps (conditional based on Shift ownership)
   */
  const getTotalSteps = () => {
    // If user has Shift, show all 5 steps. Otherwise skip Shift screen = 4 steps
    return assessmentData.hasShiftNecklace === true ? 5 : 4;
  };

  /**
   * Progress through onboarding steps (NEW ORDER with Quiz Recognition)
   */
  const nextStep = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (currentStep === 'welcome') {
      // Stop music before navigating away
      await stopBackgroundMusic();
      // Route to quiz recognition instead of directly to demo
      router.push('/onboarding/quiz-recognition' as any);
    } else if (currentStep === 'demo') {
      setCurrentStep('assessment');
    } else if (currentStep === 'assessment') {
      // Conditional: Skip Shift if user doesn\'t have one
      if (assessmentData.hasShiftNecklace === true) {
        setCurrentStep('shift');
      } else {
        setCurrentStep('complete');
      }
    } else if (currentStep === 'shift') {
      setCurrentStep('complete');
    } else if (currentStep === 'complete') {
      await completeOnboarding();
    }
  };

  /**
   * Go back to previous step
   */
  const previousStep = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (currentStep === 'demo') {
      setCurrentStep('welcome');
    } else if (currentStep === 'assessment') {
      setCurrentStep('demo');
    } else if (currentStep === 'shift') {
      setCurrentStep('assessment');
    } else if (currentStep === 'complete') {
      if (assessmentData.hasShiftNecklace === true) {
        setCurrentStep('shift');
      } else {
        setCurrentStep('assessment');
      }
    }
  };

  /**
   * Skip assessment (make it optional)
   */
  const skipAssessment = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Skip to next step without requiring answers
    if (assessmentData.hasShiftNecklace === true) {
      setCurrentStep('shift');
    } else {
      setCurrentStep('complete');
    }
  };

  /**
   * Save onboarding data and complete setup
   */
  const completeOnboarding = async () => {
    try {
      // Get the actual authenticated user ID from Supabase
      // This is critical to match what RLS policies check against
      let {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      // If no auth session exists yet, create anonymous session
      if (!authUser) {
        console.log('No session found, creating anonymous session...');
        const authResult = await signInAnonymously();

        if (!authResult.success || !authResult.userId) {
          console.error('Failed to create anonymous session:', authResult.error);
          return; // Don\'t proceed without authentication
        }
        console.log('Anonymous session created:', authResult.userId);

        // Get the newly created auth user
        const result = await supabase.auth.getUser();
        authUser = result.data.user;
      }

      // At this point, authUser should exist (either existing or newly created)

      if (!authUser) {
        console.error('No authenticated user found after sign-in');
        return;
      }

      const actualUserId = authUser.id;
      console.log(
        'Completing onboarding for user:',
        actualUserId,
        'isAnonymous:',
        authUser.is_anonymous
      );

      // Create user profile for local store
      const newUserProfile: UserProfile = {
        user_id: actualUserId,
        email: authUser.email || '', // Email users have email, anonymous don\'t
        name: assessmentData.name,
        age: assessmentData.age,
        quiz_score: assessmentData.quizScore,
        has_shift_necklace: assessmentData.hasShiftNecklace || false,
        shift_paired: false,
        onboarding_completed: true,
        fire_progress: {
          focus: false,
          interrupt: false,
          reframe: false,
          execute: false,
        },
        triggers: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Update local store
      setUser(newUserProfile);

      // Update profile in Supabase with onboarding data
      // (signInAnonymously already created the profile, this updates it)
      const { error } = await supabase
        .from('user_profiles')
        .update({
          // Don\'t update user_id or email (already set by signInAnonymously)
          name: assessmentData.name,
          age: assessmentData.age,
          quiz_score: assessmentData.quizScore,
          has_shift_necklace: assessmentData.hasShiftNecklace || false,
          onboarding_completed: true,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', actualUserId);

      if (error) {
        console.error('Error saving to Supabase:', error);
      } else {
        console.log('User profile saved to database');
      }

      // Stop music before navigating away from onboarding
      await stopBackgroundMusic();

      // Navigate to auth choice screen (UX Option D: soft ask after onboarding)
      // User can choose to create account or continue as guest
      router.replace('/auth');
    } catch (err) {
      console.error('Error completing onboarding:', err);
    }
  };

  /**
   * Welcome Screen - Simple, native mobile app feel
   * Designed for women 55-70 managing overthinking
   * Calming forest background
   */
  const renderWelcome = () => (
    <View className="flex-1" style={{ backgroundColor: colors.background.primary }}>
      <StatusBar style="light" />

      {/* Forest Background - Top with fade-out */}
      <View style={{ position: 'absolute', width: '100%', height: '65%', top: 0 }}>
        <Image
          source={require('@/assets/img/bd1d7d39d134c07f3d7d94b96090d9ed.jpg')}
          style={{
            width: '100%',
            height: '100%',
            opacity: 0.18,
          }}
          resizeMode="cover"
        />
        {/* Gradient overlay to smoothly blend with background */}
        <LinearGradient
          colors={[
            'rgba(10, 22, 18, 0)', // Transparent
            'rgba(10, 22, 18, 0.3)', // 30%
            'rgba(10, 22, 18, 0.6)', // 60%
            'rgba(10, 22, 18, 0.9)', // 90%
            colors.background.primary, // Full solid
          ]}
          locations={[0, 0.3, 0.6, 0.85, 1]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '70%',
          }}
        />
      </View>

      {/* Content - Centered, minimal */}
      <View
        className="flex-1 items-center justify-center"
        style={{
          paddingHorizontal: 32,
          paddingTop: insets.top + 32,
          paddingBottom: insets.bottom + 48,
        }}>
        {/* Main content centered */}
        <View className="items-center" style={{ flex: 1, justifyContent: 'center', maxWidth: 400 }}>
          {/* DailyHush Logo */}
          <View className="mb-12">
            <Image
              source={require('@/assets/img/rounded-logo.png')}
              style={{
                width: 96,
                height: 96,
              }}
              resizeMode="contain"
            />
          </View>

          {/* Headline - Clear benefit, 2 lines max */}
          <Text
            className="mb-4 text-center"
            style={{
              color: colors.text.primary,
              fontSize: 32,
              lineHeight: 42,
              letterSpacing: 0.3,
              fontFamily: brandFonts.headlineBold,
            }}>
            Quiet Your Mind{'\n'}in 90 Seconds
          </Text>

          {/* Subheadline - What it does, no medical claims */}
          <Text
            className="mb-2 text-center"
            style={{
              color: colors.text.secondary,
              fontSize: 18,
              lineHeight: 28,
              fontFamily: 'Inter_400Regular',
            }}>
            A gentle technique to interrupt{'\n'}repetitive thoughts and find calm
          </Text>
        </View>

        {/* CTA at bottom */}
        <View style={{ width: '100%' }}>
          {/* Trust Indicators - Privacy first */}
          <View
            style={{
              alignItems: 'center',
              marginBottom: 20,
            }}>
            {/* Privacy badge */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 4,
              }}>
              <Lock size={16} color={colors.lime[400]} strokeWidth={2} />
              <Text
                style={{
                  color: colors.text.secondary,
                  fontSize: 16,
                  marginLeft: 8,
                  fontFamily: 'Inter_500Medium',
                }}>
                100% Private • No Signup
              </Text>
            </View>

            {/* Soft social proof */}
            <Text
              style={{
                color: colors.text.secondary,
                fontSize: 14,
                opacity: 0.7,
                fontFamily: 'Inter_400Regular',
              }}>
              Join thousands finding their calm
            </Text>
          </View>

          {/* CTA Button - Pill-shaped, premium design */}
          <Pressable
            onPress={nextStep}
            className="items-center justify-center active:opacity-90"
            style={{
              backgroundColor: colors.lime[600],
              height: 62,
              borderRadius: 100,
              marginBottom: 12,
              shadowColor: colors.lime[500],
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.4,
              shadowRadius: 16,
              elevation: 8,
            }}>
            <Text
              style={{
                color: colors.button.primaryText,
                fontSize: 19,
                fontFamily: 'Poppins_600SemiBold',
                letterSpacing: 0.3,
              }}>
              Start Your Free Session
            </Text>
          </Pressable>

          {/* Sign In Link - WCAG AAA touch target */}
          <Pressable
            onPress={async () => {
              // Stop music before navigating to login
              await stopBackgroundMusic();
              router.push('/auth/login' as any);
            }}
            className="items-center justify-center active:opacity-70"
            style={{
              minHeight: 56,
              paddingVertical: 16,
            }}>
            <Text
              style={{
                color: colors.text.secondary,
                fontSize: 16,
                fontFamily: 'Inter_400Regular',
              }}>
              Already have an account?{' '}
              <Text
                style={{
                  color: colors.lime[500],
                  fontFamily: 'Inter_600SemiBold',
                }}>
                Sign in
              </Text>
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );

  /**
   * Demo Screen - Fixed layout with integrated header
   */
  const renderDemo = () => (
    <View className="flex-1" style={{ backgroundColor: colors.background.primary }}>
      <StatusBar style="light" />

      <TopBar
        showBack
        onBackPress={previousStep}
        progressDots={{ current: 2, total: getTotalSteps() }}
      />

      {/* Content - Fixed height, no scroll */}
      <View
        className="flex-1 justify-between px-5"
        style={{ paddingTop: 20, paddingBottom: insets.bottom + 20 }}>
        <View>
          <Text className="mb-2 text-3xl font-bold" style={{ color: colors.text.primary }}>
            We Get It
          </Text>
          <Text className="mb-8 text-sm leading-relaxed" style={{ color: colors.text.secondary }}>
            Try the 90-second protocol right now. No signup. No commitment. Just relief.
          </Text>

          {/* Demo Card - Compact */}
          <View
            className="mb-6 items-center rounded-2xl p-6"
            style={{ backgroundColor: colors.background.secondary }}>
            <View
              className="mb-4 rounded-full p-5"
              style={{ backgroundColor: colors.button.primary + '20' }}>
              <Clock size={52} color={colors.lime[400]} strokeWidth={2} />
            </View>

            <Text
              className="mb-3 text-center text-xl font-bold"
              style={{ color: colors.text.primary }}>
              Break The Loop
            </Text>

            <Text
              className="text-center text-sm leading-relaxed"
              style={{ color: colors.text.secondary }}>
              Used by 50,000+ women. Interrupts shame-driven rumination in 90 seconds.
            </Text>
          </View>

          <Text className="mb-3 text-center text-xs" style={{ color: colors.lime[400] }}>
            Recommended - see what makes DailyHush different
          </Text>
        </View>

        {/* Buttons - Bottom */}
        <View>
          <Pressable
            onPress={async () => {
              // Stop music before navigating to spiral
              await stopBackgroundMusic();
              router.push('/spiral?from=onboarding' as any);
            }}
            className="mb-3 items-center justify-center rounded-2xl active:opacity-90"
            style={{
              backgroundColor: colors.button.primary,
              height: spacing.button.height,
            }}>
            <Text className="text-lg font-bold" style={{ color: colors.button.primaryText }}>
              Try It Now (90 seconds)
            </Text>
          </Pressable>

          <Pressable
            onPress={nextStep}
            className="items-center justify-center rounded-2xl active:opacity-80"
            style={{ height: spacing.button.heightSmall }}>
            <Text className="text-base font-semibold" style={{ color: colors.text.secondary }}>
              I&apos;ll try this later
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );

  /**
   * Assessment Screen - Fixed layout with KeyboardAvoidingView
   */
  const renderAssessment = () => (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ backgroundColor: colors.background.primary }}>
      <StatusBar style="light" />

      <TopBar
        showBack
        onBackPress={previousStep}
        progressDots={{ current: 3, total: getTotalSteps() }}
      />

      {/* Content */}
      <View className="flex-1 px-5" style={{ paddingTop: 20, paddingBottom: insets.bottom + 16 }}>
        <Text className="mb-1 text-2xl font-bold" style={{ color: colors.text.primary }}>
          Know Your Patterns
        </Text>
        <Text className="mb-5 text-sm" style={{ color: colors.text.secondary }}>
          Optional - but this helps us help you better
        </Text>

        {/* Question 1: Age - Compact */}
        <View className="mb-4">
          <Text className="mb-1 text-sm font-semibold" style={{ color: colors.text.primary }}>
            What&apos;s your age?
          </Text>
          <TextInput
            placeholder="Optional"
            placeholderTextColor={colors.text.secondary}
            keyboardType="number-pad"
            value={assessmentData.age?.toString() || ''}
            onChangeText={(text) =>
              setAssessmentData({ ...assessmentData, age: parseInt(text) || undefined })
            }
            className="rounded-xl px-4 text-base"
            style={{
              backgroundColor: colors.background.secondary,
              color: colors.text.primary,
              height: 48,
              borderWidth: 1,
              borderColor: colors.background.border,
            }}
          />
        </View>

        {/* Question 2: Rumination - Compact */}
        <View className="mb-4">
          <Text className="mb-1 text-sm font-semibold" style={{ color: colors.text.primary }}>
            How often does your mind replay conversations? (1-10)
          </Text>
          <View className="flex-row flex-wrap gap-1.5">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <Pressable
                key={num}
                onPress={() => {
                  setSelectedQuizAnswer(num);
                  setAssessmentData({ ...assessmentData, quizScore: num });
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
                className="items-center justify-center rounded-xl"
                style={{
                  width: 56,
                  height: 56,
                  backgroundColor:
                    selectedQuizAnswer === num
                      ? colors.button.primary
                      : colors.background.secondary,
                }}>
                <Text
                  className="text-lg font-bold"
                  style={{
                    color: selectedQuizAnswer === num ? colors.button.primaryText : colors.text.primary,
                  }}>
                  {num}
                </Text>
              </Pressable>
            ))}
          </View>
          <View className="mt-1 flex-row justify-between">
            <Text className="text-xs" style={{ color: colors.text.secondary }}>
              Rarely
            </Text>
            <Text className="text-xs" style={{ color: colors.text.secondary }}>
              Daily
            </Text>
          </View>
        </View>

        {/* Question 3: Shift Necklace */}
        <View className="mb-5">
          <Text className="mb-2 text-sm font-semibold" style={{ color: colors.text.primary }}>
            Do you have The Shift necklace?
          </Text>
          <View className="flex-row gap-2">
            <Pressable
              onPress={() => {
                setAssessmentData({ ...assessmentData, hasShiftNecklace: true });
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              className="flex-1 items-center rounded-xl p-3"
              style={{
                backgroundColor:
                  assessmentData.hasShiftNecklace === true
                    ? colors.button.primary
                    : colors.background.secondary,
              }}>
              <Text
                className="text-sm font-semibold"
                style={{
                  color:
                    assessmentData.hasShiftNecklace === true ? colors.button.primaryText : colors.text.primary,
                }}>
                Yes
              </Text>
            </Pressable>

            <Pressable
              onPress={() => {
                setAssessmentData({ ...assessmentData, hasShiftNecklace: false });
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              className="flex-1 items-center rounded-xl p-3"
              style={{
                backgroundColor:
                  assessmentData.hasShiftNecklace === false
                    ? colors.button.primary
                    : colors.background.secondary,
              }}>
              <Text
                className="text-sm font-semibold"
                style={{
                  color:
                    assessmentData.hasShiftNecklace === false ? colors.button.primaryText : colors.text.primary,
                }}>
                No
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Spacer */}
        <View className="flex-1" />

        {/* Buttons - Bottom */}
        <View>
          <Pressable
            onPress={nextStep}
            className="mb-2 items-center justify-center rounded-2xl active:opacity-90"
            style={{
              backgroundColor: colors.button.primary,
              height: spacing.button.height,
            }}>
            <Text className="text-lg font-bold" style={{ color: colors.button.primaryText }}>
              Continue
            </Text>
          </Pressable>

          <Pressable
            onPress={skipAssessment}
            className="items-center justify-center rounded-2xl active:opacity-80"
            style={{ height: spacing.button.heightSmall }}>
            <Text className="text-sm font-semibold" style={{ color: colors.text.secondary }}>
              Skip for now
            </Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );

  /**
   * Shift Screen - Fixed layout with top nav
   */
  const renderShift = () => (
    <View className="flex-1" style={{ backgroundColor: colors.background.primary }}>
      <StatusBar style="light" />

      <TopBar showBack onBackPress={previousStep} progressDots={{ current: 4, total: 5 }} />

      {/* Content - Fixed height, no scroll */}
      <View
        className="flex-1 justify-between px-5"
        style={{ paddingTop: 20, paddingBottom: insets.bottom + 20 }}>
        <View>
          <Text className="mb-2 text-3xl font-bold" style={{ color: colors.text.primary }}>
            Pair Your Shift
          </Text>
          <Text className="mb-8 text-sm" style={{ color: colors.text.secondary }}>
            Connect your Shift necklace for instant calm anywhere
          </Text>

          {/* Shift Card - Compact */}
          <View
            className="mb-6 items-center rounded-2xl p-6"
            style={{ backgroundColor: colors.background.secondary }}>
            <View
              className="mb-4 rounded-full p-5"
              style={{ backgroundColor: colors.button.primary + '20' }}>
              <Sparkles size={52} color={colors.lime[400]} strokeWidth={2} />
            </View>

            <Text
              className="mb-3 text-center text-xl font-bold"
              style={{ color: colors.text.primary }}>
              The Shift Necklace
            </Text>

            <Text
              className="mb-5 text-center text-sm leading-relaxed"
              style={{ color: colors.text.secondary }}>
              Gentle vibrations guide your breathing. Works silently, even in public.
            </Text>

            <Pressable
              onPress={() => router.push('/shift-pairing' as any)}
              className="w-full items-center rounded-2xl p-4 active:opacity-90"
              style={{ backgroundColor: colors.button.primary }}>
              <Text className="text-base font-bold" style={{ color: colors.button.primaryText }}>
                Pair Now via Bluetooth
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Continue Button - Bottom */}
        <Pressable
          onPress={nextStep}
          className="items-center justify-center rounded-2xl active:opacity-90"
          style={{
            backgroundColor: colors.background.secondary,
            height: spacing.button.height,
          }}>
          <Text className="text-lg font-bold" style={{ color: colors.text.primary }}>
            I&apos;ll Pair Later
          </Text>
        </Pressable>
      </View>
    </View>
  );

  /**
   * Complete Screen - Fixed layout with KeyboardAvoidingView
   */
  const renderComplete = () => (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ backgroundColor: colors.background.primary, paddingTop: insets.top + 16 }}>
      <StatusBar style="light" />

      {/* Content */}
      <View className="flex-1 justify-between px-5" style={{ paddingBottom: insets.bottom + 20 }}>
        <View>
          {/* Success Icon - Compact */}
          <View className="mb-8 items-center">
            <View
              className="mb-6 h-24 w-24 items-center justify-center rounded-full"
              style={{ backgroundColor: colors.background.tertiary }}>
              <Check size={52} color={colors.lime[100]} strokeWidth={3} />
            </View>

            <Text
              className="mb-3 text-center text-3xl font-bold"
              style={{ color: colors.text.primary }}>
              You&apos;re All Set!
            </Text>

            <Text
              className="mb-6 text-center text-sm leading-relaxed"
              style={{ color: colors.text.secondary }}>
              DailyHush is ready to help you find peace of mind
            </Text>
          </View>

          {/* Name Input */}
          <View className="mb-6">
            <Text className="mb-2 text-center text-sm" style={{ color: colors.text.secondary }}>
              What should we call you? (optional)
            </Text>
            <TextInput
              className="rounded-xl px-4 text-center text-base"
              style={{
                backgroundColor: colors.background.secondary,
                color: colors.text.primary,
                height: 48,
                borderWidth: 1,
                borderColor: colors.background.border,
              }}
              placeholder="Your first name"
              placeholderTextColor={colors.text.secondary}
              value={assessmentData.name || ''}
              onChangeText={(text) => setAssessmentData({ ...assessmentData, name: text })}
              autoCapitalize="words"
              autoCorrect={false}
            />
          </View>

          {/* Reminder Card */}
          <View
            className="mb-4 rounded-xl p-5"
            style={{ backgroundColor: colors.background.secondary }}>
            <Text
              className="text-center text-sm leading-relaxed"
              style={{ color: colors.text.primary }}>
              Tap the big &quot;I&apos;M SPIRALING&quot; button anytime you need help. We&apos;ll be
              there in 90 seconds.
            </Text>
          </View>

          {/* Privacy Note */}
          <View className="flex-row items-center justify-center">
            <Lock size={12} color={colors.lime[400]} strokeWidth={2} />
            <Text className="ml-1.5 text-center text-xs" style={{ color: colors.text.secondary }}>
              Your anonymous profile is saved.
            </Text>
          </View>
        </View>

        {/* Start Button - Bottom */}
        <Pressable
          onPress={completeOnboarding}
          className="items-center justify-center rounded-2xl active:opacity-90"
          style={{
            backgroundColor: colors.button.primary,
            height: spacing.button.height,
          }}>
          <View className="flex-row items-center">
            <Text className="mr-2 text-lg font-bold" style={{ color: colors.button.primaryText }}>
              Start Using DailyHush
            </Text>
            <ArrowRight size={20} color={colors.button.primaryText} strokeWidth={3} />
          </View>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );

  /**
   * Render current step
   */
  return (
    <>
      {currentStep === 'welcome' && renderWelcome()}
      {currentStep === 'demo' && renderDemo()}
      {currentStep === 'assessment' && renderAssessment()}
      {currentStep === 'shift' && renderShift()}
      {currentStep === 'complete' && renderComplete()}
    </>
  );
}

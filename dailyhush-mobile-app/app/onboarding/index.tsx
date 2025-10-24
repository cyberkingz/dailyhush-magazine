/**
 * DailyHush - Improved Onboarding Flow
 * Based on comprehensive UX audit
 *
 * NEW Flow (UX-optimized):
 * 1. Welcome & Value Proposition (with privacy messaging)
 * 2. Demo Spiral Interrupt (Let them try it FIRST - experience before commitment)
 * 3. Optional Assessment (personalization, not gatekeeping)
 * 4. Conditional Shift Necklace (only if they have one)
 * 5. Complete Setup (with name collection)
 */

import { useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Pressable, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Clock, Brain, Moon, Sparkles, Check, ArrowRight, Lock } from 'lucide-react-native';

import { Text } from '@/components/ui/text';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { TopBar } from '@/components/TopBar';
import { useStore } from '@/store/useStore';
import { supabase } from '@/utils/supabase';
import { signInAnonymously } from '@/services/auth';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
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
  const { user, setUser } = useStore();

  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [assessmentData, setAssessmentData] = useState<AssessmentData>({});
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);

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
   * Get current step number for progress indicator
   */
  const getStepNumber = () => {
    const steps: OnboardingStep[] = ['welcome', 'demo', 'assessment', 'shift', 'complete'];
    return steps.indexOf(currentStep) + 1;
  };

  /**
   * Get total steps (conditional based on Shift ownership)
   */
  const getTotalSteps = () => {
    // If user has Shift, show all 5 steps. Otherwise skip Shift screen = 4 steps
    return assessmentData.hasShiftNecklace === true ? 5 : 4;
  };

  /**
   * Progress through onboarding steps (NEW ORDER)
   */
  const nextStep = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (currentStep === 'welcome') {
      setCurrentStep('demo');
    } else if (currentStep === 'demo') {
      setCurrentStep('assessment');
    } else if (currentStep === 'assessment') {
      // Conditional: Skip Shift if user doesn't have one
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
      // Create anonymous Supabase session if not already authenticated
      let userId = user?.user_id;

      if (!userId) {
        console.log('Creating anonymous session...');
        const authResult = await signInAnonymously();

        if (!authResult.success || !authResult.userId) {
          console.error('Failed to create anonymous session:', authResult.error);
          // Fallback: continue with local-only storage
          userId = 'local_' + Date.now();
        } else {
          userId = authResult.userId;
          console.log('Anonymous session created:', userId);
        }
      }

      // Create user profile
      const newUserProfile: UserProfile = {
        user_id: userId,
        email: user?.email || '', // Anonymous users don't have email
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

      // Save to Supabase (works for both anonymous and authenticated users)
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: userId,
          name: assessmentData.name,
          age: assessmentData.age,
          quiz_score: assessmentData.quizScore,
          has_shift_necklace: assessmentData.hasShiftNecklace || false,
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
        }, {
          onConflict: 'user_id',
        });

      if (error) {
        console.error('Error saving to Supabase:', error);
      } else {
        console.log('User profile saved to database');
      }

      // Navigate to main app
      router.replace('/');
    } catch (err) {
      console.error('Error completing onboarding:', err);
    }
  };

  /**
   * Welcome Screen - Fixed layout, no scrolling
   */
  const renderWelcome = () => (
    <View className="flex-1" style={{ backgroundColor: colors.background.primary }}>
      <StatusBar style="light" />

      <TopBar />

      {/* Content - Fixed height, no scroll */}
      <View className="flex-1 px-5 justify-between" style={{ paddingTop: 20, paddingBottom: insets.bottom + 20 }}>
        <View>
          {/* Privacy Badge */}
          <View className="flex-row items-center justify-center mb-4">
            <Lock size={14} color={colors.emerald[400]} strokeWidth={2} />
            <Text className="text-xs ml-1.5" style={{ color: colors.emerald[400] }}>
              Anonymous • No signup required
            </Text>
          </View>

          {/* Headline */}
          <View className="items-center mb-6">
            <Text className="text-2xl font-semibold text-center mb-3" style={{ color: colors.text.primary }}>
              You're Not Overthinking. You're Replaying.
            </Text>
            <Text className="text-sm text-center leading-relaxed" style={{ color: colors.text.secondary }}>
              If you're still prosecuting yourself for Tuesday's conversation on Friday... you're in the right place.
            </Text>
          </View>

          {/* Value Props - Compact */}
          <View className="mb-4">
            {/* HERO: 90-second interrupt */}
            <View
              className="rounded-2xl p-4 mb-3 border-2"
              style={{
                backgroundColor: colors.background.tertiary,
                borderColor: colors.button.primary,
              }}
            >
              <View className="flex-row items-center mb-2">
                <View className="p-2.5 rounded-xl mr-3" style={{ backgroundColor: colors.button.primary + '33' }}>
                  <Clock size={24} color={colors.emerald[100]} strokeWidth={2.5} />
                </View>
                <Text className="flex-1 text-base font-bold" style={{ color: colors.text.primary }}>
                  Interrupt the loop in 90 seconds
                </Text>
              </View>
              <Text className="text-xs" style={{ color: colors.emerald[100] }}>
                That conversation isn't happening right now. But your body thinks it is. We can interrupt that.
              </Text>
            </View>

            {/* Secondary features */}
            <View className="rounded-xl p-4 mb-2 flex-row items-center" style={{ backgroundColor: colors.background.secondary }}>
              <View className="p-2 rounded-lg mr-3" style={{ backgroundColor: colors.button.primary + '20' }}>
                <Brain size={20} color={colors.emerald[400]} strokeWidth={2} />
              </View>
              <Text className="flex-1 text-sm font-medium" style={{ color: colors.text.primary }}>
                Track patterns with AI insights
              </Text>
            </View>

            <View className="rounded-xl p-4 flex-row items-center" style={{ backgroundColor: colors.background.secondary }}>
              <View className="p-2 rounded-lg mr-3" style={{ backgroundColor: colors.button.primary + '20' }}>
                <Moon size={20} color={colors.emerald[400]} strokeWidth={2} />
              </View>
              <Text className="flex-1 text-sm font-medium" style={{ color: colors.text.primary }}>
                Special 3AM mode for sleepless nights
              </Text>
            </View>
          </View>
        </View>

        {/* CTA - Bottom */}
        <Pressable
          onPress={nextStep}
          className="rounded-2xl items-center justify-center active:opacity-90"
          style={{
            backgroundColor: colors.button.primary,
            height: spacing.button.height,
          }}
        >
          <Text className="text-lg font-bold" style={{ color: colors.white }}>
            Try It Now
          </Text>
        </Pressable>
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
      <View className="flex-1 px-5 justify-between" style={{ paddingTop: 20, paddingBottom: insets.bottom + 20 }}>
        <View>
          <Text className="text-3xl font-bold mb-2" style={{ color: colors.text.primary }}>
            We Get It
          </Text>
          <Text className="text-sm mb-8 leading-relaxed" style={{ color: colors.text.secondary }}>
            Try the 90-second protocol right now. No signup. No commitment. Just relief.
          </Text>

          {/* Demo Card - Compact */}
          <View className="rounded-2xl p-6 mb-6 items-center" style={{ backgroundColor: colors.background.secondary }}>
            <View className="p-5 rounded-full mb-4" style={{ backgroundColor: colors.button.primary + '20' }}>
              <Clock size={52} color={colors.emerald[400]} strokeWidth={2} />
            </View>

            <Text className="text-xl font-bold text-center mb-3" style={{ color: colors.text.primary }}>
              Break The Loop
            </Text>

            <Text className="text-sm text-center leading-relaxed" style={{ color: colors.text.secondary }}>
              Used by 50,000+ women at 3AM. Interrupts shame-driven rumination in 90 seconds.
            </Text>
          </View>

          <Text className="text-xs text-center mb-3" style={{ color: colors.emerald[400] }}>
            Recommended - see what makes DailyHush different
          </Text>
        </View>

        {/* Buttons - Bottom */}
        <View>
          <Pressable
            onPress={() => router.push('/spiral?from=onboarding' as any)}
            className="rounded-2xl items-center justify-center active:opacity-90 mb-3"
            style={{
              backgroundColor: colors.button.primary,
              height: spacing.button.height,
            }}
          >
            <Text className="text-lg font-bold" style={{ color: colors.white }}>
              Try It Now (90 seconds)
            </Text>
          </Pressable>

          <Pressable
            onPress={nextStep}
            className="rounded-2xl items-center justify-center active:opacity-80"
            style={{ height: spacing.button.heightSmall }}
          >
            <Text className="text-base font-semibold" style={{ color: colors.text.secondary }}>
              I'll try this later
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
      style={{ backgroundColor: colors.background.primary }}
    >
      <StatusBar style="light" />

      <TopBar
        showBack
        onBackPress={previousStep}
        progressDots={{ current: 3, total: getTotalSteps() }}
      />

      {/* Content */}
      <View className="flex-1 px-5" style={{ paddingTop: 20, paddingBottom: insets.bottom + 16 }}>
        <Text className="text-2xl font-bold mb-1" style={{ color: colors.text.primary }}>
          Know Your Patterns
        </Text>
        <Text className="text-sm mb-5" style={{ color: colors.text.secondary }}>
          Optional - but this helps us help you better
        </Text>

        {/* Question 1: Age - Compact */}
        <View className="mb-4">
          <Text className="text-sm font-semibold mb-1" style={{ color: colors.text.primary }}>
            What's your age?
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
          <Text className="text-sm font-semibold mb-1" style={{ color: colors.text.primary }}>
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
                className="rounded-xl items-center justify-center"
                style={{
                  width: 56,
                  height: 56,
                  backgroundColor:
                    selectedQuizAnswer === num ? colors.button.primary : colors.background.secondary,
                }}
              >
                <Text
                  className="text-lg font-bold"
                  style={{
                    color: selectedQuizAnswer === num ? colors.white : colors.text.primary,
                  }}
                >
                  {num}
                </Text>
              </Pressable>
            ))}
          </View>
          <View className="flex-row justify-between mt-1">
            <Text className="text-xs" style={{ color: colors.text.secondary }}>Rarely</Text>
            <Text className="text-xs" style={{ color: colors.text.secondary }}>Daily</Text>
          </View>
        </View>

        {/* Question 3: Shift Necklace */}
        <View className="mb-5">
          <Text className="text-sm font-semibold mb-2" style={{ color: colors.text.primary }}>
            Do you have The Shift necklace?
          </Text>
          <View className="flex-row gap-2">
            <Pressable
              onPress={() => {
                setAssessmentData({ ...assessmentData, hasShiftNecklace: true });
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              className="flex-1 rounded-xl p-3 items-center"
              style={{
                backgroundColor:
                  assessmentData.hasShiftNecklace === true
                    ? colors.button.primary
                    : colors.background.secondary,
              }}
            >
              <Text
                className="text-sm font-semibold"
                style={{
                  color:
                    assessmentData.hasShiftNecklace === true ? colors.white : colors.text.primary,
                }}
              >
                Yes
              </Text>
            </Pressable>

            <Pressable
              onPress={() => {
                setAssessmentData({ ...assessmentData, hasShiftNecklace: false });
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              className="flex-1 rounded-xl p-3 items-center"
              style={{
                backgroundColor:
                  assessmentData.hasShiftNecklace === false
                    ? colors.button.primary
                    : colors.background.secondary,
              }}
            >
              <Text
                className="text-sm font-semibold"
                style={{
                  color:
                    assessmentData.hasShiftNecklace === false ? colors.white : colors.text.primary,
                }}
              >
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
            className="rounded-2xl items-center justify-center active:opacity-90 mb-2"
            style={{
              backgroundColor: colors.button.primary,
              height: spacing.button.height,
            }}
          >
            <Text className="text-lg font-bold" style={{ color: colors.white }}>
              Continue
            </Text>
          </Pressable>

          <Pressable
            onPress={skipAssessment}
            className="rounded-2xl items-center justify-center active:opacity-80"
            style={{ height: spacing.button.heightSmall }}
          >
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

      <TopBar
        showBack
        onBackPress={previousStep}
        progressDots={{ current: 4, total: 5 }}
      />

      {/* Content - Fixed height, no scroll */}
      <View className="flex-1 px-5 justify-between" style={{ paddingTop: 20, paddingBottom: insets.bottom + 20 }}>
        <View>
          <Text className="text-3xl font-bold mb-2" style={{ color: colors.text.primary }}>
            Pair Your Shift
          </Text>
          <Text className="text-sm mb-8" style={{ color: colors.text.secondary }}>
            Connect your Shift necklace for instant calm anywhere
          </Text>

          {/* Shift Card - Compact */}
          <View className="rounded-2xl p-6 mb-6 items-center" style={{ backgroundColor: colors.background.secondary }}>
            <View className="p-5 rounded-full mb-4" style={{ backgroundColor: colors.button.primary + '20' }}>
              <Sparkles size={52} color={colors.emerald[400]} strokeWidth={2} />
            </View>

            <Text className="text-xl font-bold text-center mb-3" style={{ color: colors.text.primary }}>
              The Shift Necklace
            </Text>

            <Text className="text-sm text-center leading-relaxed mb-5" style={{ color: colors.text.secondary }}>
              Gentle vibrations guide your breathing. Works silently, even in public.
            </Text>

            <Pressable
              onPress={() => router.push('/shift-pairing' as any)}
              className="w-full rounded-2xl p-4 items-center active:opacity-90"
              style={{ backgroundColor: colors.button.primary }}
            >
              <Text className="text-base font-bold" style={{ color: colors.white }}>
                Pair Now via Bluetooth
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Continue Button - Bottom */}
        <Pressable
          onPress={nextStep}
          className="rounded-2xl items-center justify-center active:opacity-90"
          style={{
            backgroundColor: colors.background.secondary,
            height: spacing.button.height,
          }}
        >
          <Text className="text-lg font-bold" style={{ color: colors.text.primary }}>
            I'll Pair Later
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
      style={{ backgroundColor: colors.background.primary, paddingTop: insets.top + 16 }}
    >
      <StatusBar style="light" />

      {/* Content */}
      <View className="flex-1 px-5 justify-between" style={{ paddingBottom: insets.bottom + 20 }}>
        <View>
          {/* Success Icon - Compact */}
          <View className="items-center mb-8">
            <View
              className="w-24 h-24 rounded-full items-center justify-center mb-6"
              style={{ backgroundColor: colors.background.tertiary }}
            >
              <Check size={52} color={colors.emerald[100]} strokeWidth={3} />
            </View>

            <Text className="text-3xl font-bold text-center mb-3" style={{ color: colors.text.primary }}>
              You're All Set!
            </Text>

            <Text className="text-sm text-center leading-relaxed mb-6" style={{ color: colors.text.secondary }}>
              DailyHush is ready to help you find peace of mind
            </Text>
          </View>

          {/* Name Input */}
          <View className="mb-6">
            <Text className="text-sm text-center mb-2" style={{ color: colors.text.secondary }}>
              What should we call you? (optional)
            </Text>
            <TextInput
              className="rounded-xl px-4 text-base text-center"
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
          <View className="rounded-xl p-5 mb-4" style={{ backgroundColor: colors.background.secondary }}>
            <Text className="text-sm text-center leading-relaxed" style={{ color: colors.text.primary }}>
              Tap the big "I'M SPIRALING" button anytime you need help. We'll be there in 90 seconds.
            </Text>
          </View>

          {/* Privacy Note */}
          <View className="flex-row items-center justify-center">
            <Lock size={12} color={colors.emerald[400]} strokeWidth={2} />
            <Text className="text-xs ml-1.5 text-center" style={{ color: colors.text.secondary }}>
              Your anonymous profile is saved.
            </Text>
          </View>
        </View>

        {/* Start Button - Bottom */}
        <Pressable
          onPress={completeOnboarding}
          className="rounded-2xl items-center justify-center active:opacity-90"
          style={{
            backgroundColor: colors.button.primary,
            height: spacing.button.height,
          }}
        >
          <View className="flex-row items-center">
            <Text className="text-lg font-bold mr-2" style={{ color: colors.white }}>
              Start Using DailyHush
            </Text>
            <ArrowRight size={20} color={colors.white} strokeWidth={3} />
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

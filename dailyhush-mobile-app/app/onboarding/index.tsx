/**
 * DailyHush - Onboarding Flow
 * Clean emerald design matching home page
 *
 * Flow:
 * 1. Welcome & Value Proposition
 * 2. 3-Question Quick Assessment
 * 3. Demo Spiral Interrupt (Let them try it)
 * 4. The Shift Necklace Introduction
 * 5. Complete Setup
 */

import { useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Pressable, ScrollView, TextInput } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Clock, Brain, Moon, Sparkles, Check, ArrowRight } from 'lucide-react-native';

import { Text } from '@/components/ui/text';
import { useStore } from '@/store/useStore';
import { supabase } from '@/utils/supabase';
import type { UserProfile } from '@/types';

type OnboardingStep = 'welcome' | 'assessment' | 'demo' | 'shift' | 'complete';

interface AssessmentData {
  age?: number;
  quizScore?: number;
  hasShiftNecklace?: boolean;
}

export default function Onboarding() {
  const router = useRouter();
  const params = useLocalSearchParams<{ completed?: string }>();
  const { user, setUser } = useStore();

  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [assessmentData, setAssessmentData] = useState<AssessmentData>({});
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);

  /**
   * Auto-advance when returning from demo
   */
  useEffect(() => {
    if (params.completed === 'demo' && currentStep === 'welcome') {
      // User completed the demo, advance to shift step
      setCurrentStep('shift');
    }
  }, [params.completed]);

  /**
   * Progress through onboarding steps
   */
  const nextStep = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (currentStep === 'welcome') {
      setCurrentStep('assessment');
    } else if (currentStep === 'assessment') {
      setCurrentStep('demo');
    } else if (currentStep === 'demo') {
      setCurrentStep('shift');
    } else if (currentStep === 'shift') {
      setCurrentStep('complete');
    } else if (currentStep === 'complete') {
      await completeOnboarding();
    }
  };

  /**
   * Save onboarding data and complete setup
   */
  const completeOnboarding = async () => {
    try {
      // Create user profile in local store (matching web app pattern)
      const newUserProfile: UserProfile = {
        user_id: user?.user_id || `temp_${Date.now()}`, // Temporary ID for now
        email: user?.email || 'demo@dailyhush.com',
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

      // If we have a real user, save to Supabase
      if (user?.user_id) {
        const { error } = await supabase
          .from('user_profiles')
          .update({
            age: assessmentData.age,
            quiz_score: assessmentData.quizScore,
            has_shift_necklace: assessmentData.hasShiftNecklace || false,
            onboarding_completed: true,
          })
          .eq('user_id', user.user_id);

        if (error) console.error('Error saving to Supabase:', error);
      }

      // Navigate to main app
      router.replace('/');
    } catch (err) {
      console.error('Error completing onboarding:', err);
    }
  };

  /**
   * Welcome Screen
   */
  const renderWelcome = () => (
    <View className="flex-1 bg-[#0A1612]">
      <StatusBar style="light" />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 56,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Headline */}
        <View className="items-center mb-12">
          <Text className="text-[#E8F4F0] text-2xl font-semibold text-center mb-4">
            Your Mind Deserves Peace
          </Text>
          <Text className="text-[#95B8A8] text-base text-center leading-relaxed">
            Interrupt rumination spirals in 90 seconds. Track patterns. Build lasting calm.
          </Text>
        </View>

        {/* Value Props */}
        <View className="mb-12">
          <View className="bg-[#1A4D3C] rounded-2xl p-5 mb-4 flex-row items-center">
            <View className="bg-[#40916C]/20 p-3 rounded-xl mr-4">
              <Clock size={24} color="#52B788" strokeWidth={2} />
            </View>
            <Text className="flex-1 text-[#E8F4F0] text-base font-medium leading-relaxed">
              Interrupt spirals in 90 seconds
            </Text>
          </View>

          <View className="bg-[#1A4D3C] rounded-2xl p-5 mb-4 flex-row items-center">
            <View className="bg-[#40916C]/20 p-3 rounded-xl mr-4">
              <Brain size={24} color="#52B788" strokeWidth={2} />
            </View>
            <Text className="flex-1 text-[#E8F4F0] text-base font-medium leading-relaxed">
              Understand your patterns with AI insights
            </Text>
          </View>

          <View className="bg-[#1A4D3C] rounded-2xl p-5 mb-4 flex-row items-center">
            <View className="bg-[#40916C]/20 p-3 rounded-xl mr-4">
              <Sparkles size={24} color="#52B788" strokeWidth={2} />
            </View>
            <Text className="flex-1 text-[#E8F4F0] text-base font-medium leading-relaxed">
              The Shift necklace for instant calm
            </Text>
          </View>

          <View className="bg-[#1A4D3C] rounded-2xl p-5 flex-row items-center">
            <View className="bg-[#40916C]/20 p-3 rounded-xl mr-4">
              <Moon size={24} color="#52B788" strokeWidth={2} />
            </View>
            <Text className="flex-1 text-[#E8F4F0] text-base font-medium leading-relaxed">
              Special 3AM mode for sleepless nights
            </Text>
          </View>
        </View>

        {/* CTA */}
        <Pressable
          onPress={nextStep}
          className="bg-[#40916C] h-14 rounded-2xl items-center justify-center active:opacity-90"
        >
          <Text className="text-white text-lg font-bold">
            Get Started (2 minutes)
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );

  /**
   * Assessment Screen - 3 Questions
   */
  const renderAssessment = () => (
    <View className="flex-1 bg-[#0A1612]">
      <StatusBar style="light" />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 56,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-[#E8F4F0] text-3xl font-bold mb-2">
          Quick Assessment
        </Text>
        <Text className="text-[#95B8A8] text-base mb-8">
          Help us personalize your experience (3 questions)
        </Text>

        {/* Question 1: Age */}
        <View className="mb-8">
          <Text className="text-[#E8F4F0] text-base font-semibold mb-3">
            1. What's your age?
          </Text>
          <TextInput
            placeholder="Enter your age"
            placeholderTextColor="#95B8A8"
            keyboardType="number-pad"
            value={assessmentData.age?.toString() || ''}
            onChangeText={(text) =>
              setAssessmentData({ ...assessmentData, age: parseInt(text) || undefined })
            }
            className="bg-[#1A4D3C] rounded-2xl p-4 text-[#E8F4F0] text-base"
            style={{ borderWidth: 2, borderColor: '#40916C' }}
          />
        </View>

        {/* Question 2: Rumination Severity */}
        <View className="mb-8">
          <Text className="text-[#E8F4F0] text-base font-semibold mb-3">
            2. How often do you get stuck in spiraling thoughts?
          </Text>
          <Text className="text-[#95B8A8] text-sm mb-4">
            1 = Rarely, 10 = Multiple times daily
          </Text>

          <View className="flex-row flex-wrap gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <Pressable
                key={num}
                onPress={() => {
                  setSelectedQuizAnswer(num);
                  setAssessmentData({ ...assessmentData, quizScore: num });
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
                className={`w-14 h-14 rounded-2xl items-center justify-center ${
                  selectedQuizAnswer === num ? 'bg-[#40916C]' : 'bg-[#1A4D3C]'
                }`}
              >
                <Text className={`text-xl font-bold ${
                  selectedQuizAnswer === num ? 'text-white' : 'text-[#E8F4F0]'
                }`}>
                  {num}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Question 3: Shift Necklace */}
        <View className="mb-8">
          <Text className="text-[#E8F4F0] text-base font-semibold mb-3">
            3. Do you have The Shift necklace?
          </Text>

          <View className="flex-row gap-3">
            <Pressable
              onPress={() => {
                setAssessmentData({ ...assessmentData, hasShiftNecklace: true });
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              className={`flex-1 rounded-2xl p-4 items-center ${
                assessmentData.hasShiftNecklace === true
                  ? 'bg-[#40916C]'
                  : 'bg-[#1A4D3C]'
              }`}
            >
              <Text className={`text-base font-semibold ${
                assessmentData.hasShiftNecklace === true ? 'text-white' : 'text-[#E8F4F0]'
              }`}>
                Yes
              </Text>
            </Pressable>

            <Pressable
              onPress={() => {
                setAssessmentData({ ...assessmentData, hasShiftNecklace: false });
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              className={`flex-1 rounded-2xl p-4 items-center ${
                assessmentData.hasShiftNecklace === false
                  ? 'bg-[#40916C]'
                  : 'bg-[#1A4D3C]'
              }`}
            >
              <Text className={`text-base font-semibold ${
                assessmentData.hasShiftNecklace === false ? 'text-white' : 'text-[#E8F4F0]'
              }`}>
                No
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Continue Button */}
        <Pressable
          onPress={nextStep}
          disabled={!assessmentData.age || !assessmentData.quizScore || assessmentData.hasShiftNecklace === undefined}
          className={`h-14 rounded-2xl items-center justify-center ${
            assessmentData.age && assessmentData.quizScore && assessmentData.hasShiftNecklace !== undefined
              ? 'bg-[#40916C] active:opacity-90'
              : 'bg-[#1A2E26] opacity-50'
          }`}
        >
          <Text className="text-white text-lg font-bold">
            Continue
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );

  /**
   * Demo Screen - Try the 90-second interrupt
   */
  const renderDemo = () => (
    <View className="flex-1 bg-[#0A1612]">
      <StatusBar style="light" />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 56,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-[#E8F4F0] text-3xl font-bold mb-2">
          Try It Now
        </Text>
        <Text className="text-[#95B8A8] text-base mb-12 leading-relaxed">
          Let's walk through a 90-second spiral interrupt. You can skip this if you'd like.
        </Text>

        {/* Demo Card */}
        <View className="bg-[#1A4D3C] rounded-2xl p-8 mb-8 items-center">
          <View className="bg-[#40916C]/20 p-6 rounded-full mb-6">
            <Clock size={64} color="#52B788" strokeWidth={2} />
          </View>

          <Text className="text-[#E8F4F0] text-2xl font-bold text-center mb-4">
            The Spiral Interrupt
          </Text>

          <Text className="text-[#95B8A8] text-base text-center leading-relaxed">
            When you feel yourself spiraling, tap the big button on your home screen. We'll guide you through a proven 4-step protocol.
          </Text>
        </View>

        {/* Try Demo Button */}
        <Pressable
          onPress={() => router.push('/spiral?from=onboarding' as any)}
          className="bg-[#40916C] h-14 rounded-2xl items-center justify-center active:opacity-90 mb-4"
        >
          <Text className="text-white text-lg font-bold">
            Try Demo (90 seconds)
          </Text>
        </Pressable>

        {/* Skip Button */}
        <Pressable
          onPress={nextStep}
          className="h-14 rounded-2xl items-center justify-center active:opacity-80"
        >
          <Text className="text-[#52B788] text-base font-semibold">
            Skip Demo
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );

  /**
   * Shift Necklace Introduction
   */
  const renderShift = () => (
    <View className="flex-1 bg-[#0A1612]">
      <StatusBar style="light" />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 56,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-[#E8F4F0] text-3xl font-bold mb-2">
          {assessmentData.hasShiftNecklace ? 'Pair Your Shift' : 'Meet The Shift'}
        </Text>
        <Text className="text-[#95B8A8] text-base mb-8">
          {assessmentData.hasShiftNecklace
            ? 'Connect your Shift necklace for instant calm anywhere'
            : 'A beautiful necklace that helps you breathe through spirals'}
        </Text>

        {/* Shift Card */}
        <View className="bg-[#1A4D3C] rounded-2xl p-8 mb-8 items-center">
          <View className="bg-[#40916C]/20 p-6 rounded-full mb-6">
            <Sparkles size={64} color="#52B788" strokeWidth={2} />
          </View>

          <Text className="text-[#E8F4F0] text-2xl font-bold text-center mb-4">
            The Shift Necklace
          </Text>

          <Text className="text-[#95B8A8] text-base text-center leading-relaxed mb-6">
            Wear calm around your neck. Gentle vibrations guide your breathing. Works silently, even in public.
          </Text>

          {assessmentData.hasShiftNecklace && (
            <Pressable
              onPress={() => router.push('/shift-pairing' as any)}
              className="bg-[#40916C] w-full rounded-2xl p-4 items-center active:opacity-90"
            >
              <Text className="text-white text-base font-bold">
                Pair Now via Bluetooth
              </Text>
            </Pressable>
          )}

          {!assessmentData.hasShiftNecklace && (
            <Text className="text-[#95B8A8] text-sm text-center">
              Available at dailyhush.com/shift • $129
            </Text>
          )}
        </View>

        {/* Continue Button */}
        <Pressable
          onPress={nextStep}
          className="bg-[#40916C] h-14 rounded-2xl items-center justify-center active:opacity-90"
        >
          <Text className="text-white text-lg font-bold">
            {assessmentData.hasShiftNecklace ? "I'll Pair Later" : 'Continue'}
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );

  /**
   * Complete Screen
   */
  const renderComplete = () => (
    <View className="flex-1 bg-[#0A1612]">
      <StatusBar style="light" />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 56,
          paddingBottom: 40,
          justifyContent: 'center',
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Icon */}
        <View className="items-center mb-12">
          <View className="w-32 h-32 rounded-full bg-[#2D6A4F] items-center justify-center mb-8">
            <Check size={64} color="#B7E4C7" strokeWidth={3} />
          </View>

          <Text className="text-[#E8F4F0] text-3xl font-bold text-center mb-4">
            You're All Set!
          </Text>

          <Text className="text-[#95B8A8] text-base text-center leading-relaxed">
            DailyHush is ready to help you find peace of mind.
          </Text>
        </View>

        {/* Reminder Card */}
        <View className="bg-[#1A4D3C] rounded-2xl p-6 mb-12">
          <Text className="text-[#E8F4F0] text-base text-center leading-relaxed">
            Tap the big "I'M SPIRALING" button anytime you need help. We'll be there in 90 seconds.
          </Text>
        </View>

        {/* Start Button */}
        <Pressable
          onPress={completeOnboarding}
          className="bg-[#40916C] h-14 rounded-2xl items-center justify-center active:opacity-90"
        >
          <View className="flex-row items-center">
            <Text className="text-white text-lg font-bold mr-2">
              Start Using DailyHush
            </Text>
            <ArrowRight size={20} color="white" strokeWidth={3} />
          </View>
        </Pressable>
      </ScrollView>
    </View>
  );

  /**
   * Render current step
   */
  return (
    <>
      {currentStep === 'welcome' && renderWelcome()}
      {currentStep === 'assessment' && renderAssessment()}
      {currentStep === 'demo' && renderDemo()}
      {currentStep === 'shift' && renderShift()}
      {currentStep === 'complete' && renderComplete()}
    </>
  );
}

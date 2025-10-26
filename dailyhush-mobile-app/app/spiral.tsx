/**
 * DailyHush - Spiral Interrupt Screen
 * Immersive 90-second guided protocol to interrupt rumination
 * Clean, calming design with pulsing aura and countdown
 */

import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect, useRef } from 'react';
import { View, Pressable, Animated, TextInput, KeyboardAvoidingView, Platform, ImageBackground, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Check, Play, Pause, SkipForward } from 'lucide-react-native';

import { Text } from '@/components/ui/text';
import { useStore, useShiftDevice, useUser } from '@/store/useStore';
import type { SpiralLog } from '@/types';
import { SuccessRipple } from '@/components/SuccessRipple';
import { CountdownRing } from '@/components/CountdownRing';
import { sendEncouragementNotification } from '@/services/notifications';
import { useAudio } from '@/hooks/useAudio';
import { supabase } from '@/utils/supabase';
import { withRetry } from '@/utils/retry';

type Stage = 'pre-check' | 'protocol' | 'post-check' | 'log-trigger' | 'complete';

export default function SpiralInterrupt() {
  const router = useRouter();
  const params = useLocalSearchParams<{ from?: string }>();
  const user = useUser();
  const shiftDevice = useShiftDevice();
  const { setSpiraling } = useStore();

  // Audio for meditation sound
  const audio = useAudio();

  // Stage management
  const [stage, setStage] = useState<Stage>('pre-check');
  const [preFeelingRating, setPreFeelingRating] = useState<number>(5);
  const [postFeelingRating, setPostFeelingRating] = useState<number | null>(null);
  const [selectedTrigger, setSelectedTrigger] = useState<string>('');
  const [customTriggerText, setCustomTriggerText] = useState<string>('');

  // Protocol state
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(90);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Animations
  const breatheScale = useRef(new Animated.Value(1)).current;

  const protocolSteps = [
    { duration: 5, text: "That conversation isn't happening right now.\nBut your body thinks it is.\nLet's interrupt this loop. Together." },
    { duration: 5, text: "Notice where you are\nright now.\nNot in that argument. Here." },
    { duration: 8, text: "Name 5 things\nyou can see..." },
    { duration: 8, text: "4 things\nyou can hear..." },
    { duration: 8, text: "3 things\nyou can touch..." },
    { duration: 5, text: shiftDevice?.is_connected ? "Grab your\nShift necklace" : "Take a\ndeep breath" },
    { duration: 10, text: "Breathe in slowly...\n1... 2... 3... 4..." },
    { duration: 15, text: "Breathe out slowly...\n1... 2... 3... 4... 5..." },
    { duration: 15, text: "Again...\nBreathe in... and hold..." },
    { duration: 10, text: "And out...\nslowly... all the way..." },
    { duration: 5, text: "This rumination?\nIt's a loop, not reality.\nYou're breaking the pattern." },
    { duration: 6, text: "You just interrupted it.\nThis is the skill.\nYou're building it." },
  ];

  const totalDuration = protocolSteps.reduce((sum, step) => sum + step.duration, 0);

  useEffect(() => {
    setSpiraling(true);

    // Load meditation sound
    // TODO: Add actual meditation sound file to /assets/sounds/
    // For now, this is a placeholder - the app will gracefully handle missing audio
    // Recommended: Calming ambient sound, nature sounds, or gentle meditation music
    loadMeditationSound();

    return () => {
      setSpiraling(false);
      audio.stop(); // Stop audio when leaving screen
    };
  }, []);

  const loadMeditationSound = async () => {
    try {
      // Load local meditation sound
      const audioSource = require('@/assets/sounds/meditation.mp3');

      await audio.loadAudio(audioSource, { loop: true });
      console.log('Meditation sound loaded successfully');
    } catch (err) {
      console.log('Audio loading failed - continuing without sound:', err);
    }
  };

  // Protocol timer
  useEffect(() => {
    if (stage === 'protocol' && isPlaying && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleProtocolComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [stage, isPlaying, timeRemaining]);

  // Calculate current step based on time
  useEffect(() => {
    if (stage === 'protocol') {
      const elapsed = totalDuration - timeRemaining;
      let stepDuration = 0;
      let stepIndex = 0;

      for (let i = 0; i < protocolSteps.length; i++) {
        stepDuration += protocolSteps[i].duration;
        if (elapsed < stepDuration) {
          stepIndex = i;
          break;
        }
      }

      if (stepIndex !== currentStepIndex) {
        setCurrentStepIndex(stepIndex);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }
  }, [timeRemaining, stage]);

  // Breathing animation for breathing steps
  useEffect(() => {
    if (stage === 'protocol' && isPlaying && currentStepIndex >= 6 && currentStepIndex <= 9) {
      startBreathingAnimation();
    }
  }, [stage, isPlaying, currentStepIndex]);

  const startBreathingAnimation = () => {
    Animated.loop(
      Animated.sequence([
        // Inhale (4 seconds) - reduced from 1.3 to 1.15 for subtlety
        Animated.timing(breatheScale, {
          toValue: 1.15,
          duration: 4000,
          useNativeDriver: true,
        }),
        // Hold briefly
        Animated.delay(500),
        // Exhale (10 seconds)
        Animated.timing(breatheScale, {
          toValue: 1,
          duration: 10000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const handleProtocolComplete = async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setIsPlaying(false);
    setStage('post-check');

    // Stop meditation sound
    audio.stop();
  };

  const handleFinish = async () => {
    // Save spiral log to database
    if (user?.user_id) {
      // Use custom trigger text if "Other" was selected and text was provided
      const finalTrigger = selectedTrigger === 'Other' && customTriggerText.trim()
        ? customTriggerText.trim()
        : selectedTrigger || undefined;

      const spiralLog: Partial<SpiralLog> = {
        user_id: user.user_id,
        timestamp: new Date().toISOString(),
        duration_seconds: totalDuration - timeRemaining,
        interrupted: true,
        pre_feeling: preFeelingRating,
        post_feeling: postFeelingRating || 5,
        used_shift: shiftDevice?.is_connected || false,
        technique_used: '5-4-3-2-1 + breathing',
        trigger: finalTrigger,
      };

      try {
        // Use retry logic for robust data persistence
        const { error } = await withRetry(
          async () => await supabase.from('spiral_logs').insert(spiralLog),
          {
            maxRetries: 3,
            onRetry: (attempt) => {
              console.log(`Retrying spiral log save (attempt ${attempt}/3)...`);
            }
          }
        );

        if (error) {
          console.error('Error saving spiral log after retries:', error);
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        } else {
          console.log('Spiral logged successfully:', spiralLog);
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      } catch (err) {
        console.error('Fatal error saving spiral log:', err);
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    } else {
      console.warn('No user_id found - spiral log not saved');
    }

    // Send encouragement notification (1 minute delayed)
    await sendEncouragementNotification();

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // If coming from onboarding, navigate to next onboarding step
    if (params.from === 'onboarding') {
      router.replace('/onboarding?completed=demo' as any);
    } else {
      router.back();
    }
  };

  // Pre-check options - absolute emotional states
  const preCheckOptions = [
    { value: 1, emoji: '😟', label: 'Struggling' },
    { value: 3, emoji: '😐', label: 'Anxious' },
    { value: 5, emoji: '🙂', label: 'Okay' },
    { value: 7, emoji: '😊', label: 'Calm' },
  ];

  // Post-check options - relative comparison
  const postCheckOptions = [
    { value: 1, emoji: '😟', label: 'Worse' },
    { value: 3, emoji: '😐', label: 'Same' },
    { value: 5, emoji: '🙂', label: 'Better' },
    { value: 7, emoji: '😊', label: 'Much Better' },
  ];

  const commonTriggers = [
    'Conversations',
    'Health concerns',
    'Work stress',
    'Relationships',
    'Money worries',
    'Other',
  ];

  // Progress percentage
  const progress = ((totalDuration - timeRemaining) / totalDuration) * 100;

  return (
    <View className="flex-1 bg-[#0A1612]">
      <StatusBar style="light" />

      {/* Pre-Check Stage */}
      {stage === 'pre-check' && (
        <View className="flex-1 justify-center px-6">
          <Text className="text-[#E8F4F0] text-2xl font-bold text-center mb-4">
            We're Here
          </Text>
          <Text className="text-[#95B8A8] text-base text-center mb-12">
            Before we break this together, how do you feel right now?
          </Text>

          <View className="flex-row flex-wrap justify-center gap-3 mb-12">
            {preCheckOptions.map((option) => (
              <Pressable
                key={option.value}
                onPress={() => {
                  setPreFeelingRating(option.value);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
                className="w-36 p-6 rounded-2xl items-center"
                style={{
                  backgroundColor: preFeelingRating === option.value ? '#40916C' : '#1A4D3C',
                  borderWidth: 1,
                  borderColor: preFeelingRating === option.value
                    ? 'rgba(82, 183, 136, 0.5)'
                    : 'rgba(64, 145, 108, 0.2)',
                  ...(preFeelingRating === option.value ? {
                    shadowColor: '#52B788',
                    shadowOffset: { width: 0, height: 6 },
                    shadowOpacity: 0.3,
                    shadowRadius: 12,
                    elevation: 6,
                  } : {
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 2,
                  }),
                }}
              >
                <Text className="text-5xl mb-2" style={{ lineHeight: 60, paddingTop: 4 }}>{option.emoji}</Text>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: 'Poppins_600SemiBold',
                    color: preFeelingRating === option.value ? '#FFFFFF' : '#E8F4F0',
                  }}
                >
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </View>

          <Pressable
            onPress={async () => {
              setStage('protocol');
              setIsPlaying(true);
              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

              // Start meditation sound
              audio.play();
            }}
            className="items-center justify-center active:opacity-90"
            style={{
              backgroundColor: '#40916C',
              height: 62,
              borderRadius: 100,
              shadowColor: '#52B788',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.4,
              shadowRadius: 16,
              elevation: 8,
            }}
          >
            <Text
              className="text-white"
              style={{
                fontSize: 18,
                fontFamily: 'Poppins_600SemiBold',
                letterSpacing: 0.3,
              }}
            >
              Let's Break This (90 seconds)
            </Text>
          </Pressable>
        </View>
      )}

      {/* Protocol Running Stage */}
      {stage === 'protocol' && (
        <ImageBackground
          source={require('@/assets/img/forest.png')}
          style={{ flex: 1 }}
          resizeMode="cover"
        >
          {/* Dark overlay to ensure text readability */}
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor: '#0A1612',
              opacity: 0.85, // 85% dark overlay = 15% forest visibility
            }}
          />
          <View className="flex-1 justify-between items-center px-6 py-12">
            {/* Top Section - Countdown with Progress Ring */}
            <View className="items-center justify-center" style={{ height: 300 }}>
            <View style={{ position: 'relative', width: 260, height: 260, justifyContent: 'center', alignItems: 'center' }}>
              {/* Animated progress ring */}
              <CountdownRing
                size={260}
                strokeWidth={8}
                color="#40916C"
                glowColor="#52B788"
                progress={progress}
              />

              {/* Countdown text overlay */}
              <Animated.View
                style={{
                  position: 'absolute',
                  justifyContent: 'center',
                  alignItems: 'center',
                  transform: [{ scale: breatheScale }],
                }}
              >
                <Text className="text-[#E8F4F0] text-6xl font-bold tracking-wider">
                  {timeRemaining}
                </Text>
                <Text className="text-[#95B8A8] text-sm font-normal mt-1">
                  seconds
                </Text>
                {/* Step counter integrated below countdown */}
                <Text className="text-[#95B8A8] text-xs font-medium mt-2">
                  Step {currentStepIndex + 1} of {protocolSteps.length}
                </Text>
              </Animated.View>
            </View>
          </View>

          {/* Middle Section - Current Step Text */}
          <View className="w-full px-2">
            <View
              className="bg-[#1A4D3C]/60 rounded-2xl p-6 min-h-28 justify-center border border-[#40916C]/30"
              style={{
                shadowColor: '#40916C',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.15,
                shadowRadius: 12,
                elevation: 8,
              }}
            >
              <Text className="text-[#E8F4F0] text-xl text-center leading-relaxed font-medium">
                {protocolSteps[currentStepIndex]?.text}
              </Text>
            </View>
          </View>

          {/* Bottom Section - Controls */}
          <View className="flex-row gap-3 w-full">
            <Pressable
              onPress={() => {
                const newPlayingState = !isPlaying;
                setIsPlaying(newPlayingState);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

                // Pause/resume meditation sound
                if (newPlayingState) {
                  audio.play();
                } else {
                  audio.pause();
                }
              }}
              className="flex-1 flex-row items-center justify-center active:opacity-90"
              style={{
                backgroundColor: '#1A4D3C',
                height: 62,
                borderRadius: 100,
                borderWidth: 1,
                borderColor: 'rgba(64, 145, 108, 0.3)',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              {isPlaying ? (
                <>
                  <Pause size={20} color="#E8F4F0" strokeWidth={2} />
                  <Text
                    className="text-[#E8F4F0] ml-2"
                    style={{
                      fontSize: 16,
                      fontFamily: 'Poppins_600SemiBold',
                      letterSpacing: 0.2,
                    }}
                  >
                    Pause
                  </Text>
                </>
              ) : (
                <>
                  <Play size={20} color="#E8F4F0" strokeWidth={2} />
                  <Text
                    className="text-[#E8F4F0] ml-2"
                    style={{
                      fontSize: 16,
                      fontFamily: 'Poppins_600SemiBold',
                      letterSpacing: 0.2,
                    }}
                  >
                    Resume
                  </Text>
                </>
              )}
            </Pressable>

            <Pressable
              onPress={() => {
                setStage('post-check');
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

                // Stop meditation sound when skipping
                audio.stop();
              }}
              className="flex-1 flex-row items-center justify-center active:opacity-90"
              style={{
                backgroundColor: 'transparent',
                height: 62,
                borderRadius: 100,
                borderWidth: 2,
                borderColor: '#1A4D3C',
              }}
            >
              <SkipForward size={20} color="#95B8A8" strokeWidth={2} />
              <Text
                className="ml-2"
                style={{
                  fontSize: 16,
                  fontFamily: 'Poppins_600SemiBold',
                  letterSpacing: 0.2,
                  color: '#95B8A8',
                }}
              >
                Skip
              </Text>
            </Pressable>
          </View>
          </View>
        </ImageBackground>
      )}

      {/* Post-Check Stage */}
      {stage === 'post-check' && (
        <LinearGradient
          colors={['#0A1612', '#0A1612', '#0A1612']}
          locations={[0, 0.5, 1]}
          style={{ flex: 1 }}
        >
          <View className="flex-1 px-6 pt-16">
            <View>
              <View className="mb-1 self-center">
                <SuccessRipple size={56} />
              </View>

              <Text className="text-[#E8F4F0] text-2xl font-bold text-center mb-2">
                You Just Interrupted the Loop
              </Text>
              <Text className="text-[#95B8A8] text-base text-center mb-1 leading-relaxed">
                That pattern wanted to run for 72 hours.
              </Text>
              <Text className="text-[#95B8A8] text-base text-center mb-1 leading-relaxed">
                You stopped it in 90 seconds.
              </Text>
              <Text className="text-[#95B8A8] text-sm text-center mb-5 leading-relaxed">
                How do you feel now?
              </Text>

              <View className="flex-row flex-wrap justify-center gap-3 mb-6">
                {postCheckOptions.map((option) => (
                  <Pressable
                    key={option.value}
                    onPress={() => {
                      setPostFeelingRating(option.value);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                    className="w-36 p-6 rounded-2xl items-center"
                    style={{
                      backgroundColor: postFeelingRating === option.value ? '#40916C' : '#1A4D3C',
                      borderWidth: 1,
                      borderColor: postFeelingRating === option.value
                        ? 'rgba(82, 183, 136, 0.5)'
                        : 'rgba(64, 145, 108, 0.2)',
                      ...(postFeelingRating === option.value ? {
                        shadowColor: '#52B788',
                        shadowOffset: { width: 0, height: 6 },
                        shadowOpacity: 0.3,
                        shadowRadius: 12,
                        elevation: 6,
                      } : {
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 2,
                      }),
                    }}
                  >
                    <Text className="text-5xl mb-2" style={{ lineHeight: 60, paddingTop: 4 }}>{option.emoji}</Text>
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: 'Poppins_600SemiBold',
                        color: postFeelingRating === option.value ? '#FFFFFF' : '#E8F4F0',
                      }}
                    >
                      {option.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View className="mt-6">
              <Pressable
                onPress={() => {
                  if (postFeelingRating) {
                    setStage('log-trigger');
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  }
                }}
                disabled={!postFeelingRating}
                className="items-center justify-center"
                style={{
                backgroundColor: postFeelingRating ? '#40916C' : '#1A2E26',
                height: 62,
                borderRadius: 100,
                opacity: postFeelingRating ? 1 : 0.5,
                ...(postFeelingRating && {
                  shadowColor: '#52B788',
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.4,
                  shadowRadius: 16,
                  elevation: 8,
                }),
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: 'Poppins_600SemiBold',
                  letterSpacing: 0.3,
                  color: postFeelingRating ? '#FFFFFF' : '#95B8A8',
                }}
              >
                Continue
              </Text>
            </Pressable>
            </View>
          </View>
        </LinearGradient>
      )}

      {/* Log Trigger Stage */}
      {stage === 'log-trigger' && (
        <LinearGradient
          colors={['#0A1612', '#0A1612', '#0A1612']}
          locations={[0, 0.5, 1]}
          style={{ flex: 1 }}
        >
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={0}
          >
            <View className="flex-1 justify-center px-6">
              <Text className="text-[#E8F4F0] text-2xl font-bold mb-4">
                What triggered this loop?
              </Text>
              <Text className="text-[#95B8A8] text-sm mb-8">
                Optional - but knowing your patterns helps us help you better
              </Text>

              <View className="gap-3 mb-6">
                {commonTriggers.map((trigger) => (
                  <Pressable
                    key={trigger}
                    onPress={() => {
                      setSelectedTrigger(trigger);
                      if (trigger !== 'Other') {
                        setCustomTriggerText(''); // Clear custom text if switching away from Other
                      }
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                    className="p-4 rounded-2xl"
                    style={{
                      backgroundColor: selectedTrigger === trigger ? '#40916C' : '#1A4D3C',
                      borderWidth: 1,
                      borderColor: selectedTrigger === trigger
                        ? 'rgba(82, 183, 136, 0.5)'
                        : 'rgba(64, 145, 108, 0.2)',
                      ...(selectedTrigger === trigger ? {
                        shadowColor: '#52B788',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.25,
                        shadowRadius: 10,
                        elevation: 5,
                      } : {
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 2,
                      }),
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: selectedTrigger === trigger ? 'Poppins_600SemiBold' : 'Inter_400Regular',
                        color: selectedTrigger === trigger ? '#FFFFFF' : '#E8F4F0',
                        letterSpacing: 0.2,
                      }}
                    >
                      {trigger}
                    </Text>
                  </Pressable>
                ))}
              </View>

              {/* Custom Trigger Text Input - Only show when "Other" is selected */}
              {selectedTrigger === 'Other' && (
                <View className="mb-6">
                  <Text className="text-[#95B8A8] text-sm mb-3">
                    What specifically triggered it?
                  </Text>
                  <TextInput
                    value={customTriggerText}
                    onChangeText={setCustomTriggerText}
                    placeholder="Type here (optional)..."
                    placeholderTextColor="#95B8A8"
                    multiline
                    numberOfLines={3}
                    maxLength={200}
                    style={{
                      backgroundColor: '#1A4D3C',
                      borderRadius: 16,
                      padding: 16,
                      fontSize: 16,
                      color: '#E8F4F0',
                      minHeight: 80,
                      textAlignVertical: 'top',
                    }}
                    returnKeyType="done"
                    blurOnSubmit
                  />
                  <Text className="text-[#95B8A8] text-xs mt-2 text-right">
                    {customTriggerText.length}/200
                  </Text>
                </View>
              )}

              <Pressable
                onPress={() => {
                  handleFinish();
                }}
                className="items-center justify-center active:opacity-90"
                style={{
                  backgroundColor: '#40916C',
                  height: 62,
                  borderRadius: 100,
                  shadowColor: '#52B788',
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.4,
                  shadowRadius: 16,
                  elevation: 8,
                }}
              >
                <Text
                  style={{
                    color: '#FFFFFF',
                    fontSize: 18,
                    fontFamily: 'Poppins_600SemiBold',
                    letterSpacing: 0.3,
                  }}
                >
                  Done
                </Text>
              </Pressable>
            </View>
          </KeyboardAvoidingView>
        </LinearGradient>
      )}
    </View>
  );
}

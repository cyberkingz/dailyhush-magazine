/**
 * DailyHush - Spiral Interrupt Screen
 * Immersive 90-second guided protocol to interrupt rumination
 * Clean, calming design with pulsing aura and countdown
 */

import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect, useRef } from 'react';
import { View, Pressable, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Check, Play, Pause, SkipForward } from 'lucide-react-native';

import { Text } from '@/components/ui/text';
import { useStore, useShiftDevice } from '@/store/useStore';
import type { SpiralLog } from '@/types';
import { SuccessRipple } from '@/components/SuccessRipple';
import { CountdownRing } from '@/components/CountdownRing';
import { sendEncouragementNotification } from '@/services/notifications';
import { useAudio } from '@/hooks/useAudio';

type Stage = 'pre-check' | 'protocol' | 'post-check' | 'log-trigger' | 'complete';

export default function SpiralInterrupt() {
  const router = useRouter();
  const params = useLocalSearchParams<{ from?: string }>();
  const shiftDevice = useShiftDevice();
  const { setSpiraling } = useStore();

  // Audio for meditation sound
  const audio = useAudio();

  // Stage management
  const [stage, setStage] = useState<Stage>('pre-check');
  const [preFeelingRating, setPreFeelingRating] = useState<number>(5);
  const [postFeelingRating, setPostFeelingRating] = useState<number | null>(null);
  const [selectedTrigger, setSelectedTrigger] = useState<string>('');

  // Protocol state
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(90);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Animations
  const breatheScale = useRef(new Animated.Value(1)).current;

  const protocolSteps = [
    { duration: 5, text: "You're ruminating.\nLet's interrupt this spiral." },
    { duration: 5, text: "Notice where you are\nright now." },
    { duration: 8, text: "Name 5 things\nyou can see..." },
    { duration: 8, text: "4 things\nyou can hear..." },
    { duration: 8, text: "3 things\nyou can touch..." },
    { duration: 5, text: shiftDevice?.is_connected ? "Grab your\nShift necklace" : "Take a\ndeep breath" },
    { duration: 10, text: "Breathe in slowly...\n1... 2... 3... 4..." },
    { duration: 15, text: "Breathe out slowly...\n1... 2... 3... 4... 5..." },
    { duration: 15, text: "Again...\nBreathe in... and hold..." },
    { duration: 10, text: "And out...\nslowly... all the way..." },
    { duration: 5, text: "This rumination?\nIt's a loop, not reality." },
    { duration: 6, text: "You just interrupted it.\nWell done." },
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
    // Log the spiral (will implement Supabase logging later)
    const spiralLog: Partial<SpiralLog> = {
      timestamp: new Date().toISOString(),
      duration_seconds: totalDuration - timeRemaining,
      interrupted: true,
      pre_feeling: preFeelingRating,
      post_feeling: postFeelingRating || 5,
      used_shift: shiftDevice?.is_connected || false,
      technique_used: '5-4-3-2-1 + breathing',
      trigger: selectedTrigger || undefined,
    };

    console.log('Spiral logged:', spiralLog);

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
    'Something else',
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
            Before we start
          </Text>
          <Text className="text-[#95B8A8] text-base text-center mb-12">
            How do you feel right now?
          </Text>

          <View className="flex-row flex-wrap justify-center gap-3 mb-12">
            {preCheckOptions.map((option) => (
              <Pressable
                key={option.value}
                onPress={() => {
                  setPreFeelingRating(option.value);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
                className={`w-36 p-6 rounded-2xl items-center ${
                  preFeelingRating === option.value ? 'bg-[#40916C]' : 'bg-[#1A4D3C]'
                }`}
              >
                <Text className="text-5xl mb-2" style={{ lineHeight: 60, paddingTop: 4 }}>{option.emoji}</Text>
                <Text className={`text-base font-semibold ${
                  preFeelingRating === option.value ? 'text-white' : 'text-[#E8F4F0]'
                }`}>
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
            className="bg-[#40916C] h-16 rounded-2xl items-center justify-center active:opacity-90"
          >
            <Text className="text-white text-lg font-bold">
              Start Protocol (90 seconds)
            </Text>
          </Pressable>
        </View>
      )}

      {/* Protocol Running Stage */}
      {stage === 'protocol' && (
        <LinearGradient
          colors={['#1A4D3C', '#0F2B1E', '#0A1612']}
          locations={[0, 0.3, 1]}
          style={{ flex: 1 }}
        >
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
                <Text className="text-[#95B8A8]/75 text-xs font-medium mt-2">
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
              className="flex-1 bg-[#1A4D3C] h-14 rounded-2xl flex-row items-center justify-center active:opacity-90"
            >
              {isPlaying ? (
                <>
                  <Pause size={20} color="#E8F4F0" strokeWidth={2} />
                  <Text className="text-[#E8F4F0] text-base font-semibold ml-2">
                    Pause
                  </Text>
                </>
              ) : (
                <>
                  <Play size={20} color="#E8F4F0" strokeWidth={2} />
                  <Text className="text-[#E8F4F0] text-base font-semibold ml-2">
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
              className="flex-1 bg-[#1A4D3C] h-14 rounded-2xl flex-row items-center justify-center active:opacity-90"
            >
              <SkipForward size={20} color="#E8F4F0" strokeWidth={2} />
              <Text className="text-[#E8F4F0] text-base font-semibold ml-2">
                Skip
              </Text>
            </Pressable>
          </View>
          </View>
        </LinearGradient>
      )}

      {/* Post-Check Stage */}
      {stage === 'post-check' && (
        <LinearGradient
          colors={['#0A1612', '#1A4D3C', '#0A1612']}
          locations={[0, 0.5, 1]}
          style={{ flex: 1 }}
        >
          <View className="flex-1 justify-center px-6">
            <View className="mb-8 self-center">
              <SuccessRipple size={80} />
          </View>

          <Text className="text-[#E8F4F0] text-2xl font-bold text-center mb-4">
            Spiral Interrupted!
          </Text>
          <Text className="text-[#95B8A8] text-base text-center mb-12">
            How do you feel now?
          </Text>

          <View className="flex-row flex-wrap justify-center gap-3 mb-12">
            {postCheckOptions.map((option) => (
              <Pressable
                key={option.value}
                onPress={() => {
                  setPostFeelingRating(option.value);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
                className={`w-36 p-6 rounded-2xl items-center ${
                  postFeelingRating === option.value ? 'bg-[#40916C]' : 'bg-[#1A4D3C]'
                }`}
              >
                <Text className="text-5xl mb-2" style={{ lineHeight: 60, paddingTop: 4 }}>{option.emoji}</Text>
                <Text className={`text-base font-semibold ${
                  postFeelingRating === option.value ? 'text-white' : 'text-[#E8F4F0]'
                }`}>
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </View>

          <Pressable
            onPress={() => {
              if (postFeelingRating) {
                setStage('log-trigger');
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              }
            }}
            disabled={!postFeelingRating}
            className={`h-16 rounded-2xl items-center justify-center ${
              postFeelingRating ? 'bg-[#40916C] active:opacity-90' : 'bg-[#1A2E26] opacity-50'
            }`}
          >
            <Text className={`text-lg font-bold ${
              postFeelingRating ? 'text-white' : 'text-[#95B8A8]'
            }`}>
              Continue
            </Text>
          </Pressable>
          </View>
        </LinearGradient>
      )}

      {/* Log Trigger Stage */}
      {stage === 'log-trigger' && (
        <View className="flex-1 justify-center px-6" style={{ backgroundColor: '#0A1612' }}>
          <Text className="text-[#E8F4F0] text-2xl font-bold mb-4">
            What started this spiral?
          </Text>
          <Text className="text-[#95B8A8] text-sm mb-8">
            Optional - helps us identify your patterns
          </Text>

          <View className="gap-3 mb-8">
            {commonTriggers.map((trigger) => (
              <Pressable
                key={trigger}
                onPress={() => {
                  setSelectedTrigger(trigger);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
                className={`p-4 rounded-2xl ${
                  selectedTrigger === trigger ? 'bg-[#40916C]' : 'bg-[#1A4D3C]'
                }`}
              >
                <Text className={`text-base ${
                  selectedTrigger === trigger ? 'text-white font-semibold' : 'text-[#E8F4F0]'
                }`}>
                  {trigger}
                </Text>
              </Pressable>
            ))}
          </View>

          <View className="gap-3">
            <Pressable
              onPress={() => {
                handleFinish();
              }}
              className="bg-[#40916C] h-16 rounded-2xl items-center justify-center active:opacity-90"
            >
              <Text className="text-white text-lg font-bold">
                Done
              </Text>
            </Pressable>

            <Pressable
              onPress={() => {
                setSelectedTrigger('');
                handleFinish();
              }}
              className="h-14 rounded-2xl items-center justify-center active:opacity-80"
            >
              <Text className="text-[#52B788] text-base font-semibold">
                Skip
              </Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

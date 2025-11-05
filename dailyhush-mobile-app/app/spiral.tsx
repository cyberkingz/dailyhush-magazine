/**
 * DailyHush - Spiral Interrupt Screen
 * Immersive 90-second guided protocol to interrupt rumination
 * Clean, calming design with pulsing aura and countdown
 */

import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect, useRef } from 'react';
import {
  View,
  Pressable,
  Animated,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Play, Pause, SkipForward, ArrowLeft, CloudRain, Zap, CloudSun, Sun, Check, Wind, Volume2, VolumeX } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AnimatedReanimated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';

import { Text } from '@/components/ui/text';
import { useStore, useShiftDevice, useUser } from '@/store/useStore';
import type { SpiralLog } from '@/types';
import { SuccessRipple } from '@/components/SuccessRipple';
import { CountdownRing } from '@/components/CountdownRing';
import { sendEncouragementNotification } from '@/services/notifications';
import { useAudio } from '@/hooks/useAudio';
import { supabase } from '@/utils/supabase';
import { withRetry } from '@/utils/retry';
import { useAnalytics } from '@/utils/analytics';
import { colors } from '@/constants/colors';
import { SPACING, RADIUS } from '@/constants/design-tokens';

type Stage = 'pre-check' | 'protocol' | 'post-check' | 'log-trigger' | 'complete';

export default function SpiralInterrupt() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    from?: string;
    preFeelingRating?: string;
    source?: string;
  }>();
  const user = useUser();
  const shiftDevice = useShiftDevice();
  const { setSpiraling } = useStore();
  const insets = useSafeAreaInsets();
  const analytics = useAnalytics();

  // Audio for meditation sound
  const audio = useAudio();

  // Stage management
  // If coming from Anna with a pre-feeling rating, skip directly to protocol
  const initialStage: Stage = params.preFeelingRating ? 'protocol' : 'pre-check';
  const initialPreFeeling = params.preFeelingRating
    ? parseInt(params.preFeelingRating, 10)
    : 5;

  const [stage, setStage] = useState<Stage>(initialStage);
  const [preFeelingRating, setPreFeelingRating] = useState<number>(initialPreFeeling);
  const [postFeelingRating, setPostFeelingRating] = useState<number | null>(null);
  const [selectedTrigger, setSelectedTrigger] = useState<string>('');
  const [customTriggerText, setCustomTriggerText] = useState<string>('');

  // Protocol state
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(90);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [audioMuted, setAudioMuted] = useState(false);

  // Animations
  const breatheScale = useRef(new Animated.Value(1)).current;

  // Breathing animation for background glow (react-native-reanimated)
  const breathGlowOpacity = useSharedValue(0.3);

  // Breathing orb animation for breathing steps (6-9)
  const breathOrbScale = useSharedValue(1);

  const protocolSteps = [
    {
      duration: 5,
      text: "That conversation isn't happening right now.\nBut your body thinks it is.\nLet's interrupt this loop. Together.",
    },
    { duration: 5, text: 'Notice where you are\nright now.\nNot in that argument. Here.' },
    { duration: 8, text: 'Name 5 things\nyou can see...' },
    { duration: 8, text: '4 things\nyou can hear...' },
    { duration: 8, text: '3 things\nyou can touch...' },
    {
      duration: 5,
      text: shiftDevice?.is_connected ? 'Grab your\nShift necklace' : 'Take a\ndeep breath',
    },
    { duration: 10, text: 'Breathe in slowly...\n1... 2... 3... 4...' },
    { duration: 15, text: 'Breathe out slowly...\n1... 2... 3... 4... 5...' },
    { duration: 15, text: 'Again...\nBreathe in... and hold...' },
    { duration: 10, text: 'And out...\nslowly... all the way...' },
    {
      duration: 5,
      text: "This rumination?\nIt's a loop, not reality.\nYou're breaking the pattern.",
    },
    { duration: 6, text: "You just interrupted it.\nThis is the skill.\nYou're building it." },
  ];

  const totalDuration = protocolSteps.reduce((sum, step) => sum + step.duration, 0);

  useEffect(() => {
    setSpiraling(true);

    // Track spiral start
    const eventData = params.source === 'anna'
      ? { source: 'anna', pre_feeling: initialPreFeeling }
      : {};
    analytics.track('SPIRAL_STARTED', eventData);

    // Load meditation sound
    // TODO: Add actual meditation sound file to /assets/sounds/
    // For now, this is a placeholder - the app will gracefully handle missing audio
    // Recommended: Calming ambient sound, nature sounds, or gentle meditation music
    loadMeditationSound();

    // If coming from Anna, auto-start the protocol
    if (params.source === 'anna' && params.preFeelingRating) {
      setIsPlaying(true);
      // Delay audio start slightly to ensure it's loaded
      setTimeout(() => {
        audio.play();
      }, 100);
    }

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

  // Subtle icon breathing animation (pre-check stage only)
  useEffect(() => {
    if (stage === 'pre-check') {
      breathGlowOpacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 2500, easing: Easing.bezier(0.4, 0, 0.2, 1) }),
          withTiming(0.6, { duration: 2500, easing: Easing.bezier(0.4, 0, 0.2, 1) })
        ),
        -1,
        false
      );
    }
  }, [stage]);

  const breathGlowStyle = useAnimatedStyle(() => ({
    opacity: breathGlowOpacity.value,
  }));

  // Breathing orb animation for breathing steps (6-9)
  useEffect(() => {
    if (stage === 'protocol' && isPlaying && currentStepIndex >= 6 && currentStepIndex <= 9) {
      const step = protocolSteps[currentStepIndex];
      const isInhale = step.text.toLowerCase().includes('breathe in');
      const duration = step.duration * 1000; // Convert to milliseconds

      // Animate based on step type
      if (isInhale) {
        // Inhale: expand
        breathOrbScale.value = withRepeat(
          withTiming(1.3, {
            duration: duration / 2,
            easing: Easing.bezier(0.4, 0, 0.2, 1)
          }),
          2, // Repeat twice per step
          true // Reverse
        );
      } else {
        // Exhale: contract
        breathOrbScale.value = withRepeat(
          withTiming(0.7, {
            duration: duration / 2,
            easing: Easing.bezier(0.4, 0, 0.2, 1)
          }),
          2, // Repeat twice per step
          true // Reverse
        );
      }
    } else {
      // Reset to normal size when not in breathing steps
      breathOrbScale.value = withTiming(1, { duration: 500 });
    }
  }, [stage, isPlaying, currentStepIndex]);

  const breathOrbStyle = useAnimatedStyle(() => ({
    transform: [{ scale: breathOrbScale.value }],
  }));

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

    // Stop meditation sound
    audio.stop();

    // If coming from Anna, navigate directly back to conversation (survey will come after)
    if (params.source === 'anna') {
      analytics.track('SPIRAL_COMPLETED_FROM_ANNA', {
        pre_feeling: preFeelingRating,
      });

      router.push({
        pathname: '/anna/conversation',
        params: {
          preFeelingScore: preFeelingRating.toString(),
          fromExercise: 'true',
          surveyPending: 'true', // Flag to show survey after victory message
        },
      } as any);
    } else {
      // For non-Anna flows, continue to post-check as before
      setStage('post-check');
    }
  };

  const handleFinish = async () => {
    // Save spiral log to database
    if (user?.user_id) {
      // Use custom trigger text if "Other" was selected and text was provided
      const finalTrigger =
        selectedTrigger === 'Other' && customTriggerText.trim()
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
            },
          }
        );

        if (error) {
          console.error('Error saving spiral log after retries:', error);
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        } else {
          console.log('Spiral logged successfully:', spiralLog);
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

          // Track spiral completion
          analytics.track('SPIRAL_INTERRUPTED');
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

    // If coming from Anna, navigate back to conversation with post-feeling score
    if (params.source === 'anna') {
      analytics.track('SPIRAL_COMPLETED_FROM_ANNA', {
        pre_feeling: preFeelingRating,
        post_feeling: postFeelingRating || 5,
        reduction: preFeelingRating - (postFeelingRating || 5),
      });

      router.push({
        pathname: '/anna/conversation',
        params: {
          preFeelingScore: preFeelingRating.toString(),
          postFeelingScore: (postFeelingRating || 5).toString(),
          fromExercise: 'true',
        },
      } as any);
    }
    // If coming from onboarding, navigate to next onboarding step
    else if (params.from === 'onboarding') {
      router.replace('/onboarding?completed=demo' as any);
    }
    // Otherwise, go back to previous screen
    else {
      router.back();
    }
  };

  // Pre-check options - thought intensity levels with weather metaphor icons
  const preCheckOptions = [
    {
      value: 1,
      icon: CloudRain,
      label: "Can't stop them",
      subtitle: "They're taking over",
    },
    {
      value: 3,
      icon: Zap,
      label: 'Very strong',
      subtitle: "Loud but I'm still here",
    },
    {
      value: 5,
      icon: CloudSun,
      label: 'Getting louder',
      subtitle: 'Starting to speed up',
    },
    {
      value: 7,
      icon: Sun,
      label: 'Just started',
      subtitle: 'I caught it early',
    },
  ];

  // Post-check options - relative comparison (animated WebP)
  const postCheckOptions = [
    {
      value: 1,
      emoji:
        'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Telegram-Animated-Emojis/main/Smileys/Worried%20Face.webp',
      label: 'Worse',
    },
    {
      value: 3,
      emoji:
        'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Telegram-Animated-Emojis/main/Smileys/Neutral%20Face.webp',
      label: 'Same',
    },
    {
      value: 5,
      emoji:
        'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Telegram-Animated-Emojis/main/Smileys/Slightly%20Smiling%20Face.webp',
      label: 'Better',
    },
    {
      value: 7,
      emoji:
        'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Telegram-Animated-Emojis/main/Smileys/Smiling%20Face%20With%20Smiling%20Eyes.webp',
      label: 'Much Better',
    },
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
    <View className="flex-1 bg-background-primary">
      <StatusBar style="light" />

      {/* Pre-Check Stage */}
      {stage === 'pre-check' && (
        <LinearGradient
          colors={[colors.background.primary, colors.background.secondary, colors.background.primary]}
          locations={[0, 0.5, 1]}
          style={{ flex: 1 }}>
          {/* Header */}
          <View
            style={{
              paddingTop: insets.top + 8,
              paddingBottom: 12,
              paddingHorizontal: 20,
            }}>
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.back();
              }}
              accessibilityLabel="Go back"
              accessibilityHint="Returns to the previous screen"
              style={({ pressed }) => ({
                width: 44,
                height: 44,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 22,
                backgroundColor: pressed ? colors.lime[600] + '40' : colors.lime[600] + '26',
                borderWidth: 1,
                borderColor: colors.lime[500] + '4D',
              })}>
              <ArrowLeft size={20} color={colors.text.primary} strokeWidth={2.5} />
            </Pressable>
          </View>
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              paddingHorizontal: 24,
              paddingBottom: insets.bottom + 24,
            }}
            showsVerticalScrollIndicator={false}>
            {/* Minimalist "We're Here" Section */}
            <View style={{ marginBottom: SPACING.xl, alignItems: 'center' }}>
              {/* Compact Wind icon badge */}
              <View style={{ marginBottom: SPACING.md }}>
                <View
                  style={{
                    height: 56,
                    width: 56,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 16,
                    backgroundColor: colors.lime[500],
                  }}>
                  <Wind size={28} color={colors.background.primary} strokeWidth={2.5} />
                </View>
              </View>
              {/* Title */}
              <Text
                style={{
                  fontSize: 28,
                  fontFamily: 'Poppins_700Bold',
                  letterSpacing: 0.3,
                  lineHeight: 36,
                  color: colors.text.primary,
                  textAlign: 'center',
                  marginBottom: SPACING.sm,
                }}>
                You&apos;re safe. Let&apos;s slow this down.
              </Text>
              {/* Subtitle */}
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: 'Poppins_400Regular',
                  lineHeight: 24,
                  color: colors.text.secondary,
                  textAlign: 'center',
                  paddingHorizontal: SPACING.lg,
                  marginBottom: SPACING.xl,
                }}>
                How strong are the thoughts right now?
              </Text>
            </View>
            {/* Intensity selection - vertical stack */}
            <View style={{ width: '100%', maxWidth: 480, alignSelf: 'center', paddingHorizontal: SPACING.lg }}>
              {preCheckOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = preFeelingRating === option.value;
                return (
                  <Pressable
                    key={option.value}
                    onPress={() => {
                      setPreFeelingRating(option.value);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                    accessibilityLabel={`Select ${option.label} intensity level`}
                    accessibilityHint={option.subtitle}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    style={{
                      height: 100,
                      borderRadius: RADIUS.lg,
                      marginBottom: SPACING.lg,
                      paddingHorizontal: SPACING.xl,
                      paddingVertical: SPACING.lg,
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: isSelected ? colors.lime[600] + '20' : colors.background.card,
                      borderWidth: 1.5,
                      borderColor: isSelected ? colors.lime[500] + '80' : colors.lime[600] + '15',
                      ...(isSelected
                        ? {
                            shadowColor: colors.lime[500],
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.25,
                            shadowRadius: 12,
                            elevation: 4,
                          }
                        : {
                            shadowColor: colors.background.primary,
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.15,
                            shadowRadius: 6,
                            elevation: 2,
                          }),
                    }}>
                    {/* Icon Badge */}
                    <View
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: RADIUS.lg,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: colors.lime[500],
                        marginRight: SPACING.xl,
                      }}>
                      <Icon
                        size={32}
                        color={colors.background.primary}
                        strokeWidth={2.5}
                      />
                    </View>

                    {/* Text Content */}
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 18,
                          fontFamily: 'Poppins_600SemiBold',
                          lineHeight: 26,
                          color: isSelected ? colors.lime[300] : colors.text.primary,
                          marginBottom: 4,
                        }}>
                        {option.label}
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                          fontFamily: 'Poppins_400Regular',
                          lineHeight: 20,
                          color: colors.text.secondary,
                        }}>
                        {option.subtitle}
                      </Text>
                    </View>

                    {/* Selection Indicator */}
                    {isSelected && (
                      <View
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 14,
                          backgroundColor: colors.lime[500],
                          alignItems: 'center',
                          justifyContent: 'center',
                          shadowColor: colors.lime[500],
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.4,
                          shadowRadius: 4,
                          elevation: 2,
                        }}>
                        <Check size={18} color={colors.background.primary} strokeWidth={3} />
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </View>
            {/* Spacer between grid and CTA button */}
            <View style={{ height: SPACING.xxxl }} />
            <Pressable
              onPress={async () => {
                setStage('protocol');
                setIsPlaying(true);
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                audio.play();
              }}
              accessibilityLabel="Start 90-second protocol"
              accessibilityRole="button"
              accessibilityHint="Starts the guided breathing and mindfulness exercise"
              className="items-center justify-center active:opacity-90"
              style={{
                backgroundColor: colors.lime[500],
                height: 64,
                borderRadius: RADIUS.full,
                shadowColor: colors.lime[500],
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.4,
                shadowRadius: 16,
                elevation: 8,
                paddingHorizontal: SPACING.xxl,
              }}>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: 'Poppins_600SemiBold',
                  letterSpacing: 0.3,
                  color: colors.button.primaryText,
                }}>
                Let&apos;s Break This (90 seconds)
              </Text>
            </Pressable>
          </ScrollView>
        </LinearGradient>
      )}

      {/* Protocol Running Stage */}
      {stage === 'protocol' && (
        <LinearGradient
          colors={[
            colors.background.primary,
            colors.lime[900] + '15',
            colors.background.primary,
          ]}
          locations={[0, 0.4, 1]}
          style={{ flex: 1 }}>
          {/* Subtle radial overlay for depth */}
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'transparent',
              opacity: 0.3,
            }}>
            <LinearGradient
              colors={[
                colors.lime[600] + '00',
                colors.lime[600] + '20',
                colors.lime[600] + '00',
              ]}
              start={{ x: 0.5, y: 0.2 }}
              end={{ x: 0.5, y: 0.8 }}
              style={{ flex: 1 }}
            />
          </View>

          {/* Audio Mute Toggle - Top Right */}
          <Pressable
            onPress={() => {
              const newMutedState = !audioMuted;
              setAudioMuted(newMutedState);
              if (newMutedState) {
                audio.pause();
              } else if (isPlaying) {
                audio.play();
              }
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
            accessibilityLabel={audioMuted ? 'Unmute audio' : 'Mute audio'}
            accessibilityRole="button"
            style={{
              position: 'absolute',
              top: insets.top + 16,
              right: 16,
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: colors.lime[800] + '40',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
            }}>
            {audioMuted ? (
              <VolumeX size={20} color={colors.text.muted} strokeWidth={2.5} />
            ) : (
              <Volume2 size={20} color={colors.lime[500]} strokeWidth={2.5} />
            )}
          </Pressable>

          <View className="flex-1 items-center justify-between px-6 py-12">
            {/* Top Section - Countdown with Progress Ring */}
            <View className="items-center justify-center" style={{ height: 300, overflow: 'visible' }}>
              <View
                style={{
                  position: 'relative',
                  width: 260,
                  height: 260,
                  justifyContent: 'center',
                  alignItems: 'center',
                  overflow: 'visible',
                }}>
                {/* Outer glow layer */}
                <View
                  style={{
                    position: 'absolute',
                    width: 280,
                    height: 280,
                    borderRadius: 140,
                    backgroundColor: colors.lime[500] + '10',
                    shadowColor: colors.lime[500],
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.4,
                    shadowRadius: 40,
                  }}
                />

                {/* Animated progress ring */}
                <CountdownRing
                  size={260}
                  strokeWidth={8}
                  color={colors.lime[600]}
                  glowColor={colors.lime[500]}
                  progress={progress}
                />

                {/* Breathing orb visual guide - only visible during breathing steps */}
                {currentStepIndex >= 6 && currentStepIndex <= 9 && (
                  <AnimatedReanimated.View
                    style={[
                      {
                        position: 'absolute',
                        width: 180,
                        height: 180,
                        borderRadius: 90,
                        backgroundColor: colors.lime[600] + '15',
                        borderWidth: 2,
                        borderColor: colors.lime[500] + '40',
                      },
                      breathOrbStyle,
                    ]}
                  />
                )}

                {/* Countdown text overlay */}
                <Animated.View
                  style={{
                    position: 'absolute',
                    justifyContent: 'center',
                    alignItems: 'center',
                    transform: [{ scale: breatheScale }],
                  }}>
                  <Text
                    style={{
                      fontSize: 60,
                      fontFamily: 'Poppins_700Bold',
                      fontWeight: '700',
                      lineHeight: 72,
                      letterSpacing: 0.5,
                      color: colors.text.primary,
                      textShadowColor: colors.lime[500] + '30',
                      textShadowOffset: { width: 0, height: 2 },
                      textShadowRadius: 8,
                    }}>
                    {timeRemaining}
                  </Text>
                  <Text
                    style={{
                      marginTop: 4,
                      fontSize: 14,
                      fontFamily: 'Poppins_400Regular',
                      letterSpacing: 0.5,
                      color: colors.lime[400],
                    }}>
                    seconds
                  </Text>
                  {/* Ambient progress - minimal step counter */}
                  <View
                    style={{
                      marginTop: 12,
                      width: 120,
                      height: 3,
                      borderRadius: 2,
                      backgroundColor: colors.lime[800] + '40',
                      overflow: 'hidden',
                    }}>
                    <View
                      style={{
                        width: `${((currentStepIndex + 1) / protocolSteps.length) * 100}%`,
                        height: '100%',
                        backgroundColor: colors.lime[500],
                      }}
                    />
                  </View>
                </Animated.View>
              </View>
            </View>

            {/* Middle Section - Current Step Text */}
            <View className="w-full px-2">
              <View
                style={{
                  minHeight: 112,
                  justifyContent: 'center',
                  borderRadius: RADIUS.lg,
                  padding: 24,
                  backgroundColor: colors.lime[700] + '20',
                  borderWidth: 1.5,
                  borderColor: colors.lime[600] + '30',
                  shadowColor: colors.lime[500],
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.2,
                  shadowRadius: 16,
                  elevation: 6,
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 20,
                    fontFamily: 'Poppins_500Medium',
                    lineHeight: 30,
                    color: colors.text.primary,
                    letterSpacing: 0.3,
                  }}>
                  {protocolSteps[currentStepIndex]?.text}
                </Text>
              </View>
            </View>

            {/* Bottom Section - Controls */}
            <View className="w-full flex-row gap-3">
              <Pressable
                onPress={() => {
                  const newPlayingState = !isPlaying;
                  setIsPlaying(newPlayingState);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

                  // Pause/resume meditation sound (respect mute state)
                  if (newPlayingState && !audioMuted) {
                    audio.play();
                  } else {
                    audio.pause();
                  }
                }}
                className="flex-1 flex-row items-center justify-center active:opacity-90"
                style={{
                  backgroundColor: colors.lime[700] + '25',
                  height: 62,
                  borderRadius: RADIUS.full,
                  borderWidth: 1.5,
                  borderColor: colors.lime[500] + '30',
                  shadowColor: colors.lime[600],
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 8,
                  elevation: 3,
                }}>
                {isPlaying ? (
                  <>
                    <Pause size={20} color={colors.lime[400]} strokeWidth={2.5} />
                    <Text
                      style={{
                        marginLeft: 8,
                        fontSize: 16,
                        fontFamily: 'Poppins_600SemiBold',
                        letterSpacing: 0.3,
                        color: colors.lime[400],
                      }}>
                      Pause
                    </Text>
                  </>
                ) : (
                  <>
                    <Play size={20} color={colors.lime[400]} strokeWidth={2.5} />
                    <Text
                      style={{
                        marginLeft: 8,
                        fontSize: 16,
                        fontFamily: 'Poppins_600SemiBold',
                        letterSpacing: 0.3,
                        color: colors.lime[400],
                      }}>
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
                  borderRadius: RADIUS.full,
                  borderWidth: 1.5,
                  borderColor: colors.lime[700] + '40',
                }}>
                <SkipForward size={20} color={colors.text.secondary} strokeWidth={2.5} />
                <Text
                  style={{
                    marginLeft: 8,
                    fontSize: 16,
                    fontFamily: 'Poppins_600SemiBold',
                    letterSpacing: 0.3,
                    color: colors.text.secondary,
                  }}>
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
          colors={[colors.background.primary, colors.background.primary, colors.background.primary]}
          locations={[0, 0.5, 1]}
          style={{ flex: 1 }}>
          <View className="flex-1 px-6 pt-16">
            <View>
              <View className="mb-1 self-center">
                <SuccessRipple size={56} />
              </View>

              <Text
                className="mb-2 text-center text-2xl font-bold"
                style={{ color: colors.text.primary }}>
                You Just Interrupted the Loop
              </Text>
              <Text
                className="mb-1 text-center text-base leading-relaxed"
                style={{ color: colors.text.muted }}>
                That pattern wanted to run for 72 hours.
              </Text>
              <Text
                className="mb-1 text-center text-base leading-relaxed"
                style={{ color: colors.text.muted }}>
                You stopped it in 90 seconds.
              </Text>
              <Text
                className="mb-5 text-center text-sm leading-relaxed"
                style={{ color: colors.text.muted }}>
                How do you feel now?
              </Text>

              <View className="mb-6 flex-row flex-wrap justify-center gap-3">
                {postCheckOptions.map((option) => (
                  <Pressable
                    key={option.value}
                    onPress={() => {
                      setPostFeelingRating(option.value);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                    className="w-36 items-center rounded-2xl p-6"
                    style={{
                      backgroundColor: postFeelingRating === option.value ? colors.lime[600] : colors.lime[800] + '40',
                      borderWidth: 1,
                      borderColor:
                        postFeelingRating === option.value
                          ? colors.lime[500] + '80'
                          : colors.lime[600] + '33',
                      ...(postFeelingRating === option.value
                        ? {
                            shadowColor: colors.lime[500],
                            shadowOffset: { width: 0, height: 6 },
                            shadowOpacity: 0.3,
                            shadowRadius: 12,
                            elevation: 6,
                          }
                        : {
                            shadowColor: colors.background.primary,
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.3,
                            shadowRadius: 4,
                            elevation: 2,
                          }),
                    }}>
                    <Image
                      source={{ uri: option.emoji }}
                      style={{ width: 56, height: 56, marginBottom: 8 }}
                      contentFit="contain"
                    />
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: 'Poppins_600SemiBold',
                        color: postFeelingRating === option.value ? colors.button.primaryText : colors.text.primary,
                      }}>
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
                  backgroundColor: postFeelingRating ? colors.lime[600] : colors.background.muted,
                  height: 62,
                  borderRadius: 100,
                  opacity: postFeelingRating ? 1 : 0.5,
                  ...(postFeelingRating && {
                    shadowColor: colors.lime[500],
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.4,
                    shadowRadius: 16,
                    elevation: 8,
                  }),
                }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: 'Poppins_600SemiBold',
                    letterSpacing: 0.3,
                    color: postFeelingRating ? colors.white : colors.text.muted,
                  }}>
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
          colors={[colors.background.primary, colors.background.primary, colors.background.primary]}
          locations={[0, 0.5, 1]}
          style={{ flex: 1 }}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={0}>
            <View className="flex-1 justify-center px-6">
              <Text
                className="mb-4 text-2xl font-bold"
                style={{ color: colors.text.primary }}>
                What triggered this loop?
              </Text>
              <Text
                className="mb-8 text-sm"
                style={{ color: colors.text.muted }}>
                Optional - but knowing your patterns helps us help you better
              </Text>

              <View className="mb-6 gap-3">
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
                    className="rounded-2xl p-4"
                    style={{
                      backgroundColor: selectedTrigger === trigger ? colors.lime[600] : colors.lime[800] + '40',
                      borderWidth: 1,
                      borderColor:
                        selectedTrigger === trigger
                          ? colors.lime[500] + '80'
                          : colors.lime[600] + '33',
                      ...(selectedTrigger === trigger
                        ? {
                            shadowColor: colors.lime[500],
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.25,
                            shadowRadius: 10,
                            elevation: 5,
                          }
                        : {
                            shadowColor: colors.background.primary,
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.3,
                            shadowRadius: 4,
                            elevation: 2,
                          }),
                    }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily:
                          selectedTrigger === trigger ? 'Poppins_600SemiBold' : 'Inter_400Regular',
                        color: selectedTrigger === trigger ? colors.button.primaryText : colors.text.primary,
                        letterSpacing: 0.2,
                      }}>
                      {trigger}
                    </Text>
                  </Pressable>
                ))}
              </View>

              {/* Custom Trigger Text Input - Only show when "Other" is selected */}
              {selectedTrigger === 'Other' && (
                <View className="mb-6">
                  <Text
                    className="mb-3 text-sm"
                    style={{ color: colors.text.muted }}>
                    What specifically triggered it?
                  </Text>
                  <TextInput
                    value={customTriggerText}
                    onChangeText={setCustomTriggerText}
                    placeholder="Type here (optional)..."
                    placeholderTextColor={colors.text.muted}
                    multiline
                    numberOfLines={3}
                    maxLength={200}
                    style={{
                      backgroundColor: colors.lime[800] + '40',
                      borderRadius: 16,
                      padding: 16,
                      fontSize: 16,
                      color: colors.text.primary,
                      minHeight: 80,
                      textAlignVertical: 'top',
                    }}
                    returnKeyType="done"
                    blurOnSubmit
                  />
                  <Text
                    className="mt-2 text-right text-xs"
                    style={{ color: colors.text.muted }}>
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
                  backgroundColor: colors.lime[600],
                  height: 62,
                  borderRadius: 100,
                  shadowColor: colors.lime[500],
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.4,
                  shadowRadius: 16,
                  elevation: 8,
                }}>
                <Text
                  style={{
                    color: colors.button.primaryText,
                    fontSize: 18,
                    fontFamily: 'Poppins_600SemiBold',
                    letterSpacing: 0.3,
                  }}>
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

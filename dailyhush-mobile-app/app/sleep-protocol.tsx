/**
 * DailyHush - Return to Sleep Protocol
 * Guided audio protocol to help users fall back asleep at 3AM
 */

import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect, useRef } from 'react';
import { View, Pressable, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Moon, X, Volume2, VolumeX } from 'lucide-react-native';
import { Audio } from 'expo-av';

import { Text } from '@/components/ui/text';
import { ScrollFadeView } from '@/components/ScrollFadeView';

export default function SleepProtocol() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Red-light color palette for 3AM
  const redBackground = '#1A0A0A';
  const redSurface = '#2A1515';
  const redText = '#FFB8B8';
  const redMuted = '#CC8888';

  const [step, setStep] = useState<'intro' | 'breathing' | 'body-scan' | 'complete'>('intro');
  const [breathCount, setBreathCount] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Gentle breathing animation (4 seconds in, 4 seconds out)
  useEffect(() => {
    if (step === 'breathing') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 4000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 4000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [step]);

  // Fade in on mount
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  // Cleanup audio
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const handleClose = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
    }
    router.back();
  };

  const handleStartBreathing = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setStep('breathing');
    setBreathCount(0);

    // Count breaths (8 seconds per breath = 7.5 breaths per minute)
    const breathTimer = setInterval(() => {
      setBreathCount((prev) => {
        const next = prev + 1;
        if (next >= 10) {
          // After 10 breaths (~80 seconds), move to body scan
          clearInterval(breathTimer);
          setStep('body-scan');
        }
        return next;
      });
    }, 8000);
  };

  const handleStartBodyScan = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Simulate progressive relaxation for 60 seconds
    setTimeout(() => {
      setStep('complete');
    }, 60000);
  };

  const handleComplete = async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
  };

  return (
    <View style={{ flex: 1, backgroundColor: redBackground }}>
      <StatusBar style="light" />

      {/* Close Button - Top Right */}
      <View
        style={{
          position: 'absolute',
          top: insets.top + 16,
          right: 20,
          zIndex: 10,
        }}
      >
        <Pressable
          onPress={handleClose}
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: redSurface,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: redMuted,
          }}
        >
          <X size={24} color={redText} strokeWidth={2} />
        </Pressable>
      </View>

      {/* Mute Toggle - Top Left */}
      <View
        style={{
          position: 'absolute',
          top: insets.top + 16,
          left: 20,
          zIndex: 10,
        }}
      >
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setIsMuted(!isMuted);
          }}
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: redSurface,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: redMuted,
          }}
        >
          {isMuted ? (
            <VolumeX size={24} color={redText} strokeWidth={2} />
          ) : (
            <Volume2 size={24} color={redText} strokeWidth={2} />
          )}
        </Pressable>
      </View>

      <ScrollFadeView
        style={{ flex: 1 }}
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 20,
          paddingTop: insets.top + 80,
          paddingBottom: 40 + insets.bottom,
          justifyContent: 'center',
        }}
        showsVerticalScrollIndicator={false}
        fadeColor={redBackground}
        fadeHeight={48}
        fadeIntensity={0.95}
        fadeVisibility="always"
      >
        <Animated.View style={{ opacity: fadeAnim }}>
          {/* Intro Step */}
          {step === 'intro' && (
            <View style={{ alignItems: 'center' }}>
              <Moon size={64} color={redText} strokeWidth={1.5} />

              <Text
                style={{
                  fontSize: 28,
                  fontWeight: 'bold',
                  color: redText,
                  textAlign: 'center',
                  marginTop: 32,
                  marginBottom: 16,
                }}
              >
                Return to Sleep
              </Text>

              <Text
                style={{
                  fontSize: 18,
                  color: redMuted,
                  textAlign: 'center',
                  lineHeight: 28,
                  marginBottom: 48,
                }}
              >
                A gentle 2-minute protocol to help you drift back off
              </Text>

              <Pressable
                onPress={handleStartBreathing}
                style={{
                  backgroundColor: redSurface,
                  borderRadius: 16,
                  paddingVertical: 20,
                  paddingHorizontal: 40,
                  borderWidth: 2,
                  borderColor: redMuted,
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: redText,
                  }}
                >
                  Begin
                </Text>
              </Pressable>
            </View>
          )}

          {/* Breathing Step */}
          {step === 'breathing' && (
            <View style={{ alignItems: 'center' }}>
              <Animated.View
                style={{
                  width: 200,
                  height: 200,
                  borderRadius: 100,
                  backgroundColor: redSurface,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 3,
                  borderColor: redMuted,
                  transform: [{ scale: pulseAnim }],
                }}
              >
                <Text style={{ fontSize: 80 }}>🌙</Text>
              </Animated.View>

              <Text
                style={{
                  fontSize: 24,
                  fontWeight: 'bold',
                  color: redText,
                  textAlign: 'center',
                  marginTop: 40,
                  marginBottom: 16,
                }}
              >
                Breathe with the moon
              </Text>

              <Text
                style={{
                  fontSize: 18,
                  color: redMuted,
                  textAlign: 'center',
                  lineHeight: 28,
                  marginBottom: 32,
                }}
              >
                {breathCount < 10
                  ? `Breath ${breathCount + 1} of 10\n\nIn through your nose... Out through your mouth...`
                  : 'Excellent. Moving to body relaxation...'}
              </Text>
            </View>
          )}

          {/* Body Scan Step */}
          {step === 'body-scan' && (
            <View style={{ alignItems: 'center' }}>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: 'bold',
                  color: redText,
                  textAlign: 'center',
                  marginBottom: 32,
                }}
              >
                Progressive Relaxation
              </Text>

              <View style={{ width: '100%', marginBottom: 24 }}>
                <View
                  style={{
                    backgroundColor: redSurface,
                    borderRadius: 16,
                    padding: 24,
                    borderWidth: 1,
                    borderColor: redMuted,
                    marginBottom: 16,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      color: redText,
                      lineHeight: 28,
                      textAlign: 'center',
                    }}
                  >
                    Relax your forehead...
                  </Text>
                </View>

                <View
                  style={{
                    backgroundColor: redSurface,
                    borderRadius: 16,
                    padding: 24,
                    borderWidth: 1,
                    borderColor: redMuted,
                    marginBottom: 16,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      color: redText,
                      lineHeight: 28,
                      textAlign: 'center',
                    }}
                  >
                    Release tension in your jaw...
                  </Text>
                </View>

                <View
                  style={{
                    backgroundColor: redSurface,
                    borderRadius: 16,
                    padding: 24,
                    borderWidth: 1,
                    borderColor: redMuted,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      color: redText,
                      lineHeight: 28,
                      textAlign: 'center',
                    }}
                  >
                    Let your shoulders drop...
                  </Text>
                </View>
              </View>

              <Pressable
                onPress={handleStartBodyScan}
                style={{
                  backgroundColor: redSurface,
                  borderRadius: 16,
                  paddingVertical: 16,
                  paddingHorizontal: 32,
                  borderWidth: 2,
                  borderColor: redMuted,
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: redText,
                  }}
                >
                  Continue
                </Text>
              </Pressable>
            </View>
          )}

          {/* Complete Step */}
          {step === 'complete' && (
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 80, marginBottom: 24 }}>✨</Text>

              <Text
                style={{
                  fontSize: 24,
                  fontWeight: 'bold',
                  color: redText,
                  textAlign: 'center',
                  marginBottom: 16,
                }}
              >
                You're ready
              </Text>

              <Text
                style={{
                  fontSize: 18,
                  color: redMuted,
                  textAlign: 'center',
                  lineHeight: 28,
                  marginBottom: 48,
                }}
              >
                Close your eyes and let sleep come naturally. You've done beautifully.
              </Text>

              <Pressable
                onPress={handleComplete}
                style={{
                  backgroundColor: redSurface,
                  borderRadius: 16,
                  paddingVertical: 20,
                  paddingHorizontal: 40,
                  borderWidth: 2,
                  borderColor: redMuted,
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: redText,
                  }}
                >
                  Close App
                </Text>
              </Pressable>
            </View>
          )}
        </Animated.View>
      </ScrollFadeView>
    </View>
  );
}

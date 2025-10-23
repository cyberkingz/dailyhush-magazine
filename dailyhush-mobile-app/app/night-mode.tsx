/**
 * DailyHush - 3AM Mode (Night Support)
 * PRD Section 5.6: 3AM Mode
 *
 * Features:
 * - Red-light UI to preserve melatonin
 * - Voice journal recording for 3AM thoughts
 * - Sleep-friendly spiral protocols
 * - Gentle reassurance without screens
 */

import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';
import { Colors, Spacing, Typography, BorderRadius } from '@/constants/theme';
import { useUser, useNightMode } from '@/store/useStore';
import { supabase } from '@/utils/supabase';

export default function NightMode() {
  const router = useRouter();
  const user = useUser();
  const nightMode = useNightMode();

  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [pulseAnim] = useState(new Animated.Value(1));

  // Red-light color palette for 3AM
  const redBackground = '#1A0A0A'; // Very dark red-tinted background
  const redSurface = '#2A1515'; // Slightly lighter red surface
  const redText = '#FFB8B8'; // Soft red text (won't disrupt melatonin)
  const redMuted = '#CC8888'; // Muted red for secondary text

  useEffect(() => {
    // Gentle pulsing animation for breathing cue
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
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
  }, []);

  /**
   * Start voice journal recording
   */
  const startRecording = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        console.error('Microphone permission not granted');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(newRecording);
      setIsRecording(true);

      // Track duration
      const timer = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);

      // Store timer reference to clear later
      (newRecording as any).timer = timer;
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  /**
   * Stop voice journal recording and save
   */
  const stopRecording = async () => {
    if (!recording) return;

    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();

      // Clear timer
      clearInterval((recording as any).timer);

      setIsRecording(false);
      setRecording(null);

      // Save voice journal to Supabase
      if (user && uri) {
        const { error } = await supabase.from('voice_journals').insert({
          user_id: user.user_id,
          audio_file: uri,
          duration_seconds: recordingDuration,
          tags: ['3am', 'night-spiral'],
        });

        if (error) throw error;

        console.log('Voice journal saved');
        setRecordingDuration(0);

        // Show success feedback
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  };

  /**
   * Format recording duration
   */
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={{ flex: 1, backgroundColor: redBackground }}>
      <StatusBar style="light" />

      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          padding: Spacing.lg,
          paddingTop: Spacing.xxxl,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Gentle Header */}
        <View style={{ marginBottom: Spacing.xxxl, alignItems: 'center' }}>
          <Text
            style={{
              fontSize: Typography.fontSize.caption,
              color: redMuted,
              marginBottom: Spacing.sm,
            }}
          >
            3:00 AM
          </Text>
          <Text
            style={{
              fontSize: Typography.fontSize.heading2,
              fontWeight: Typography.fontWeight.bold as any,
              color: redText,
              textAlign: 'center',
            }}
          >
            You're Not Alone
          </Text>
          <Text
            style={{
              fontSize: Typography.fontSize.body,
              color: redMuted,
              textAlign: 'center',
              marginTop: Spacing.sm,
              lineHeight: Typography.lineHeight.body * Typography.fontSize.body,
            }}
          >
            Gentle support for the middle of the night
          </Text>
        </View>

        {/* Breathing Cue */}
        <Animated.View
          style={{
            alignItems: 'center',
            marginBottom: Spacing.xxxl,
            transform: [{ scale: pulseAnim }],
          }}
        >
          <View
            style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              backgroundColor: redSurface,
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 2,
              borderColor: redMuted,
            }}
          >
            <Text style={{ fontSize: 48, opacity: 0.6 }}>🌙</Text>
          </View>
          <Text
            style={{
              fontSize: Typography.fontSize.caption,
              color: redMuted,
              marginTop: Spacing.md,
              textAlign: 'center',
            }}
          >
            Breathe with the gentle pulse
          </Text>
        </Animated.View>

        {/* Quick Actions */}
        <View style={{ marginBottom: Spacing.xl }}>
          {/* Spiral Interrupt */}
          <TouchableOpacity
            onPress={() => router.push('/spiral')}
            activeOpacity={0.8}
            style={{
              backgroundColor: redSurface,
              borderRadius: BorderRadius.md,
              padding: Spacing.lg,
              marginBottom: Spacing.md,
              borderWidth: 1,
              borderColor: redMuted,
            }}
          >
            <Text
              style={{
                fontSize: Typography.fontSize.heading3,
                fontWeight: Typography.fontWeight.semibold as any,
                color: redText,
                marginBottom: Spacing.xs,
              }}
            >
              90-Second Spiral Interrupt
            </Text>
            <Text
              style={{
                fontSize: Typography.fontSize.body,
                color: redMuted,
                lineHeight: Typography.lineHeight.body * Typography.fontSize.body,
              }}
            >
              Gentle guided protocol for rumination
            </Text>
          </TouchableOpacity>

          {/* Voice Journal */}
          <View
            style={{
              backgroundColor: redSurface,
              borderRadius: BorderRadius.md,
              padding: Spacing.lg,
              marginBottom: Spacing.md,
              borderWidth: 1,
              borderColor: redMuted,
            }}
          >
            <Text
              style={{
                fontSize: Typography.fontSize.heading3,
                fontWeight: Typography.fontWeight.semibold as any,
                color: redText,
                marginBottom: Spacing.xs,
              }}
            >
              Voice Journal
            </Text>
            <Text
              style={{
                fontSize: Typography.fontSize.body,
                color: redMuted,
                marginBottom: Spacing.lg,
                lineHeight: Typography.lineHeight.body * Typography.fontSize.body,
              }}
            >
              {isRecording
                ? 'Speak your thoughts out loud'
                : 'Get thoughts out of your head without typing'}
            </Text>

            {isRecording && (
              <View
                style={{
                  backgroundColor: redBackground,
                  borderRadius: BorderRadius.sm,
                  padding: Spacing.md,
                  marginBottom: Spacing.md,
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    fontSize: Typography.fontSize.heading2,
                    fontWeight: Typography.fontWeight.bold as any,
                    color: '#FF6B6B',
                  }}
                >
                  ● {formatDuration(recordingDuration)}
                </Text>
                <Text
                  style={{
                    fontSize: Typography.fontSize.caption,
                    color: redMuted,
                    marginTop: Spacing.xs,
                  }}
                >
                  Recording...
                </Text>
              </View>
            )}

            <TouchableOpacity
              onPress={isRecording ? stopRecording : startRecording}
              style={{
                backgroundColor: isRecording ? '#8B0000' : '#CC4444',
                borderRadius: BorderRadius.md,
                padding: Spacing.md,
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: Typography.fontSize.body,
                  fontWeight: Typography.fontWeight.bold as any,
                  color: '#FFFFFF',
                }}
              >
                {isRecording ? 'Stop Recording' : 'Start Recording'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Sleep Protocol */}
          <TouchableOpacity
            onPress={() => {
              // TODO: Implement sleep protocol
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            }}
            activeOpacity={0.8}
            style={{
              backgroundColor: redSurface,
              borderRadius: BorderRadius.md,
              padding: Spacing.lg,
              borderWidth: 1,
              borderColor: redMuted,
            }}
          >
            <Text
              style={{
                fontSize: Typography.fontSize.heading3,
                fontWeight: Typography.fontWeight.semibold as any,
                color: redText,
                marginBottom: Spacing.xs,
              }}
            >
              Return to Sleep Protocol
            </Text>
            <Text
              style={{
                fontSize: Typography.fontSize.body,
                color: redMuted,
                lineHeight: Typography.lineHeight.body * Typography.fontSize.body,
              }}
            >
              Guided audio to help you drift back off
            </Text>
          </TouchableOpacity>
        </View>

        {/* Reassurance Message */}
        <View
          style={{
            backgroundColor: redSurface,
            borderRadius: BorderRadius.md,
            padding: Spacing.lg,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: redMuted,
          }}
        >
          <Text
            style={{
              fontSize: Typography.fontSize.body,
              color: redText,
              textAlign: 'center',
              lineHeight: Typography.lineHeight.body * Typography.fontSize.body,
              fontStyle: 'italic',
            }}
          >
            "You're safe. This feeling will pass. You've gotten through every 3AM before this one."
          </Text>
        </View>

        {/* Exit to Normal Mode */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            marginTop: Spacing.xl,
            alignItems: 'center',
            padding: Spacing.md,
          }}
        >
          <Text
            style={{
              fontSize: Typography.fontSize.caption,
              color: redMuted,
            }}
          >
            Exit Night Mode
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

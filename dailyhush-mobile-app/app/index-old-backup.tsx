/**
 * DailyHush - Home Screen
 * Main screen with the giant "I'M SPIRALING" button
 * PRD Section 5.1: Spiral Interrupt (Core Feature #1)
 */

import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, ScrollView } from 'react-native';
import * as Haptics from 'expo-haptics';
import theme from '@/constants/theme';
import { useUser, useShiftDevice, useNightMode } from '@/store/useStore';

const { Colors, Spacing, Typography, BorderRadius } = theme;

export default function Home() {
  const router = useRouter();
  const user = useUser();
  const shiftDevice = useShiftDevice();
  const nightMode = useNightMode();
  const [greeting, setGreeting] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showNightModeBanner, setShowNightModeBanner] = useState(false);

  // Check if user needs onboarding
  useEffect(() => {
    if (user && !user.onboarding_completed) {
      router.replace('/onboarding');
    }
  }, [user]);

  // Update time every minute and check for 3AM mode hours
  useEffect(() => {
    const updateGreeting = () => {
      const hour = currentTime.getHours();
      if (hour < 12) setGreeting('Good morning');
      else if (hour < 18) setGreeting('Good afternoon');
      else setGreeting('Good evening');

      // Check if it's 3AM mode hours (10PM - 6AM)
      const is3AMHours = hour >= 22 || hour < 6;
      setShowNightModeBanner(is3AMHours);
    };

    updateGreeting();
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      updateGreeting();
    }, 60000);

    return () => clearInterval(timer);
  }, [currentTime]);

  const handleSpiralPress = async () => {
    // Haptic feedback for reassurance
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Navigate to spiral interrupt protocol
    router.push('/spiral');
  };

  const handleTrainingPress = () => {
    router.push('/training');
  };

  const handleInsightsPress = () => {
    router.push('/insights');
  };

  // Dark emerald theme by default (matches admin dashboard)
  const containerStyle = {
    flex: 1,
    backgroundColor: Colors.background.primary, // emerald-900 - matches admin dashboard
  };

  const txtColor = Colors.neutral.neutral50; // Light text on dark background

  return (
    <View style={containerStyle}>
      <StatusBar style="light" />

      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          padding: Spacing.lg,
          paddingTop: Spacing.xxxl,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting */}
        <View style={{ marginBottom: Spacing.xl }}>
          <Text
            style={{
              fontSize: Typography.fontSize.caption,
              fontWeight: Typography.fontWeight.regular,
              color: Colors.neutral.neutral400, // Muted text on dark background
              marginBottom: Spacing.xs,
            }}
          >
            {greeting}
          </Text>
          <Text
            style={{
              fontSize: Typography.fontSize.heading2,
              fontWeight: Typography.fontWeight.bold,
              color: txtColor,
            }}
          >
            {user?.email ? `Welcome back` : 'Welcome to DailyHush'}
          </Text>
        </View>

        {/* 3AM Mode Banner (shows during night hours) */}
        {showNightModeBanner && (
          <TouchableOpacity
            onPress={() => router.push('/night-mode' as any)}
            activeOpacity={0.8}
            style={{
              backgroundColor: '#2A1515',
              borderRadius: BorderRadius.md,
              padding: Spacing.lg,
              marginBottom: Spacing.xl,
              borderWidth: 2,
              borderColor: '#CC8888',
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.xs }}>
              <Text style={{ fontSize: 24, marginRight: Spacing.sm }}>🌙</Text>
              <Text
                style={{
                  fontSize: Typography.fontSize.heading3,
                  fontWeight: Typography.fontWeight.bold as any,
                  color: '#FFB8B8',
                }}
              >
                3AM Mode Available
              </Text>
            </View>
            <Text
              style={{
                fontSize: Typography.fontSize.body,
                color: '#CC8888',
                lineHeight: Typography.lineHeight.body * Typography.fontSize.body,
              }}
            >
              Gentle, red-light support designed for sleepless nights. Tap to switch.
            </Text>
          </TouchableOpacity>
        )}

        {/* Main Spiral Button - THE GIANT BUTTON */}
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <TouchableOpacity
            onPress={handleSpiralPress}
            activeOpacity={0.8}
            accessibilityLabel="I'm spiraling - start 90-second intervention"
            accessibilityRole="button"
            accessibilityHint="Tap to start a 90-second guided protocol to interrupt rumination"
            style={{
              width: '100%',
              height: 280,
              backgroundColor: Colors.primary.emerald600,
              borderRadius: BorderRadius.xl,
              justifyContent: 'center',
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.3,
              shadowRadius: 16,
              elevation: 12,
            }}
          >
            <Text
              style={{
                fontSize: 42,
                fontWeight: Typography.fontWeight.bold,
                color: '#FFFFFF',
                textAlign: 'center',
                lineHeight: 50,
              }}
            >
              I'M{'\n'}SPIRALING
            </Text>
            <Text
              style={{
                fontSize: Typography.fontSize.body,
                fontWeight: Typography.fontWeight.regular,
                color: '#FFFFFF',
                opacity: 0.9,
                marginTop: Spacing.md,
                textAlign: 'center',
              }}
            >
              Tap to interrupt in 90 seconds
            </Text>
          </TouchableOpacity>

          {/* Shift necklace reminder */}
          {shiftDevice?.is_connected && (
            <View style={{ marginTop: Spacing.lg, alignItems: 'center' }}>
              <Text
                style={{
                  fontSize: Typography.fontSize.caption,
                  color: Colors.neutral.neutral400,
                }}
              >
                ✓ Shift necklace connected
              </Text>
            </View>
          )}
        </View>

        {/* Secondary Actions */}
        <View style={{ marginTop: Spacing.xl }}>
          {/* F.I.R.E. Training Card */}
          <TouchableOpacity
            onPress={handleTrainingPress}
            activeOpacity={0.7}
            accessibilityLabel="Start F.I.R.E. training"
            accessibilityRole="button"
            style={{
              backgroundColor: Colors.background.secondary,
              borderRadius: BorderRadius.md,
              padding: Spacing.lg,
              marginBottom: Spacing.md,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <Text
              style={{
                fontSize: Typography.fontSize.heading3,
                fontWeight: Typography.fontWeight.semibold,
                color: txtColor,
                marginBottom: Spacing.xs,
              }}
            >
              F.I.R.E. Training
            </Text>
            <Text
              style={{
                fontSize: Typography.fontSize.body,
                color: Colors.neutral.neutral300,
                lineHeight: Typography.lineHeight.body * Typography.fontSize.body,
              }}
            >
              Learn why you ruminate and how to prevent spirals
            </Text>
          </TouchableOpacity>

          {/* Pattern Insights Card */}
          <TouchableOpacity
            onPress={handleInsightsPress}
            activeOpacity={0.7}
            accessibilityLabel="View pattern insights"
            accessibilityRole="button"
            style={{
              backgroundColor: Colors.background.secondary,
              borderRadius: BorderRadius.md,
              padding: Spacing.lg,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <Text
              style={{
                fontSize: Typography.fontSize.heading3,
                fontWeight: Typography.fontWeight.semibold,
                color: txtColor,
                marginBottom: Spacing.xs,
              }}
            >
              Your Insights
            </Text>
            <Text
              style={{
                fontSize: Typography.fontSize.body,
                color: Colors.neutral.neutral300,
                lineHeight: Typography.lineHeight.body * Typography.fontSize.body,
              }}
            >
              See your patterns and track progress over time
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

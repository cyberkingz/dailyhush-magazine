/**
 * DailyHush - Profile Summary Screen
 *
 * Beautiful, holistic wellness dashboard showing:
 * - Loop type identity
 * - Today's emotional weather
 * - Weekly wellness stats
 * - AI-detected patterns and insights
 * - Loop type understanding
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useRouter, Stack, useFocusEffect } from 'expo-router';
import { Settings } from 'lucide-react-native';

import { LoopTypeHero } from '@/components/profile/LoopTypeHero';
import { EmotionalWeather } from '@/components/profile/EmotionalWeather';
import { ProfileStats } from '@/components/profile/ProfileStats';
import { PatternInsightCard } from '@/components/profile/PatternInsightCard';
import { LoopCharacteristics } from '@/components/profile/LoopCharacteristics';

import { fetchProfileSummary, type ProfileSummary, dismissInsight } from '@/services/profileService';

import { colors } from '@/constants/colors';
import { profileTypography } from '@/constants/profileTypography';
import { BOTTOM_NAV, SPACING } from '@/constants/designTokens';
import type { LoopType } from '@/constants/loopTypes';
import { getLoopTypeConfig } from '@/constants/loopTypes';

export default function ProfileScreen() {
  const router = useRouter();

  const [profileData, setProfileData] = useState<ProfileSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load profile data
  const loadProfileData = async () => {
    try {
      setError(null);

      const profile = await fetchProfileSummary();

      if (profile) {
        setProfileData(profile);
      } else {
        setError('Could not load profile data');
      }
    } catch (err) {
      console.error('Error loading profile:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadProfileData();
  }, []);

  // Reload when screen comes back into focus (after mood capture)
  useFocusEffect(
    React.useCallback(() => {
      loadProfileData();
    }, [])
  );

  // Pull to refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    loadProfileData();
  };

  // Navigate to settings
  const handleSettings = () => {
    router.push('/profile/edit');
  };

  // Navigate to mood capture flow
  const handleCheckIn = () => {
    router.push('/mood-capture/mood');
  };

  // Handle insight dismissal
  const handleDismissInsight = async (insightId: string) => {
    await dismissInsight(insightId);
    // Refresh profile data to remove dismissed insight
    loadProfileData();
  };

  // Loading state
  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />
        <ActivityIndicator size="large" color={colors.emerald[600]} />
        <Text
          style={[
            profileTypography.sections.subtitle,
            { color: colors.text.secondary, marginTop: 16 },
          ]}
        >
          Loading your profile...
        </Text>
      </View>
    );
  }

  // Error state
  if (error || !profileData) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />
        <Text
          style={[
            profileTypography.sections.title,
            { color: colors.text.primary, marginBottom: 8 },
          ]}
        >
          Oops!
        </Text>
        <Text
          style={[
            profileTypography.sections.subtitle,
            { color: colors.text.secondary, textAlign: 'center', marginBottom: 16 },
          ]}
        >
          {error || 'Could not load profile'}
        </Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            setIsLoading(true);
            loadProfileData();
          }}
        >
          <Text
            style={[profileTypography.buttons.primary, { color: colors.white }]}
          >
            Try Again
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Your Profile',
          headerStyle: {
            backgroundColor: colors.background.primary,
          },
          headerTintColor: colors.text.primary,
          headerRight: () => (
            <TouchableOpacity
              onPress={handleSettings}
              style={styles.headerButton}
              accessibilityLabel="Settings"
              accessibilityRole="button"
            >
              <Settings size={24} color={colors.text.primary} />
            </TouchableOpacity>
          ),
        }}
      />

      {/*
        Layout Architecture:
        - ScrollView with proper bottom padding to prevent content overlap with tab bar
        - Uses design tokens (BOTTOM_NAV.height + SPACING.xl) instead of hardcoded values
        - BOTTOM_NAV.height (80px) clears the tab bar
        - SPACING.xl (24px) provides breathing room between last card and tab bar
        - Total: 104px bottom padding ensures "gentle suggestion" card doesn't touch tab bar
      */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom: BOTTOM_NAV.height + SPACING.xl, // Tab bar clearance + breathing room
          },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={colors.emerald[600]}
            colors={[colors.emerald[600]]}
          />
        }
      >
        {/* Warm Greeting */}
        <View style={styles.greetingSection}>
          <Text style={styles.greetingText}>
            {(() => {
              const hour = new Date().getHours();
              if (hour < 12) return 'Good morning';
              if (hour < 18) return 'Good afternoon';
              return 'Good evening';
            })()}
            {profileData.user.full_name ? `, ${profileData.user.full_name.split(' ')[0]}` : ''}
          </Text>
          <Text style={styles.greetingSubtext}>
            Welcome back to your journey. Let's see how you're doing.
          </Text>
        </View>

        {/* Loop Type Hero */}
        {profileData.user.loop_type && (
          <LoopTypeHero
            loopType={profileData.user.loop_type as LoopType}
            userName={profileData.user.full_name || undefined}
          />
        )}

        {/* Section: Right Now */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text
              style={[
                profileTypography.sections.title,
                { color: colors.text.primary },
              ]}
            >
              Right Now
            </Text>
            <Text
              style={[
                profileTypography.sections.subtitle,
                { color: colors.text.secondary },
              ]}
            >
              Your emotional weather today
            </Text>
          </View>

          <EmotionalWeather
            weather={profileData.todayCheckIn?.emotional_weather}
            moodRating={profileData.todayCheckIn?.mood_rating}
            notes={profileData.todayCheckIn?.notes || undefined}
            onPress={handleCheckIn}
          />
        </View>

        {/* Section: Your Journey This Week */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text
              style={[
                profileTypography.sections.title,
                { color: colors.text.primary },
              ]}
            >
              Your Journey This Week
            </Text>
            <Text
              style={[
                profileTypography.sections.subtitle,
                { color: colors.text.secondary },
              ]}
            >
              Every check-in is a step toward understanding yourself
            </Text>
          </View>

          <ProfileStats
            currentStreak={profileData.stats.currentStreak}
            totalCheckIns={profileData.stats.totalCheckIns}
            avgMoodRating={profileData.stats.avgMoodRating}
          />

          {/* Transitional text */}
          <Text style={styles.transitionalText}>
            These moments of self-reflection are building your self-awareness
          </Text>
        </View>

        {/* Subtle divider before insights */}
        <View style={styles.narrativeDivider} />

        {/* Section: What We're Learning Together */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text
              style={[
                profileTypography.sections.title,
                { color: colors.text.primary },
              ]}
            >
              What We're Learning Together
            </Text>
            <Text
              style={[
                profileTypography.sections.subtitle,
                { color: colors.text.secondary },
              ]}
            >
              {profileData.insights.length > 0
                ? `Patterns emerging from your ${profileData.stats.totalCheckIns} check-ins`
                : 'Your patterns are growing'}
            </Text>
          </View>

          {profileData.insights.length > 0 ? (
            profileData.insights.map((insight, index) => (
              <PatternInsightCard
                key={insight.id}
                insight={insight}
                index={index}
                onDismiss={handleDismissInsight}
              />
            ))
          ) : (
            <View style={styles.emptyPatternsCard}>
              <Text style={styles.emptyPatternsIcon}>🌱</Text>
              <Text style={styles.emptyPatternsTitle}>Your patterns are growing</Text>
              <Text style={styles.emptyPatternsBody}>
                Keep checking in. After a few more reflections, we'll start to see patterns in
                your emotional weather.
              </Text>
            </View>
          )}
        </View>

        {/* Section: Making Sense of It All */}
        {profileData.user.loop_type && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text
                style={[
                  profileTypography.sections.title,
                  { color: colors.text.primary },
                ]}
              >
                Making Sense of It All
              </Text>
              <Text
                style={[
                  profileTypography.sections.subtitle,
                  { color: colors.text.secondary },
                ]}
              >
                What your{' '}
                {getLoopTypeConfig(profileData.user.loop_type as LoopType).name.toLowerCase()}{' '}
                pattern means for you
              </Text>
            </View>

            {/* Intro paragraph */}
            <Text style={styles.loopIntroText}>
              Your check-ins and patterns tell us you're navigating the{' '}
              {getLoopTypeConfig(profileData.user.loop_type as LoopType).name}. Here's what that
              means—and how you can work with it, not against it.
            </Text>

            <LoopCharacteristics loopType={profileData.user.loop_type as LoopType} />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  greetingSection: {
    marginBottom: 28,
    paddingTop: 8,
  },
  greetingText: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  greetingSubtext: {
    fontSize: 16,
    color: colors.text.secondary,
    lineHeight: 24,
    fontWeight: '400',
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  headerButton: {
    marginRight: 16,
    padding: 8,
  },
  retryButton: {
    backgroundColor: colors.emerald[600],
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  transitionalText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 24,
    paddingHorizontal: 24,
    lineHeight: 20,
  },
  narrativeDivider: {
    height: 1,
    backgroundColor: colors.background.border,
    opacity: 0.3,
    marginVertical: 40,
    marginHorizontal: 32,
  },
  loopIntroText: {
    fontSize: 15,
    color: colors.text.secondary,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  emptyPatternsCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.background.border,
  },
  emptyPatternsIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyPatternsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyPatternsBody: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.text.secondary,
    textAlign: 'center',
  },
});

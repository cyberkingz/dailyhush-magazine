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
        {/* Loop Type Hero */}
        {profileData.user.loop_type && (
          <LoopTypeHero
            loopType={profileData.user.loop_type as LoopType}
            userName={profileData.user.full_name || undefined}
          />
        )}

        {/* Emotional Weather - Today's Check-In */}
        <EmotionalWeather
          weather={profileData.todayCheckIn?.emotional_weather}
          moodRating={profileData.todayCheckIn?.mood_rating}
          notes={profileData.todayCheckIn?.notes || undefined}
          onPress={handleCheckIn}
        />

        {/* Weekly Stats */}
        <View style={styles.section}>
          <ProfileStats
            currentStreak={profileData.stats.currentStreak}
            totalCheckIns={profileData.stats.totalCheckIns}
            avgMoodRating={profileData.stats.avgMoodRating}
          />
        </View>

        {/* AI-Detected Patterns & Insights */}
        {profileData.insights.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text
                style={[
                  profileTypography.sections.title,
                  { color: colors.text.primary },
                ]}
              >
                Your Patterns
              </Text>
              <Text
                style={[
                  profileTypography.sections.subtitle,
                  { color: colors.text.secondary },
                ]}
              >
                {profileData.insights.length} insight
                {profileData.insights.length === 1 ? '' : 's'} discovered
              </Text>
            </View>

            {profileData.insights.map((insight, index) => (
              <PatternInsightCard
                key={insight.id}
                insight={insight}
                index={index}
                onDismiss={handleDismissInsight}
              />
            ))}
          </View>
        )}

        {/* Loop Type Understanding */}
        {profileData.user.loop_type && (
          <LoopCharacteristics loopType={profileData.user.loop_type as LoopType} />
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
});

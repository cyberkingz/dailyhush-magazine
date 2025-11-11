/**
 * Nœma - Profile Summary Screen
 *
 * Beautiful, holistic wellness dashboard showing:
 * - Loop type identity
 * - Today's emotional weather
 * - Weekly wellness stats
 * - AI-detected patterns and insights
 * - Loop type understanding
 */

import React, { useEffect, useState, type ComponentProps } from 'react';
import {
  View,
  Text,
  RefreshControl,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { ScrollFadeView } from '@/components/ScrollFadeView';
import { useRouter, Stack, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Settings } from 'lucide-react-native';

import { EmotionalWeatherWidget } from '@/components/mood-widget';
import { ScrollControlProvider } from '@/components/mood-widget/ScrollControlContext';
import { ProfileStats } from '@/components/profile/ProfileStats';
import { PatternInsightCard } from '@/components/profile/PatternInsightCard';
import { LoopCharacteristics } from '@/components/profile/LoopCharacteristics';

import {
  fetchProfileSummary,
  type ProfileSummary,
  dismissInsight,
} from '@/services/profileService';

import { colors } from '@/constants/colors';
import { profileTypography, brandFonts } from '@/constants/profileTypography';
import { BOTTOM_NAV, SPACING } from '@/constants/designTokens';
import type { LoopType } from '@/constants/loopTypes';
import { getLoopTypeConfig } from '@/constants/loopTypes';

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [profileData, setProfileData] = useState<ProfileSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshControlColors =
    Platform.select<Partial<ComponentProps<typeof RefreshControl>>>({
      ios: {
        tintColor: colors.lime[500],
        titleColor: colors.lime[500],
      },
      android: {
        colors: [colors.lime[500], colors.lime[400], colors.lime[600]],
        progressBackgroundColor: colors.background.primary,
      },
      default: {},
    }) ?? {};

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
        <ActivityIndicator size="large" color={colors.lime[500]} />
        <Text
          style={[
            profileTypography.sections.subtitle,
            { color: colors.text.secondary, marginTop: 16 },
          ]}>
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
          ]}>
          Oops!
        </Text>
        <Text
          style={[
            profileTypography.sections.subtitle,
            { color: colors.text.secondary, textAlign: 'center', marginBottom: 16 },
          ]}>
          {error || 'Could not load profile'}
        </Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            setIsLoading(true);
            loadProfileData();
          }}>
          <Text style={[profileTypography.buttons.primary, { color: colors.white }]}>
            Try Again
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollControlProvider>
      <View style={styles.container}>
        <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: () => <Text style={styles.headerLogo}>Nœma</Text>,
          headerStyle: {
            backgroundColor: colors.background.primary,
          },
          headerTintColor: colors.text.primary,
          headerRight: () => (
            <TouchableOpacity
              onPress={handleSettings}
              style={styles.headerButton}
              accessibilityLabel="Settings"
              accessibilityRole="button">
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
      <ScrollFadeView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom: BOTTOM_NAV.height + insets.bottom + SPACING.xxl, // Tab bar + safe area + breathing room
          },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            {...refreshControlColors}
          />
        }
        fadeColor={colors.background.primary}
        fadeHeight={48}
        fadeIntensity={0.95}
        fadeVisibility="always">
        {/* Greeting + Journey Header Combined */}
        <View style={styles.topSection}>
          <Text style={styles.greetingText}>
            {(() => {
              const hour = new Date().getHours();
              if (hour < 12) return 'Good morning';
              if (hour < 18) return 'Good afternoon';
              return 'Good evening';
            })()}
            {profileData.user.full_name ? `, ${profileData.user.full_name.split(' ')[0]}` : ''}
          </Text>
          <Text style={styles.journeySubtext}>Your journey this week</Text>
        </View>

        {/* Section: Stats - HERO POSITION */}
        <View style={styles.section}>
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

        {/* Subtle divider before emotional check-in */}
        <View style={styles.narrativeDivider} />

        {/* Section: Right Now */}
        <View style={styles.section}>
          <EmotionalWeatherWidget
            weather={profileData.todayCheckIn?.emotional_weather as any}
            moodRating={profileData.todayCheckIn?.mood_rating}
            notes={profileData.todayCheckIn?.notes || undefined}
            createdAt={profileData.todayCheckIn?.created_at}
            updatedAt={profileData.todayCheckIn?.updated_at}
            onMoodSubmit={(data) => {
              console.log('[Profile] Mood submitted:', data);
              // Refresh profile data to show new mood
              loadProfileData();
            }}
            onUpdate={() => {
              console.log('[Profile] Update mood clicked');
              // Widget handles the update flow internally
            }}
          />
        </View>

        {/* Section: What We're Learning Together */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderNoBorder}>
            <Text style={[profileTypography.sections.title, { color: colors.text.primary }]}>
              What We're Learning Together
            </Text>
            <Text style={[profileTypography.sections.subtitle, { color: colors.text.secondary }]}>
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
                Keep checking in. After a few more reflections, we'll start to see patterns in your
                emotional weather.
              </Text>
            </View>
          )}
        </View>

        {/* Subtle divider before loop type */}
        <View style={styles.narrativeDivider} />

        {/* Section: Understanding Your Pattern */}
        {profileData.user.loop_type && (
          <View style={styles.section}>
            <View style={styles.sectionHeaderNoBorder}>
              <Text style={[profileTypography.sections.title, { color: colors.text.primary }]}>
                Understanding Your Pattern
              </Text>
              <Text style={[profileTypography.sections.subtitle, { color: colors.text.secondary }]}>
                The {getLoopTypeConfig(profileData.user.loop_type as LoopType).name} explained
              </Text>
            </View>

            {/* Loop type intro - paragraph format */}
            <View style={styles.loopIntroParagraph}>
              <Text style={styles.loopIntroText}>
                Based on your check-ins, you're navigating the{' '}
                <Text style={styles.loopTypeNameInline}>
                  {getLoopTypeConfig(profileData.user.loop_type as LoopType).name}
                </Text>
                —{getLoopTypeConfig(profileData.user.loop_type as LoopType).tagline.toLowerCase()}.
                Understanding this pattern helps you work with it, not against it.
              </Text>
            </View>

            <LoopCharacteristics loopType={profileData.user.loop_type as LoopType} />
          </View>
        )}

        {/* Inspirational Quote */}
        <View style={styles.quoteSection}>
          <Text style={styles.quoteText}>
            "You are not your thoughts. You are the awareness behind them."
          </Text>
          <Text style={styles.quoteAuthor}>— Jon Kabat-Zinn</Text>
        </View>
      </ScrollFadeView>
      </View>
    </ScrollControlProvider>
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
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  topSection: {
    marginBottom: 28,
    paddingTop: 8,
  },
  greetingText: {
    fontSize: 32,
    fontFamily: brandFonts.headlineBold,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  journeySubtext: {
    fontSize: 15,
    color: colors.text.secondary,
    fontWeight: '500',
    opacity: 0.75,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.lime[500] + '08',
  },
  sectionHeaderNoBorder: {
    marginBottom: 20,
  },
  headerLogo: {
    fontSize: 28,
    fontFamily: brandFonts.headlineBold,
    color: colors.text.primary,
    letterSpacing: 1,
  },
  headerButton: {
    marginRight: 16,
    padding: 8,
  },
  retryButton: {
    backgroundColor: colors.lime[500],
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  transitionalText: {
    fontSize: 15,
    fontStyle: 'italic',
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
    paddingHorizontal: 24,
    lineHeight: 22,
    opacity: 0.85,
  },
  narrativeDivider: {
    height: 1,
    backgroundColor: colors.lime[500],
    opacity: 0.1,
    marginVertical: 24,
    marginHorizontal: 40,
  },
  loopIntroParagraph: {
    marginBottom: 28,
    paddingLeft: 4,
  },
  loopIntroText: {
    fontSize: 16,
    color: colors.text.secondary,
    lineHeight: 24,
    textAlign: 'left',
  },
  loopTypeNameInline: {
    color: colors.lime[500],
    fontWeight: '600',
  },
  emptyPatternsCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.lime[500] + '1A',
  },
  emptyPatternsIcon: {
    fontSize: 56,
    marginBottom: 20,
  },
  emptyPatternsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyPatternsBody: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.text.secondary,
    textAlign: 'center',
    maxWidth: 280,
  },
  quoteSection: {
    marginTop: 48,
    marginBottom: 0,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  quoteText: {
    fontSize: 18,
    lineHeight: 28,
    color: colors.text.secondary,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 12,
    opacity: 0.85,
    letterSpacing: 0.3,
  },
  quoteAuthor: {
    fontSize: 14,
    color: colors.lime[500],
    textAlign: 'center',
    fontWeight: '500',
    letterSpacing: 0.5,
  },
});

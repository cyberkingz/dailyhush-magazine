/**
 * Nœma - Modern Wellness Home Screen
 * Grid layout inspired by modern wellness apps
 */

import { useRouter, useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect, useCallback } from 'react';
import { View, Pressable, ActivityIndicator, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Brain, TrendingUp, Settings, History, Lightbulb, Infinity } from 'lucide-react-native';

import { Text } from '@/components/ui/text';
import { useUser, useLoading } from '@/store/useStore';
import { ScrollFadeView } from '@/components/ScrollFadeView';
import { CTAButton, FeatureGrid, FeatureItem, QuoteBanner } from '@/components/home';
import { EmotionalWeatherWidget } from '@/components/mood-widget';
import { ScrollControlProvider } from '@/components/mood-widget/ScrollControlContext';
import { useMoodLogging } from '@/hooks/useMoodLogging';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { supabase } from '@/utils/supabase';
import { brandFonts } from '@/constants/profileTypography';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useSpiral } from '@/hooks/useSpiral';

function getGreeting(): string {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) return 'Good morning';
  if (hour >= 12 && hour < 17) return 'Good afternoon';
  if (hour >= 17 && hour < 22) return 'Good evening';
  return 'Good night';
}

export default function HomeModern() {
  const router = useRouter();
  const user = useUser();
  const isLoading = useLoading();
  const insets = useSafeAreaInsets();
  // const [spiralsToday, setSpiralsToday] = useState(0);
  // const [spiralsThisWeek, setSpiralsThisWeek] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  // const { getTodaySpirals } = useSpiral();
  const greeting = getGreeting();
  const displayName = user?.name?.split(' ')[0] ?? 'Friend';
  const greetingLine = `${greeting}`;
  const welcomeLine = displayName === 'Friend' ? 'Welcome back' : `Welcome back, ${displayName}`;

  // Mood logging integration
  const { submitMood, getTodayMood, isSubmitting, error: moodError } = useMoodLogging();
  const [todayMood, setTodayMood] = useState<{
    weather: string;
    intensity: number;
    notes?: string;
    createdAt?: string;
    updatedAt?: string;
  } | null>(null);
  const [isFetchingMood, setIsFetchingMood] = useState(false);

  // Handle mood submission
  // Note: The widget already submitted the mood - this callback just updates the UI
  const handleMoodSubmit = async (moodData: {
    mood: string;
    intensity: number;
    notes?: string;
  }) => {
    console.log('[Home] Mood submit callback received:', moodData);

    try {
      // Update local state immediately with the submitted data
      const now = new Date().toISOString();
      setTodayMood({
        weather: moodData.mood,
        intensity: moodData.intensity,
        notes: moodData.notes,
        createdAt: now,
        updatedAt: now,
      });
      console.log('[Home] Local state updated optimistically');

      // Optionally refresh from server to get full record with timestamps, etc.
      // This runs in background and updates UI if needed
      console.log('[Home] Refreshing mood from server...');
      const refreshedMood = await getTodayMood(true); // force fetch

      if (refreshedMood) {
        console.log('[Home] Refreshed mood from server:', {
          mood: refreshedMood.mood,
          intensity: refreshedMood.intensity,
          hasNotes: !!refreshedMood.notes,
        });
        setTodayMood({
          weather: refreshedMood.mood as string,
          intensity: refreshedMood.intensity,
          notes: refreshedMood.notes || undefined,
        });
      } else {
        console.log('[Home] No mood returned from server (using optimistic data)');
      }
    } catch (error) {
      console.error('[Home] Failed to refresh mood:', error);
      console.error('[Home] Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        type: error?.constructor?.name,
      });
      // Keep the optimistic update even if refresh fails
    }
  };

  // Handle mood update (same as submit for inline widget)
  const handleMoodUpdate = () => {
    // The widget handles the update flow - no need to navigate
    console.log('Update mood clicked - widget will expand');
  };

  // Feature grid configuration
  const features: FeatureItem[] = [
    {
      id: 'fire-training',
      title: 'F.I.R.E. Training',
      description: 'Master the Method',
      icon: Brain,
      iconColor: colors.lime[500], // Lime-500
      iconBackgroundColor: colors.lime[500] + '25', // Lime background with 25% opacity
      onPress: () => router.push('/training'),
      isInteractive: true,
    },
    {
      id: 'pattern-insights',
      title: 'Pattern Insights',
      description: 'Track Your Trends',
      icon: TrendingUp,
      iconColor: colors.lime[400], // Lime-400
      iconBackgroundColor: colors.lime[400] + '25', // Lime background with 25% opacity
      onPress: () => router.push('/insights'),
      isInteractive: true,
    },
    {
      id: 'spiral-history',
      title: 'Spiral History',
      description: 'View Your Journey',
      icon: History,
      iconColor: colors.lime[300], // Lime-300
      iconBackgroundColor: colors.lime[300] + '25', // Lime background with 25% opacity
      onPress: () => router.push('/history'),
      isInteractive: true,
    },
    {
      id: 'did-you-know',
      title: 'Did you know?',
      description: 'Name it to tame it',
      icon: Lightbulb,
      iconColor: colors.lime[200], // Lime-200
      iconBackgroundColor: colors.lime[200] + '25', // Lime background with 25% opacity
      isInteractive: false,
    },
  ];

  // Clear mood cache on mount (TEMPORARY - for debugging)
  useEffect(() => {
    async function clearCache() {
      try {
        await AsyncStorage.removeItem('@dailyhush/today_mood_cache');
        await AsyncStorage.removeItem('@dailyhush/offline_mood_queue');
        console.log('[Home] ✅ Cleared mood cache on mount');
      } catch (error) {
        console.error('[Home] ❌ Failed to clear cache:', error);
      }
    }
    clearCache();
  }, []);

  // Mark component as mounted
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch today's mood function
  const fetchTodayMood = useCallback(async () => {
    if (user) {
      try {
        setIsFetchingMood(true);
        console.log('[Home] Fetching today\'s mood...');
        const mood = await getTodayMood();
        if (mood) {
          console.log('[Home] Mood found:', {
            mood: mood.mood,
            intensity: mood.intensity,
            hasNotes: !!mood.notes,
            createdAt: mood.created_at,
            updatedAt: mood.updated_at,
          });
          setTodayMood({
            weather: mood.mood as string,
            intensity: mood.intensity,
            notes: mood.notes || undefined,
            createdAt: mood.created_at,
            updatedAt: mood.updated_at,
          });
        } else {
          console.log('[Home] No mood found for today');
          setTodayMood(null);
        }
      } catch (error) {
        console.error('[Home] Failed to fetch today\'s mood:', error);
        setTodayMood(null);
      } finally {
        setIsFetchingMood(false);
      }
    }
  }, [user, getTodayMood]);

  // Fetch today's mood on mount
  useEffect(() => {
    if (isMounted) {
      fetchTodayMood();
    }
  }, [isMounted, fetchTodayMood]);

  // Refetch mood when screen comes into focus (when user returns to home)
  useFocusEffect(
    useCallback(() => {
      console.log('[Home] Screen focused, refreshing mood...');
      fetchTodayMood();
    }, [fetchTodayMood])
  );

  // Fetch spiral stats
  // useEffect(() => {
  //   const fetchStats = async () => {
  //     if (user) {
  //       const stats = await getTodaySpirals();
  //       setSpiralsToday(stats.today);
  //       setSpiralsThisWeek(stats.thisWeek);
  //     }
  //   };

  //   fetchStats();
  // }, [user, getTodaySpirals]);

  // Check if user needs onboarding
  useEffect(() => {
    const checkOnboarding = async () => {
      if (isMounted && !isLoading) {
        if (user && !user.onboarding_completed) {
          // Check if user has quiz data connected (either from in-app quiz or website quiz)
          // quiz_connected indicates the quiz was linked during password-setup flow
          if (user.quiz_connected || user.quiz_submission_id) {
            // User has quiz data but onboarding not complete - route to profile setup
            router.replace('/onboarding/profile-setup' as any);
            return;
          }

          // No quiz data - start from beginning
          router.replace('/onboarding');
          return;
        }

        if (!user) {
          const {
            data: { session },
          } = await supabase.auth.getSession();

          if (session?.user && !session.user.is_anonymous) {
            try {
              const { data: authUser, error: authError } = await supabase.auth.getUser();

              if (authError || !authUser.user) {
                await supabase.auth.signOut();
                router.replace('/onboarding');
                return;
              }

              const userMetadata = authUser.user.user_metadata;

              if (userMetadata && userMetadata.full_name) {
                const { error: insertError } = await supabase.from('users').insert({
                  user_id: authUser.user.id,
                  email: authUser.user.email,
                  name: userMetadata.full_name,
                  age: userMetadata.age,
                  created_at: new Date().toISOString(),
                  onboarding_completed: false,
                });

                if (insertError) {
                  await supabase.auth.signOut();
                  router.replace('/onboarding');
                  return;
                }

                router.replace('/onboarding');
                return;
              } else {
                await supabase.auth.signOut();
                router.replace('/onboarding');
                return;
              }
            } catch {
              await supabase.auth.signOut();
              router.replace('/onboarding');
              return;
            }
          }
        }
      }
    };

    checkOnboarding();
  }, [user, isLoading, isMounted, router]);

  // Show loading state
  if (isLoading || !isMounted) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.background.primary,
        }}>
        <ActivityIndicator size="large" color={colors.lime[500]} />
      </View>
    );
  }

  return (
    <ScrollControlProvider>
      <View style={{ flex: 1, backgroundColor: colors.background.primary }}>
        <StatusBar style="light" />

        <ScrollFadeView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: insets.top + spacing.safeArea.top,
          paddingBottom: 72 + insets.bottom,
        }}
        showsVerticalScrollIndicator={false}
        fadeColor={colors.background.primary}
        fadeHeight={48}
        fadeIntensity={0.95}
        fadeVisibility="always">
        {/* Header & Greeting */}
        <View
          style={{
            paddingHorizontal: spacing.screenPadding,
            marginBottom: spacing.xl,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 18,
            }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
              <Image
                source={require('@/assets/img/rounded-logo.png')}
                style={{
                  width: 48,
                  height: 48,
                  resizeMode: 'contain',
                }}
              />
              <View>
                <Text
                  style={{
                    fontSize: 24,
                    fontFamily: brandFonts.headlineBold,
                    fontWeight: '700',
                    color: colors.text.primary,
                    letterSpacing: 0.15,
                    lineHeight: 32,
                  }}>
                  {greetingLine}
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    color: colors.text.secondary,
                    marginTop: 6,
                    opacity: 0.85,
                  }}>
                  {welcomeLine}
                </Text>
              </View>
            </View>

            <Pressable
              onPress={() => {
                Haptics.selectionAsync();
                router.push('/settings' as any);
              }}
              style={{
                width: 40,
                height: 40,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {({ pressed }) => (
                <Settings size={24} color={colors.text.secondary} opacity={pressed ? 0.5 : 0.7} />
              )}
            </Pressable>
          </View>
        </View>

        {/* Daily Quote */}
        <QuoteBanner style={{ marginHorizontal: spacing.screenPadding, marginBottom: spacing.xl, alignSelf: 'flex-end' }} />

        {/* Mood Logging Card */}
        <View style={{ paddingHorizontal: spacing.screenPadding, marginBottom: spacing['2xl'] }}>
          <EmotionalWeatherWidget
            weather={todayMood?.weather as any}
            moodRating={todayMood?.intensity}
            notes={todayMood?.notes}
            createdAt={todayMood?.createdAt}
            updatedAt={todayMood?.updatedAt}
            onMoodSubmit={handleMoodSubmit}
            onUpdate={handleMoodUpdate}
          />
        </View>

        {/* Main CTA - Direct to crisis interruption */}
        <CTAButton
          title="I'M SPIRALING"
          subtitle="90-Second Reset"
          icon={Infinity}
          onPress={() => router.push('/spiral')}
        />

        {/* Feature Grid */}
        <FeatureGrid features={features} />

        {/* Bottom spacing */}
        <View style={{ height: 24 }} />
      </ScrollFadeView>
      </View>
    </ScrollControlProvider>
  );
}

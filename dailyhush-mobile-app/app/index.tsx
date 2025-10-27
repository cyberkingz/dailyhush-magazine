/**
 * DailyHush - Modern Wellness Home Screen
 * Grid layout inspired by modern wellness apps
 */

import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { View, Pressable, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Brain, TrendingUp, Settings, History, Lightbulb, Infinity } from 'lucide-react-native';

import { Text } from '@/components/ui/text';
import { useUser, useLoading } from '@/store/useStore';
import { ScrollFadeView } from '@/components/ScrollFadeView';
import { MoodCard, CTAButton, FeatureGrid, FeatureItem, QuoteBanner } from '@/components/home';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { supabase } from '@/utils/supabase';
import { useSpiral } from '@/hooks/useSpiral';

export default function HomeModern() {
  const router = useRouter();
  const user = useUser();
  const isLoading = useLoading();
  const insets = useSafeAreaInsets();
  const [spiralsToday, setSpiralsToday] = useState(0);
  const [spiralsThisWeek, setSpiralsThisWeek] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [moodLoggedToday, setMoodLoggedToday] = useState(false);
  const [currentMood, setCurrentMood] = useState<'calm' | 'good' | 'okay' | 'low' | 'anxious' | null>(null);
  const { getTodaySpirals } = useSpiral();

  // Feature grid configuration
  const features: FeatureItem[] = [
    {
      id: 'fire-training',
      title: 'F.I.R.E. Training',
      description: 'Master the Method',
      icon: Brain,
      iconColor: colors.emerald[500],
      iconBackgroundColor: colors.emerald[500] + '25',
      onPress: () => router.push('/training'),
      isInteractive: true,
    },
    {
      id: 'pattern-insights',
      title: 'Pattern Insights',
      description: 'Track Your Trends',
      icon: TrendingUp,
      iconColor: colors.emerald[400],
      iconBackgroundColor: colors.emerald[400] + '25',
      onPress: () => router.push('/insights'),
      isInteractive: true,
    },
    {
      id: 'spiral-history',
      title: 'Spiral History',
      description: 'View Your Journey',
      icon: History,
      iconColor: colors.emerald[300],
      iconBackgroundColor: colors.emerald[300] + '25',
      onPress: () => router.push('/history'),
      isInteractive: true,
    },
    {
      id: 'did-you-know',
      title: 'Did you know?',
      description: 'Name it to tame it',
      icon: Lightbulb,
      iconColor: colors.emerald[200],
      iconBackgroundColor: colors.emerald[200] + '25',
      isInteractive: false,
    },
  ];

  // Mark component as mounted
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch spiral stats
  useEffect(() => {
    const fetchStats = async () => {
      if (user) {
        const stats = await getTodaySpirals();
        setSpiralsToday(stats.today);
        setSpiralsThisWeek(stats.thisWeek);
      }
    };

    fetchStats();
  }, [user, getTodaySpirals]);

  // Check if user needs onboarding
  useEffect(() => {
    const checkOnboarding = async () => {
      if (isMounted && !isLoading) {
        if (user && !user.onboarding_completed) {
          const { data: quizData } = await supabase
            .from('quiz_submissions')
            .select('*')
            .eq('user_id', user.user_id)
            .limit(1);

          if (quizData && quizData.length > 0) {
            router.replace('/onboarding/profile-setup' as any);
            return;
          }

          router.replace('/onboarding');
          return;
        }

        if (!user) {
          const { data: { session } } = await supabase.auth.getSession();

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
            } catch (error) {
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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background.primary }}>
        <ActivityIndicator size="large" color={colors.emerald[500]} />
      </View>
    );
  }

  return (
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
        fadeVisibility="always"
      >
        {/* Header */}
        <View style={{
          paddingHorizontal: 20,
          marginBottom: 24,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <View style={{ width: 40 }} />

          <Text
            style={{
              fontSize: 20,
              fontWeight: '600',
              color: colors.text.primary,
              letterSpacing: 0.3,
            }}
          >
            DailyHush
          </Text>

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
            }}
          >
            {({ pressed }) => (
              <Settings
                size={24}
                color={colors.text.secondary}
                opacity={pressed ? 0.5 : 0.7}
              />
            )}
          </Pressable>
        </View>

        {/* Daily Quote */}
        <QuoteBanner style={{ marginHorizontal: 20, marginBottom: 24 }} />

        {/* Mood Logging Card */}
        <MoodCard
          isLogged={moodLoggedToday}
          onLogMood={() => {
            setMoodLoggedToday(true);
            setCurrentMood('good');
          }}
        />

        {/* Main CTA */}
        <CTAButton
          title="I'M SPIRALING"
          subtitle="Start Interruption Protocol"
          icon={Infinity}
          onPress={() => router.push('/spiral')}
        />

        {/* Feature Grid */}
        <FeatureGrid features={features} />

        {/* Bottom spacing */}
        <View style={{ height: 24 }} />
      </ScrollFadeView>
    </View>
  );
}

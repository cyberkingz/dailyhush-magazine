/**
 * DailyHush - Modern Wellness Home Screen
 * Grid layout inspired by modern wellness apps
 */

import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { View, Pressable, ActivityIndicator, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Brain, TrendingUp, Settings, History, Lightbulb, Infinity } from 'lucide-react-native';

import { Text } from '@/components/ui/text';
import { useUser, useLoading } from '@/store/useStore';
import { ScrollFadeView } from '@/components/ScrollFadeView';
import { CTAButton, FeatureGrid, FeatureItem, QuoteBanner } from '@/components/home';
import { EmotionalWeather } from '@/components/profile/EmotionalWeather';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { supabase } from '@/utils/supabase';
import { brandFonts } from '@/constants/profileTypography';
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

  // Navigate to mood capture flow
  const handleCheckIn = () => {
    router.push('/mood-capture/mood');
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

  // Mark component as mounted
  useEffect(() => {
    setIsMounted(true);
  }, []);

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
            paddingHorizontal: 20,
            marginBottom: 28,
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
        <QuoteBanner style={{ marginHorizontal: 20, marginBottom: 28, alignSelf: 'flex-end' }} />

        {/* Mood Logging Card */}
        <View style={{ paddingHorizontal: 20 }}>
          <EmotionalWeather onPress={handleCheckIn} />
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
  );
}

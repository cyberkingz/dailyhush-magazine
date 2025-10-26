/**
 * DailyHush - Clean Wellness Home Screen
 * Simplified, focused design for better UX
 */

import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { View, Pressable, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Brain, Info, TrendingUp, Settings, History } from 'lucide-react-native';

import { Text } from '@/components/ui/text';
import { useUser, useLoading, useStore } from '@/store/useStore';
import { PulseButton } from '@/components/PulseButton';
import { TipCard } from '@/components/TipCard';
import { QuoteGem } from '@/components/QuoteGem';
import { PremiumCard } from '@/components/PremiumCard';
import { ScrollFadeView } from '@/components/ScrollFadeView';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { supabase } from '@/utils/supabase';

export default function HomeModern() {
  const router = useRouter();
  const user = useUser();
  const isLoading = useLoading();
  const insets = useSafeAreaInsets();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [spiralsToday] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  // Mark component as mounted
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Check if user needs onboarding (only after loading is complete)
  useEffect(() => {
    const checkOnboarding = async () => {
      if (isMounted && !isLoading) {
        // CASE 1: User has profile but onboarding not completed
        if (user && !user.onboarding_completed) {
          console.log('Redirecting to onboarding - user:', user?.user_id, 'onboarding_completed:', user?.onboarding_completed);

          // Check if user has quiz data
          const { data: quizData } = await supabase
            .from('quiz_submissions')
            .select('*')
            .eq('user_id', user.user_id)
            .limit(1);

          if (quizData && quizData.length > 0) {
            // User has quiz data, send them to profile setup instead of full onboarding
            console.log('User has quiz data, redirecting to profile setup');
            router.replace('/onboarding/profile-setup' as any);
            return;
          }

          // No quiz data, do full onboarding
          router.replace('/onboarding');
          return;
        }

        // CASE 2: No profile but auth session exists
        // This could be either:
        // A) Orphaned account (profile creation failed during signup) - recoverable
        // B) Deleted account (signOut didn't clear session) - should restart onboarding
        if (!user) {
          const { data: { session } } = await supabase.auth.getSession();

          if (session?.user && !session.user.is_anonymous) {
            console.log('⚠️ Auth account exists but no profile - checking account state');

            // DEFENSIVE: Check if this is a deleted account by verifying auth account exists
            // If the Edge Function successfully deleted the auth account, this session is stale
            try {
              const { data: authUser, error: authError } = await supabase.auth.getUser();

              if (authError || !authUser.user) {
                console.log('🗑️ Stale session detected (account deleted) - clearing and restarting');
                await supabase.auth.signOut();
                router.replace('/onboarding');
                return;
              }
            } catch (error) {
              console.error('Error checking auth user:', error);
              // If we can't verify, err on the side of caution - restart onboarding
              await supabase.auth.signOut();
              router.replace('/onboarding');
              return;
            }

            console.log('⚠️ Valid auth account but no profile - checking for quiz data to recover');

            // Check if user has quiz data by email
            const { data: quizData } = await supabase
              .from('quiz_submissions')
              .select('*')
              .eq('email', session.user.email)
              .order('created_at', { ascending: false })
              .limit(1);

            if (quizData && quizData.length > 0) {
              console.log('✅ Found quiz data for orphaned account - redirecting to profile setup');
              // User has quiz data, just needs to complete profile setup
              router.replace('/onboarding/profile-setup' as any);
              return;
            }

            // No quiz data for this email, do full onboarding
            console.log('No quiz data found for orphaned account - starting onboarding');
            router.replace('/onboarding');
          }
        }
      }
    };

    checkOnboarding();
  }, [user, isMounted, isLoading]);

  // Get natural greeting based on time of day
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, [currentTime]);


  // Show loading screen while:
  // 1. User profile is being loaded (isLoading)
  // 2. User needs onboarding (prevent flash of home page)
  if (isLoading || (isMounted && !isLoading && user && !user.onboarding_completed)) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background.primary, justifyContent: 'center', alignItems: 'center' }}>
        <StatusBar style="light" />
        <ActivityIndicator size="large" color="#40916C" />
        <Text className="text-[#95B8A8] text-sm mt-4">Loading...</Text>
      </View>
    );
  }

  // Also show loading if no user but we're still checking
  if (isMounted && !isLoading && !user) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background.primary, justifyContent: 'center', alignItems: 'center' }}>
        <StatusBar style="light" />
        <ActivityIndicator size="large" color="#40916C" />
        <Text className="text-[#95B8A8] text-sm mt-4">Loading...</Text>
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
          paddingBottom: 72 + insets.bottom, // Account for bottom nav (48px bar height + 24px spacing)
        }}
        showsVerticalScrollIndicator={false}
        fadeColor={colors.background.primary}
        fadeHeight={48}
        fadeIntensity={0.95}
        fadeVisibility="always"
      >
        {/* Natural Header Section - iOS Native Layout Pattern */}
        <View style={{
          paddingLeft: Math.max(insets.left, 20), // Ensure minimum 20px padding
          paddingRight: Math.max(insets.right, 20),
          marginBottom: 8
        }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            minHeight: 64, // Match button height for vertical alignment
          }}>
            {/* Text Container - Flexible with proper constraints */}
            <View style={{
              flex: 1,
              minWidth: 0, // Critical: allows text to shrink below content size
              marginRight: 8, // Spacing from button
              justifyContent: 'center',
            }}>
              <Text
                style={{
                  fontSize: 26, // Optimized for accessibility without overflow
                  fontWeight: 'bold',
                  color: colors.text.primary,
                  marginBottom: 4,
                }}
                numberOfLines={1}
                ellipsizeMode="tail"
                adjustsFontSizeToFit={false}
              >
                {getGreeting()}
              </Text>
              {user?.name && (
                <Text
                  style={{
                    fontSize: 17,
                    color: colors.text.secondary,
                    opacity: 0.8,
                  }}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {user.name}
                </Text>
              )}
            </View>

            {/* Settings Button - WCAG AAA touch target for 55-70 demographic */}
            <Pressable
              onPress={() => {
                Haptics.selectionAsync();
                router.push('/settings' as any);
              }}
              style={{
                width: 56, // WCAG AAA minimum for touch targets
                height: 56,
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {({ pressed }) => (
                <Settings
                  size={26}
                  color={colors.text.secondary}
                  strokeWidth={2}
                  opacity={pressed ? 0.5 : 0.6}
                />
              )}
            </Pressable>
          </View>
        </View>

        {/* Daily Quote Gem - Hero Section */}
        <QuoteGem />

        {/* Today Stats */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <Text
            style={{
              color: colors.text.primary,
              fontSize: 22,
              fontWeight: 'bold',
              marginBottom: 12,
            }}
          >
            Today
          </Text>
          <PremiumCard variant="default">
            <View style={{ padding: 20 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: colors.text.secondary,
                      fontSize: 16,
                      marginBottom: 8,
                    }}
                  >
                    Spirals interrupted
                  </Text>
                  <Text
                    style={{
                      color: colors.emerald[500],
                      fontSize: 40,
                      fontWeight: 'bold',
                      lineHeight: 48,
                    }}
                  >
                    {spiralsToday}
                  </Text>
                </View>
                {spiralsToday > 0 && (
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text
                      style={{
                        color: colors.text.secondary,
                        fontSize: 14,
                        marginBottom: 8,
                        textAlign: 'right',
                      }}
                    >
                      You&apos;re getting better{'\n'}at this
                    </Text>
                    <Pressable onPress={() => router.push('/insights')}>
                      <Text
                        style={{
                          color: colors.emerald[500],
                          fontSize: 16,
                          fontWeight: '600',
                        }}
                      >
                        View patterns →
                      </Text>
                    </Pressable>
                  </View>
                )}
              </View>
            </View>
          </PremiumCard>
        </View>

        {/* Main CTA - I'm Spiraling Button */}
        <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
          <PulseButton
            onPress={() => router.push('/spiral')}
            title="I'M SPIRALING"
            subtitle="We're here. Let's break this together."
            variant="primary"
            enablePulse={true}
          />
        </View>

        {/* Button Description */}
        <Text
          style={{
            color: colors.text.secondary,
            textAlign: 'center',
            fontSize: 16,
            marginBottom: 32,
            paddingHorizontal: 32,
            lineHeight: 24,
          }}
        >
          That conversation isn't happening right now. But your body thinks it is. We'll interrupt this loop together. 90 seconds.
        </Text>

        {/* F.I.R.E. Training Card */}
        <View style={{ paddingHorizontal: 20 }}>
          <PremiumCard
            onPress={async () => {
              await Haptics.selectionAsync();
              router.push('/training');
            }}
            variant="elevated"
            style={{ marginBottom: 16 }}
          >
          <View
            style={{
              padding: 20,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              <View
                style={{
                  backgroundColor: colors.emerald[600] + '30',
                  padding: 12,
                  borderRadius: 16,
                  marginRight: 16,
                }}
              >
                <Brain size={24} color={colors.emerald[500]} strokeWidth={2} />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: colors.text.primary,
                    fontSize: 20,
                    fontWeight: '600',
                    marginBottom: 4,
                  }}
                >
                  F.I.R.E. Training
                </Text>
                <Text
                  style={{
                    color: colors.text.secondary,
                    fontSize: 16,
                    lineHeight: 24,
                  }}
                >
                  Start your training to understand rumination
                </Text>
              </View>
            </View>
            <Text style={{ color: colors.emerald[500], fontSize: 20, marginLeft: 8 }}>→</Text>
          </View>
        </PremiumCard>
        </View>

        {/* Pattern Insights Card */}
        <View style={{ paddingHorizontal: 20 }}>
          <PremiumCard
            onPress={async () => {
              await Haptics.selectionAsync();
              router.push('/insights');
            }}
            variant="elevated"
            style={{ marginBottom: 16 }}
          >
          <View
            style={{
              padding: 20,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              <View
                style={{
                  backgroundColor: colors.emerald[600] + '30',
                  padding: 12,
                  borderRadius: 16,
                  marginRight: 16,
                }}
              >
                <TrendingUp size={24} color={colors.emerald[500]} strokeWidth={2} />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: colors.text.primary,
                    fontSize: 20,
                    fontWeight: '600',
                    marginBottom: 4,
                  }}
                >
                  Pattern Insights
                </Text>
                <Text
                  style={{
                    color: colors.text.secondary,
                    fontSize: 16,
                    lineHeight: 24,
                  }}
                >
                  {spiralsToday > 0 ? 'See what triggers YOUR spirals' : 'Track your progress over time'}
                </Text>
              </View>
            </View>
            <Text style={{ color: colors.emerald[500], fontSize: 20, marginLeft: 8 }}>→</Text>
          </View>
        </PremiumCard>
        </View>

        {/* Spiral History Card */}
        <View style={{ paddingHorizontal: 20 }}>
          <PremiumCard
            onPress={async () => {
              await Haptics.selectionAsync();
              router.push('/history');
            }}
            variant="elevated"
            style={{ marginBottom: 24 }}
          >
          <View
            style={{
              padding: 20,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              <View
                style={{
                  backgroundColor: colors.emerald[600] + '30',
                  padding: 12,
                  borderRadius: 16,
                  marginRight: 16,
                }}
              >
                <History size={24} color={colors.emerald[500]} strokeWidth={2} />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: colors.text.primary,
                    fontSize: 20,
                    fontWeight: '600',
                    marginBottom: 4,
                  }}
                >
                  Spiral History
                </Text>
                <Text
                  style={{
                    color: colors.text.secondary,
                    fontSize: 16,
                    lineHeight: 24,
                  }}
                >
                  Review all your past spirals
                </Text>
              </View>
            </View>
            <Text style={{ color: colors.emerald[500], fontSize: 20, marginLeft: 8 }}>→</Text>
          </View>
        </PremiumCard>
        </View>

        {/* Daily Tip Card */}
        <View style={{ paddingHorizontal: 20 }}>
          <TipCard />
        </View>
      </ScrollFadeView>
    </View>
  );
}

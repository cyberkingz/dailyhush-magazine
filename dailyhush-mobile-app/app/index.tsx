/**
 * DailyHush - Modern Wellness Home Screen
 * Redesigned with cleaner layout and better breathing room
 */

import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { View, Pressable, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Brain, TrendingUp, Settings, History, Sparkles } from 'lucide-react-native';

import { Text } from '@/components/ui/text';
import { useUser, useLoading, useStore } from '@/store/useStore';
import { PulseButton } from '@/components/PulseButton';
import { PremiumCard } from '@/components/PremiumCard';
import { ScrollFadeView } from '@/components/ScrollFadeView';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { supabase } from '@/utils/supabase';
import { useSpiral } from '@/hooks/useSpiral';

export default function HomeModern() {
  const router = useRouter();
  const user = useUser();
  const isLoading = useLoading();
  const insets = useSafeAreaInsets();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [spiralsToday, setSpiralsToday] = useState(0);
  const [spiralsThisWeek, setSpiralsThisWeek] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const { getTodaySpirals } = useSpiral();

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
        if (!user) {
          const { data: { session } } = await supabase.auth.getSession();

          if (session?.user && !session.user.is_anonymous) {
            console.log('⚠️ Auth account exists but no profile - checking account state');

            try {
              const { data: authUser, error: authError } = await supabase.auth.getUser();

              if (authError || !authUser.user) {
                console.log('🗑️ Stale session detected (account deleted) - clearing and restarting');
                await supabase.auth.signOut();
                router.replace('/onboarding');
                return;
              }

              // Auth account exists, profile is missing - this is recoverable
              console.log('✅ Auth account valid but profile missing - attempting recovery');

              // Try to fetch user metadata
              const userMetadata = authUser.user.user_metadata;

              if (userMetadata && userMetadata.full_name) {
                console.log('📝 Found metadata, creating missing profile:', {
                  name: userMetadata.full_name,
                  email: authUser.user.email,
                });

                // Create the missing profile
                const { error: insertError } = await supabase.from('users').insert({
                  user_id: authUser.user.id,
                  email: authUser.user.email,
                  name: userMetadata.full_name,
                  age: userMetadata.age,
                  created_at: new Date().toISOString(),
                  onboarding_completed: false, // Will need to complete onboarding
                });

                if (insertError) {
                  console.error('❌ Failed to create profile:', insertError);
                  // If we can't recover, sign out and start fresh
                  await supabase.auth.signOut();
                  router.replace('/onboarding');
                  return;
                }

                console.log('✅ Profile created successfully, redirecting to complete onboarding');
                router.replace('/onboarding');
                return;
              } else {
                console.log('❌ No metadata found, cannot recover - clearing session');
                await supabase.auth.signOut();
                router.replace('/onboarding');
                return;
              }
            } catch (error) {
              console.error('Error during recovery check:', error);
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

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

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
        {/* Header - Minimal and elegant */}
        <View style={{
          paddingHorizontal: 24,
          marginBottom: 32,
        }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 32,
                  fontWeight: '700',
                  color: colors.text.primary,
                  letterSpacing: -0.5,
                }}
                numberOfLines={1}
              >
                {getGreeting()}
              </Text>
              {user?.name && (
                <Text
                  style={{
                    fontSize: 16,
                    color: colors.text.secondary,
                    marginTop: 4,
                    opacity: 0.7,
                  }}
                  numberOfLines={1}
                >
                  {user.name}
                </Text>
              )}
            </View>

            <Pressable
              onPress={() => {
                Haptics.selectionAsync();
                router.push('/settings' as any);
              }}
              style={{
                width: 48,
                height: 48,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: 12,
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
        </View>

        {/* Hero Section - Main CTA */}
        <View style={{ paddingHorizontal: 24, marginBottom: 24 }}>
          <PulseButton
            onPress={() => router.push('/spiral')}
            title="I'M SPIRALING"
            subtitle="Break the loop. 90 seconds."
            variant="primary"
            enablePulse={true}
          />

          <Text
            style={{
              color: colors.text.secondary,
              textAlign: 'center',
              fontSize: 15,
              marginTop: 16,
              paddingHorizontal: 8,
              lineHeight: 22,
              opacity: 0.7,
            }}
          >
            That conversation isn't happening right now.{'\n'}
            But your body thinks it is. We're here.
          </Text>
        </View>

        {/* Daily Quote - Subtle accent */}
        <View style={{ paddingHorizontal: 24, marginBottom: 32 }}>
          <PremiumCard variant="elevated">
            <View style={{
              padding: 20,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
            }}>
              <View style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: colors.emerald[500] + '20',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Sparkles size={20} color={colors.emerald[500]} />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: colors.text.secondary,
                    fontSize: 13,
                    marginBottom: 4,
                    opacity: 0.6,
                  }}
                >
                  Daily insight
                </Text>
                <Text
                  style={{
                    color: colors.text.primary,
                    fontSize: 15,
                    lineHeight: 22,
                  }}
                >
                  "Your thoughts are not facts. They're just thoughts passing through."
                </Text>
              </View>
            </View>
          </PremiumCard>
        </View>

        {/* Progress Stats - Consolidated single card */}
        <View style={{ paddingHorizontal: 24, marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: '600',
              color: colors.text.primary,
              marginBottom: 16,
              letterSpacing: -0.3,
            }}
          >
            Your Progress
          </Text>

          <PremiumCard
            variant="default"
            onPress={() => router.push('/insights')}
          >
            <View style={{ padding: 20 }}>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                marginBottom: spiralsToday > 0 ? 16 : 0,
              }}>
                {/* Today */}
                <View style={{ alignItems: 'center', flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 36,
                      fontWeight: '700',
                      color: colors.emerald[500],
                      letterSpacing: -1,
                    }}
                  >
                    {spiralsToday}
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      color: colors.text.secondary,
                      marginTop: 4,
                      opacity: 0.7,
                    }}
                  >
                    Today
                  </Text>
                </View>

                {/* Divider */}
                <View
                  style={{
                    width: 1,
                    backgroundColor: colors.text.secondary,
                    opacity: 0.1,
                    marginHorizontal: 20,
                  }}
                />

                {/* This Week */}
                <View style={{ alignItems: 'center', flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 36,
                      fontWeight: '700',
                      color: colors.emerald[500],
                      letterSpacing: -1,
                    }}
                  >
                    {spiralsThisWeek}
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      color: colors.text.secondary,
                      marginTop: 4,
                      opacity: 0.7,
                    }}
                  >
                    This Week
                  </Text>
                </View>
              </View>

              {/* Encouragement */}
              {spiralsToday > 0 && (
                <View style={{
                  paddingTop: 16,
                  borderTopWidth: 1,
                  borderTopColor: colors.text.secondary + '10',
                }}>
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                    <Text
                      style={{
                        color: colors.text.secondary,
                        fontSize: 14,
                        flex: 1,
                      }}
                    >
                      You're building new patterns
                    </Text>
                    <Text
                      style={{
                        color: colors.emerald[500],
                        fontSize: 14,
                        fontWeight: '600',
                      }}
                    >
                      View →
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </PremiumCard>
        </View>

        {/* Feature Cards - Clean and spacious */}
        <View style={{ paddingHorizontal: 24, gap: 16 }}>
          {/* F.I.R.E. Training */}
          <PremiumCard
            onPress={async () => {
              await Haptics.selectionAsync();
              router.push('/training');
            }}
            variant="elevated"
          >
            <View style={{
              padding: 20,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 16,
            }}>
              <View style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                backgroundColor: colors.emerald[500] + '20',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Brain size={28} color={colors.emerald[500]} />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '600',
                    color: colors.text.primary,
                    marginBottom: 4,
                  }}
                >
                  F.I.R.E. Training
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.text.secondary,
                    opacity: 0.7,
                    lineHeight: 20,
                  }}
                >
                  Master the 4-step protocol
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 24,
                  color: colors.text.secondary,
                  opacity: 0.3,
                }}
              >
                →
              </Text>
            </View>
          </PremiumCard>

          {/* Pattern Insights */}
          <PremiumCard
            onPress={async () => {
              await Haptics.selectionAsync();
              router.push('/insights');
            }}
            variant="elevated"
          >
            <View style={{
              padding: 20,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 16,
            }}>
              <View style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                backgroundColor: colors.blue[500] + '20',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <TrendingUp size={28} color={colors.blue[500]} />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '600',
                    color: colors.text.primary,
                    marginBottom: 4,
                  }}
                >
                  Pattern Insights
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.text.secondary,
                    opacity: 0.7,
                    lineHeight: 20,
                  }}
                >
                  Track your triggers & wins
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 24,
                  color: colors.text.secondary,
                  opacity: 0.3,
                }}
              >
                →
              </Text>
            </View>
          </PremiumCard>

          {/* Spiral History */}
          <PremiumCard
            onPress={async () => {
              await Haptics.selectionAsync();
              router.push('/history');
            }}
            variant="elevated"
          >
            <View style={{
              padding: 20,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 16,
            }}>
              <View style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                backgroundColor: colors.purple[500] + '20',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <History size={28} color={colors.purple[500]} />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '600',
                    color: colors.text.primary,
                    marginBottom: 4,
                  }}
                >
                  Spiral History
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.text.secondary,
                    opacity: 0.7,
                    lineHeight: 20,
                  }}
                >
                  Review past sessions
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 24,
                  color: colors.text.secondary,
                  opacity: 0.3,
                }}
              >
                →
              </Text>
            </View>
          </PremiumCard>
        </View>

        {/* Bottom spacing */}
        <View style={{ height: 24 }} />
      </ScrollFadeView>
    </View>
  );
}

/**
 * DailyHush - Clean Wellness Home Screen
 * Simplified, focused design for better UX
 */

import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Brain, Moon, Info, TrendingUp, Settings } from 'lucide-react-native';

import { Text } from '@/components/ui/text';
import { useUser } from '@/store/useStore';
import { PulseButton } from '@/components/PulseButton';
import { TipCard } from '@/components/TipCard';
import { QuoteGem } from '@/components/QuoteGem';
import { PremiumCard } from '@/components/PremiumCard';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';

export default function HomeModern() {
  const router = useRouter();
  const user = useUser();
  const insets = useSafeAreaInsets();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [spiralsToday] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  // Mark component as mounted
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Check if user needs onboarding (null user OR onboarding not completed)
  useEffect(() => {
    if (isMounted && (!user || !user.onboarding_completed)) {
      router.replace('/onboarding');
    }
  }, [user, isMounted]);

  // Check if 3AM mode is active
  const is3AMMode = currentTime.getHours() >= 22 || currentTime.getHours() < 6;

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


  return (
    <View style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <StatusBar style="light" />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: insets.top + spacing.safeArea.top,
          paddingBottom: 80 + insets.bottom, // Account for bottom nav (56px button + 12px top padding + 12px bottom padding)
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Natural Header Section - iOS Native Layout Pattern */}
        <View style={{
          paddingLeft: insets.left + 20,
          paddingRight: insets.right + 20,
          marginBottom: 8
        }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            minHeight: 44, // iOS minimum touch target
          }}>
            {/* Text Container - Flexible with proper constraints */}
            <View style={{
              flex: 1,
              flexShrink: 1,
              flexGrow: 1,
              minWidth: 0, // Critical: allows text to shrink below content size
              paddingRight: 12, // Guaranteed spacing from button
              justifyContent: 'center',
            }}>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: 'bold',
                  color: colors.text.primary,
                  marginBottom: 4,
                }}
                numberOfLines={1}
                ellipsizeMode="tail" // iOS standard: truncate at end with ellipsis
                adjustsFontSizeToFit={false} // Prevent auto-scaling on iOS
              >
                {getGreeting()}
              </Text>
              {user?.name && (
                <Text
                  style={{
                    fontSize: 16,
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

            {/* Settings Button - Fixed width, iOS standard hit target */}
            <Pressable
              onPress={() => {
                Haptics.selectionAsync();
                router.push('/settings' as any);
              }}
              style={{
                width: 44, // iOS minimum touch target width
                height: 44, // iOS minimum touch target height
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0, // Never shrink button
              }}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} // Extended hit area
            >
              {({ pressed }) => (
                <Settings
                  size={22}
                  color={colors.text.secondary}
                  strokeWidth={2}
                  opacity={pressed ? 0.5 : 0.6}
                />
              )}
            </Pressable>
          </View>
        </View>

        {/* 3AM Mode Active Banner */}
        {is3AMMode && (
          <View style={{ paddingHorizontal: 20 }}>
            <PremiumCard
              onPress={() => router.push('/night-mode' as any)}
              variant="elevated"
              style={{ marginBottom: 24 }}
            >
              <View style={{ padding: 20 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                  <Moon size={20} color={colors.text.primary} strokeWidth={2} />
                  <Text
                    style={{
                      color: colors.text.primary,
                      fontSize: 16,
                      fontWeight: '600',
                      marginLeft: 8,
                    }}
                  >
                    3AM Mode Active
                  </Text>
                </View>
                <Text
                  style={{
                    color: colors.emerald[200],
                    fontSize: 14,
                    lineHeight: 20,
                  }}
                >
                  Sleep-friendly protocols are ready. Red light mode protects your sleep.
                </Text>
              </View>
            </PremiumCard>
          </View>
        )}

        {/* Daily Quote Gem - Hero Section */}
        <QuoteGem />

        {/* Today Stats */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <Text
            style={{
              color: colors.text.primary,
              fontSize: 20,
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
                      fontSize: 14,
                      marginBottom: 8,
                    }}
                  >
                    Spirals interrupted
                  </Text>
                  <Text
                    style={{
                      color: colors.emerald[500],
                      fontSize: 36,
                      fontWeight: 'bold',
                      lineHeight: 44,
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
                        fontSize: 12,
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
                          fontSize: 14,
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
            icon={<Info size={32} color={colors.white} strokeWidth={2} />}
            variant="primary"
            enablePulse={false}
          />
        </View>

        {/* Button Description */}
        <Text
          style={{
            color: colors.text.secondary,
            textAlign: 'center',
            fontSize: 14,
            marginBottom: 32,
            paddingHorizontal: 32,
            lineHeight: 20,
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
                    fontSize: 18,
                    fontWeight: '600',
                    marginBottom: 4,
                  }}
                >
                  F.I.R.E. Training
                </Text>
                <Text
                  style={{
                    color: colors.text.secondary,
                    fontSize: 14,
                    lineHeight: 20,
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
                <TrendingUp size={24} color={colors.emerald[500]} strokeWidth={2} />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: colors.text.primary,
                    fontSize: 18,
                    fontWeight: '600',
                    marginBottom: 4,
                  }}
                >
                  Pattern Insights
                </Text>
                <Text
                  style={{
                    color: colors.text.secondary,
                    fontSize: 14,
                    lineHeight: 20,
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

        {/* Daily Tip Card */}
        <View style={{ paddingHorizontal: 20 }}>
          <TipCard />
        </View>
      </ScrollView>
    </View>
  );
}

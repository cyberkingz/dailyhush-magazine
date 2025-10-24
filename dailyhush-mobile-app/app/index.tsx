/**
 * DailyHush - Clean Wellness Home Screen
 * Simplified, focused design for better UX
 */

import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Brain, Moon, Info, TrendingUp } from 'lucide-react-native';

import { Text } from '@/components/ui/text';
import { useUser } from '@/store/useStore';
import { PulseButton } from '@/components/PulseButton';
import { TipCard } from '@/components/TipCard';
import { PremiumCard } from '@/components/PremiumCard';
import { colors } from '@/constants/colors';

export default function HomeModern() {
  const router = useRouter();
  const user = useUser();
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
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
      >

        {/* 3AM Mode Active Banner */}
        {is3AMMode && (
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
        )}

        {/* Today Stats */}
        <View style={{ marginBottom: 24 }}>
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
        <View style={{ marginBottom: 16 }}>
          <PulseButton
            onPress={() => router.push('/spiral')}
            title="I'M SPIRALING"
            subtitle="Tap to interrupt"
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
          We&apos;ll guide you through a 90-second protocol to interrupt rumination.
        </Text>

        {/* F.I.R.E. Training Card */}
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

        {/* Pattern Insights Card */}
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

        {/* Daily Tip Card */}
        <TipCard />
      </ScrollView>
    </View>
  );
}

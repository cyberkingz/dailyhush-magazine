/**
 * DailyHush - Clean Wellness Home Screen
 * Simplified, focused design for better UX
 */

import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Brain, Moon, Info, Settings, TrendingUp } from 'lucide-react-native';

import { Text } from '@/components/ui/text';
import { useUser } from '@/store/useStore';
import { PulseButton } from '@/components/PulseButton';

export default function HomeModern() {
  const router = useRouter();
  const user = useUser();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [spiralsToday, setSpiralsToday] = useState(0);
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
    <View className="flex-1 bg-[#0A1612]">
      <StatusBar style="light" />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
      >

        {/* 3AM Mode Active Banner */}
        {is3AMMode && (
          <Pressable
            onPress={() => router.push('/night-mode' as any)}
            className="mb-6 active:opacity-80"
          >
            <View className="bg-[#2D6A4F] rounded-2xl p-4">
              <View className="flex-row items-center mb-2">
                <Moon size={20} color="#E8F4F0" strokeWidth={2} />
                <Text className="text-[#E8F4F0] text-base font-semibold ml-2">
                  3AM Mode Active
                </Text>
              </View>
              <Text className="text-[#B7E4C7] text-sm leading-relaxed">
                Sleep-friendly protocols are ready. Red light mode protects your sleep.
              </Text>
            </View>
          </Pressable>
        )}

        {/* Today Stats */}
        <View className="mb-6">
          <Text className="text-[#E8F4F0] text-xl font-bold mb-3">
            Today
          </Text>
          <View className="bg-[#0F1F1A] rounded-2xl p-5 border border-[#40916C]/15">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-[#95B8A8] text-sm mb-2">
                  Spirals interrupted
                </Text>
                <Text className="text-[#40916C] text-4xl font-bold">
                  {spiralsToday}
                </Text>
              </View>
              {spiralsToday > 0 && (
                <View className="items-end">
                  <Text className="text-[#95B8A8] text-xs mb-2 text-right">
                    You're getting better{'\n'}at this
                  </Text>
                  <Pressable onPress={() => router.push('/insights')}>
                    <Text className="text-[#52B788] text-sm font-medium">
                      View patterns →
                    </Text>
                  </Pressable>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Main CTA - I'm Spiraling Button */}
        <View className="mb-4">
          <PulseButton
            onPress={() => router.push('/spiral')}
            title="I'M SPIRALING"
            subtitle="Tap to interrupt"
            icon={<Info size={32} color="#E8F4F0" strokeWidth={2} />}
            variant="primary"
            enablePulse={true}
          />
        </View>

        {/* Button Description */}
        <Text className="text-[#95B8A8] text-center text-sm mb-8 px-8 leading-relaxed">
          We'll guide you through a 90-second protocol to interrupt rumination.
        </Text>

        {/* F.I.R.E. Training Card */}
        <Pressable
          onPress={async () => {
            await Haptics.selectionAsync();
            router.push('/training');
          }}
          className="mb-4 active:opacity-90"
        >
          <View className="bg-[#1A4D3C] rounded-2xl p-5 flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <View className="bg-[#40916C]/20 p-3 rounded-xl mr-4">
                <Brain size={24} color="#52B788" strokeWidth={2} />
              </View>
              <View className="flex-1">
                <Text className="text-[#E8F4F0] text-lg font-semibold mb-1">
                  F.I.R.E. Training
                </Text>
                <Text className="text-[#95B8A8] text-sm leading-relaxed">
                  Start your training to understand rumination
                </Text>
              </View>
            </View>
            <Text className="text-[#52B788] text-xl ml-2">→</Text>
          </View>
        </Pressable>

        {/* Pattern Insights Card */}
        <Pressable
          onPress={async () => {
            await Haptics.selectionAsync();
            router.push('/insights');
          }}
          className="mb-6 active:opacity-90"
        >
          <View className="bg-[#1A4D3C] rounded-2xl p-5 flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <View className="bg-[#40916C]/20 p-3 rounded-xl mr-4">
                <TrendingUp size={24} color="#52B788" strokeWidth={2} />
              </View>
              <View className="flex-1">
                <Text className="text-[#E8F4F0] text-lg font-semibold mb-1">
                  Pattern Insights
                </Text>
                <Text className="text-[#95B8A8] text-sm leading-relaxed">
                  {spiralsToday > 0 ? 'See what triggers YOUR spirals' : 'Track your progress over time'}
                </Text>
              </View>
            </View>
            <Text className="text-[#52B788] text-xl ml-2">→</Text>
          </View>
        </Pressable>

        {/* Helpful Tip Card */}
        <View className="bg-[#1A4D3C] border border-[#40916C]/30 rounded-2xl p-5">
          <Text className="text-[#E8F4F0] text-base font-semibold mb-2">
            Did you know?
          </Text>
          <Text className="text-[#95B8A8] text-sm leading-relaxed">
            Most spirals happen in the first 10 seconds. The faster you interrupt, the easier it is to stop.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

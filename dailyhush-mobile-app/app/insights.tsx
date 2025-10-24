/**
 * DailyHush - Pattern Insights Dashboard
 * Clean, modern insights page matching home design
 */

import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ScrollView, Pressable } from 'react-native';
import { ArrowLeft, TrendingUp, Clock, Lightbulb, Sparkles } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { Text } from '@/components/ui/text';

export default function Insights() {
  const router = useRouter();

  // Mock data (will be replaced with real Supabase data)
  const weeklyData = {
    totalSpirals: 21,
    spiralsPrevented: 5,
    avgDuration: 180, // seconds
    mostCommonTrigger: 'Conversations with daughter',
    peakTime: '3:00 AM',
    improvementVsLastWeek: 40, // percentage
    insights: [
      'You spiral less after morning exercise',
      'Tuesday evenings are your hardest time',
      '3AM spirals usually follow late dinners',
    ],
  };

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

        {/* Progress Card */}
        <View className="bg-[#2D6A4F] rounded-2xl p-5 mb-6">
          <View className="flex-row items-center mb-3">
            <Sparkles size={24} color="#B7E4C7" strokeWidth={2} />
            <Text className="text-[#E8F4F0] text-lg font-bold ml-2">
              {weeklyData.improvementVsLastWeek}% Better
            </Text>
          </View>
          <Text className="text-[#B7E4C7] text-sm leading-relaxed">
            You're spiraling less than last week. Keep going!
          </Text>
        </View>

        {/* Stats Grid */}
        <View className="flex-row gap-4 mb-6">
          <View className="flex-1 bg-[#0F1F1A] rounded-2xl p-5 border border-[#40916C]/15">
            <Text className="text-[#E8F4F0] text-3xl font-bold mb-1">
              {weeklyData.totalSpirals}
            </Text>
            <Text className="text-[#95B8A8] text-sm">
              Total Spirals
            </Text>
          </View>

          <View className="flex-1 bg-[#0F1F1A] rounded-2xl p-5 border border-[#40916C]/15">
            <Text className="text-[#E8F4F0] text-3xl font-bold mb-1">
              {weeklyData.spiralsPrevented}
            </Text>
            <Text className="text-[#95B8A8] text-sm">
              Prevented
            </Text>
          </View>
        </View>

        {/* Peak Time Card */}
        <View className="bg-[#1A4D3C] rounded-2xl p-5 mb-4">
          <View className="flex-row items-center mb-3">
            <View className="bg-[#40916C]/20 p-2 rounded-xl mr-3">
              <Clock size={20} color="#52B788" strokeWidth={2} />
            </View>
            <Text className="text-[#95B8A8] text-sm">
              Your Peak Spiral Time
            </Text>
          </View>
          <Text className="text-[#E8F4F0] text-2xl font-bold mb-2">
            {weeklyData.peakTime}
          </Text>
          <Text className="text-[#95B8A8] text-sm leading-relaxed">
            Most spirals happen around this time
          </Text>
        </View>

        {/* Most Common Trigger Card */}
        <View className="bg-[#1A4D3C] rounded-2xl p-5 mb-6">
          <View className="flex-row items-center mb-3">
            <View className="bg-[#40916C]/20 p-2 rounded-xl mr-3">
              <TrendingUp size={20} color="#52B788" strokeWidth={2} />
            </View>
            <Text className="text-[#95B8A8] text-sm">
              Most Common Trigger
            </Text>
          </View>
          <Text className="text-[#E8F4F0] text-lg font-semibold">
            {weeklyData.mostCommonTrigger}
          </Text>
        </View>

        {/* Your Patterns Card */}
        <View className="bg-[#1A4D3C] rounded-2xl p-5 mb-6">
          <View className="flex-row items-center mb-4">
            <Lightbulb size={20} color="#52B788" strokeWidth={2} />
            <Text className="text-[#E8F4F0] text-lg font-bold ml-2">
              Your Patterns
            </Text>
          </View>

          {weeklyData.insights.map((insight, index) => (
            <View
              key={index}
              className={`flex-row items-start ${
                index < weeklyData.insights.length - 1 ? 'mb-3' : ''
              }`}
            >
              <Text className="text-[#52B788] mr-2 text-base">•</Text>
              <Text className="flex-1 text-[#95B8A8] text-sm leading-relaxed">
                {insight}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

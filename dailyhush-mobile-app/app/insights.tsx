/**
 * DailyHush - Pattern Insights Dashboard
 * Clean, modern insights page matching home design
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TrendingUp, Clock, Lightbulb, Sparkles, BarChart3 } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { Text } from '@/components/ui/text';
import { ScrollFadeView } from '@/components/ScrollFadeView';
import { useUser } from '@/store/useStore';
import { getWeeklyInsights, WeeklyInsights } from '@/services/insights';

export default function Insights() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const user = useUser();

  const [loading, setLoading] = useState(true);
  const [weeklyData, setWeeklyData] = useState<WeeklyInsights | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch weekly insights on component mount
  useEffect(() => {
    const fetchInsights = async () => {
      if (!user?.user_id) {
        setError('Please sign in to view insights');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      const result = await getWeeklyInsights(user.user_id);

      if (!result.success || !result.data) {
        setError(result.error || 'Failed to load insights');
        setLoading(false);
        return;
      }

      setWeeklyData(result.data);
      setLoading(false);
    };

    fetchInsights();
  }, [user?.user_id]);

  // Format seconds to readable duration
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    if (minutes === 0) return `${seconds}s`;
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  return (
    <View className="flex-1 bg-[#0A1612]">
      <StatusBar style="light" />

      {/* Loading State */}
      {loading && (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#40916C" />
          <Text className="text-[#95B8A8] text-sm mt-4">
            Loading your insights...
          </Text>
        </View>
      )}

      {/* Error State */}
      {!loading && error && (
        <View className="flex-1 items-center justify-center px-6">
          <BarChart3 size={48} color="#95B8A8" strokeWidth={2} />
          <Text className="text-[#E8F4F0] text-xl font-bold mt-4 text-center">
            Unable to Load Insights
          </Text>
          <Text className="text-[#95B8A8] text-sm mt-2 text-center">
            {error}
          </Text>
        </View>
      )}

      {/* Empty State - No spiral logs yet */}
      {!loading && !error && weeklyData && weeklyData.totalSpirals === 0 && (
        <View className="flex-1 items-center justify-center px-6">
          <BarChart3 size={48} color="#95B8A8" strokeWidth={2} />
          <Text className="text-[#E8F4F0] text-xl font-bold mt-4 text-center">
            No Insights Yet
          </Text>
          <Text className="text-[#95B8A8] text-sm mt-2 text-center leading-relaxed">
            Start logging your spirals to see patterns and insights. Your first insights will appear after you've logged a few spirals this week.
          </Text>
        </View>
      )}

      {/* Data State - Show insights */}
      {!loading && !error && weeklyData && weeklyData.totalSpirals > 0 && (
        <ScrollFadeView
          className="flex-1"
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 72 + insets.bottom,
          }}
          showsVerticalScrollIndicator={false}
          fadeColor="#0A1612"
          fadeHeight={48}
          fadeIntensity={0.95}
          fadeVisibility="always"
        >
          {/* Progress Card */}
          {weeklyData.improvementVsLastWeek !== 0 && (
            <View className="bg-[#2D6A4F] rounded-2xl p-5 mb-6">
              <View className="flex-row items-center mb-3">
                <Sparkles size={24} color="#B7E4C7" strokeWidth={2} />
                <Text className="text-[#E8F4F0] text-lg font-bold ml-2">
                  {weeklyData.improvementVsLastWeek > 0 ? '+' : ''}
                  {weeklyData.improvementVsLastWeek}%{' '}
                  {weeklyData.improvementVsLastWeek > 0 ? 'Better' : 'Change'}
                </Text>
              </View>
              <Text className="text-[#B7E4C7] text-sm leading-relaxed">
                {weeklyData.improvementVsLastWeek > 0
                  ? "You're spiraling less than last week. Keep going!"
                  : weeklyData.improvementVsLastWeek < 0
                  ? "Don't worry - some weeks are harder than others. You're still making progress."
                  : 'Same as last week - consistency is progress!'}
              </Text>
            </View>
          )}

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

          {/* Average Duration Card */}
          {weeklyData.avgDuration > 0 && (
            <View className="bg-[#1A4D3C] rounded-2xl p-5 mb-4">
              <View className="flex-row items-center mb-3">
                <View className="bg-[#40916C]/20 p-2 rounded-xl mr-3">
                  <Clock size={20} color="#52B788" strokeWidth={2} />
                </View>
                <Text className="text-[#95B8A8] text-sm">
                  Average Spiral Duration
                </Text>
              </View>
              <Text className="text-[#E8F4F0] text-2xl font-bold mb-2">
                {formatDuration(weeklyData.avgDuration)}
              </Text>
              <Text className="text-[#95B8A8] text-sm leading-relaxed">
                How long spirals typically last
              </Text>
            </View>
          )}

          {/* Peak Time Card */}
          {weeklyData.peakTime && (
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
          )}

          {/* Most Common Trigger Card */}
          {weeklyData.mostCommonTrigger && (
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
          )}

          {/* Your Patterns Card */}
          {weeklyData.insights && weeklyData.insights.length > 0 && (
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
          )}
        </ScrollFadeView>
      )}
    </View>
  );
}

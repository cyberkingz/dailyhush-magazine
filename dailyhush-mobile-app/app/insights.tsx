/**
 * DailyHush - Pattern Insights Dashboard
 * Healing-focused weekly insights with WCAG AAA accessibility
 * Optimized for 55-70 year old demographic
 */

import { useEffect, useState, type ComponentProps } from 'react';
import { useRouter, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  View,
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  RefreshControl,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Sparkles,
  Clock,
  Lightbulb,
  BarChart3,
  ChevronRight,
  TrendingUp,
  Heart,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { Text } from '@/components/ui/text';
import { ScrollFadeView } from '@/components/ScrollFadeView';
import { PageHeader } from '@/components/PageHeader';
import { useUser } from '@/store/useStore';
import { getWeeklyInsights, WeeklyInsights } from '@/services/insights';
import { getTechniqueRankings, detectSpiralPatterns } from '@/services/patternDetection';
import { TabBar, Tab } from '@/components/insights/TabBar';
import { WeeklyInsightsContent } from '@/components/insights/WeeklyInsightsContent';
import { TechniquesInsightsContent } from '@/components/insights/TechniquesInsightsContent';
import type { SpiralPattern } from '@/types';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { spacing } from '@/constants/spacing';

export default function Insights() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const user = useUser();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [weeklyData, setWeeklyData] = useState<WeeklyInsights | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('weekly');
  const [techniqueRankings, setTechniqueRankings] = useState<any[]>([]);
  const [spiralPatterns, setSpiralPatterns] = useState<SpiralPattern | null>(null);

  const refreshControlColors =
    Platform.select<Partial<ComponentProps<typeof RefreshControl>>>({
      ios: {
        tintColor: colors.lime[500],
        titleColor: colors.lime[500],
      },
      android: {
        colors: [colors.lime[500], colors.lime[400], colors.lime[600]],
        progressBackgroundColor: colors.background.primary,
      },
      default: {},
    }) ?? {};

  // Fetch weekly insights on component mount
  const fetchInsights = async () => {
    if (!user?.user_id) {
      setError('Please sign in to view insights');
      setLoading(false);
      return;
    }

    setError(null);

    try {
      // Fetch both in parallel
      const [weeklyResult, rankingsData, patternsData] = await Promise.all([
        getWeeklyInsights(user.user_id),
        getTechniqueRankings(user.user_id),
        detectSpiralPatterns(user.user_id, 30),
      ]);

      if (!weeklyResult.success || !weeklyResult.data) {
        setError(weeklyResult.error || 'Failed to load insights');
      } else {
        setWeeklyData(weeklyResult.data);
      }

      setTechniqueRankings(rankingsData);
      setSpiralPatterns(patternsData);

    } catch (err) {
      console.error('Error fetching insights:', err);
      setError('Failed to load insights');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchInsights();
  }, [user?.user_id]);

  // Pull to refresh
  const onRefresh = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setRefreshing(true);
    fetchInsights();
  };

  // Define tabs
  const tabs: Tab[] = [
    {
      id: 'weekly',
      label: 'Weekly',
      accessibilityLabel: 'Weekly insights tab',
      accessibilityHint: 'Shows your weekly spiral patterns and progress',
    },
    {
      id: 'techniques',
      label: 'Techniques',
      accessibilityLabel: 'Techniques tab',
      accessibilityHint: 'Shows which techniques work best for you',
    },
  ];

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Pattern Insights',
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: colors.background.primary,
          },
          headerTintColor: colors.text.primary,
          headerTitleStyle: {
            fontWeight: '600',
          },
          headerBackTitleVisible: false,
        }}
      />
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: colors.background.primary,
        }}>
        <StatusBar style="light" />

        {/* Loading State */}
        {loading && (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            accessible={true}
            accessibilityLiveRegion="polite"
            accessibilityLabel="Loading your patterns">
            <ActivityIndicator size="large" color={colors.lime[500]} />
            <Text
              style={{
                color: colors.text.secondary,
                fontSize: typography.size.base,
                marginTop: spacing.md,
                lineHeight: typography.size.base * typography.lineHeight.normal,
              }}>
              Looking at your patterns...
            </Text>
          </View>
        )}

        {/* Error State */}
        {!loading && error && (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: spacing.xl,
            }}>
            <BarChart3 size={64} color={colors.text.muted} strokeWidth={2} />
            <Text
              style={{
                color: colors.text.primary,
                fontSize: typography.size.xl,
                fontWeight: typography.fontWeight.bold,
                marginTop: spacing.md,
                textAlign: 'center',
                lineHeight: typography.size.xl * typography.lineHeight.tight,
              }}>
              Having Trouble Connecting
            </Text>
            <Text
              style={{
                color: colors.text.secondary,
                fontSize: typography.size.base,
                marginTop: spacing.sm,
                textAlign: 'center',
                lineHeight: typography.size.base * typography.lineHeight.relaxed,
              }}>
              We can&apos;t load your patterns right now. Your data is safe—try pulling down to
              refresh in a moment.
            </Text>
            <Pressable
              onPress={async () => {
                await Haptics.selectionAsync();
                setLoading(true);
                fetchInsights();
              }}
              style={{
                marginTop: spacing.lg,
                backgroundColor: colors.button.secondary,
                borderRadius: 12,
                paddingHorizontal: spacing.xl,
                paddingVertical: spacing.md,
                minHeight: 48,
              }}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Try again"
              accessibilityHint="Attempts to reload your patterns">
              <Text
                style={{
                  color: colors.text.primary,
                  fontSize: typography.size.base,
                  fontWeight: typography.fontWeight.semibold,
                }}>
                Try Again
              </Text>
            </Pressable>
          </View>
        )}

        {/* Empty State - No spiral logs yet */}
        {!loading && !error && weeklyData && weeklyData.totalSpirals === 0 && (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: spacing.xl,
            }}>
            <Sparkles size={64} color={colors.lime[500]} strokeWidth={2} />
            <Text
              style={{
                color: colors.text.primary,
                fontSize: typography.size.xl,
                fontWeight: typography.fontWeight.bold,
                marginTop: spacing.md,
                textAlign: 'center',
                lineHeight: typography.size.xl * typography.lineHeight.tight,
              }}>
              Your Patterns Will Reveal Themselves
            </Text>
            <Text
              style={{
                color: colors.text.secondary,
                fontSize: typography.size.base,
                marginTop: spacing.sm,
                textAlign: 'center',
                lineHeight: typography.size.base * typography.lineHeight.relaxed,
              }}>
              When you interrupt your first few spirals, you&apos;ll start seeing patterns here.
              There&apos;s no rush—you&apos;re already doing the work by being here.
            </Text>
            <Pressable
              onPress={async () => {
                await Haptics.selectionAsync();
                router.push('/training/focus' as any);
              }}
              style={{
                marginTop: spacing.lg,
                backgroundColor: colors.button.secondary,
                borderRadius: 12,
                paddingHorizontal: spacing.xl,
                paddingVertical: spacing.md,
                minHeight: 48,
              }}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Learn F.I.R.E. technique"
              accessibilityHint="Opens training to learn the F.I.R.E. technique">
              <Text
                style={{
                  color: colors.text.primary,
                  fontSize: typography.size.base,
                  fontWeight: typography.fontWeight.semibold,
                }}>
                Learn F.I.R.E. Technique
              </Text>
            </Pressable>
          </View>
        )}

        {/* Data State - Show insights */}
        {!loading && !error && weeklyData && weeklyData.totalSpirals > 0 && (
          <>
            <TabBar
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />

            <ScrollFadeView
              style={{ flex: 1 }}
              contentContainerStyle={{
                paddingHorizontal: spacing.lg,
                paddingTop: spacing.md,
                paddingBottom: 72 + insets.bottom,
              }}
              showsVerticalScrollIndicator={false}
              fadeColor={colors.background.primary}
              fadeHeight={48}
              fadeIntensity={0.95}
              fadeVisibility="always"
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  {...refreshControlColors}
                />
              }>
              {activeTab === 'weekly' ? (
                <WeeklyInsightsContent weeklyData={weeklyData} />
              ) : (
                <TechniquesInsightsContent
                  rankings={techniqueRankings}
                  peakTime={spiralPatterns?.peakTime ?? null}
                  mostCommonTrigger={spiralPatterns?.mostCommonTrigger ?? null}
                  avgSpiralsPerWeek={spiralPatterns?.avgSpiralsPerWeek ?? 0}
                  earlyDetectionRate={spiralPatterns?.earlyDetectionRate ?? 0}
                />
              )}
            </ScrollFadeView>
          </>
        )}
      </SafeAreaView>
    </>
  );
}

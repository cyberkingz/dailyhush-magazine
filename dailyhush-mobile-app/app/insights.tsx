/**
 * DailyHush - Pattern Insights Dashboard
 * Healing-focused weekly insights with WCAG AAA accessibility
 * Optimized for 55-70 year old demographic
 */

import { useEffect, useState } from 'react';
import { useRouter, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, Pressable, SafeAreaView, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Sparkles,
  Clock,
  Lightbulb,
  BarChart3,
  ChevronRight,
  TrendingUp,
  Heart
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { Text } from '@/components/ui/text';
import { ScrollFadeView } from '@/components/ScrollFadeView';
import { useUser } from '@/store/useStore';
import { getWeeklyInsights, WeeklyInsights } from '@/services/insights';
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

  // Fetch weekly insights on component mount
  const fetchInsights = async () => {
    if (!user?.user_id) {
      setError('Please sign in to view insights');
      setLoading(false);
      return;
    }

    setError(null);

    const result = await getWeeklyInsights(user.user_id);

    if (!result.success || !result.data) {
      setError(result.error || 'Failed to load insights');
      setLoading(false);
      setRefreshing(false);
      return;
    }

    setWeeklyData(result.data);
    setLoading(false);
    setRefreshing(false);
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
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: colors.background.primary,
          paddingTop: insets.top,
        }}
      >
        <StatusBar style="light" />

        {/* Custom Header */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.md,
            borderBottomWidth: 1,
            borderBottomColor: colors.background.border,
          }}
        >
          <Pressable
            onPress={async () => {
              await Haptics.selectionAsync();
              router.back();
            }}
            style={{
              width: 56,
              height: 56,
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: -12,
            }}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            accessibilityHint="Returns to previous screen"
          >
            <ArrowLeft size={28} color={colors.text.secondary} strokeWidth={2} />
          </Pressable>

          <View style={{ flex: 1, alignItems: 'center', paddingHorizontal: spacing.md }}>
            <Text
              style={{
                fontSize: typography.size.xl,
                fontWeight: typography.fontWeight.bold,
                color: colors.text.primary,
                lineHeight: typography.size.xl * typography.lineHeight.tight,
              }}
              accessible={true}
              accessibilityRole="header"
            >
              Your Patterns
            </Text>
            <Text
              style={{
                fontSize: typography.size.xs,
                color: colors.text.secondary,
                marginTop: 4,
                lineHeight: typography.size.xs * typography.lineHeight.normal,
              }}
            >
              This week's healing insights
            </Text>
          </View>

          {/* Spacer for symmetry */}
          <View style={{ width: 44 }} />
        </View>

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
            accessibilityLabel="Loading your patterns"
          >
            <ActivityIndicator size="large" color={colors.button.primary} />
            <Text
              style={{
                color: colors.text.secondary,
                fontSize: typography.size.base,
                marginTop: spacing.md,
                lineHeight: typography.size.base * typography.lineHeight.normal,
              }}
            >
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
            }}
          >
            <BarChart3 size={64} color={colors.text.muted} strokeWidth={2} />
            <Text
              style={{
                color: colors.text.primary,
                fontSize: typography.size.xl,
                fontWeight: typography.fontWeight.bold,
                marginTop: spacing.md,
                textAlign: 'center',
                lineHeight: typography.size.xl * typography.lineHeight.tight,
              }}
            >
              Having Trouble Connecting
            </Text>
            <Text
              style={{
                color: colors.text.secondary,
                fontSize: typography.size.base,
                marginTop: spacing.sm,
                textAlign: 'center',
                lineHeight: typography.size.base * typography.lineHeight.relaxed,
              }}
            >
              We can't load your patterns right now. Your data is safe—try pulling down to refresh in a moment.
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
              accessibilityHint="Attempts to reload your patterns"
            >
              <Text
                style={{
                  color: colors.text.primary,
                  fontSize: typography.size.base,
                  fontWeight: typography.fontWeight.semibold,
                }}
              >
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
            }}
          >
            <Sparkles size={64} color={colors.emerald[500]} strokeWidth={2} />
            <Text
              style={{
                color: colors.text.primary,
                fontSize: typography.size.xl,
                fontWeight: typography.fontWeight.bold,
                marginTop: spacing.md,
                textAlign: 'center',
                lineHeight: typography.size.xl * typography.lineHeight.tight,
              }}
            >
              Your Patterns Will Reveal Themselves
            </Text>
            <Text
              style={{
                color: colors.text.secondary,
                fontSize: typography.size.base,
                marginTop: spacing.sm,
                textAlign: 'center',
                lineHeight: typography.size.base * typography.lineHeight.relaxed,
              }}
            >
              When you interrupt your first few spirals, you'll start seeing patterns here. There's no rush—you're already doing the work by being here.
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
              accessibilityHint="Opens training to learn the F.I.R.E. technique"
            >
              <Text
                style={{
                  color: colors.text.primary,
                  fontSize: typography.size.base,
                  fontWeight: typography.fontWeight.semibold,
                }}
              >
                Learn F.I.R.E. Technique
              </Text>
            </Pressable>
          </View>
        )}

        {/* Data State - Show insights */}
        {!loading && !error && weeklyData && weeklyData.totalSpirals > 0 && (
          <ScrollFadeView
            style={{ flex: 1 }}
            contentContainerStyle={{
              paddingHorizontal: spacing.lg,
              paddingTop: spacing.lg,
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
                tintColor={colors.emerald[500]}
                colors={[colors.emerald[500]]}
              />
            }
          >
            {/* Hard Week Compassion Message */}
            {weeklyData.totalSpirals > 10 && (
              <View
                style={{
                  backgroundColor: colors.background.tertiary,
                  borderRadius: 16,
                  padding: spacing.lg,
                  marginBottom: spacing.lg,
                  borderLeftWidth: 4,
                  borderLeftColor: colors.emerald[500],
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm }}>
                  <Heart size={20} color={colors.emerald[500]} strokeWidth={2} fill={colors.emerald[500]} />
                  <Text
                    style={{
                      color: colors.text.primary,
                      fontSize: typography.size.base,
                      fontWeight: typography.fontWeight.semibold,
                      marginLeft: spacing.sm,
                      lineHeight: typography.size.base * typography.lineHeight.tight,
                    }}
                  >
                    This Week Was Hard
                  </Text>
                </View>
                <Text
                  style={{
                    color: colors.text.secondary,
                    fontSize: typography.size.base,
                    lineHeight: typography.size.base * typography.lineHeight.relaxed,
                  }}
                >
                  Seeing many spirals doesn't mean you're failing. It means you're paying attention. That awareness is the first step toward healing.
                </Text>
              </View>
            )}

            {/* Progress Card - Only show when positive or reframe */}
            {weeklyData.improvementVsLastWeek > 0 ? (
              <View
                style={{
                  backgroundColor: colors.emerald[700],
                  borderRadius: 16,
                  padding: spacing.lg,
                  marginBottom: spacing.lg,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm }}>
                  <Sparkles size={24} color={colors.emerald[100]} strokeWidth={2} />
                  <Text
                    style={{
                      color: colors.emerald[50],
                      fontSize: typography.size.lg,
                      fontWeight: typography.fontWeight.bold,
                      marginLeft: spacing.sm,
                      lineHeight: typography.size.lg * typography.lineHeight.tight,
                    }}
                  >
                    You're Noticing Patterns
                  </Text>
                </View>
                <Text
                  style={{
                    color: colors.emerald[50],
                    fontSize: typography.size.base,
                    lineHeight: typography.size.base * typography.lineHeight.relaxed,
                  }}
                >
                  You interrupted {weeklyData.improvementVsLastWeek}% more spirals than last week. The awareness itself is healing.
                </Text>
              </View>
            ) : weeklyData.totalSpirals > 0 ? (
              <View
                style={{
                  backgroundColor: colors.emerald[700],
                  borderRadius: 16,
                  padding: spacing.lg,
                  marginBottom: spacing.lg,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm }}>
                  <Sparkles size={24} color={colors.emerald[100]} strokeWidth={2} />
                  <Text
                    style={{
                      color: colors.emerald[50],
                      fontSize: typography.size.lg,
                      fontWeight: typography.fontWeight.bold,
                      marginLeft: spacing.sm,
                      lineHeight: typography.size.lg * typography.lineHeight.tight,
                    }}
                  >
                    You're Building Awareness
                  </Text>
                </View>
                <Text
                  style={{
                    color: colors.emerald[50],
                    fontSize: typography.size.base,
                    lineHeight: typography.size.base * typography.lineHeight.relaxed,
                  }}
                >
                  Healing isn't linear. Some weeks are harder, and that's part of the process. You're still rewiring the pattern.
                </Text>
              </View>
            ) : null}

            {/* Stats Grid - Reframed Labels */}
            <View style={{ flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg }}>
              <View
                style={{
                  flex: 1,
                  backgroundColor: colors.background.secondary,
                  borderRadius: 16,
                  padding: spacing.lg,
                  borderWidth: 1,
                  borderColor: colors.background.border,
                }}
              >
                <Text
                  style={{
                    fontSize: typography.size['4xl'],
                    lineHeight: typography.size['4xl'] * typography.lineHeight.tight,
                    includeFontPadding: false,
                    paddingVertical: spacing.sm,
                    fontWeight: typography.fontWeight.bold,
                    color: colors.emerald[500],
                    textAlign: 'center',
                    marginBottom: spacing.xs,
                    minHeight: 64,
                  }}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  accessible={true}
                  accessibilityRole="text"
                  accessibilityLabel={`${weeklyData.totalSpirals} times you practiced this week`}
                >
                  {weeklyData.totalSpirals}
                </Text>
                <Text
                  style={{
                    color: colors.text.secondary,
                    fontSize: typography.size.base,
                    textAlign: 'center',
                    lineHeight: typography.size.base * typography.lineHeight.normal,
                  }}
                >
                  Times You Practiced
                </Text>
                <Text
                  style={{
                    color: colors.text.muted,
                    fontSize: typography.size.xs,
                    textAlign: 'center',
                    marginTop: 4,
                    lineHeight: typography.size.xs * typography.lineHeight.normal,
                  }}
                >
                  Each one rewires the pattern
                </Text>
              </View>

              <View
                style={{
                  flex: 1,
                  backgroundColor: colors.background.secondary,
                  borderRadius: 16,
                  padding: spacing.lg,
                  borderWidth: 1,
                  borderColor: colors.background.border,
                }}
              >
                <Text
                  style={{
                    fontSize: typography.size['4xl'],
                    lineHeight: typography.size['4xl'] * typography.lineHeight.tight,
                    includeFontPadding: false,
                    paddingVertical: spacing.sm,
                    fontWeight: typography.fontWeight.bold,
                    color: colors.emerald[500],
                    textAlign: 'center',
                    marginBottom: spacing.xs,
                    minHeight: 64,
                  }}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  accessible={true}
                  accessibilityRole="text"
                  accessibilityLabel={`${weeklyData.spiralsPrevented} spirals interrupted early`}
                >
                  {weeklyData.spiralsPrevented}
                </Text>
                <Text
                  style={{
                    color: colors.text.secondary,
                    fontSize: typography.size.base,
                    textAlign: 'center',
                    lineHeight: typography.size.base * typography.lineHeight.normal,
                  }}
                >
                  Interrupted Early
                </Text>
                <Text
                  style={{
                    color: colors.text.muted,
                    fontSize: typography.size.xs,
                    textAlign: 'center',
                    marginTop: 4,
                    lineHeight: typography.size.xs * typography.lineHeight.normal,
                  }}
                >
                  Caught before they grew
                </Text>
              </View>
            </View>

            {/* Average Duration Card */}
            {weeklyData.avgDuration > 0 && (
              <View
                style={{
                  backgroundColor: colors.background.tertiary,
                  borderRadius: 16,
                  padding: spacing.lg,
                  marginBottom: spacing.md,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm }}>
                  <View
                    style={{
                      backgroundColor: 'rgba(64, 145, 108, 0.2)',
                      padding: spacing.sm,
                      borderRadius: 12,
                      marginRight: spacing.sm,
                    }}
                  >
                    <Clock size={24} color={colors.emerald[500]} strokeWidth={2} />
                  </View>
                  <Text
                    style={{
                      color: colors.text.secondary,
                      fontSize: typography.size.base,
                      lineHeight: typography.size.base * typography.lineHeight.normal,
                    }}
                  >
                    Typical Duration
                  </Text>
                </View>
                <Text
                  style={{
                    color: colors.text.primary,
                    fontSize: typography.size['2xl'],
                    fontWeight: typography.fontWeight.bold,
                    marginBottom: spacing.sm,
                    lineHeight: typography.size['2xl'] * typography.lineHeight.tight,
                  }}
                >
                  {formatDuration(weeklyData.avgDuration)}
                </Text>
                <Text
                  style={{
                    color: colors.text.secondary,
                    fontSize: typography.size.base,
                    lineHeight: typography.size.base * typography.lineHeight.relaxed,
                  }}
                >
                  {weeklyData.avgDuration < 600
                    ? "You're catching them quickly"
                    : "Each interrupt teaches your brain"}
                </Text>
              </View>
            )}

            {/* Peak Time Card */}
            {weeklyData.peakTime && (
              <View
                style={{
                  backgroundColor: colors.background.tertiary,
                  borderRadius: 16,
                  padding: spacing.lg,
                  marginBottom: spacing.md,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm }}>
                  <View
                    style={{
                      backgroundColor: 'rgba(64, 145, 108, 0.2)',
                      padding: spacing.sm,
                      borderRadius: 12,
                      marginRight: spacing.sm,
                    }}
                  >
                    <Clock size={24} color={colors.emerald[500]} strokeWidth={2} />
                  </View>
                  <Text
                    style={{
                      color: colors.text.secondary,
                      fontSize: typography.size.base,
                      lineHeight: typography.size.base * typography.lineHeight.normal,
                    }}
                  >
                    Pattern Time
                  </Text>
                </View>
                <Text
                  style={{
                    color: colors.text.primary,
                    fontSize: typography.size['2xl'],
                    fontWeight: typography.fontWeight.bold,
                    marginBottom: spacing.sm,
                    lineHeight: typography.size['2xl'] * typography.lineHeight.tight,
                  }}
                >
                  {weeklyData.peakTime}
                </Text>
                <Text
                  style={{
                    color: colors.text.secondary,
                    fontSize: typography.size.base,
                    lineHeight: typography.size.base * typography.lineHeight.relaxed,
                  }}
                >
                  Around {weeklyData.peakTime}, your mind shows a pattern. What happens just before?
                </Text>
              </View>
            )}

            {/* Most Common Trigger Card */}
            {weeklyData.mostCommonTrigger && (
              <View
                style={{
                  backgroundColor: colors.background.tertiary,
                  borderRadius: 16,
                  padding: spacing.lg,
                  marginBottom: spacing.lg,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm }}>
                  <View
                    style={{
                      backgroundColor: 'rgba(64, 145, 108, 0.2)',
                      padding: spacing.sm,
                      borderRadius: 12,
                      marginRight: spacing.sm,
                    }}
                  >
                    <TrendingUp size={24} color={colors.emerald[500]} strokeWidth={2} />
                  </View>
                  <Text
                    style={{
                      color: colors.text.secondary,
                      fontSize: typography.size.base,
                      lineHeight: typography.size.base * typography.lineHeight.normal,
                    }}
                  >
                    Common Pattern
                  </Text>
                </View>
                <Text
                  style={{
                    color: colors.text.primary,
                    fontSize: typography.size.lg,
                    fontWeight: typography.fontWeight.semibold,
                    lineHeight: typography.size.lg * typography.lineHeight.normal,
                  }}
                >
                  {weeklyData.mostCommonTrigger}
                </Text>
              </View>
            )}

            {/* Your Patterns Card */}
            {weeklyData.insights && weeklyData.insights.length > 0 && (
              <View
                style={{
                  backgroundColor: colors.background.tertiary,
                  borderRadius: 16,
                  padding: spacing.lg,
                  marginBottom: spacing.lg,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md }}>
                  <Lightbulb size={24} color={colors.emerald[500]} strokeWidth={2} />
                  <Text
                    style={{
                      color: colors.text.primary,
                      fontSize: typography.size.lg,
                      fontWeight: typography.fontWeight.bold,
                      marginLeft: spacing.sm,
                      lineHeight: typography.size.lg * typography.lineHeight.tight,
                    }}
                  >
                    Your Insights
                  </Text>
                </View>

                {weeklyData.insights.map((insight, index) => (
                  <View
                    key={index}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'flex-start',
                      marginBottom: index < weeklyData.insights.length - 1 ? spacing.sm : 0,
                    }}
                  >
                    <Text
                      style={{
                        color: colors.emerald[500],
                        marginRight: spacing.sm,
                        fontSize: typography.size.base,
                        lineHeight: typography.size.base * typography.lineHeight.relaxed,
                      }}
                    >
                      •
                    </Text>
                    <Text
                      style={{
                        flex: 1,
                        color: colors.text.secondary,
                        fontSize: typography.size.base,
                        lineHeight: typography.size.base * typography.lineHeight.relaxed,
                      }}
                    >
                      {insight}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* View History Button */}
            <Pressable
              onPress={async () => {
                await Haptics.selectionAsync();
                router.push('/history' as any);
              }}
              style={{
                backgroundColor: colors.background.tertiary,
                borderRadius: 16,
                padding: spacing.lg,
                marginBottom: spacing.lg,
                minHeight: 72,
              }}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="View full history"
              accessibilityHint="Opens the complete history of all your spirals"
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                  <View
                    style={{
                      backgroundColor: 'rgba(64, 145, 108, 0.2)',
                      padding: spacing.sm,
                      borderRadius: 12,
                      marginRight: spacing.md,
                    }}
                  >
                    <BarChart3 size={24} color={colors.emerald[500]} strokeWidth={2} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        color: colors.text.primary,
                        fontSize: typography.size.lg,
                        fontWeight: typography.fontWeight.bold,
                        marginBottom: 4,
                        lineHeight: typography.size.lg * typography.lineHeight.tight,
                      }}
                    >
                      View Full History
                    </Text>
                    <Text
                      style={{
                        color: colors.text.secondary,
                        fontSize: typography.size.base,
                        lineHeight: typography.size.base * typography.lineHeight.relaxed,
                      }}
                    >
                      See all your spirals and progress over time
                    </Text>
                  </View>
                </View>
                <ChevronRight size={24} color={colors.emerald[500]} strokeWidth={2.5} />
              </View>
            </Pressable>
          </ScrollFadeView>
        )}
      </SafeAreaView>
    </>
  );
}

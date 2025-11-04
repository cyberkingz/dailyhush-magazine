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
                {...refreshControlColors}
              />
            }>
            {/* Hard Week Compassion Message */}
            {weeklyData.totalSpirals > 10 && (
              <View
                style={{
                  backgroundColor: colors.background.secondary,
                  borderRadius: 20,
                  padding: 20,
                  marginBottom: spacing.lg,
                  borderWidth: 2,
                  borderColor: colors.lime[500] + '33',
                }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                  <View
                    style={{
                      backgroundColor: colors.lime[500] + '20',
                      padding: 10,
                      borderRadius: 12,
                      marginRight: 12,
                    }}>
                    <Heart
                      size={18}
                      color={colors.lime[500]}
                      strokeWidth={2.5}
                      fill={colors.lime[500]}
                    />
                  </View>
                  <Text
                    style={{
                      color: colors.text.primary,
                      fontSize: 18,
                      fontWeight: '700',
                    }}>
                    This Week Was Hard
                  </Text>
                </View>
                <Text
                  style={{
                    color: colors.text.secondary,
                    fontSize: 15,
                    lineHeight: 22,
                  }}>
                  Seeing many spirals doesn&apos;t mean you&apos;re failing. It means you&apos;re
                  paying attention. That awareness is the first step toward healing.
                </Text>
              </View>
            )}

            {/* Progress Card - Modern Style */}
            {weeklyData.improvementVsLastWeek > 0 ? (
              <View
                style={{
                  backgroundColor: colors.background.secondary,
                  borderRadius: 20,
                  padding: 20,
                  marginBottom: spacing.lg,
                  borderWidth: 2,
                  borderColor: colors.lime[500] + '33',
                }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                  <View
                    style={{
                      backgroundColor: colors.lime[500] + '20',
                      padding: 10,
                      borderRadius: 12,
                      marginRight: 12,
                    }}>
                    <Sparkles size={20} color={colors.lime[500]} strokeWidth={2.5} />
                  </View>
                  <Text
                    style={{
                      color: colors.text.primary,
                      fontSize: 18,
                      fontWeight: '700',
                      flex: 1,
                    }}>
                    You're Noticing Patterns
                  </Text>
                </View>
                <Text
                  style={{
                    color: colors.text.secondary,
                    fontSize: 15,
                    lineHeight: 22,
                  }}>
                  You interrupted {weeklyData.improvementVsLastWeek}% more spirals than last week.
                  The awareness itself is healing.
                </Text>
              </View>
            ) : weeklyData.totalSpirals > 0 ? (
              <View
                style={{
                  backgroundColor: colors.background.secondary,
                  borderRadius: 20,
                  padding: 20,
                  marginBottom: spacing.lg,
                  borderWidth: 2,
                  borderColor: colors.lime[500] + '33',
                }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                  <View
                    style={{
                      backgroundColor: colors.lime[500] + '20',
                      padding: 10,
                      borderRadius: 12,
                      marginRight: 12,
                    }}>
                    <Sparkles size={20} color={colors.lime[500]} strokeWidth={2.5} />
                  </View>
                  <Text
                    style={{
                      color: colors.text.primary,
                      fontSize: 18,
                      fontWeight: '700',
                      flex: 1,
                    }}>
                    You're Building Awareness
                  </Text>
                </View>
                <Text
                  style={{
                    color: colors.text.secondary,
                    fontSize: 15,
                    lineHeight: 22,
                  }}>
                  Healing isn't linear. Some weeks are harder, and that's part of the process.
                  You're still rewiring the pattern.
                </Text>
              </View>
            ) : null}

            {/* Stats Grid - Modern Style */}
            <View style={{ flexDirection: 'row', gap: 12, marginBottom: spacing.lg }}>
              <View
                style={{
                  flex: 1,
                  backgroundColor: colors.background.secondary,
                  borderRadius: 20,
                  padding: 20,
                  borderWidth: 2,
                  borderColor: colors.lime[500] + '1A',
                  minHeight: 160,
                  justifyContent: 'center',
                }}>
                <View style={{ paddingVertical: 8 }}>
                  <Text
                    style={{
                      fontSize: 44,
                      fontWeight: '700',
                      color: colors.lime[500],
                      textAlign: 'center',
                      marginBottom: 12,
                      lineHeight: 52,
                    }}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.7}
                    accessible={true}
                    accessibilityRole="text"
                    accessibilityLabel={`${weeklyData.totalSpirals} times you practiced this week`}>
                    {weeklyData.totalSpirals}
                  </Text>
                  <Text
                    style={{
                      color: colors.text.secondary,
                      fontSize: 14,
                      fontWeight: '600',
                      textAlign: 'center',
                      marginBottom: 6,
                      lineHeight: 18,
                    }}>
                    Times You Practiced
                  </Text>
                  <Text
                    style={{
                      color: colors.text.muted,
                      fontSize: 11,
                      textAlign: 'center',
                      lineHeight: 15,
                    }}>
                    Each one rewires the pattern
                  </Text>
                </View>
              </View>

              <View
                style={{
                  flex: 1,
                  backgroundColor: colors.background.secondary,
                  borderRadius: 20,
                  padding: 20,
                  borderWidth: 2,
                  borderColor: colors.lime[500] + '1A',
                  minHeight: 160,
                  justifyContent: 'center',
                }}>
                <View style={{ paddingVertical: 8 }}>
                  <Text
                    style={{
                      fontSize: 44,
                      fontWeight: '700',
                      color: colors.lime[500],
                      textAlign: 'center',
                      marginBottom: 12,
                      lineHeight: 52,
                    }}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.7}
                    accessible={true}
                    accessibilityRole="text"
                    accessibilityLabel={`${weeklyData.spiralsPrevented} spirals interrupted early`}>
                    {weeklyData.spiralsPrevented}
                  </Text>
                  <Text
                    style={{
                      color: colors.text.secondary,
                      fontSize: 14,
                      fontWeight: '600',
                      textAlign: 'center',
                      marginBottom: 6,
                      lineHeight: 18,
                    }}>
                    Interrupted Early
                  </Text>
                  <Text
                    style={{
                      color: colors.text.muted,
                      fontSize: 11,
                      textAlign: 'center',
                      lineHeight: 15,
                    }}>
                    Caught before they grew
                  </Text>
                </View>
              </View>
            </View>

            {/* Average Duration Card */}
            {weeklyData.avgDuration > 0 && (
              <View
                style={{
                  backgroundColor: colors.background.secondary,
                  borderRadius: 20,
                  padding: 20,
                  marginBottom: spacing.md,
                  borderWidth: 2,
                  borderColor: colors.lime[500] + '1A',
                }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                  <View
                    style={{
                      backgroundColor: colors.lime[500] + '20',
                      padding: 10,
                      borderRadius: 12,
                      marginRight: 12,
                    }}>
                    <Clock size={20} color={colors.lime[500]} strokeWidth={2.5} />
                  </View>
                  <Text
                    style={{
                      color: colors.text.secondary,
                      fontSize: 15,
                      fontWeight: '600',
                    }}>
                    Typical Duration
                  </Text>
                </View>
                <View style={{ paddingVertical: 4 }}>
                  <Text
                    style={{
                      color: colors.text.primary,
                      fontSize: 36,
                      fontWeight: '700',
                      marginBottom: 12,
                      lineHeight: 44,
                    }}>
                    {formatDuration(weeklyData.avgDuration)}
                  </Text>
                  <Text
                    style={{
                      color: colors.text.secondary,
                      fontSize: 14,
                      lineHeight: 20,
                    }}>
                    {weeklyData.avgDuration < 600
                      ? "You're catching them quickly"
                      : 'Each interrupt teaches your brain'}
                  </Text>
                </View>
              </View>
            )}

            {/* Peak Time Card */}
            {weeklyData.peakTime && (
              <View
                style={{
                  backgroundColor: colors.background.secondary,
                  borderRadius: 20,
                  padding: 20,
                  marginBottom: spacing.md,
                  borderWidth: 2,
                  borderColor: colors.lime[500] + '1A',
                }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                  <View
                    style={{
                      backgroundColor: colors.lime[500] + '20',
                      padding: 10,
                      borderRadius: 12,
                      marginRight: 12,
                    }}>
                    <Clock size={20} color={colors.lime[500]} strokeWidth={2.5} />
                  </View>
                  <Text
                    style={{
                      color: colors.text.secondary,
                      fontSize: 15,
                      fontWeight: '600',
                    }}>
                    Pattern Time
                  </Text>
                </View>
                <View style={{ paddingVertical: 4 }}>
                  <Text
                    style={{
                      color: colors.text.primary,
                      fontSize: 36,
                      fontWeight: '700',
                      marginBottom: 12,
                      lineHeight: 44,
                    }}>
                    {weeklyData.peakTime}
                  </Text>
                  <Text
                    style={{
                      color: colors.text.secondary,
                      fontSize: 14,
                      lineHeight: 20,
                    }}>
                    Around {weeklyData.peakTime}, your mind shows a pattern. What happens just
                    before?
                  </Text>
                </View>
              </View>
            )}

            {/* Most Common Trigger Card */}
            {weeklyData.mostCommonTrigger && (
              <View
                style={{
                  backgroundColor: colors.background.secondary,
                  borderRadius: 20,
                  padding: 20,
                  marginBottom: spacing.lg,
                  borderWidth: 2,
                  borderColor: colors.lime[500] + '1A',
                }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                  <View
                    style={{
                      backgroundColor: colors.lime[500] + '20',
                      padding: 10,
                      borderRadius: 12,
                      marginRight: 12,
                    }}>
                    <TrendingUp size={20} color={colors.lime[500]} strokeWidth={2.5} />
                  </View>
                  <Text
                    style={{
                      color: colors.text.secondary,
                      fontSize: 15,
                      fontWeight: '600',
                    }}>
                    Common Pattern
                  </Text>
                </View>
                <Text
                  style={{
                    color: colors.text.primary,
                    fontSize: 18,
                    fontWeight: '600',
                    lineHeight: 26,
                  }}>
                  {weeklyData.mostCommonTrigger}
                </Text>
              </View>
            )}

            {/* Your Patterns Card */}
            {weeklyData.insights && weeklyData.insights.length > 0 && (
              <View
                style={{
                  backgroundColor: colors.background.secondary,
                  borderRadius: 20,
                  padding: 20,
                  marginBottom: spacing.lg,
                  borderWidth: 2,
                  borderColor: colors.lime[500] + '1A',
                }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                  <View
                    style={{
                      backgroundColor: colors.lime[500] + '20',
                      padding: 10,
                      borderRadius: 12,
                      marginRight: 12,
                    }}>
                    <Lightbulb size={20} color={colors.lime[500]} strokeWidth={2.5} />
                  </View>
                  <Text
                    style={{
                      color: colors.text.primary,
                      fontSize: 18,
                      fontWeight: '700',
                    }}>
                    Your Insights
                  </Text>
                </View>

                {weeklyData.insights.map((insight, index) => (
                  <View
                    key={index}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'flex-start',
                      marginBottom: index < weeklyData.insights.length - 1 ? 12 : 0,
                    }}>
                    <Text
                      style={{
                        color: colors.lime[500],
                        marginRight: 12,
                        fontSize: 15,
                        lineHeight: 22,
                      }}>
                      •
                    </Text>
                    <Text
                      style={{
                        flex: 1,
                        color: colors.text.secondary,
                        fontSize: 15,
                        lineHeight: 22,
                      }}>
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
                backgroundColor: colors.background.secondary,
                borderRadius: 20,
                padding: 20,
                marginBottom: spacing.lg,
                borderWidth: 2,
                borderColor: colors.lime[500] + '1A',
              }}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="View full history"
              accessibilityHint="Opens the complete history of all your spirals">
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                  <View
                    style={{
                      backgroundColor: colors.lime[500] + '20',
                      padding: 10,
                      borderRadius: 12,
                      marginRight: 16,
                    }}>
                    <BarChart3 size={20} color={colors.lime[500]} strokeWidth={2.5} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        color: colors.text.primary,
                        fontSize: 18,
                        fontWeight: '700',
                        marginBottom: 4,
                      }}>
                      View Full History
                    </Text>
                    <Text
                      style={{
                        color: colors.text.secondary,
                        fontSize: 15,
                        lineHeight: 22,
                      }}>
                      See all your spirals and progress over time
                    </Text>
                  </View>
                </View>
                <ChevronRight size={24} color={colors.lime[500]} strokeWidth={2.5} />
              </View>
            </Pressable>
          </ScrollFadeView>
        )}
      </SafeAreaView>
    </>
  );
}

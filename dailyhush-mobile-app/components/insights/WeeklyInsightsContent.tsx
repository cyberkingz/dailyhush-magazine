import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import {
  Heart, Sparkles, Clock, TrendingUp,
  Lightbulb, BarChart3, ChevronRight
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { Text } from '@/components/ui/text';
import { WeeklyInsights } from '@/services/insights';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';

interface WeeklyInsightsContentProps {
  weeklyData: WeeklyInsights;
}

export function WeeklyInsightsContent({ weeklyData }: WeeklyInsightsContentProps) {
  const router = useRouter();

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
    </>
  );
}

/**
 * DailyHush - Your Progress (Spiral History)
 * View all past spiral interrupts with healing-focused framing
 * Optimized for 55-70 year old demographic with WCAG AAA compliance
 */

import { useEffect, useState } from 'react';
import { useRouter, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Pressable, ActivityIndicator, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Calendar, TrendingUp, Minus, ArrowLeft, Sparkles } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { Text } from '@/components/ui/text';
import { useUser } from '@/store/useStore';
import { supabase } from '@/utils/supabase';
import type { SpiralLog } from '@/types';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

export default function History() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const user = useUser();

  const [loading, setLoading] = useState(true);
  const [spirals, setSpirals] = useState<SpiralLog[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'week' | 'month'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchSpirals();
  }, [user?.user_id, filter]);

  const fetchSpirals = async () => {
    if (!user?.user_id) {
      setError('Please sign in to view your progress');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('spiral_logs')
        .select('*')
        .eq('user_id', user.user_id)
        .order('timestamp', { ascending: false });

      // Apply time filter
      if (filter === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        query = query.gte('timestamp', weekAgo.toISOString());
      } else if (filter === 'month') {
        const monthAgo = new Date();
        monthAgo.setDate(monthAgo.getDate() - 30);
        query = query.gte('timestamp', monthAgo.toISOString());
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        console.error('Error fetching spirals:', fetchError);
        setError('Failed to load your progress');
        setLoading(false);
        return;
      }

      setSpirals(data || []);
      setLoading(false);
    } catch (err) {
      console.error('Exception fetching spirals:', err);
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  // Format timestamp to readable date/time with relative time
  const formatDateTime = (isoString: string): { date: string; time: string } => {
    const date = new Date(isoString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    let dateStr;
    if (diffInHours < 24) {
      dateStr = 'Today';
    } else if (diffInHours < 48) {
      dateStr = 'Yesterday';
    } else if (diffInHours < 168) { // 7 days
      dateStr = `${Math.floor(diffInHours / 24)} days ago`;
    } else {
      dateStr = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
      });
    }

    const timeStr = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    return { date: dateStr, time: timeStr };
  };

  // Format duration
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes === 0) return `${seconds}s`;
    return `${minutes}m ${remainingSeconds}s`;
  };

  // Calculate improvement with healing-focused messaging
  const calculateImprovement = (pre: number, post: number): {
    value: number;
    direction: 'up' | 'same';
    label: string;
  } => {
    const difference = post - pre;

    if (difference === 0) {
      return { value: 0, direction: 'same', label: 'Still learning' };
    }

    if (difference > 0) {
      let label = '';
      if (difference >= 5) label = 'Major progress';
      else if (difference >= 3) label = 'Great progress';
      else label = 'Progress';

      return { value: difference, direction: 'up', label };
    }

    // No improvement - reframe without shame
    return { value: 0, direction: 'same', label: 'Practice moment' };
  };

  // Get emoji for feeling rating (1-10 scale)
  const getFeelingEmoji = (rating: number): string => {
    if (rating <= 2) return '😟';
    if (rating <= 4) return '😐';
    if (rating <= 6) return '🙂';
    return '😊';
  };

  // Calculate success metrics
  const successRate = spirals.length > 0
    ? Math.round((spirals.filter(s => s.post_feeling > s.pre_feeling).length / spirals.length) * 100)
    : 0;

  const avgImprovement = spirals.length > 0
    ? (spirals.reduce((sum, s) => sum + (s.post_feeling - s.pre_feeling), 0) / spirals.length).toFixed(1)
    : '0.0';

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={{ flex: 1, backgroundColor: colors.background.primary }}>
        <StatusBar style="light" />

        {/* Header */}
        <View
          style={{
            paddingTop: insets.top + spacing.md,
            paddingHorizontal: spacing.lg,
            paddingBottom: spacing.md,
            borderBottomWidth: 1,
            borderBottomColor: colors.background.border,
          }}
        >
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: spacing.md
          }}>
            <Pressable
              onPress={() => {
                Haptics.selectionAsync();
                router.back();
              }}
              style={{
                width: 56,              // Increased from 40 for better touch target
                height: 56,
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: -12,        // Negative margin for visual alignment
              }}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Go back"
              accessibilityHint="Returns to the previous screen"
            >
              <ArrowLeft size={28} color={colors.text.secondary} strokeWidth={2} />
            </Pressable>

            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={{
                fontSize: typography.size.xl,
                fontWeight: typography.fontWeight.bold,
                color: colors.text.primary,
                lineHeight: typography.size.xl * typography.lineHeight.tight,
              }}>
                Your Progress
              </Text>
              <Text style={{
                fontSize: typography.size.xs,
                color: colors.text.secondary,
                marginTop: 4,
                lineHeight: typography.size.xs * typography.lineHeight.normal,
              }}>
                Every interrupt rewires the pattern
              </Text>
            </View>

            <View style={{ width: 56 }} />
          </View>

          {/* Filter Tabs */}
          <View style={{ flexDirection: 'row', gap: spacing.md }}>
            {(['all', 'week', 'month'] as const).map((f) => (
              <Pressable
                key={f}
                onPress={() => {
                  setFilter(f);
                  Haptics.selectionAsync();
                }}
                style={{
                  flex: 1,
                  paddingVertical: spacing.base,  // Increased from sm (16px instead of 8px)
                  minHeight: 48,                   // Ensure WCAG AAA touch target
                  borderRadius: 12,
                  backgroundColor: filter === f ? colors.emerald[700] : colors.background.secondary,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                accessible={true}
                accessibilityRole="tab"
                accessibilityState={{ selected: filter === f }}
                accessibilityLabel={f === 'all' ? 'All Time' : f === 'week' ? 'This Week' : 'This Month'}
              >
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: typography.size.base,  // Increased from 14
                    fontWeight: filter === f ? typography.fontWeight.semibold : typography.fontWeight.normal,
                    color: filter === f ? colors.white : colors.text.secondary,
                    lineHeight: typography.size.base * typography.lineHeight.tight,
                  }}
                >
                  {f === 'all' ? 'All Time' : f === 'week' ? 'This Week' : 'This Month'}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Loading State */}
        {loading && (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: spacing.xl,
            }}
            accessible={true}
            accessibilityRole="progressbar"
            accessibilityLabel="Loading your progress"
            accessibilityLiveRegion="polite"
          >
            <ActivityIndicator
              size="large"
              color={colors.emerald[500]}
              accessible={false}
            />
            <Text
              style={{
                color: colors.text.secondary,
                fontSize: typography.size.base,
                marginTop: spacing.md,
                textAlign: 'center',
                lineHeight: typography.size.base * typography.lineHeight.normal,
              }}
              accessible={true}
              accessibilityRole="text"
            >
              {filter === 'all'
                ? 'Loading your complete progress...'
                : filter === 'week'
                ? 'Loading this week\'s spirals...'
                : 'Loading this month\'s spirals...'
              }
            </Text>
          </View>
        )}

        {/* Error State */}
        {!loading && error && (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl }}>
            <View style={{
              marginBottom: spacing.lg,
              padding: spacing.lg,
              backgroundColor: colors.background.secondary,
              borderRadius: 100,
            }}>
              <Calendar
                size={64}
                color={colors.emerald[600]}
                strokeWidth={1.5}
              />
            </View>
            <Text style={{
              color: colors.text.primary,
              fontSize: typography.size.lg,
              fontWeight: typography.fontWeight.bold,
              marginTop: spacing.md,
              textAlign: 'center',
              lineHeight: typography.size.lg * typography.lineHeight.tight,
            }}>
              Unable to Load Progress
            </Text>
            <Text style={{
              color: colors.text.secondary,
              fontSize: typography.size.base,
              marginTop: spacing.sm,
              textAlign: 'center',
              lineHeight: typography.size.base * typography.lineHeight.relaxed,
            }}>
              {error}
            </Text>
          </View>
        )}

        {/* Empty State */}
        {!loading && !error && spirals.length === 0 && (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl }}>
            <View style={{
              marginBottom: spacing.lg,
              padding: spacing.lg,
              backgroundColor: colors.background.secondary,
              borderRadius: 100,
            }}>
              <Sparkles
                size={64}
                color={colors.emerald[500]}
                strokeWidth={1.5}
              />
            </View>
            <Text style={{
              color: colors.text.primary,
              fontSize: typography.size.lg,
              fontWeight: typography.fontWeight.bold,
              marginTop: spacing.md,
              textAlign: 'center',
              lineHeight: typography.size.lg * typography.lineHeight.tight,
            }}>
              {filter === 'all'
                ? "Your healing journey starts here"
                : `A quiet ${filter === 'week' ? 'week' : 'month'} - that's progress`
              }
            </Text>
            <Text style={{
              color: colors.text.secondary,
              fontSize: typography.size.base,
              marginTop: spacing.sm,
              textAlign: 'center',
              lineHeight: typography.size.base * typography.lineHeight.relaxed,
            }}>
              {filter === 'all'
                ? "When you interrupt your first spiral, you'll see it here. You're already taking the first step by being here."
                : `No spirals means fewer moments of rumination. You're rewiring the pattern.`
              }
            </Text>

            {filter === 'all' && (
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push('/training/focus' as any);
                }}
                style={{
                  marginTop: spacing.xl,
                  paddingVertical: spacing.base,
                  paddingHorizontal: spacing.xl,
                  backgroundColor: colors.emerald[700],
                  borderRadius: 16,
                  minHeight: 56,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Start F.I.R.E. Training"
              >
                {({ pressed }) => (
                  <Text style={{
                    color: colors.white,
                    fontSize: typography.size.base,
                    fontWeight: typography.fontWeight.semibold,
                    opacity: pressed ? 0.7 : 1,
                  }}>
                    Start F.I.R.E. Training
                  </Text>
                )}
              </Pressable>
            )}
          </View>
        )}

        {/* Progress List */}
        {!loading && !error && spirals.length > 0 && (
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
              paddingHorizontal: spacing.lg,
              paddingTop: spacing.md,
              paddingBottom: spacing['3xl'] + insets.bottom,
            }}
            showsVerticalScrollIndicator={true}
          >
            {/* Stats Summary */}
            <View style={{ marginBottom: spacing.lg, gap: spacing.md }}>
              {/* Total Spirals Card */}
              <View style={{
                backgroundColor: colors.emerald[800] + '30',
                borderRadius: 16,
                padding: spacing.xl,
                borderWidth: 1,
                borderColor: colors.emerald[700] + '40',
              }}>
                <Text
                  style={{
                    fontSize: typography.size['4xl'],
                    lineHeight: typography.size['4xl'] * typography.lineHeight.tight,
                    includeFontPadding: false,
                    paddingVertical: 8,
                    fontWeight: typography.fontWeight.bold,
                    color: colors.emerald[500],
                    textAlign: 'center',
                    marginBottom: spacing.xs,
                    minHeight: 64,
                  }}
                  accessible={true}
                  accessibilityRole="text"
                  accessibilityLabel={`${spirals.length} spirals interrupted`}
                >
                  {spirals.length}
                </Text>
                <Text style={{
                  fontSize: typography.size.sm,
                  color: colors.text.secondary,
                  textAlign: 'center',
                  lineHeight: typography.size.sm * typography.lineHeight.normal,
                }}>
                  Spirals Interrupted
                </Text>
              </View>

              {/* Success Metrics */}
              <View style={{ flexDirection: 'row', gap: spacing.md }}>
                <View style={{
                  flex: 1,
                  backgroundColor: colors.background.secondary,
                  padding: spacing.lg,
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: colors.background.border,
                }}>
                  <Text style={{
                    fontSize: typography.size['3xl'],
                    fontWeight: typography.fontWeight.bold,
                    color: colors.emerald[500],
                    lineHeight: typography.size['3xl'] * typography.lineHeight.tight,
                    includeFontPadding: false,
                    textAlign: 'center',
                  }}>
                    {successRate}%
                  </Text>
                  <Text style={{
                    fontSize: typography.size.xs,
                    color: colors.text.secondary,
                    marginTop: spacing.xs,
                    textAlign: 'center',
                    lineHeight: typography.size.xs * typography.lineHeight.normal,
                  }}>
                    Felt better after
                  </Text>
                </View>

                <View style={{
                  flex: 1,
                  backgroundColor: colors.background.secondary,
                  padding: spacing.lg,
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: colors.background.border,
                }}>
                  <Text style={{
                    fontSize: typography.size['3xl'],
                    fontWeight: typography.fontWeight.bold,
                    color: colors.emerald[500],
                    lineHeight: typography.size['3xl'] * typography.lineHeight.tight,
                    includeFontPadding: false,
                    textAlign: 'center',
                  }}>
                    +{avgImprovement}
                  </Text>
                  <Text style={{
                    fontSize: typography.size.xs,
                    color: colors.text.secondary,
                    marginTop: spacing.xs,
                    textAlign: 'center',
                    lineHeight: typography.size.xs * typography.lineHeight.normal,
                  }}>
                    Avg improvement
                  </Text>
                </View>
              </View>

              {/* Encouragement Message */}
              {successRate >= 70 && (
                <View style={{
                  backgroundColor: colors.emerald[800] + '20',
                  padding: spacing.lg,
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: colors.emerald[700] + '30',
                }}>
                  <Text style={{
                    fontSize: typography.size.base,
                    color: colors.emerald[400],
                    textAlign: 'center',
                    lineHeight: typography.size.base * typography.lineHeight.relaxed,
                  }}>
                    🌟 You're feeling better after {Math.round(successRate / 10)} out of 10 interrupts. The pattern is rewiring.
                  </Text>
                </View>
              )}
            </View>

            {/* Spiral Cards */}
            {spirals.map((spiral, index) => {
              const { date, time } = formatDateTime(spiral.timestamp);
              const improvement = calculateImprovement(spiral.pre_feeling, spiral.post_feeling);
              const preEmoji = getFeelingEmoji(spiral.pre_feeling);
              const postEmoji = getFeelingEmoji(spiral.post_feeling);
              const isExpanded = expandedId === spiral.spiral_id;

              return (
                <Pressable
                  key={spiral.spiral_id}
                  onPress={() => {
                    setExpandedId(isExpanded ? null : spiral.spiral_id);
                    Haptics.selectionAsync();
                  }}
                  style={{
                    backgroundColor: colors.background.secondary,
                    borderRadius: 16,
                    padding: spacing.xl,
                    marginBottom: spacing.md,
                    borderWidth: 1,
                    borderColor: colors.background.border,
                  }}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel={`Spiral from ${date} at ${time}. ${improvement.label}`}
                  accessibilityHint="Tap to expand details"
                >
                  {/* Date/Time Header */}
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md }}>
                    <View>
                      <Text style={{
                        fontSize: typography.size.base,
                        fontWeight: typography.fontWeight.semibold,
                        color: colors.text.primary,
                        lineHeight: typography.size.base * typography.lineHeight.tight,
                      }}>
                        {date}
                      </Text>
                      <Text style={{
                        fontSize: typography.size.sm,
                        color: colors.text.secondary,
                        marginTop: 2,
                        lineHeight: typography.size.sm * typography.lineHeight.normal,
                      }}>
                        {time}
                      </Text>
                    </View>

                    {/* Duration Badge */}
                    <View style={{
                      backgroundColor: colors.emerald[800],
                      paddingHorizontal: spacing.md,
                      paddingVertical: spacing.sm,
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor: colors.emerald[600] + '40',
                      minWidth: 70,
                      alignItems: 'center',
                    }}>
                      <Text
                        style={{
                          fontSize: typography.size.sm,
                          color: colors.emerald[300],
                          fontWeight: typography.fontWeight.bold,
                          lineHeight: typography.size.sm * typography.lineHeight.tight,
                        }}
                        accessible={true}
                        accessibilityLabel={`Duration: ${formatDuration(spiral.duration_seconds)}`}
                      >
                        {formatDuration(spiral.duration_seconds)}
                      </Text>
                    </View>
                  </View>

                  {/* Progress Indicator - Prominent */}
                  {improvement.direction === 'up' && (
                    <View style={{
                      alignItems: 'center',
                      backgroundColor: colors.emerald[800] + '20',
                      padding: spacing.md,
                      borderRadius: 12,
                      marginBottom: spacing.md,
                    }}>
                      <TrendingUp size={32} color={colors.emerald[500]} strokeWidth={2.5} />
                      <Text style={{
                        fontSize: typography.size['3xl'],
                        fontWeight: typography.fontWeight.bold,
                        color: colors.emerald[500],
                        lineHeight: typography.size['3xl'] * typography.lineHeight.tight,
                        marginTop: spacing.xs,
                      }}>
                        +{improvement.value} points
                      </Text>
                      <Text style={{
                        fontSize: typography.size.sm,
                        color: colors.emerald[400],
                        lineHeight: typography.size.sm * typography.lineHeight.normal,
                      }}>
                        {improvement.label}
                      </Text>
                    </View>
                  )}

                  {/* Still learning indicator */}
                  {improvement.direction === 'same' && (
                    <View style={{
                      alignItems: 'center',
                      backgroundColor: colors.background.tertiary + '40',
                      padding: spacing.md,
                      borderRadius: 12,
                      marginBottom: spacing.md,
                    }}>
                      <Minus size={24} color={colors.text.secondary} strokeWidth={2.5} />
                      <Text style={{
                        fontSize: typography.size.base,
                        color: colors.text.secondary,
                        marginTop: spacing.xs,
                        textAlign: 'center',
                        lineHeight: typography.size.base * typography.lineHeight.normal,
                      }}>
                        {improvement.label}
                      </Text>
                      <Text style={{
                        fontSize: typography.size.xs,
                        color: colors.text.muted,
                        marginTop: 4,
                        textAlign: 'center',
                        lineHeight: typography.size.xs * typography.lineHeight.normal,
                      }}>
                        Each attempt builds the skill
                      </Text>
                    </View>
                  )}

                  {/* Feeling Before/After - Compact */}
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm, gap: spacing.lg }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{
                        fontSize: typography.size.xs,
                        color: colors.text.muted,
                        marginBottom: 4,
                        lineHeight: typography.size.xs * typography.lineHeight.normal,
                      }}>
                        Before
                      </Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text
                          style={{
                            fontSize: 28,
                            lineHeight: 36,
                            includeFontPadding: false,
                            minHeight: 36,
                            paddingVertical: 4,
                            marginRight: 8,
                          }}
                        >
                          {preEmoji}
                        </Text>
                        <Text style={{
                          fontSize: typography.size.base,
                          fontWeight: typography.fontWeight.semibold,
                          color: colors.text.primary,
                          lineHeight: typography.size.base * typography.lineHeight.tight,
                        }}>
                          {spiral.pre_feeling}/10
                        </Text>
                      </View>
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text style={{
                        fontSize: typography.size.xs,
                        color: colors.text.muted,
                        marginBottom: 4,
                        lineHeight: typography.size.xs * typography.lineHeight.normal,
                      }}>
                        After
                      </Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text
                          style={{
                            fontSize: 28,
                            lineHeight: 36,
                            includeFontPadding: false,
                            minHeight: 36,
                            paddingVertical: 4,
                            marginRight: 8,
                          }}
                        >
                          {postEmoji}
                        </Text>
                        <Text style={{
                          fontSize: typography.size.base,
                          fontWeight: typography.fontWeight.semibold,
                          color: colors.text.primary,
                          lineHeight: typography.size.base * typography.lineHeight.tight,
                        }}>
                          {spiral.post_feeling}/10
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Trigger - Always visible but compact */}
                  {spiral.trigger && (
                    <View style={{
                      backgroundColor: colors.background.tertiary + '20',
                      paddingHorizontal: spacing.lg,
                      paddingVertical: spacing.md,
                      borderRadius: 12,
                      marginTop: spacing.sm,
                    }}>
                      <Text
                        style={{
                          fontSize: typography.size.xs,
                          color: colors.text.muted,
                          marginBottom: 6,
                          fontWeight: typography.fontWeight.semibold,
                          lineHeight: typography.size.xs * typography.lineHeight.normal,
                        }}
                      >
                        Trigger
                      </Text>
                      <Text
                        style={{
                          fontSize: typography.size.base,
                          color: colors.text.secondary,
                          lineHeight: typography.size.base * typography.lineHeight.relaxed,
                        }}
                        accessible={true}
                        accessibilityLabel={`Trigger: ${spiral.trigger}`}
                      >
                        {spiral.trigger}
                      </Text>
                    </View>
                  )}

                  {/* Shift Used Badge */}
                  {spiral.used_shift && (
                    <View style={{
                      backgroundColor: colors.emerald[700] + '20',
                      paddingHorizontal: spacing.md,
                      paddingVertical: spacing.sm,
                      borderRadius: 10,
                      alignSelf: 'flex-start',
                      marginTop: spacing.sm,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 6,
                    }}>
                      <Text
                        style={{
                          fontSize: typography.size.base,
                          lineHeight: typography.size.base * typography.lineHeight.tight,
                          includeFontPadding: false,
                        }}
                      >
                        ⚡
                      </Text>
                      <Text
                        style={{
                          fontSize: typography.size.sm,
                          color: colors.emerald[400],
                          fontWeight: typography.fontWeight.semibold,
                          lineHeight: typography.size.sm * typography.lineHeight.tight,
                        }}
                      >
                        Used Shift Necklace
                      </Text>
                    </View>
                  )}
                </Pressable>
              );
            })}

            {/* Bottom Spacing */}
            <View style={{ height: spacing.lg }} />
          </ScrollView>
        )}
      </View>
    </>
  );
}

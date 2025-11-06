import { View } from 'react-native';
import { Trophy, Target, Zap, Lightbulb, BarChart3 } from 'lucide-react-native';

import { Text } from '@/components/ui/text';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';

interface TechniqueRanking {
  techniqueId: string;
  techniqueName: string;
  timesUsed: number;
  timesSuccessful: number;
  successRate: number;
  avgReduction: number;
}

interface TechniquesInsightsContentProps {
  rankings: TechniqueRanking[];
  peakTime: number | null;
  mostCommonTrigger: string | null;
  avgSpiralsPerWeek: number;
  earlyDetectionRate: number;
}

export function TechniquesInsightsContent({
  rankings,
  peakTime,
  mostCommonTrigger,
  avgSpiralsPerWeek,
  earlyDetectionRate,
}: TechniquesInsightsContentProps) {

  const getRatingColor = (successRate: number): string => {
    if (successRate >= 70) return colors.lime[500];
    if (successRate >= 50) return colors.lime[600];
    return colors.text.muted;
  };

  const formatHour = (hour: number): string => {
    if (hour === 0) return '12:00 AM';
    if (hour < 12) return `${hour}:00 AM`;
    if (hour === 12) return '12:00 PM';
    return `${hour - 12}:00 PM`;
  };

  const totalUsages = rankings.reduce((sum, r) => sum + r.timesUsed, 0);

  // Empty state
  if (totalUsages === 0) {
    return (
      <View style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: spacing.xl,
        paddingVertical: 60,
      }}>
        <Zap size={64} color={colors.lime[500]} strokeWidth={2} />
        <Text style={{
          color: colors.text.primary,
          fontSize: 24,
          fontWeight: '700',
          marginTop: spacing.md,
          textAlign: 'center',
        }}>
          Your Technique Intelligence Awaits
        </Text>
        <Text style={{
          color: colors.text.secondary,
          fontSize: 15,
          marginTop: spacing.sm,
          textAlign: 'center',
          lineHeight: 22,
        }}>
          After you complete a few spiral interrupts, we'll show you which techniques work best for your unique patterns.
        </Text>
      </View>
    );
  }

  return (
    <>
      {/* Top Technique Card */}
      {rankings[0] && (
        <View style={{
          backgroundColor: colors.background.secondary,
          borderRadius: 20,
          padding: 20,
          marginBottom: spacing.lg,
          borderWidth: 2,
          borderColor: colors.lime[500] + '33',
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <View style={{
              backgroundColor: colors.lime[500] + '20',
              padding: 10,
              borderRadius: 12,
              marginRight: 12,
            }}>
              <Trophy size={20} color={colors.lime[500]} strokeWidth={2.5} />
            </View>
            <Text style={{
              color: colors.text.primary,
              fontSize: 18,
              fontWeight: '700',
            }}>
              Your Most Effective Technique
            </Text>
          </View>

          <Text style={{
            fontSize: 28,
            fontWeight: '700',
            color: colors.lime[500],
            marginBottom: 8,
          }}>
            {rankings[0].techniqueName}
          </Text>

          <Text style={{
            color: colors.text.secondary,
            fontSize: 15,
            lineHeight: 22,
            marginBottom: 16,
          }}>
            {rankings[0].avgReduction.toFixed(1)} point average reduction • {rankings[0].successRate}% success rate
          </Text>

          {/* Progress bar */}
          <View style={{
            height: 8,
            backgroundColor: colors.background.muted,
            borderRadius: 4,
            overflow: 'hidden',
          }}>
            <View style={{
              width: `${rankings[0].successRate}%`,
              height: '100%',
              backgroundColor: colors.lime[500],
            }} />
          </View>

          <Text style={{
            color: colors.text.muted,
            fontSize: 13,
            marginTop: 8,
          }}>
            {rankings[0].timesSuccessful} successful / {rankings[0].timesUsed} total
          </Text>
        </View>
      )}

      {/* All Techniques Rankings */}
      {rankings.length > 1 && (
        <View style={{
          backgroundColor: colors.background.secondary,
          borderRadius: 20,
          padding: 20,
          marginBottom: spacing.lg,
          borderWidth: 2,
          borderColor: colors.lime[500] + '1A',
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <View style={{
              backgroundColor: colors.lime[500] + '20',
              padding: 10,
              borderRadius: 12,
              marginRight: 12,
            }}>
              <BarChart3 size={20} color={colors.lime[500]} strokeWidth={2.5} />
            </View>
            <Text style={{
              color: colors.text.primary,
              fontSize: 18,
              fontWeight: '700',
            }}>
              All Techniques
            </Text>
          </View>

          {rankings.map((rank, index) => (
            <View
              key={rank.techniqueId}
              style={{
                marginBottom: index < rankings.length - 1 ? 16 : 0,
                paddingBottom: index < rankings.length - 1 ? 16 : 0,
                borderBottomWidth: index < rankings.length - 1 ? 1 : 0,
                borderBottomColor: colors.background.border,
              }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: colors.text.primary,
                    marginBottom: 4,
                  }}>
                    {rank.techniqueName}
                  </Text>
                  <Text style={{
                    fontSize: 13,
                    color: colors.text.muted,
                  }}>
                    Used {rank.timesUsed} times
                  </Text>
                </View>

                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={{
                    fontSize: 24,
                    fontWeight: '700',
                    color: getRatingColor(rank.successRate),
                  }}>
                    {rank.avgReduction.toFixed(1)}
                  </Text>
                  <Text style={{
                    fontSize: 12,
                    color: colors.text.muted,
                  }}>
                    avg reduction
                  </Text>
                </View>
              </View>

              {/* Success rate bar */}
              <View style={{
                height: 6,
                backgroundColor: colors.background.muted,
                borderRadius: 3,
                overflow: 'hidden',
                marginBottom: 6,
              }}>
                <View style={{
                  width: `${rank.successRate}%`,
                  height: '100%',
                  backgroundColor: getRatingColor(rank.successRate),
                }} />
              </View>

              <Text style={{
                fontSize: 12,
                color: colors.text.muted,
              }}>
                {rank.successRate}% success rate
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Pattern Insights Card */}
      {(peakTime !== null || mostCommonTrigger || avgSpiralsPerWeek > 0) && (
        <View style={{
          backgroundColor: colors.background.secondary,
          borderRadius: 20,
          padding: 20,
          marginBottom: spacing.lg,
          borderWidth: 2,
          borderColor: colors.lime[500] + '1A',
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <View style={{
              backgroundColor: colors.lime[500] + '20',
              padding: 10,
              borderRadius: 12,
              marginRight: 12,
            }}>
              <Target size={20} color={colors.lime[500]} strokeWidth={2.5} />
            </View>
            <Text style={{
              color: colors.text.primary,
              fontSize: 18,
              fontWeight: '700',
            }}>
              Your Spiral Patterns
            </Text>
          </View>

          {peakTime !== null && (
            <Text style={{
              color: colors.text.secondary,
              fontSize: 15,
              lineHeight: 22,
              marginBottom: 8,
            }}>
              🕐 Most spirals happen around {formatHour(peakTime)}
            </Text>
          )}

          {mostCommonTrigger && (
            <Text style={{
              color: colors.text.secondary,
              fontSize: 15,
              lineHeight: 22,
              marginBottom: 8,
            }}>
              ⚡ Most common trigger: {mostCommonTrigger}
            </Text>
          )}

          {avgSpiralsPerWeek > 0 && (
            <Text style={{
              color: colors.text.secondary,
              fontSize: 15,
              lineHeight: 22,
              marginBottom: 8,
            }}>
              📊 Average {avgSpiralsPerWeek.toFixed(1)} spirals per week
            </Text>
          )}

          {earlyDetectionRate > 0 && (
            <Text style={{
              color: colors.text.secondary,
              fontSize: 15,
              lineHeight: 22,
            }}>
              🎯 You catch {earlyDetectionRate.toFixed(0)}% of spirals early
            </Text>
          )}
        </View>
      )}

      {/* How It Works Card */}
      <View style={{
        backgroundColor: colors.background.secondary,
        borderRadius: 20,
        padding: 20,
        marginBottom: spacing.lg,
        borderWidth: 2,
        borderColor: colors.lime[500] + '1A',
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
          <View style={{
            backgroundColor: colors.lime[500] + '20',
            padding: 10,
            borderRadius: 12,
            marginRight: 12,
          }}>
            <Lightbulb size={20} color={colors.lime[500]} strokeWidth={2.5} />
          </View>
          <Text style={{
            color: colors.text.primary,
            fontSize: 18,
            fontWeight: '700',
          }}>
            How This Works
          </Text>
        </View>

        <Text style={{
          color: colors.text.secondary,
          fontSize: 15,
          lineHeight: 22,
          marginBottom: 12,
        }}>
          We track which techniques reduce your spiral intensity most effectively. Over time, we prioritize techniques that work best for your unique patterns.
        </Text>

        <Text style={{
          color: colors.text.secondary,
          fontSize: 15,
          lineHeight: 22,
        }}>
          A 2+ point reduction (8 → 6 or better) is considered successful. Your data stays private and is only used to personalize your experience.
        </Text>
      </View>
    </>
  );
}

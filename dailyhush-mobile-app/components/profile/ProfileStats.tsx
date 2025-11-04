/**
 * ProfileStats Component
 *
 * Displays user statistics (streak, check-ins, avg mood)
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { Flame, Calendar, Heart } from 'lucide-react-native';
import { profileTypography } from '@/constants/profileTypography';
import { colors } from '@/constants/colors';

interface ProfileStatsProps {
  currentStreak: number;
  totalCheckIns: number;
  avgMoodRating: number;
}

export function ProfileStats({
  currentStreak,
  totalCheckIns,
  avgMoodRating,
}: ProfileStatsProps) {
  // Check if it's a milestone streak
  const isMilestone = [7, 14, 30, 60, 90, 180, 365].includes(currentStreak);

  return (
    <View style={styles.container}>
      {/* Total Check-ins */}
      <StatCard
        icon={<Calendar size={26} color={colors.lime[500]} />}
        value={totalCheckIns}
        label="Check-ins"
        index={0}
        isHero={true}
      />

      {/* Current Streak - HERO ELEMENT */}
      <StatCard
        icon={<Flame size={28} color={colors.lime[500]} fill={colors.lime[500]} />}
        value={currentStreak}
        label="Day Streak"
        index={1}
        isHero={true}
        isMilestone={isMilestone}
      />

      {/* Average Mood */}
      <StatCard
        icon={<Heart size={26} color={colors.lime[500]} />}
        value={avgMoodRating.toFixed(1)}
        label="Avg Mood"
        index={2}
        isHero={true}
      />
    </View>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  value: number | string;
  label: string;
  index: number;
  isHero?: boolean;
  isMilestone?: boolean;
}

function StatCard({ icon, value, label, index, isHero = false, isMilestone = false }: StatCardProps) {
  return (
    <MotiView
      from={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        type: 'timing',
        duration: 400,
        delay: index * 100,
      }}
      style={[
        styles.statCard,
        isHero && styles.heroCard,
        isMilestone && styles.milestoneCard,
      ]}
    >
      <View style={[styles.iconContainer, isHero && styles.heroIcon]}>{icon}</View>
      <Text
        style={[
          profileTypography.stats.number,
          { color: colors.text.primary },
          isHero && styles.heroValue,
        ]}
      >
        {value}
      </Text>
      <Text
        style={[
          profileTypography.stats.label,
          { color: colors.text.secondary },
          isHero && styles.heroLabel,
        ]}
      >
        {label}
      </Text>
      {isMilestone && (
        <View style={styles.milestoneBadge}>
          <Text style={styles.milestoneBadgeText}>🎉</Text>
        </View>
      )}
    </MotiView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.background.secondary,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.background.border,
  },
  heroCard: {
    paddingVertical: 20,
    paddingHorizontal: 18,
    borderWidth: 2,
    borderColor: colors.lime[500] + '25',
    backgroundColor: colors.lime[500] + '06',
    shadowColor: colors.lime[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 5,
  },
  milestoneCard: {
    borderColor: colors.lime[500] + '50',
    backgroundColor: colors.lime[500] + '08',
  },
  iconContainer: {
    marginBottom: 8,
  },
  heroIcon: {
    marginBottom: 12,
  },
  heroValue: {
    fontSize: 34,
    fontWeight: '800',
    color: colors.lime[500],
    letterSpacing: -0.5,
  },
  heroLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text.secondary,
    opacity: 0.9,
  },
  milestoneBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: colors.lime[500],
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  milestoneBadgeText: {
    fontSize: 14,
  },
});

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
  return (
    <View style={styles.container}>
      {/* Current Streak */}
      <StatCard
        icon={<Flame size={24} color={colors.emerald[600]} />}
        value={currentStreak}
        label="Day Streak"
        index={0}
      />

      {/* Total Check-ins */}
      <StatCard
        icon={<Calendar size={24} color={colors.emerald[600]} />}
        value={totalCheckIns}
        label="Check-ins"
        index={1}
      />

      {/* Average Mood */}
      <StatCard
        icon={<Heart size={24} color={colors.emerald[600]} />}
        value={avgMoodRating.toFixed(1)}
        label="Avg Mood"
        index={2}
      />
    </View>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  value: number | string;
  label: string;
  index: number;
}

function StatCard({ icon, value, label, index }: StatCardProps) {
  return (
    <MotiView
      from={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        type: 'timing',
        duration: 400,
        delay: index * 100,
      }}
      style={styles.statCard}
    >
      <View style={styles.iconContainer}>{icon}</View>
      <Text style={[profileTypography.stats.number, { color: colors.text.primary }]}>
        {value}
      </Text>
      <Text style={[profileTypography.stats.label, { color: colors.text.secondary }]}>
        {label}
      </Text>
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
  iconContainer: {
    marginBottom: 8,
  },
});

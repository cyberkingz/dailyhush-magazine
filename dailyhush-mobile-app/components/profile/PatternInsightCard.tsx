/**
 * PatternInsightCard Component
 *
 * Beautiful card for displaying AI-detected patterns and insights
 * Calm, therapeutic design with category-based styling
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MotiView } from 'moti';
import { TrendingUp, Lightbulb, Search, PartyPopper, X } from 'lucide-react-native';
import type { Tables, Enums } from '@/types/supabase';
import { insightCategoryColors } from '@/constants/loopTypeColors';
import { profileTypography } from '@/constants/profileTypography';
import { colors } from '@/constants/colors';

interface PatternInsightCardProps {
  insight: Tables<'user_insights'>;
  index?: number;
  onDismiss?: (insightId: string) => void;
}

export function PatternInsightCard({
  insight,
  index = 0,
  onDismiss,
}: PatternInsightCardProps) {
  // Get category styling
  const categoryConfig = insightCategoryColors[insight.category];
  const categoryColor = categoryConfig?.primary || colors.emerald[600];

  // Get icon component
  const IconComponent = getCategoryIcon(insight.category);

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{
        type: 'timing',
        duration: 400,
        delay: index * 100,
      }}
      style={styles.container}
    >
      {/* Category indicator bar */}
      <View style={[styles.categoryBar, { backgroundColor: categoryColor }]} />

      {/* Dismiss button */}
      {onDismiss && (
        <TouchableOpacity
          style={styles.dismissButton}
          onPress={() => onDismiss(insight.id)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <X size={16} color={colors.text.secondary} />
        </TouchableOpacity>
      )}

      {/* Content */}
      <View style={styles.content}>
        {/* Header with icon */}
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: `${categoryColor}15` }]}>
            <IconComponent size={20} color={categoryColor} strokeWidth={2} />
          </View>
          <Text style={styles.category}>{formatCategory(insight.category)}</Text>
        </View>

        {/* Title */}
        <Text
          style={[
            profileTypography.insights.title,
            { color: colors.text.primary, marginBottom: 8 },
          ]}
        >
          {insight.title}
        </Text>

        {/* Description */}
        <Text
          style={[
            profileTypography.insights.description,
            { color: colors.text.secondary },
          ]}
        >
          {insight.description}
        </Text>

        {/* Metadata footer */}
        <View style={styles.footer}>
          <Text style={styles.confidence}>
            {Math.round((insight.confidence_score || 0) * 100)}% confidence
          </Text>
          <Text style={styles.date}>{formatDate(insight.detected_at)}</Text>
        </View>
      </View>
    </MotiView>
  );
}

/**
 * Get icon component for category
 */
function getCategoryIcon(category: Enums<'insight_category'>) {
  switch (category) {
    case 'pattern':
      return Search;
    case 'progress':
      return TrendingUp;
    case 'recommendation':
      return Lightbulb;
    case 'celebration':
      return PartyPopper;
    default:
      return Lightbulb;
  }
}

/**
 * Format category for display
 */
function formatCategory(category: Enums<'insight_category'>): string {
  const labels: Record<Enums<'insight_category'>, string> = {
    pattern: 'Pattern Detected',
    progress: 'Your Progress',
    recommendation: 'Suggestion',
    celebration: 'Milestone',
  };
  return labels[category] || category;
}

/**
 * Format date for display
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.secondary,
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.background.border,
  },
  categoryBar: {
    height: 4,
    width: '100%',
  },
  dismissButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  category: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.background.border,
  },
  confidence: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.emerald[600],
  },
  date: {
    fontSize: 12,
    color: colors.text.secondary,
  },
});

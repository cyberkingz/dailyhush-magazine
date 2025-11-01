/**
 * LoopCharacteristics Component
 *
 * Beautiful, affirming display of loop type strengths and characteristics
 * Focuses on growth and self-understanding
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { Sparkles, Heart, Target } from 'lucide-react-native';
import type { LoopType } from '@/constants/loopTypes';
import { getLoopTypeConfig } from '@/constants/loopTypes';
import { profileTypography } from '@/constants/profileTypography';
import { colors } from '@/constants/colors';

interface LoopCharacteristicsProps {
  loopType: LoopType;
}

export function LoopCharacteristics({ loopType }: LoopCharacteristicsProps) {
  const config = getLoopTypeConfig(loopType);

  // Use consistent emerald color for all loop types (brand consistency)
  const emeraldColor = colors.emerald[600];

  return (
    <View style={styles.container}>
      {/* Section header */}
      <View style={styles.sectionHeader}>
        <Text
          style={[
            profileTypography.sections.title,
            { color: colors.text.primary },
          ]}
        >
          Understanding Your Loop
        </Text>
        <Text
          style={[
            profileTypography.sections.subtitle,
            { color: colors.text.secondary },
          ]}
        >
          Insights about your {config.name.toLowerCase()} pattern
        </Text>
      </View>

      {/* Strengths Section */}
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 400, delay: 100 }}
      >
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: `${emeraldColor}15` },
              ]}
            >
              <Sparkles size={20} color={emeraldColor} strokeWidth={2} />
            </View>
            <Text style={styles.cardTitle}>Your Strengths</Text>
          </View>
          {config.strengths.slice(0, 3).map((strength, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.bulletPoint}>✦</Text>
              <Text style={styles.listText}>{strength}</Text>
            </View>
          ))}
        </View>
      </MotiView>

      {/* Characteristics Section */}
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 400, delay: 200 }}
      >
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: `${emeraldColor}15` },
              ]}
            >
              <Heart size={20} color={emeraldColor} strokeWidth={2} />
            </View>
            <Text style={styles.cardTitle}>Common Patterns</Text>
          </View>
          {config.characteristics.slice(0, 3).map((characteristic, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.bulletPoint}>✦</Text>
              <Text style={styles.listText}>{characteristic}</Text>
            </View>
          ))}
        </View>
      </MotiView>

      {/* Recommended Actions */}
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 400, delay: 300 }}
      >
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: `${emeraldColor}15` },
              ]}
            >
              <Target size={20} color={emeraldColor} strokeWidth={2} />
            </View>
            <Text style={styles.cardTitle}>Gentle Suggestions</Text>
          </View>
          {config.recommendedActions.slice(0, 2).map((action, index) => (
            <View key={index} style={styles.actionItem}>
              <Text style={styles.actionTitle}>{action.title}</Text>
              <Text style={styles.actionDescription}>{action.description}</Text>
              <Text style={styles.actionFrequency}>{action.frequency}</Text>
            </View>
          ))}
        </View>
      </MotiView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
  },
  sectionHeader: {
    marginBottom: 20,
  },
  card: {
    backgroundColor: colors.background.secondary,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.background.border,
  },
  cardHeader: {
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
  cardTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text.primary,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  bulletPoint: {
    fontSize: 12,
    color: colors.emerald[600],
    marginTop: 2,
  },
  listText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: colors.text.secondary,
  },
  actionItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.background.border,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 6,
  },
  actionDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.text.secondary,
    marginBottom: 6,
  },
  actionFrequency: {
    fontSize: 12,
    color: colors.emerald[600],
    textTransform: 'capitalize',
  },
});

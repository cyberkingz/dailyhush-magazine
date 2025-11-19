/**
 * LoopCharacteristics Component
 *
 * Beautiful, affirming display of loop type strengths and characteristics
 * Focuses on growth and self-understanding
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MotiView } from 'moti';
import { Sparkles, Heart, Target } from 'lucide-react-native';
import type { LoopType } from '@/constants/loopTypes';
import { getLoopTypeConfig } from '@/constants/loopTypes';
import { colors } from '@/constants/colors';

interface LoopCharacteristicsProps {
  loopType: LoopType;
}

export function LoopCharacteristics({ loopType }: LoopCharacteristicsProps) {
  const config = getLoopTypeConfig(loopType);

  // Use consistent lime color for all loop types (brand consistency)
  const limeColor = colors.lime[500];

  return (
    <View style={styles.container}>
      {/* Horizontal scrolling cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        snapToInterval={280}
        decelerationRate="fast">
        {/* Strengths Card */}
        <MotiView
          from={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'timing', duration: 400, delay: 100 }}
          style={styles.horizontalCard}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconContainer, { backgroundColor: `${limeColor}15` }]}>
              <Sparkles size={22} color={limeColor} strokeWidth={2} />
            </View>
          </View>
          <Text style={styles.cardTitle}>Your Strengths</Text>
          <View style={styles.cardContent}>
            {config.strengths.slice(0, 3).map((strength, index) => (
              <View key={index} style={styles.listItem}>
                <Text style={styles.bulletPoint}>✦</Text>
                <Text style={styles.listText}>{strength}</Text>
              </View>
            ))}
          </View>
        </MotiView>

        {/* Characteristics Card */}
        <MotiView
          from={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'timing', duration: 400, delay: 200 }}
          style={styles.horizontalCard}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconContainer, { backgroundColor: `${limeColor}15` }]}>
              <Heart size={22} color={limeColor} strokeWidth={2} />
            </View>
          </View>
          <Text style={styles.cardTitle}>Common Patterns</Text>
          <View style={styles.cardContent}>
            {config.characteristics.slice(0, 3).map((characteristic, index) => (
              <View key={index} style={styles.listItem}>
                <Text style={styles.bulletPoint}>✦</Text>
                <Text style={styles.listText}>{characteristic}</Text>
              </View>
            ))}
          </View>
        </MotiView>

        {/* Gentle Suggestions Card */}
        <MotiView
          from={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'timing', duration: 400, delay: 300 }}
          style={styles.horizontalCard}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconContainer, { backgroundColor: `${limeColor}15` }]}>
              <Target size={22} color={limeColor} strokeWidth={2} />
            </View>
          </View>
          <Text style={styles.cardTitle}>Gentle Suggestions</Text>
          <View style={styles.cardContent}>
            {config.recommendedActions.slice(0, 2).map((action, index) => (
              <View key={index} style={styles.actionItem}>
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.actionDescription}>{action.description}</Text>
                <Text style={styles.actionFrequency}>{action.frequency}</Text>
              </View>
            ))}
          </View>
        </MotiView>
      </ScrollView>

      {/* Scroll indicator hint */}
      <Text style={styles.scrollHint}>← Swipe to explore →</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 16,
  },
  horizontalCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 20,
    padding: 20,
    width: 260,
    minHeight: 280,
    borderWidth: 1,
    borderColor: colors.lime[500] + '10',
  },
  cardHeader: {
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 16,
  },
  cardContent: {
    flex: 1,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    gap: 10,
  },
  bulletPoint: {
    fontSize: 12,
    color: colors.lime[500],
    marginTop: 3,
  },
  listText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: colors.text.secondary,
  },
  actionItem: {
    marginBottom: 14,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.lime[500] + '08',
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  actionFrequency: {
    fontSize: 11,
    color: colors.lime[500],
    textTransform: 'capitalize',
    fontWeight: '500',
  },
  scrollHint: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: 12,
    opacity: 0.6,
    fontStyle: 'italic',
  },
});

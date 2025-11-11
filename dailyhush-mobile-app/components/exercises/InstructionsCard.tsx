/**
 * Nœma - Exercise Instructions Card
 * Reusable component for displaying exercise instructions with persuasion hooks
 *
 * Features:
 * - Ogilvy copywriting principles (research-backed, specific claims)
 * - Cialdini persuasion hooks (Authority, Social Proof, Pre-commitment)
 * - Improved visual hierarchy and spacing
 * - Sticky CTA button with gradient backdrop
 * - Safe area support for notched devices
 */

import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronRight, BookOpen, Sparkles, Users, Clock } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import type { ExerciseConfig } from '@/types/exercises';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { spacing } from '@/constants/spacing';

interface InstructionsCardProps {
  config: ExerciseConfig;
  onContinue: () => void;
}

export function InstructionsCard({ config, onContinue }: InstructionsCardProps) {
  const insets = useSafeAreaInsets();

  const handleContinue = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onContinue();
  };

  return (
    <View style={styles.root}>
      {/* Scrollable Content */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.headline}>
            {config.copy.headline}
          </Text>
          <Text style={styles.subheadline}>
            {config.copy.subheadline}
          </Text>
        </View>

        {/* Persuasion Hooks - Compact Vertical Stack */}
        {config.persuasion && (
          <View style={styles.persuasionCard}>
            {/* Authority Badge */}
            {config.persuasion.authorityBadge && (
              <View style={styles.persuasionRow}>
                <View style={[styles.iconCircle, styles.iconCircleTeal]}>
                  <BookOpen size={16} color={mintAccent} />
                </View>
                <View style={styles.persuasionCopy}>
                  <Text style={styles.persuasionLabel}>
                    AUTHORITY
                  </Text>
                  <Text style={styles.persuasionText}>
                    {config.persuasion.authorityBadge}
                  </Text>
                </View>
              </View>
            )}

            {/* Time Commitment */}
            {config.persuasion.preCommitment && (
              <View style={styles.persuasionRow}>
                <View style={[styles.iconCircle, styles.iconCircleAmber]}>
                  <Clock size={16} color={amberAccent} />
                </View>
                <View style={styles.persuasionCopy}>
                  <Text style={styles.persuasionLabel}>
                    DURATION
                  </Text>
                  <Text style={styles.persuasionText}>
                    {config.persuasion.preCommitment}
                  </Text>
                </View>
              </View>
            )}

            {/* Social Proof */}
            {config.persuasion.socialProof && (
              <View style={styles.persuasionRow}>
                <View style={[styles.iconCircle, styles.iconCircleLavender]}>
                  <Users size={16} color={lavenderAccent} />
                </View>
                <View style={styles.persuasionCopy}>
                  <Text style={styles.persuasionLabel}>
                    COMMUNITY
                  </Text>
                  <Text style={styles.persuasionText}>
                    {config.persuasion.socialProof}
                  </Text>
                </View>
              </View>
            )}
          </View>
        )}

        {/* Instructions List */}
        <View style={styles.instructionsSection}>
          <Text style={styles.instructionsTitle}>How it works:</Text>
          <View style={styles.instructionsList}>
            {config.instructions.map((instruction, index) => (
              <View key={index} style={styles.instructionRow}>
                <View style={styles.stepAvatar}>
                  <Text style={styles.stepNumber}>{index + 1}</Text>
                </View>
                <Text style={styles.instructionCopy}>
                  {instruction}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Pro Tips Section */}
        {config.tips && config.tips.length > 0 && (
          <View style={styles.tipsCard}>
            <View style={styles.tipsHeader}>
              <Sparkles size={18} color={amberAccent} />
              <Text style={styles.tipsTitle}>Pro Tips</Text>
            </View>
            <View style={styles.tipsList}>
              {config.tips.map((tip, index) => (
                <Text key={index} style={styles.tipCopy}>
                  • {tip}
                </Text>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Sticky CTA Button */}
      <LinearGradient
        colors={ctaGradient}
        locations={[0, 0.55, 1]}
        style={[styles.ctaContainer, { paddingBottom: Math.max(insets.bottom, spacing.safeArea.bottom) }]}
      >
        {/* CTA Button */}
        <View style={styles.ctaInner}>
          <TouchableOpacity
            onPress={handleContinue}
            accessibilityLabel={config.copy.ctaStart}
            accessibilityRole="button"
            style={styles.ctaButton}
          >
            <Text style={styles.ctaLabel}>
              {config.copy.ctaStart}
            </Text>
            <ChevronRight size={20} color={colors.background.primary} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}

const mintAccent = '#4FD1C5';
const amberAccent = '#F59E0B';
const lavenderAccent = '#A855F7';
const mindfulTeal = colors.emerald[400];
const forestCard = colors.background.secondary;
const ctaGradient = ['rgba(10, 22, 18, 0)', 'rgba(10, 22, 18, 0.95)', 'rgba(10, 22, 18, 1)'];

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: spacing.lg,
    paddingBottom: 160,
    paddingHorizontal: spacing.screenPadding,
  },
  header: {
    marginBottom: spacing.xl,
  },
  headline: {
    color: colors.text.primary,
    fontFamily: 'Poppins_700Bold',
    fontSize: typography.size.xl,
    lineHeight: typography.size.xl * typography.lineHeight.tight,
    marginBottom: spacing.md,
  },
  subheadline: {
    color: colors.text.secondary,
    fontFamily: 'Inter_400Regular',
    fontSize: typography.size.sm,
    lineHeight: typography.size.sm * typography.lineHeight.relaxed,
    opacity: 0.9,
  },
  persuasionCard: {
    backgroundColor: 'rgba(15, 31, 26, 0.7)',
    borderRadius: spacing.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(64, 145, 108, 0.35)',
    marginBottom: spacing.xl,
    gap: spacing.md,
  },
  persuasionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleTeal: {
    backgroundColor: 'rgba(79, 209, 197, 0.18)',
  },
  iconCircleAmber: {
    backgroundColor: 'rgba(245, 158, 11, 0.18)',
  },
  iconCircleLavender: {
    backgroundColor: 'rgba(168, 85, 247, 0.18)',
  },
  persuasionCopy: {
    flex: 1,
  },
  persuasionLabel: {
    color: colors.text.muted,
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
    letterSpacing: 1,
  },
  persuasionText: {
    color: colors.text.primary,
    fontFamily: 'Inter_600SemiBold',
    fontSize: typography.size.sm,
    marginTop: 2,
  },
  instructionsSection: {
    marginBottom: spacing.xl,
  },
  instructionsTitle: {
    color: colors.text.primary,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: typography.size.lg,
    marginBottom: spacing.md,
  },
  instructionsList: {
    gap: spacing.md,
  },
  instructionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  stepAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(16, 185, 129, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  stepNumber: {
    color: mindfulTeal,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
  },
  instructionCopy: {
    flex: 1,
    color: colors.text.secondary,
    fontFamily: 'Inter_400Regular',
    fontSize: typography.size.base,
    lineHeight: typography.size.base * typography.lineHeight.normal,
  },
  tipsCard: {
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    borderColor: 'rgba(245, 158, 11, 0.3)',
    borderWidth: 1,
    borderRadius: spacing.xl,
    padding: spacing.lg,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  tipsTitle: {
    color: '#FCD34D',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: typography.size.sm,
    letterSpacing: 0.3,
  },
  tipsList: {
    gap: spacing.sm,
  },
  tipCopy: {
    color: colors.text.secondary,
    fontFamily: 'Inter_400Regular',
    fontSize: typography.size.sm,
    lineHeight: typography.size.sm * typography.lineHeight.relaxed,
  },
  ctaContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: spacing.xl * 2,
    zIndex: 10,
  },
  ctaInner: {
    paddingHorizontal: spacing.screenPadding,
  },
  ctaButton: {
    backgroundColor: mindfulTeal,
    borderRadius: spacing.xl,
    paddingVertical: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    shadowColor: mindfulTeal,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
  },
  ctaLabel: {
    color: forestCard,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: typography.size.base,
  },
});

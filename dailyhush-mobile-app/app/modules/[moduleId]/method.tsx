/**
 * Method Selection Screen
 * Shows available methods (Quick Exercise, Breathing, etc.) for a selected module
 * Dynamic route: /modules/[moduleId]/method
 */

import React, { useEffect, useMemo, useState } from 'react';
import { View, ScrollView, StyleSheet, SafeAreaView, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Check,
  ChevronRight,
  Clock,
  Lock,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { Text } from '@/components/ui/text';
import { PageHeader } from '@/components/PageHeader';
import { getModule, type Module, type ModuleId } from '@/constants/modules';
import { getMethodsForModule, type Method } from '@/constants/methods';
import { useAnalytics } from '@/utils/analytics';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { brandFonts } from '@/constants/profileTypography';
import {
  CYCLIC_SIGH_CONFIG,
  GROUNDING_5_4_3_2_1_CONFIG,
  BREATHING_4_7_8_CONFIG,
  EMOTION_WHEEL_CONFIG,
  BRAIN_DUMP_CONFIG,
  MIND_CLEAR_CONFIG,
  type ExerciseConfig,
} from '@/constants/exerciseConfigs';

type PersuasionMeta = {
  authority?: string;
  socialProof?: string;
  commitment?: string;
};

const BACKGROUND_GRADIENT = [
  colors.background.primary,
  '#091c16',
  colors.background.primary,
] as const;
const CARD_BORDER_GRADIENT = ['rgba(122, 248, 89, 0.28)', 'rgba(16, 185, 129, 0.08)'] as const;

const EXERCISE_ROUTE_CONFIG: Partial<Record<string, ExerciseConfig>> = {
  '/exercises/cyclic-sigh': CYCLIC_SIGH_CONFIG,
  '/exercises/grounding': GROUNDING_5_4_3_2_1_CONFIG,
  '/exercises/breathing': BREATHING_4_7_8_CONFIG,
  '/exercises/emotion-wheel': EMOTION_WHEEL_CONFIG,
  '/exercises/brain-dump': BRAIN_DUMP_CONFIG,
  '/exercises/mind-clear': MIND_CLEAR_CONFIG,
};

const METHOD_PERSUASION_OVERRIDES: Record<string, PersuasionMeta> = {
  '/spiral': {
    authority: 'Clinical 90-second protocol',
    socialProof: 'Most-used spiral reset today',
    commitment: '90 seconds',
  },
  '/anna/conversation': {
    authority: 'Guided by Anna AI companion',
    socialProof: 'Personalized support when you need it',
    commitment: 'Takes 7-10 minutes',
  },
  '/insights/emotions': {
    authority: 'Powered by your loop patterns',
    socialProof: 'See emotional trends over time',
    commitment: 'Interactive dashboard',
  },
  '/insights/sleep': {
    authority: 'Sleep pattern analytics',
    socialProof: 'Connect routines to rest quality',
    commitment: 'Explore at your pace',
  },
  '/insights/focus': {
    authority: 'Productivity pattern insights',
    socialProof: 'Understand when you focus best',
    commitment: 'Interactive dashboard',
  },
};

function getPersuasionMeta(method: Method): PersuasionMeta | null {
  const exerciseConfig = EXERCISE_ROUTE_CONFIG[method.route];
  if (exerciseConfig?.persuasion) {
    const { authorityBadge, socialProof, preCommitment } = exerciseConfig.persuasion;
    return {
      authority: authorityBadge,
      socialProof,
      commitment: preCommitment,
    };
  }

  return METHOD_PERSUASION_OVERRIDES[method.route] ?? null;
}

export default function MethodSelectionScreen() {
  const params = useLocalSearchParams<{ moduleId: string; moduleName?: string }>();
  const moduleId = params.moduleId as ModuleId;
  const moduleName = params.moduleName;

  const [module, setModule] = useState<Module | null>(null);
  const [methods, setMethods] = useState<Method[]>([]);
  const analytics = useAnalytics();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!moduleId) {
      console.error('[MethodSelection] Missing moduleId');
      router.back();
      return;
    }

    const moduleData = getModule(moduleId);
    if (!moduleData) {
      console.error('[MethodSelection] Invalid moduleId:', moduleId);
      router.back();
      return;
    }

    setModule(moduleData);

    // Exercises only – talk-to-anna surfaces on previous screen
    const moduleMethods = getMethodsForModule(moduleId).filter(
      (method) => method.id !== 'talk-to-anna'
    );
    setMethods(moduleMethods);

    analytics.track('METHOD_SELECTION_VIEWED', {
      module_id: moduleId,
      module_name: moduleData.title,
      available_methods: moduleMethods.length,
    });
  }, [moduleId, analytics]);

  const handleMethodPress = (method: Method) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    analytics.track('METHOD_SELECTED', {
      module_id: moduleId,
      module_name: module?.title,
      method_id: method.id,
      method_title: method.title,
      duration: method.duration,
      is_recommended: method.isRecommended || false,
    });

    router.push({
      pathname: method.route as any,
      params: {
        ...method.params,
        moduleId,
        moduleName: moduleName || module?.title,
        source: 'module-selection',
      },
    });
  };

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const bottomPadding = useMemo(
    () => spacing['4xl'] + Math.max(insets.bottom, spacing.safeArea.bottom),
    [insets.bottom]
  );

  if (!module) return null;

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <LinearGradient
        pointerEvents="none"
        colors={BACKGROUND_GRADIENT}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safeArea}>
        <PageHeader title={module.title} subtitle="Choose your pathway" onBack={handleBack} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: spacing.screenPadding,
            paddingTop: spacing.md,
            paddingBottom: bottomPadding,
          }}>
          <View style={styles.heroCard}>
            <View style={styles.heroIcon}>
              <Text style={styles.heroIconText}>{module.icon}</Text>
            </View>
            <Text style={styles.heroSubtitle}>{module.subtitle}</Text>
            <Text style={styles.heroTitle}>{module.title}</Text>
            <Text style={styles.heroDescription}>{module.description}</Text>

            <View style={styles.heroMetaRow}>
              <View style={styles.heroMetaPill}>
                <Clock size={16} color={colors.lime[200]} strokeWidth={2.5} />
                <Text style={styles.heroMetaText}>{module.estimatedDuration}</Text>
              </View>
              <View style={styles.heroMetaPill}>
                <Users size={16} color={colors.lime[200]} strokeWidth={2.5} />
                <Text style={styles.heroMetaText}>{methods.length} options</Text>
              </View>
            </View>
          </View>

          {methods.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No methods available yet</Text>
              <Text style={styles.emptySubtitle}>
                We&apos;re crafting new exercises for this module. Check back soon for additional
                pathways.
              </Text>
            </View>
          ) : (
            methods.map((method) => {
              const persuasion = getPersuasionMeta(method);
              const benefits = method.benefits.slice(0, 3);

              return (
                <Pressable
                  key={method.id}
                  onPress={() => handleMethodPress(method)}
                  style={({ pressed }) => [
                    styles.methodCard,
                    pressed ? styles.methodCardPressed : null,
                  ]}>
                  <LinearGradient colors={CARD_BORDER_GRADIENT} style={styles.methodBorder}>
                    <View style={styles.methodInner}>
                      <View style={styles.methodHeader}>
                        <View style={styles.methodIconContainer}>
                          <Text style={styles.methodIcon}>{method.icon}</Text>
                        </View>

                        <View style={styles.badgeStack}>
                          {method.isRecommended && (
                            <View style={styles.recommendedBadge}>
                              <Sparkles
                                size={14}
                                color={colors.background.primary}
                                strokeWidth={3}
                              />
                              <Text style={styles.recommendedText}>Recommended</Text>
                            </View>
                          )}
                          {method.isPremium && (
                            <View style={styles.premiumBadge}>
                              <Lock size={14} color={colors.text.secondary} strokeWidth={2.5} />
                              <Text style={styles.premiumText}>Premium</Text>
                            </View>
                          )}
                        </View>
                      </View>

                      <Text style={styles.methodTitle}>{method.title}</Text>
                      <Text style={styles.methodSubtitle}>{method.subtitle}</Text>

                      {persuasion && (
                        <View style={styles.persuasionRow}>
                          {persuasion.authority && (
                            <View style={styles.persuasionBadge}>
                              <ShieldCheck size={14} color={colors.lime[300]} strokeWidth={2.5} />
                              <Text style={styles.persuasionText}>{persuasion.authority}</Text>
                            </View>
                          )}
                          {persuasion.socialProof && (
                            <View style={styles.persuasionBadge}>
                              <Users size={14} color={colors.lime[300]} strokeWidth={2.5} />
                              <Text style={styles.persuasionText}>{persuasion.socialProof}</Text>
                            </View>
                          )}
                          {persuasion.commitment && (
                            <View style={styles.persuasionBadge}>
                              <Clock size={14} color={colors.lime[300]} strokeWidth={2.5} />
                              <Text style={styles.persuasionText}>{persuasion.commitment}</Text>
                            </View>
                          )}
                        </View>
                      )}

                      <Text style={styles.methodDescription}>{method.description}</Text>

                      {benefits.length > 0 && (
                        <View style={styles.benefitList}>
                          {benefits.map((benefit) => (
                            <View key={benefit} style={styles.benefitItem}>
                              <Check size={16} color={colors.lime[400]} strokeWidth={3} />
                              <Text style={styles.benefitText}>{benefit}</Text>
                            </View>
                          ))}
                        </View>
                      )}

                      <View style={styles.methodFooter}>
                        <View style={styles.durationRow}>
                          <Clock size={18} color={colors.text.secondary} strokeWidth={2.5} />
                          <Text style={styles.durationText}>{method.duration}</Text>
                        </View>
                        <ChevronRight size={20} color={colors.text.muted} strokeWidth={2.5} />
                      </View>
                    </View>
                  </LinearGradient>
                </Pressable>
              );
            })
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  safeArea: {
    flex: 1,
  },
  heroCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 28,
    padding: spacing['2xl'],
    borderWidth: 1,
    borderColor: colors.background.border,
    shadowColor: colors.shadow.dark,
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.35,
    shadowRadius: 32,
    elevation: 18,
    marginBottom: spacing['2xl'],
  },
  heroIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(122, 248, 89, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(122, 248, 89, 0.3)',
    marginBottom: spacing.md,
  },
  heroIconText: {
    fontSize: 32,
  },
  heroSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.8,
    color: colors.text.tertiary,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  heroTitle: {
    fontSize: 28,
    fontFamily: brandFonts.headlineBold,
    color: colors.text.primary,
    letterSpacing: 0.3,
    marginBottom: spacing.sm,
  },
  heroDescription: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.text.secondary,
    opacity: 0.94,
  },
  heroMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing['2xl'],
  },
  heroMetaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 999,
    backgroundColor: 'rgba(122, 248, 89, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(122, 248, 89, 0.3)',
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  heroMetaText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.lime[200],
    marginLeft: spacing.xs,
    letterSpacing: 0.3,
  },
  emptyState: {
    marginTop: spacing['2xl'],
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: brandFonts.headlineSemiBold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.text.secondary,
    textAlign: 'center',
    opacity: 0.85,
  },
  methodCard: {
    borderRadius: 28,
    marginBottom: spacing['xl'],
    shadowColor: colors.shadow.dark,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.3,
    shadowRadius: 28,
    elevation: 16,
  },
  methodCardPressed: {
    transform: [{ scale: 0.985 }],
    shadowOpacity: 0.18,
  },
  methodBorder: {
    borderRadius: 28,
    padding: 1,
  },
  methodInner: {
    borderRadius: 27,
    backgroundColor: colors.background.secondary,
    padding: spacing['xl'],
    borderWidth: 1,
    borderColor: colors.background.border,
  },
  methodHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  methodIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(122, 248, 89, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(122, 248, 89, 0.28)',
  },
  methodIcon: {
    fontSize: 30,
    lineHeight: 34,
  },
  badgeStack: {
    alignItems: 'flex-end',
  },
  recommendedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 999,
    backgroundColor: colors.lime[500],
  },
  recommendedText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.background.primary,
    marginLeft: spacing.xs,
    letterSpacing: 0.4,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 999,
    backgroundColor: 'rgba(9, 28, 22, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(122, 248, 89, 0.18)',
  },
  premiumText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text.secondary,
    marginLeft: spacing.xs,
    letterSpacing: 0.4,
  },
  methodTitle: {
    marginTop: spacing.lg,
    fontSize: 22,
    fontFamily: brandFonts.headlineSemiBold,
    color: colors.text.primary,
    letterSpacing: 0.2,
  },
  methodSubtitle: {
    marginTop: spacing.xs,
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.tertiary,
    letterSpacing: 0.4,
  },
  persuasionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.md,
    marginHorizontal: -spacing.xs,
  },
  persuasionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 999,
    backgroundColor: 'rgba(122, 248, 89, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(122, 248, 89, 0.28)',
    marginHorizontal: spacing.xs,
    marginBottom: spacing.sm,
  },
  persuasionText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.lime[200],
    marginLeft: spacing.xs,
    letterSpacing: 0.2,
  },
  methodDescription: {
    marginTop: spacing.md,
    fontSize: 15,
    lineHeight: 22,
    color: colors.text.secondary,
    opacity: 0.92,
  },
  benefitList: {
    marginTop: spacing.lg,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  benefitText: {
    fontSize: 14,
    color: colors.text.secondary,
    marginLeft: spacing.sm,
    letterSpacing: 0.2,
  },
  methodFooter: {
    marginTop: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.secondary,
    marginLeft: spacing.xs,
    letterSpacing: 0.3,
  },
});

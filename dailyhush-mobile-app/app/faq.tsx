/**
 * Nœma - FAQ (Frequently Asked Questions)
 * Help users understand how to use the app
 */

import { useRouter, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { ArrowLeft, ChevronDown } from 'lucide-react-native';
import { useState } from 'react';

import { Text } from '@/components/ui/text';
import { ScrollFadeView } from '@/components/ScrollFadeView';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'What is a "spiral"?',
    answer:
      'A spiral is an overthinking pattern where your thoughts loop repeatedly, often triggered by shame or anxiety. It&apos;s that feeling when you can&apos;t stop replaying a conversation, worrying about what someone thinks of you, or catastrophizing about the future. Nœma helps you recognize and interrupt these patterns.',
  },
  {
    question: 'How does the 90-second interrupt work?',
    answer:
      'Our F.I.R.E. protocol (Focus, Interrupt, Reframe, Execute) uses cognitive behavioral techniques to break the spiral. It takes just 90 seconds and has been shown to interrupt shame-driven rumination. You&apos;ll be guided through grounding exercises that shift your nervous system out of fight-or-flight mode.',
  },
  {
    question: 'Is my data private and secure?',
    answer:
      'Absolutely. All your spiral logs, journal entries, and patterns are stored securely and encrypted. We never sell your data. We never share it with third parties. You can delete your account and all your data at any time from Settings. Your healing journey is completely private.',
  },
  {
    question: 'What are "patterns"?',
    answer:
      'Patterns are AI-generated insights about your spiraling triggers, times, and situations. Nœma analyzes your spiral logs (completely privately) to help you notice what triggers spirals—like certain times of day, locations, or situations. This awareness is the first step toward healing.',
  },
  {
    question: 'Do I need to log every spiral?',
    answer:
      'No. Log spirals whenever you want to track them or get support. Even logging one spiral per week can reveal helpful patterns over time. The app is here to support you, not create pressure or shame.',
  },
  {
    question: 'How do I delete my account?',
    answer:
      'Go to Settings → Delete Account. You&apos;ll be asked to confirm your password, then all your data will be permanently deleted. This action cannot be undone.',
  },
  {
    question: 'What if I&apos;m having a mental health crisis?',
    answer:
      'Nœma is a wellness tool, not a replacement for professional mental health support. If you&apos;re in crisis, please contact:\n\n• National Suicide Prevention Lifeline: 988\n• Crisis Text Line: Text HOME to 741741\n• Emergency Services: 911\n\nFor ongoing support, please consider working with a licensed therapist.',
  },
  {
    question: 'Can I use Nœma without creating an account?',
    answer:
      'Yes! When you first open the app, you can try the spiral interrupt protocol without signing up. However, to save your spiral logs, track patterns, and sync across devices, you&apos;ll need to create a free account.',
  },
  {
    question: 'How much does Nœma cost?',
    answer:
      'Nœma is currently free to use. All core features—spiral interrupts, pattern tracking, and AI insights—are available at no cost. We believe everyone deserves access to mental wellness tools.',
  },
  {
    question: 'Why do you ask for my age?',
    answer:
      'Age is optional during onboarding. We ask because it helps us personalize the app experience (like font sizes for different age groups). We never use your age for advertising or share it with anyone.',
  },
  {
    question: 'What are the daily quotes for?',
    answer:
      'Daily quotes are gentle reminders that healing is possible. They&apos;re designed to be shame-free, compassionate, and grounding. You can turn off quote notifications in Settings if you prefer.',
  },
  {
    question: 'Can I export my data?',
    answer:
      'Currently, you can view all your spiral logs in the History tab. We&apos;re working on an export feature that will let you download your data as a PDF or CSV file. Stay tuned!',
  },
  {
    question: 'How do I contact support?',
    answer:
      'Email us at hello@noema.app. We typically respond within 24-48 hours. For urgent app issues, please include "URGENT" in your subject line.',
  },
  {
    question: 'Does Nœma work offline?',
    answer:
      'Yes! You can use the spiral interrupt protocol and log spirals offline. Your data will sync automatically when you reconnect to the internet.',
  },
  {
    question: 'What if the app isn&apos;t working?',
    answer:
      'First, try:\n\n1. Force-closing the app and reopening\n2. Checking for app updates in the App Store\n3. Restarting your phone\n\nIf issues persist, email hello@noema.app with details about what&apos;s happening and screenshots if possible.',
  },
];

export default function FAQ() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleQuestion = async (index: number) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="light" />

      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.md,
          paddingTop: insets.top + spacing.safeArea.top,
          borderBottomWidth: 1,
          borderBottomColor: colors.background.border,
        }}>
        <Pressable
          onPress={async () => {
            await Haptics.selectionAsync();
            router.back();
          }}
          style={{
            width: 56,
            height: 56,
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: -12,
          }}>
          <ArrowLeft size={28} color={colors.text.secondary} strokeWidth={2} />
        </Pressable>

        <View style={{ flex: 1, alignItems: 'center', paddingHorizontal: spacing.md }}>
          <Text
            style={{
              fontSize: typography.size.xl,
              fontWeight: typography.fontWeight.bold,
              color: colors.text.primary,
              lineHeight: typography.size.xl * typography.lineHeight.tight,
            }}>
            Help & FAQs
          </Text>
        </View>

        <View style={{ width: 56 }} />
      </View>

      <ScrollFadeView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.lg,
          paddingBottom: 100 + insets.bottom,
        }}
        showsVerticalScrollIndicator={false}
        fadeColor={colors.background.primary}
        fadeHeight={48}
        fadeIntensity={0.95}
        fadeVisibility="always">
        {/* Intro */}
        <View style={{ marginBottom: spacing.xl }}>
          <Text
            style={{
              fontSize: typography.size.base,
              color: colors.text.secondary,
              lineHeight: typography.size.base * typography.lineHeight.relaxed,
            }}>
            Common questions about using Nœma. Can&apos;t find what you&apos;re looking for?
            Email us at{' '}
            <Text
              style={{ color: colors.emerald[400], fontWeight: typography.fontWeight.semibold }}>
              hello@noema.app
            </Text>
          </Text>
        </View>

        {/* FAQ Accordion */}
        {faqs.map((faq, index) => (
          <View
            key={index}
            style={{
              marginBottom: spacing.md,
              backgroundColor: colors.background.card,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: colors.background.border,
              overflow: 'hidden',
            }}>
            <Pressable
              onPress={() => toggleQuestion(index)}
              style={{
                padding: spacing.lg,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  flex: 1,
                  fontSize: typography.size.base,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.text.primary,
                  lineHeight: typography.size.base * typography.lineHeight.normal,
                  marginRight: spacing.md,
                }}>
                {faq.question}
              </Text>
              <ChevronDown
                size={24}
                color={colors.text.secondary}
                strokeWidth={2}
                style={{
                  transform: [{ rotate: expandedIndex === index ? '180deg' : '0deg' }],
                }}
              />
            </Pressable>

            {expandedIndex === index && (
              <View
                style={{
                  paddingHorizontal: spacing.lg,
                  paddingBottom: spacing.lg,
                  paddingTop: spacing.xs,
                }}>
                <Text
                  style={{
                    fontSize: typography.size.base,
                    color: colors.text.secondary,
                    lineHeight: typography.size.base * typography.lineHeight.relaxed,
                  }}>
                  {faq.answer}
                </Text>
              </View>
            )}
          </View>
        ))}

        {/* Still Need Help */}
        <View
          style={{
            marginTop: spacing.xl,
            padding: spacing.lg,
            backgroundColor: colors.emerald[900] + '40',
            borderRadius: 16,
            borderWidth: 1,
            borderColor: colors.emerald[700] + '40',
          }}>
          <Text
            style={{
              fontSize: typography.size.base,
              fontWeight: typography.fontWeight.semibold,
              color: colors.text.primary,
              marginBottom: spacing.sm,
            }}>
            Still need help?
          </Text>
          <Text
            style={{
              fontSize: typography.size.sm,
              color: colors.text.secondary,
              lineHeight: typography.size.sm * typography.lineHeight.relaxed,
            }}>
            We&apos;re here for you. Email{' '}
            <Text
              style={{ color: colors.emerald[400], fontWeight: typography.fontWeight.semibold }}>
              hello@noema.app
            </Text>{' '}
            and we&apos;ll get back to you within 24-48 hours.
          </Text>
        </View>
      </ScrollFadeView>
    </View>
  );
}

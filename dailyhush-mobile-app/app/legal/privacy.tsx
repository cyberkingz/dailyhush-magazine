/**
 * Nœma - Privacy Policy
 * How we protect and handle user data
 */

import { useRouter, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { ArrowLeft } from 'lucide-react-native';

import { Text } from '@/components/ui/text';
import { ScrollFadeView } from '@/components/ScrollFadeView';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

export default function PrivacyPolicy() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

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
            Privacy Policy
          </Text>
        </View>

        <View style={{ width: 56 }} />
      </View>

      <ScrollFadeView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.lg,
          paddingBottom: spacing.safeArea.bottom + insets.bottom,
        }}
        showsVerticalScrollIndicator={false}
        fadeColor={colors.background.primary}
        fadeHeight={48}
        fadeIntensity={0.95}
        fadeVisibility="always">
        <Text
          style={{
            fontSize: typography.size.sm,
            color: colors.text.muted,
            marginBottom: spacing.xl,
          }}>
          Last updated: January 2025
        </Text>

        {/* Your Privacy Matters */}
        <View style={{ marginBottom: spacing.xl }}>
          <Text
            style={{
              fontSize: typography.size.lg,
              fontWeight: typography.fontWeight.bold,
              color: colors.text.primary,
              marginBottom: spacing.md,
            }}>
            Your Privacy Matters
          </Text>
          <Text
            style={{
              fontSize: typography.size.base,
              color: colors.text.secondary,
              lineHeight: typography.size.base * typography.lineHeight.relaxed,
            }}>
            Nœma is built with your privacy at its core. We believe your healing journey should
            be completely private. This policy explains how we collect, use, and protect your
            information.
          </Text>
        </View>

        {/* Information We Collect */}
        <View style={{ marginBottom: spacing.xl }}>
          <Text
            style={{
              fontSize: typography.size.lg,
              fontWeight: typography.fontWeight.bold,
              color: colors.text.primary,
              marginBottom: spacing.md,
            }}>
            Information We Collect
          </Text>

          <Text
            style={{
              fontSize: typography.size.base,
              fontWeight: typography.fontWeight.semibold,
              color: colors.text.primary,
              marginTop: spacing.md,
              marginBottom: spacing.sm,
            }}>
            Account Information
          </Text>
          <Text
            style={{
              fontSize: typography.size.base,
              color: colors.text.secondary,
              lineHeight: typography.size.base * typography.lineHeight.relaxed,
            }}>
            • Email address (for account creation and login)
          </Text>
          <Text
            style={{
              fontSize: typography.size.base,
              color: colors.text.secondary,
              lineHeight: typography.size.base * typography.lineHeight.relaxed,
            }}>
            • Password (encrypted and never stored in plain text)
          </Text>
          <Text
            style={{
              fontSize: typography.size.base,
              color: colors.text.secondary,
              lineHeight: typography.size.base * typography.lineHeight.relaxed,
            }}>
            • Name (optional, for personalization)
          </Text>
          <Text
            style={{
              fontSize: typography.size.base,
              color: colors.text.secondary,
              lineHeight: typography.size.base * typography.lineHeight.relaxed,
            }}>
            • Age (optional, for interface customization)
          </Text>

          <Text
            style={{
              fontSize: typography.size.base,
              fontWeight: typography.fontWeight.semibold,
              color: colors.text.primary,
              marginTop: spacing.md,
              marginBottom: spacing.sm,
            }}>
            Spiral & Pattern Data
          </Text>
          <Text
            style={{
              fontSize: typography.size.base,
              color: colors.text.secondary,
              lineHeight: typography.size.base * typography.lineHeight.relaxed,
            }}>
            • Spiral logs (time, duration, location, notes)
          </Text>
          <Text
            style={{
              fontSize: typography.size.base,
              color: colors.text.secondary,
              lineHeight: typography.size.base * typography.lineHeight.relaxed,
            }}>
            • Pattern insights generated by our AI
          </Text>
          <Text
            style={{
              fontSize: typography.size.base,
              color: colors.text.secondary,
              lineHeight: typography.size.base * typography.lineHeight.relaxed,
            }}>
            • F.I.R.E. protocol completion data
          </Text>
          <Text
            style={{
              fontSize: typography.size.base,
              color: colors.text.secondary,
              lineHeight: typography.size.base * typography.lineHeight.relaxed,
            }}>
            • Quiz responses (if you take our overthinking quiz)
          </Text>

          <Text
            style={{
              fontSize: typography.size.base,
              fontWeight: typography.fontWeight.semibold,
              color: colors.text.primary,
              marginTop: spacing.md,
              marginBottom: spacing.sm,
            }}>
            Technical Information
          </Text>
          <Text
            style={{
              fontSize: typography.size.base,
              color: colors.text.secondary,
              lineHeight: typography.size.base * typography.lineHeight.relaxed,
            }}>
            • Device type and operating system
          </Text>
          <Text
            style={{
              fontSize: typography.size.base,
              color: colors.text.secondary,
              lineHeight: typography.size.base * typography.lineHeight.relaxed,
            }}>
            • App version
          </Text>
          <Text
            style={{
              fontSize: typography.size.base,
              color: colors.text.secondary,
              lineHeight: typography.size.base * typography.lineHeight.relaxed,
            }}>
            • Crash reports and error logs (anonymous)
          </Text>
        </View>

        {/* How We Use Your Information */}
        <View style={{ marginBottom: spacing.xl }}>
          <Text
            style={{
              fontSize: typography.size.lg,
              fontWeight: typography.fontWeight.bold,
              color: colors.text.primary,
              marginBottom: spacing.md,
            }}>
            How We Use Your Information
          </Text>
          <Text
            style={{
              fontSize: typography.size.base,
              color: colors.text.secondary,
              lineHeight: typography.size.base * typography.lineHeight.relaxed,
              marginBottom: spacing.md,
            }}>
            We use your information to:
          </Text>
          <Text
            style={{
              fontSize: typography.size.base,
              color: colors.text.secondary,
              lineHeight: typography.size.base * typography.lineHeight.relaxed,
            }}>
            • Provide the spiral interrupt protocol
          </Text>
          <Text
            style={{
              fontSize: typography.size.base,
              color: colors.text.secondary,
              lineHeight: typography.size.base * typography.lineHeight.relaxed,
            }}>
            • Generate AI-powered pattern insights
          </Text>
          <Text
            style={{
              fontSize: typography.size.base,
              color: colors.text.secondary,
              lineHeight: typography.size.base * typography.lineHeight.relaxed,
            }}>
            • Save and sync your data across devices
          </Text>
          <Text
            style={{
              fontSize: typography.size.base,
              color: colors.text.secondary,
              lineHeight: typography.size.base * typography.lineHeight.relaxed,
            }}>
            • Send you daily quotes (if enabled)
          </Text>
          <Text
            style={{
              fontSize: typography.size.base,
              color: colors.text.secondary,
              lineHeight: typography.size.base * typography.lineHeight.relaxed,
            }}>
            • Improve the app based on usage patterns
          </Text>
          <Text
            style={{
              fontSize: typography.size.base,
              color: colors.text.secondary,
              lineHeight: typography.size.base * typography.lineHeight.relaxed,
            }}>
            • Provide customer support
          </Text>
        </View>

        {/* What We Don&apos;t Do */}
        <View
          style={{
            marginBottom: spacing.xl,
            backgroundColor: colors.emerald[900] + '40',
            borderRadius: 16,
            padding: spacing.lg,
            borderWidth: 1,
            borderColor: colors.emerald[700] + '40',
          }}>
          <Text
            style={{
              fontSize: typography.size.lg,
              fontWeight: typography.fontWeight.bold,
              color: colors.text.primary,
              marginBottom: spacing.md,
            }}>
            What We Don&apos;t Do
          </Text>
          <Text
            style={{
              fontSize: typography.size.base,
              color: colors.text.secondary,
              lineHeight: typography.size.base * typography.lineHeight.relaxed,
            }}>
            ✓ We never sell your data
          </Text>
          <Text
            style={{
              fontSize: typography.size.base,
              color: colors.text.secondary,
              lineHeight: typography.size.base * typography.lineHeight.relaxed,
            }}>
            ✓ We never share your data with third parties
          </Text>
          <Text
            style={{
              fontSize: typography.size.base,
              color: colors.text.secondary,
              lineHeight: typography.size.base * typography.lineHeight.relaxed,
            }}>
            ✓ We never use your data for advertising
          </Text>
          <Text
            style={{
              fontSize: typography.size.base,
              color: colors.text.secondary,
              lineHeight: typography.size.base * typography.lineHeight.relaxed,
            }}>
            ✓ We never access your data without your permission
          </Text>
          <Text
            style={{
              fontSize: typography.size.base,
              color: colors.text.secondary,
              lineHeight: typography.size.base * typography.lineHeight.relaxed,
            }}>
            ✓ Your spiral logs are completely private
          </Text>
        </View>

        {/* Data Security */}
        <View style={{ marginBottom: spacing.xl }}>
          <Text
            style={{
              fontSize: typography.size.lg,
              fontWeight: typography.fontWeight.bold,
              color: colors.text.primary,
              marginBottom: spacing.md,
            }}>
            Data Security
          </Text>
          <Text
            style={{
              fontSize: typography.size.base,
              color: colors.text.secondary,
              lineHeight: typography.size.base * typography.lineHeight.relaxed,
              marginBottom: spacing.md,
            }}>
            Your data is encrypted both in transit and at rest. We use industry-standard security
            measures including:
          </Text>
          <Text
            style={{
              fontSize: typography.size.base,
              color: colors.text.secondary,
              lineHeight: typography.size.base * typography.lineHeight.relaxed,
            }}>
            • SSL/TLS encryption for all data transmission
          </Text>
          <Text
            style={{
              fontSize: typography.size.base,
              color: colors.text.secondary,
              lineHeight: typography.size.base * typography.lineHeight.relaxed,
            }}>
            • Encrypted database storage via Supabase
          </Text>
          <Text
            style={{
              fontSize: typography.size.base,
              color: colors.text.secondary,
              lineHeight: typography.size.base * typography.lineHeight.relaxed,
            }}>
            • Secure authentication with JWT tokens
          </Text>
          <Text
            style={{
              fontSize: typography.size.base,
              color: colors.text.secondary,
              lineHeight: typography.size.base * typography.lineHeight.relaxed,
            }}>
            • Regular security audits
          </Text>
        </View>

        {/* AI & Pattern Insights */}
        <View style={{ marginBottom: spacing.xl }}>
          <Text
            style={{
              fontSize: typography.size.lg,
              fontWeight: typography.fontWeight.bold,
              color: colors.text.primary,
              marginBottom: spacing.md,
            }}>
            AI & Pattern Insights
          </Text>
          <Text
            style={{
              fontSize: typography.size.base,
              color: colors.text.secondary,
              lineHeight: typography.size.base * typography.lineHeight.relaxed,
            }}>
            Our AI analyzes your spiral logs to generate personalized insights. This analysis
            happens privately and securely. The AI never shares your personal information with
            anyone, including us. Pattern insights are stored only in your private account.
          </Text>
        </View>

        {/* Data Retention & Deletion */}
        <View style={{ marginBottom: spacing.xl }}>
          <Text
            style={{
              fontSize: typography.size.lg,
              fontWeight: typography.fontWeight.bold,
              color: colors.text.primary,
              marginBottom: spacing.md,
            }}>
            Data Retention & Deletion
          </Text>
          <Text
            style={{
              fontSize: typography.size.base,
              color: colors.text.secondary,
              lineHeight: typography.size.base * typography.lineHeight.relaxed,
            }}>
            • Your data is retained as long as your account is active
          </Text>
          <Text
            style={{
              fontSize: typography.size.base,
              color: colors.text.secondary,
              lineHeight: typography.size.base * typography.lineHeight.relaxed,
            }}>
            • You can delete your account and all data at any time from Settings
          </Text>
          <Text
            style={{
              fontSize: typography.size.base,
              color: colors.text.secondary,
              lineHeight: typography.size.base * typography.lineHeight.relaxed,
            }}>
            • Account deletion is permanent and cannot be undone
          </Text>
          <Text
            style={{
              fontSize: typography.size.base,
              color: colors.text.secondary,
              lineHeight: typography.size.base * typography.lineHeight.relaxed,
            }}>
            • We delete all your data within 30 days of account deletion
          </Text>
        </View>

        {/* Children&apos;s Privacy */}
        <View style={{ marginBottom: spacing.xl }}>
          <Text
            style={{
              fontSize: typography.size.lg,
              fontWeight: typography.fontWeight.bold,
              color: colors.text.primary,
              marginBottom: spacing.md,
            }}>
            Children&apos;s Privacy
          </Text>
          <Text
            style={{
              fontSize: typography.size.base,
              color: colors.text.secondary,
              lineHeight: typography.size.base * typography.lineHeight.relaxed,
            }}>
            Nœma is intended for users 18 years and older. We do not knowingly collect
            information from children under 18. If you believe we have collected information from a
            child under 18, please contact us at hello@daily-hush.com.
          </Text>
        </View>

        {/* Changes to This Policy */}
        <View style={{ marginBottom: spacing.xl }}>
          <Text
            style={{
              fontSize: typography.size.lg,
              fontWeight: typography.fontWeight.bold,
              color: colors.text.primary,
              marginBottom: spacing.md,
            }}>
            Changes to This Policy
          </Text>
          <Text
            style={{
              fontSize: typography.size.base,
              color: colors.text.secondary,
              lineHeight: typography.size.base * typography.lineHeight.relaxed,
            }}>
            We may update this privacy policy from time to time. We&apos;ll notify you of
            significant changes via email or in-app notification. Continued use of Nœma after
            changes means you accept the updated policy.
          </Text>
        </View>

        {/* Contact Us */}
        <View style={{ marginBottom: spacing.xl }}>
          <Text
            style={{
              fontSize: typography.size.lg,
              fontWeight: typography.fontWeight.bold,
              color: colors.text.primary,
              marginBottom: spacing.md,
            }}>
            Contact Us
          </Text>
          <Text
            style={{
              fontSize: typography.size.base,
              color: colors.text.secondary,
              lineHeight: typography.size.base * typography.lineHeight.relaxed,
            }}>
            If you have questions about this privacy policy or how we handle your data, please
            contact us at:{'\n\n'}
            <Text
              style={{ color: colors.emerald[400], fontWeight: typography.fontWeight.semibold }}>
              hello@daily-hush.com
            </Text>
          </Text>
        </View>
      </ScrollFadeView>
    </View>
  );
}

/**
 * DailyHush - Terms of Service
 * Clear, user-friendly terms for using the app
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

export default function TermsOfService() {
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
        }}
      >
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
          }}
        >
          <ArrowLeft size={28} color={colors.text.secondary} strokeWidth={2} />
        </Pressable>

        <View style={{ flex: 1, alignItems: 'center', paddingHorizontal: spacing.md }}>
          <Text
            style={{
              fontSize: typography.size.xl,
              fontWeight: typography.fontWeight.bold,
              color: colors.text.primary,
              lineHeight: typography.size.xl * typography.lineHeight.tight,
            }}
          >
            Terms of Service
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
        fadeVisibility="always"
      >
        <Text style={{ fontSize: typography.size.sm, color: colors.text.muted, marginBottom: spacing.xl }}>
          Last updated: January 2025
        </Text>

        {/* Agreement to Terms */}
        <View style={{ marginBottom: spacing.xl }}>
          <Text style={{ fontSize: typography.size.lg, fontWeight: typography.fontWeight.bold, color: colors.text.primary, marginBottom: spacing.md }}>
            Agreement to Terms
          </Text>
          <Text style={{ fontSize: typography.size.base, color: colors.text.secondary, lineHeight: typography.size.base * typography.lineHeight.relaxed }}>
            By accessing or using DailyHush (the &quot;App&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you disagree with any part of these terms, you may not use our App.
          </Text>
        </View>

        {/* Who Can Use DailyHush */}
        <View style={{ marginBottom: spacing.xl }}>
          <Text style={{ fontSize: typography.size.lg, fontWeight: typography.fontWeight.bold, color: colors.text.primary, marginBottom: spacing.md }}>
            Who Can Use DailyHush
          </Text>
          <Text style={{ fontSize: typography.size.base, color: colors.text.secondary, lineHeight: typography.size.base * typography.lineHeight.relaxed }}>
            You must be at least 18 years old to use DailyHush. By using the App, you represent and warrant that you meet this age requirement. If you are under 18, you may not use the App.
          </Text>
        </View>

        {/* What DailyHush Is (And Isn&apos;t) */}
        <View style={{ marginBottom: spacing.xl, backgroundColor: colors.emerald[900] + '40', borderRadius: 16, padding: spacing.lg, borderWidth: 1, borderColor: colors.emerald[700] + '40' }}>
          <Text style={{ fontSize: typography.size.lg, fontWeight: typography.fontWeight.bold, color: colors.text.primary, marginBottom: spacing.md }}>
            What DailyHush Is (And Isn&apos;t)
          </Text>
          <Text style={{ fontSize: typography.size.base, color: colors.text.secondary, lineHeight: typography.size.base * typography.lineHeight.relaxed, marginBottom: spacing.md }}>
            DailyHush is a wellness tool designed to help you interrupt overthinking spirals. It is NOT:
          </Text>
          <Text style={{ fontSize: typography.size.base, color: colors.text.secondary, lineHeight: typography.size.base * typography.lineHeight.relaxed }}>
            • A replacement for professional mental health treatment
          </Text>
          <Text style={{ fontSize: typography.size.base, color: colors.text.secondary, lineHeight: typography.size.base * typography.lineHeight.relaxed }}>
            • Medical advice or therapy
          </Text>
          <Text style={{ fontSize: typography.size.base, color: colors.text.secondary, lineHeight: typography.size.base * typography.lineHeight.relaxed }}>
            • A crisis intervention service
          </Text>
          <Text style={{ fontSize: typography.size.base, color: colors.text.secondary, lineHeight: typography.size.base * typography.lineHeight.relaxed, marginBottom: spacing.md }}>
            • A diagnostic tool for mental health conditions
          </Text>
          <Text style={{ fontSize: typography.size.base, color: colors.text.secondary, lineHeight: typography.size.base * typography.lineHeight.relaxed }}>
            If you are experiencing a mental health crisis, please contact emergency services (911) or the National Suicide Prevention Lifeline (988).
          </Text>
        </View>

        {/* Your Account */}
        <View style={{ marginBottom: spacing.xl }}>
          <Text style={{ fontSize: typography.size.lg, fontWeight: typography.fontWeight.bold, color: colors.text.primary, marginBottom: spacing.md }}>
            Your Account
          </Text>
          <Text style={{ fontSize: typography.size.base, color: colors.text.secondary, lineHeight: typography.size.base * typography.lineHeight.relaxed, marginBottom: spacing.md }}>
            When you create an account with us, you must:
          </Text>
          <Text style={{ fontSize: typography.size.base, color: colors.text.secondary, lineHeight: typography.size.base * typography.lineHeight.relaxed }}>
            • Provide accurate and complete information
          </Text>
          <Text style={{ fontSize: typography.size.base, color: colors.text.secondary, lineHeight: typography.size.base * typography.lineHeight.relaxed }}>
            • Maintain the security of your password
          </Text>
          <Text style={{ fontSize: typography.size.base, color: colors.text.secondary, lineHeight: typography.size.base * typography.lineHeight.relaxed }}>
            • Accept responsibility for all activities under your account
          </Text>
          <Text style={{ fontSize: typography.size.base, color: colors.text.secondary, lineHeight: typography.size.base * typography.lineHeight.relaxed, marginBottom: spacing.md }}>
            • Notify us immediately of any unauthorized use
          </Text>
          <Text style={{ fontSize: typography.size.base, color: colors.text.secondary, lineHeight: typography.size.base * typography.lineHeight.relaxed }}>
            You may delete your account at any time from Settings. We will delete all your data within 30 days of account deletion.
          </Text>
        </View>

        {/* Acceptable Use */}
        <View style={{ marginBottom: spacing.xl }}>
          <Text style={{ fontSize: typography.size.lg, fontWeight: typography.fontWeight.bold, color: colors.text.primary, marginBottom: spacing.md }}>
            Acceptable Use
          </Text>
          <Text style={{ fontSize: typography.size.base, color: colors.text.secondary, lineHeight: typography.size.base * typography.lineHeight.relaxed, marginBottom: spacing.md }}>
            You agree NOT to:
          </Text>
          <Text style={{ fontSize: typography.size.base, color: colors.text.secondary, lineHeight: typography.size.base * typography.lineHeight.relaxed }}>
            • Use the App for any illegal purpose
          </Text>
          <Text style={{ fontSize: typography.size.base, color: colors.text.secondary, lineHeight: typography.size.base * typography.lineHeight.relaxed }}>
            • Attempt to hack, reverse engineer, or compromise the App
          </Text>
          <Text style={{ fontSize: typography.size.base, color: colors.text.secondary, lineHeight: typography.size.base * typography.lineHeight.relaxed }}>
            • Upload viruses or malicious code
          </Text>
          <Text style={{ fontSize: typography.size.base, color: colors.text.secondary, lineHeight: typography.size.base * typography.lineHeight.relaxed }}>
            • Impersonate another person or entity
          </Text>
          <Text style={{ fontSize: typography.size.base, color: colors.text.secondary, lineHeight: typography.size.base * typography.lineHeight.relaxed }}>
            • Scrape or harvest user data
          </Text>
          <Text style={{ fontSize: typography.size.base, color: colors.text.secondary, lineHeight: typography.size.base * typography.lineHeight.relaxed }}>
            • Interfere with the proper functioning of the App
          </Text>
          <Text style={{ fontSize: typography.size.base, color: colors.text.secondary, lineHeight: typography.size.base * typography.lineHeight.relaxed }}>
            • Use the App in any way that could harm DailyHush or our users
          </Text>
        </View>

        {/* Data & Content */}
        <View style={{ marginBottom: spacing.xl }}>
          <Text style={{ fontSize: typography.size.lg, fontWeight: typography.fontWeight.bold, color: colors.text.primary, marginBottom: spacing.md }}>
            Data & Content
          </Text>

          <Text style={{ fontSize: typography.size.base, fontWeight: typography.fontWeight.semibold, color: colors.text.primary, marginTop: spacing.md, marginBottom: spacing.sm }}>
            Your Content
          </Text>
          <Text style={{ fontSize: typography.size.base, color: colors.text.secondary, lineHeight: typography.size.base * typography.lineHeight.relaxed }}>
            You retain all rights to the content you create in DailyHush (spiral logs, notes, journal entries). We never claim ownership of your personal data.
          </Text>

          <Text style={{ fontSize: typography.size.base, fontWeight: typography.fontWeight.semibold, color: colors.text.primary, marginTop: spacing.md, marginBottom: spacing.sm }}>
            License to Use Your Data
          </Text>
          <Text style={{ fontSize: typography.size.base, color: colors.text.secondary, lineHeight: typography.size.base * typography.lineHeight.relaxed }}>
            You grant us a limited license to use your data solely to provide the App&apos;s features (like generating AI insights). We never use your data for advertising, never sell it, and never share it with third parties.
          </Text>
        </View>

        {/* Payments & Subscriptions */}
        <View style={{ marginBottom: spacing.xl }}>
          <Text style={{ fontSize: typography.size.lg, fontWeight: typography.fontWeight.bold, color: colors.text.primary, marginBottom: spacing.md }}>
            Payments & Subscriptions
          </Text>
          <Text style={{ fontSize: typography.size.base, color: colors.text.secondary, lineHeight: typography.size.base * typography.lineHeight.relaxed, marginBottom: spacing.md }}>
            DailyHush is currently free to use. If we introduce paid features or subscriptions in the future:
          </Text>
          <Text style={{ fontSize: typography.size.base, color: colors.text.secondary, lineHeight: typography.size.base * typography.lineHeight.relaxed }}>
            • We will notify you before charging
          </Text>
          <Text style={{ fontSize: typography.size.base, color: colors.text.secondary, lineHeight: typography.size.base * typography.lineHeight.relaxed }}>
            • All prices will be clearly displayed
          </Text>
          <Text style={{ fontSize: typography.size.base, color: colors.text.secondary, lineHeight: typography.size.base * typography.lineHeight.relaxed }}>
            • Subscriptions auto-renew unless cancelled
          </Text>
          <Text style={{ fontSize: typography.size.base, color: colors.text.secondary, lineHeight: typography.size.base * typography.lineHeight.relaxed }}>
            • Refunds are handled according to Apple App Store or Google Play Store policies
          </Text>
        </View>

        {/* Intellectual Property */}
        <View style={{ marginBottom: spacing.xl }}>
          <Text style={{ fontSize: typography.size.lg, fontWeight: typography.fontWeight.bold, color: colors.text.primary, marginBottom: spacing.md }}>
            Intellectual Property
          </Text>
          <Text style={{ fontSize: typography.size.base, color: colors.text.secondary, lineHeight: typography.size.base * typography.lineHeight.relaxed, marginBottom: spacing.md }}>
            The App and its original content (excluding your personal data), features, and functionality are owned by DailyHush and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
          </Text>
          <Text style={{ fontSize: typography.size.base, color: colors.text.secondary, lineHeight: typography.size.base * typography.lineHeight.relaxed }}>
            Our trademarks and trade dress may not be used without our prior written permission.
          </Text>
        </View>

        {/* Disclaimers */}
        <View style={{ marginBottom: spacing.xl }}>
          <Text style={{ fontSize: typography.size.lg, fontWeight: typography.fontWeight.bold, color: colors.text.primary, marginBottom: spacing.md }}>
            Disclaimers
          </Text>
          <Text style={{ fontSize: typography.size.base, color: colors.text.secondary, lineHeight: typography.size.base * typography.lineHeight.relaxed, marginBottom: spacing.md }}>
            THE APP IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.
          </Text>
          <Text style={{ fontSize: typography.size.base, color: colors.text.secondary, lineHeight: typography.size.base * typography.lineHeight.relaxed, marginBottom: spacing.sm }}>
            We do not warrant that:
          </Text>
          <Text style={{ fontSize: typography.size.base, color: colors.text.secondary, lineHeight: typography.size.base * typography.lineHeight.relaxed }}>
            • The App will be uninterrupted or error-free
          </Text>
          <Text style={{ fontSize: typography.size.base, color: colors.text.secondary, lineHeight: typography.size.base * typography.lineHeight.relaxed }}>
            • Defects will be corrected
          </Text>
          <Text style={{ fontSize: typography.size.base, color: colors.text.secondary, lineHeight: typography.size.base * typography.lineHeight.relaxed }}>
            • The App is free of viruses or harmful components
          </Text>
          <Text style={{ fontSize: typography.size.base, color: colors.text.secondary, lineHeight: typography.size.base * typography.lineHeight.relaxed }}>
            • Results from using the App will meet your expectations
          </Text>
        </View>

        {/* Limitation of Liability */}
        <View style={{ marginBottom: spacing.xl }}>
          <Text style={{ fontSize: typography.size.lg, fontWeight: typography.fontWeight.bold, color: colors.text.primary, marginBottom: spacing.md }}>
            Limitation of Liability
          </Text>
          <Text style={{ fontSize: typography.size.base, color: colors.text.secondary, lineHeight: typography.size.base * typography.lineHeight.relaxed, marginBottom: spacing.md }}>
            To the maximum extent permitted by law, DailyHush shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from:
          </Text>
          <Text style={{ fontSize: typography.size.base, color: colors.text.secondary, lineHeight: typography.size.base * typography.lineHeight.relaxed }}>
            • Your use or inability to use the App
          </Text>
          <Text style={{ fontSize: typography.size.base, color: colors.text.secondary, lineHeight: typography.size.base * typography.lineHeight.relaxed }}>
            • Any unauthorized access to your data
          </Text>
          <Text style={{ fontSize: typography.size.base, color: colors.text.secondary, lineHeight: typography.size.base * typography.lineHeight.relaxed }}>
            • Any bugs, viruses, or harmful code transmitted through the App
          </Text>
          <Text style={{ fontSize: typography.size.base, color: colors.text.secondary, lineHeight: typography.size.base * typography.lineHeight.relaxed }}>
            • Any errors or omissions in content
          </Text>
        </View>

        {/* Medical Disclaimer */}
        <View style={{ marginBottom: spacing.xl, backgroundColor: '#FEE2E2', borderRadius: 16, padding: spacing.lg, borderWidth: 1, borderColor: '#FCA5A5' }}>
          <Text style={{ fontSize: typography.size.lg, fontWeight: typography.fontWeight.bold, color: '#7F1D1D', marginBottom: spacing.md }}>
            Medical Disclaimer
          </Text>
          <Text style={{ fontSize: typography.size.base, color: '#991B1B', lineHeight: typography.size.base * typography.lineHeight.relaxed, marginBottom: spacing.md }}>
            DailyHush is NOT a medical device and does NOT provide medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions regarding a medical condition.
          </Text>
          <Text style={{ fontSize: typography.size.base, color: '#991B1B', lineHeight: typography.size.base * typography.lineHeight.relaxed }}>
            Never disregard professional medical advice or delay seeking it because of something you read in DailyHush. If you think you may have a medical emergency, call 911 immediately.
          </Text>
        </View>

        {/* Termination */}
        <View style={{ marginBottom: spacing.xl }}>
          <Text style={{ fontSize: typography.size.lg, fontWeight: typography.fontWeight.bold, color: colors.text.primary, marginBottom: spacing.md }}>
            Termination
          </Text>
          <Text style={{ fontSize: typography.size.base, color: colors.text.secondary, lineHeight: typography.size.base * typography.lineHeight.relaxed, marginBottom: spacing.md }}>
            We may terminate or suspend your account immediately, without prior notice, if you breach these Terms. Upon termination, your right to use the App will immediately cease.
          </Text>
          <Text style={{ fontSize: typography.size.base, color: colors.text.secondary, lineHeight: typography.size.base * typography.lineHeight.relaxed }}>
            You may terminate your account at any time by deleting it from Settings.
          </Text>
        </View>

        {/* Governing Law */}
        <View style={{ marginBottom: spacing.xl }}>
          <Text style={{ fontSize: typography.size.lg, fontWeight: typography.fontWeight.bold, color: colors.text.primary, marginBottom: spacing.md }}>
            Governing Law
          </Text>
          <Text style={{ fontSize: typography.size.base, color: colors.text.secondary, lineHeight: typography.size.base * typography.lineHeight.relaxed, marginBottom: spacing.md }}>
            These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.
          </Text>
          <Text style={{ fontSize: typography.size.base, color: colors.text.secondary, lineHeight: typography.size.base * typography.lineHeight.relaxed }}>
            Any disputes arising from these Terms or the App will be resolved through binding arbitration, except that either party may seek injunctive relief in court.
          </Text>
        </View>

        {/* Changes to Terms */}
        <View style={{ marginBottom: spacing.xl }}>
          <Text style={{ fontSize: typography.size.lg, fontWeight: typography.fontWeight.bold, color: colors.text.primary, marginBottom: spacing.md }}>
            Changes to These Terms
          </Text>
          <Text style={{ fontSize: typography.size.base, color: colors.text.secondary, lineHeight: typography.size.base * typography.lineHeight.relaxed, marginBottom: spacing.md }}>
            We reserve the right to modify these Terms at any time. If we make material changes, we will notify you via email or in-app notification at least 30 days before the changes take effect.
          </Text>
          <Text style={{ fontSize: typography.size.base, color: colors.text.secondary, lineHeight: typography.size.base * typography.lineHeight.relaxed }}>
            Your continued use of DailyHush after changes become effective means you accept the updated Terms.
          </Text>
        </View>

        {/* Contact Us */}
        <View style={{ marginBottom: spacing.xl }}>
          <Text style={{ fontSize: typography.size.lg, fontWeight: typography.fontWeight.bold, color: colors.text.primary, marginBottom: spacing.md }}>
            Contact Us
          </Text>
          <Text style={{ fontSize: typography.size.base, color: colors.text.secondary, lineHeight: typography.size.base * typography.lineHeight.relaxed, marginBottom: spacing.md }}>
            If you have questions about these Terms of Service, please contact us at:
          </Text>
          <Text style={{ fontSize: typography.size.base, color: colors.emerald[400], fontWeight: typography.fontWeight.semibold, lineHeight: typography.size.base * typography.lineHeight.relaxed }}>
            hello@daily-hush.com
          </Text>
        </View>

        {/* Acceptance */}
        <View style={{ marginBottom: spacing.xl, backgroundColor: colors.emerald[900] + '40', borderRadius: 16, padding: spacing.lg, borderWidth: 1, borderColor: colors.emerald[700] + '40' }}>
          <Text style={{ fontSize: typography.size.base, color: colors.text.secondary, lineHeight: typography.size.base * typography.lineHeight.relaxed, textAlign: 'center' }}>
            By using DailyHush, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
          </Text>
        </View>
      </ScrollFadeView>
    </View>
  );
}

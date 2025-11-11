/**
 * Nœma - Legal Footer Component
 * Reusable footer with Privacy Policy, Terms of Service, and optional Restore Purchases links
 * Designed for subscription/paywall screens to build user trust and App Store compliance
 * Created: 2025-01-01
 */

import { View, Text, Pressable, type ViewStyle } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';

/**
 * Props for LegalFooter component
 * All configuration via props for maximum reusability
 */
export interface LegalFooterProps {
  /**
   * Visual variant of the footer
   * - 'default': 12px font, normal spacing (recommended for most screens)
   * - 'compact': 11px font, tighter spacing (for space-constrained screens)
   * @default 'default'
   */
  variant?: 'default' | 'compact';

  /**
   * Whether to show the "Restore Purchases" link
   * Required for subscription screens per Apple App Store guidelines
   * @default false
   */
  showRestore?: boolean;

  /**
   * Text alignment for the footer
   * @default 'center'
   */
  textAlign?: 'center' | 'left' | 'right';

  /**
   * Optional custom container styles
   * Use to override padding, margin, or other container properties
   */
  containerStyle?: ViewStyle;

  /**
   * Callback fired when user taps "Restore Purchases"
   * Should call RevenueCat's restorePurchases() function
   * Only called if showRestore={true}
   */
  onRestorePurchases?: () => void | Promise<void>;
}

/**
 * LegalFooter Component
 *
 * Displays Privacy Policy, Terms of Service, and optional Restore Purchases links
 * in a subtle, non-intrusive footer design.
 *
 * @example
 * // Basic usage
 * <LegalFooter />
 *
 * @example
 * // With restore purchases (subscription screens)
 * <LegalFooter
 *   showRestore={true}
 *   onRestorePurchases={handleRestore}
 * />
 *
 * @example
 * // Compact variant with custom spacing
 * <LegalFooter
 *   variant="compact"
 *   containerStyle={{ marginTop: spacing.xl }}
 * />
 */
export function LegalFooter({
  variant = 'default',
  showRestore = false,
  textAlign = 'center',
  containerStyle,
  onRestorePurchases,
}: LegalFooterProps) {
  const router = useRouter();

  // Variant-specific styling
  const fontSize = variant === 'compact' ? 11 : 12;
  const lineHeight = variant === 'compact' ? 16 : 18;
  const verticalPadding = variant === 'compact' ? spacing.sm : spacing.md;

  /**
   * Navigate to Privacy Policy page
   * Includes haptic feedback for better UX
   */
  const handlePrivacyPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/legal/privacy');
  };

  /**
   * Navigate to Terms of Service page
   * Includes haptic feedback for better UX
   */
  const handleTermsPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/legal/terms');
  };

  /**
   * Handle Restore Purchases
   * Calls callback with haptic feedback
   */
  const handleRestorePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (onRestorePurchases) {
      await onRestorePurchases();
    }
  };

  return (
    <View
      style={[
        {
          paddingHorizontal: spacing.screenPadding,
          paddingVertical: verticalPadding,
          alignItems:
            textAlign === 'center' ? 'center' : textAlign === 'left' ? 'flex-start' : 'flex-end',
        },
        containerStyle,
      ]}
      accessible={true}
      accessibilityRole="group"
      accessibilityLabel="Legal information and settings">
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          flexWrap: 'wrap',
          justifyContent:
            textAlign === 'center' ? 'center' : textAlign === 'left' ? 'flex-start' : 'flex-end',
          gap: spacing.xs,
        }}>
        {/* Privacy Policy Link */}
        <Pressable
          onPress={handlePrivacyPress}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessible={true}
          accessibilityRole="link"
          accessibilityLabel="Privacy Policy"
          accessibilityHint="Opens the privacy policy page"
          style={({ pressed }) => ({
            opacity: pressed ? 0.7 : 1,
          })}>
          {({ pressed }) => (
            <Text
              style={{
                fontSize,
                lineHeight,
                color: pressed ? colors.emerald[400] : colors.text.muted,
                fontWeight: '400',
              }}>
              Privacy Policy
            </Text>
          )}
        </Pressable>

        {/* Separator */}
        <Text
          style={{
            fontSize,
            lineHeight,
            color: colors.text.muted,
            opacity: 0.6,
            fontWeight: '400',
          }}>
          •
        </Text>

        {/* Terms of Service Link */}
        <Pressable
          onPress={handleTermsPress}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessible={true}
          accessibilityRole="link"
          accessibilityLabel="Terms of Service"
          accessibilityHint="Opens the terms of service page"
          style={({ pressed }) => ({
            opacity: pressed ? 0.7 : 1,
          })}>
          <Text
            style={{
              fontSize,
              lineHeight,
              color: colors.text.muted,
              fontWeight: '400',
            }}>
            Terms of Service
          </Text>
        </Pressable>

        {/* Restore Purchases Link (Optional) */}
        {showRestore && (
          <>
            {/* Separator */}
            <Text
              style={{
                fontSize,
                lineHeight,
                color: colors.text.muted,
                opacity: 0.6,
                fontWeight: '400',
              }}>
              •
            </Text>

            <Pressable
              onPress={handleRestorePress}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Restore Purchases"
              accessibilityHint="Restore previous purchases from your account"
              style={({ pressed }) => ({
                opacity: pressed ? 0.7 : 1,
              })}>
              <Text
                style={{
                  fontSize,
                  lineHeight,
                  color: colors.text.muted,
                  fontWeight: '400',
                }}>
                Restore Purchases
              </Text>
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
}

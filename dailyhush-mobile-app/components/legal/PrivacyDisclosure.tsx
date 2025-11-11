/**
 * Nœma - Privacy Disclosure Component
 * Reusable warning/disclosure component for privacy-sensitive actions
 * Used on account deletion and other data-related screens
 * Created: 2025-01-01
 */

import { View, Text, Pressable, type ViewStyle } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { AlertCircle, Info, ShieldAlert } from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';

/**
 * Disclosure content configuration
 * Each type has specific messaging and styling
 */
const DISCLOSURE_CONTENT = {
  'account-deletion': {
    icon: AlertCircle,
    iconColor: colors.status.warning,
    borderColor: `${colors.status.warning}40`, // 25% opacity
    title: 'Important: Data Retention',
    message:
      'Deleting your account will remove your login credentials, but some data will be retained for legal and analytics purposes.',
    linkText: 'Review our Privacy Policy',
    linkRoute: '/legal/privacy',
  },
  'data-retention': {
    icon: Info,
    iconColor: colors.emerald[400],
    borderColor: `${colors.emerald[600]}40`,
    title: 'Data Retention Notice',
    message:
      'We retain certain data to comply with legal obligations and improve our service. You can review our full data retention policy.',
    linkText: 'Read our Privacy Policy',
    linkRoute: '/legal/privacy',
  },
  generic: {
    icon: ShieldAlert,
    iconColor: colors.emerald[400],
    borderColor: `${colors.emerald[600]}40`,
    title: 'Privacy Notice',
    message: 'Please review our privacy practices to understand how we handle your data.',
    linkText: 'View Privacy Policy',
    linkRoute: '/legal/privacy',
  },
} as const;

/**
 * Props for PrivacyDisclosure component
 */
export interface PrivacyDisclosureProps {
  /**
   * Type of disclosure to display
   * Each type has pre-configured messaging and styling
   */
  type: 'account-deletion' | 'data-retention' | 'generic';

  /**
   * Whether to show the warning/info icon
   * @default true
   */
  showIcon?: boolean;

  /**
   * Optional custom container styles
   */
  containerStyle?: ViewStyle;
}

/**
 * PrivacyDisclosure Component
 *
 * Displays important privacy information with a link to the Privacy Policy.
 * Used to ensure transparency before privacy-sensitive actions.
 *
 * @example
 * // Account deletion disclosure
 * <PrivacyDisclosure
 *   type="account-deletion"
 *   showIcon={true}
 * />
 *
 * @example
 * // Generic privacy notice
 * <PrivacyDisclosure
 *   type="generic"
 *   showIcon={false}
 * />
 */
export function PrivacyDisclosure({
  type,
  showIcon = true,
  containerStyle,
}: PrivacyDisclosureProps) {
  const router = useRouter();
  const content = DISCLOSURE_CONTENT[type];
  const Icon = content.icon;

  /**
   * Navigate to Privacy Policy
   * Includes haptic feedback for better UX
   */
  const handlePolicyPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(content.linkRoute as '/legal/privacy');
  };

  return (
    <View
      style={[
        {
          backgroundColor: colors.background.card,
          borderRadius: 12,
          padding: spacing.base,
          borderWidth: 1,
          borderColor: content.borderColor,
          marginBottom: spacing.lg,
        },
        containerStyle,
      ]}
      accessible={true}
      accessibilityRole="alert"
      accessibilityLabel={`${content.title}. ${content.message}`}>
      {/* Header with Icon and Title */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: spacing.sm,
          gap: spacing.sm,
        }}>
        {showIcon && <Icon size={20} color={content.iconColor} strokeWidth={2.5} />}

        <Text
          style={{
            fontSize: 15,
            fontWeight: '600',
            color: colors.text.primary,
            flex: 1,
          }}>
          {content.title}
        </Text>
      </View>

      {/* Message */}
      <Text
        style={{
          fontSize: 14,
          lineHeight: 22,
          color: colors.text.secondary,
          marginBottom: spacing.md,
        }}>
        {content.message}
      </Text>

      {/* Privacy Policy Link */}
      <Pressable
        onPress={handlePolicyPress}
        accessible={true}
        accessibilityRole="link"
        accessibilityLabel={content.linkText}
        accessibilityHint="Opens the privacy policy page"
        style={({ pressed }) => ({
          opacity: pressed ? 0.7 : 1,
        })}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: '600',
            color: colors.emerald[400],
          }}>
          {content.linkText} →
        </Text>
      </Pressable>
    </View>
  );
}

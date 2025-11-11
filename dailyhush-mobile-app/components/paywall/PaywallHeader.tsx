/**
 * Nœma - Paywall Header Component
 * Reusable header for paywall screens
 */

import { View } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';

interface PaywallHeaderProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  emoji?: string;
}

export function PaywallHeader({ icon: Icon, title, subtitle, emoji }: PaywallHeaderProps) {
  return (
    <>
      {/* Icon */}
      <View style={{ alignItems: 'center', marginBottom: 24 }}>
        <View
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: colors.emerald[600] + '20',
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 3,
            borderColor: colors.emerald[600] + '50',
          }}>
          <Icon size={48} color={colors.emerald[500]} strokeWidth={2} />
        </View>
      </View>

      {/* Title */}
      <Text
        style={{
          fontSize: 28,
          fontWeight: 'bold',
          color: colors.text.primary,
          textAlign: 'center',
          marginBottom: subtitle ? 12 : 24,
          paddingHorizontal: spacing.screenPadding,
          lineHeight: 36,
        }}>
        {emoji && `${emoji} `}
        {title}
      </Text>

      {/* Subtitle */}
      {subtitle && (
        <Text
          style={{
            fontSize: 17,
            color: colors.text.secondary,
            textAlign: 'center',
            lineHeight: 26,
            marginBottom: 32,
            paddingHorizontal: spacing.screenPadding,
          }}>
          {subtitle}
        </Text>
      )}
    </>
  );
}

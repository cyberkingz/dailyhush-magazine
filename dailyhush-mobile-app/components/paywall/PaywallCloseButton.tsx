/**
 * Nœma - Paywall Close Button
 * Reusable close button for dismissible paywalls
 */

import { Pressable } from 'react-native';
import { X } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';

interface PaywallCloseButtonProps {
  onClose: () => void;
}

export function PaywallCloseButton({ onClose }: PaywallCloseButtonProps) {
  return (
    <Pressable
      onPress={onClose}
      style={{
        position: 'absolute',
        top: 48,
        right: spacing.screenPadding,
        zIndex: 10,
        backgroundColor: colors.background.card,
        borderRadius: 20,
        padding: 8,
      }}>
      <X size={20} color={colors.text.secondary} />
    </Pressable>
  );
}

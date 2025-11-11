/**
 * Nœma - Paywall Secondary Button
 * Reusable secondary action button (e.g., "Continue with Free")
 */

import { Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { colors } from '@/constants/colors';

interface PaywallSecondaryButtonProps {
  onPress: () => void;
  text: string;
  disabled?: boolean;
}

export function PaywallSecondaryButton({
  onPress,
  text,
  disabled = false,
}: PaywallSecondaryButtonProps) {
  return (
    <Pressable onPress={onPress} disabled={disabled} style={{ alignItems: 'center' }}>
      {({ pressed }) => (
        <Text
          style={{
            fontSize: 15,
            color: colors.text.tertiary,
            textDecorationLine: 'underline',
            opacity: pressed && !disabled ? 0.7 : 1,
          }}>
          {text}
        </Text>
      )}
    </Pressable>
  );
}

/**
 * PillButton Component
 * Small rounded button with primary/secondary styling
 */

import {
  TouchableOpacity,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
  type TouchableOpacityProps,
} from 'react-native';
import { colors } from '@/constants/colors';
import { Text } from '@/components/ui/text';

type PillButtonVariant = 'primary' | 'secondary';

export interface PillButtonProps extends Omit<TouchableOpacityProps, 'children'> {
  label: string;
  variant?: PillButtonVariant;
  style?: StyleProp<ViewStyle>;
}

export function PillButton({
  label,
  variant = 'primary',
  style,
  disabled,
  ...touchableProps
}: PillButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      accessibilityRole="button"
      {...touchableProps}
      disabled={disabled}
      style={[
        styles.base,
        variant === 'primary' ? styles.primary : styles.secondary,
        disabled && styles.disabled,
        style,
      ]}>
      <Text style={variant === 'primary' ? styles.primaryText : styles.secondaryText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 999,
    paddingHorizontal: 24,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    shadowColor: colors.shadow.lime, // Lime shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primary: {
    backgroundColor: colors.lime[600], // Lime-600 for subtle button
    borderWidth: 1,
    borderColor: colors.lime[500], // Lime-500 border
  },
  secondary: {
    backgroundColor: colors.background.card,
    borderWidth: 1,
    borderColor: colors.lime[600], // Lime-600 border
  },
  disabled: {
    opacity: 0.5,
  },
  primaryText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.background.primary, // Dark text on lime background
    letterSpacing: 0.3,
  },
  secondaryText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.lime[500], // Lime-500 text
    letterSpacing: 0.3,
  },
});

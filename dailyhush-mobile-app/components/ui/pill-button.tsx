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
    shadowColor: colors.emerald[700],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  primary: {
    backgroundColor: colors.emerald[700],
    borderWidth: 1,
    borderColor: colors.emerald[600],
  },
  secondary: {
    backgroundColor: colors.background.card,
    borderWidth: 1,
    borderColor: colors.emerald[700],
  },
  disabled: {
    opacity: 0.5,
  },
  primaryText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.white,
    letterSpacing: 0.3,
  },
  secondaryText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.emerald[500],
    letterSpacing: 0.3,
  },
});

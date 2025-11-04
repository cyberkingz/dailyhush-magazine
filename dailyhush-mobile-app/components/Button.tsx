import { forwardRef } from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps, View, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';

type ButtonProps = {
  title: string;
  variant?: 'primary' | 'secondary';
} & TouchableOpacityProps;

export const Button = forwardRef<View, ButtonProps>(({ title, variant = 'primary', ...touchableProps }, ref) => {
  return (
    <TouchableOpacity
      ref={ref}
      {...touchableProps}
      style={[
        styles.button,
        variant === 'primary' ? styles.primary : styles.secondary,
        touchableProps.style,
      ]}>
      <Text
        style={[
          styles.buttonText,
          variant === 'primary' ? styles.primaryText : styles.secondaryText,
        ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
});

Button.displayName = 'Button';

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: 28,
    paddingVertical: 16,
    paddingHorizontal: 24,
    shadowColor: colors.shadow.lime,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  primary: {
    backgroundColor: colors.button.primary, // Lime-500
  },
  secondary: {
    backgroundColor: colors.button.secondary, // Emerald-700
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  primaryText: {
    color: colors.button.primaryText,
  },
  secondaryText: {
    color: colors.text.primary,
  },
});

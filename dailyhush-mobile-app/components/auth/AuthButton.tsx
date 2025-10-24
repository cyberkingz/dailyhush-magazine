/**
 * DailyHush - Auth Button Component
 * Reusable button for authentication screens
 * Supports primary, secondary, and link variants
 */

import React, { useState } from 'react';
import {
  Pressable,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  PressableProps,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { authButtons } from '@/constants/authStyles';

interface AuthButtonProps extends Omit<PressableProps, 'style'> {
  title: string;
  onPress: () => void | Promise<void>;
  variant?: 'primary' | 'secondary' | 'link';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
}

export function AuthButton({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  icon,
  ...rest
}: AuthButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const handlePress = async () => {
    if (disabled || loading) return;

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await onPress();
  };

  const getContainerStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondaryContainer;
      case 'link':
        return styles.linkContainer;
      default:
        return styles.primaryContainer;
    }
  };

  const getButtonStyle = () => {
    const baseStyle = [
      variant === 'primary' && styles.primaryButton,
      variant === 'secondary' && styles.secondaryButton,
    ].filter(Boolean);

    if (isPressed && !disabled && !loading) {
      if (variant === 'primary') {
        baseStyle.push(styles.primaryButtonPressed);
      } else if (variant === 'secondary') {
        baseStyle.push(styles.secondaryButtonPressed);
      }
    }

    if (disabled || loading) {
      if (variant === 'primary') {
        baseStyle.push(styles.primaryButtonDisabled);
      } else {
        baseStyle.push(styles.buttonDisabled);
      }
    }

    return baseStyle;
  };

  const getTextStyle = () => {
    const baseStyle = [
      variant === 'primary' && styles.primaryText,
      variant === 'secondary' && styles.secondaryText,
      variant === 'link' && styles.linkText,
    ].filter(Boolean);

    if (isPressed && variant === 'link' && !disabled && !loading) {
      baseStyle.push(styles.linkTextPressed);
    }

    return baseStyle;
  };

  // Link variant (text-only button)
  if (variant === 'link') {
    return (
      <View style={getContainerStyle()}>
        <Pressable
          {...rest}
          onPress={handlePress}
          onPressIn={() => setIsPressed(true)}
          onPressOut={() => setIsPressed(false)}
          disabled={disabled || loading}
          hitSlop={authButtons.link.hitSlop}
          accessible={true}
          accessibilityLabel={title}
          accessibilityRole="button"
          accessibilityState={{ disabled: disabled || loading }}
        >
          <Text style={getTextStyle()}>
            {loading ? 'Loading...' : title}
          </Text>
        </Pressable>
      </View>
    );
  }

  // Primary or Secondary button
  return (
    <View style={getContainerStyle()}>
      <Pressable
        {...rest}
        style={getButtonStyle()}
        onPress={handlePress}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        disabled={disabled || loading}
        hitSlop={authButtons.primary.hitSlop}
        accessible={true}
        accessibilityLabel={title}
        accessibilityRole="button"
        accessibilityState={{ disabled: disabled || loading }}
      >
        {loading ? (
          <ActivityIndicator
            color="#FFFFFF"
            size="small"
          />
        ) : (
          <>
            {icon && <View style={styles.iconContainer}>{icon}</View>}
            <Text style={getTextStyle()}>{title}</Text>
          </>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  // Primary button styles
  primaryContainer: authButtons.primary.container,

  primaryButton: authButtons.primary.style,

  primaryButtonPressed: authButtons.primary.pressedStyle,

  primaryText: authButtons.primary.text,

  // Secondary button styles
  secondaryContainer: authButtons.secondary.container,

  secondaryButton: authButtons.secondary.style,

  secondaryButtonPressed: authButtons.secondary.pressedStyle,

  secondaryText: authButtons.secondary.text,

  // Link button styles
  linkContainer: authButtons.link.container,

  linkText: authButtons.link.text,

  linkTextPressed: authButtons.link.pressedText,

  // Shared styles
  buttonDisabled: {
    opacity: 0.5,
  },

  // Primary button disabled (separate for shadow removal)
  primaryButtonDisabled: {
    ...authButtons.primary.disabledStyle,
  },

  iconContainer: {
    marginRight: 12,
  },
});

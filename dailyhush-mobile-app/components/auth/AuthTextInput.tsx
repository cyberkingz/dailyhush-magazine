/**
 * DailyHush - Auth Text Input Component
 * Enhanced input field for authentication screens
 * Optimized for 55-70 demographic with large touch targets
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TextInput,
  Text,
  Pressable,
  Animated,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import { Eye, EyeOff, AlertCircle } from 'lucide-react-native';
import {
  authTypography,
  inputFieldStyles,
  inputColors,
} from '@/constants/authStyles';

interface AuthTextInputProps extends Omit<TextInputProps, 'style'> {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  helperText?: string;
  secureTextEntry?: boolean;
}

export function AuthTextInput({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  helperText,
  secureTextEntry = false,
  autoCapitalize = 'none',
  autoComplete,
  keyboardType = 'default',
  returnKeyType = 'done',
  onSubmitEditing,
  testID,
  ...rest
}: AuthTextInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  // Trigger shake animation on error
  useEffect(() => {
    if (error) {
      Animated.sequence([
        Animated.timing(shakeAnimation, {
          toValue: -8,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: 8,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: -8,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: 8,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [error]);

  const getInputStyle = () => {
    const baseStyle = [styles.input];

    if (error) {
      baseStyle.push(styles.inputError);
    } else if (isFocused) {
      baseStyle.push(styles.inputFocused);
    }

    return baseStyle;
  };

  return (
    <View style={styles.container}>
      {/* Label */}
      <Text style={styles.label}>{label}</Text>

      {/* Input field with shake animation */}
      <Animated.View style={{ transform: [{ translateX: shakeAnimation }] }}>
        <View>
          <TextInput
            {...rest}
            style={getInputStyle()}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={inputColors.text.placeholder}
            secureTextEntry={secureTextEntry && !isPasswordVisible}
            autoCapitalize={autoCapitalize}
            autoComplete={autoComplete}
            autoCorrect={false}
            keyboardType={keyboardType}
            returnKeyType={returnKeyType}
            onSubmitEditing={onSubmitEditing}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            testID={testID}
            accessible={true}
            accessibilityLabel={label}
            accessibilityHint={helperText}
            accessibilityState={{ disabled: rest.editable === false }}
          />

          {/* Password visibility toggle */}
          {secureTextEntry && (
            <Pressable
              style={styles.passwordToggle}
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessible={true}
              accessibilityLabel={
                isPasswordVisible ? 'Hide password' : 'Show password'
              }
              accessibilityRole="button"
            >
              {isPasswordVisible ? (
                <EyeOff size={22} color={inputColors.text.placeholder} strokeWidth={2} />
              ) : (
                <Eye size={22} color={inputColors.text.placeholder} strokeWidth={2} />
              )}
            </Pressable>
          )}
        </View>
      </Animated.View>

      {/* Helper text or error message */}
      {error ? (
        <View style={styles.errorContainer}>
          <AlertCircle size={16} color={inputColors.text.error} strokeWidth={2} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: inputFieldStyles.container,

  label: inputFieldStyles.label,

  input: inputFieldStyles.input,

  inputFocused: inputFieldStyles.inputFocused,

  inputError: inputFieldStyles.inputError,

  passwordToggle: inputFieldStyles.passwordToggle,

  helperText: inputFieldStyles.helperText,

  errorContainer: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },

  errorText: {
    ...authTypography.errorText,
    marginLeft: 6,
    flex: 1,
  },
});

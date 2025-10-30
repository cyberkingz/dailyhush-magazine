/**
 * DailyHush - Auth Text Input Component
 * Simple, clean input field
 */

import React, { useState } from 'react';
import { View, TextInput, Text, Pressable, StyleSheet, TextInputProps } from 'react-native';
import { Eye, EyeOff, AlertCircle } from 'lucide-react-native';
import { inputFieldStyles, inputColors } from '@/constants/authStyles';

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

  const getInputStyle = () => {
    return [
      styles.input,
      secureTextEntry && styles.inputWithPassword,
      error && styles.inputError,
      !error && isFocused && styles.inputFocused,
    ].filter(Boolean);
  };

  return (
    <View style={styles.container}>
      {/* Label */}
      <Text style={styles.label}>{label}</Text>

      {/* Input field */}
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
        />

        {/* Password visibility toggle */}
        {secureTextEntry && (
          <Pressable
            style={styles.passwordToggle}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            {isPasswordVisible ? (
              <EyeOff size={20} color={inputColors.text.placeholder} strokeWidth={2} />
            ) : (
              <Eye size={20} color={inputColors.text.placeholder} strokeWidth={2} />
            )}
          </Pressable>
        )}
      </View>

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
  inputWithPassword: {
    paddingRight: 52,
  },
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
    ...inputFieldStyles.errorText,
    marginLeft: 6,
    flex: 1,
  },
});

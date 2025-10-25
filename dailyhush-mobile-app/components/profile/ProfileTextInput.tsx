/**
 * DailyHush - Profile Text Input Component
 * Consistent with AuthTextInput but for profile editing
 * Optimized for 55-70 demographic with 56px height and 17px text
 */

import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import { AlertCircle } from 'lucide-react-native';
import {
  inputFieldStyles,
  inputColors,
} from '@/constants/authStyles';

interface ProfileTextInputProps extends Omit<TextInputProps, 'style'> {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  helperText?: string;
}

export function ProfileTextInput({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  helperText,
  autoCapitalize = 'none',
  keyboardType = 'default',
  returnKeyType = 'done',
  onSubmitEditing,
  testID,
  ...rest
}: ProfileTextInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const getInputStyle = () => {
    return [
      styles.input,
      error && styles.inputError,
      !error && isFocused && styles.inputFocused,
    ].filter(Boolean);
  };

  return (
    <View style={styles.container}>
      {/* Label */}
      <Text style={styles.label}>{label}</Text>

      {/* Input field */}
      <TextInput
        {...rest}
        style={getInputStyle()}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={inputColors.text.placeholder}
        autoCapitalize={autoCapitalize}
        autoCorrect={false}
        keyboardType={keyboardType}
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmitEditing}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        testID={testID}
      />

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

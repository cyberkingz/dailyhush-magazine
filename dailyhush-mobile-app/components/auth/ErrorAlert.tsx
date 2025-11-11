/**
 * Nœma - Error Alert Component
 * Screen-level error and success messages
 * For authentication screens and general use
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable, Animated, StyleSheet } from 'react-native';
import { AlertCircle, CheckCircle, X } from 'lucide-react-native';
import { errorAlert, statusColors } from '@/constants/authStyles';

interface ErrorAlertProps {
  message: string;
  type?: 'error' | 'success';
  onDismiss?: () => void;
  dismissible?: boolean;
}

export function ErrorAlert({
  message,
  type = 'error',
  onDismiss,
  dismissible = true,
}: ErrorAlertProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    // Fade in animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleDismiss = () => {
    if (!dismissible || !onDismiss) return;

    // Fade out animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -10,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss();
    });
  };

  const Icon = type === 'error' ? AlertCircle : CheckCircle;
  const iconColor = type === 'error' ? statusColors.error.icon : statusColors.success.icon;
  const borderColor = type === 'error' ? statusColors.error.border : statusColors.success.border;
  const titleColor = type === 'error' ? statusColors.error.text : statusColors.success.text;

  return (
    <Animated.View
      style={[
        styles.container,
        { borderColor },
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}>
      <View style={styles.header}>
        <Icon size={24} color={iconColor} strokeWidth={2} />
        <Text style={[styles.title, { color: titleColor }]}>
          {type === 'error' ? 'Error' : 'Success'}
        </Text>
      </View>

      <Text style={styles.message}>{message}</Text>

      {dismissible && onDismiss && (
        <Pressable
          style={styles.closeButton}
          onPress={handleDismiss}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessible={true}
          accessibilityLabel="Dismiss message"
          accessibilityRole="button">
          <X size={16} color="#95B8A8" strokeWidth={2} />
        </Pressable>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...errorAlert.container,
    position: 'relative',
  },

  header: errorAlert.header,

  title: errorAlert.title,

  message: errorAlert.message,

  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 4,
  },
});

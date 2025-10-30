/**
 * DailyHush - Error Boundary Component
 * Modern, friendly error UI with recovery options
 */

import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { AlertCircle, RefreshCcw, Home } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { colors } from '@/constants/colors';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // TODO: Send to crash reporting service (Sentry)
  }

  handleReset = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    router.replace('/');
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, backgroundColor: colors.background.primary }}>
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: 'center',
              paddingHorizontal: 32,
              paddingVertical: 60,
            }}>
            {/* Error Icon with subtle glow */}
            <View
              style={{
                alignItems: 'center',
                marginBottom: 32,
              }}>
              <View
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: 48,
                  backgroundColor: colors.status.error + '15',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <AlertCircle size={48} color={colors.status.error} strokeWidth={2} />
              </View>
            </View>

            {/* Error Title */}
            <Text
              style={{
                fontSize: 28,
                fontWeight: '700',
                color: colors.text.primary,
                textAlign: 'center',
                marginBottom: 16,
                letterSpacing: -0.5,
              }}>
              Something Went Wrong
            </Text>

            {/* Error Description */}
            <Text
              style={{
                fontSize: 16,
                color: colors.text.secondary,
                textAlign: 'center',
                lineHeight: 24,
                marginBottom: 40,
                opacity: 0.8,
              }}>
              Don't worry, this happens sometimes. Try refreshing or go back home.
            </Text>

            {/* Error Details (Development Only) */}
            {__DEV__ && this.state.error && (
              <View
                style={{
                  backgroundColor: colors.background.card,
                  borderRadius: 16,
                  padding: 20,
                  marginBottom: 32,
                  borderWidth: 1,
                  borderColor: colors.status.error + '20',
                }}>
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: '600',
                    color: colors.status.error,
                    marginBottom: 12,
                    letterSpacing: 0.5,
                  }}>
                  Error Details (Dev Only):
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    color: colors.text.secondary,
                    lineHeight: 20,
                    opacity: 0.9,
                  }}>
                  {this.state.error.toString()}
                </Text>
              </View>
            )}

            {/* Action Buttons */}
            <View style={{ width: '100%', gap: 16 }}>
              {/* Try Again Button */}
              <Pressable
                onPress={this.handleReset}
                style={({ pressed }) => ({
                  backgroundColor: pressed ? colors.emerald[700] : colors.emerald[600],
                  borderRadius: 16,
                  paddingVertical: 18,
                  paddingHorizontal: 24,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  shadowColor: colors.emerald[500],
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 6,
                })}>
                <RefreshCcw size={22} color={colors.white} strokeWidth={2.5} />
                <Text
                  style={{
                    fontSize: 17,
                    fontWeight: '600',
                    color: colors.white,
                    marginLeft: 12,
                    letterSpacing: 0.3,
                  }}>
                  Try Again
                </Text>
              </Pressable>

              {/* Go Home Button */}
              <Pressable
                onPress={this.handleGoHome}
                style={({ pressed }) => ({
                  backgroundColor: pressed ? colors.background.card : 'transparent',
                  borderRadius: 16,
                  paddingVertical: 18,
                  paddingHorizontal: 24,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 2,
                  borderColor: colors.emerald[600],
                })}>
                <Home size={22} color={colors.emerald[500]} strokeWidth={2.5} />
                <Text
                  style={{
                    fontSize: 17,
                    fontWeight: '600',
                    color: colors.emerald[500],
                    marginLeft: 12,
                    letterSpacing: 0.3,
                  }}>
                  Go to Home
                </Text>
              </Pressable>
            </View>

            {/* Helpful hint */}
            <Text
              style={{
                fontSize: 13,
                color: colors.text.secondary,
                textAlign: 'center',
                marginTop: 32,
                opacity: 0.6,
                lineHeight: 20,
              }}>
              If this keeps happening, try restarting the app
            </Text>
          </ScrollView>
        </View>
      );
    }

    return this.props.children;
  }
}

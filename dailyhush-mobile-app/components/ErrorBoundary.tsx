/**
 * DailyHush - Error Boundary Component
 * Catches React errors and prevents app from freezing
 * Provides graceful error UI with recovery options
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
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console (in production, send to Sentry/Crashlytics)
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // TODO: Send to crash reporting service (Sentry)
    // Sentry.captureException(error, { contexts: { react: { componentStack: errorInfo.componentStack } } });
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
              alignItems: 'center',
              paddingHorizontal: 24,
              paddingVertical: 40,
            }}
          >
            {/* Error Icon */}
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: colors.error.background,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 24,
              }}
            >
              <AlertCircle size={40} color={colors.error.border} strokeWidth={2} />
            </View>

            {/* Error Title */}
            <Text
              style={{
                fontSize: 24,
                fontWeight: 'bold',
                color: colors.text.primary,
                textAlign: 'center',
                marginBottom: 12,
              }}
            >
              Something Went Wrong
            </Text>

            {/* Error Description */}
            <Text
              style={{
                fontSize: 16,
                color: colors.text.secondary,
                textAlign: 'center',
                lineHeight: 24,
                marginBottom: 32,
              }}
            >
              We're sorry for the inconvenience. The app encountered an unexpected error.
            </Text>

            {/* Error Details (Development Only) */}
            {__DEV__ && this.state.error && (
              <View
                style={{
                  backgroundColor: colors.background.card,
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 32,
                  width: '100%',
                  borderWidth: 1,
                  borderColor: colors.error.border + '40',
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: 'bold',
                    color: colors.error.text,
                    marginBottom: 8,
                  }}
                >
                  Error Details (Dev Only):
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: colors.text.secondary,
                    fontFamily: 'monospace',
                  }}
                >
                  {this.state.error.toString()}
                </Text>
              </View>
            )}

            {/* Action Buttons */}
            <View style={{ width: '100%', maxWidth: 400 }}>
              {/* Try Again Button */}
              <Pressable
                onPress={this.handleReset}
                style={({ pressed }) => ({
                  backgroundColor: pressed ? colors.emerald[700] : colors.emerald[600],
                  borderRadius: 16,
                  paddingVertical: 16,
                  paddingHorizontal: 24,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16,
                })}
              >
                <RefreshCcw size={20} color={colors.white} strokeWidth={2} />
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: colors.white,
                    marginLeft: 12,
                  }}
                >
                  Try Again
                </Text>
              </Pressable>

              {/* Go Home Button */}
              <Pressable
                onPress={this.handleGoHome}
                style={({ pressed }) => ({
                  backgroundColor: 'transparent',
                  borderRadius: 16,
                  paddingVertical: 16,
                  paddingHorizontal: 24,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 2,
                  borderColor: pressed ? colors.emerald[500] : colors.emerald[600],
                })}
              >
                <Home size={20} color={colors.emerald[500]} strokeWidth={2} />
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: colors.emerald[500],
                    marginLeft: 12,
                  }}
                >
                  Go to Home
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      );
    }

    return this.props.children;
  }
}

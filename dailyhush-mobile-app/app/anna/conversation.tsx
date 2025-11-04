/**
 * Anna Conversation Screen
 * Real-time AI therapy conversation using Claude Agent SDK via WebSocket
 */

import React, { useEffect, useRef, useState } from 'react';
import { View, ScrollView, StyleSheet, Text, ActivityIndicator, Pressable, Platform, Keyboard, Animated } from 'react-native';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, X } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { ChatBubble } from '@/components/anna/ChatBubble';
import { ChatInput } from '@/components/anna/ChatInput';
import { PostExerciseSurvey } from '@/components/anna/PostExerciseSurvey';
import { useAnnaChat } from '@/hooks/useAnnaChat';
import { useAnalytics } from '@/utils/analytics';
import { supabase } from '@/utils/supabase';
import { withRetry } from '@/utils/retry';
import { colors } from '@/constants/colors';
import type { SpiralLog } from '@/types/spiral';

export default function AnnaConversationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    preFeelingScore?: string;
    postFeelingScore?: string;
    fromExercise?: string;
    surveyPending?: string;
  }>();
  const insets = useSafeAreaInsets();
  const analytics = useAnalytics();
  const scrollViewRef = useRef<ScrollView>(null);
  const processedExerciseRef = useRef<string | null>(null);
  const processingTriggerRef = useRef(false);
  const [showSurvey, setShowSurvey] = useState(false);
  const surveyShownRef = useRef(false);

  const {
    messages,
    isConnected,
    isAnnaTyping,
    exerciseTrigger,
    connectionError,
    sendMessage,
    notifyExerciseComplete,
    reconnect,
  } = useAnnaChat();

  // Smooth keyboard animation
  const keyboardHeight = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        Animated.timing(keyboardHeight, {
          toValue: e.endCoordinates.height,
          duration: Platform.OS === 'ios' ? 250 : 200,
          useNativeDriver: false,
        }).start();
      }
    );

    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        Animated.timing(keyboardHeight, {
          toValue: 0,
          duration: Platform.OS === 'ios' ? 250 : 200,
          useNativeDriver: false,
        }).start();
      }
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  // Track conversation start
  useEffect(() => {
    analytics.track('ANNA_CONVERSATION_STARTED');

    return () => {
      analytics.track('ANNA_CONVERSATION_ENDED', {
        message_count: messages.length,
      });
    };
  }, []);

  // Handle exercise trigger from Anna
  useEffect(() => {
    if (exerciseTrigger && !processingTriggerRef.current) {
      // Mark as processing to prevent duplicate triggers
      processingTriggerRef.current = true;

      console.log('[AnnaConversation] Exercise triggered:', exerciseTrigger);

      analytics.track('ANNA_EXERCISE_TRIGGERED', {
        exercise_type: exerciseTrigger.exerciseType,
        pre_feeling_score: exerciseTrigger.preFeelingScore,
      });

      // Navigate to spiral protocol with pre-feeling score
      router.push({
        pathname: '/spiral',
        params: {
          preFeelingRating: exerciseTrigger.preFeelingScore.toString(),
          source: 'anna',
        },
      });

      // Reset the flag after a short delay to allow for new triggers in the future
      setTimeout(() => {
        processingTriggerRef.current = false;
      }, 1000);
    }
  }, [exerciseTrigger, router, analytics]);

  // Handle return from exercise completion
  useFocusEffect(
    React.useCallback(() => {
      // Handle old flow with post-feeling score (backward compatibility)
      if (params.postFeelingScore && params.fromExercise === 'true') {
        const exerciseKey = `${params.preFeelingScore}-${params.postFeelingScore}-${params.fromExercise}`;

        // Only process if we haven't already processed this exercise completion
        if (processedExerciseRef.current !== exerciseKey) {
          const preScore = params.preFeelingScore ? parseInt(params.preFeelingScore, 10) : undefined;
          const postScore = parseInt(params.postFeelingScore, 10);

          console.log('[AnnaConversation] Exercise completed. Pre-score:', preScore, 'Post-score:', postScore);

          analytics.track('ANNA_EXERCISE_COMPLETED', {
            pre_feeling_score: preScore,
            post_feeling_score: postScore,
          });

          // Notify Anna agent that exercise is complete
          notifyExerciseComplete(postScore, preScore);

          // Mark this exercise as processed
          processedExerciseRef.current = exerciseKey;
        }
      }

      // Handle new flow with survey pending (no post-feeling score yet)
      if (params.surveyPending === 'true' && params.fromExercise === 'true' && !surveyShownRef.current) {
        // Show survey after a short delay to let Anna's victory message appear
        const timer = setTimeout(() => {
          if (!isAnnaTyping) {
            console.log('[AnnaConversation] Showing post-exercise survey');
            setShowSurvey(true);
            surveyShownRef.current = true;
          }
        }, 2000); // 2 second delay to let victory message appear

        return () => clearTimeout(timer);
      }
    }, [params.preFeelingScore, params.postFeelingScore, params.fromExercise, params.surveyPending, analytics, notifyExerciseComplete, isAnnaTyping])
  );

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  // Handle message send
  const handleSendMessage = (message: string) => {
    const success = sendMessage(message);

    if (success) {
      analytics.track('ANNA_MESSAGE_SENT', {
        message_length: message.length,
      });
    }
  };

  // Handle back navigation
  const handleBack = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    analytics.track('ANNA_CONVERSATION_BACK');
    router.back();
  };

  // Handle exit conversation (navigate to home)
  const handleExit = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    analytics.track('ANNA_CONVERSATION_EXIT');
    router.push('/(tabs)' as any);
  };

  // Handle survey completion
  const handleSurveyComplete = async (postFeelingScore: number, trigger?: string) => {
    console.log('[AnnaConversation] Survey completed. Post-score:', postFeelingScore, 'Trigger:', trigger);

    const preScore = params.preFeelingScore ? parseInt(params.preFeelingScore, 10) : undefined;

    analytics.track('ANNA_EXERCISE_COMPLETED', {
      pre_feeling_score: preScore,
      post_feeling_score: postFeelingScore,
      trigger,
    });

    // Save spiral log to database
    try {
      const user = await supabase.auth.getUser();

      if (user.data.user?.id) {
        const spiralLog: Partial<SpiralLog> = {
          user_id: user.data.user.id,
          timestamp: new Date().toISOString(),
          interrupted: true,
          pre_feeling: preScore || 8,
          post_feeling: postFeelingScore,
          technique_used: '5-4-3-2-1 + breathing',
          trigger,
        };

        const { error } = await withRetry(
          async () => await supabase.from('spiral_logs').insert(spiralLog),
          {
            maxRetries: 3,
            onRetry: (attempt) => {
              console.log(`Retrying spiral log save (attempt ${attempt}/3)...`);
            },
          }
        );

        if (error) {
          console.error('Error saving spiral log:', error);
        } else {
          console.log('Spiral log saved successfully');
        }
      }
    } catch (err) {
      console.error('Error saving spiral log:', err);
    }

    // Notify Anna agent that exercise is complete
    notifyExerciseComplete(postFeelingScore, preScore);

    // Hide survey
    setShowSurvey(false);
  };

  // Handle survey skip
  const handleSurveySkip = () => {
    console.log('[AnnaConversation] Survey skipped');

    const preScore = params.preFeelingScore ? parseInt(params.preFeelingScore, 10) : undefined;

    // Use default post score of 5 if skipped
    notifyExerciseComplete(5, preScore);

    // Hide survey
    setShowSurvey(false);
  };

  // Render connection error state
  if (connectionError) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#0A1612', '#0F1F1A', '#0A1612']}
          locations={[0, 0.5, 1]}
          style={styles.gradient}>
          {/* Header with Back Button */}
          <View style={{ paddingTop: insets.top + 8, paddingBottom: 12, paddingHorizontal: 20 }}>
            <View style={styles.headerRow}>
              <Pressable
                onPress={handleBack}
                style={({ pressed }) => ({
                  width: 44,
                  height: 44,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 22,
                  backgroundColor: pressed ? 'rgba(64, 145, 108, 0.25)' : 'rgba(64, 145, 108, 0.15)',
                  borderWidth: 1,
                  borderColor: 'rgba(82, 183, 136, 0.3)',
                })}>
                <ArrowLeft size={20} color="#E8F4F0" strokeWidth={2.5} />
              </Pressable>

              <View style={{ flex: 1 }} />

              <Pressable
                onPress={handleExit}
                style={({ pressed }) => ({
                  width: 44,
                  height: 44,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 22,
                  backgroundColor: pressed ? 'rgba(64, 145, 108, 0.25)' : 'rgba(64, 145, 108, 0.15)',
                  borderWidth: 1,
                  borderColor: 'rgba(82, 183, 136, 0.3)',
                })}>
                <X size={20} color="#E8F4F0" strokeWidth={2.5} />
              </Pressable>
            </View>
          </View>

          <View style={styles.errorContainer}>
            <Text style={{ fontSize: 64 }}>☁️</Text>
            <Text style={styles.errorTitle}>Connection Failed</Text>
            <Text style={styles.errorMessage}>{connectionError}</Text>
            <Pressable
              onPress={reconnect}
              style={({ pressed }) => ({
                backgroundColor: pressed ? '#3A8360' : '#40916C',
                paddingHorizontal: 32,
                paddingVertical: 14,
                borderRadius: 24,
                marginTop: 24,
                borderWidth: 1,
                borderColor: 'rgba(82, 183, 136, 0.4)',
              })}>
              <Text style={styles.retryButtonText}>Try Again</Text>
            </Pressable>
          </View>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0A1612', '#0F1F1A', '#0A1612']}
        locations={[0, 0.5, 1]}
        style={styles.gradient}>
        <Animated.View
          style={[
            styles.keyboardAvoid,
            {
              paddingBottom: keyboardHeight,
            },
          ]}>
          {/* Header with Back Button */}
          <View style={{ paddingTop: insets.top + 8, paddingBottom: 12, paddingHorizontal: 20 }}>
            <View style={styles.headerRow}>
            <Pressable
              onPress={handleBack}
              style={({ pressed }) => ({
                width: 44,
                height: 44,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 22,
                backgroundColor: pressed ? 'rgba(64, 145, 108, 0.25)' : 'rgba(64, 145, 108, 0.15)',
                borderWidth: 1,
                borderColor: 'rgba(82, 183, 136, 0.3)',
              })}>
              <ArrowLeft size={20} color="#E8F4F0" strokeWidth={2.5} />
            </Pressable>

            <View style={styles.headerCenter}>
              <Text style={styles.headerTitle}>Anna</Text>
              {!isConnected && (
                <View style={styles.statusRow}>
                  <ActivityIndicator size="small" color={colors.lime[500]} />
                  <Text style={styles.headerSubtitle}>Connecting...</Text>
                </View>
              )}
              {isConnected && (
                <View style={styles.statusRow}>
                  <View style={styles.connectedDot} />
                  <Text style={styles.headerSubtitleConnected}>Connected</Text>
                </View>
              )}
            </View>

            <Pressable
              onPress={handleExit}
              style={({ pressed }) => ({
                width: 44,
                height: 44,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 22,
                backgroundColor: pressed ? 'rgba(64, 145, 108, 0.25)' : 'rgba(64, 145, 108, 0.15)',
                borderWidth: 1,
                borderColor: 'rgba(82, 183, 136, 0.3)',
              })}>
              <X size={20} color="#E8F4F0" strokeWidth={2.5} />
            </Pressable>
          </View>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messages}
          contentContainerStyle={styles.messagesContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {messages.length === 0 && isConnected && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                Anna is here to help you through this.{'\n'}Share what's on your mind.
              </Text>
            </View>
          )}

          {messages.map((msg, index) => (
            <ChatBubble
              key={`${msg.timestamp}-${index}`}
              role={msg.role}
              content={msg.content}
              timestamp={index === messages.length - 1 ? msg.timestamp : undefined}
            />
          ))}

          {isAnnaTyping && <ChatBubble role="assistant" content="" isStreaming />}
        </ScrollView>

          {/* Input */}
          <ChatInput
            onSend={handleSendMessage}
            disabled={!isConnected || isAnnaTyping}
            placeholder={isConnected ? (isAnnaTyping ? 'Anna is typing...' : 'Type a message...') : 'Connecting...'}
          />
        </Animated.View>
      </LinearGradient>

      {/* Post-Exercise Survey */}
      <PostExerciseSurvey
        visible={showSurvey}
        preFeelingScore={params.preFeelingScore ? parseInt(params.preFeelingScore, 10) : 8}
        onComplete={handleSurveyComplete}
        onSkip={handleSurveySkip}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1612',
  },
  gradient: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#E8F4F0',
    letterSpacing: 0.5,
    fontFamily: 'Poppins_600SemiBold',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#95B8A8',
    marginLeft: 6,
    fontFamily: 'Poppins_400Regular',
  },
  headerSubtitleConnected: {
    fontSize: 12,
    color: '#52B788',
    marginLeft: 4,
    fontFamily: 'Poppins_400Regular',
  },
  connectedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#52B788',
  },
  messages: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#95B8A8',
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: 'Poppins_400Regular',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#E8F4F0',
    marginTop: 16,
    fontFamily: 'Poppins_600SemiBold',
  },
  errorMessage: {
    fontSize: 15,
    color: '#95B8A8',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 22,
    fontFamily: 'Poppins_400Regular',
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Poppins_600SemiBold',
  },
});

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface ChatBubbleProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
  isStreaming?: boolean;
}

const StreamingIndicator: React.FC = () => {
  const dot1Opacity = useRef(new Animated.Value(0.3)).current;
  const dot2Opacity = useRef(new Animated.Value(0.3)).current;
  const dot3Opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const createPulseAnimation = (
      animatedValue: Animated.Value,
      delay: number
    ) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 0.3,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      );
    };

    const animations = Animated.parallel([
      createPulseAnimation(dot1Opacity, 0),
      createPulseAnimation(dot2Opacity, 200),
      createPulseAnimation(dot3Opacity, 400),
    ]);

    animations.start();

    return () => {
      animations.stop();
    };
  }, []);

  return (
    <View style={styles.streamingContainer}>
      <Animated.Text style={[styles.streamingDot, { opacity: dot1Opacity }]}>
        ●
      </Animated.Text>
      <Animated.Text style={[styles.streamingDot, { opacity: dot2Opacity }]}>
        ●
      </Animated.Text>
      <Animated.Text style={[styles.streamingDot, { opacity: dot3Opacity }]}>
        ●
      </Animated.Text>
    </View>
  );
};

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  role,
  content,
  timestamp,
  isStreaming = false,
}) => {
  const isAssistant = role === 'assistant';

  const BubbleContent = () => (
    <View
      style={[
        styles.bubble,
        isAssistant ? styles.assistantBubble : styles.userBubble,
      ]}
    >
      {isStreaming ? (
        <StreamingIndicator />
      ) : (
        <Text
          style={[
            styles.text,
            isAssistant ? styles.assistantText : styles.userText,
          ]}
        >
          {content}
        </Text>
      )}
    </View>
  );

  return (
    <View
      style={[
        styles.container,
        isAssistant ? styles.assistantContainer : styles.userContainer,
      ]}
    >
      {isAssistant ? (
        <LinearGradient
          colors={['rgba(22, 46, 38, 0.6)', 'rgba(15, 31, 26, 0.8)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.bubble, styles.assistantBubble]}
        >
          {isStreaming ? (
            <StreamingIndicator />
          ) : (
            <Text style={[styles.text, styles.assistantText]}>{content}</Text>
          )}
        </LinearGradient>
      ) : (
        <BubbleContent />
      )}
      {timestamp && !isStreaming && (
        <Text
          style={[
            styles.timestamp,
            isAssistant ? styles.timestampLeft : styles.timestampRight,
          ]}
        >
          {timestamp}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
    paddingHorizontal: 0,
    maxWidth: '100%',
  },
  assistantContainer: {
    alignItems: 'flex-start',
  },
  userContainer: {
    alignItems: 'flex-end',
  },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(82, 183, 136, 0.2)',
  },
  assistantBubble: {
    borderTopLeftRadius: 4,
    alignSelf: 'flex-start',
  },
  userBubble: {
    backgroundColor: '#40916C',
    borderTopRightRadius: 4,
    alignSelf: 'flex-end',
    borderColor: 'rgba(82, 183, 136, 0.4)',
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: 0.2,
    fontFamily: 'Poppins_400Regular',
  },
  assistantText: {
    color: '#E8F4F0',
  },
  userText: {
    color: '#FFFFFF',
  },
  timestamp: {
    fontSize: 11,
    color: '#6B8F7F',
    marginTop: 4,
    letterSpacing: 0.1,
    fontFamily: 'Poppins_400Regular',
  },
  timestampLeft: {
    marginLeft: 8,
    alignSelf: 'flex-start',
  },
  timestampRight: {
    marginRight: 8,
    alignSelf: 'flex-end',
  },
  streamingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  streamingDot: {
    fontSize: 20,
    color: '#52B788',
    marginHorizontal: 2,
  },
});

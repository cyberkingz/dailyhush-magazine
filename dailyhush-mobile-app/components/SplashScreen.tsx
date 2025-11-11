import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Path, G } from 'react-native-svg';

// const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onAnimationComplete?: () => void;
  showLoading?: boolean;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onAnimationComplete,
  showLoading = false,
}) => {
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const spiralAnim = useRef(new Animated.Value(0)).current;
  const logoAnim = useRef(new Animated.Value(0)).current;
  const taglineAnim = useRef(new Animated.Value(0)).current;
  const loadingAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Orchestrated animation sequence
    Animated.sequence([
      // Background fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      // Logo appears
      Animated.parallel([
        Animated.timing(logoAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(spiralAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]),
      // Tagline fades in
      Animated.timing(taglineAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Start loading animation if needed
      if (showLoading) {
        startLoadingAnimation();
      }

      // Call completion callback after a brief display
      if (onAnimationComplete) {
        setTimeout(onAnimationComplete, 1000);
      }
    });
  }, []);

  const startLoadingAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(loadingAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(loadingAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  // Animated spiral rotation
  const spiralRotation = spiralAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Logo slide up
  const logoTranslateY = logoAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [30, 0],
  });

  // Tagline slide up
  const taglineTranslateY = taglineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 0],
  });

  return (
    <View style={styles.container}>
      {/* Gradient Background */}
      <Animated.View style={[styles.gradientContainer, { opacity: fadeAnim }]}>
        <LinearGradient
          colors={['#0A1612', '#0D1F1A', '#0A1612']}
          locations={[0, 0.5, 1]}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />
      </Animated.View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Logo and App Name Section */}
        <Animated.View
          style={[
            styles.logoSection,
            {
              opacity: logoAnim,
              transform: [{ translateY: logoTranslateY }],
            },
          ]}>
          {/* Moon Icon (simple crescent) */}
          <View style={styles.iconContainer}>
            <Svg width="40" height="40" viewBox="0 0 40 40">
              <Path
                d="M30 20c0-8-6-12-12-12 6 0 10 4 10 12s-4 12-10 12c6 0 12-4 12-12z"
                fill="#34D399"
                opacity="0.9"
              />
              <Circle cx="28" cy="15" r="2" fill="#34D399" opacity="0.6" />
              <Circle cx="25" cy="25" r="1.5" fill="#34D399" opacity="0.6" />
            </Svg>
          </View>

          {/* App Name */}
          <Text style={styles.appName}>Nœma</Text>
        </Animated.View>

        {/* Tagline */}
        <Animated.View
          style={[
            styles.taglineContainer,
            {
              opacity: taglineAnim,
              transform: [{ translateY: taglineTranslateY }],
            },
          ]}>
          <Text style={styles.tagline}>Stop the Spiral of Overthinking</Text>
        </Animated.View>

        {/* Breaking Spiral Graphic */}
        <Animated.View
          style={[
            styles.spiralContainer,
            {
              opacity: spiralAnim,
              transform: [{ rotate: spiralRotation }],
            },
          ]}>
          <BreakingSpiralGraphic />
        </Animated.View>

        {/* Loading Indicator */}
        {showLoading && (
          <Animated.View style={[styles.loadingContainer, { opacity: taglineAnim }]}>
            <LoadingDots animationValue={loadingAnim} />
          </Animated.View>
        )}
      </View>
    </View>
  );
};

/**
 * Breaking Spiral Graphic Component
 * Represents interrupted spiral patterns - visual metaphor for breaking overthinking
 */
const BreakingSpiralGraphic: React.FC = () => {
  return (
    <Svg width="180" height="180" viewBox="0 0 180 180">
      <G transform="translate(90, 90)">
        {/* Outer broken arc - emerald glow */}
        <Circle
          cx="0"
          cy="0"
          r="70"
          stroke="#34D399"
          strokeWidth="2"
          fill="none"
          opacity="0.3"
          strokeDasharray="140, 300"
          strokeDashoffset="0"
        />

        {/* Middle broken arc - brighter emerald */}
        <Circle
          cx="0"
          cy="0"
          r="50"
          stroke="#34D399"
          strokeWidth="2.5"
          fill="none"
          opacity="0.5"
          strokeDasharray="100, 214"
          strokeDashoffset="50"
        />

        {/* Inner broken arc - brightest */}
        <Circle
          cx="0"
          cy="0"
          r="30"
          stroke="#6EE7B7"
          strokeWidth="3"
          fill="none"
          opacity="0.7"
          strokeDasharray="60, 128"
          strokeDashoffset="100"
        />

        {/* Center dot - the "break" point */}
        <Circle cx="0" cy="0" r="5" fill="#34D399" opacity="0.8" />

        {/* Small accent dots showing "interruption" points */}
        <Circle cx="70" cy="0" r="3" fill="#34D399" opacity="0.6" />
        <Circle cx="-35" cy="-60" r="3" fill="#6EE7B7" opacity="0.6" />
        <Circle cx="-50" cy="50" r="3" fill="#34D399" opacity="0.6" />
      </G>
    </Svg>
  );
};

/**
 * Loading Dots Component
 * Three-dot loading indicator with wave animation
 */
const LoadingDots: React.FC<{ animationValue: Animated.Value }> = ({ animationValue }) => {
  const dot1Opacity = animationValue.interpolate({
    inputRange: [0, 0.33, 0.66, 1],
    outputRange: [0.3, 1, 0.3, 0.3],
  });

  const dot2Opacity = animationValue.interpolate({
    inputRange: [0, 0.33, 0.66, 1],
    outputRange: [0.3, 0.3, 1, 0.3],
  });

  const dot3Opacity = animationValue.interpolate({
    inputRange: [0, 0.33, 0.66, 1],
    outputRange: [0.3, 0.3, 0.3, 1],
  });

  return (
    <View style={styles.dotsContainer}>
      <Animated.View style={[styles.dot, { opacity: dot1Opacity }]} />
      <Animated.View style={[styles.dot, { opacity: dot2Opacity }]} />
      <Animated.View style={[styles.dot, { opacity: dot3Opacity }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1612',
  },
  gradientContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gradient: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: Platform.OS === 'ios' ? 40 : 30,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    marginBottom: 16,
  },
  appName: {
    fontSize: 42,
    fontWeight: '600',
    color: '#ECFDF5',
    letterSpacing: 1.5,
    textAlign: 'center',
    ...Platform.select({
      ios: {
        fontFamily: 'System',
      },
      android: {
        fontFamily: 'Roboto',
      },
    }),
  },
  taglineContainer: {
    marginBottom: 60,
    paddingHorizontal: 40,
  },
  tagline: {
    fontSize: 16,
    fontWeight: '300',
    color: '#ECFDF5',
    opacity: 0.8,
    letterSpacing: 0.5,
    textAlign: 'center',
    ...Platform.select({
      ios: {
        fontFamily: 'System',
      },
      android: {
        fontFamily: 'Roboto',
      },
    }),
  },
  spiralContainer: {
    marginBottom: 60,
    width: 180,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 80,
    alignItems: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#34D399',
  },
});

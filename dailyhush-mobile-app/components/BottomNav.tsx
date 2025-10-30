/**
 * DailyHush - Bottom Navigation Bar
 * Glassmorphism design with blur effect
 * Optimized for 55-70 demographic with large touch targets
 */

import React, { useState, useEffect } from 'react';
import { View, Pressable, Text, Platform, StyleSheet, AccessibilityInfo } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MotiView, AnimatePresence } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { Home, BookOpen, TrendingUp, User, Shield } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { colors } from '@/constants/colors';
import { Easing } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';

const NAV_ITEMS = [
  { id: 'home', icon: Home, label: 'Home', route: '/' },
  { id: 'training', icon: BookOpen, label: 'Training', route: '/training' },
  { id: 'center', icon: null, label: '', route: null },
  { id: 'insights', icon: TrendingUp, label: 'Insights', route: '/insights' },
  { id: 'profile', icon: User, label: 'Profile', route: '/profile' },
];
const HIGHLIGHT_COLOR = '#7dd3c0';
const NAV_EASING = Easing.bezier(0.4, 0.0, 0.2, 1);

function CenterButton({
  onPress,
  reduceMotion = false,
}: {
  onPress: () => void;
  reduceMotion?: boolean;
}) {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <View style={styles.centerContainer}>
      <Pressable
        onPress={async () => {
          setIsPressed(true);
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          onPress(); // Execute immediately - no delay
          setTimeout(() => setIsPressed(false), 1000);
        }}
        accessibilityLabel="Emergency spiral interrupt"
        accessibilityHint="Tap to start 90-second spiral interrupt protocol"
        accessibilityRole="button"
        style={({ pressed }) => [
          styles.centerPressable,
          pressed && { transform: [{ scale: 0.96 }] },
        ]}>
        {/* Outer pulsing ring */}
        <MotiView
          style={styles.centerOuterRing}
          animate={
            reduceMotion
              ? { scale: 1, opacity: 0.3 }
              : isPressed
                ? { scale: [1, 1.4, 1], opacity: [0.3, 0.6, 0] }
                : { scale: 1, opacity: 0.3 }
          }
          transition={{
            duration: reduceMotion ? 0 : 1000,
            type: 'timing',
            easing: Easing.out(Easing.cubic),
          }}
        />
        {/* Animated glow rings on press - skip if reduced motion */}
        {!reduceMotion && (
          <AnimatePresence>
            {isPressed && (
              <>
                <MotiView
                  key="center-glow-primary"
                  from={{ scale: 1, opacity: 0.4 }}
                  animate={{ scale: 2, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 800, type: 'timing', easing: Easing.out(Easing.cubic) }}
                  style={styles.centerGlowPrimary}
                />
                <MotiView
                  key="center-glow-secondary"
                  from={{ scale: 1, opacity: 0.3 }}
                  animate={{ scale: 2.5, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 1000,
                    type: 'timing',
                    delay: 100,
                    easing: Easing.out(Easing.cubic),
                  }}
                  style={styles.centerGlowSecondary}
                />
              </>
            )}
          </AnimatePresence>
        )}
        {/* Main button with animated gradient + shadow */}
        <MotiView
          animate={
            reduceMotion
              ? { scale: 1, rotate: '0deg' }
              : isPressed
                ? { scale: [1, 0.9, 1.05, 1], rotate: ['0deg', '-5deg', '5deg', '0deg'] }
                : { scale: 1, rotate: '0deg' }
          }
          transition={{
            duration: reduceMotion ? 0 : 600,
            type: 'timing',
            easing: Easing.bezier(0.34, 1.56, 0.64, 1),
          }}
          style={[
            styles.centerButton,
            Platform.OS === 'ios' ? styles.centerButtonShadowIOS : styles.centerButtonShadowAndroid,
          ]}>
          <LinearGradient
            colors={['#7dd3c0', '#5cb5a3']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          />
          {/* Inner glow */}
          <MotiView
            style={styles.centerGlowOverlay}
            animate={{ opacity: reduceMotion ? 0.2 : isPressed ? [0.2, 0.4, 0.2] : 0.2 }}
            transition={{ duration: reduceMotion ? 0 : 600 }}
          />
          {/* Shield icon */}
          <MotiView
            animate={
              reduceMotion
                ? { scale: 1, rotate: '0deg' }
                : isPressed
                  ? { scale: [1, 1.2, 1], rotate: ['0deg', '10deg', '-10deg', '0deg'] }
                  : { scale: 1, rotate: '0deg' }
            }
            transition={{
              duration: reduceMotion ? 0 : 600,
              type: 'timing',
              easing: Easing.out(Easing.cubic),
            }}
            style={styles.centerIcon}>
            <Shield size={24} color={colors.background.primary} strokeWidth={2.5} />
          </MotiView>
        </MotiView>
      </Pressable>
    </View>
  );
}

function TabButton({ item, isActive, isClicked, clickCycle, onPress, reduceMotion = false }: any) {
  const Icon = item.icon;
  // Simplified to match original web version - cleaner animations
  const iconScale = isClicked ? [1, 1.1, 1] : 1;
  const labelOpacity = isClicked ? [1, 0.7, 1] : 1;
  const iconShadow = Platform.OS === 'android' ? 0 : isClicked ? 0.4 : isActive ? 0.24 : 0.12;

  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel={`Go to ${item.label}`}
      accessibilityRole="tab"
      accessibilityState={isActive ? { selected: true } : undefined}
      style={({ pressed }) => [
        styles.tabPressable,
        pressed && { transform: [{ translateY: -1 }, { scale: 0.98 }] },
      ]}>
      <View style={styles.tabWrapper}>
        {/* Skip pulse animation if reduced motion is enabled */}
        {!reduceMotion && (
          <AnimatePresence>
            {isClicked && (
              <MotiView
                key={`tab-pulse-${item.id}-${clickCycle}`}
                from={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1.45, opacity: [0, 0.2, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 540, type: 'timing', easing: NAV_EASING }}
                style={styles.tabPulse}>
                <LinearGradient
                  pointerEvents="none"
                  colors={[
                    'rgba(125, 211, 192, 0.28)',
                    'rgba(125, 211, 192, 0.12)',
                    'rgba(125, 211, 192, 0)',
                  ]}
                  locations={[0, 0.55, 1]}
                  start={{ x: 0.5, y: 0.1 }}
                  end={{ x: 0.5, y: 1 }}
                  style={styles.tabPulseGradient}
                />
              </MotiView>
            )}
          </AnimatePresence>
        )}
        <MotiView
          animate={{
            translateY: reduceMotion ? 0 : isActive ? -2 : 0,
            scale: reduceMotion ? 1 : isClicked ? [1, 1.04, 1] : isActive ? 1.02 : 1,
          }}
          transition={{
            translateY: { duration: reduceMotion ? 0 : 420, easing: NAV_EASING },
            scale: { duration: reduceMotion ? 0 : 380, easing: NAV_EASING },
          }}
          style={styles.tabContent}>
          <MotiView
            style={styles.tabIconWrapper}
            animate={{
              scale: reduceMotion ? 1 : iconScale,
              shadowOpacity: iconShadow,
            }}
            transition={{
              scale: { duration: reduceMotion ? 0 : 600, easing: NAV_EASING },
              shadowOpacity: { duration: reduceMotion ? 0 : 600, easing: NAV_EASING },
            }}>
            <Icon
              size={24}
              color={isActive ? HIGHLIGHT_COLOR : '#6B7280'}
              strokeWidth={isActive ? 2.5 : 2}
            />
          </MotiView>
          <MotiView
            animate={{
              opacity: reduceMotion ? 1 : labelOpacity,
            }}
            transition={{
              opacity: { duration: reduceMotion ? 0 : 500, easing: NAV_EASING },
            }}>
            <Text
              style={[
                styles.tabLabel,
                {
                  color: isActive ? HIGHLIGHT_COLOR : '#6B7280',
                  fontWeight: isActive ? '600' : '500',
                },
              ]}>
              {item.label}
            </Text>
          </MotiView>
        </MotiView>
      </View>
    </Pressable>
  );
}

interface BottomNavProps {
  hideOnPaths?: string[];
}

export function BottomNav({ hideOnPaths = ['/spiral', '/onboarding'] }: BottomNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, 12);
  // Simplified state management - just track clicked tab ID
  const [clickedTab, setClickedTab] = useState<string | null>(null);
  // Accessibility: Check for reduced motion preference
  const [reduceMotion, setReduceMotion] = useState(false);

  let derivedActive = 'home';
  if (pathname.startsWith('/training')) derivedActive = 'training';
  else if (pathname.startsWith('/insights')) derivedActive = 'insights';
  else if (pathname.startsWith('/profile')) derivedActive = 'profile';
  const [displayActive, setDisplayActive] = useState(derivedActive);

  useEffect(() => {
    setDisplayActive(derivedActive);
  }, [derivedActive]);

  // Check reduced motion preference on mount
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
  }, []);

  const shouldHide = hideOnPaths.some((path) => pathname.startsWith(path));
  if (shouldHide) return null;

  return (
    <View style={[styles.container, { paddingBottom: bottomPadding }]}>
      <View style={styles.backgroundWrapper} pointerEvents="none">
        <BlurView pointerEvents="none" intensity={45} tint="dark" style={styles.blurOverlay} />
        <LinearGradient
          pointerEvents="none"
          colors={['rgba(125, 211, 192, 0.08)', 'rgba(10, 31, 26, 0.55)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientOverlay}
        />
      </View>
      <CenterButton onPress={() => router.push('/spiral')} reduceMotion={reduceMotion} />
      <View style={styles.navInner}>
        {NAV_ITEMS.map((item) => {
          if (item.id === 'center' || !item.icon) {
            return <View key={item.id} style={styles.centerSpacer} />;
          }
          const isActive = displayActive === item.id;
          const isClicked = clickedTab === item.id;
          return (
            <TabButton
              key={item.id}
              item={item}
              isActive={isActive}
              isClicked={isClicked}
              clickCycle={clickedTab} // Pass the tab ID for AnimatePresence key
              reduceMotion={reduceMotion}
              onPress={() => {
                // Add haptic feedback for already-active tab
                if (isActive) {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  return;
                }

                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setDisplayActive(item.id);
                setClickedTab(item.id);
                if (item.route) router.push(item.route as any);
                // Fixed timeout to match longest animation (600ms) + buffer
                setTimeout(() => setClickedTab(null), 620);
              }}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    overflow: 'visible',
  },
  backgroundWrapper: {
    ...StyleSheet.absoluteFillObject,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 31, 26, 0.92)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.6,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  navInner: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingTop: 14,
    paddingBottom: 12,
    position: 'relative',
  },
  centerSpacer: {
    width: 70,
  },
  centerContainer: {
    position: 'absolute',
    top: 10,
    left: '50%',
    marginLeft: -22,
    zIndex: 60,
  },
  centerPressable: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerOuterRing: {
    position: 'absolute',
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: HIGHLIGHT_COLOR,
    opacity: 0.4,
    pointerEvents: 'none',
    top: -4,
    left: -4,
    shadowColor: HIGHLIGHT_COLOR,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  centerGlowPrimary: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: HIGHLIGHT_COLOR,
    opacity: 0.3,
    pointerEvents: 'none',
    top: 0,
    left: 0,
  },
  centerGlowSecondary: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: HIGHLIGHT_COLOR,
    opacity: 0.2,
    pointerEvents: 'none',
    top: 0,
    left: 0,
  },
  centerButton: {
    position: 'relative',
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: HIGHLIGHT_COLOR,
  },
  centerButtonShadowIOS: {
    shadowColor: HIGHLIGHT_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
  },
  centerButtonShadowAndroid: {
    elevation: 8,
  },
  centerGlowOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    pointerEvents: 'none',
  },
  centerIcon: {
    pointerEvents: 'none',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabPressable: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
    paddingVertical: 4,
    paddingHorizontal: 4,
    position: 'relative',
  },
  tabWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'visible',
  },
  tabPulse: {
    position: 'absolute',
    top: -18,
    left: '50%',
    marginLeft: -34,
    width: 68,
    height: 68,
    borderRadius: 34,
    overflow: 'hidden',
    backgroundColor: 'transparent',
    shadowColor: 'rgba(125, 211, 192, 0.35)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: Platform.OS === 'android' ? 0 : 0.28,
    shadowRadius: 18,
    elevation: 6,
    pointerEvents: 'none',
  },
  tabPulseGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 34,
  },
  tabIconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(125, 211, 192, 0.6)',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0,
    shadowRadius: 20,
    elevation: 4,
    zIndex: 12,
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 3,
  },
});

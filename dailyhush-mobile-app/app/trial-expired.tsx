/**
 * DailyHush - Trial Expired Screen
 * Shown when user's 7-day Premium trial expires
 * Offers subscription options or Free tier continuation
 * Created: 2025-10-31
 */

import { useState, useEffect } from 'react';
import { useRouter, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';

import { TrialExpiredPaywall } from '@/components/TrialExpiredPaywall';
import { colors } from '@/constants/colors';
import { supabase } from '@/utils/supabase';
import { useStore } from '@/store/useStore';
import type { LoopType } from '@/data/quizQuestions';

export default function TrialExpiredScreen() {
  const router = useRouter();
  const { user, setUser } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [loopType, setLoopType] = useState<LoopType | null>(null);

  // Load loop type from user profile
  useEffect(() => {
    const loadLoopType = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.user) {
          console.error('No authenticated user');
          return;
        }

        const { data: profile } = await supabase
          .from('user_profiles')
          .select('loop_type')
          .eq('user_id', session.user.id)
          .single();

        if (profile?.loop_type) {
          setLoopType(profile.loop_type as LoopType);
        }
      } catch (error) {
        console.error('Error loading loop type:', error);
      }
    };

    loadLoopType();
  }, []);

  // Handle subscription (navigate to subscription picker)
  const handleSubscribe = async () => {
    try {
      setIsLoading(true);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // Navigate to subscription screen
      // TODO: Create subscription screen with RevenueCat integration
      router.push('/subscription');
    } catch (error) {
      console.error('Error navigating to subscription:', error);
      setIsLoading(false);
    }
  };

  // Handle continue with Free tier
  const handleContinueFree = async () => {
    try {
      setIsLoading(true);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      // User chooses to stay on Free tier
      // Trial is already expired (premium_trial_active = false)
      // Just navigate back to home

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace('/');
    } catch (error) {
      console.error('Error continuing with Free:', error);
      setIsLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
          presentation: 'modal',
        }}
      />
      <StatusBar style="light" />
      <TrialExpiredPaywall
        loopType={loopType}
        onSubscribe={handleSubscribe}
        onContinueFree={handleContinueFree}
        isLoading={isLoading}
        showClose={false}
      />
    </>
  );
}

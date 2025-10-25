/**
 * DailyHush - Spiral History
 * View all past spiral logs with triggers, feelings, and progress
 */

import { useEffect, useState } from 'react';
import { useRouter, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Pressable, ActivityIndicator, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Calendar, TrendingUp, TrendingDown, Minus, ArrowLeft } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { Text } from '@/components/ui/text';
import { useUser } from '@/store/useStore';
import { supabase } from '@/utils/supabase';
import type { SpiralLog } from '@/types';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';

export default function History() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const user = useUser();

  const [loading, setLoading] = useState(true);
  const [spirals, setSpirals] = useState<SpiralLog[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'week' | 'month'>('all');

  useEffect(() => {
    fetchSpirals();
  }, [user?.user_id, filter]);

  const fetchSpirals = async () => {
    if (!user?.user_id) {
      setError('Please sign in to view history');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('spiral_logs')
        .select('*')
        .eq('user_id', user.user_id)
        .order('timestamp', { ascending: false });

      // Apply time filter
      if (filter === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        query = query.gte('timestamp', weekAgo.toISOString());
      } else if (filter === 'month') {
        const monthAgo = new Date();
        monthAgo.setDate(monthAgo.getDate() - 30);
        query = query.gte('timestamp', monthAgo.toISOString());
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        console.error('Error fetching spirals:', fetchError);
        setError('Failed to load spiral history');
        setLoading(false);
        return;
      }

      setSpirals(data || []);
      setLoading(false);
    } catch (err) {
      console.error('Exception fetching spirals:', err);
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  // Format timestamp to readable date/time
  const formatDateTime = (isoString: string): { date: string; time: string } => {
    const date = new Date(isoString);
    const dateStr = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
    const timeStr = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    return { date: dateStr, time: timeStr };
  };

  // Format duration
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes === 0) return `${seconds}s`;
    return `${minutes}m ${remainingSeconds}s`;
  };

  // Calculate improvement
  const calculateImprovement = (pre: number, post: number): { percent: number; direction: 'up' | 'down' | 'same' } => {
    if (pre === post) return { percent: 0, direction: 'same' };
    const percent = Math.round(((post - pre) / pre) * 100);
    return { percent: Math.abs(percent), direction: post > pre ? 'up' : 'down' };
  };

  // Get emoji for feeling rating (1-10 scale)
  const getFeelingEmoji = (rating: number): string => {
    if (rating <= 2) return '😟';
    if (rating <= 4) return '😐';
    if (rating <= 6) return '🙂';
    return '😊';
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={{ flex: 1, backgroundColor: colors.background.primary }}>
        <StatusBar style="light" />

      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + spacing.md,
          paddingHorizontal: spacing.lg,
          paddingBottom: spacing.md,
          borderBottomWidth: 1,
          borderBottomColor: colors.background.border,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md }}>
          <Pressable
            onPress={() => {
              Haptics.selectionAsync();
              router.back();
            }}
            style={{
              width: 40,
              height: 40,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ArrowLeft size={24} color={colors.text.secondary} strokeWidth={2} />
          </Pressable>

          <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.text.primary }}>
            Spiral History
          </Text>

          <View style={{ width: 40 }} />
        </View>

        {/* Filter Tabs */}
        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
          {(['all', 'week', 'month'] as const).map((f) => (
            <Pressable
              key={f}
              onPress={() => {
                setFilter(f);
                Haptics.selectionAsync();
              }}
              style={{
                flex: 1,
                paddingVertical: spacing.sm,
                borderRadius: 12,
                backgroundColor: filter === f ? colors.emerald[700] : colors.background.secondary,
              }}
            >
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 14,
                  fontWeight: filter === f ? '600' : '400',
                  color: filter === f ? colors.white : colors.text.secondary,
                }}
              >
                {f === 'all' ? 'All Time' : f === 'week' ? 'This Week' : 'This Month'}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Loading State */}
      {loading && (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={colors.emerald[500]} />
          <Text style={{ color: colors.text.secondary, fontSize: 14, marginTop: spacing.md }}>
            Loading your spirals...
          </Text>
        </View>
      )}

      {/* Error State */}
      {!loading && error && (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl }}>
          <Calendar size={48} color={colors.text.secondary} strokeWidth={2} />
          <Text style={{ color: colors.text.primary, fontSize: 20, fontWeight: 'bold', marginTop: spacing.md, textAlign: 'center' }}>
            Unable to Load History
          </Text>
          <Text style={{ color: colors.text.secondary, fontSize: 14, marginTop: spacing.sm, textAlign: 'center' }}>
            {error}
          </Text>
        </View>
      )}

      {/* Empty State */}
      {!loading && !error && spirals.length === 0 && (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl }}>
          <Calendar size={48} color={colors.text.secondary} strokeWidth={2} />
          <Text style={{ color: colors.text.primary, fontSize: 20, fontWeight: 'bold', marginTop: spacing.md, textAlign: 'center' }}>
            No Spirals Yet
          </Text>
          <Text style={{ color: colors.text.secondary, fontSize: 14, marginTop: spacing.sm, textAlign: 'center', lineHeight: 22 }}>
            {filter === 'all'
              ? "Start interrupting spirals to see your history here."
              : `No spirals logged in the ${filter === 'week' ? 'past week' : 'past month'}.`
            }
          </Text>
        </View>
      )}

      {/* Spiral List */}
      {!loading && !error && spirals.length > 0 && (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: spacing.lg,
            paddingTop: spacing.md,
            paddingBottom: spacing['3xl'] + insets.bottom,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Stats Summary */}
          <View style={{
            backgroundColor: colors.emerald[800] + '30',
            borderRadius: 16,
            padding: spacing.lg,
            marginBottom: spacing.lg,
            borderWidth: 1,
            borderColor: colors.emerald[700] + '40',
          }}>
            <Text style={{ fontSize: 32, fontWeight: 'bold', color: colors.emerald[500], textAlign: 'center', marginBottom: spacing.xs }}>
              {spirals.length}
            </Text>
            <Text style={{ fontSize: 14, color: colors.text.secondary, textAlign: 'center' }}>
              {filter === 'all' ? 'Total Spirals' : filter === 'week' ? 'This Week' : 'This Month'}
            </Text>
          </View>

          {/* Spiral Cards */}
          {spirals.map((spiral, index) => {
            const { date, time } = formatDateTime(spiral.timestamp);
            const improvement = calculateImprovement(spiral.pre_feeling, spiral.post_feeling);
            const preEmoji = getFeelingEmoji(spiral.pre_feeling);
            const postEmoji = getFeelingEmoji(spiral.post_feeling);

            return (
              <View
                key={spiral.spiral_id}
                style={{
                  backgroundColor: colors.background.secondary,
                  borderRadius: 16,
                  padding: spacing.lg,
                  marginBottom: spacing.md,
                  borderWidth: 1,
                  borderColor: colors.background.border,
                }}
              >
                {/* Date/Time Header */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md }}>
                  <View>
                    <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text.primary }}>
                      {date}
                    </Text>
                    <Text style={{ fontSize: 14, color: colors.text.secondary, marginTop: 2 }}>
                      {time}
                    </Text>
                  </View>

                  {/* Duration Badge */}
                  <View style={{
                    backgroundColor: colors.emerald[700] + '30',
                    paddingHorizontal: spacing.sm,
                    paddingVertical: 6,
                    borderRadius: 8,
                  }}>
                    <Text style={{ fontSize: 12, color: colors.emerald[400], fontWeight: '600' }}>
                      {formatDuration(spiral.duration_seconds)}
                    </Text>
                  </View>
                </View>

                {/* Feeling Before/After */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 12, color: colors.text.secondary, marginBottom: 4 }}>
                      Before
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={{ fontSize: 32, marginRight: 8 }}>{preEmoji}</Text>
                      <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text.primary }}>
                        {spiral.pre_feeling}/10
                      </Text>
                    </View>
                  </View>

                  {/* Improvement Arrow */}
                  <View style={{ alignItems: 'center', paddingHorizontal: spacing.sm }}>
                    {improvement.direction === 'up' && (
                      <View>
                        <TrendingUp size={20} color={colors.emerald[500]} strokeWidth={2} />
                        <Text style={{ fontSize: 12, color: colors.emerald[500], fontWeight: '600', marginTop: 2 }}>
                          +{improvement.percent}%
                        </Text>
                      </View>
                    )}
                    {improvement.direction === 'down' && (
                      <View>
                        <TrendingDown size={20} color={colors.text.muted} strokeWidth={2} />
                        <Text style={{ fontSize: 12, color: colors.text.muted, marginTop: 2 }}>
                          -{improvement.percent}%
                        </Text>
                      </View>
                    )}
                    {improvement.direction === 'same' && (
                      <View>
                        <Minus size={20} color={colors.text.muted} strokeWidth={2} />
                        <Text style={{ fontSize: 12, color: colors.text.muted, marginTop: 2 }}>
                          Same
                        </Text>
                      </View>
                    )}
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 12, color: colors.text.secondary, marginBottom: 4 }}>
                      After
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={{ fontSize: 32, marginRight: 8 }}>{postEmoji}</Text>
                      <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text.primary }}>
                        {spiral.post_feeling}/10
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Trigger */}
                {spiral.trigger && (
                  <View style={{
                    backgroundColor: colors.background.tertiary,
                    paddingHorizontal: spacing.md,
                    paddingVertical: spacing.sm,
                    borderRadius: 12,
                    marginBottom: spiral.used_shift ? spacing.sm : 0,
                  }}>
                    <Text style={{ fontSize: 12, color: colors.text.muted, marginBottom: 4 }}>
                      Trigger
                    </Text>
                    <Text style={{ fontSize: 14, color: colors.text.secondary, lineHeight: 20 }}>
                      {spiral.trigger}
                    </Text>
                  </View>
                )}

                {/* Shift Used Badge */}
                {spiral.used_shift && (
                  <View style={{
                    backgroundColor: colors.emerald[700] + '20',
                    paddingHorizontal: spacing.md,
                    paddingVertical: spacing.xs,
                    borderRadius: 8,
                    alignSelf: 'flex-start',
                    marginTop: spiral.trigger ? spacing.sm : 0,
                  }}>
                    <Text style={{ fontSize: 12, color: colors.emerald[400], fontWeight: '600' }}>
                      ⚡ Used Shift Necklace
                    </Text>
                  </View>
                )}
              </View>
            );
          })}

          {/* Bottom Spacing */}
          <View style={{ height: spacing.lg }} />
        </ScrollView>
      )}
      </View>
    </>
  );
}

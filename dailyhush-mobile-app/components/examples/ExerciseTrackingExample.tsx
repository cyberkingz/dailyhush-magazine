// ============================================================================
// EXAMPLE COMPONENT: Exercise Tracking Integration
// ============================================================================
// Complete example showing how to use the exercise logging system
// ============================================================================

import React, { useState, useEffect } from 'react';
import { View, Text, Button, ScrollView, StyleSheet } from 'react-native';
import {
  useExerciseTracking,
  useExerciseHistory,
  useExerciseStats,
  useExerciseTriggers,
  useExerciseSubscription,
} from '@/hooks/useExerciseTracking';
import { useUser } from '@/store/useStore';
import type { ExerciseType } from '@/types/exercise-logs';

// ============================================================================
// EXAMPLE 1: Complete Exercise Flow
// ============================================================================

export function BreathingExerciseExample() {
  const { startExercise, completeExercise, currentExercise, isLoading } = useExerciseTracking();

  const [preRating] = useState<number>(7);
  const [postRating] = useState<number>(3);
  const [startTime, setStartTime] = useState<number | null>(null);

  // Start exercise
  const handleStart = async () => {
    const log = await startExercise({
      exercise_type: 'breathing',
      exercise_name: '4-7-8 Breathing',
      module_context: 'interrupt',
      fire_module_screen: 'breathing-intro',
      pre_anxiety_rating: preRating,
      trigger_category: 'work',
      trigger_text: 'Feeling stressed about upcoming deadline',
    });

    if (log) {
      setStartTime(Date.now());
    }
  };

  // Complete exercise
  const handleComplete = async () => {
    if (!currentExercise || !startTime) return;

    const durationSeconds = Math.floor((Date.now() - startTime) / 1000);

    await completeExercise(currentExercise.log_id, postRating, durationSeconds, {
      cycles_completed: 8,
      target_cycles: 8,
      technique: '4-7-8',
      interruptions: 0,
    });

    setStartTime(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>4-7-8 Breathing Exercise</Text>

      {!currentExercise ? (
        <>
          <Text>How anxious do you feel right now? (1-10)</Text>
          <Text style={styles.rating}>{preRating}</Text>

          <Button title="Start Exercise" onPress={handleStart} disabled={isLoading} />
        </>
      ) : (
        <>
          <Text style={styles.instruction}>Breathe in for 4, hold for 7, out for 8...</Text>

          <Text>How do you feel now? (1-10)</Text>
          <Text style={styles.rating}>{postRating}</Text>

          <Button title="Complete Exercise" onPress={handleComplete} disabled={isLoading} />
        </>
      )}
    </View>
  );
}

// ============================================================================
// EXAMPLE 2: Exercise History List
// ============================================================================

export function ExerciseHistoryExample() {
  const { history, isLoading, error, refetch } = useExerciseHistory(10);

  if (isLoading) {
    return <Text>Loading history...</Text>;
  }

  if (error) {
    return <Text style={styles.error}>Error: {error}</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Exercise History</Text>

      {history.map((item) => (
        <View key={item.log_id} style={styles.historyItem}>
          <Text style={styles.exerciseName}>{item.exercise_name}</Text>
          <Text style={styles.date}>{new Date(item.completed_at).toLocaleDateString()}</Text>
          <Text style={styles.reduction}>
            Anxiety reduced by {item.anxiety_reduction} points ({item.reduction_percentage}%)
          </Text>
          <Text style={styles.duration}>Duration: {item.duration_minutes} minutes</Text>
        </View>
      ))}

      <Button title="Refresh" onPress={refetch} />
    </ScrollView>
  );
}

// ============================================================================
// EXAMPLE 3: Dashboard with Stats
// ============================================================================

export function ExerciseDashboardExample() {
  const {
    stats,
    streak,
    mostEffectiveExercise,
    mostCommonTrigger,
    overallStats,
    isLoading,
    error,
  } = useExerciseStats();

  if (isLoading) {
    return <Text>Loading stats...</Text>;
  }

  if (error) {
    return <Text style={styles.error}>Error: {error}</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Your Progress</Text>

      {/* Streak */}
      <View style={styles.statCard}>
        <Text style={styles.statLabel}>Current Streak</Text>
        <Text style={styles.statValue}>{streak} days 🔥</Text>
      </View>

      {/* Overall Stats */}
      <View style={styles.statCard}>
        <Text style={styles.statLabel}>Total Exercises</Text>
        <Text style={styles.statValue}>{overallStats.completed_count}</Text>
      </View>

      <View style={styles.statCard}>
        <Text style={styles.statLabel}>Average Anxiety Reduction</Text>
        <Text style={styles.statValue}>{overallStats.avg_reduction} points</Text>
      </View>

      <View style={styles.statCard}>
        <Text style={styles.statLabel}>This Week</Text>
        <Text style={styles.statValue}>{overallStats.total_this_week} exercises</Text>
      </View>

      {/* Most Effective Exercise */}
      {mostEffectiveExercise && (
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Most Effective Exercise</Text>
          <Text style={styles.statValue}>{mostEffectiveExercise}</Text>
        </View>
      )}

      {/* Most Common Trigger */}
      {mostCommonTrigger && (
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Most Common Trigger</Text>
          <Text style={styles.statValue}>{mostCommonTrigger}</Text>
        </View>
      )}

      {/* Per-Exercise Stats */}
      <Text style={styles.subtitle}>Exercise Breakdown</Text>
      {stats.map((stat) => (
        <View key={stat.exercise_type} style={styles.exerciseStatCard}>
          <Text style={styles.exerciseType}>{stat.exercise_type}</Text>
          <Text>Sessions: {stat.total_sessions}</Text>
          <Text>Completion Rate: {stat.completion_rate}%</Text>
          <Text>Avg Reduction: {stat.avg_anxiety_reduction} points</Text>
        </View>
      ))}
    </ScrollView>
  );
}

// ============================================================================
// EXAMPLE 4: Trigger Selection
// ============================================================================

export function TriggerSelectionExample() {
  const user = useUser();
  const loopType = user?.loop_type; // e.g., "sleep-loop"

  const { triggers, isLoading, error } = useExerciseTriggers(loopType || undefined);
  const [selectedTrigger, setSelectedTrigger] = useState<string | null>(null);

  if (isLoading) {
    return <Text>Loading triggers...</Text>;
  }

  if (error) {
    return <Text style={styles.error}>Error: {error}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What's causing your anxiety?</Text>

      {triggers.map((trigger) => (
        <Button
          key={trigger.trigger_id}
          title={trigger.trigger_name}
          onPress={() => setSelectedTrigger(trigger.trigger_category)}
          color={selectedTrigger === trigger.trigger_category ? 'blue' : 'gray'}
        />
      ))}

      {selectedTrigger && <Text style={styles.selectedTrigger}>Selected: {selectedTrigger}</Text>}
    </View>
  );
}

// ============================================================================
// EXAMPLE 5: Abandonment Tracking
// ============================================================================

export function ExerciseWithAbandonmentExample() {
  const { startExercise, abandonExercise, currentExercise } = useExerciseTracking();

  const [progress, setProgress] = useState<number>(0);
  const [startTime, setStartTime] = useState<number | null>(null);

  // Simulate exercise progress
  useEffect(() => {
    if (!currentExercise) return;

    const interval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 10, 100));
    }, 2000); // Increase progress every 2 seconds

    return () => clearInterval(interval);
  }, [currentExercise]);

  const handleStart = async () => {
    const log = await startExercise({
      exercise_type: 'body_scan',
      exercise_name: 'Body Scan Meditation',
      module_context: 'reframe',
      pre_anxiety_rating: 6,
    });

    if (log) {
      setStartTime(Date.now());
      setProgress(0);
    }
  };

  const handleAbandon = async () => {
    if (!currentExercise || !startTime) return;

    const durationSeconds = Math.floor((Date.now() - startTime) / 1000);

    await abandonExercise(
      currentExercise.log_id,
      progress, // Percentage at which user abandoned
      durationSeconds
    );

    setStartTime(null);
    setProgress(0);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Body Scan Meditation</Text>

      {!currentExercise ? (
        <Button title="Start Exercise" onPress={handleStart} />
      ) : (
        <>
          <Text style={styles.progress}>Progress: {progress}%</Text>

          <Button title="I need to stop" onPress={handleAbandon} />
        </>
      )}
    </View>
  );
}

// ============================================================================
// EXAMPLE 6: Real-time Updates (Advanced)
// ============================================================================

export function RealTimeExerciseUpdates() {
  const [recentUpdate, setRecentUpdate] = useState<string | null>(null);

  // Subscribe to real-time updates
  useExerciseSubscription((payload: any) => {
    console.log('Exercise update received:', payload);

    if (payload.eventType === 'INSERT') {
      setRecentUpdate('New exercise started!');
    } else if (payload.eventType === 'UPDATE') {
      setRecentUpdate('Exercise updated!');
    }

    // Clear notification after 3 seconds
    setTimeout(() => setRecentUpdate(null), 3000);
  });

  return (
    <View style={styles.container}>
      {recentUpdate && (
        <View style={styles.notification}>
          <Text style={styles.notificationText}>{recentUpdate}</Text>
        </View>
      )}

      <Text style={styles.title}>Real-time Exercise Tracking</Text>
      <Text>Any exercise updates will appear above.</Text>
    </View>
  );
}

// ============================================================================
// EXAMPLE 7: Complete Integration (Full Flow)
// ============================================================================

export function CompleteExerciseFlowExample() {
  const { startExercise, completeExercise, currentExercise, isLoading } = useExerciseTracking();

  const { triggers } = useExerciseTriggers();
  const { refetch: refetchHistory } = useExerciseHistory();
  const { streak, refetch: refetchStats } = useExerciseStats();

  // Exercise flow state
  const [step, setStep] = useState<'select' | 'rating' | 'exercise' | 'done'>('select');
  const [exerciseType, setExerciseType] = useState<ExerciseType>('breathing');
  const [preRating] = useState<number>(5);
  const [postRating] = useState<number>(3);
  const [selectedTrigger, setSelectedTrigger] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);

  // Step 1: Select exercise type
  const handleSelectExercise = (type: ExerciseType) => {
    setExerciseType(type);
    setStep('rating');
  };

  // Step 2: Rate anxiety and start
  const handleStartExercise = async () => {
    const log = await startExercise({
      exercise_type: exerciseType,
      exercise_name: getExerciseName(exerciseType),
      module_context: 'standalone',
      pre_anxiety_rating: preRating,
      trigger_category: selectedTrigger || undefined,
    });

    if (log) {
      setStartTime(Date.now());
      setStep('exercise');
    }
  };

  // Step 3: Complete exercise
  const handleCompleteExercise = async () => {
    if (!currentExercise || !startTime) return;

    const durationSeconds = Math.floor((Date.now() - startTime) / 1000);

    await completeExercise(currentExercise.log_id, postRating, durationSeconds);

    // Refresh stats and history
    await Promise.all([refetchStats(), refetchHistory()]);

    setStep('done');
    setStartTime(null);
  };

  // Render current step
  const renderStep = () => {
    switch (step) {
      case 'select':
        return (
          <View>
            <Text style={styles.title}>Choose an exercise</Text>
            <Button title="Breathing Exercise" onPress={() => handleSelectExercise('breathing')} />
            <Button title="Brain Dump" onPress={() => handleSelectExercise('brain_dump')} />
            <Button title="Grounding" onPress={() => handleSelectExercise('grounding')} />
          </View>
        );

      case 'rating':
        return (
          <View>
            <Text style={styles.title}>How anxious do you feel? (1-10)</Text>
            <Text style={styles.rating}>{preRating}</Text>

            <Text style={styles.subtitle}>What triggered this?</Text>
            {triggers.slice(0, 5).map((trigger) => (
              <Button
                key={trigger.trigger_id}
                title={trigger.trigger_name}
                onPress={() => setSelectedTrigger(trigger.trigger_category)}
              />
            ))}

            <Button title="Start Exercise" onPress={handleStartExercise} disabled={isLoading} />
          </View>
        );

      case 'exercise':
        return (
          <View>
            <Text style={styles.title}>{getExerciseName(exerciseType)}</Text>
            <Text style={styles.instruction}>Follow the instructions...</Text>

            <Text style={styles.subtitle}>How do you feel now? (1-10)</Text>
            <Text style={styles.rating}>{postRating}</Text>

            <Button title="Complete" onPress={handleCompleteExercise} disabled={isLoading} />
          </View>
        );

      case 'done':
        return (
          <View>
            <Text style={styles.title}>Great work! 🎉</Text>
            <Text style={styles.result}>
              You reduced your anxiety by {preRating - postRating} points (
              {Math.round(((preRating - postRating) / preRating) * 100)}%)
            </Text>

            <Text style={styles.streak}>Current streak: {streak} days</Text>

            <Button title="Do Another Exercise" onPress={() => setStep('select')} />
          </View>
        );
    }
  };

  return <ScrollView style={styles.container}>{renderStep()}</ScrollView>;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getExerciseName(type: ExerciseType): string {
  const names: Record<ExerciseType, string> = {
    breathing: '4-7-8 Breathing',
    progressive_muscle: 'Progressive Muscle Relaxation',
    brain_dump: 'Brain Dump',
    grounding: '5-4-3-2-1 Grounding',
    body_scan: 'Body Scan Meditation',
    cognitive_reframe: 'Cognitive Reframing',
  };
  return names[type];
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
  },
  instruction: {
    fontSize: 16,
    marginBottom: 20,
    fontStyle: 'italic',
  },
  rating: {
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  historyItem: {
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 10,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  reduction: {
    fontSize: 16,
    color: '#28a745',
    marginTop: 5,
  },
  duration: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  statCard: {
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 10,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  exerciseStatCard: {
    padding: 15,
    backgroundColor: '#e9ecef',
    borderRadius: 8,
    marginBottom: 10,
  },
  exerciseType: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    textTransform: 'capitalize',
  },
  selectedTrigger: {
    fontSize: 16,
    color: '#007bff',
    marginTop: 15,
  },
  progress: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  notification: {
    padding: 15,
    backgroundColor: '#d4edda',
    borderRadius: 8,
    marginBottom: 20,
  },
  notificationText: {
    fontSize: 16,
    color: '#155724',
    textAlign: 'center',
  },
  result: {
    fontSize: 20,
    textAlign: 'center',
    marginVertical: 20,
  },
  streak: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  error: {
    color: '#dc3545',
    fontSize: 16,
    textAlign: 'center',
  },
});

// ============================================================================
// EXPORT EXAMPLES
// ============================================================================

export default {
  BreathingExerciseExample,
  ExerciseHistoryExample,
  ExerciseDashboardExample,
  TriggerSelectionExample,
  ExerciseWithAbandonmentExample,
  RealTimeExerciseUpdates,
  CompleteExerciseFlowExample,
};

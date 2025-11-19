# Exercise Logs - Quick Reference Card

## 🚀 Quick Start (3 Steps)

```bash
# 1. Apply migration
supabase db push

# 2. Verify installation
SELECT table_name FROM information_schema.tables WHERE table_name LIKE 'exercise%';

# 3. Start using
import { ExerciseLogsAPI } from '@/utils/supabase/exercise-logs';
```

---

## 📊 Database Tables

| Table                    | Purpose                            |
| ------------------------ | ---------------------------------- |
| `exercise_logs`          | Main table - all exercise sessions |
| `exercise_triggers`      | Pre-defined trigger categories     |
| `exercise_stats_by_user` | Materialized view - fast stats     |

---

## 🎯 Exercise Types

```typescript
type ExerciseType =
  | 'breathing' // Breathing exercises
  | 'progressive_muscle' // PMR
  | 'brain_dump' // Journaling (NO CONTENT STORED)
  | 'grounding' // 5-4-3-2-1
  | 'body_scan' // Body scan meditation
  | 'cognitive_reframe'; // Cognitive reframing
```

---

## 📱 React Native - Complete Flow

```typescript
import { useExerciseTracking } from '@/hooks/useExerciseTracking';

function MyComponent() {
  const { startExercise, completeExercise } = useExerciseTracking();

  // 1. Start exercise
  const log = await startExercise({
    exercise_type: 'breathing',
    exercise_name: '4-7-8 Breathing',
    module_context: 'interrupt',
    pre_anxiety_rating: 7,
    trigger_category: 'work',
  });

  // 2. Complete exercise
  await completeExercise(log.log_id, 3, 480, {
    cycles_completed: 8,
  });
}
```

---

## 🔥 Common Queries

### Get Last 7 Days

```typescript
const exercises = await ExerciseLogsAPI.getRecentExercises(userId, 20);
```

### Get Streak

```typescript
const streak = await ExerciseLogsAPI.getExerciseStreak(userId);
```

### Get Stats (FAST - uses materialized view)

```typescript
const stats = await ExerciseLogsAPI.getExerciseStats(userId);
```

### Get Dashboard Data

```typescript
const { stats, streak, mostEffectiveExercise } = useExerciseStats();
```

---

## 📈 Dashboard Components

### Exercise History

```typescript
import { useExerciseHistory } from '@/hooks/useExerciseTracking';

const { history, isLoading } = useExerciseHistory(10);
// Returns: Array<ExerciseHistoryItem>
```

### Stats Dashboard

```typescript
import { useExerciseStats } from '@/hooks/useExerciseTracking';

const {
  stats, // Per-exercise stats
  streak, // Current streak
  overallStats, // Aggregated stats
} = useExerciseStats();
```

---

## 💾 SQL Quick Hits

### Insert Exercise

```sql
INSERT INTO exercise_logs (user_id, exercise_type, exercise_name, ...)
VALUES ('user-id', 'breathing', '4-7-8', ...);
```

### Get Recent Exercises

```sql
SELECT * FROM exercise_logs
WHERE user_id = 'xxx' AND is_deleted = FALSE
ORDER BY started_at DESC LIMIT 10;
```

### Calculate Streak

```sql
SELECT get_exercise_streak('user-id');
```

### Get Stats (Fast)

```sql
SELECT * FROM exercise_stats_by_user WHERE user_id = 'xxx';
```

### Refresh Stats

```sql
SELECT refresh_exercise_stats();
```

---

## 🔒 Privacy Features

✅ **NO journal content stored** (Brain Dump exercise)
✅ **Soft delete** (is_deleted flag)
✅ **RLS policies** (users only see their own data)
✅ **Trigger text optional** (user controls sharing)

---

## ⚡ Performance Tips

1. **Use materialized view for dashboards**

   ```typescript
   // Good (fast)
   const stats = await ExerciseLogsAPI.getExerciseStats(userId);

   // Slow (calculates on-the-fly)
   // Don't query exercise_logs directly for aggregations
   ```

2. **Refresh stats periodically**

   ```sql
   -- Every 6 hours via pg_cron
   SELECT cron.schedule('refresh-exercise-stats', '0 */6 * * *',
     $$SELECT refresh_exercise_stats();$$);
   ```

3. **All queries use indexes** - check with EXPLAIN
   ```sql
   EXPLAIN ANALYZE SELECT * FROM exercise_logs WHERE user_id = 'xxx';
   -- Should use: idx_exercise_logs_user_completed
   ```

---

## 🎨 TypeScript Types

```typescript
import type {
  ExerciseLog, // Complete log record
  ExerciseType, // Exercise types enum
  ExerciseStats, // Stats from materialized view
  StartExercisePayload, // Insert payload
  CompleteExercisePayload, // Completion payload
} from '@/types/exercise-logs';
```

---

## 🔔 Real-Time Updates

```typescript
import { useExerciseSubscription } from '@/hooks/useExerciseTracking';

useExerciseSubscription((payload) => {
  console.log('Exercise updated:', payload);
});
```

---

## 🧪 Testing Checklist

```typescript
// ✅ Start exercise
const log = await ExerciseLogsAPI.startExercise(userId, {...});

// ✅ Complete exercise
await ExerciseLogsAPI.completeExercise(log.log_id, 3, 480);

// ✅ Get streak
const streak = await ExerciseLogsAPI.getExerciseStreak(userId);

// ✅ Verify RLS
// Try accessing another user's logs (should fail)

// ✅ Soft delete
await ExerciseLogsAPI.deleteExerciseLog(log.log_id);
```

---

## 📁 File Locations

| What       | Where                                                          |
| ---------- | -------------------------------------------------------------- |
| Migration  | `/supabase/migrations/20250104000000_create_exercise_logs.sql` |
| Types      | `/types/exercise-logs.ts`                                      |
| Client API | `/utils/supabase/exercise-logs.ts`                             |
| Hooks      | `/hooks/useExerciseTracking.ts`                                |
| Examples   | `/components/examples/ExerciseTrackingExample.tsx`             |
| Queries    | `/supabase/queries/exercise-logs-examples.sql`                 |
| Docs       | `/docs/EXERCISE_LOGS_SCHEMA.md`                                |

---

## 🆘 Troubleshooting

### RLS Not Working?

```sql
ALTER TABLE exercise_logs ENABLE ROW LEVEL SECURITY;
SELECT * FROM pg_policies WHERE tablename = 'exercise_logs';
```

### Slow Queries?

```sql
ANALYZE exercise_logs;
EXPLAIN ANALYZE SELECT ...;
```

### Stats Not Updated?

```sql
SELECT refresh_exercise_stats();
SELECT stats_updated_at FROM exercise_stats_by_user LIMIT 1;
```

---

## 💡 Pro Tips

1. **Always use hooks** in React Native components

   ```typescript
   // Good
   const { startExercise } = useExerciseTracking();

   // Bad
   import { supabase } from '@/utils/supabase';
   await supabase.from('exercise_logs').insert(...);
   ```

2. **Leverage auto-calculated fields**
   - `anxiety_reduction` = pre - post (automatic)
   - `reduction_percentage` = ((pre - post) / pre) \* 100 (automatic)

3. **Use type guards**

   ```typescript
   if (isCompletedExercise(log)) {
     // TypeScript knows post_anxiety_rating exists
     console.log(log.post_anxiety_rating);
   }
   ```

4. **Batch operations for performance**

   ```typescript
   // Good (batch)
   await supabase.from('exercise_logs').insert(logsArray);

   // Bad (individual)
   for (const log of logsArray) {
     await supabase.from('exercise_logs').insert(log);
   }
   ```

---

## 📚 Full Documentation

For complete details, see:

- **Schema:** `/docs/EXERCISE_LOGS_SCHEMA.md`
- **Migration:** `/docs/MIGRATION_NOTES.md`
- **Summary:** `/docs/EXERCISE_LOGS_SUMMARY.md`

---

**Need Help?** Check the comprehensive documentation files for detailed explanations.

**Version:** 1.0 | **Date:** 2025-01-04

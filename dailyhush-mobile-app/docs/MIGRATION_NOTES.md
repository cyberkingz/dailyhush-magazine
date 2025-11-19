# Exercise Logs Migration Notes

## Quick Start

### 1. Apply the Migration

```bash
# Using Supabase CLI
cd dailyhush-mobile-app
supabase db push

# Or manually in Supabase Dashboard:
# Copy contents of: supabase/migrations/20250104000000_create_exercise_logs.sql
# Paste into SQL Editor and run
```

---

## 2. Verify Installation

### Check Tables Created

```sql
-- Should return 3 tables
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('exercise_logs', 'exercise_triggers', 'exercise_stats_by_user');
```

### Check Enums Created

```sql
-- Should return 3 enums
SELECT typname
FROM pg_type
WHERE typname IN ('exercise_type', 'completion_status', 'fire_module');
```

### Check Functions Created

```sql
-- Should return 4 functions
SELECT routine_name
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN (
    'get_exercise_streak',
    'get_most_effective_exercise',
    'get_most_common_trigger',
    'refresh_exercise_stats'
  );
```

### Check RLS Policies

```sql
-- Should return 6 policies
SELECT tablename, policyname
FROM pg_policies
WHERE tablename IN ('exercise_logs', 'exercise_triggers');
```

### Check Indexes

```sql
-- Should return 8+ indexes
SELECT indexname
FROM pg_indexes
WHERE tablename = 'exercise_logs';
```

---

## 3. Test Basic Functionality

### Insert Test Exercise Log

```sql
-- Replace 'USER_ID' with actual user_id from user_profiles table
INSERT INTO exercise_logs (
  user_id,
  exercise_type,
  exercise_name,
  module_context,
  completion_status,
  started_at,
  completed_at,
  duration_seconds,
  pre_anxiety_rating,
  post_anxiety_rating,
  trigger_category
) VALUES (
  'USER_ID',
  'breathing',
  '4-7-8 Breathing',
  'interrupt',
  'completed',
  NOW() - INTERVAL '10 minutes',
  NOW(),
  600,
  8,
  4,
  'work'
);
```

### Query Test

```sql
-- Should return the inserted row
SELECT
  exercise_name,
  anxiety_reduction,
  reduction_percentage
FROM exercise_logs
WHERE user_id = 'USER_ID';
```

### Test Helper Functions

```sql
-- Should return 1 (current streak)
SELECT get_exercise_streak('USER_ID');

-- Should return 'breathing'
SELECT get_most_effective_exercise('USER_ID');

-- Should return 'work'
SELECT get_most_common_trigger('USER_ID');
```

### Refresh Materialized View

```sql
-- Refresh stats
SELECT refresh_exercise_stats();

-- Query stats
SELECT * FROM exercise_stats_by_user WHERE user_id = 'USER_ID';
```

---

## 4. TypeScript Integration

### Import Types

```typescript
// In your React Native components
import type {
  ExerciseLog,
  ExerciseType,
  StartExercisePayload,
  CompleteExercisePayload,
} from '@/types/exercise-logs';

import { ExerciseLogsAPI } from '@/utils/supabase/exercise-logs';
```

### Example Usage

```typescript
// Start exercise
const log = await ExerciseLogsAPI.startExercise(userId, {
  exercise_type: 'breathing',
  exercise_name: '4-7-8 Breathing',
  module_context: 'interrupt',
  pre_anxiety_rating: 7,
  trigger_category: 'work',
  device_type: 'ios',
  app_version: '1.0.0',
});

// Complete exercise
await ExerciseLogsAPI.completeExercise(log.log_id, {
  completion_status: 'completed',
  completed_at: new Date().toISOString(),
  duration_seconds: 480,
  post_anxiety_rating: 3,
  exercise_data: {
    cycles_completed: 8,
    target_cycles: 8,
  },
});

// Get streak
const streak = await ExerciseLogsAPI.getExerciseStreak(userId);
console.log(`Current streak: ${streak} days`);
```

---

## 5. Handling Existing spiral_logs Data

### Option A: Keep Both Tables (Recommended)

**No migration needed.** Keep `spiral_logs` for the existing spiral interrupt feature, use `exercise_logs` for all new exercises.

**Pros:**

- No data migration
- No breaking changes
- Both systems coexist

**Cons:**

- Duplicate functionality for spiral tracking

---

### Option B: Migrate spiral_logs to exercise_logs

**Use this script to migrate existing spiral data:**

```sql
-- Migration script for spiral_logs -> exercise_logs
-- WARNING: Run this carefully, test on staging first!

-- Step 1: Create a function to migrate one user's data
CREATE OR REPLACE FUNCTION migrate_user_spiral_logs(p_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  -- Insert spiral_logs as exercise_logs
  INSERT INTO exercise_logs (
    user_id,
    exercise_type,
    exercise_name,
    module_context,
    completion_status,
    started_at,
    completed_at,
    duration_seconds,
    pre_anxiety_rating,
    post_anxiety_rating,
    trigger_text,
    exercise_data,
    created_at,
    updated_at
  )
  SELECT
    user_id,
    'breathing'::exercise_type, -- Assume spiral technique was breathing
    COALESCE(technique_used, 'Spiral Interrupt'),
    'interrupt'::fire_module,
    CASE
      WHEN interrupted THEN 'completed'::completion_status
      ELSE 'abandoned'::completion_status
    END,
    timestamp,
    CASE
      WHEN interrupted THEN timestamp + (duration_seconds || ' seconds')::INTERVAL
      ELSE NULL
    END,
    duration_seconds,
    pre_feeling,
    post_feeling,
    trigger,
    jsonb_build_object(
      'legacy_spiral_id', spiral_id,
      'used_shift', used_shift,
      'location', location,
      'notes', notes
    ),
    created_at,
    NOW()
  FROM spiral_logs
  WHERE user_id = p_user_id
    AND NOT EXISTS (
      -- Don't duplicate if already migrated
      SELECT 1 FROM exercise_logs el
      WHERE el.exercise_data->>'legacy_spiral_id' = spiral_logs.spiral_id::TEXT
    );

  RAISE NOTICE 'Migrated spiral logs for user %', p_user_id;
END;
$$;

-- Step 2: Migrate all users (run carefully!)
DO $$
DECLARE
  v_user RECORD;
BEGIN
  FOR v_user IN
    SELECT DISTINCT user_id FROM spiral_logs
  LOOP
    PERFORM migrate_user_spiral_logs(v_user.user_id);
  END LOOP;
END;
$$;

-- Step 3: Verify migration
SELECT
  COUNT(*) as spiral_logs_count,
  (SELECT COUNT(*) FROM exercise_logs WHERE exercise_data ? 'legacy_spiral_id') as migrated_count
FROM spiral_logs;

-- Step 4: (Optional) Mark spiral_logs as deprecated
-- ALTER TABLE spiral_logs RENAME TO spiral_logs_legacy;
-- COMMENT ON TABLE spiral_logs_legacy IS 'DEPRECATED: Use exercise_logs instead. Kept for historical reference only.';
```

**Migration Checklist:**

- [ ] Test migration script on staging database first
- [ ] Verify row counts match
- [ ] Test queries on migrated data
- [ ] Update app code to use exercise_logs
- [ ] Keep spiral_logs table (don't delete, just deprecate)
- [ ] Monitor production after migration

---

## 6. Performance Tuning

### Enable pg_cron for Auto-Refresh (Optional)

```sql
-- Enable pg_cron extension (Supabase Pro plan required)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule materialized view refresh every 6 hours
SELECT cron.schedule(
  'refresh-exercise-stats',
  '0 */6 * * *', -- Every 6 hours at :00
  $$SELECT refresh_exercise_stats();$$
);

-- Verify schedule
SELECT * FROM cron.job;
```

### Manual Refresh (If pg_cron not available)

```typescript
// In your app, call this periodically
import { supabase } from '@/utils/supabase';

export async function refreshExerciseStats() {
  const { error } = await supabase.rpc('refresh_exercise_stats');
  if (error) {
    console.error('Error refreshing stats:', error);
  }
}

// Call from cron job, background task, or on-demand
setInterval(refreshExerciseStats, 6 * 60 * 60 * 1000); // Every 6 hours
```

---

## 7. Monitoring & Alerts

### Monitor Query Performance

```sql
-- Check slow queries
SELECT
  query,
  mean_exec_time,
  calls
FROM pg_stat_statements
WHERE query LIKE '%exercise_logs%'
ORDER BY mean_exec_time DESC
LIMIT 10;
```

### Monitor Table Size

```sql
-- Check table size growth
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname || '.' || tablename)) AS size
FROM pg_tables
WHERE tablename IN ('exercise_logs', 'exercise_triggers')
ORDER BY pg_total_relation_size(schemaname || '.' || tablename) DESC;
```

### Monitor RLS Policy Performance

```sql
-- Check RLS overhead
EXPLAIN ANALYZE
SELECT * FROM exercise_logs
WHERE user_id = 'USER_ID'
  AND is_deleted = FALSE
LIMIT 10;

-- Should see: "Index Scan using idx_exercise_logs_user_completed"
```

---

## 8. Backup & Rollback Plan

### Backup Before Migration

```bash
# Using Supabase CLI
supabase db dump -f backup_before_exercise_logs.sql

# Or via pg_dump
pg_dump -h db.YOUR_PROJECT.supabase.co \
  -U postgres \
  -d postgres \
  -t exercise_logs \
  -t exercise_triggers \
  > backup_exercise_logs.sql
```

### Rollback Script

```sql
-- EMERGENCY ROLLBACK (if migration fails)

-- Drop tables
DROP TABLE IF EXISTS exercise_logs CASCADE;
DROP TABLE IF EXISTS exercise_triggers CASCADE;
DROP MATERIALIZED VIEW IF EXISTS exercise_stats_by_user CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS get_exercise_streak(UUID);
DROP FUNCTION IF EXISTS get_most_effective_exercise(UUID);
DROP FUNCTION IF EXISTS get_most_common_trigger(UUID);
DROP FUNCTION IF EXISTS refresh_exercise_stats();
DROP FUNCTION IF EXISTS update_exercise_logs_updated_at();
DROP FUNCTION IF EXISTS set_exercise_logs_deleted_at();

-- Drop triggers
DROP TRIGGER IF EXISTS exercise_logs_updated_at ON exercise_logs;
DROP TRIGGER IF EXISTS exercise_logs_deleted_at ON exercise_logs;

-- Drop enums
DROP TYPE IF EXISTS exercise_type;
DROP TYPE IF EXISTS completion_status;
DROP TYPE IF EXISTS fire_module;

-- Unschedule cron job (if created)
-- SELECT cron.unschedule('refresh-exercise-stats');
```

---

## 9. Testing Checklist

### Functional Tests

- [ ] User can start exercise
- [ ] User can complete exercise with post-rating
- [ ] User can abandon exercise mid-way
- [ ] User can skip exercise
- [ ] Pre/post ratings are validated (1-10)
- [ ] Anxiety reduction is auto-calculated correctly
- [ ] Reduction percentage is auto-calculated correctly
- [ ] Soft delete works (is_deleted flag)
- [ ] Triggers are fetched correctly
- [ ] RLS policies prevent cross-user access

### Analytics Tests

- [ ] Streak calculation works
- [ ] Most effective exercise is identified
- [ ] Most common trigger is identified
- [ ] Completion rates are calculated correctly
- [ ] Weekly progress trends are accurate
- [ ] Materialized view refresh works

### Performance Tests

- [ ] Queries use proper indexes (check EXPLAIN)
- [ ] Dashboard loads in <500ms
- [ ] Inserting 1000 logs takes <5 seconds
- [ ] Materialized view refresh completes in <30 seconds
- [ ] Real-time subscriptions work without lag

---

## 10. Deployment Checklist

### Pre-Deployment

- [ ] Test migration on staging database
- [ ] Verify all indexes created
- [ ] Verify all RLS policies work
- [ ] Test TypeScript integration
- [ ] Review query performance
- [ ] Create backup

### Deployment

- [ ] Run migration during low-traffic period
- [ ] Monitor error logs
- [ ] Test basic functionality immediately
- [ ] Refresh materialized view
- [ ] Verify real-time subscriptions

### Post-Deployment

- [ ] Monitor database performance
- [ ] Monitor query execution times
- [ ] Monitor table growth
- [ ] Set up automated stats refresh
- [ ] Document any issues

---

## 11. Common Issues & Solutions

### Issue: RLS policies not working

**Solution:**

```sql
-- Check RLS is enabled
ALTER TABLE exercise_logs ENABLE ROW LEVEL SECURITY;

-- Verify policies exist
SELECT * FROM pg_policies WHERE tablename = 'exercise_logs';
```

### Issue: Materialized view not refreshing

**Solution:**

```sql
-- Manual refresh
SELECT refresh_exercise_stats();

-- Check for locks
SELECT * FROM pg_locks WHERE relation = 'exercise_stats_by_user'::regclass;
```

### Issue: Slow queries

**Solution:**

```sql
-- Analyze table statistics
ANALYZE exercise_logs;

-- Rebuild indexes if needed
REINDEX TABLE exercise_logs;
```

### Issue: Foreign key constraint error

**Solution:**

```sql
-- Verify user exists in user_profiles
SELECT EXISTS (SELECT 1 FROM user_profiles WHERE user_id = 'USER_ID');

-- If user doesn't exist, create profile first
```

---

## 12. Next Steps

After successful migration:

1. **Update app code** to use new exercise_logs table
2. **Add frontend components** for exercise tracking
3. **Implement analytics dashboard** using pre-computed stats
4. **Set up monitoring** for query performance
5. **Schedule regular stats refresh** (if pg_cron available)
6. **Document API endpoints** for mobile app
7. **Create admin dashboard** for viewing platform-wide stats

---

## Support

For questions or issues:

- Check full documentation: `/docs/EXERCISE_LOGS_SCHEMA.md`
- Review query examples: `/supabase/queries/exercise-logs-examples.sql`
- Check TypeScript types: `/types/exercise-logs.ts`
- Review client helpers: `/utils/supabase/exercise-logs.ts`

---

**Migration Version:** 1.0
**Date:** 2025-01-04
**Author:** DailyHush Supabase Expert

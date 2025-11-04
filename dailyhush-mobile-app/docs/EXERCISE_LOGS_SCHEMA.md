# Exercise Logs Database Schema Documentation

## Overview

The `exercise_logs` system is a comprehensive database schema designed to track exercise completions, pre/post anxiety ratings, trigger patterns, user engagement, and long-term trends for the DailyHush mobile app.

**Key Features:**
- ✅ Privacy-first design (no journal content stored)
- ✅ Pre/post anxiety rating tracking
- ✅ Trigger pattern analysis
- ✅ Engagement metrics (completion, abandonment, skip rates)
- ✅ Streak calculations
- ✅ Performance optimized for 100k+ users
- ✅ Real-time analytics with materialized views
- ✅ Row Level Security (RLS) enabled

---

## Table of Contents

1. [Schema Overview](#schema-overview)
2. [Tables](#tables)
3. [Enums](#enums)
4. [Indexes](#indexes)
5. [Functions](#functions)
6. [RLS Policies](#rls-policies)
7. [Common Queries](#common-queries)
8. [Migration Guide](#migration-guide)
9. [TypeScript Integration](#typescript-integration)
10. [Performance Considerations](#performance-considerations)

---

## Schema Overview

### Tables Created

1. **`exercise_logs`** - Main table storing all exercise completions
2. **`exercise_triggers`** - Normalized trigger categories (reference data)
3. **`exercise_stats_by_user`** - Materialized view for fast analytics

### Enums Created

1. **`exercise_type`** - 6 exercise types (breathing, brain_dump, etc.)
2. **`completion_status`** - completed, abandoned, skipped
3. **`fire_module`** - Module context (focus, interrupt, reframe, execute, etc.)

---

## Tables

### 1. `exercise_logs`

**Purpose:** Track all exercise sessions with pre/post ratings, triggers, and engagement metrics.

**Key Columns:**

| Column | Type | Description |
|--------|------|-------------|
| `log_id` | UUID | Primary key |
| `user_id` | UUID | Foreign key to `user_profiles` |
| `exercise_type` | ENUM | Type of exercise (breathing, etc.) |
| `exercise_name` | TEXT | Human-readable name |
| `module_context` | ENUM | Which FIRE module led here |
| `completion_status` | ENUM | completed, abandoned, skipped |
| `started_at` | TIMESTAMPTZ | When exercise started |
| `completed_at` | TIMESTAMPTZ | When exercise completed (NULL if abandoned) |
| `duration_seconds` | INTEGER | Actual time spent |
| `pre_anxiety_rating` | INTEGER | Anxiety before (1-10) |
| `post_anxiety_rating` | INTEGER | Anxiety after (1-10) |
| `anxiety_reduction` | INTEGER | Auto-calculated (STORED) |
| `reduction_percentage` | INTEGER | Auto-calculated (STORED) |
| `trigger_text` | TEXT | Optional user-entered trigger |
| `trigger_category` | TEXT | Pre-defined trigger category |
| `abandoned_at_percentage` | INTEGER | If abandoned, at what % mark (0-100) |
| `skip_reason` | TEXT | If skipped, why? |
| `exercise_data` | JSONB | Exercise-specific data (flexible) |
| `is_deleted` | BOOLEAN | Soft delete flag |
| `deleted_at` | TIMESTAMPTZ | When deleted |

**Auto-Calculated Columns:**

```sql
-- Anxiety reduction (positive = improvement)
anxiety_reduction = pre_anxiety_rating - post_anxiety_rating

-- Reduction percentage
reduction_percentage = ((pre - post) / pre) * 100
```

**Privacy Features:**
- Journal content from "Brain Dump" exercises is NEVER stored
- Only word count is tracked
- Trigger text is optional
- Soft delete support for user privacy

---

### 2. `exercise_triggers`

**Purpose:** Pre-defined trigger categories for consistent analytics.

**Key Columns:**

| Column | Type | Description |
|--------|------|-------------|
| `trigger_id` | UUID | Primary key |
| `trigger_name` | TEXT | Display name |
| `trigger_category` | TEXT | Category grouping |
| `display_order` | INTEGER | Sort order |
| `loop_type` | TEXT | Which overthinking loop this relates to |
| `is_active` | BOOLEAN | Active/inactive |

**Pre-Seeded Triggers:**
- Work deadline stress
- Difficult conversation
- Can't make a decision
- Racing thoughts at night
- Health concern
- Financial worry
- Relationship conflict
- And more...

---

### 3. `exercise_stats_by_user` (Materialized View)

**Purpose:** Pre-computed statistics for fast dashboard queries.

**Refresh Schedule:** Every 6 hours via pg_cron (or manual refresh)

**Key Columns:**

| Column | Description |
|--------|-------------|
| `user_id` | User ID |
| `exercise_type` | Exercise type |
| `total_sessions` | Total attempts |
| `completed_count` | Completed exercises |
| `completion_rate` | Percentage completed |
| `avg_anxiety_reduction` | Average reduction |
| `avg_reduction_percentage` | Average % reduction |
| `completions_last_7_days` | Recent activity |
| `completions_last_30_days` | Monthly activity |

**Usage:**
```sql
-- Fast dashboard load
SELECT * FROM exercise_stats_by_user WHERE user_id = 'xxx';
```

**Refresh:**
```sql
-- Manual refresh
SELECT refresh_exercise_stats();
```

---

## Enums

### `exercise_type`

```sql
CREATE TYPE exercise_type AS ENUM (
  'breathing',           -- Breathing exercises
  'progressive_muscle',  -- Progressive muscle relaxation
  'brain_dump',          -- Free-form journaling (NO CONTENT STORED)
  'grounding',           -- 5-4-3-2-1 grounding
  'body_scan',           -- Body scan meditation
  'cognitive_reframe'    -- Cognitive reframing
);
```

### `completion_status`

```sql
CREATE TYPE completion_status AS ENUM (
  'completed',    -- User finished
  'abandoned',    -- User left mid-exercise
  'skipped'       -- User chose to skip
);
```

### `fire_module`

```sql
CREATE TYPE fire_module AS ENUM (
  'focus',      -- Module 1: FOCUS
  'interrupt',  -- Module 2: INTERRUPT
  'reframe',    -- Module 3: REFRAME
  'execute',    -- Module 4: EXECUTE
  'standalone', -- Not from training
  'ai_anna',    -- Recommended by Anna AI
  'suggestion'  -- From suggestion system
);
```

---

## Indexes

All indexes created for optimal performance:

### Primary Indexes

```sql
-- User's recent exercises (MOST COMMON QUERY)
CREATE INDEX idx_exercise_logs_user_completed
  ON exercise_logs(user_id, completed_at DESC NULLS LAST)
  WHERE is_deleted = FALSE;

-- Streak calculations (daily completions)
CREATE INDEX idx_exercise_logs_user_date
  ON exercise_logs(user_id, DATE(completed_at))
  WHERE completion_status = 'completed' AND is_deleted = FALSE;

-- Time-range queries
CREATE INDEX idx_exercise_logs_user_time_range
  ON exercise_logs(user_id, started_at, completion_status)
  WHERE is_deleted = FALSE;
```

### Analytics Indexes

```sql
-- Exercise type performance
CREATE INDEX idx_exercise_logs_type_completed
  ON exercise_logs(exercise_type, completion_status, completed_at)
  WHERE is_deleted = FALSE;

-- Module tracking
CREATE INDEX idx_exercise_logs_module
  ON exercise_logs(module_context, completion_status)
  WHERE is_deleted = FALSE;

-- Trigger analysis
CREATE INDEX idx_exercise_logs_trigger_category
  ON exercise_logs(trigger_category, exercise_type)
  WHERE trigger_category IS NOT NULL AND is_deleted = FALSE;
```

### JSONB Index

```sql
-- For exercise_data queries
CREATE INDEX idx_exercise_logs_data
  ON exercise_logs USING GIN (exercise_data)
  WHERE is_deleted = FALSE;
```

---

## Functions

### 1. `get_exercise_streak(user_id UUID)`

**Purpose:** Calculate current exercise streak (consecutive days).

**Returns:** INTEGER (number of days)

**Example:**
```sql
SELECT get_exercise_streak('user-id-here');
-- Returns: 5 (user has 5-day streak)
```

---

### 2. `get_most_effective_exercise(user_id UUID)`

**Purpose:** Find exercise type with highest anxiety reduction.

**Returns:** TEXT (exercise_type)

**Example:**
```sql
SELECT get_most_effective_exercise('user-id-here');
-- Returns: 'breathing'
```

---

### 3. `get_most_common_trigger(user_id UUID)`

**Purpose:** Find most frequently selected trigger category.

**Returns:** TEXT (trigger_category)

**Example:**
```sql
SELECT get_most_common_trigger('user-id-here');
-- Returns: 'work'
```

---

### 4. `refresh_exercise_stats()`

**Purpose:** Manually refresh the materialized view.

**Returns:** VOID

**Example:**
```sql
SELECT refresh_exercise_stats();
```

**Scheduled Refresh:**
```sql
-- Runs every 6 hours via pg_cron
SELECT cron.schedule(
  'refresh-exercise-stats',
  '0 */6 * * *',
  $$SELECT refresh_exercise_stats();$$
);
```

---

## RLS Policies

### Table: `exercise_logs`

**Enabled:** YES

**Policies:**

1. **SELECT** - Users can view their own logs
```sql
CREATE POLICY "Users can view their own exercise logs"
  ON exercise_logs FOR SELECT
  USING (auth.uid() = user_id);
```

2. **INSERT** - Users can create their own logs
```sql
CREATE POLICY "Users can insert their own exercise logs"
  ON exercise_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

3. **UPDATE** - Users can update their own logs
```sql
CREATE POLICY "Users can update their own exercise logs"
  ON exercise_logs FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

4. **SOFT DELETE** - Users can soft-delete their own logs
```sql
CREATE POLICY "Users can soft-delete their own exercise logs"
  ON exercise_logs FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id
    AND is_deleted = TRUE
    AND deleted_at IS NOT NULL
  );
```

---

### Table: `exercise_triggers`

**Enabled:** YES

**Policies:**

1. **SELECT** - Anyone can read active triggers
```sql
CREATE POLICY "Anyone can read exercise triggers"
  ON exercise_triggers FOR SELECT
  USING (is_active = TRUE);
```

2. **ALL** - Admins can manage triggers
```sql
CREATE POLICY "Admins can manage exercise triggers"
  ON exercise_triggers FOR ALL
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );
```

---

## Common Queries

### 1. Get User's Last 7 Days of Exercises

```sql
SELECT
  log_id,
  exercise_name,
  exercise_type,
  completed_at,
  ROUND(duration_seconds / 60.0, 1) as duration_minutes,
  anxiety_reduction,
  reduction_percentage,
  trigger_category
FROM exercise_logs
WHERE user_id = 'USER_ID'
  AND started_at >= CURRENT_DATE - INTERVAL '7 days'
  AND is_deleted = FALSE
ORDER BY started_at DESC;
```

---

### 2. Calculate Streak

```sql
SELECT get_exercise_streak('USER_ID') as current_streak;
```

---

### 3. Get Average Anxiety Reduction Per Exercise Type

```sql
SELECT
  exercise_type,
  COUNT(*) as total_sessions,
  ROUND(AVG(anxiety_reduction), 1) as avg_reduction,
  ROUND(AVG(reduction_percentage), 1) as avg_reduction_pct
FROM exercise_logs
WHERE user_id = 'USER_ID'
  AND completion_status = 'completed'
  AND is_deleted = FALSE
GROUP BY exercise_type
ORDER BY avg_reduction DESC;
```

---

### 4. Get Completion Rate Per Module

```sql
SELECT
  module_context,
  COUNT(*) as total_sessions,
  COUNT(*) FILTER (WHERE completion_status = 'completed') as completed,
  ROUND(
    (COUNT(*) FILTER (WHERE completion_status = 'completed')::NUMERIC / COUNT(*)) * 100,
    1
  ) as completion_rate
FROM exercise_logs
WHERE user_id = 'USER_ID'
  AND is_deleted = FALSE
GROUP BY module_context
ORDER BY completion_rate DESC;
```

---

### 5. Identify Most Common Triggers

```sql
SELECT
  trigger_category,
  COUNT(*) as count,
  ROUND(AVG(anxiety_reduction), 1) as avg_reduction
FROM exercise_logs
WHERE user_id = 'USER_ID'
  AND trigger_category IS NOT NULL
  AND is_deleted = FALSE
GROUP BY trigger_category
ORDER BY count DESC
LIMIT 5;
```

---

## Migration Guide

### Step 1: Run the Migration

```bash
# Using Supabase CLI
supabase db push

# Or apply migration file directly
supabase migration up
```

**Migration File:** `/supabase/migrations/20250104000000_create_exercise_logs.sql`

---

### Step 2: Verify Tables Created

```sql
-- Check tables
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name LIKE 'exercise%';

-- Expected output:
-- exercise_logs
-- exercise_triggers
-- exercise_stats_by_user
```

---

### Step 3: Verify RLS Policies

```sql
-- Check policies
SELECT tablename, policyname
FROM pg_policies
WHERE tablename LIKE 'exercise%';
```

---

### Step 4: Test Queries

```typescript
// In your app
import { ExerciseLogsAPI } from '@/utils/supabase/exercise-logs';

// Start exercise
const log = await ExerciseLogsAPI.startExercise(userId, {
  exercise_type: 'breathing',
  exercise_name: '4-7-8 Breathing',
  module_context: 'interrupt',
  pre_anxiety_rating: 8,
  trigger_category: 'work',
});

// Complete exercise
await ExerciseLogsAPI.completeExercise(log.log_id, {
  completion_status: 'completed',
  completed_at: new Date().toISOString(),
  duration_seconds: 300,
  post_anxiety_rating: 4,
});
```

---

## TypeScript Integration

### Import Types

```typescript
import type {
  ExerciseLog,
  ExerciseType,
  CompletionStatus,
  FireModule,
  ExerciseStats,
  StartExercisePayload,
  CompleteExercisePayload,
} from '@/types/exercise-logs';
```

### Example: Start Exercise

```typescript
const startExercise = async () => {
  const payload: StartExercisePayload = {
    exercise_type: 'breathing',
    exercise_name: '4-7-8 Breathing',
    module_context: 'interrupt',
    pre_anxiety_rating: 7,
    trigger_category: 'work',
    device_type: 'ios',
    app_version: '1.0.0',
  };

  const log = await ExerciseLogsAPI.startExercise(userId, payload);
  return log;
};
```

### Example: Complete Exercise

```typescript
const completeExercise = async (logId: string) => {
  const payload: CompleteExercisePayload = {
    completion_status: 'completed',
    completed_at: new Date().toISOString(),
    duration_seconds: 480,
    post_anxiety_rating: 3,
    exercise_data: {
      cycles_completed: 8,
      target_cycles: 8,
      technique: '4-7-8',
    },
  };

  const log = await ExerciseLogsAPI.completeExercise(logId, payload);
  return log;
};
```

### Example: Get Dashboard Stats

```typescript
const getDashboardStats = async () => {
  // Fast query using materialized view
  const stats = await ExerciseLogsAPI.getExerciseStats(userId);

  // Get streak
  const streak = await ExerciseLogsAPI.getExerciseStreak(userId);

  // Get most effective exercise
  const bestExercise = await ExerciseLogsAPI.getMostEffectiveExercise(userId);

  return { stats, streak, bestExercise };
};
```

---

## Performance Considerations

### For 100k+ Users

1. **Use Materialized Views** - For dashboard queries
   ```sql
   -- Fast (uses materialized view)
   SELECT * FROM exercise_stats_by_user WHERE user_id = 'xxx';

   -- Slow (calculates on-the-fly)
   SELECT AVG(anxiety_reduction) FROM exercise_logs WHERE user_id = 'xxx';
   ```

2. **Index Coverage** - All common queries use indexes
   - User + date queries: `idx_exercise_logs_user_completed`
   - Streak calculations: `idx_exercise_logs_user_date`
   - Analytics: `idx_exercise_logs_type_completed`

3. **Connection Pooling** - Use Supabase's built-in pooler
   ```typescript
   // Use connection pooler in production
   const supabase = createClient(
     process.env.SUPABASE_URL!,
     process.env.SUPABASE_ANON_KEY!,
     {
       db: {
         schema: 'public',
       },
       global: {
         headers: { 'x-my-custom-header': 'my-app' },
       },
     }
   );
   ```

4. **Batch Inserts** - If importing historical data
   ```typescript
   // Good: Batch insert
   await supabase.from('exercise_logs').insert(logsArray);

   // Bad: Individual inserts
   for (const log of logsArray) {
     await supabase.from('exercise_logs').insert(log);
   }
   ```

5. **Refresh Schedule** - Materialized view refreshes every 6 hours
   - For critical updates, call `refresh_exercise_stats()` manually
   - Consider CONCURRENTLY option for production

---

## Handling Existing `spiral_logs` Data

### Migration Strategy

The `spiral_logs` table already exists and tracks anxiety spiral interruptions. Here's how to integrate:

### Option 1: Keep Both Tables (Recommended)

- **`spiral_logs`**: Legacy table for existing spiral interrupt feature
- **`exercise_logs`**: New table for all 6 exercises

**Benefits:**
- No data migration needed
- No breaking changes
- Both systems coexist

**Future:** Gradually migrate `spiral_logs` data to `exercise_logs` as needed.

---

### Option 2: Migrate `spiral_logs` to `exercise_logs`

```sql
-- Example migration (run carefully!)
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
  created_at
)
SELECT
  user_id,
  'breathing'::exercise_type, -- Assume spiral technique was breathing
  technique_used,
  'interrupt'::fire_module,
  CASE WHEN interrupted THEN 'completed'::completion_status ELSE 'abandoned'::completion_status END,
  timestamp,
  CASE WHEN interrupted THEN timestamp + (duration_seconds || ' seconds')::INTERVAL ELSE NULL END,
  duration_seconds,
  pre_feeling,
  post_feeling,
  trigger,
  created_at
FROM spiral_logs
WHERE user_id = 'USER_ID'; -- Migrate per user
```

---

## Support & Troubleshooting

### Common Issues

**1. RLS Policy Errors**

If users can't see their logs:
```sql
-- Check RLS is enabled
SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'exercise_logs';

-- Verify policies
SELECT * FROM pg_policies WHERE tablename = 'exercise_logs';
```

**2. Materialized View Not Refreshing**

```sql
-- Manual refresh
SELECT refresh_exercise_stats();

-- Check last update
SELECT stats_updated_at FROM exercise_stats_by_user LIMIT 1;
```

**3. Index Not Being Used**

```sql
-- Check query plan
EXPLAIN ANALYZE
SELECT * FROM exercise_logs WHERE user_id = 'xxx' AND is_deleted = FALSE;

-- Should see: "Index Scan using idx_exercise_logs_user_completed"
```

---

## Next Steps

1. ✅ Run migration: `supabase db push`
2. ✅ Test RLS policies with authenticated user
3. ✅ Verify indexes are created
4. ✅ Import TypeScript types
5. ✅ Implement frontend components
6. ✅ Test real-time subscriptions
7. ✅ Set up materialized view refresh schedule
8. ✅ Monitor query performance

---

## Files Reference

| File | Description |
|------|-------------|
| `/supabase/migrations/20250104000000_create_exercise_logs.sql` | Complete migration file |
| `/types/exercise-logs.ts` | TypeScript type definitions |
| `/utils/supabase/exercise-logs.ts` | Supabase client helpers |
| `/supabase/queries/exercise-logs-examples.sql` | Common query examples |

---

**Documentation Version:** 1.0
**Last Updated:** 2025-01-04
**Maintained By:** DailyHush Supabase Expert

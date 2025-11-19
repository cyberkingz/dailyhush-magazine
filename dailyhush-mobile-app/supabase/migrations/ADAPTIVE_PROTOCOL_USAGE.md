# Adaptive Protocol System - Usage Guide

## Overview

The adaptive protocol system tracks which spiral interrupt techniques work best for each user, enabling personalized recommendations based on historical effectiveness.

## Migration File

**Location:** `/home/user/dailyhush-magazine/dailyhush-mobile-app/supabase/migrations/20251106_adaptive_protocols.sql`

## What This Migration Creates

### 1. `user_technique_stats` Table

Automatically tracks technique effectiveness metrics:

- **times_used**: How many times the user tried this technique
- **times_successful**: How many times it reduced anxiety by 2+ points
- **avg_reduction**: Running average of anxiety reduction (pre_feeling - post_feeling)
- **last_used_at**: When they last used this technique

### 2. Enhanced `spiral_logs` Table

New columns for protocol tracking:

- **technique_id**: Unique identifier (e.g., "breathing", "5-4-3-2-1")
- **technique_name**: Human-readable name
- **protocol_duration**: How long the protocol ran
- **selection_confidence**: AI confidence score (0.00-1.00)
- **selection_rationale**: Why this technique was selected
- **interactive_responses**: User responses during protocol (JSONB)

### 3. Automatic Stats Updates

A trigger automatically updates `user_technique_stats` whenever a new spiral log is inserted. No manual calculation needed!

### 4. Performance Indexes

Optimized for fast queries when selecting personalized techniques.

## Running the Migration

### Option 1: Via Supabase Dashboard

1. Go to Supabase Dashboard → SQL Editor
2. Copy contents of `20251106_adaptive_protocols.sql`
3. Click "Run"

### Option 2: Via Supabase CLI

```bash
cd dailyhush-mobile-app
supabase db push
```

### Option 3: Via Supabase MCP (if configured)

Use the MCP tools to execute the migration directly.

## App Integration Examples

### 1. Log a Spiral with Technique Tracking

```typescript
// When user completes a protocol
const { data, error } = await supabase.from('spiral_logs').insert({
  user_id: currentUser.id,
  timestamp: new Date().toISOString(),
  trigger: 'health concerns',
  duration_seconds: 180,
  interrupted: true,
  pre_feeling: 8,
  post_feeling: 4,

  // NEW: Protocol-specific fields
  technique_id: 'breathing-4-7-8',
  technique_name: '4-7-8 Breathing',
  protocol_duration: 60,
  selection_confidence: 0.85,
  selection_rationale: 'High success rate (78%) for health-related triggers',
  interactive_responses: {
    breaths_completed: 4,
    felt_calmer: true,
  },
});

// The trigger automatically updates user_technique_stats!
```

### 2. Get Personalized Technique Recommendations

```typescript
// Query to get user's most effective techniques
const { data: topTechniques } = await supabase
  .from('user_technique_stats')
  .select('*')
  .eq('user_id', currentUser.id)
  .gte('times_used', 3) // Require minimum sample size
  .order('avg_reduction', { ascending: false })
  .limit(5);

// Returns techniques sorted by effectiveness:
// [
//   { technique_id: 'breathing-4-7-8', avg_reduction: 3.5, times_successful: 8, times_used: 10 },
//   { technique_id: '5-4-3-2-1', avg_reduction: 2.8, times_successful: 5, times_used: 7 },
//   ...
// ]
```

### 3. Calculate Success Rate

```typescript
// Get technique success rate
const { data: stats } = await supabase
  .from('user_technique_stats')
  .select('technique_id, times_used, times_successful, avg_reduction')
  .eq('user_id', currentUser.id)
  .eq('technique_id', 'breathing-4-7-8')
  .single();

const successRate = stats.times_used > 0 ? (stats.times_successful / stats.times_used) * 100 : 0;

console.log(`Success rate: ${successRate.toFixed(1)}%`);
console.log(`Average reduction: ${stats.avg_reduction} points`);
```

### 4. Adaptive Selection Algorithm

```typescript
// Smart technique selection based on user history
async function selectTechnique(userId: string, trigger?: string) {
  // Get user's technique stats
  const { data: userStats } = await supabase
    .from('user_technique_stats')
    .select('*')
    .eq('user_id', userId)
    .gte('times_used', 2); // Minimum 2 uses

  if (!userStats || userStats.length === 0) {
    // New user: return default technique
    return {
      technique_id: 'breathing-box',
      confidence: 0.5,
      rationale: 'Default technique for new users',
    };
  }

  // Calculate weighted score for each technique
  const scored = userStats.map((stat) => {
    const successRate = stat.times_successful / stat.times_used;
    const recency = stat.last_used_at ? daysSince(stat.last_used_at) : 999;

    // Weight: 50% success rate, 30% avg reduction, 20% recency bonus
    const score =
      successRate * 0.5 + Math.min(stat.avg_reduction / 5, 1) * 0.3 + (recency > 7 ? 0.2 : 0); // Bonus if not used recently

    return { ...stat, score };
  });

  // Select best technique
  const best = scored.sort((a, b) => b.score - a.score)[0];

  return {
    technique_id: best.technique_id,
    confidence: Math.min(best.score, 0.95),
    rationale: `High success rate (${((best.times_successful / best.times_used) * 100).toFixed(0)}%) with ${best.avg_reduction.toFixed(1)} point average reduction`,
  };
}
```

### 5. Track Interactive Responses

```typescript
// For protocols like 5-4-3-2-1 grounding
const interactiveData = {
  things_seen: ['laptop', 'coffee mug', 'plant', 'window', 'phone'],
  things_touched: ['desk', 'keyboard', 'chair', 'pen'],
  things_heard: ['typing', 'traffic', 'birds'],
  things_smelled: ['coffee', 'fresh air'],
  things_tasted: ['mint'],
  completion_rate: 1.0, // Completed all steps
};

await supabase.from('spiral_logs').insert({
  // ... other fields
  technique_id: '5-4-3-2-1',
  interactive_responses: interactiveData,
});
```

## Useful Queries

### Get User's Technique Dashboard

```sql
SELECT
  technique_id,
  times_used,
  times_successful,
  ROUND((times_successful::NUMERIC / NULLIF(times_used, 0)) * 100, 1) as success_rate,
  avg_reduction,
  last_used_at
FROM user_technique_stats
WHERE user_id = 'user-uuid-here'
  AND times_used >= 2
ORDER BY avg_reduction DESC;
```

### Find Techniques User Hasn't Tried

```sql
-- Get all available techniques from logs
WITH available_techniques AS (
  SELECT DISTINCT technique_id
  FROM spiral_logs
  WHERE technique_id IS NOT NULL
),
user_tried AS (
  SELECT technique_id
  FROM user_technique_stats
  WHERE user_id = 'user-uuid-here'
)
SELECT at.technique_id
FROM available_techniques at
LEFT JOIN user_tried ut ON at.technique_id = ut.technique_id
WHERE ut.technique_id IS NULL;
```

### Analyze Technique Effectiveness Over Time

```sql
SELECT
  DATE_TRUNC('week', timestamp) as week,
  technique_id,
  COUNT(*) as uses,
  AVG(pre_feeling - post_feeling) as avg_reduction,
  COUNT(*) FILTER (WHERE (pre_feeling - post_feeling) >= 2) as successes
FROM spiral_logs
WHERE user_id = 'user-uuid-here'
  AND technique_id IS NOT NULL
  AND timestamp >= NOW() - INTERVAL '3 months'
GROUP BY week, technique_id
ORDER BY week DESC, avg_reduction DESC;
```

## Testing the Migration

### 1. Insert Test Data

```sql
-- Insert a test spiral log
INSERT INTO spiral_logs (
  user_id,
  pre_feeling,
  post_feeling,
  technique_id,
  technique_name,
  timestamp
) VALUES (
  '00000000-0000-0000-0000-000000000000', -- Replace with test user ID
  8,
  4,
  'breathing-box',
  'Box Breathing',
  NOW()
);
```

### 2. Verify Stats Were Created

```sql
SELECT * FROM user_technique_stats
WHERE user_id = '00000000-0000-0000-0000-000000000000'
  AND technique_id = 'breathing-box';
```

Expected result:

- times_used = 1
- times_successful = 1 (because 8-4 = 4, which is >= 2)
- avg_reduction = 4.00
- last_used_at = recent timestamp

### 3. Insert Another Log

```sql
INSERT INTO spiral_logs (
  user_id,
  pre_feeling,
  post_feeling,
  technique_id,
  timestamp
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  7,
  6,
  'breathing-box',
  NOW()
);
```

### 4. Verify Stats Updated

```sql
SELECT * FROM user_technique_stats
WHERE user_id = '00000000-0000-0000-0000-000000000000'
  AND technique_id = 'breathing-box';
```

Expected result:

- times_used = 2
- times_successful = 1 (second attempt only reduced by 1 point)
- avg_reduction = 2.50 (average of 4.00 and 1.00)
- updated_at = recent timestamp

## Success Criteria

A technique is considered "successful" if:

- Anxiety reduction >= 2 points
- Formula: `(pre_feeling - post_feeling) >= 2`

Examples:

- Pre: 8, Post: 6 → Reduction: 2 → **Successful** ✓
- Pre: 9, Post: 5 → Reduction: 4 → **Successful** ✓
- Pre: 7, Post: 6 → Reduction: 1 → Not successful ✗
- Pre: 6, Post: 7 → Reduction: -1 → Not successful ✗

## Best Practices

1. **Always include technique_id** when logging spirals to enable tracking
2. **Wait for minimum 3 uses** before heavily weighting a technique in recommendations
3. **Consider recency** - techniques not used recently might be worth trying again
4. **Explain AI decisions** - use selection_rationale for transparency
5. **Store interactive data** - helps improve future protocol design

## Rollback (if needed)

```sql
-- Drop in reverse order
DROP TRIGGER IF EXISTS trigger_update_technique_stats ON spiral_logs;
DROP FUNCTION IF EXISTS update_technique_stats();
DROP INDEX IF EXISTS idx_user_technique_stats_success_rate;
DROP INDEX IF EXISTS idx_spiral_logs_technique;
DROP INDEX IF EXISTS idx_user_technique_stats_last_used;
DROP INDEX IF EXISTS idx_user_technique_stats_lookup;

-- Remove added columns from spiral_logs
ALTER TABLE spiral_logs
  DROP COLUMN IF EXISTS technique_id,
  DROP COLUMN IF EXISTS technique_name,
  DROP COLUMN IF EXISTS protocol_duration,
  DROP COLUMN IF EXISTS selection_confidence,
  DROP COLUMN IF EXISTS selection_rationale,
  DROP COLUMN IF EXISTS interactive_responses;

-- Drop table
DROP TABLE IF EXISTS user_technique_stats;
```

## Questions or Issues?

If you encounter any problems with this migration:

1. Check Supabase logs in Dashboard → Database → Logs
2. Verify trigger is executing: `SELECT * FROM pg_trigger WHERE tgname = 'trigger_update_technique_stats';`
3. Test trigger function manually: Insert a test spiral_log and check user_technique_stats

---

**Migration Status:** Ready for deployment
**Last Updated:** 2025-11-06
**Version:** 1.0.0

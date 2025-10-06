# Apply Migration 005 - Manual Steps

Migration 005 needs to be applied manually through the Supabase SQL Editor.

## Steps:

1. **Open Supabase SQL Editor:**
   - Go to: https://supabase.com/dashboard/project/kisewkjogomsstgvqggc/sql/new

2. **Copy the migration SQL:**
   - File location: `supabase/migrations/005_create_quiz_analytics_tracking.sql`
   - Or run: `cat supabase/migrations/005_create_quiz_analytics_tracking.sql | pbcopy` (copies to clipboard)

3. **Paste and execute in SQL Editor**

4. **Verify tables were created:**
   ```sql
   SELECT tablename
   FROM pg_tables
   WHERE schemaname = 'public'
   AND tablename IN ('quiz_sessions', 'quiz_events')
   ORDER BY tablename;
   ```

   Should return:
   - quiz_events
   - quiz_sessions

## What this migration creates:

- ✅ `quiz_sessions` table - Track individual quiz attempts
- ✅ `quiz_events` table - Granular event tracking (page_view, quiz_start, question_view, etc.)
- ✅ Indexes for query performance
- ✅ Analytics views (quiz_funnel_analytics, quiz_question_performance, etc.)
- ✅ Helper functions (get_quiz_funnel, get_question_dropoff_rates)
- ✅ RLS policies for security

## After migration:

Run verification script:
```bash
node verify-tables.js
```

Should show:
```
✅ quiz_sessions table exists
✅ quiz_events table exists
```

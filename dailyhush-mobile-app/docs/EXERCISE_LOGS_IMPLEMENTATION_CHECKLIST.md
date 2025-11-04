# Exercise Logs Implementation Checklist

## ✅ Phase 1: Database Setup

### Migration
- [ ] Review migration file: `/supabase/migrations/20250104000000_create_exercise_logs.sql`
- [ ] Test on staging database first (CRITICAL)
- [ ] Run migration: `supabase db push`
- [ ] Verify no errors in migration output

### Verification
- [ ] Tables created (3): `exercise_logs`, `exercise_triggers`, `exercise_stats_by_user`
  ```sql
  SELECT table_name FROM information_schema.tables WHERE table_name LIKE 'exercise%';
  ```
- [ ] Enums created (3): `exercise_type`, `completion_status`, `fire_module`
  ```sql
  SELECT typname FROM pg_type WHERE typname IN ('exercise_type', 'completion_status', 'fire_module');
  ```
- [ ] Functions created (4): All helper functions exist
  ```sql
  SELECT routine_name FROM information_schema.routines WHERE routine_name LIKE '%exercise%';
  ```
- [ ] Indexes created (8+): All performance indexes exist
  ```sql
  SELECT indexname FROM pg_indexes WHERE tablename = 'exercise_logs';
  ```
- [ ] RLS policies created (6): All security policies active
  ```sql
  SELECT tablename, policyname FROM pg_policies WHERE tablename IN ('exercise_logs', 'exercise_triggers');
  ```

### Testing
- [ ] Insert test exercise log (as authenticated user)
- [ ] Verify RLS works (try accessing another user's logs - should fail)
- [ ] Test streak calculation: `SELECT get_exercise_streak('user-id');`
- [ ] Test stats query: `SELECT * FROM exercise_stats_by_user WHERE user_id = 'user-id';`
- [ ] Refresh materialized view: `SELECT refresh_exercise_stats();`

**Sign-off:** Database setup complete ✓

---

## ✅ Phase 2: TypeScript Integration

### Import Types
- [ ] Copy types file to project: `/types/exercise-logs.ts`
- [ ] Verify TypeScript compiles without errors
- [ ] Test type imports in a component
  ```typescript
  import type { ExerciseLog, ExerciseType } from '@/types/exercise-logs';
  ```

### Import Client Helpers
- [ ] Copy client file: `/utils/supabase/exercise-logs.ts`
- [ ] Update Supabase client import path if needed
- [ ] Test a simple query
  ```typescript
  import { ExerciseLogsAPI } from '@/utils/supabase/exercise-logs';
  const stats = await ExerciseLogsAPI.getExerciseStats(userId);
  ```

### Import Hooks
- [ ] Copy hooks file: `/hooks/useExerciseTracking.ts`
- [ ] Update import paths (userStore, supabase, types)
- [ ] Test hooks in a component
  ```typescript
  const { startExercise, completeExercise } = useExerciseTracking();
  ```

**Sign-off:** TypeScript integration complete ✓

---

## ✅ Phase 3: UI Implementation

### Create Exercise Components

#### 1. Breathing Exercise Screen
- [ ] Create screen: `app/exercises/breathing.tsx`
- [ ] Import `useExerciseTracking` hook
- [ ] Add pre-anxiety rating UI (1-10 scale)
- [ ] Add trigger selection UI
- [ ] Implement start exercise flow
- [ ] Add breathing animation/timer
- [ ] Add post-anxiety rating UI
- [ ] Implement complete exercise flow
- [ ] Test full flow: start → exercise → complete

#### 2. Brain Dump Screen
- [ ] Create screen: `app/exercises/brain-dump.tsx`
- [ ] Add text input (REMINDER: don't store content)
- [ ] Track word count only
- [ ] Add timer
- [ ] Implement exercise flow
- [ ] **CRITICAL:** Verify journal content NOT sent to database

#### 3. Grounding Exercise Screen
- [ ] Create screen: `app/exercises/grounding.tsx`
- [ ] Add 5-4-3-2-1 step-by-step UI
- [ ] Track items identified per sense
- [ ] Implement exercise flow

#### 4. Progressive Muscle Relaxation
- [ ] Create screen: `app/exercises/progressive-muscle.tsx`
- [ ] Add muscle group checklist
- [ ] Track completion per group
- [ ] Implement exercise flow

#### 5. Body Scan Screen
- [ ] Create screen: `app/exercises/body-scan.tsx`
- [ ] Add body scan guide
- [ ] Track tension areas (optional)
- [ ] Implement exercise flow

#### 6. Cognitive Reframe Screen
- [ ] Create screen: `app/exercises/cognitive-reframe.tsx`
- [ ] Add thought capture (don't store full text)
- [ ] Add reframe prompts
- [ ] Implement exercise flow

### Exercise Selection Screen
- [ ] Create screen: `app/exercises/index.tsx`
- [ ] Display all 6 exercise options
- [ ] Show "Recommended for you" based on stats
- [ ] Filter by loop type (sleep-loop, decision-loop, etc.)
- [ ] Navigate to specific exercise screens

**Sign-off:** Exercise UIs complete ✓

---

## ✅ Phase 4: Dashboard & Analytics

### Exercise History Screen
- [ ] Create screen: `app/history/exercises.tsx`
- [ ] Use `useExerciseHistory` hook
- [ ] Display last 20 exercises
- [ ] Show anxiety reduction for each
- [ ] Add filter by exercise type
- [ ] Add date range filter
- [ ] Pull to refresh

### Stats Dashboard
- [ ] Create screen: `app/dashboard/stats.tsx`
- [ ] Use `useExerciseStats` hook
- [ ] Display current streak (with 🔥 emoji)
- [ ] Show total exercises
- [ ] Show average anxiety reduction
- [ ] Display per-exercise stats (breakdown)
- [ ] Show "Most effective exercise"
- [ ] Show "Most common trigger"

### Pattern Insights Screen
- [ ] Create screen: `app/insights/patterns.tsx`
- [ ] Weekly trend chart (Chart.js or react-native-chart-kit)
- [ ] Trigger analysis visualization
- [ ] Time-of-day heatmap
- [ ] Completion rate by module
- [ ] Weekly comparison ("15% improvement this week!")

**Sign-off:** Dashboard complete ✓

---

## ✅ Phase 5: FIRE Training Integration

### Module Screens

#### Module 1: FOCUS
- [ ] Update screen: `app/training/focus.tsx`
- [ ] Add exercise recommendation
- [ ] Track which exercises completed from this module
- [ ] Update `fire_training_progress` when exercise completed

#### Module 2: INTERRUPT
- [ ] Update screen: `app/training/interrupt.tsx`
- [ ] Link to breathing/grounding exercises
- [ ] Track module_context: 'interrupt'
- [ ] Update progress tracking

#### Module 3: REFRAME
- [ ] Update screen: `app/training/reframe.tsx`
- [ ] Link to cognitive reframe exercise
- [ ] Track module_context: 'reframe'
- [ ] Update progress tracking

#### Module 4: EXECUTE
- [ ] Update screen: `app/training/execute.tsx`
- [ ] Link to all exercises
- [ ] Track module_context: 'execute'
- [ ] Update progress tracking

**Sign-off:** FIRE integration complete ✓

---

## ✅ Phase 6: Real-Time Features

### Real-Time Updates
- [ ] Implement dashboard auto-refresh
  ```typescript
  useExerciseSubscription((payload) => {
    // Refresh stats when exercise completed
    refetchStats();
  });
  ```
- [ ] Add loading states during refresh
- [ ] Test real-time updates work across screens
- [ ] Handle subscription cleanup on unmount

### Push Notifications (Optional)
- [ ] Set up notification system
- [ ] Trigger notification when streak about to break
- [ ] Trigger notification for weekly insights
- [ ] Test notifications work

**Sign-off:** Real-time features complete ✓

---

## ✅ Phase 7: Performance Optimization

### Materialized View Refresh
- [ ] Set up pg_cron (if Supabase Pro)
  ```sql
  SELECT cron.schedule('refresh-exercise-stats', '0 */6 * * *',
    $$SELECT refresh_exercise_stats();$$);
  ```
- [ ] OR: Set up manual refresh via scheduled task
- [ ] Verify stats update every 6 hours
- [ ] Monitor refresh performance (<30s)

### Query Performance
- [ ] Run EXPLAIN ANALYZE on dashboard queries
  ```sql
  EXPLAIN ANALYZE SELECT * FROM exercise_logs WHERE user_id = 'xxx';
  ```
- [ ] Verify all queries use indexes
- [ ] Dashboard loads in <500ms
- [ ] History list loads in <300ms

### Caching (Optional)
- [ ] Implement React Query for client-side caching
- [ ] Set stale time to 5 minutes for stats
- [ ] Invalidate cache after exercise completion

**Sign-off:** Performance optimized ✓

---

## ✅ Phase 8: Testing

### Unit Tests
- [ ] Test `ExerciseLogsAPI.startExercise()`
- [ ] Test `ExerciseLogsAPI.completeExercise()`
- [ ] Test `ExerciseLogsAPI.getExerciseStreak()`
- [ ] Test `ExerciseLogsAPI.getExerciseStats()`
- [ ] Test RLS policies (user can't access other user's data)

### Integration Tests
- [ ] Test complete exercise flow (start → complete)
- [ ] Test abandonment flow
- [ ] Test skip flow
- [ ] Test soft delete
- [ ] Test real-time updates

### E2E Tests
- [ ] User completes breathing exercise
- [ ] Verify stats update correctly
- [ ] Verify streak increments
- [ ] Verify history shows new exercise
- [ ] Test across multiple days for streak

### Performance Tests
- [ ] Load test with 1000 exercise logs
- [ ] Verify dashboard still loads quickly
- [ ] Test materialized view refresh time
- [ ] Monitor database CPU/memory

**Sign-off:** Testing complete ✓

---

## ✅ Phase 9: Data Migration (If Needed)

### Migrate Existing spiral_logs

**Only if you want to consolidate data:**

- [ ] Review migration script in `/docs/MIGRATION_NOTES.md`
- [ ] Test migration on staging database
- [ ] Verify row counts match
  ```sql
  SELECT COUNT(*) FROM spiral_logs;
  SELECT COUNT(*) FROM exercise_logs WHERE exercise_data ? 'legacy_spiral_id';
  ```
- [ ] Run migration on production (during low-traffic)
- [ ] Verify no data loss
- [ ] Keep `spiral_logs` table (don't delete)
- [ ] Update app to use `exercise_logs` for new spirals

**OR keep both tables (recommended):**
- [ ] Document that both tables exist
- [ ] Use `spiral_logs` for existing spiral feature
- [ ] Use `exercise_logs` for new 6 exercises

**Sign-off:** Data migration complete ✓

---

## ✅ Phase 10: Deployment

### Pre-Deployment
- [ ] All tests passing
- [ ] Code review complete
- [ ] Database migration tested on staging
- [ ] Performance benchmarks met
- [ ] Documentation updated

### Deployment
- [ ] Create database backup
  ```bash
  supabase db dump -f backup_before_exercise_logs.sql
  ```
- [ ] Deploy during low-traffic period
- [ ] Run migration on production
- [ ] Verify migration success
- [ ] Deploy app updates to stores (iOS/Android)

### Post-Deployment
- [ ] Monitor error logs (first 24 hours)
- [ ] Monitor database performance
- [ ] Monitor query execution times
- [ ] Check materialized view refreshing
- [ ] Verify real-time subscriptions working
- [ ] Monitor user feedback

### Rollback Plan (If Needed)
- [ ] Have rollback SQL script ready (in `/docs/MIGRATION_NOTES.md`)
- [ ] Test rollback on staging
- [ ] Document rollback procedure

**Sign-off:** Deployment complete ✓

---

## ✅ Phase 11: Monitoring & Maintenance

### Set Up Monitoring
- [ ] Database query performance dashboard
- [ ] Error tracking (Sentry/Bugsnag)
- [ ] User analytics (Mixpanel/Amplitude)
- [ ] Table size monitoring
- [ ] Materialized view refresh monitoring

### Regular Maintenance
- [ ] Weekly: Check query performance
- [ ] Weekly: Review error logs
- [ ] Monthly: Analyze table growth
- [ ] Monthly: Review and optimize slow queries
- [ ] Quarterly: Review RLS policies

### Analytics Tracking
- [ ] Track exercise completions
- [ ] Track abandonment rates
- [ ] Track most popular exercises
- [ ] Track average anxiety reduction
- [ ] Track user engagement

**Sign-off:** Monitoring active ✓

---

## 🎯 Success Metrics

Track these metrics to measure success:

- [ ] **Completion Rate:** >70% exercises completed (not abandoned)
- [ ] **Average Anxiety Reduction:** >30%
- [ ] **User Engagement:** >3 exercises per week (active users)
- [ ] **Dashboard Load Time:** <500ms
- [ ] **Query Performance:** All queries use indexes
- [ ] **Data Privacy:** No journal content stored, verified
- [ ] **Streak Retention:** >30% users with 7+ day streaks
- [ ] **User Satisfaction:** Positive feedback on exercise effectiveness

---

## 📊 Timeline Estimate

| Phase | Duration | Dependencies |
|-------|----------|--------------|
| 1. Database Setup | 1 day | None |
| 2. TypeScript Integration | 0.5 days | Phase 1 |
| 3. UI Implementation | 5 days | Phase 2 |
| 4. Dashboard & Analytics | 3 days | Phase 2 |
| 5. FIRE Integration | 2 days | Phase 3 |
| 6. Real-Time Features | 1 day | Phase 3 |
| 7. Performance Optimization | 1 day | Phase 3-4 |
| 8. Testing | 3 days | Phase 3-7 |
| 9. Data Migration (if needed) | 1 day | Phase 8 |
| 10. Deployment | 1 day | Phase 8-9 |
| 11. Monitoring Setup | 1 day | Phase 10 |

**Total Estimate:** 15-20 working days (3-4 weeks)

---

## 🆘 Support Resources

- **Documentation:** `/docs/EXERCISE_LOGS_SCHEMA.md`
- **Migration Guide:** `/docs/MIGRATION_NOTES.md`
- **Quick Reference:** `/docs/EXERCISE_LOGS_QUICK_REFERENCE.md`
- **Example Queries:** `/supabase/queries/exercise-logs-examples.sql`
- **Example Components:** `/components/examples/ExerciseTrackingExample.tsx`

---

## ✅ Final Sign-Off

- [ ] All phases complete
- [ ] All tests passing
- [ ] Production deployment successful
- [ ] Monitoring active
- [ ] Documentation complete
- [ ] Team trained on new system

**Project Lead:** _____________________ Date: _______

**Developer:** _____________________ Date: _______

**QA Lead:** _____________________ Date: _______

---

**Version:** 1.0
**Date:** 2025-01-04
**Maintained By:** DailyHush Team

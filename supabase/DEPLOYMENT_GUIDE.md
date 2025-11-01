# DailyHush Profile Page - Deployment Guide

## Pre-Deployment Checklist

### 1. Environment Setup

- [ ] Supabase project created
- [ ] Environment variables configured
  ```env
  VITE_SUPABASE_URL=https://your-project.supabase.co
  VITE_SUPABASE_ANON_KEY=your-anon-key
  SUPABASE_SERVICE_KEY=your-service-key (backend only)
  ```
- [ ] Supabase CLI installed
  ```bash
  npm install -g supabase
  supabase --version
  ```
- [ ] Git repository initialized
- [ ] Database backup strategy defined

---

## Migration Steps

### Step 1: Review Migration File

**File**: `20250101000000_profile_page_schema.sql`

**Review checklist**:
- [ ] All table names follow naming conventions
- [ ] Foreign keys have correct ON DELETE behavior
- [ ] Indexes cover common query patterns
- [ ] RLS policies are security-appropriate
- [ ] Triggers are necessary and efficient
- [ ] Sample data removed or updated for production

### Step 2: Test Locally

```bash
# Start local Supabase
supabase start

# Apply migration
supabase db reset

# Verify tables created
supabase db diff
```

**Verification queries**:

```sql
-- Check all tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Verify RLS enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
    AND rowsecurity = true;

-- Check indexes
SELECT tablename, indexname
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename;

-- Test functions
SELECT get_check_in_streak('test-user-id');
SELECT get_mood_trend('test-user-id', 7);
```

### Step 3: Generate TypeScript Types

```bash
# Local types
supabase gen types typescript --local > src/types/supabase.ts

# Remote types (after deployment)
supabase gen types typescript --project-id <your-project-id> > src/types/supabase.ts
```

**Verify types**:
- [ ] All tables have Row/Insert/Update types
- [ ] Enums match database enums
- [ ] Functions have proper signatures
- [ ] Views included in types

### Step 4: Test RLS Policies

```sql
-- Authenticate as test user
SET request.jwt.claims = '{"sub": "test-user-id"}';

-- Should only see own data
SELECT COUNT(*) FROM user_check_ins;
SELECT COUNT(*) FROM user_insights;
SELECT COUNT(*) FROM purchases;

-- Should see all active products
SELECT COUNT(*) FROM products WHERE is_active = TRUE;

-- Should NOT be able to insert into restricted tables
INSERT INTO user_insights (...) VALUES (...); -- Should fail

-- Reset
RESET request.jwt.claims;
```

### Step 5: Run Sample Queries

**File**: `SAMPLE_QUERIES.sql`

Test each query category:
- [ ] Check-ins queries work
- [ ] Insights queries work
- [ ] Product queries work
- [ ] Recommendations queries work
- [ ] Purchases queries work
- [ ] Newsletter engagement queries work
- [ ] Analytics views work

### Step 6: Performance Testing

```sql
-- Check query plans
EXPLAIN ANALYZE
SELECT *
FROM user_check_ins
WHERE user_id = 'test-user-id'
    AND check_in_date >= CURRENT_DATE - INTERVAL '30 days';

-- Verify index usage
SELECT
    schemaname,
    tablename,
    indexname,
    idx_scan
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
    AND idx_scan = 0  -- Unused indexes
ORDER BY tablename;
```

**Expected results**:
- Query plans use indexes (not Seq Scan)
- All critical indexes have idx_scan > 0
- Query execution time < 100ms for common queries

---

## Production Deployment

### Method 1: Supabase CLI (Recommended)

```bash
# Link to remote project
supabase link --project-ref <your-project-id>

# Push migration to production
supabase db push

# Verify deployment
supabase db remote commit
```

### Method 2: Supabase Dashboard

1. Navigate to: **Project → SQL Editor**
2. Click: **New query**
3. Copy contents of `20250101000000_profile_page_schema.sql`
4. Click: **Run**
5. Verify: No errors in output

### Method 3: Migration API

```bash
# Using Supabase Management API
curl -X POST https://api.supabase.com/v1/projects/<project-id>/database/migrations \
  -H "Authorization: Bearer <access-token>" \
  -H "Content-Type: application/json" \
  -d @20250101000000_profile_page_schema.sql
```

---

## Post-Deployment Verification

### 1. Database Verification

```sql
-- Count tables
SELECT COUNT(*) FROM information_schema.tables
WHERE table_schema = 'public'
    AND table_type = 'BASE TABLE';
-- Expected: 7 tables

-- Check RLS
SELECT COUNT(*) FROM pg_tables
WHERE schemaname = 'public'
    AND rowsecurity = true;
-- Expected: 7 tables

-- Check indexes
SELECT COUNT(*) FROM pg_indexes
WHERE schemaname = 'public';
-- Expected: 30+ indexes

-- Check triggers
SELECT COUNT(*) FROM information_schema.triggers
WHERE event_object_schema = 'public';
-- Expected: 10+ triggers

-- Check functions
SELECT COUNT(*) FROM pg_proc
WHERE proname IN ('get_check_in_streak', 'get_mood_trend', 'update_updated_at_column');
-- Expected: 3+ functions
```

### 2. RLS Policy Verification

```bash
# Use Supabase Dashboard
# Navigate to: Authentication → Policies
# Verify each table has appropriate policies
```

**Expected policies per table**:
- `user_check_ins`: 4 policies (SELECT, INSERT, UPDATE, DELETE)
- `user_insights`: 2 policies (SELECT, UPDATE)
- `products`: 1 policy (SELECT - public read)
- `product_recommendations`: 2 policies (SELECT, UPDATE)
- `purchases`: 2 policies (SELECT, INSERT)
- `newsletter_engagement`: 1 policy (SELECT)
- `product_reviews`: 4 policies (public SELECT approved, user CRUD own)

### 3. Test Data Insertion

```typescript
// Test creating a check-in
const { data, error } = await supabase
  .from('user_check_ins')
  .insert({
    user_id: testUserId,
    mood_rating: 4,
    emotional_weather: 'sunny',
    check_in_date: new Date().toISOString().split('T')[0],
  })

// Verify error handling
// Try duplicate check-in (should fail with code 23505)
```

### 4. Test RLS in Practice

```typescript
// Login as User A
const userA = await supabase.auth.signIn({ email: 'usera@test.com' })

// Insert check-in
await supabase.from('user_check_ins').insert({ mood_rating: 5, ... })

// Login as User B
const userB = await supabase.auth.signIn({ email: 'userb@test.com' })

// Try to access User A's data (should return empty)
const { data } = await supabase.from('user_check_ins').select('*')
// data should be empty or only contain User B's check-ins
```

---

## Data Seeding (Optional)

### Seed Sample Products

```sql
-- Insert sample products for testing
-- (Already included in migration, but can be customized)

INSERT INTO products (name, slug, description, short_description, product_type, loop_types, price_cents, image_url, is_active, is_featured)
VALUES
  (
    'Your Product Name',
    'your-product-slug',
    'Full description...',
    'Short description',
    'digital',
    ARRAY['people_pleasing']::loop_type[],
    1999, -- $19.99
    'https://your-image-url.com/product.jpg',
    TRUE,
    TRUE
  );
```

### Seed Test Users

```bash
# Create test users in Supabase Dashboard
# Navigate to: Authentication → Users → Add User
```

### Seed Test Data (Development Only)

```sql
-- Insert test check-ins
INSERT INTO user_check_ins (user_id, mood_rating, emotional_weather, check_in_date)
SELECT
  'test-user-id',
  (RANDOM() * 4 + 1)::INTEGER, -- Random 1-5
  CASE (RANDOM() * 4)::INTEGER
    WHEN 0 THEN 'sunny'
    WHEN 1 THEN 'cloudy'
    WHEN 2 THEN 'rainy'
    ELSE 'foggy'
  END,
  CURRENT_DATE - (n || ' days')::INTERVAL
FROM generate_series(1, 30) AS n;
```

---

## Integration Steps

### Frontend Integration

**1. Install Supabase Client**

```bash
npm install @supabase/supabase-js
```

**2. Configure Client**

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
```

**3. Test Connection**

```typescript
// Test query
const { data, error } = await supabase
  .from('products')
  .select('*')
  .limit(5)

console.log('Products:', data)
console.log('Error:', error)
```

### Backend Integration (Service Key)

**For server-side operations** (AI insights, recommendations):

```typescript
// backend/lib/supabase-admin.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY! // Service key, not anon key

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// Bypasses RLS - use with caution!
```

---

## Monitoring & Maintenance

### 1. Set Up Monitoring

**Supabase Dashboard**:
- Navigate to: **Database → Query Performance**
- Enable: **Slow query logging**
- Set threshold: `100ms`

**Alerts**:
- Set up email alerts for:
  - High error rates
  - Slow queries
  - Database size limits
  - Connection pool exhaustion

### 2. Regular Maintenance Tasks

**Daily**:
- [ ] Check error logs in Dashboard
- [ ] Monitor query performance
- [ ] Verify RLS policies active

**Weekly**:
```sql
-- Update statistics
ANALYZE user_check_ins;
ANALYZE purchases;
ANALYZE products;

-- Check for unused indexes
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
  AND idx_scan < 10
ORDER BY idx_scan;
```

**Monthly**:
```sql
-- Vacuum to reclaim space
VACUUM ANALYZE user_check_ins;
VACUUM ANALYZE purchases;

-- Check database size
SELECT
  pg_size_pretty(pg_database_size(current_database())) AS db_size;

-- Archive old data (if needed)
-- Example: Archive check-ins older than 1 year
INSERT INTO user_check_ins_archive
SELECT * FROM user_check_ins
WHERE check_in_date < CURRENT_DATE - INTERVAL '1 year';

DELETE FROM user_check_ins
WHERE check_in_date < CURRENT_DATE - INTERVAL '1 year';
```

### 3. Backup Strategy

**Automated Backups** (Supabase Pro):
- Daily backups enabled
- 7-day retention
- Point-in-time recovery available

**Manual Backups**:
```bash
# Export entire database
supabase db dump -f backup_$(date +%Y%m%d).sql

# Export specific tables
pg_dump -h db.your-project.supabase.co \
  -U postgres \
  -t user_check_ins \
  -t user_insights \
  > backup_user_data.sql
```

---

## Troubleshooting

### Issue: RLS Policies Not Working

**Symptoms**: Users can see other users' data

**Solutions**:
1. Verify RLS enabled:
   ```sql
   SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';
   ```
2. Check auth context:
   ```sql
   SELECT auth.uid(); -- Should return user ID
   ```
3. Test policy manually:
   ```sql
   SET request.jwt.claims = '{"sub": "test-user-id"}';
   SELECT * FROM user_check_ins; -- Should only see test user's data
   ```

### Issue: Slow Queries

**Symptoms**: Queries taking > 500ms

**Solutions**:
1. Check query plan:
   ```sql
   EXPLAIN ANALYZE SELECT ...;
   ```
2. Verify indexes used (not Seq Scan)
3. Add missing indexes
4. Consider materialized views for complex aggregations

### Issue: Foreign Key Violations

**Symptoms**: Error code `23503`

**Solutions**:
1. Verify referenced records exist:
   ```sql
   SELECT id FROM products WHERE id = 'product-id';
   ```
2. Use `.select()` to verify IDs before insert
3. Handle errors gracefully in frontend

### Issue: Unique Constraint Violations

**Symptoms**: Error code `23505`

**Solutions**:
1. Check for duplicate check-ins (same user, same date)
2. Use `.upsert()` instead of `.insert()` for idempotent operations
3. Handle duplicates gracefully:
   ```typescript
   if (error?.code === '23505') {
     toast.error('You already checked in today!')
   }
   ```

---

## Rollback Procedure

### If Migration Fails

**1. Rollback via CLI**:
```bash
supabase db reset
```

**2. Manual Rollback**:
```sql
-- Drop tables in reverse dependency order
DROP TABLE IF EXISTS product_reviews CASCADE;
DROP TABLE IF EXISTS newsletter_engagement CASCADE;
DROP TABLE IF EXISTS purchases CASCADE;
DROP TABLE IF EXISTS product_recommendations CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS user_insights CASCADE;
DROP TABLE IF EXISTS user_check_ins CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS get_check_in_streak;
DROP FUNCTION IF EXISTS get_mood_trend;
DROP FUNCTION IF EXISTS update_updated_at_column;

-- Drop enums
DROP TYPE IF EXISTS emotional_weather CASCADE;
DROP TYPE IF EXISTS product_type CASCADE;
DROP TYPE IF EXISTS loop_type CASCADE;
DROP TYPE IF EXISTS purchase_status CASCADE;
DROP TYPE IF EXISTS fulfillment_status CASCADE;
DROP TYPE IF EXISTS insight_category CASCADE;
DROP TYPE IF EXISTS insight_tier CASCADE;
```

**3. Restore from Backup**:
```bash
psql -h db.your-project.supabase.co \
  -U postgres \
  -d postgres \
  < backup_20250101.sql
```

---

## Performance Benchmarks

### Expected Query Times (Production)

| Query Type | Expected Time | Threshold |
|------------|---------------|-----------|
| User check-ins (30 days) | < 50ms | 100ms |
| Active insights | < 30ms | 80ms |
| Product catalog | < 100ms | 200ms |
| Purchase history | < 60ms | 120ms |
| Recommendations | < 80ms | 150ms |
| Analytics aggregations | < 200ms | 500ms |

### Database Size Estimates

| Table | Rows per User | Size per Row | Annual Size (10K users) |
|-------|---------------|--------------|-------------------------|
| user_check_ins | 365 | 200 bytes | 730 MB |
| user_insights | 52 | 500 bytes | 260 MB |
| purchases | 5 | 400 bytes | 20 MB |
| product_recommendations | 10 | 300 bytes | 30 MB |
| newsletter_engagement | 52 | 250 bytes | 130 MB |
| **Total** | | | **~1.2 GB/year** |

---

## Security Checklist

### Pre-Launch Security Audit

- [ ] All tables have RLS enabled
- [ ] Service key stored securely (backend only)
- [ ] Anon key used in frontend (safe to expose)
- [ ] User data isolated (cannot see other users)
- [ ] Product catalog publicly readable
- [ ] No sensitive data in client-side logs
- [ ] HTTPS enforced on all endpoints
- [ ] CORS configured correctly
- [ ] SQL injection prevention (parameterized queries)
- [ ] Input validation on all forms
- [ ] Rate limiting configured
- [ ] Audit logging enabled

### Compliance Checklist (GDPR)

- [ ] User data deletion flow implemented
- [ ] Data export functionality available
- [ ] Privacy policy updated
- [ ] Cookie consent implemented
- [ ] Data retention policy defined
- [ ] User consent tracked

---

## Next Steps After Deployment

1. **Monitor Performance**
   - Check slow query log daily
   - Review error rates
   - Monitor database size

2. **Optimize Queries**
   - Add indexes for common patterns
   - Create materialized views for analytics

3. **Set Up Alerts**
   - High error rates
   - Database size limits
   - Slow queries

4. **Document Custom Queries**
   - Add team-specific queries to SAMPLE_QUERIES.sql
   - Document complex business logic

5. **Plan Data Archiving**
   - Archive old check-ins (> 1 year)
   - Compress historical data

6. **Schedule Maintenance**
   - Weekly ANALYZE
   - Monthly VACUUM
   - Quarterly index review

---

## Support & Resources

- **Documentation**: See `SCHEMA_DOCUMENTATION.md`
- **Implementation Guide**: See `IMPLEMENTATION_GUIDE.md`
- **Sample Queries**: See `SAMPLE_QUERIES.sql`
- **Supabase Docs**: https://supabase.com/docs
- **PostgreSQL Docs**: https://www.postgresql.org/docs/

---

**Deployment Checklist Complete** ✅

Once all steps are verified, your DailyHush profile page database is ready for production!

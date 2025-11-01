# DailyHush Profile Page - Database Schema

A comprehensive Supabase database schema for DailyHush's profile page features, including emotional check-ins, AI-generated insights, product recommendations, and purchase tracking.

## 📁 Files Overview

| File | Description |
|------|-------------|
| **20250101000000_profile_page_schema.sql** | Complete migration file with tables, indexes, RLS, triggers |
| **SCHEMA_DOCUMENTATION.md** | Comprehensive schema documentation with ERD and best practices |
| **IMPLEMENTATION_GUIDE.md** | React/TypeScript integration guide with hooks and components |
| **SAMPLE_QUERIES.sql** | Common SQL queries for testing and development |
| **TABLE_RELATIONSHIPS.md** | Visual table relationship diagram |

## 🚀 Quick Start

### 1. Apply Migration

**Using Supabase CLI (Recommended):**

```bash
# Local development
supabase db reset

# Or push to remote
supabase db push
```

**Using Supabase Dashboard:**

1. Navigate to your project's SQL Editor
2. Copy contents of `20250101000000_profile_page_schema.sql`
3. Run the migration

### 2. Verify Installation

```sql
-- Check tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
    AND table_name IN (
        'user_check_ins',
        'user_insights',
        'products',
        'product_recommendations',
        'purchases',
        'newsletter_engagement',
        'product_reviews'
    );

-- Verify RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
    AND rowsecurity = true;
```

### 3. Generate TypeScript Types

```bash
supabase gen types typescript --local > src/types/supabase.ts
```

## 📊 Schema Overview

### Core Tables

1. **user_check_ins** - Daily emotional check-ins with mood tracking
2. **user_insights** - AI-generated personalized insights
3. **products** - Product catalog (digital/physical/subscription)
4. **product_recommendations** - Personalized product suggestions
5. **purchases** - Order history with Stripe integration
6. **newsletter_engagement** - Email open/click tracking
7. **product_reviews** - User reviews with moderation

### Key Features

✅ **Row Level Security (RLS)** - Privacy-first data access
✅ **Optimized Indexes** - Fast queries for time-series data
✅ **Auto-updated Timestamps** - Triggers for `updated_at`
✅ **Denormalized Stats** - Product ratings/sales auto-calculated
✅ **Custom Functions** - Streak tracking, mood trends
✅ **Materialized View** - User engagement summary

## 🔐 Security Model

### RLS Policies

- **User Data**: Users can only access their own check-ins, insights, purchases
- **Public Catalog**: Products table is publicly readable
- **Service Key Operations**: AI insights, recommendations managed server-side
- **Review Moderation**: Only approved reviews are publicly visible

### Best Practices

```typescript
// ✅ Always filter by user_id first (RLS enforces this)
const { data } = await supabase
    .from('user_check_ins')
    .select('*')
    .eq('user_id', userId)

// ❌ Avoid full table scans
const { data } = await supabase
    .from('user_check_ins')
    .select('*')
```

## 📈 Performance Optimization

### Indexes

- **User ID indexes** on all user-related tables
- **Partial indexes** for recent check-ins (last 90 days)
- **GIN indexes** for array fields (loop_types)
- **Composite indexes** for common query patterns

### Query Tips

1. **Use date ranges** to leverage partial indexes
2. **Select specific columns** instead of `SELECT *`
3. **Join efficiently** using PostgREST syntax
4. **Cache with React Query** for frequently accessed data

## 🛠️ Common Operations

### Create Daily Check-In

```typescript
const { data, error } = await supabase
    .from('user_check_ins')
    .insert({
        user_id: userId,
        mood_rating: 4,
        emotional_weather: 'sunny',
        notes: 'Feeling productive today!',
    })
```

### Get Active Recommendations

```typescript
const { data, error } = await supabase
    .from('product_recommendations')
    .select(`
        *,
        products (name, price_cents, image_url)
    `)
    .eq('user_id', userId)
    .eq('dismissed', false)
    .eq('purchased', false)
    .order('confidence_score', { ascending: false })
    .limit(3)
```

### Calculate Check-In Streak

```typescript
const { data, error } = await supabase.rpc('get_check_in_streak', {
    p_user_id: userId,
})
```

## 📚 Documentation

### Detailed Guides

- **[SCHEMA_DOCUMENTATION.md](./SCHEMA_DOCUMENTATION.md)** - Complete table reference, RLS policies, ERD
- **[IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)** - React hooks, components, error handling
- **[SAMPLE_QUERIES.sql](./SAMPLE_QUERIES.sql)** - SQL queries for common operations

### External Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [PostgREST API](https://postgrest.org/en/stable/)

## 🧪 Testing

### Verify RLS Policies

```sql
-- Should only return your own data
SELECT COUNT(*) FROM user_check_ins;
SELECT COUNT(*) FROM user_insights;
SELECT COUNT(*) FROM purchases;

-- Should return all active products
SELECT COUNT(*) FROM products WHERE is_active = TRUE;
```

### Test Functions

```sql
-- Get your check-in streak
SELECT get_check_in_streak(auth.uid());

-- Get mood trend (last 14 days)
SELECT get_mood_trend(auth.uid(), 14);
```

### Performance Testing

```sql
-- Analyze query performance
EXPLAIN ANALYZE
SELECT *
FROM user_check_ins
WHERE user_id = auth.uid()
    AND check_in_date >= CURRENT_DATE - INTERVAL '30 days';
```

## 🗂️ Schema Diagram

```
auth.users (Supabase Auth)
    │
    ├──< user_check_ins (Daily Check-Ins)
    │   └── Indexes: user_id, check_in_date, recent_check_ins
    │
    ├──< user_insights (AI Insights)
    │   └── Indexes: user_id, active_insights, category
    │
    ├──< purchases (Orders)
    │   │   └── Indexes: user_id, stripe_payment_intent_id
    │   ├──> products (Catalog)
    │   └──> product_recommendations (Attribution)
    │
    ├──< product_recommendations (Suggestions)
    │   │   └── Indexes: user_id, active_recs, clicked
    │   └──> products (Catalog)
    │
    ├──< newsletter_engagement (Email Tracking)
    │   └── Indexes: user_id, newsletter_date
    │
    └──< product_reviews (Feedback)
        │   └── Indexes: product_id, approved, rating
        └──> products (Catalog)

products (Catalog)
    └── Indexes: active_featured, loop_types (GIN), slug
```

## 📊 Data Flow

### Check-In Flow

```
User submits check-in
    → INSERT into user_check_ins
    → Trigger updates updated_at
    → AI service analyzes patterns (background)
    → INSERT into user_insights (if pattern detected)
```

### Purchase Flow

```
User clicks recommendation
    → UPDATE product_recommendations (clicked = true)
    → Stripe checkout
    → INSERT into purchases
    → Trigger updates product stats (total_sales)
    → Trigger updates recommendation (purchased = true)
```

### Insight Generation

```
Background job runs (daily/weekly)
    → Analyze user_check_ins
    → Calculate patterns, trends
    → INSERT into user_insights (via service key)
    → User sees new insights in app
```

## 🔄 Maintenance

### Regular Tasks

```sql
-- Update statistics (weekly)
ANALYZE user_check_ins;
ANALYZE purchases;

-- Vacuum tables (monthly)
VACUUM ANALYZE user_check_ins;

-- Archive old data (quarterly)
-- Move check-ins older than 1 year to archive table
```

### Monitoring

```sql
-- Check index usage
SELECT
    schemaname,
    tablename,
    indexname,
    idx_scan AS scans
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;

-- Identify slow queries
-- Use Supabase Dashboard > Database > Query Performance
```

## 🚨 Troubleshooting

### Common Issues

**Error: "duplicate key value violates unique constraint"**
- User already checked in today
- Handle with try/catch and show friendly message

**Error: "new row violates row-level security policy"**
- Ensure user is authenticated
- Verify user_id matches auth.uid()

**Slow queries**
- Use `EXPLAIN ANALYZE` to check query plan
- Ensure indexes are being used
- Consider adding partial indexes for common filters

## 📦 Sample Data

The migration includes sample products for testing:

- Breaking Free from People-Pleasing Workbook ($24.99)
- Perfectionism Reset Journal ($19.99)
- Control & Surrender Meditation Bundle ($14.99)
- Avoidance to Action Challenge ($9.99)
- DailyHush Premium Membership ($9.99/month)

**Remove sample data in production:**

```sql
DELETE FROM products WHERE name LIKE '%Workbook%';
-- Or keep and update with real products
```

## 🤝 Contributing

### Making Schema Changes

1. Create new migration file: `supabase migration new description`
2. Write SQL changes (tables, indexes, RLS)
3. Test locally: `supabase db reset`
4. Generate new types: `supabase gen types typescript`
5. Update documentation
6. Push to remote: `supabase db push`

### Naming Conventions

- **Tables**: `snake_case`, plural (e.g., `user_check_ins`)
- **Columns**: `snake_case` (e.g., `mood_rating`)
- **Indexes**: `idx_{table}_{columns}` (e.g., `idx_user_check_ins_user_date`)
- **Functions**: `verb_noun` (e.g., `get_check_in_streak`)
- **Enums**: `singular_case` (e.g., `emotional_weather`)

## 📄 License

This schema is part of the DailyHush platform. All rights reserved.

## 📞 Support

For schema questions or issues:

1. Check [SCHEMA_DOCUMENTATION.md](./SCHEMA_DOCUMENTATION.md)
2. Review [SAMPLE_QUERIES.sql](./SAMPLE_QUERIES.sql)
3. Test in Supabase SQL Editor
4. Check Supabase logs in Dashboard
5. Contact development team

---

**Version**: 1.0.0
**Migration**: 20250101000000
**Last Updated**: 2025-01-01
**Supabase Version**: PostgreSQL 15+

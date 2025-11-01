# DailyHush Profile Schema - Quick Reference Card

## 📋 Table Quick Reference

### user_check_ins
```sql
-- One check-in per user per day
PRIMARY KEY: id (UUID)
FOREIGN KEY: user_id → auth.users.id
UNIQUE: (user_id, check_in_date)
```
| Column | Type | Constraint |
|--------|------|------------|
| mood_rating | INTEGER | 1-5 scale |
| emotional_weather | ENUM | sunny/cloudy/rainy/foggy |
| check_in_date | DATE | One per day |

**Common Queries**:
```sql
-- Today's check-in
WHERE user_id = auth.uid() AND check_in_date = CURRENT_DATE

-- Last 30 days
WHERE user_id = auth.uid() AND check_in_date >= CURRENT_DATE - INTERVAL '30 days'
```

---

### user_insights
```sql
-- AI-generated insights
PRIMARY KEY: id (UUID)
FOREIGN KEY: user_id → auth.users.id
```
| Column | Type | Notes |
|--------|------|-------|
| category | ENUM | pattern/progress/recommendation/celebration |
| tier | ENUM | free/premium |
| confidence_score | DECIMAL(3,2) | 0.00 - 1.00 |
| is_dismissed | BOOLEAN | User dismissed? |
| valid_until | TIMESTAMPTZ | Expiration date |

**Common Queries**:
```sql
-- Active insights
WHERE user_id = auth.uid()
  AND is_dismissed = FALSE
  AND (valid_until IS NULL OR valid_until > NOW())
ORDER BY confidence_score DESC
```

---

### products
```sql
-- Product catalog (PUBLIC READ)
PRIMARY KEY: id (UUID)
UNIQUE: slug
```
| Column | Type | Notes |
|--------|------|-------|
| product_type | ENUM | digital/physical/subscription |
| loop_types | ARRAY | Empty = all loops |
| price_cents | INTEGER | Price in cents |
| is_active | BOOLEAN | Visible in catalog? |
| total_sales | INTEGER | Denormalized (auto-updated) |
| average_rating | DECIMAL(3,2) | Denormalized (auto-updated) |

**Common Queries**:
```sql
-- Active products
WHERE is_active = TRUE
ORDER BY is_featured DESC, average_rating DESC

-- For specific loop
WHERE is_active = TRUE
  AND ('people_pleasing' = ANY(loop_types) OR loop_types = '{}')
```

---

### product_recommendations
```sql
-- Personalized recommendations
PRIMARY KEY: id (UUID)
FOREIGN KEY: user_id → auth.users.id
FOREIGN KEY: product_id → products.id
UNIQUE: (user_id, product_id)
```
| Column | Type | Notes |
|--------|------|-------|
| confidence_score | DECIMAL(3,2) | 0.00 - 1.00 |
| times_shown | INTEGER | Impression tracking |
| clicked | BOOLEAN | User clicked? |
| purchased | BOOLEAN | Auto-updated via trigger |
| dismissed | BOOLEAN | User dismissed? |

**Common Queries**:
```sql
-- Active recommendations with products
SELECT pr.*, p.*
FROM product_recommendations pr
JOIN products p ON p.id = pr.product_id
WHERE pr.user_id = auth.uid()
  AND pr.dismissed = FALSE
  AND pr.purchased = FALSE
ORDER BY pr.confidence_score DESC
```

---

### purchases
```sql
-- Order history
PRIMARY KEY: id (UUID)
FOREIGN KEY: user_id → auth.users.id
FOREIGN KEY: product_id → products.id
FOREIGN KEY: recommendation_id → product_recommendations.id (OPTIONAL)
```
| Column | Type | Notes |
|--------|------|-------|
| purchase_status | ENUM | pending/processing/completed/failed/refunded |
| fulfillment_status | ENUM | pending/processing/shipped/delivered/cancelled |
| stripe_payment_intent_id | VARCHAR | Unique |
| recommendation_id | UUID | Attribution tracking |

**Common Queries**:
```sql
-- User's purchase history
SELECT pu.*, p.name AS product_name
FROM purchases pu
JOIN products p ON p.id = pu.product_id
WHERE pu.user_id = auth.uid()
ORDER BY pu.created_at DESC
```

---

## 🔐 RLS Policy Summary

| Table | User Can... | Service Key Required For... |
|-------|-------------|----------------------------|
| user_check_ins | SELECT/INSERT/UPDATE/DELETE own | - |
| user_insights | SELECT/UPDATE own | INSERT new insights |
| products | SELECT active products | INSERT/UPDATE/DELETE |
| product_recommendations | SELECT/UPDATE own | INSERT new recommendations |
| purchases | SELECT/INSERT own | UPDATE status |
| newsletter_engagement | SELECT own | INSERT/UPDATE engagement |
| product_reviews | SELECT approved + own, INSERT/UPDATE own | Moderate (UPDATE is_approved) |

---

## 🚀 Common Operations

### Create Daily Check-In
```typescript
const { data, error } = await supabase
  .from('user_check_ins')
  .insert({
    user_id: userId,
    mood_rating: 4,
    emotional_weather: 'sunny',
    notes: 'Feeling productive!',
  })

// Error code 23505 = duplicate (already checked in today)
```

### Get Check-In Streak
```typescript
const { data: streak } = await supabase.rpc('get_check_in_streak', {
  p_user_id: userId,
})
```

### Get Mood Trend
```typescript
const { data: trend } = await supabase.rpc('get_mood_trend', {
  p_user_id: userId,
  p_days: 14, // Last 14 days
})
// Returns: 'improving' | 'declining' | 'stable' | 'insufficient_data'
```

### Get Active Insights
```typescript
const { data } = await supabase
  .from('user_insights')
  .select('*')
  .eq('user_id', userId)
  .eq('tier', 'free')
  .eq('is_dismissed', false)
  .or('valid_until.is.null,valid_until.gt.' + new Date().toISOString())
  .order('confidence_score', { ascending: false })
  .limit(5)
```

### Dismiss Insight
```typescript
await supabase
  .from('user_insights')
  .update({
    is_dismissed: true,
    dismissed_at: new Date().toISOString(),
  })
  .eq('id', insightId)
  .eq('user_id', userId)
```

### Get Personalized Recommendations
```typescript
const { data } = await supabase
  .from('product_recommendations')
  .select(`
    *,
    products (
      name,
      slug,
      price_cents,
      image_url,
      average_rating
    )
  `)
  .eq('user_id', userId)
  .eq('dismissed', false)
  .eq('purchased', false)
  .order('confidence_score', { ascending: false })
  .limit(3)
```

### Track Recommendation Click
```typescript
await supabase
  .from('product_recommendations')
  .update({
    clicked: true,
    clicked_at: new Date().toISOString(),
  })
  .eq('id', recommendationId)
```

### Get Products for Loop Type
```typescript
const { data } = await supabase
  .from('products')
  .select('*')
  .eq('is_active', true)
  .or(`loop_types.cs.{${loopType}},loop_types.eq.{}`)
  .order('is_featured', { ascending: false })
```

### Create Purchase
```typescript
const { data } = await supabase
  .from('purchases')
  .insert({
    user_id: userId,
    product_id: productId,
    recommendation_id: recommendationId, // Optional attribution
    quantity: 1,
    unit_price_cents: 1999,
    total_price_cents: 1999,
    stripe_payment_intent_id: 'pi_xxx',
    purchase_status: 'completed',
  })

// Trigger automatically updates:
// - product_recommendations.purchased = true
// - products.total_sales += quantity
```

### Get User Engagement Summary
```typescript
const { data } = await supabase
  .from('user_engagement_summary')
  .select('*')
  .eq('user_id', userId)
  .single()

// Returns:
// - total_check_ins
// - check_ins_last_7_days
// - average_mood_rating
// - total_purchases
// - total_spent_cents
// - newsletters_opened
// - last_check_in_date
```

---

## 📊 Index Cheat Sheet

| Table | Index | Use Case |
|-------|-------|----------|
| user_check_ins | `idx_user_check_ins_user_date` | Get user's check-ins by date |
| user_check_ins | `idx_recent_check_ins` (partial) | Last 90 days (hot data) |
| user_insights | `idx_active_insights` (partial) | Non-dismissed, valid insights |
| products | `idx_products_active` | Active and featured products |
| products | `idx_products_loop_types` (GIN) | Filter by loop type array |
| product_recommendations | `idx_product_recs_active` | Non-dismissed, non-purchased |
| purchases | `idx_purchases_user_id` | User's order history |
| purchases | `idx_completed_purchases` (partial) | Completed orders only |

---

## ⚡ Performance Tips

### DO ✅
```typescript
// Filter by user_id first
.eq('user_id', userId)

// Use date ranges
.gte('check_in_date', '2025-01-01')

// Select specific columns
.select('id, mood_rating, check_in_date')

// Use joins for related data
.select('*, products (name, price_cents)')

// Batch operations
.insert([item1, item2, item3])
```

### DON'T ❌
```typescript
// Avoid SELECT * in production
.select('*')

// Don't filter without user_id
.gte('check_in_date', '2025-01-01') // No user filter!

// Don't loop inserts
for (const item of items) {
  await supabase.from('...').insert(item) // Use batch insert!
}

// Don't fetch all then filter in JS
const all = await supabase.from('...').select('*')
const filtered = all.filter(x => x.condition) // Filter in SQL!
```

---

## 🔧 Troubleshooting

### Error: RLS Policy Violation
```
Error code: PGRST301
```
**Solution**: User not authenticated or trying to access other user's data
```typescript
// Ensure user is logged in
const { data: { user } } = await supabase.auth.getUser()
if (!user) throw new Error('Not authenticated')

// Always filter by user_id
.eq('user_id', user.id)
```

### Error: Unique Constraint Violation
```
Error code: 23505
```
**Solution**: Duplicate check-in (already checked in today)
```typescript
try {
  await supabase.from('user_check_ins').insert({ ... })
} catch (error) {
  if (error.code === '23505') {
    toast.error('You already checked in today!')
  }
}
```

### Error: Foreign Key Violation
```
Error code: 23503
```
**Solution**: Referenced record doesn't exist
```typescript
// Verify product exists before purchase
const { data: product } = await supabase
  .from('products')
  .select('id')
  .eq('id', productId)
  .single()

if (!product) throw new Error('Product not found')
```

### Slow Queries
```sql
-- Check query plan
EXPLAIN ANALYZE SELECT ...;

-- Look for "Seq Scan" (bad) vs "Index Scan" (good)
-- If Seq Scan, add index or filter differently
```

---

## 📝 Environment Variables

```env
# Frontend (.env.local)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Backend (.env)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-key  # NEVER expose in frontend!
```

---

## 🎯 Quick Deployment

```bash
# 1. Apply migration
supabase db reset

# 2. Generate types
supabase gen types typescript --local > src/types/supabase.ts

# 3. Test RLS
# Run test queries in SQL Editor

# 4. Deploy to production
supabase db push
```

---

## 📚 Documentation Map

| File | When to Use |
|------|-------------|
| **README.md** | Quick start, overview |
| **SCHEMA_SUMMARY.md** | Executive summary, key decisions |
| **QUICK_REFERENCE.md** | This file - daily cheat sheet |
| **SCHEMA_DOCUMENTATION.md** | Deep dive into tables, RLS, indexes |
| **TABLE_RELATIONSHIPS.md** | Visual diagrams, data flow |
| **IMPLEMENTATION_GUIDE.md** | React hooks, TypeScript integration |
| **DEPLOYMENT_GUIDE.md** | Production deployment, rollback |
| **SAMPLE_QUERIES.sql** | SQL query examples |

---

## 🔑 Key Takeaways

1. **RLS is enabled** on all tables - users can only access their own data
2. **One check-in per day** - enforced by `UNIQUE(user_id, check_in_date)`
3. **Products are public** - anyone can view active products
4. **Triggers auto-update** product stats and recommendation.purchased
5. **Service key required** for AI insights and recommendation generation
6. **Always filter by user_id** for optimal index usage
7. **Use partial indexes** for hot data (recent check-ins, active insights)
8. **Attribution tracking** via recommendation_id on purchases

---

**Print this reference card for quick access during development!** 🚀

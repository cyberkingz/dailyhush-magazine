# DailyHush Profile Page - Table Relationships

## Visual Schema Diagrams

### Complete Schema Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     DailyHush Profile Database Schema                   │
│                         Privacy-First Architecture                       │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────┐
│      auth.users          │  ◄─── Supabase Auth (Built-in)
│   (Supabase Auth)        │
├──────────────────────────┤
│ PK  id (UUID)            │
│     email                │
│     created_at           │
└──────────┬───────────────┘
           │
           │ One-to-Many relationships
           │
           ├────────────────────────────────────────────────────────┐
           │                                                        │
           ▼                                                        ▼
┌────────────────────────┐                              ┌────────────────────────┐
│  user_check_ins        │                              │  user_insights         │
│  (Daily Check-Ins)     │                              │  (AI Insights)         │
├────────────────────────┤                              ├────────────────────────┤
│ PK  id                 │                              │ PK  id                 │
│ FK  user_id            │◄─────────────────────────────┤ FK  user_id            │
│     mood_rating (1-5)  │                              │     title              │
│     emotional_weather  │                              │     description        │
│     notes              │                              │     category           │
│ UK  check_in_date      │  Data drives insights        │     tier (free/premium)│
│     created_at         │─────────────────────────────►│     loop_type          │
└────────────────────────┘                              │     confidence_score   │
                                                        │     is_dismissed       │
     Indexes:                                           │     valid_until        │
     • idx_user_check_ins_user_id                      └────────────────────────┘
     • idx_user_check_ins_user_date
     • idx_recent_check_ins (partial)                       Indexes:
                                                            • idx_user_insights_user_id
                                                            • idx_active_insights (partial)
                                                            • idx_user_insights_category

           │
           │
           ▼
┌────────────────────────┐
│  newsletter_engagement │
│  (Email Tracking)      │
├────────────────────────┤
│ PK  id                 │
│ FK  user_id            │
│     newsletter_id      │
│ UK  newsletter_date    │
│     opened (bool)      │
│     open_count         │
│     clicked (bool)     │
│     click_count        │
│     clicked_urls []    │
└────────────────────────┘

     Indexes:
     • idx_newsletter_user_id
     • idx_newsletter_date
     • idx_newsletter_opened


┌──────────────────────────────────────────────────────────────────────────┐
│                         Product & Commerce Flow                           │
└──────────────────────────────────────────────────────────────────────────┘

                    ┌────────────────────────┐
                    │      products          │  ◄─── Public Catalog
                    │   (Product Catalog)    │
                    ├────────────────────────┤
                    │ PK  id                 │
                    │     name               │
                    │ UK  slug               │
                    │     description        │
                    │     product_type       │
                    │     loop_types []      │  ◄─── Array: GIN index
                    │     price_cents        │
                    │     stripe_product_id  │
                    │     image_url          │
                    │     is_active          │
                    │     is_featured        │
                    │     stock_quantity     │
                    │     total_sales        │  ◄─── Denormalized
                    │     average_rating     │  ◄─── Denormalized
                    └──────────┬─────────────┘
                               │
                               │ Referenced by multiple tables
                               │
            ┌──────────────────┼──────────────────┐
            │                  │                  │
            ▼                  ▼                  ▼
┌────────────────────────┐  ┌────────────────────────┐  ┌────────────────────────┐
│ product_recommendations│  │     purchases          │  │   product_reviews      │
│ (Personalized Recs)    │  │  (Order History)       │  │   (User Feedback)      │
├────────────────────────┤  ├────────────────────────┤  ├────────────────────────┤
│ PK  id                 │  │ PK  id                 │  │ PK  id                 │
│ FK  user_id            │  │ FK  user_id            │  │ FK  user_id            │
│ FK  product_id         │  │ FK  product_id         │  │ FK  product_id         │
│ UK  (user, product)    │  │ FK  recommendation_id  │◄─┤ FK  purchase_id        │
│     reason             │  │     quantity           │  │ UK  (user, product)    │
│     confidence_score   │  │     total_price_cents  │  │     rating (1-5)       │
│     times_shown        │  │     stripe_payment_id  │  │     title              │
│     clicked (bool)     │  │     purchase_status    │  │     review_text        │
│     purchased (bool)   │──┤     fulfillment_status │  │     is_approved        │
│     dismissed (bool)   │  │     tracking_number    │  │     is_featured        │
│     valid_until        │  │     created_at         │  └────────────────────────┘
└────────────────────────┘  └────────────────────────┘
                                                            Indexes:
     Indexes:                    Indexes:                   • idx_reviews_product_id
     • idx_product_recs_user_id  • idx_purchases_user_id    • idx_reviews_rating
     • idx_product_recs_active   • idx_purchases_stripe
     • idx_product_recs_clicked  • idx_completed_purchases
                                   (partial)

          Triggers:
          • Auto-update product.total_sales on purchase
          • Auto-update product.average_rating on review
          • Auto-update recommendation.purchased on purchase
```

---

## Detailed Relationship Mappings

### 1. auth.users → user_check_ins (One-to-Many)

**Relationship**: One user has many check-ins

```sql
-- Foreign Key
user_check_ins.user_id → auth.users.id (ON DELETE CASCADE)

-- Constraint
UNIQUE(user_id, check_in_date) -- One check-in per day per user
```

**Use Case**: Track daily emotional state over time

**Query Pattern**:
```sql
SELECT * FROM user_check_ins
WHERE user_id = auth.uid()
    AND check_in_date >= CURRENT_DATE - INTERVAL '30 days'
ORDER BY check_in_date DESC;
```

---

### 2. auth.users → user_insights (One-to-Many)

**Relationship**: One user has many insights

```sql
-- Foreign Key
user_insights.user_id → auth.users.id (ON DELETE CASCADE)
```

**Use Case**: AI-generated personalized insights based on user patterns

**Query Pattern**:
```sql
SELECT * FROM user_insights
WHERE user_id = auth.uid()
    AND is_dismissed = FALSE
    AND tier = 'free'
ORDER BY confidence_score DESC;
```

---

### 3. auth.users → product_recommendations (One-to-Many)

**Relationship**: One user has many recommendations

```sql
-- Foreign Key
product_recommendations.user_id → auth.users.id (ON DELETE CASCADE)

-- Constraint
UNIQUE(user_id, product_id) -- One recommendation per product per user
```

**Use Case**: Personalized product suggestions with engagement tracking

**Query Pattern**:
```sql
SELECT pr.*, p.*
FROM product_recommendations pr
JOIN products p ON p.id = pr.product_id
WHERE pr.user_id = auth.uid()
    AND pr.dismissed = FALSE
    AND pr.purchased = FALSE;
```

---

### 4. products → product_recommendations (One-to-Many)

**Relationship**: One product can be recommended to many users

```sql
-- Foreign Key
product_recommendations.product_id → products.id (ON DELETE CASCADE)
```

**Use Case**: Track which products are recommended to which users

**Query Pattern**:
```sql
-- Get most recommended products
SELECT p.name, COUNT(pr.id) AS recommendation_count
FROM products p
JOIN product_recommendations pr ON pr.product_id = p.id
GROUP BY p.id
ORDER BY recommendation_count DESC;
```

---

### 5. auth.users → purchases (One-to-Many)

**Relationship**: One user has many purchases

```sql
-- Foreign Key
purchases.user_id → auth.users.id (ON DELETE CASCADE)
```

**Use Case**: Order history and purchase tracking

**Query Pattern**:
```sql
SELECT pu.*, p.name AS product_name
FROM purchases pu
JOIN products p ON p.id = pu.product_id
WHERE pu.user_id = auth.uid()
ORDER BY pu.created_at DESC;
```

---

### 6. products → purchases (One-to-Many)

**Relationship**: One product can be purchased many times

```sql
-- Foreign Key
purchases.product_id → products.id (ON DELETE RESTRICT)
```

**Use Case**: Track sales and revenue per product

**Triggers**: Auto-updates `products.total_sales` on purchase

---

### 7. product_recommendations → purchases (One-to-One/None)

**Relationship**: One recommendation may lead to one purchase

```sql
-- Foreign Key
purchases.recommendation_id → product_recommendations.id (ON DELETE SET NULL)
```

**Use Case**: Attribution tracking - which recommendations convert to sales

**Triggers**: Auto-updates `product_recommendations.purchased = TRUE`

**Query Pattern**:
```sql
-- Get conversion rate by recommendation source
SELECT
    recommendation_source,
    COUNT(*) AS total,
    COUNT(*) FILTER (WHERE purchased = TRUE) AS converted
FROM product_recommendations
GROUP BY recommendation_source;
```

---

### 8. auth.users → product_reviews (One-to-Many)

**Relationship**: One user can write many reviews

```sql
-- Foreign Key
product_reviews.user_id → auth.users.id (ON DELETE CASCADE)

-- Constraint
UNIQUE(user_id, product_id) -- One review per product per user
```

**Use Case**: User feedback and social proof

---

### 9. products → product_reviews (One-to-Many)

**Relationship**: One product can have many reviews

```sql
-- Foreign Key
product_reviews.product_id → products.id (ON DELETE CASCADE)
```

**Use Case**: Product ratings and reviews

**Triggers**: Auto-updates `products.average_rating` and `products.total_reviews`

**Query Pattern**:
```sql
-- Get average rating for product
SELECT
    p.name,
    p.average_rating,
    p.total_reviews
FROM products p
WHERE p.id = '...';
```

---

### 10. purchases → product_reviews (One-to-One/None)

**Relationship**: One purchase may generate one review

```sql
-- Foreign Key
product_reviews.purchase_id → purchases.id (ON DELETE SET NULL)
```

**Use Case**: Verified purchase reviews

**Query Pattern**:
```sql
-- Get verified reviews
SELECT pr.*
FROM product_reviews pr
WHERE pr.purchase_id IS NOT NULL
    AND pr.is_approved = TRUE;
```

---

### 11. auth.users → newsletter_engagement (One-to-Many)

**Relationship**: One user has many newsletter interactions

```sql
-- Foreign Key
newsletter_engagement.user_id → auth.users.id (ON DELETE CASCADE)

-- Constraint
UNIQUE(user_id, newsletter_id) -- One record per newsletter per user
```

**Use Case**: Email engagement tracking and analytics

**Query Pattern**:
```sql
SELECT
    COUNT(*) FILTER (WHERE opened = TRUE) AS opened,
    COUNT(*) FILTER (WHERE clicked = TRUE) AS clicked
FROM newsletter_engagement
WHERE user_id = auth.uid();
```

---

## Data Flow Diagrams

### Check-In to Insight Flow

```
┌─────────────┐
│    User     │
└──────┬──────┘
       │
       │ Submits daily check-in
       │
       ▼
┌──────────────────────────┐
│   user_check_ins         │
│                          │
│   INSERT mood_rating,    │
│   emotional_weather      │
└──────────┬───────────────┘
           │
           │ Background AI job analyzes
           │ patterns (weekly)
           │
           ▼
┌──────────────────────────┐
│   Analyze patterns:      │
│   • Mood trends          │
│   • Emotional patterns   │
│   • Streak tracking      │
└──────────┬───────────────┘
           │
           │ If pattern detected
           │
           ▼
┌──────────────────────────┐
│   user_insights          │
│                          │
│   INSERT new insight     │
│   with confidence score  │
└──────────┬───────────────┘
           │
           │
           ▼
┌──────────────────────────┐
│   User sees insight      │
│   in profile dashboard   │
└──────────────────────────┘
```

### Recommendation to Purchase Flow

```
┌─────────────┐
│  AI Engine  │  (Background job)
└──────┬──────┘
       │
       │ Analyzes user patterns
       │
       ▼
┌──────────────────────────────┐
│  product_recommendations     │
│                              │
│  INSERT recommendation       │
│  based on loop_type,         │
│  check-in patterns           │
└──────────┬───────────────────┘
           │
           │ User views recommendation
           │
           ▼
┌──────────────────────────────┐
│  UPDATE times_shown,         │
│  first_shown_at              │
└──────────┬───────────────────┘
           │
           │ User clicks
           │
           ▼
┌──────────────────────────────┐
│  UPDATE clicked = TRUE,      │
│  clicked_at = NOW()          │
└──────────┬───────────────────┘
           │
           │ User purchases via Stripe
           │
           ▼
┌──────────────────────────────┐
│  purchases                   │
│                              │
│  INSERT with                 │
│  recommendation_id           │
└──────────┬───────────────────┘
           │
           │ Trigger fires
           │
           ├──────────────────────────┐
           │                          │
           ▼                          ▼
┌────────────────────┐    ┌────────────────────┐
│ UPDATE             │    │ UPDATE             │
│ recommendation     │    │ products           │
│ purchased = TRUE   │    │ total_sales++      │
└────────────────────┘    └────────────────────┘
```

### Purchase to Review Flow

```
┌──────────────────┐
│   purchases      │
│                  │
│   User buys      │
│   product        │
└────────┬─────────┘
         │
         │ After fulfillment
         │ (email prompt)
         │
         ▼
┌──────────────────────────┐
│  User writes review      │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│  product_reviews         │
│                          │
│  INSERT with             │
│  purchase_id (verified)  │
│  is_approved = FALSE     │
└────────┬─────────────────┘
         │
         │ Admin moderates
         │
         ▼
┌──────────────────────────┐
│  UPDATE                  │
│  is_approved = TRUE      │
└────────┬─────────────────┘
         │
         │ Trigger fires
         │
         ▼
┌──────────────────────────┐
│  UPDATE products         │
│  total_reviews++         │
│  average_rating          │
│  = AVG(all ratings)      │
└──────────────────────────┘
```

---

## Cascade Behaviors

### ON DELETE CASCADE (User Data)

When a user is deleted, **all their data is deleted**:

```sql
auth.users deleted
    → user_check_ins deleted
    → user_insights deleted
    → product_recommendations deleted
    → purchases deleted
    → newsletter_engagement deleted
    → product_reviews deleted
```

**Use Case**: GDPR compliance - right to be forgotten

### ON DELETE RESTRICT (Products)

Products **cannot be deleted** if they have purchases:

```sql
products.id referenced in purchases
    → DELETE products blocked
    → Must archive purchases first OR set is_active = FALSE
```

**Use Case**: Preserve order history integrity

### ON DELETE SET NULL (Optional References)

Optional relationships become NULL on delete:

```sql
product_recommendations deleted
    → purchases.recommendation_id = NULL
    → Purchase history preserved, attribution lost

purchases deleted
    → product_reviews.purchase_id = NULL
    → Review preserved, verification lost
```

**Use Case**: Preserve data while removing optional links

---

## Index Strategy by Table

### user_check_ins

```sql
-- Primary access pattern: user + date range
idx_user_check_ins_user_date (user_id, check_in_date DESC)

-- Hot data optimization: last 90 days
idx_recent_check_ins (user_id, check_in_date DESC)
    WHERE check_in_date >= CURRENT_DATE - INTERVAL '90 days'
```

### user_insights

```sql
-- Active insights: most common query
idx_active_insights (user_id, created_at DESC)
    WHERE is_dismissed = FALSE
    AND (valid_until IS NULL OR valid_until > NOW())

-- Category filtering
idx_user_insights_category (user_id, category)
```

### products

```sql
-- Public catalog browsing
idx_products_active (is_active, is_featured)

-- Loop type matching (array field)
idx_products_loop_types USING GIN(loop_types)

-- SEO-friendly URLs
idx_products_slug (slug)
```

### product_recommendations

```sql
-- Active recommendations per user
idx_product_recs_active (user_id, dismissed, valid_until)
    WHERE dismissed = FALSE

-- Analytics: conversion tracking
idx_product_recs_clicked (user_id, clicked)
idx_product_recs_purchased (purchased, purchased_at)
```

### purchases

```sql
-- User order history
idx_purchases_user_id (user_id, created_at DESC)

-- Stripe webhook processing
idx_purchases_stripe_payment (stripe_payment_intent_id)

-- Analytics: completed orders
idx_completed_purchases (product_id, created_at DESC)
    WHERE purchase_status = 'completed'
```

---

## Query Complexity Guide

### Simple Queries (Fast)

✅ Single table with user_id filter
✅ Use indexed columns
✅ Small result sets (<100 rows)

```sql
SELECT * FROM user_check_ins
WHERE user_id = auth.uid()
    AND check_in_date >= '2025-01-01';
```

### Medium Complexity (Moderate)

⚠️ Joins with indexed foreign keys
⚠️ Aggregations with GROUP BY
⚠️ Moderate result sets (100-1000 rows)

```sql
SELECT p.*, COUNT(pr.id) AS review_count
FROM products p
LEFT JOIN product_reviews pr ON pr.product_id = p.id
WHERE p.is_active = TRUE
GROUP BY p.id;
```

### Complex Queries (Slow - Optimize!)

❌ Multiple joins without indexes
❌ Full table scans
❌ Large aggregations without filters

```sql
-- Avoid: No user_id filter, full table scan
SELECT AVG(mood_rating) FROM user_check_ins;

-- Better: Filtered to user
SELECT AVG(mood_rating) FROM user_check_ins
WHERE user_id = auth.uid();
```

---

## Summary

### Key Relationships

1. **User-Centric**: Most tables link to `auth.users.id`
2. **Product Hub**: `products` table is referenced by recommendations, purchases, reviews
3. **Attribution Chain**: recommendation → purchase → review
4. **Data Integrity**: Cascading deletes for user data, restrictions for products
5. **Performance**: Strategic indexes for common query patterns

### Design Patterns

- **Privacy by Default**: RLS on all tables
- **Denormalization**: Product stats for performance
- **Soft Deletes**: `is_active`, `is_dismissed` flags
- **Time-Series**: Optimized for date range queries
- **Array Fields**: GIN indexes for `loop_types`
- **Auto-Triggers**: Maintain data consistency

This schema supports a scalable, privacy-first profile page with comprehensive tracking of user emotions, AI insights, product recommendations, and purchase behavior.

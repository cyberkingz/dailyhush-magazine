-- =====================================================
-- DailyHush Profile Page - Sample Queries
-- =====================================================
-- Common SQL queries for testing and development
-- =====================================================

-- =====================================================
-- CHECK-INS: Daily Emotional Tracking
-- =====================================================

-- Get user's recent check-ins (last 30 days)
SELECT
    check_in_date,
    mood_rating,
    emotional_weather,
    notes,
    created_at
FROM user_check_ins
WHERE user_id = auth.uid()
    AND check_in_date >= CURRENT_DATE - INTERVAL '30 days'
ORDER BY check_in_date DESC;

-- Calculate average mood by week
SELECT
    DATE_TRUNC('week', check_in_date) AS week_start,
    AVG(mood_rating) AS avg_mood,
    COUNT(*) AS check_in_count,
    MODE() WITHIN GROUP (ORDER BY emotional_weather) AS most_common_weather
FROM user_check_ins
WHERE user_id = auth.uid()
    AND check_in_date >= CURRENT_DATE - INTERVAL '90 days'
GROUP BY week_start
ORDER BY week_start DESC;

-- Get mood distribution (1-5 scale)
SELECT
    mood_rating,
    COUNT(*) AS count,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 1) AS percentage
FROM user_check_ins
WHERE user_id = auth.uid()
GROUP BY mood_rating
ORDER BY mood_rating;

-- Find emotional weather patterns by day of week
SELECT
    TO_CHAR(check_in_date, 'Day') AS day_of_week,
    EXTRACT(DOW FROM check_in_date) AS day_number,
    AVG(mood_rating) AS avg_mood,
    MODE() WITHIN GROUP (ORDER BY emotional_weather) AS typical_weather
FROM user_check_ins
WHERE user_id = auth.uid()
    AND check_in_date >= CURRENT_DATE - INTERVAL '90 days'
GROUP BY day_of_week, day_number
ORDER BY day_number;

-- Get current check-in streak
SELECT get_check_in_streak(auth.uid()) AS current_streak;

-- Get mood trend (last 14 days)
SELECT get_mood_trend(auth.uid(), 14) AS mood_trend;

-- Check if user checked in today
SELECT EXISTS (
    SELECT 1
    FROM user_check_ins
    WHERE user_id = auth.uid()
        AND check_in_date = CURRENT_DATE
) AS checked_in_today;

-- =====================================================
-- INSIGHTS: AI-Generated Patterns
-- =====================================================

-- Get active insights for user
SELECT
    id,
    title,
    description,
    category,
    tier,
    loop_type,
    confidence_score,
    based_on_data_points,
    created_at
FROM user_insights
WHERE user_id = auth.uid()
    AND is_dismissed = FALSE
    AND (valid_until IS NULL OR valid_until > NOW())
ORDER BY confidence_score DESC, created_at DESC
LIMIT 5;

-- Get insights by category
SELECT
    category,
    COUNT(*) AS total_insights,
    AVG(confidence_score) AS avg_confidence,
    COUNT(*) FILTER (WHERE is_read = TRUE) AS read_count
FROM user_insights
WHERE user_id = auth.uid()
    AND is_dismissed = FALSE
GROUP BY category
ORDER BY total_insights DESC;

-- Get high-confidence premium insights
SELECT
    title,
    description,
    confidence_score,
    loop_type,
    created_at
FROM user_insights
WHERE user_id = auth.uid()
    AND tier = 'premium'
    AND confidence_score >= 0.8
    AND is_dismissed = FALSE
    AND (valid_until IS NULL OR valid_until > NOW())
ORDER BY confidence_score DESC;

-- =====================================================
-- PRODUCTS: Catalog & Discovery
-- =====================================================

-- Get all active products
SELECT
    id,
    name,
    slug,
    short_description,
    product_type,
    loop_types,
    price_cents,
    image_url,
    is_featured,
    average_rating,
    total_reviews,
    total_sales
FROM products
WHERE is_active = TRUE
ORDER BY is_featured DESC, average_rating DESC NULLS LAST;

-- Get products for specific loop type
SELECT
    id,
    name,
    slug,
    short_description,
    price_cents,
    image_url,
    average_rating,
    total_reviews
FROM products
WHERE is_active = TRUE
    AND (
        loop_types = '{}' -- Universal products
        OR 'people_pleasing' = ANY(loop_types)
    )
ORDER BY is_featured DESC, average_rating DESC NULLS LAST;

-- Get digital products under $30
SELECT
    name,
    slug,
    price_cents / 100.0 AS price_dollars,
    short_description,
    average_rating
FROM products
WHERE is_active = TRUE
    AND product_type = 'digital'
    AND price_cents < 3000
ORDER BY average_rating DESC NULLS LAST;

-- Get best-selling products
SELECT
    name,
    slug,
    total_sales,
    price_cents / 100.0 AS price_dollars,
    average_rating,
    total_reviews
FROM products
WHERE is_active = TRUE
ORDER BY total_sales DESC
LIMIT 10;

-- Get highest-rated products (min 5 reviews)
SELECT
    name,
    slug,
    average_rating,
    total_reviews,
    price_cents / 100.0 AS price_dollars,
    short_description
FROM products
WHERE is_active = TRUE
    AND total_reviews >= 5
ORDER BY average_rating DESC, total_reviews DESC
LIMIT 10;

-- =====================================================
-- RECOMMENDATIONS: Personalized Suggestions
-- =====================================================

-- Get active recommendations for user
SELECT
    pr.id AS recommendation_id,
    pr.reason,
    pr.confidence_score,
    pr.recommendation_source,
    pr.times_shown,
    p.id AS product_id,
    p.name,
    p.slug,
    p.short_description,
    p.price_cents,
    p.image_url,
    p.average_rating,
    p.total_reviews
FROM product_recommendations pr
JOIN products p ON p.id = pr.product_id
WHERE pr.user_id = auth.uid()
    AND pr.dismissed = FALSE
    AND pr.purchased = FALSE
    AND (pr.valid_until IS NULL OR pr.valid_until > NOW())
    AND p.is_active = TRUE
ORDER BY pr.confidence_score DESC
LIMIT 3;

-- Get recommendation performance by source
SELECT
    recommendation_source,
    COUNT(*) AS total_recommendations,
    COUNT(*) FILTER (WHERE clicked = TRUE) AS click_count,
    COUNT(*) FILTER (WHERE purchased = TRUE) AS purchase_count,
    ROUND(COUNT(*) FILTER (WHERE clicked = TRUE) * 100.0 / COUNT(*), 1) AS click_rate,
    ROUND(COUNT(*) FILTER (WHERE purchased = TRUE) * 100.0 / COUNT(*), 1) AS conversion_rate
FROM product_recommendations
WHERE user_id = auth.uid()
GROUP BY recommendation_source
ORDER BY conversion_rate DESC;

-- =====================================================
-- PURCHASES: Order History
-- =====================================================

-- Get user's purchase history
SELECT
    pu.id,
    pu.created_at AS purchased_at,
    pu.quantity,
    pu.total_price_cents / 100.0 AS total_price_dollars,
    pu.purchase_status,
    pu.fulfillment_status,
    p.name AS product_name,
    p.slug AS product_slug,
    p.image_url AS product_image,
    p.product_type
FROM purchases pu
JOIN products p ON p.id = pu.product_id
WHERE pu.user_id = auth.uid()
ORDER BY pu.created_at DESC;

-- Get completed purchases with attribution
SELECT
    pu.created_at AS purchased_at,
    p.name AS product_name,
    pu.total_price_cents / 100.0 AS amount,
    pr.recommendation_source,
    CASE
        WHEN pr.id IS NOT NULL THEN 'From Recommendation'
        ELSE 'Direct Purchase'
    END AS attribution
FROM purchases pu
JOIN products p ON p.id = pu.product_id
LEFT JOIN product_recommendations pr ON pr.id = pu.recommendation_id
WHERE pu.user_id = auth.uid()
    AND pu.purchase_status = 'completed'
ORDER BY pu.created_at DESC;

-- Calculate total spent by user
SELECT
    COUNT(*) AS total_purchases,
    SUM(quantity) AS total_items,
    SUM(total_price_cents) / 100.0 AS total_spent_dollars,
    AVG(total_price_cents) / 100.0 AS avg_order_value_dollars
FROM purchases
WHERE user_id = auth.uid()
    AND purchase_status = 'completed';

-- Get purchases pending fulfillment
SELECT
    pu.id,
    pu.created_at,
    p.name AS product_name,
    pu.fulfillment_status,
    pu.tracking_number
FROM purchases pu
JOIN products p ON p.id = pu.product_id
WHERE pu.user_id = auth.uid()
    AND pu.purchase_status = 'completed'
    AND pu.fulfillment_status NOT IN ('delivered', 'cancelled')
ORDER BY pu.created_at DESC;

-- =====================================================
-- NEWSLETTER: Engagement Tracking
-- =====================================================

-- Get recent newsletter engagement
SELECT
    newsletter_date,
    newsletter_subject,
    opened,
    first_opened_at,
    open_count,
    clicked,
    click_count,
    clicked_urls
FROM newsletter_engagement
WHERE user_id = auth.uid()
ORDER BY newsletter_date DESC
LIMIT 10;

-- Calculate newsletter engagement rate
SELECT
    COUNT(*) AS total_newsletters_sent,
    COUNT(*) FILTER (WHERE opened = TRUE) AS opened_count,
    COUNT(*) FILTER (WHERE clicked = TRUE) AS clicked_count,
    ROUND(COUNT(*) FILTER (WHERE opened = TRUE) * 100.0 / COUNT(*), 1) AS open_rate,
    ROUND(COUNT(*) FILTER (WHERE clicked = TRUE) * 100.0 / COUNT(*), 1) AS click_rate
FROM newsletter_engagement
WHERE user_id = auth.uid();

-- Get most clicked URLs
SELECT
    UNNEST(clicked_urls) AS url,
    COUNT(*) AS click_count
FROM newsletter_engagement
WHERE user_id = auth.uid()
    AND clicked = TRUE
GROUP BY url
ORDER BY click_count DESC
LIMIT 10;

-- =====================================================
-- REVIEWS: Product Feedback
-- =====================================================

-- Get user's reviews
SELECT
    pr.created_at,
    pr.rating,
    pr.title,
    pr.review_text,
    pr.is_approved,
    pr.is_featured,
    p.name AS product_name
FROM product_reviews pr
JOIN products p ON p.id = pr.product_id
WHERE pr.user_id = auth.uid()
ORDER BY pr.created_at DESC;

-- Get approved reviews for a product
SELECT
    pr.rating,
    pr.title,
    pr.review_text,
    pr.created_at,
    pr.is_featured
FROM product_reviews pr
WHERE pr.product_id = '...' -- Replace with product ID
    AND pr.is_approved = TRUE
ORDER BY pr.is_featured DESC, pr.created_at DESC;

-- =====================================================
-- ANALYTICS: User Engagement Summary
-- =====================================================

-- Get comprehensive engagement summary
SELECT
    total_check_ins,
    check_ins_last_7_days,
    check_ins_last_30_days,
    average_mood_rating,
    avg_mood_last_7_days,
    total_purchases,
    total_spent_cents / 100.0 AS total_spent_dollars,
    newsletters_opened,
    newsletters_clicked,
    last_check_in_date,
    last_newsletter_open
FROM user_engagement_summary
WHERE user_id = auth.uid();

-- Get user journey timeline (last 30 days)
WITH timeline AS (
    SELECT
        check_in_date AS event_date,
        'check_in' AS event_type,
        mood_rating::TEXT AS event_detail
    FROM user_check_ins
    WHERE user_id = auth.uid()
        AND check_in_date >= CURRENT_DATE - INTERVAL '30 days'

    UNION ALL

    SELECT
        created_at::DATE AS event_date,
        'purchase' AS event_type,
        p.name AS event_detail
    FROM purchases pu
    JOIN products p ON p.id = pu.product_id
    WHERE pu.user_id = auth.uid()
        AND pu.created_at >= CURRENT_DATE - INTERVAL '30 days'

    UNION ALL

    SELECT
        newsletter_date AS event_date,
        'newsletter_' || CASE WHEN clicked THEN 'clicked' ELSE 'opened' END AS event_type,
        newsletter_subject AS event_detail
    FROM newsletter_engagement
    WHERE user_id = auth.uid()
        AND newsletter_date >= CURRENT_DATE - INTERVAL '30 days'
        AND (opened = TRUE OR clicked = TRUE)
)
SELECT
    event_date,
    event_type,
    event_detail
FROM timeline
ORDER BY event_date DESC, event_type;

-- =====================================================
-- ADMIN QUERIES: Product & User Management
-- =====================================================

-- Get product performance overview
SELECT
    p.name,
    p.slug,
    p.product_type,
    p.price_cents / 100.0 AS price_dollars,
    p.total_sales,
    p.total_sales * p.price_cents / 100.0 AS total_revenue_dollars,
    p.average_rating,
    p.total_reviews,
    COUNT(DISTINCT pr.user_id) AS unique_viewers,
    COUNT(DISTINCT pr.id) FILTER (WHERE pr.clicked = TRUE) AS clicks,
    COUNT(DISTINCT pu.id) AS purchases
FROM products p
LEFT JOIN product_recommendations pr ON pr.product_id = p.id
LEFT JOIN purchases pu ON pu.product_id = p.id AND pu.purchase_status = 'completed'
WHERE p.is_active = TRUE
GROUP BY p.id
ORDER BY total_revenue_dollars DESC;

-- Get users with most check-ins
SELECT
    user_id,
    COUNT(*) AS total_check_ins,
    MAX(check_in_date) AS last_check_in,
    get_check_in_streak(user_id) AS current_streak
FROM user_check_ins
WHERE check_in_date >= CURRENT_DATE - INTERVAL '90 days'
GROUP BY user_id
ORDER BY total_check_ins DESC
LIMIT 10;

-- Get users who haven't checked in recently (re-engagement candidates)
SELECT
    u.id AS user_id,
    u.email,
    MAX(c.check_in_date) AS last_check_in_date,
    COUNT(c.id) AS total_check_ins
FROM auth.users u
LEFT JOIN user_check_ins c ON c.user_id = u.id
GROUP BY u.id
HAVING MAX(c.check_in_date) < CURRENT_DATE - INTERVAL '7 days'
    OR MAX(c.check_in_date) IS NULL
ORDER BY last_check_in_date DESC NULLS LAST;

-- =====================================================
-- TESTING QUERIES: Data Validation
-- =====================================================

-- Verify RLS policies work (should only return user's own data)
SELECT COUNT(*) FROM user_check_ins; -- Should see only own check-ins
SELECT COUNT(*) FROM user_insights; -- Should see only own insights
SELECT COUNT(*) FROM purchases; -- Should see only own purchases

-- Test product visibility (should see all active products)
SELECT COUNT(*) FROM products WHERE is_active = TRUE;

-- Verify triggers work correctly
-- (After creating a purchase, check if product stats updated)
SELECT
    total_sales,
    average_rating,
    total_reviews
FROM products
WHERE id = '...'; -- Replace with product ID

-- Test functions
SELECT get_check_in_streak('...'); -- Replace with user ID
SELECT get_mood_trend('...', 7); -- Replace with user ID

-- =====================================================
-- PERFORMANCE TESTING: Index Usage
-- =====================================================

-- Explain query plan for common queries
EXPLAIN ANALYZE
SELECT *
FROM user_check_ins
WHERE user_id = auth.uid()
    AND check_in_date >= CURRENT_DATE - INTERVAL '30 days'
ORDER BY check_in_date DESC;

-- Check index usage
SELECT
    schemaname,
    tablename,
    indexname,
    idx_scan AS index_scans,
    idx_tup_read AS tuples_read,
    idx_tup_fetch AS tuples_fetched
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;

-- =====================================================
-- End of Sample Queries
-- =====================================================

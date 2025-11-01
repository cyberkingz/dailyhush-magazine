-- =====================================================
-- DailyHush Profile Page Schema Migration
-- =====================================================
-- This migration creates the complete database schema for:
-- - Emotional check-ins
-- - AI-generated insights
-- - Product catalog & recommendations
-- - Purchase tracking
-- - Newsletter engagement
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- ENUMS
-- =====================================================

-- Emotional weather types
CREATE TYPE emotional_weather AS ENUM ('sunny', 'cloudy', 'rainy', 'foggy');

-- Product types
CREATE TYPE product_type AS ENUM ('digital', 'physical', 'subscription');

-- Loop types (align with existing system)
-- Note: Using TEXT instead of ENUM to match existing user_profiles.loop_type
-- Valid values: 'sleep-loop', 'decision-loop', 'social-loop', 'perfectionism-loop'

-- Purchase/fulfillment status
CREATE TYPE purchase_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'refunded');
CREATE TYPE fulfillment_status AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled');

-- Insight categories
CREATE TYPE insight_category AS ENUM ('pattern', 'progress', 'recommendation', 'celebration');
CREATE TYPE insight_tier AS ENUM ('free', 'premium');

-- =====================================================
-- TABLE: user_check_ins
-- Daily emotional check-ins with mood tracking
-- =====================================================

CREATE TABLE user_check_ins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Check-in data
    mood_rating INTEGER NOT NULL CHECK (mood_rating >= 1 AND mood_rating <= 5),
    emotional_weather emotional_weather NOT NULL,
    notes TEXT,

    -- Context data
    check_in_date DATE NOT NULL DEFAULT CURRENT_DATE,

    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Ensure one check-in per user per day
    UNIQUE(user_id, check_in_date)
);

-- Indexes for user_check_ins
CREATE INDEX idx_user_check_ins_user_id ON user_check_ins(user_id);
CREATE INDEX idx_user_check_ins_date ON user_check_ins(check_in_date DESC);
CREATE INDEX idx_user_check_ins_user_date ON user_check_ins(user_id, check_in_date DESC);
CREATE INDEX idx_user_check_ins_mood ON user_check_ins(user_id, mood_rating);

-- Comments
COMMENT ON TABLE user_check_ins IS 'Daily emotional check-ins with mood and weather tracking';
COMMENT ON COLUMN user_check_ins.mood_rating IS 'Mood rating on 1-5 scale (1=worst, 5=best)';
COMMENT ON COLUMN user_check_ins.emotional_weather IS 'Visual emotional state: sunny, cloudy, rainy, foggy';
COMMENT ON COLUMN user_check_ins.check_in_date IS 'Date of check-in (one per day per user)';

-- =====================================================
-- TABLE: user_insights
-- AI-generated personalized insights
-- =====================================================

CREATE TABLE user_insights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Insight content
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category insight_category NOT NULL DEFAULT 'pattern',
    tier insight_tier NOT NULL DEFAULT 'free',

    -- Loop-specific targeting
    loop_type TEXT CHECK (loop_type IN ('sleep-loop', 'decision-loop', 'social-loop', 'perfectionism-loop')),

    -- AI confidence and metadata
    confidence_score DECIMAL(3, 2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
    based_on_data_points INTEGER, -- How many check-ins/interactions informed this

    -- User interaction
    is_dismissed BOOLEAN NOT NULL DEFAULT FALSE,
    dismissed_at TIMESTAMPTZ,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    read_at TIMESTAMPTZ,

    -- Validity period
    valid_from TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    valid_until TIMESTAMPTZ,

    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for user_insights
CREATE INDEX idx_user_insights_user_id ON user_insights(user_id);
CREATE INDEX idx_user_insights_active ON user_insights(user_id, is_dismissed, valid_until)
    WHERE is_dismissed = FALSE;
CREATE INDEX idx_user_insights_category ON user_insights(user_id, category);
CREATE INDEX idx_user_insights_loop_type ON user_insights(loop_type) WHERE loop_type IS NOT NULL;
CREATE INDEX idx_user_insights_tier ON user_insights(tier);

-- Comments
COMMENT ON TABLE user_insights IS 'AI-generated personalized insights based on user patterns';
COMMENT ON COLUMN user_insights.confidence_score IS 'AI confidence in insight accuracy (0-1)';
COMMENT ON COLUMN user_insights.tier IS 'Free insights available to all, premium for subscribers';

-- =====================================================
-- TABLE: products
-- Product catalog for digital and physical items
-- =====================================================

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Product details
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    short_description VARCHAR(500),

    -- Type and targeting
    product_type product_type NOT NULL,
    loop_types TEXT[] DEFAULT '{}', -- Array of applicable loop types (empty = all)

    -- Pricing
    price_cents INTEGER NOT NULL CHECK (price_cents >= 0),
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',

    -- Stripe integration
    stripe_product_id VARCHAR(255) UNIQUE,
    stripe_price_id VARCHAR(255),

    -- Media
    image_url TEXT,
    thumbnail_url TEXT,
    gallery_urls TEXT[] DEFAULT '{}',

    -- Status and visibility
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    stock_quantity INTEGER, -- NULL = unlimited/digital

    -- SEO and metadata
    meta_title VARCHAR(255),
    meta_description TEXT,
    tags TEXT[] DEFAULT '{}',

    -- Stats (denormalized for performance)
    total_sales INTEGER NOT NULL DEFAULT 0,
    total_reviews INTEGER NOT NULL DEFAULT 0,
    average_rating DECIMAL(3, 2) CHECK (average_rating >= 0 AND average_rating <= 5),

    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for products
CREATE INDEX idx_products_active ON products(is_active, is_featured);
CREATE INDEX idx_products_type ON products(product_type);
CREATE INDEX idx_products_loop_types ON products USING GIN(loop_types);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_price ON products(price_cents) WHERE is_active = TRUE;

-- Comments
COMMENT ON TABLE products IS 'Product catalog for digital and physical items';
COMMENT ON COLUMN products.loop_types IS 'Array of loop types this product helps with (empty = all loops)';
COMMENT ON COLUMN products.stock_quantity IS 'NULL for digital/unlimited products';

-- =====================================================
-- TABLE: product_recommendations
-- Personalized product recommendations per user
-- =====================================================

CREATE TABLE product_recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,

    -- Recommendation metadata
    reason TEXT, -- Why this product was recommended
    confidence_score DECIMAL(3, 2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
    recommendation_source VARCHAR(100), -- 'ai_insight', 'loop_match', 'trending', etc.

    -- User interaction tracking
    times_shown INTEGER NOT NULL DEFAULT 0,
    first_shown_at TIMESTAMPTZ,
    last_shown_at TIMESTAMPTZ,

    clicked BOOLEAN NOT NULL DEFAULT FALSE,
    clicked_at TIMESTAMPTZ,

    purchased BOOLEAN NOT NULL DEFAULT FALSE,
    purchased_at TIMESTAMPTZ,

    dismissed BOOLEAN NOT NULL DEFAULT FALSE,
    dismissed_at TIMESTAMPTZ,

    -- Validity
    valid_until TIMESTAMPTZ,

    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Prevent duplicate active recommendations
    UNIQUE(user_id, product_id)
);

-- Indexes for product_recommendations
CREATE INDEX idx_product_recs_user_id ON product_recommendations(user_id);
CREATE INDEX idx_product_recs_active ON product_recommendations(user_id, dismissed, valid_until)
    WHERE dismissed = FALSE;
CREATE INDEX idx_product_recs_clicked ON product_recommendations(user_id, clicked);
CREATE INDEX idx_product_recs_purchased ON product_recommendations(purchased, purchased_at);
CREATE INDEX idx_product_recs_source ON product_recommendations(recommendation_source);

-- Comments
COMMENT ON TABLE product_recommendations IS 'Personalized product recommendations with engagement tracking';
COMMENT ON COLUMN product_recommendations.times_shown IS 'Track impression frequency to avoid over-showing';

-- =====================================================
-- TABLE: purchases
-- Purchase history and order tracking
-- =====================================================

CREATE TABLE purchases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,

    -- Order details
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    unit_price_cents INTEGER NOT NULL,
    total_price_cents INTEGER NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',

    -- Stripe integration
    stripe_payment_intent_id VARCHAR(255) UNIQUE,
    stripe_charge_id VARCHAR(255),
    stripe_customer_id VARCHAR(255),

    -- Status tracking
    purchase_status purchase_status NOT NULL DEFAULT 'pending',
    fulfillment_status fulfillment_status NOT NULL DEFAULT 'pending',

    -- Shipping (for physical products)
    shipping_address JSONB, -- Flexible structure for address
    tracking_number VARCHAR(255),
    shipped_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,

    -- Refund tracking
    refunded_amount_cents INTEGER DEFAULT 0,
    refund_reason TEXT,
    refunded_at TIMESTAMPTZ,

    -- Attribution
    recommendation_id UUID REFERENCES product_recommendations(id) ON DELETE SET NULL,

    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for purchases
CREATE INDEX idx_purchases_user_id ON purchases(user_id, created_at DESC);
CREATE INDEX idx_purchases_product_id ON purchases(product_id);
CREATE INDEX idx_purchases_status ON purchases(purchase_status, fulfillment_status);
CREATE INDEX idx_purchases_stripe_payment ON purchases(stripe_payment_intent_id);
CREATE INDEX idx_purchases_recommendation ON purchases(recommendation_id) WHERE recommendation_id IS NOT NULL;

-- Comments
COMMENT ON TABLE purchases IS 'Purchase history with Stripe integration and fulfillment tracking';
COMMENT ON COLUMN purchases.shipping_address IS 'JSONB field for flexible address storage';
COMMENT ON COLUMN purchases.recommendation_id IS 'Link to recommendation that led to purchase';

-- =====================================================
-- TABLE: newsletter_engagement
-- Track newsletter opens, clicks, and engagement
-- =====================================================

CREATE TABLE newsletter_engagement (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Newsletter identification
    newsletter_id VARCHAR(255) NOT NULL, -- External newsletter system ID
    newsletter_date DATE NOT NULL,
    newsletter_subject VARCHAR(500),

    -- Engagement tracking
    sent_at TIMESTAMPTZ NOT NULL,
    opened BOOLEAN NOT NULL DEFAULT FALSE,
    first_opened_at TIMESTAMPTZ,
    open_count INTEGER NOT NULL DEFAULT 0,

    clicked BOOLEAN NOT NULL DEFAULT FALSE,
    first_clicked_at TIMESTAMPTZ,
    click_count INTEGER NOT NULL DEFAULT 0,
    clicked_urls TEXT[] DEFAULT '{}',

    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Prevent duplicate entries
    UNIQUE(user_id, newsletter_id)
);

-- Indexes for newsletter_engagement
CREATE INDEX idx_newsletter_user_id ON newsletter_engagement(user_id, newsletter_date DESC);
CREATE INDEX idx_newsletter_opened ON newsletter_engagement(opened, first_opened_at);
CREATE INDEX idx_newsletter_clicked ON newsletter_engagement(clicked, first_clicked_at);
CREATE INDEX idx_newsletter_date ON newsletter_engagement(newsletter_date DESC);

-- Comments
COMMENT ON TABLE newsletter_engagement IS 'Track newsletter opens, clicks, and engagement patterns';
COMMENT ON COLUMN newsletter_engagement.open_count IS 'Track multiple opens for engagement scoring';

-- =====================================================
-- TABLE: product_reviews (Bonus - for future use)
-- =====================================================

CREATE TABLE product_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    purchase_id UUID REFERENCES purchases(id) ON DELETE SET NULL,

    -- Review content
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    review_text TEXT NOT NULL,

    -- Moderation
    is_approved BOOLEAN NOT NULL DEFAULT FALSE,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    moderated_at TIMESTAMPTZ,

    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- One review per user per product
    UNIQUE(user_id, product_id)
);

-- Indexes for product_reviews
CREATE INDEX idx_reviews_product_id ON product_reviews(product_id, is_approved);
CREATE INDEX idx_reviews_user_id ON product_reviews(user_id);
CREATE INDEX idx_reviews_rating ON product_reviews(rating);

-- Comments
COMMENT ON TABLE product_reviews IS 'Product reviews linked to verified purchases';

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE user_check_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_engagement ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES: user_check_ins
-- =====================================================

-- Users can view their own check-ins
CREATE POLICY "Users can view own check-ins"
    ON user_check_ins FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own check-ins
CREATE POLICY "Users can insert own check-ins"
    ON user_check_ins FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own check-ins
CREATE POLICY "Users can update own check-ins"
    ON user_check_ins FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Users can delete their own check-ins
CREATE POLICY "Users can delete own check-ins"
    ON user_check_ins FOR DELETE
    USING (auth.uid() = user_id);

-- =====================================================
-- RLS POLICIES: user_insights
-- =====================================================

-- Users can view their own insights
CREATE POLICY "Users can view own insights"
    ON user_insights FOR SELECT
    USING (auth.uid() = user_id);

-- Users can update their own insights (dismiss, mark read)
CREATE POLICY "Users can update own insights"
    ON user_insights FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Service role can insert insights (AI generation)
-- Note: Actual insert will be done via service key, not RLS

-- =====================================================
-- RLS POLICIES: products
-- =====================================================

-- Everyone can view active products (public catalog)
CREATE POLICY "Anyone can view active products"
    ON products FOR SELECT
    USING (is_active = TRUE);

-- Service role manages products (via service key)
-- No public insert/update/delete policies

-- =====================================================
-- RLS POLICIES: product_recommendations
-- =====================================================

-- Users can view their own recommendations
CREATE POLICY "Users can view own recommendations"
    ON product_recommendations FOR SELECT
    USING (auth.uid() = user_id);

-- Users can update their own recommendations (click, dismiss tracking)
CREATE POLICY "Users can update own recommendations"
    ON product_recommendations FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- RLS POLICIES: purchases
-- =====================================================

-- Users can view their own purchases
CREATE POLICY "Users can view own purchases"
    ON purchases FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own purchases (via checkout flow)
CREATE POLICY "Users can insert own purchases"
    ON purchases FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- RLS POLICIES: newsletter_engagement
-- =====================================================

-- Users can view their own newsletter engagement
CREATE POLICY "Users can view own newsletter engagement"
    ON newsletter_engagement FOR SELECT
    USING (auth.uid() = user_id);

-- Service role manages engagement tracking (via service key)

-- =====================================================
-- RLS POLICIES: product_reviews
-- =====================================================

-- Everyone can view approved reviews
CREATE POLICY "Anyone can view approved reviews"
    ON product_reviews FOR SELECT
    USING (is_approved = TRUE);

-- Users can view their own reviews (even if not approved)
CREATE POLICY "Users can view own reviews"
    ON product_reviews FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own reviews
CREATE POLICY "Users can insert own reviews"
    ON product_reviews FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own reviews
CREATE POLICY "Users can update own reviews"
    ON product_reviews FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- TRIGGERS: updated_at automation
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables
CREATE TRIGGER update_user_check_ins_updated_at
    BEFORE UPDATE ON user_check_ins
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_insights_updated_at
    BEFORE UPDATE ON user_insights
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_recommendations_updated_at
    BEFORE UPDATE ON product_recommendations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_purchases_updated_at
    BEFORE UPDATE ON purchases
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_newsletter_engagement_updated_at
    BEFORE UPDATE ON newsletter_engagement
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_reviews_updated_at
    BEFORE UPDATE ON product_reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TRIGGERS: Recommendation purchase tracking
-- =====================================================

-- Auto-update recommendation when purchase occurs
CREATE OR REPLACE FUNCTION update_recommendation_on_purchase()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.recommendation_id IS NOT NULL THEN
        UPDATE product_recommendations
        SET
            purchased = TRUE,
            purchased_at = NEW.created_at,
            updated_at = NOW()
        WHERE id = NEW.recommendation_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER track_recommendation_purchase
    AFTER INSERT ON purchases
    FOR EACH ROW
    WHEN (NEW.recommendation_id IS NOT NULL)
    EXECUTE FUNCTION update_recommendation_on_purchase();

-- =====================================================
-- TRIGGERS: Product stats updates
-- =====================================================

-- Update product stats on purchase
CREATE OR REPLACE FUNCTION update_product_sales_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.purchase_status = 'completed' THEN
        UPDATE products
        SET total_sales = total_sales + NEW.quantity
        WHERE id = NEW.product_id;
    ELSIF TG_OP = 'UPDATE' AND OLD.purchase_status != 'completed' AND NEW.purchase_status = 'completed' THEN
        UPDATE products
        SET total_sales = total_sales + NEW.quantity
        WHERE id = NEW.product_id;
    ELSIF TG_OP = 'UPDATE' AND OLD.purchase_status = 'completed' AND NEW.purchase_status = 'refunded' THEN
        UPDATE products
        SET total_sales = GREATEST(0, total_sales - OLD.quantity)
        WHERE id = OLD.product_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_product_stats_on_purchase
    AFTER INSERT OR UPDATE ON purchases
    FOR EACH ROW
    EXECUTE FUNCTION update_product_sales_stats();

-- Update product rating stats on review
CREATE OR REPLACE FUNCTION update_product_rating_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.is_approved = TRUE THEN
        UPDATE products
        SET
            total_reviews = total_reviews + 1,
            average_rating = (
                SELECT AVG(rating)::DECIMAL(3,2)
                FROM product_reviews
                WHERE product_id = NEW.product_id AND is_approved = TRUE
            )
        WHERE id = NEW.product_id;
    ELSIF TG_OP = 'UPDATE' AND OLD.is_approved = FALSE AND NEW.is_approved = TRUE THEN
        UPDATE products
        SET
            total_reviews = total_reviews + 1,
            average_rating = (
                SELECT AVG(rating)::DECIMAL(3,2)
                FROM product_reviews
                WHERE product_id = NEW.product_id AND is_approved = TRUE
            )
        WHERE id = NEW.product_id;
    ELSIF TG_OP = 'UPDATE' AND OLD.rating != NEW.rating AND NEW.is_approved = TRUE THEN
        UPDATE products
        SET
            average_rating = (
                SELECT AVG(rating)::DECIMAL(3,2)
                FROM product_reviews
                WHERE product_id = NEW.product_id AND is_approved = TRUE
            )
        WHERE id = NEW.product_id;
    ELSIF TG_OP = 'DELETE' AND OLD.is_approved = TRUE THEN
        UPDATE products
        SET
            total_reviews = GREATEST(0, total_reviews - 1),
            average_rating = (
                SELECT AVG(rating)::DECIMAL(3,2)
                FROM product_reviews
                WHERE product_id = OLD.product_id AND is_approved = TRUE
            )
        WHERE id = OLD.product_id;
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_product_stats_on_review
    AFTER INSERT OR UPDATE OR DELETE ON product_reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_product_rating_stats();

-- =====================================================
-- VIEWS: Useful aggregated views
-- =====================================================

-- User engagement summary view
CREATE VIEW user_engagement_summary AS
SELECT
    u.id AS user_id,
    COUNT(DISTINCT c.id) AS total_check_ins,
    COUNT(DISTINCT c.id) FILTER (WHERE c.check_in_date >= CURRENT_DATE - INTERVAL '7 days') AS check_ins_last_7_days,
    COUNT(DISTINCT c.id) FILTER (WHERE c.check_in_date >= CURRENT_DATE - INTERVAL '30 days') AS check_ins_last_30_days,
    AVG(c.mood_rating) AS average_mood_rating,
    AVG(c.mood_rating) FILTER (WHERE c.check_in_date >= CURRENT_DATE - INTERVAL '7 days') AS avg_mood_last_7_days,
    COUNT(DISTINCT p.id) AS total_purchases,
    COALESCE(SUM(p.total_price_cents), 0) AS total_spent_cents,
    COUNT(DISTINCT n.id) FILTER (WHERE n.opened = TRUE) AS newsletters_opened,
    COUNT(DISTINCT n.id) FILTER (WHERE n.clicked = TRUE) AS newsletters_clicked,
    MAX(c.check_in_date) AS last_check_in_date,
    MAX(n.first_opened_at) AS last_newsletter_open
FROM
    auth.users u
    LEFT JOIN user_check_ins c ON c.user_id = u.id
    LEFT JOIN purchases p ON p.user_id = u.id AND p.purchase_status = 'completed'
    LEFT JOIN newsletter_engagement n ON n.user_id = u.id
GROUP BY u.id;

-- Comments
COMMENT ON VIEW user_engagement_summary IS 'Aggregated user engagement metrics for analytics';

-- =====================================================
-- FUNCTIONS: Helper functions for common operations
-- =====================================================

-- Get user's check-in streak
CREATE OR REPLACE FUNCTION get_check_in_streak(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
    streak INTEGER := 0;
    check_date DATE := CURRENT_DATE;
BEGIN
    -- Count consecutive days from today backwards
    WHILE EXISTS (
        SELECT 1 FROM user_check_ins
        WHERE user_id = p_user_id
        AND check_in_date = check_date
    ) LOOP
        streak := streak + 1;
        check_date := check_date - INTERVAL '1 day';
    END LOOP;

    RETURN streak;
END;
$$ LANGUAGE plpgsql STABLE;

-- Comments
COMMENT ON FUNCTION get_check_in_streak IS 'Calculate consecutive daily check-in streak for a user';

-- Get mood trend (improving/declining/stable)
CREATE OR REPLACE FUNCTION get_mood_trend(p_user_id UUID, p_days INTEGER DEFAULT 7)
RETURNS TEXT AS $$
DECLARE
    recent_avg DECIMAL;
    previous_avg DECIMAL;
    trend TEXT;
BEGIN
    -- Average mood for recent period
    SELECT AVG(mood_rating) INTO recent_avg
    FROM user_check_ins
    WHERE user_id = p_user_id
    AND check_in_date >= CURRENT_DATE - (p_days || ' days')::INTERVAL
    AND check_in_date >= CURRENT_DATE - (p_days / 2 || ' days')::INTERVAL;

    -- Average mood for previous period
    SELECT AVG(mood_rating) INTO previous_avg
    FROM user_check_ins
    WHERE user_id = p_user_id
    AND check_in_date >= CURRENT_DATE - (p_days || ' days')::INTERVAL
    AND check_in_date < CURRENT_DATE - (p_days / 2 || ' days')::INTERVAL;

    IF recent_avg IS NULL OR previous_avg IS NULL THEN
        RETURN 'insufficient_data';
    ELSIF recent_avg > previous_avg + 0.5 THEN
        RETURN 'improving';
    ELSIF recent_avg < previous_avg - 0.5 THEN
        RETURN 'declining';
    ELSE
        RETURN 'stable';
    END IF;
END;
$$ LANGUAGE plpgsql STABLE;

-- Comments
COMMENT ON FUNCTION get_mood_trend IS 'Analyze mood trend over specified days (improving/declining/stable)';

-- =====================================================
-- SEED DATA: Sample products for testing
-- =====================================================

-- Insert sample products (optional - remove in production)
INSERT INTO products (name, slug, description, short_description, product_type, loop_types, price_cents, image_url, is_active, is_featured) VALUES
    (
        'Sleep Loop Solutions Workbook',
        'sleep-loop-workbook',
        'A comprehensive 30-day workbook designed for late-night overthinkers. Learn to calm your racing mind and reclaim your rest.',
        'Designed for sleep loop navigators',
        'digital',
        ARRAY['sleep-loop']::TEXT[],
        2499,
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c',
        TRUE,
        TRUE
    ),
    (
        'Perfectionism Loop Reset Journal',
        'perfectionism-loop-journal',
        'Let go of impossible standards with this guided journal. Features prompts for self-compassion, progress tracking, and reframing perfectionistic thoughts.',
        'Release perfectionism, embrace progress',
        'digital',
        ARRAY['perfectionism-loop']::TEXT[],
        1999,
        'https://images.unsplash.com/photo-1517842645767-c639042777db',
        TRUE,
        TRUE
    ),
    (
        'Decision Loop Clarity Bundle',
        'decision-loop-clarity-bundle',
        'A collection of 12 guided meditations and exercises for decision-makers stuck in analysis paralysis. Find clarity and confidence in your choices.',
        '12 meditations for decision clarity',
        'digital',
        ARRAY['decision-loop']::TEXT[],
        1499,
        'https://images.unsplash.com/photo-1506126613408-eca07ce68773',
        TRUE,
        FALSE
    ),
    (
        'Social Loop Confidence Course',
        'social-loop-confidence-course',
        '21-day challenge with daily micro-actions designed to help you release social anxiety and build authentic confidence in relationships.',
        '21 days to social confidence',
        'digital',
        ARRAY['social-loop']::TEXT[],
        999,
        'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b',
        TRUE,
        FALSE
    ),
    (
        'DailyHush Premium Membership',
        'premium-membership',
        'Unlock advanced insights, premium content, and exclusive community access. Get AI-powered pattern analysis and personalized recommendations.',
        'Premium insights & community',
        'subscription',
        ARRAY['sleep-loop', 'decision-loop', 'social-loop', 'perfectionism-loop']::TEXT[],
        999,
        'https://images.unsplash.com/photo-1522202176988-66273c2fd55f',
        TRUE,
        TRUE
    );

-- =====================================================
-- INDEXES: Additional performance optimizations
-- =====================================================

-- Partial index for active, non-dismissed insights
CREATE INDEX idx_active_insights ON user_insights(user_id, created_at DESC)
    WHERE is_dismissed = FALSE AND (valid_until IS NULL OR valid_until > NOW());

-- Partial index for recent check-ins (most common query)
CREATE INDEX idx_recent_check_ins ON user_check_ins(user_id, check_in_date DESC)
    WHERE check_in_date >= CURRENT_DATE - INTERVAL '90 days';

-- Index for purchase analytics
CREATE INDEX idx_completed_purchases ON purchases(product_id, created_at DESC)
    WHERE purchase_status = 'completed';

-- =====================================================
-- GRANTS: Ensure authenticated users can query
-- =====================================================

-- Grant access to authenticated users
GRANT SELECT ON user_engagement_summary TO authenticated;

-- =====================================================
-- Migration Complete
-- =====================================================

-- Add migration tracking comment
COMMENT ON SCHEMA public IS 'DailyHush Profile Page Schema - Migration 20250101000000';

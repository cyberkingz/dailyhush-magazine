-- Create shopify_orders table to track purchases from Shopify
CREATE TABLE IF NOT EXISTS public.shopify_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shopify_order_id BIGINT UNIQUE NOT NULL,
    order_number INTEGER NOT NULL,
    order_name TEXT NOT NULL,

    -- Customer info
    customer_id BIGINT,
    customer_email TEXT,
    customer_first_name TEXT,
    customer_last_name TEXT,

    -- Order details
    total_price DECIMAL(10, 2) NOT NULL,
    subtotal_price DECIMAL(10, 2),
    total_tax DECIMAL(10, 2),
    currency TEXT NOT NULL DEFAULT 'USD',

    -- Product info (for single product orders)
    product_id BIGINT,
    product_name TEXT,
    product_variant_id BIGINT,
    quantity INTEGER DEFAULT 1,

    -- Order status
    financial_status TEXT,
    fulfillment_status TEXT,

    -- Source tracking
    referring_site TEXT,
    landing_site TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,

    -- Browser/device info
    browser_ip TEXT,
    user_agent TEXT,

    -- Location
    billing_country TEXT,
    billing_province TEXT,
    billing_country_code TEXT,

    -- Timestamps
    order_created_at TIMESTAMPTZ NOT NULL,
    order_processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Raw data
    raw_order_data JSONB
);

-- Create indexes for common queries
CREATE INDEX idx_shopify_orders_shopify_id ON public.shopify_orders(shopify_order_id);
CREATE INDEX idx_shopify_orders_customer_email ON public.shopify_orders(customer_email);
CREATE INDEX idx_shopify_orders_customer_id ON public.shopify_orders(customer_id);
CREATE INDEX idx_shopify_orders_order_created_at ON public.shopify_orders(order_created_at);
CREATE INDEX idx_shopify_orders_utm_campaign ON public.shopify_orders(utm_campaign) WHERE utm_campaign IS NOT NULL;

-- Enable Row Level Security
ALTER TABLE public.shopify_orders ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users (you can restrict this later based on your auth setup)
CREATE POLICY "Authenticated users can view all orders"
    ON public.shopify_orders
    FOR SELECT
    TO authenticated
    USING (true);

-- Allow insert for service role (for n8n webhook)
CREATE POLICY "Service role can insert orders"
    ON public.shopify_orders
    FOR INSERT
    TO service_role
    WITH CHECK (true);

-- Allow insert for authenticated users (if you want to allow manual entry)
CREATE POLICY "Authenticated users can insert orders"
    ON public.shopify_orders
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_shopify_orders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_shopify_orders_updated_at
    BEFORE UPDATE ON public.shopify_orders
    FOR EACH ROW
    EXECUTE FUNCTION update_shopify_orders_updated_at();

-- Add comment
COMMENT ON TABLE public.shopify_orders IS 'Stores Shopify order data for revenue tracking and customer attribution';

# Shopify to Supabase Integration Setup

This guide will help you set up the Shopify → Supabase integration to track orders in your admin dashboard.

## Step 1: Apply the Supabase Migration

Run the migration to create the `shopify_orders` table:

```bash
# Using Supabase CLI
supabase migration up

# Or manually in Supabase Dashboard
# Go to SQL Editor and run: supabase/migrations/007_create_shopify_orders_table.sql
```

## Step 2: Get Your Supabase Credentials

You'll need these for n8n:

1. Go to your Supabase project settings
2. Navigate to API settings
3. Copy:
   - **Project URL** (e.g., `https://xxxxxxxxxxxxx.supabase.co`)
   - **Service Role Key** (needed for n8n to insert data)

⚠️ **Important**: Use the `service_role` key for n8n, not the `anon` key. The service role bypasses RLS policies.

## Step 3: Set Up n8n Supabase Credentials

1. Open your n8n instance
2. Go to **Credentials** → **Add Credential**
3. Search for **Supabase**
4. Fill in:
   - **Host**: Your Supabase project URL
   - **Service Role Secret**: Your service role key
5. Save the credential
6. Copy the credential ID (you'll need it for the workflow)

## Step 4: Import the Workflow

1. Open n8n
2. Click **+ Add Workflow**
3. Click the **⋮** menu → **Import from File**
4. Select: `n8n-workflows/shopify-to-supabase-workflow.json`
5. Update the **Supabase** node:
   - Click on the "Insert to Supabase" node
   - Select your Supabase credential from the dropdown
6. Verify your Shopify and Telegram credentials are connected
7. **Activate** the workflow

## Step 5: Test the Integration

### Method 1: Test Order from Shopify

1. Make a test order on your Shopify store
2. Check n8n executions to see if the workflow ran
3. Check Supabase to verify the order was inserted:

```sql
SELECT * FROM shopify_orders ORDER BY created_at DESC LIMIT 5;
```

### Method 2: Use Pinned Data in n8n

The workflow includes pinned test data. You can:
1. Click the **Shopify Trigger** node
2. Use the pinned data to test without making a real order
3. Manually execute the workflow

## Step 6: Verify in Admin Dashboard

Once orders are in Supabase, you can query them in your admin dashboard:

```typescript
import { getShopifyOrders, getRevenueMetrics } from '@/lib/services/trackingAnalytics'

// Fetch recent orders
const orders = await getShopifyOrders()

// Get revenue metrics
const metrics = await getRevenueMetrics()
```

## Data Captured

The integration captures:

### Order Information
- Order ID, number, and name
- Total price, subtotal, tax
- Currency
- Financial and fulfillment status

### Customer Information
- Email
- First and last name
- Billing country, province, and country code

### Product Information
- Product ID and name
- Variant ID
- Quantity

### Attribution Data
- UTM source, medium, and campaign (parsed from URL)
- Referring site
- Landing page
- Browser IP and user agent

### Raw Data
- Complete Shopify order payload stored as JSONB for debugging

## Troubleshooting

### "Relation does not exist" error
- Make sure you ran the migration in Supabase
- Check that the table was created: `SELECT * FROM shopify_orders LIMIT 1;`

### n8n workflow not triggering
- Verify Shopify webhook is active in your Shopify admin
- Check n8n webhook URL is correct
- Test with pinned data first

### Orders not appearing in Supabase
- Check n8n execution logs for errors
- Verify RLS policies: authenticated users should have SELECT access
- Make sure you're using the service_role key in n8n

### Permission denied errors
- RLS is enabled on the table
- Make sure your user is authenticated when querying
- For n8n, use service_role key which bypasses RLS

## Next Steps

- Add revenue metrics to your Overview dashboard
- Create a dedicated Orders/Revenue view
- Set up alerts for high-value orders
- Track conversion attribution (email → order)

## Security Notes

- ✅ Service role key is kept secret in n8n (never exposed to frontend)
- ✅ RLS is enabled on the orders table
- ✅ Only authenticated users can view orders
- ✅ Raw order data is stored for debugging but can be excluded if needed
- ⚠️ Consider adding admin-only policies if you have multiple user roles

# Leads System Implementation Guide

## Overview

This guide provides a complete implementation of a Supabase-based leads system for capturing email opt-ins from your blog. The system tracks detailed attribution data including source pages, UTM parameters, browser information, and provides analytics for lead conversion.

## Database Schema

### Leads Table Structure

The `leads` table captures comprehensive data for each email opt-in:

```sql
-- Main fields
id (UUID, Primary Key)           - Unique identifier
email (VARCHAR, NOT NULL, UNIQUE) - Email address (unique constraint)
created_at (TIMESTAMPTZ)         - Signup timestamp
updated_at (TIMESTAMPTZ)         - Last update timestamp

-- Attribution tracking
source_url (TEXT)                - Full URL where signup occurred
source_page (VARCHAR)            - Page type (article, home, newsletter, etc.)
referrer_url (TEXT)              - Referrer URL
utm_source (VARCHAR)             - UTM source parameter
utm_medium (VARCHAR)             - UTM medium parameter  
utm_campaign (VARCHAR)           - UTM campaign parameter
utm_term (VARCHAR)               - UTM term parameter
utm_content (VARCHAR)            - UTM content parameter

-- Browser & device data
user_agent (TEXT)                - Full user agent string
browser (VARCHAR)                - Detected browser name
device_type (VARCHAR)            - desktop/mobile/tablet/unknown
ip_address (INET)                - IP address for geolocation
country_code (VARCHAR)           - 2-letter country code

-- Subscription management
is_subscribed (BOOLEAN)          - Current subscription status
confirmed_at (TIMESTAMPTZ)       - Email confirmation timestamp
```

### Indexes for Performance

```sql
-- Essential indexes for query performance
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX idx_leads_source_page ON leads(source_page);
CREATE INDEX idx_leads_utm_source ON leads(utm_source);
CREATE INDEX idx_leads_is_subscribed ON leads(is_subscribed);
```

## Row Level Security (RLS)

The system implements secure RLS policies:

```sql
-- Allow anonymous users to insert leads (for public opt-ins)
CREATE POLICY "Allow anonymous lead creation" ON leads
  FOR INSERT WITH CHECK (true);

-- Allow authenticated users full read access (for admin dashboard)
CREATE POLICY "Allow authenticated users to read leads" ON leads
  FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users to update leads (for subscription management)
CREATE POLICY "Allow authenticated users to update leads" ON leads
  FOR UPDATE USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
```

## Implementation Steps

### 1. Database Setup

**Option A: SQL Editor (Recommended for quick setup)**
1. Open your Supabase dashboard
2. Go to SQL Editor
3. Copy and paste the contents of `supabase/migrations/001_create_leads_table.sql`
4. Click "Run" to execute the migration

**Option B: Migration Files (Recommended for production)**
1. Install Supabase CLI: `npm install -g supabase`
2. Initialize Supabase in your project: `supabase init`
3. Link to your project: `supabase link --project-ref your-project-ref`
4. Apply the migration: `supabase db push`

### 2. Environment Configuration

Ensure your `.env.local` file contains:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Frontend Integration

The system is already integrated into your existing `NewsletterCTA` component with:

- **Form handling**: Captures email with proper validation
- **Loading states**: Shows loading spinner during submission
- **Success feedback**: Displays success message with visual confirmation
- **Error handling**: Shows user-friendly error messages
- **Duplicate detection**: Handles existing email subscriptions gracefully
- **Analytics tracking**: Integrates with Google Analytics (gtag)

### 4. Admin Dashboard Integration

Add the `LeadsManager` component to your admin dashboard:

```tsx
import { LeadsManager } from '../components/admin/LeadsManager'

// In your admin routes
<Route path="/admin/leads" element={<LeadsManager />} />
```

## API Functions

### Core Functions

- `createLead(email, context?)`: Creates new lead with attribution data
- `getLeads(limit?, offset?)`: Retrieves leads with pagination
- `getLeadAnalytics(days?)`: Gets analytics data for specified time period
- `updateLeadSubscription(id, isSubscribed)`: Updates subscription status
- `confirmLeadEmail(id)`: Marks email as confirmed
- `getLeadsBySource(sourcePage?)`: Gets leads filtered by source page

### Analytics Functions

- `detectBrowser(userAgent)`: Parses browser and device information
- `extractUTMParameters(url)`: Extracts UTM parameters from URL
- `getCurrentTrackingContext()`: Gets current page attribution context
- `trackNewsletterSignup(variant)`: Tracks signup event in analytics

## Attribution Tracking

### Automatic Source Detection

The system automatically detects source pages:

- `home`: Homepage (/)
- `article`: Individual blog post (/blog/[slug])
- `blog-index`: Blog listing page (/blog/)
- `category`: Category pages (/categories/[slug])
- `newsletter`: Newsletter page (/newsletter)
- `contact`: Contact page (/contact)
- `about`: About page (/about)

### UTM Parameter Support

Automatically captures all standard UTM parameters:
- `utm_source`: Traffic source (google, facebook, email, etc.)
- `utm_medium`: Marketing medium (cpc, social, email, etc.)
- `utm_campaign`: Campaign name
- `utm_term`: Paid search terms
- `utm_content`: Content variation

### Browser & Device Detection

Automatically detects and stores:
- Browser type (Chrome, Firefox, Safari, Edge, Opera)
- Device type (desktop, mobile, tablet)
- Full user agent string for detailed analysis

## Security Considerations

### RLS Policies
- **Anonymous inserts**: Allows public to create leads
- **Authenticated reads**: Only logged-in users can view leads
- **Authenticated updates**: Only logged-in users can modify leads

### Data Protection
- Email uniqueness enforced at database level
- No sensitive data exposed to frontend
- IP addresses stored for geolocation but not displayed publicly
- GDPR-friendly with subscription management

### Input Validation
- Email validation on frontend and database level
- SQL injection protection through parameterized queries
- XSS protection through React's built-in sanitization

## Analytics & Reporting

### Lead Analytics View

The system includes a `lead_analytics` view for reporting:

```sql
CREATE VIEW lead_analytics AS
SELECT 
  DATE_TRUNC('day', created_at) as date,
  source_page,
  utm_source,
  utm_campaign,
  COUNT(*) as lead_count,
  COUNT(CASE WHEN confirmed_at IS NOT NULL THEN 1 END) as confirmed_count
FROM leads
GROUP BY DATE_TRUNC('day', created_at), source_page, utm_source, utm_campaign
ORDER BY date DESC;
```

### Key Metrics Tracked

- **Total signups**: All email submissions
- **Confirmed leads**: Emails that completed confirmation
- **Conversion rate**: Percentage of confirmed vs. total signups
- **Source attribution**: Performance by page/campaign
- **Time-based trends**: Daily/weekly/monthly signup patterns

## Integration Examples

### Newsletter Signup Form

```tsx
import { NewsletterCTA } from './components/NewsletterCTA'

// Basic usage
<NewsletterCTA />

// Article variant with custom styling
<NewsletterCTA variant="article" centered={true} />
```

### Admin Dashboard

```tsx
import { LeadsManager } from './components/admin/LeadsManager'

// Full-featured admin interface
<LeadsManager />
```

### Custom Lead Creation

```tsx
import { createLead } from './lib/services/leads'

const handleCustomSignup = async (email: string) => {
  const result = await createLead(email, {
    source_page: 'custom-landing',
    utm_params: { utm_source: 'custom-campaign' }
  })
  
  if (result.success) {
    console.log('Lead created:', result.lead)
  }
}
```

## File Structure

```
src/
├── lib/
│   ├── services/
│   │   └── leads.ts              # Lead service functions
│   ├── types/
│   │   └── leads.ts              # TypeScript type definitions
│   ├── utils/
│   │   └── analytics.ts          # Analytics tracking utilities
│   └── supabase.ts              # Supabase client (existing)
├── components/
│   ├── admin/
│   │   └── LeadsManager.tsx      # Admin dashboard component
│   └── NewsletterCTA.tsx         # Updated newsletter component
└── supabase/
    └── migrations/
        └── 001_create_leads_table.sql  # Database migration
```

## Testing the Implementation

### 1. Database Verification
- Check that the `leads` table exists in your Supabase dashboard
- Verify RLS policies are enabled
- Test the `lead_analytics` view

### 2. Frontend Testing
- Submit test emails through newsletter forms
- Verify success/error messages display correctly
- Check that duplicate emails are handled properly
- Test on different devices and browsers

### 3. Admin Dashboard Testing
- Log in as authenticated user
- Verify leads appear in the admin interface
- Test pagination and filtering
- Check analytics calculations

### 4. Analytics Integration Testing
- Submit test signups
- Check that gtag events fire (if Google Analytics is configured)
- Verify attribution data is captured correctly

## Monitoring & Maintenance

### Key Queries for Monitoring

```sql
-- Daily signup trend
SELECT DATE(created_at) as date, COUNT(*) as signups
FROM leads 
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date;

-- Top performing sources
SELECT source_page, COUNT(*) as signups
FROM leads
GROUP BY source_page
ORDER BY signups DESC;

-- Confirmation rates by source
SELECT 
  utm_source,
  COUNT(*) as total_signups,
  COUNT(confirmed_at) as confirmed,
  ROUND(COUNT(confirmed_at) * 100.0 / COUNT(*), 2) as confirmation_rate
FROM leads
GROUP BY utm_source
ORDER BY confirmation_rate DESC;
```

### Regular Maintenance Tasks

- Monitor database size and performance
- Review RLS policies for security
- Archive old lead data if needed
- Update analytics tracking as needed
- Review and optimize database indexes

This implementation provides a robust, scalable foundation for lead capture and attribution tracking that will grow with your blog's needs.
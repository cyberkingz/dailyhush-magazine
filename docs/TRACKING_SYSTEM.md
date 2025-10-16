# User Journey Tracking System

## Overview

Comprehensive analytics tracking system that tracks user behavior across the entire funnel with **email-based user identification** from URL params.

## Architecture

### Data Flow
```
Quiz → Thank You Page → Product Page → Checkout
  ↓         ↓              ↓            ↓
Email   Email Param    Email Param   Purchase
Capture    Tracking       Tracking     Event
```

### Key Features
- ✅ **Email-based user identification** (from URL params)
- ✅ **Scroll depth tracking** (0-100% with milestones)
- ✅ **Section visibility tracking** (which content users read)
- ✅ **Buy button engagement** (views + clicks)
- ✅ **Time on page tracking**
- ✅ **UTM parameter tracking** (retargeting attribution)
- ✅ **Cross-page journey tracking** (email → quiz → thank you → product)

## Database Schema

### Tables Created

#### 1. `thank_you_page_sessions`
Tracks user sessions on the thank you page.

**Key Columns:**
- `session_id` - Unique session identifier
- `email` - User email from URL params (`?email=user@example.com`)
- `quiz_submission_id` - Links to quiz completion
- `quiz_score` - User's quiz score
- `max_scroll_depth` - Furthest scroll percentage (0-100)
- `clicked_buy_button` - Whether user clicked buy
- `utm_*` - Campaign attribution

**Insights You Can Get:**
- Which quiz scores convert best?
- How far do users scroll before bouncing?
- Which UTM campaigns drive the most engaged users?
- Individual user journey: email → quiz score → scroll depth → buy click

#### 2. `thank_you_page_events`
Tracks individual events on thank you page.

**Event Types:**
- `page_view` - Initial page load
- `scroll_depth` - Milestone hit (25%, 50%, 75%, 90%, 100%)
- `section_view` - User scrolled to specific section
- `buy_button_view` - Buy button entered viewport
- `buy_button_click` - User clicked buy button
- `page_exit` - User left page

**Insights You Can Get:**
- Exactly when users click buy (time since page load)
- Which sections get the most engagement?
- Where do users drop off?
- How long before first buy button click?

#### 3. `product_page_sessions`
Tracks user sessions on product pages (F.I.R.E. Protocol).

**Key Columns:**
- `session_id` - Unique session identifier
- `email` - User email from retargeting emails
- `product_id` - Product identifier (e.g., 'fire-starter')
- `max_scroll_depth` - Furthest scroll percentage
- `clicked_buy_button` - Whether user clicked buy
- `viewed_price` - Whether user saw pricing
- `utm_*` - Retargeting email attribution

**Insights You Can Get:**
- Which retargeting emails drive conversions?
- Do users from retargeting emails scroll more/less?
- Which users saw the price but didn't buy?
- Individual user: email → retargeting campaign → engagement → purchase

#### 4. `product_page_events`
Tracks individual events on product pages.

**Event Types:**
- `page_view` - Initial page load
- `scroll_depth` - Scroll milestones
- `section_view` - Specific section viewed
- `buy_button_view` - Buy button visibility
- `buy_button_click` - Buy button clicked
- `price_viewed` - Price section viewed
- `faq_expand` - FAQ question opened
- `page_exit` - User left page

**Insights You Can Get:**
- Which FAQs are most clicked?
- How long before users see pricing?
- Do users who expand FAQs convert better?
- Exact time to purchase decision

## How Email Tracking Works

### URL Parameter Format
```
# Thank You Page (from quiz)
/thank-you?email=sarah@example.com&score=8&type=Overthinkaholic

# Product Page (from retargeting email)
/product/fire-starter?email=sarah@example.com&utm_source=email&utm_campaign=retargeting_day3
```

### User Journey Example
```
Day 1:
- Sarah takes quiz
- Gets quiz result page at /thank-you?email=sarah@example.com
- Scroll depth: 75%
- Views buy button but doesn't click
- Session captured: email, quiz score, scroll depth

Day 3:
- Sarah receives retargeting email
- Clicks link: /product/fire-starter?email=sarah@example.com&utm_campaign=retargeting_day3
- Scroll depth: 100%
- Clicks buy button at 3min 42sec
- Purchase tracked with email attribution

Result:
You can now see Sarah's full journey:
- Quiz score: 8/10 (Overthinkaholic)
- Thank you page engagement: 75% scroll, viewed buy button
- Retargeting email: Day 3 email worked
- Product page: 100% scroll, purchased after 3min 42sec
```

## Implementation

### 1. Install Dependencies
Already installed - uses existing Supabase client.

### 2. Run Migration
```bash
# Apply database migration
supabase migration up
```

### 3. Integrate into Thank You Page

```typescript
import { useEffect, useRef } from 'react';
import { useScrollDepth } from '../hooks/useScrollDepth';
import {
  trackThankYouPageView,
  trackScrollDepth,
  trackSectionView,
  trackBuyButtonClick,
  trackBuyButtonView,
  trackPageExit,
} from '../lib/services/thankYouPageEvents';

export function ThankYouPage() {
  const sessionIdRef = useRef<string>();
  const pageLoadTime = useRef(Date.now());

  // Initialize tracking on page load
  useEffect(() => {
    trackThankYouPageView({
      submissionId: quizSubmissionId,
      score: quizScore,
      type: quizType,
    }).then((sessionId) => {
      sessionIdRef.current = sessionId;
    });

    // Track page exit
    const handleBeforeUnload = () => {
      if (sessionIdRef.current) {
        const timeOnPage = Date.now() - pageLoadTime.current;
        trackPageExit(sessionIdRef.current, timeOnPage);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Track scroll depth
  const { scrollDepth } = useScrollDepth({
    milestones: [25, 50, 75, 90, 100],
    onMilestone: (milestone) => {
      if (sessionIdRef.current) {
        const timeSincePageLoad = Date.now() - pageLoadTime.current;
        trackScrollDepth(sessionIdRef.current, milestone, timeSincePageLoad);
      }
    },
  });

  // Track buy button click
  const handleBuyClick = (buttonLocation: string) => {
    if (sessionIdRef.current) {
      const timeSincePageLoad = Date.now() - pageLoadTime.current;
      trackBuyButtonClick(sessionIdRef.current, timeSincePageLoad, buttonLocation);
    }

    // Continue with normal buy flow
    window.location.href = 'https://checkout.com/...';
  };

  return (
    <div>
      {/* Your content */}
      <button onClick={() => handleBuyClick('hero')}>
        Get F.I.R.E. Protocol - $67
      </button>
    </div>
  );
}
```

### 4. Integrate into Product Page

```typescript
import { useEffect, useRef } from 'react';
import { useScrollDepth } from '../hooks/useScrollDepth';
import {
  trackProductPageView,
  trackScrollDepth,
  trackBuyButtonClick,
  trackPriceViewed,
  trackFaqExpand,
  trackPageExit,
} from '../lib/services/productPageEvents';

export function FireStarterPage() {
  const sessionIdRef = useRef<string>();
  const pageLoadTime = useRef(Date.now());

  // Initialize tracking
  useEffect(() => {
    trackProductPageView('fire-starter').then((sessionId) => {
      sessionIdRef.current = sessionId;
    });

    // Track page exit
    const handleBeforeUnload = () => {
      if (sessionIdRef.current) {
        const timeOnPage = Date.now() - pageLoadTime.current;
        trackPageExit(sessionIdRef.current, timeOnPage);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Track scroll depth
  useScrollDepth({
    milestones: [25, 50, 75, 90, 100],
    onMilestone: (milestone) => {
      if (sessionIdRef.current) {
        const timeSincePageLoad = Date.now() - pageLoadTime.current;
        trackScrollDepth(sessionIdRef.current, milestone, timeSincePageLoad);
      }
    },
  });

  // Track buy button click
  const handleBuyClick = (buttonLocation: string) => {
    if (sessionIdRef.current) {
      const timeSincePageLoad = Date.now() - pageLoadTime.current;
      trackBuyButtonClick(sessionIdRef.current, timeSincePageLoad, buttonLocation);
    }

    // Continue with checkout
    window.location.href = checkoutUrl;
  };

  return <div>{/* Your product page */}</div>;
}
```

## Analytics Queries

### 1. User Journey from Email
```sql
-- See full journey for a specific user email
SELECT
  ty.email,
  ty.quiz_score,
  ty.quiz_type,
  ty.max_scroll_depth as thank_you_scroll,
  ty.clicked_buy_button as thank_you_clicked,
  pp.utm_campaign as retargeting_campaign,
  pp.max_scroll_depth as product_scroll,
  pp.clicked_buy_button as product_clicked,
  pp.time_on_page_ms / 1000 as product_time_seconds
FROM thank_you_page_sessions ty
LEFT JOIN product_page_sessions pp ON ty.email = pp.email
WHERE ty.email = 'sarah@example.com'
ORDER BY ty.created_at DESC;
```

### 2. Retargeting Email Performance
```sql
-- Which retargeting campaigns drive conversions?
SELECT
  utm_campaign,
  COUNT(*) as total_visits,
  COUNT(*) FILTER (WHERE clicked_buy_button = true) as conversions,
  ROUND(AVG(max_scroll_depth)) as avg_scroll_depth,
  ROUND(AVG(time_on_page_ms) / 1000) as avg_time_seconds
FROM product_page_sessions
WHERE email IS NOT NULL  -- Only retargeting traffic
  AND utm_campaign IS NOT NULL
GROUP BY utm_campaign
ORDER BY conversions DESC;
```

### 3. Scroll Depth vs. Conversion
```sql
-- Do users who scroll more convert better?
SELECT
  CASE
    WHEN max_scroll_depth < 25 THEN '0-25%'
    WHEN max_scroll_depth < 50 THEN '25-50%'
    WHEN max_scroll_depth < 75 THEN '50-75%'
    WHEN max_scroll_depth < 90 THEN '75-90%'
    ELSE '90-100%'
  END as scroll_range,
  COUNT(*) as sessions,
  COUNT(*) FILTER (WHERE clicked_buy_button = true) as conversions,
  ROUND(100.0 * COUNT(*) FILTER (WHERE clicked_buy_button = true) / COUNT(*), 1) as conversion_rate
FROM thank_you_page_sessions
GROUP BY scroll_range
ORDER BY MIN(max_scroll_depth);
```

### 4. Time to Purchase Decision
```sql
-- How long before users click buy?
SELECT
  email,
  event_type,
  time_since_page_load_ms / 1000 as seconds_on_page,
  metadata->>'button_location' as button_location
FROM product_page_events
WHERE event_type = 'buy_button_click'
ORDER BY time_since_page_load_ms
LIMIT 20;
```

### 5. Quiz Score vs. Conversion
```sql
-- Which quiz scores convert best?
SELECT
  quiz_score,
  quiz_type,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE clicked_buy_button = true) as conversions,
  ROUND(100.0 * COUNT(*) FILTER (WHERE clicked_buy_button = true) / COUNT(*), 1) as conversion_rate
FROM thank_you_page_sessions
WHERE quiz_score IS NOT NULL
GROUP BY quiz_score, quiz_type
ORDER BY quiz_score DESC;
```

### 6. Section Engagement
```sql
-- Which sections get the most views?
SELECT
  section_id,
  COUNT(*) as views,
  COUNT(DISTINCT session_id) as unique_sessions,
  ROUND(AVG(time_since_page_load_ms) / 1000, 1) as avg_time_to_view_seconds
FROM thank_you_page_events
WHERE event_type = 'section_view'
GROUP BY section_id
ORDER BY views DESC;
```

## Privacy & GDPR Compliance

### Email Storage
- Emails are stored **only if provided in URL params**
- Users control whether to include email in URL
- Email is **optional** - anonymous tracking still works

### Data Retention
```sql
-- Delete sessions older than 90 days
DELETE FROM thank_you_page_sessions
WHERE created_at < NOW() - INTERVAL '90 days';

DELETE FROM product_page_sessions
WHERE created_at < NOW() - INTERVAL '90 days';
```

### User Data Deletion
```sql
-- Delete all data for a specific user
DELETE FROM thank_you_page_sessions WHERE email = 'user@example.com';
DELETE FROM thank_you_page_events WHERE email = 'user@example.com';
DELETE FROM product_page_sessions WHERE email = 'user@example.com';
DELETE FROM product_page_events WHERE email = 'user@example.com';
```

## Key Insights You'll Get

### Individual User Level
- ✅ Complete journey from quiz → thank you → product → purchase
- ✅ Quiz score and type for each user
- ✅ Exact engagement patterns (scroll depth, time on page)
- ✅ Which retargeting email converted them
- ✅ Time to purchase decision

### Aggregate Level
- ✅ Which quiz scores convert best?
- ✅ Which retargeting emails drive most conversions?
- ✅ Optimal scroll depth for conversions
- ✅ Average time to purchase decision
- ✅ Most engaging sections
- ✅ Drop-off points in funnel

### Retargeting Optimization
- ✅ Which day-X emails work best?
- ✅ Do retargeting users behave differently?
- ✅ Which UTM campaigns drive quality traffic?
- ✅ Email → campaign → conversion attribution

## Next Steps

1. **Run Migration**: Apply database schema
2. **Integrate Tracking**: Add to thank you page and product page
3. **Test**: Visit pages with `?email=test@example.com` param
4. **Verify**: Check Supabase tables for data
5. **Build Dashboard**: Create admin analytics view
6. **Optimize**: Use insights to improve funnel

## Support

For questions or issues:
- Check Supabase logs for errors
- Verify RLS is disabled on analytics tables
- Confirm email URL param format is correct
- Test with browser console open to see tracking logs

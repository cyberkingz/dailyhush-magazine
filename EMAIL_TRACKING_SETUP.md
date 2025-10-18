# Email Retargeting Tracking Setup

## Overview
All post-quiz email CTAs now include comprehensive tracking parameters that are automatically captured and displayed in your admin dashboard at `/admin/dashboard`.

## Tracking Parameters

### URL Structure
All email CTAs use this format:
```
https://daily-hush.com/product/fire-starter?utm_source=email&utm_medium=retargeting&utm_campaign=quiz-retargeting&utm_content=day-X&email={{EMAIL}}
```

### Parameter Breakdown

| Parameter | Value | Purpose |
|-----------|-------|---------|
| `utm_source` | `email` | Identifies traffic source as email |
| `utm_medium` | `retargeting` | Identifies this as retargeting traffic (vs cold email) |
| `utm_campaign` | `quiz-retargeting` | Campaign name for grouping |
| `utm_content` | `day-1`, `day-3`, `day-5`, `day-7` | Identifies which email in the sequence |
| `email` | `{{EMAIL}}` | User's email address for attribution |

## Email Sequence Tracking

### Day 1 - Quiz Follow-Up
- **utm_content**: `day-1`
- **CTA**: "Get F.I.R.E. Protocol Now → $67"
- **Tracks**: Initial interest from quiz-takers

### Day 3 - Pattern Recognition
- **utm_content**: `day-3`
- **CTA**: "Get F.I.R.E. Protocol → $67"
- **Badge**: "4 DAYS LEFT AT $67"
- **Tracks**: Mid-sequence engagement

### Day 5 - Risk Reversal
- **utm_content**: `day-5`
- **CTA**: "Try F.I.R.E. Risk-Free → $67"
- **Badge**: "2 DAYS LEFT AT $67"
- **Tracks**: Objection handling effectiveness

### Day 7 - Final Urgency
- **utm_content**: `day-7`
- **CTA**: "Get F.I.R.E. Before Midnight → $67"
- **Badge**: "FINAL HOURS AT $67"
- **Tracks**: Urgency-driven conversions

## How to View Analytics

### 1. Access Admin Dashboard
Navigate to: **https://daily-hush.com/admin/dashboard**

### 2. Select "Product Page" Tab
Click the "Product Page" tab to view product-specific analytics

### 3. Set Date Range
Use the date picker to filter data by time period

### 4. View Metrics

#### Key Performance Indicators (KPIs)
- **Total Sessions**: Total product page visits
  - Shows "X from retargeting" in subtitle
- **Conversion Rate**: % of visitors who clicked buy button
- **Revenue Per Visitor**: Average revenue generated per session
- **Avg Time on Page**: Engagement duration
- **Avg Scroll Depth**: % of page viewed

#### Retargeting Campaign Performance Table
This table shows performance BY EMAIL (day-1, day-3, day-5, day-7):

| Column | What It Shows |
|--------|--------------|
| **Campaign** | Which email (day-1, day-3, day-5, day-7) |
| **Sessions** | Number of clicks from that email |
| **Conversions** | Number of buy button clicks |
| **Conv. Rate** | Conversion % for that specific email |
| **Avg Scroll** | Average scroll depth (engagement) |
| **Avg Time** | Time spent on page (engagement) |

#### Revenue Metrics
- **Total Revenue**: Revenue from product page visitors
- **Orders**: Completed purchases
- **Avg Order Value**: Average purchase amount
- **Revenue Per Visitor**: ROI indicator for retargeting

## Data Automatically Tracked

The system automatically captures:

### Session Level
- Email address (from URL param)
- UTM parameters
- Browser & device type
- Referrer URL
- User agent
- Max scroll depth
- Time on page
- Whether they clicked buy button
- Whether they viewed pricing

### Event Level
- Page views
- Scroll depth milestones (25%, 50%, 75%, 90%, 100%)
- Section views
- Buy button clicks
- Buy button views
- Price views
- FAQ expansions
- Page exit

## Database Tables

### `product_page_sessions`
Stores one row per unique session with:
- session_id
- email (from URL param)
- product_id
- utm_source, utm_medium, utm_campaign, utm_content
- browser, device_type
- max_scroll_depth
- time_on_page_ms
- clicked_buy_button (boolean)
- created_at, updated_at

### `product_page_events`
Stores individual events with:
- session_id (links to session)
- email (for quick filtering)
- event_type
- scroll_depth
- time_since_page_load_ms
- metadata (JSON)
- created_at

## Analysis You Can Do

### Email Performance Comparison
Compare conversion rates across all 4 emails to see which performs best:
- Day 1 vs Day 3 vs Day 5 vs Day 7
- Which urgency level works best?
- Which CTA copy converts better?

### Time-to-Convert Analysis
Track when in the sequence people convert:
- Do they buy on Day 1 or wait until urgency increases?
- Optimize send timing based on data

### Engagement Metrics
See which emails drive the most engagement:
- Avg scroll depth by email
- Time on page by email
- Which email gets people to explore the most?

### ROI by Email
Calculate revenue per email sent:
- Revenue Per Visitor by utm_content
- Identify which emails are worth sending

### Drop-off Analysis
Find where the funnel leaks:
- Sessions → Price Views → Buy Button Clicks
- Optimize underperforming emails

## Next Steps After Launch

### Week 1-2: Baseline Data Collection
- Let the sequence run
- Collect at least 100 sessions per email
- Don't make changes yet

### Week 3: Initial Analysis
Compare performance:
```
Day 1 Conv Rate: X%
Day 3 Conv Rate: Y%
Day 5 Conv Rate: Z%
Day 7 Conv Rate: W%
```

### Week 4+: Iterative Optimization
Based on data, test:
- Different CTAs for low-converting emails
- Different send timing
- Adding/removing urgency elements
- A/B testing subject lines (if your ESP supports it)

## Example Queries You Can Answer

1. **Which email drives the most revenue?**
   - Filter by utm_content, sum revenue

2. **What % of Day 7 clickers actually buy?**
   - Conversion rate for utm_content=day-7

3. **Do retargeting emails engage better than cold traffic?**
   - Compare sessions with email param vs without

4. **What's the average time between email click and purchase?**
   - Time difference between session creation and buy button click

5. **Which email do people spend the most time reading?**
   - Avg time on page by utm_content

## Technical Implementation

The tracking is handled by:
- **Frontend**: `/src/lib/services/productPageEvents.ts`
  - Extracts URL params on page load
  - Creates session in database
  - Tracks all events
- **Backend**: Supabase tables
  - `product_page_sessions`
  - `product_page_events`
- **Dashboard**: `/src/components/admin/tracking/ProductPageView.tsx`
  - Queries data
  - Calculates metrics
  - Displays visualizations

No additional setup required - it's all automatic!

## Testing

To test tracking:
1. Copy one of the email HTML files
2. Replace `{{EMAIL}}` with `test@example.com`
3. Open the email HTML in browser
4. Click the CTA
5. Check admin dashboard - you should see:
   - New session with email=test@example.com
   - utm_campaign=quiz-retargeting
   - utm_content=day-X

## Support

If tracking data isn't appearing:
1. Check browser console for errors
2. Verify Supabase connection
3. Check `/admin/dashboard` → Product Page tab
4. Ensure date range includes today
5. Look for sessions with email parameter
